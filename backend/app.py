import os, sys, base64, io, copy, itertools, socket
from collections import deque
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (one level up from backend/)
_ROOT_ENV = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=_ROOT_ENV)

import numpy as np
import pandas as pd
from PIL import Image
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    HandLandmarker,
    HandLandmarkerOptions,
    RunningMode,
)
from tensorflow import keras
import string

# --- Config -------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MAITREE_MODEL_PATH = os.path.join(SCRIPT_DIR, "ml_pipeline", "signbridge_model_v1.h5")
HAND_LANDMARKER_PATH = os.path.join(SCRIPT_DIR, "models", "hand_landmarker.task")

# Classes: digits 1-9 then A-Z  (35 classes)
CLASS_LABELS = [str(i) for i in range(1, 10)] + list(string.ascii_uppercase)
# ------------------------------------------------------------------------------

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Vite dev server (port 3000)

# --- Load ISL classifier model (TensorFlow Keras) ----------------------------
print("Loading custom 250-sample 42-feature landmark model (TensorFlow Keras) ...")
model = keras.models.load_model(MAITREE_MODEL_PATH)
print("TensorFlow model loaded successfully from %s" % MAITREE_MODEL_PATH)

# --- MediaPipe Hand Landmarker (Tasks API) ------------------------------------
print("Loading MediaPipe HandLandmarker ...")
hand_options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=HAND_LANDMARKER_PATH),
    running_mode=RunningMode.IMAGE,
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
)
hand_landmarker = HandLandmarker.create_from_options(hand_options)
print("MediaPipe HandLandmarker ready (num_hands=2)")


# --- Landmark processing (identical to maitree isl_detection.py) --------------
def calc_landmark_list(image_width, image_height, hand_landmarks):
    landmark_point = []
    for lm in hand_landmarks:
        landmark_x = min(int(lm.x * image_width), image_width - 1)
        landmark_y = min(int(lm.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point


def pre_process_landmark(landmark_list):
    """
    Normalize landmarks to relative coords relative to wrist (landmark 0), then scale by max absolute.
    Matches maitree 250-sample model's exact preprocessing.
    """
    if not landmark_list:
        return [0.0] * 42  # 21 points * 2 coords = 42

    temp = copy.deepcopy(landmark_list)

    # Convert to relative coordinates (wrist = origin)
    base_x, base_y = temp[0][0], temp[0][1]
    for i in range(len(temp)):
        temp[i][0] -= base_x
        temp[i][1] -= base_y

    # Flatten to 1D
    flat = list(itertools.chain.from_iterable(temp))

    # Normalize by max absolute value
    max_val = max(map(abs, flat))
    if max_val > 0:
        flat = [v / max_val for v in flat]

    return flat


# Rolling prediction buffer for temporal stability (eliminates single-frame classification flicker)
PREDICTION_WINDOW_SIZE = 5
prediction_history = deque(maxlen=PREDICTION_WINDOW_SIZE)

def process_image(img_pil):
    """
    Run MediaPipe on image, extract 42 relative features for the primary hand.
    Applies temporal moving-average smoothing over recent frames for rock-solid stability.
    Returns (label, confidence, top3, frontend_landmarks) or None if no hand detected.
    """
    global prediction_history

    img_rgb = np.array(img_pil.convert("RGB"))
    image_height, image_width = img_rgb.shape[:2]

    # Create MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

    # Detect hands
    result = hand_landmarker.detect(mp_image)

    if not result.hand_landmarks or len(result.hand_landmarks) == 0:
        prediction_history.clear()
        return None

    # Use primary detected hand for classification (42 features)
    primary_hand = result.hand_landmarks[0]
    landmark_point = calc_landmark_list(image_width, image_height, primary_hand)
    features_42 = pre_process_landmark(landmark_point)

    # Extract all detected hands for frontend visual skeleton overlay
    frontend_landmarks = {"left": [], "right": []}
    for i in range(len(result.hand_landmarks)):
        hand_lms = result.hand_landmarks[i]
        label_str = result.handedness[i][0].category_name
        coords = [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_lms]
        if label_str == "Left":
            frontend_landmarks["left"] = coords
        elif label_str == "Right":
            frontend_landmarks["right"] = coords

    # Predict (TensorFlow Keras model prediction)
    df = pd.DataFrame([features_42])
    raw_probs = model.predict(df, verbose=0)[0]

    # Apply temporal moving-average smoothing across sliding window
    prediction_history.append(raw_probs)
    smoothed_probs = np.mean(prediction_history, axis=0)

    idx = int(np.argmax(smoothed_probs))
    confidence = float(smoothed_probs[idx])
    label = CLASS_LABELS[idx]
    
    # Top 3
    top3_idx = np.argsort(smoothed_probs)[-3:][::-1]
    top3 = [{"label": CLASS_LABELS[i], "conf": float(smoothed_probs[i])} for i in top3_idx]
    
    return label, confidence, top3, frontend_landmarks


# --- Routes -------------------------------------------------------------------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model": "signbridge_model_v1 (84-keypoint MLP, 35 classes)",
        "ai_available": ai_available if 'ai_available' in dir() else False
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    img_b64 = data.get("image", "")

    # Decode base64 -> PIL image
    try:
        header, encoded = img_b64.split(",", 1) if "," in img_b64 else ("", img_b64)
        img_bytes = base64.b64decode(encoded)
        img_pil = Image.open(io.BytesIO(img_bytes))
    except Exception as e:
        return jsonify({"error": "Bad image: %s" % e}), 400

    result = process_image(img_pil)

    if result is None:
        return jsonify({"error": "No hand detected", "label": "?", "confidence": 0, "top3": [], "landmarks": None})

    label, confidence, top3, landmarks = result
    return jsonify({
        "label": label,
        "confidence": round(confidence, 3),
        "top3": top3,
        "landmarks": landmarks
    })

# --- AI Brain (Gemini API) ----------------------------------------------------
try:
    import google.generativeai as genai
    
    if "GEMINI_API_KEY" in os.environ:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        ai_available = True
    else:
        ai_available = False
        print("WARNING: GEMINI_API_KEY not found in environment. AI Brain will be disabled.")
except ImportError:
    ai_available = False
    print("WARNING: google-generativeai not installed. AI Brain will be disabled.")

@app.route("/api/suggest", methods=["POST"])
def suggest_sentence():
    data = request.get_json(force=True)
    text = data.get("text", "")
    
    if not text.strip():
        return jsonify({"suggested": ""})
        
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"suggested": text.capitalize() + "."})

        prompt = (
            f"You are a smart Google Keyboard (Gboard) style autocorrect and grammar assistant for Sign Language.\n"
            f"The user has accumulated the following raw recognized letters or words from hand gestures: '{text}'.\n\n"
            f"Your Task:\n"
            f"1. If the input contains misspelled words or jumbled letters (for example: 'HELLZ' -> 'Hello', 'THNK' -> 'Thank you', 'WRLD' -> 'World'), autocorrect the spelling.\n"
            f"2. If the input contains a sequence of sign words (for example: 'I GO MARKET YESTERDAY' -> 'I went to the market yesterday.'), convert it into a natural, grammatically correct English sentence.\n"
            f"3. Output ONLY the final corrected word or natural English sentence. Do NOT use quotation marks, explanations, or extra text."
        )

        # 1. Try direct REST API with current Gemini 3.6 Flash endpoint
        for model_name in ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest']:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                res = requests.post(url, json={'contents': [{'parts': [{'text': prompt}]}]}, timeout=25).json()
                if 'candidates' in res and len(res['candidates']) > 0:
                    text_out = res['candidates'][0]['content']['parts'][0]['text'].strip().strip('"').strip("'")
                    if text_out:
                        return jsonify({"suggested": text_out})
            except Exception as req_err:
                print(f"REST call {model_name} failed: {req_err}")
                continue

        # 2. SDK Fallback
        if genai_module_available:
            genai.configure(api_key=api_key)
            for model_name in ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-1.5-flash']:
                try:
                    m = genai.GenerativeModel(model_name)
                    r = m.generate_content(prompt)
                    if r and r.text:
                        return jsonify({"suggested": r.text.strip().strip('"').strip("'")})
                except Exception:
                    continue

        return jsonify({"suggested": text.capitalize() + "."})
    except Exception as e:
        print(f"AI Suggestion Error: {e}")
        return jsonify({"suggested": text.capitalize() + "."})


# --- Utilities ----------------------------------------------------------------
def get_local_ip():
    """Get the machine's local network IP."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


# --- Main ---------------------------------------------------------------------
if __name__ == "__main__":
    local_ip = get_local_ip()
    port = 5000

    # Try HTTPS with pyopenssl adhoc cert (Flask/Werkzeug built-in)
    use_https = False
    try:
        import OpenSSL  # noqa: F401
        use_https = True
    except ImportError:
        import subprocess
        print("Installing pyopenssl for HTTPS mobile support ...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "pyopenssl", "-q"],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            use_https = True
            print("pyopenssl installed")
        else:
            print("WARNING: Could not install pyopenssl, HTTPS unavailable")

    print("")
    print("=" * 60)
    print("  ISL SignBridge -- Landmark Model Server")
    print("=" * 60)

    if use_https:
        print("  Desktop:  https://localhost:%d" % port)
        print("  Mobile:   https://%s:%d" % (local_ip, port))
        print("=" * 60)
        print("  NOTE: On mobile, accept the security warning")
        print("        (self-signed certificate)")
        print("=" * 60)
        print("")
        app.run(host="0.0.0.0", port=5000, debug=False)
    else:
        print("  Desktop:  http://localhost:%d" % port)
        print("=" * 60)
        print("")
        app.run(host="0.0.0.0", port=5000, debug=False)
