# Phase 1: Dataset & ISL Recognition Foundation

**Status:** Planned  
**Module:** Machine Learning & Computer Vision Engine  
**Dependencies:** Phase 0  

---

## 1. Phase Overview

Phase 1 focuses on preparing the character-level ISL gesture dataset (35 classes: `A-Z`, `1-9`) and adapting an open-source reference pipeline (`BRO-CODES-HERE/INDIAN-SIGN-LANGUAGE`). For the urgent 3-day competition MVP, MediaPipe hand detection/cropping feeds a lightweight CNN character classifier (~15,000 parameters, <100 KB) for real-time character recognition (`ISL sign → character`).

---

## 2. Technical Specifications

### Input Image / Crop Format (35 Character Classes)
- **Cropping**: MediaPipe detects hand bounding boxes and crops the hand region.
- **Preprocessing**: Resized & normalized image tensors fed to the CNN model.
- **Classes (35 Total)**: `A` to `Z` (26 alphabets) + `1` to `9` (9 digits, no `0` class).

### Classification Output Contract
```json
{
  "class": "H",
  "confidence": 0.96,
  "class_id": 7
}
```

---

## 3. Detailed Scope & Requirements

1. **Dataset Ingestion & Validation**:
   - Ingest Kaggle ISL Dataset 1 containing ~1,200 images per class for 35 character classes (`A-Z`, `1-9`).
   - Validate class labels and folder structure in `data/class_map/labels.json`.

2. **Pretrained Pipeline Adaptation**:
   - Adapt open-source reference pipeline (`BRO-CODES-HERE/INDIAN-SIGN-LANGUAGE`) using MediaPipe hand cropping.
   - Fine-tune final classification layer for 35 output classes.

3. **Data Splitting & Augmentation**:
   - Split dataset into train/validation/test sets.
   - Apply image augmentation (rotation $\pm 15^\circ$, zoom $\pm 10\%$, lighting/jitter).

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
