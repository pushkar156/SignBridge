# Phase 1: Dataset & ISL Recognition Foundation

**Status:** Planned  
**Module:** Machine Learning & Computer Vision Engine  
**Dependencies:** Phase 0  

---

## 1. Phase Overview

Phase 1 focuses on preparing the ISL gesture landmark dataset and building the lightweight, robust neural classification model. It replaces bloated, overfitted architectures (like 2.2M parameter models) with an optimized, keypoint-based classifier (~15,000 parameters, <100 KB) capable of two-handed gesture recognition.

---

## 2. Technical Specifications

### Input Vector Format (84 Keypoints)
To support both single-handed and two-handed ISL gestures (`HELP`, `NEED`, `DOCTOR`):
- **Left Hand**: 21 3D landmarks $(x, y, z)$ normalized relative to wrist landmark 0.
- **Right Hand**: 21 3D landmarks $(x, y, z)$ normalized relative to wrist landmark 0.
- **Total Vector Dimension**: $42 \times 2 = 84$ numerical features. If only 1 hand is present, the remaining 42 features are zero-padded.

### Model Architecture
```python
model = Sequential([
    Dense(128, activation='relu', input_shape=(84,)),
    BatchNormalization(),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(num_classes, activation='softmax')
])
```

### Classification Output Contract
```json
{
  "class": "HELP",
  "confidence": 0.94,
  "class_id": 4
}
```

---

## 3. Detailed Scope & Requirements

1. **Dataset Cleaning & Validation**:
   - Collect/validate ISL keypoint samples for supported letters (`A-Z`), digits (`1-9`), and healthcare terms (`HELP`, `NEED`, `DOCTOR`, `PAIN`, `WATER`).
   - Remove corrupted, noisy, or mislabeled landmark rows.

2. **Data Splitting Strategy (Preventing Data Leakage)**:
   - Split dataset **by subject/person** (e.g., train on Person 1–4, test on Person 5) rather than random frame sampling.
   - Prevents fake $100\%$ accuracy caused by consecutive frame correlation.

3. **Keypoint Augmentation**:
   - Apply Gaussian noise ($\pm 2\%$), random 2D coordinate rotation ($\pm 15^\circ$), and coordinate scaling ($\pm 10\%$) during training.

4. **Model Export**:
   - Save trained model in `.keras` and export to **ONNX** or **TensorFlow.js** for web deployment.

---

## 4. Granular Deliverables

- [ ] **Class Mapping Specification**: Finalize `data/class_map/labels.json` containing class IDs, text labels, and category types.
- [ ] **Data Pipeline**: Build `ml/src/preprocessing/preprocessing.py` for wrist-relative keypoint normalization.
- [ ] **Augmentation Script**: Implement `ml/src/preprocessing/augmentation.py` for coordinate jittering and rotation.
- [ ] **Training Script**: Create `ml/src/training/train.py` with cross-validation and early stopping.
- [ ] **Evaluation Suite**: Implement `ml/src/evaluation/evaluate.py` to generate per-class accuracy, F1-score, and confusion matrices.
- [ ] **Model Exporter**: Export model to `.onnx` and `.keras` formats inside `ml/models/exported/`.
- [ ] **Inference Service**: Create reusable Python prediction module `ml/src/inference/predictor.py`.

---

## 5. Exit Criteria & Verification

- [ ] Classifier achieves $\ge 85\%$ macro F1-score on subject-separated test set.
- [ ] Model binary size is $< 200\text{ KB}$.
- [ ] Inference time is $< 10\text{ ms}$ per sample on CPU.
- [ ] Evaluation metrics and confusion matrix are saved in `docs/MODEL_EVALUATION.md`.
