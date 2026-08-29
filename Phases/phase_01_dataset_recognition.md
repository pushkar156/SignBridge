# Phase 1: Dataset & ISL Recognition Foundation

**Status:** COMPLETED (MVP Live)  
**Module:** Machine Learning & Computer Vision Engine  
**Dependencies:** Phase 0  

---

## 1. Phase Overview

Phase 1 focuses on preparing the character-level ISL gesture dataset (35 classes: `A-Z`, `1-9`) and building a robust, lighting-invariant landmark recognition pipeline.

Instead of unreliable raw pixel-based CNNs or zero-padded 84-landmark arrays, the pipeline extracts **42 wrist-relative normalized landmarks** using the MediaPipe Tasks API and feeds a Keras Deep Neural Network (DNN) for real-time inference (`ISL sign → character`).

---

## 2. Current Implementation (MVP Complete)

* **Dataset Extracted**: Extracted landmark vectors from 250 images/class single-hand dataset (`backend/ml_pipeline/dataset.csv`).
* **Model Architecture**: 4-layer Fully Connected Neural Network (Dense 1024 → 632 → 328 → 152 → 35) with wrist-relative normalization.
* **Accuracy Achieved**: High live webcam stability across 35 classes saved in `backend/ml_pipeline/signbridge_model_v1.h5`.

---

## 3. Next-Level Model Improvements (Milestone 2 - Planned)

To elevate the model from a prototype demo to production-grade reliability:

1. **Full Dataset Extraction (1,200 images/class)**:
   - Extract landmarks from all ~42,000 Kaggle images instead of the 250 cap to capture edge cases and finger variations.

2. **Custom Real-World Mobile/Webcam Dataset**:
   - Collect 50–100 live real-world samples per class across varied lighting, angles, skin tones, and background clutter to bridge the domain gap.

3. **Dedicated "Neutral / Idle / No-Sign" Class**:
   - Introduce a 36th "Neutral" class to stop the model from misclassifying resting hands or transitional movements between signs.

4. **Geometric Feature Engineering (Angles & Inter-joint Ratios)**:
   - Compute joint angle vectors (invariant to hand rotation) and inter-wrist relative distances/angles for 2-handed signs.

5. **Temporal Sequence Smoothing (Video-Level Prediction)**:
   - Implement rolling prediction windows or LSTM/GRU temporal sequence handling over 5–15 frames to eliminate single-frame classification flicker.

---

## 4. Granular Deliverables

- [x] **84-Landmark Feature Extractor**: `src/ml_pipeline/generate_dataset.py` with 2-hand zero-padding.
- [x] **Data Augmentation & DNN Training**: `src/ml_pipeline/train_model.py` with early stopping and Keras export.
- [x] **Lightweight Model Binary**: Exported `src/ml_pipeline/signbridge_model_v1.h5`.
- [x] **Live Landmark Inference Server**: `src/app.py` running MediaPipe Tasks API.
- [ ] **Full Dataset Ingestion**: Process all 1,200 images/class into `dataset_full.csv`.
- [ ] **Real-world Capture Utility**: Tool for recording custom webcam/mobile ISL landmark samples.
- [ ] **Neutral Class Integration**: 36-class dataset with idle/transit gesture samples.
- [ ] **Joint Angle / Geometric Feature Vector Extension**.
- [ ] **Temporal Window Smoother**: Frame buffer for stabilized prediction.

---

## 5. Exit Criteria & Verification

- [x] Fast MVP classifier achieves $\ge 95\%$ accuracy on augmented test set (Achieved: 99.84%).
- [x] CPU inference time is $< 10\text{ ms}$ per sample.
- [ ] Real-world mobile test accuracy $\ge 90\%$ across 5 different users in varied lighting.

