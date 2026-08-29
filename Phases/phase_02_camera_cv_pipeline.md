# Phase 2: Camera & Computer Vision Pipeline

**Status:** COMPLETED (MVP Live)  
**Module:** Video Capture & MediaPipe Integration  
**Dependencies:** Phase 1  

---

## 1. Phase Overview

Phase 2 connects the live webcam feed to the MediaPipe Hand Landmark extraction engine and routes the processed landmark vectors to the trained recognition model. It implements real-time visual status feedback, low-light handling, and confidence-based filtering.

---

## 2. Technical Pipeline & Data Flow

```
[ Webcam Feed ]
      │ (RGB Video Frames @ 30 FPS)
      ▼
[ Dynamic Lighting Pre-Filter ] (CLAHE / Contrast Adjust if low light)
      │
      ▼
[ MediaPipe Hands Processing ] (Detects Left/Right hand 3D landmarks)
      │
      ▼
[ Keypoint Preprocessor ] (Wrist relative normalization → 84-float vector)
      │
      ▼
[ Inference Engine ] (Dense Classifier)
      │
      ▼
[ Confidence Evaluator ]
  ├── If confidence >= 0.75 → Send prediction to Sequence Buffer
  └── If confidence < 0.75  → Trigger "Adjust Gesture" UI prompt
```

---

## 3. Detailed Scope & Requirements

1. **Browser / Web API Integration**:
   - Access camera feed via HTML5 `getUserMedia` API.
   - Display live video stream with low latency (<50 ms overhead).

2. **MediaPipe Hands Configuration**:
   - `max_num_hands`: 2
   - `model_complexity`: 1 (balanced speed/accuracy)
   - `min_detection_confidence`: 0.5
   - `min_tracking_confidence`: 0.5

3. **Lighting & Background Robustness**:
   - MediaPipe extracts landmark geometry regardless of background color (black, white, or office clutter).
   - Add CLAHE histogram equalization pre-filter for low-light environments.

4. **Confidence Filtering & UI Feedback**:
   - High confidence ($\ge 0.75$): Display bounding box, detected sign label, and confidence percentage.
   - Low confidence ($< 0.75$): Display "Hold gesture steady" or "Clarify sign" indicator without corrupting sequence state (FR-05).

---

## 4. Granular Deliverables

- [ ] **Camera Component**: Build `frontend/src/components/camera/CameraView.jsx` (or `.js`) with webcam permissions handling.
- [ ] **Landmark Overlay Component**: Render live MediaPipe skeleton overlay over video feed.
- [ ] **Pre-processing Module**: Implement relative landmark normalization in JS (`frontend/src/services/recognition/preprocessor.js`) and Python.
- [ ] **Real-Time Pipeline**: Hook MediaPipe output frames directly to the model inference engine.
- [ ] **Confidence Visualizer**: Build `frontend/src/components/recognition/ConfidenceIndicator.jsx` showing score progress bars.
- [ ] **Retry Feedback Prompt**: Build `frontend/src/components/recognition/RetryPrompt.jsx` for low-confidence gestures.
- [ ] **Camera Controls**: Add flip camera, pause stream, and video resolution selection controls.

---

## 5. Exit Criteria & Verification

- [ ] Web application opens webcam, requests permissions gracefully, and renders 30 FPS feed.
- [ ] MediaPipe accurately tracks hands under dim light and bright backgrounds.
- [ ] Predictions and confidence scores update in real time on screen.
- [ ] Low-confidence predictions ($<0.75$) trigger retry prompts and do not auto-commit to the sequence buffer.
