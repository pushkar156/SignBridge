"""
ISL Web App - Landmark-Based Flask Backend
===========================================
Uses the maitree model (landmark classifier: 42 features -> 35 classes)
instead of the bros CNN (image-based, broken on real webcam input).

Pipeline:
  1. Receive base64 hand-crop image from browser
  2. Run MediaPipe HandLandmarker (Tasks API) server-side -> extract 21 landmarks
  3. Normalize landmarks (relative coords, scale to [-1, 1])
  4. Classify with maitree model.h5
  5. Return label + confidence + top-3

Mobile support:
  - Binds to 0.0.0.0 (accessible on local network)
  - Generates self-signed HTTPS cert (required for getUserMedia on mobile)

Run:
    python app_landmark.py
Then open:
    Desktop:  https://localhost:5000
    Mobile:   https://<your-pc-ip>:5000
"""

import os, sys, base64, io, copy, itertools, socket
from dotenv import load_dotenv
load_dotenv() # Load GEMINI_API_KEY from .env

import numpy as np
import pandas as pd
from PIL import Image
from flask import Flask, request, jsonify, render_template
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
# Both models are now housed directly under src/
MAITREE_MODEL_PATH = os.path.join(SCRIPT_DIR, "ml_pipeline", "signbridge_model_v1.h5")
HAND_LANDMARKER_PATH = os.path.join(SCRIPT_DIR, "models", "hand_landmarker.task")

# Classes: digits 1-9 then A-Z  (35 classes)
CLASS_LABELS = [str(i) for i in range(1, 10)] + list(string.ascii_uppercase)
# ------------------------------------------------------------------------------

app = Flask(__name__)

# --- Load ISL classifier model ------------------------------------------------
print("Loading custom 84-feature landmark model ...")
model = keras.models.load_model(MAITREE_MODEL_PATH)
print("Model loaded  (input: %s, output: %s)" % (model.input_shape, model.output_shape))

# --- MediaPipe Hand Landmarker (Tasks API) ------------------------------------
print("Loading MediaPipe HandLandmarker ...")
hand_options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=HAND_LANDMARKER_PATH),
    running_mode=RunningMode.IMAGE,
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)
hand_landmarker = HandLandmarker.create_from_options(hand_options)
print("MediaPipe HandLandmarker ready (num_hands=2)")


# --- Landmark processing (identical to maitree isl_detection.py) --------------
def calc_landmark_list(image_width, image_height, hand_landmarks):
    """Extract pixel-coordinate landmarks from HandLandmarker results."""
    landmark_point = []
    for lm in hand_landmarks:
        landmark_x = min(int(lm.x * image_width), image_width - 1)
        landmark_y = min(int(lm.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point


def pre_process_landmark(landmark_list):
    """
    Normalize landmarks to relative coords, then scale to [-1, 1].
    Exactly mirrors maitree model's preprocessing.
    """
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


def process_image(img_pil):
    """
    Run MediaPipe on image, extract 84 features (Left + Right hands).
    Pads with zeros if a hand is missing.
    Returns (label, confidence, top3) or None if no hand detected.
    """
    img_rgb = np.array(img_pil.convert("RGB"))
    image_height, image_width = img_rgb.shape[:2]

    # Create MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

    # Detect hands
    result = hand_landmarker.detect(mp_image)

    if not result.hand_landmarks or len(result.hand_landmarks) == 0:
        return None

    left_hand_raw = []
    right_hand_raw = []

    # Loop through detected hands (up to 2)
    for i in range(len(result.hand_landmarks)):
        hand_lms = result.hand_landmarks[i]
        label = result.handedness[i][0].category_name
        
        landmark_point = []
        for lm in hand_lms:
            landmark_x = min(int(lm.x * image_width), image_width - 1)
            landmark_y = min(int(lm.y * image_height), image_height - 1)
            landmark_point.append([landmark_x, landmark_y])
            
        if label == "Left":
            left_hand_raw = landmark_point
        elif label == "Right":
            right_hand_raw = landmark_point
            
    # Normalize and pad
    left_processed = pre_process_landmark(left_hand_raw)
    right_processed = pre_process_landmark(right_hand_raw)
    
    # Combined 84 feature vector
    features = left_processed + right_processed
    
    # Needs shape (1, 84)
    df = pd.DataFrame([features])

    # Predict
    probs = model.predict(df, verbose=0)[0]
    idx = int(np.argmax(probs))
    label = CLASS_LABELS[idx]
    confidence = float(probs[idx])

    # Top-3
    top3_idx = np.argsort(probs)[::-1][:3]
    top3 = [
        {"label": CLASS_LABELS[i], "conf": round(float(probs[i]), 3)}
        for i in top3_idx
    ]

    return label, confidence, top3


# --- Routes -------------------------------------------------------------------
@app.route("/")
def index():
    return render_template("index.html")


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
        return jsonify({"error": "No hand detected", "label": "?", "confidence": 0, "top3": []})

    label, confidence, top3 = result
    return jsonify({
        "label": label,
        "confidence": round(confidence, 3),
        "top3": top3,
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
        
    if not ai_available:
        # Fallback to dumb capitalization if API is missing
        return jsonify({"suggested": text.capitalize() + "."})
        
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"You are a smart sign language assistant. The user has signed the following raw sequence of letters or words: '{text}'. Correct any grammar, spelling, or spacing, and output ONLY the single most likely natural English sentence they meant. Do not add any extra text or quotes."
        response = model.generate_content(prompt)
        return jsonify({"suggested": response.text.strip()})
    except Exception as e:
        print(f"AI Suggestion Error: {e}")
        return jsonify({"suggested": text + " (AI Error)"})


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
        app.run(host="0.0.0.0", port=port, debug=False, ssl_context="adhoc")
    else:
        print("  Desktop:  http://localhost:%d" % port)
        print("  Mobile:   N/A (HTTPS required for camera)")
        print("=" * 60)
        print("")
        app.run(host="0.0.0.0", port=port, debug=False)
