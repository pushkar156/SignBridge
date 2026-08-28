import os
import cv2
import csv
import copy
import itertools
import string
import numpy as np
from tqdm import tqdm
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    HandLandmarker,
    HandLandmarkerOptions,
    RunningMode,
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))

DATASET_DIR = os.path.join(PROJECT_ROOT, "Dataset", "English")
CSV_PATH = os.path.join(SCRIPT_DIR, "dataset.csv")
MODEL_ASSET_PATH = os.path.join(PROJECT_ROOT, "src", "models", "hand_landmarker.task")

# Classes: digits 1-9 then A-Z  (35 classes)
CLASSES = [str(i) for i in range(1, 10)] + list(string.ascii_uppercase)

def pre_process_landmark(landmark_list):
    """
    Normalize a single hand's landmarks to relative coords (wrist=origin), 
    then scale to [-1, 1] by the max absolute value.
    """
    if not landmark_list:
        return [0.0] * 42 # 21 points * 2 coords = 42

    temp = copy.deepcopy(landmark_list)

    # Convert to relative coordinates (wrist is index 0)
    base_x, base_y = temp[0][0], temp[0][1]
    for i in range(len(temp)):
        temp[i][0] -= base_x
        temp[i][1] -= base_y

    # Convert to a one-dimensional list
    flat_list = list(itertools.chain.from_iterable(temp))

    # Normalization
    max_value = max(map(abs, flat_list))
    if max_value > 0:
        flat_list = [n / max_value for n in flat_list]

    return flat_list

def process_image(image, landmarker):
    """
    Extracts 84 features (42 for Left hand, 42 for Right hand).
    Pads with zeros if a hand is missing.
    """
    image_height, image_width = image.shape[:2]
    
    # MediaPipe requires RGB Image object
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    
    result = landmarker.detect(mp_image)
    
    left_hand_raw = []
    right_hand_raw = []

    if result.hand_landmarks and result.handedness:
        # Loop through detected hands
        for i in range(len(result.hand_landmarks)):
            hand_lms = result.hand_landmarks[i]
            # Tasks API classification uses 'category_name'
            label = result.handedness[i][0].category_name
            
            # Note: For static dataset images (not flipped selfies), 'Left' usually means actual left hand.
            
            landmark_point = []
            for lm in hand_lms:
                landmark_x = min(int(lm.x * image_width), image_width - 1)
                landmark_y = min(int(lm.y * image_height), image_height - 1)
                landmark_point.append([landmark_x, landmark_y])
                
            if label == "Left":
                left_hand_raw = landmark_point
            elif label == "Right":
                right_hand_raw = landmark_point
                
    # Process and pad
    left_processed = pre_process_landmark(left_hand_raw)
    right_processed = pre_process_landmark(right_hand_raw)
    
    # Combined 84 feature vector
    return left_processed + right_processed

def main():
    print(f"Starting dataset generation from {DATASET_DIR}...")
    
    if not os.path.exists(MODEL_ASSET_PATH):
        raise FileNotFoundError(f"HandLandmarker model missing at {MODEL_ASSET_PATH}")

    # Prepare CSV
    with open(CSV_PATH, 'w', newline="") as f:
        writer = csv.writer(f)
        header = ["label"] + [f"f_{i}" for i in range(84)]
        writer.writerow(header)
    
    # Initialize MediaPipe Tasks HandLandmarker
    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=MODEL_ASSET_PATH),
        running_mode=RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.5
    )
    
    with HandLandmarker.create_from_options(options) as landmarker:
        total_images = 0
        processed_images = 0
        
        for class_name in CLASSES:
            class_dir = os.path.join(DATASET_DIR, class_name)
            if not os.path.exists(class_dir):
                print(f"Warning: Directory not found - {class_dir}")
                continue
                
            # Process all images in the class folder (~1,200 per class)
            images = [img for img in os.listdir(class_dir) if img.endswith(('.jpg', '.png'))]
            print(f"Processing class '{class_name}' ({len(images)} images)...")
            
            for img_name in tqdm(images, desc=class_name, leave=False):
                total_images += 1
                img_path = os.path.join(class_dir, img_name)
                image = cv2.imread(img_path)
                if image is None:
                    continue
                    
                features = process_image(image, landmarker)
                
                # Check if we actually found any hands (if all zeros, skip)
                if sum(map(abs, features)) > 0:
                    with open(CSV_PATH, 'a', newline="") as f:
                        writer = csv.writer(f)
                        writer.writerow([class_name] + features)
                    processed_images += 1
                    
    print(f"\nDone! Processed {processed_images} out of {total_images} images.")
    print(f"Saved 84-feature dataset to {CSV_PATH}")

if __name__ == "__main__":
    main()