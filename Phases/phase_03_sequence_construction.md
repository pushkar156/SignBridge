# Phase 3: Sequence Construction

**Status:** Planned  
**Module:** Communication Buffer & Sequence Manager  
**Dependencies:** Phase 2  

---

## 1. Phase Overview

Phase 3 builds the sequence construction layer. It collects high-confidence predictions emitted by the recognition engine over time, filters rapid duplicate detections, manages ordering, and provides editing controls (undo, delete, clear) to form a structured gesture sequence ready for AI language framing.

---

## 2. Technical Architecture & State Management

```
[ Prediction Stream ] ──(Confidence >= 0.75)──> [ Debouncer / Hold Validator ]
                                                          │
                                                          ▼
                                                [ Sequence Buffer ]
                                                ["I", "NEED", "HELP"]
                                                          │
                                               ┌──────────┴──────────┐
                                               ▼                     ▼
                                       [ UI Renderer ]     [ AI Framing Layer ]
```

### Sequence Data Structure
```json
{
  "session_id": "sess_102938",
  "sequence": [
    { "id": 1, "class": "I", "confidence": 0.96, "timestamp": 1776882000 },
    { "id": 2, "class": "NEED", "confidence": 0.91, "timestamp": 1776882003 },
    { "id": 3, "class": "HELP", "confidence": 0.94, "timestamp": 1776882007 }
  ],
  "formatted_raw": ["I", "NEED", "HELP"],
  "status": "ready_for_ai"
}
```

---

## 3. Detailed Scope & Requirements

1. **Debouncing & Hold Time Validation**:
   - A recognized sign must remain stable for $N$ consecutive frames (e.g., 5 frames / 300 ms) before appending to avoid flickering false positives.

2. **Duplicate Gesture Suppression**:
   - Prevents identical consecutive signs from spamming the sequence buffer (e.g. `["HELP", "HELP", "HELP"]` $\rightarrow$ `["HELP"]`), unless separated by a deliberate hand-reset gesture or pause.

3. **User Editing Controls**:
   - **Undo**: Remove the last recognized gesture.
   - **Delete Item**: Remove a specific gesture chip from the sequence list.
   - **Clear All**: Reset the entire sequence buffer.
   - **Manual Add**: Provide fallback button selection for unsupported/misread signs.

4. **Sequence Handoff**:
   - Package sequence array and pass to backend/AI layer when user clicks "Complete Message" or when automatic silence detection triggers.

---

## 4. Granular Deliverables

- [ ] **Sequence Manager Service**: Build `frontend/src/services/recognition/sequence_manager.js` to manage buffer state.
- [ ] **Debouncer Logic**: Implement frame stability and hold-time verification functions.
- [ ] **Sequence Display Component**: Build `frontend/src/components/communication/SequenceDisplay.jsx` rendering chips/badges.
- [ ] **Editing Controls Component**: Build `frontend/src/components/communication/SessionControls.jsx` (Undo, Clear, Submit buttons).
- [ ] **Backend Sequence API**: Implement `backend/app/services/sequence_service.py` to store and validate session sequences.
- [ ] **Unit Tests**: Write unit tests for sequence debouncing, duplicate filtering, and undo operations.

---

## 5. Exit Criteria & Verification

- [ ] Sequential signs are accurately recorded in chronological order (`I → NEED → HELP`).
- [ ] Holding a sign in camera view for 3 seconds adds it **once**, not 90 times.
- [ ] User can delete or clear sequence chips seamlessly via UI controls.
- [ ] Prepared sequence array is correctly passed to the language service.
