# Phase 3: Sequence Construction

**Status:** COMPLETED (MVP Live)  
**Module:** Communication Buffer & Sequence Manager  
**Dependencies:** Phase 2  

---

## 1. Phase Overview

Phase 3 builds the sequence construction layer. It receives live character predictions from the recognition engine (`H`, `E`, `L`, `P`), applies **Hold-to-Confirm** prediction stabilization across consecutive frames, filters duplicate candidate streams, inserts word boundaries during 1.0–1.5 second pauses, and assembles words (`HELP`) ready for AI sentence framing.

---

## 2. Technical Architecture & State Management

```
[ Prediction Stream ] ──(Confidence >= 0.75)──> [ Hold-to-Confirm Validator ]
                                                          │
                                                          ▼
                                            [ Character Sequence Buffer ]
                                              ['H', 'E', 'L', 'P', ' ']
                                                          │ (Pause >= 1.2s)
                                                          ▼
                                               [ Word Assembly Layer ]
                                                 ["HELP", "I", "NEED"]
                                                          │
                                                ┌─────────┴─────────┐
                                                ▼                   ▼
                                        [ UI Renderer ]    [ AI Framing Layer ]
```

### Sequence Data Structure
```json
{
  "session_id": "sess_102938",
  "characters": ["H", "E", "L", "P", " ", "I", " ", "N", "E", "E", "D"],
  "words": ["HELP", "I", "NEED"],
  "status": "ready_for_ai"
}
```

---

## 3. Detailed Scope & Requirements

1. **Hold-to-Confirm Prediction Stabilization**:
   - A recognized character sign must remain identical across $N$ consecutive frames with confidence $\ge \text{threshold}$ (e.g., $0.75$) before committing to the buffer.

2. **Duplicate Character Suppression**:
   - Prevents identical consecutive frames from filling the buffer (`HHHHH` $\rightarrow$ `H`), until the user changes or resets hand position.

3. **Pause-Based Word Boundary Detection**:
   - A 1.0s–1.5s idle pause without confirmed gestures automatically appends a space boundary to delimit words (`HELP` + [pause] + `I` + [pause] + `NEED`).

4. **User Editing Controls**:
   - **Undo**: Remove the last recognized character or word.
   - **Delete Item**: Remove a specific character/word chip.
   - **Clear All**: Reset character buffer.

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
