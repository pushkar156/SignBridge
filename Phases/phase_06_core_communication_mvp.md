# Phase 6: Core Communication MVP Integration

**Status:** Planned  
**Module:** Full Communication Flow & User Interface  
**Dependencies:** Phase 5  

---

## 1. Phase Overview

Phase 6 integrates all core technical sub-components—Camera Feed, MediaPipe CV, Recognition Classifier, Sequence Construction, AI Framing System, and Multilingual Output—into a single, polished, accessible, mobile-first **Communication Interface**.

---

## 2. End-to-End Core Communication Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SIGNBRIDGE COMMUNICATION                          │
│                        Hospital Service Desk                           │
│ Output Language: [ Marathi (मराठी) ▼ ]                                 │
├───────────────────────────────────┬────────────────────────────────────┤
│   DIRECTION A: ISL → TEXT         │    DIRECTION B: TEXT → ISL AVATAR  │
│                                   │                                    │
│ ┌───────────────────────────────┐ │   Type response:                   │
│ │                               │ │   ┌──────────────────────────────┐ │
│ │        [ CAMERA FEED ]        │ │   │ Please wait here             │ │
│ │  Live Skeleton Overlay Active │ │   └──────────────────────────────┘ │
│ │                               │ │   [ Show in ISL Avatar ]           │
│ └───────────────────────────────┘ │                                    │
│ Status: Recognized (94%)          │   Quick Predefined Buttons:        │
│ Sequence: [ I ] → [ NEED ] → [HELP]│   [ Please wait ] [ Go to OPD ]    │
│ Generated Message:                │   [ Your appointment ok ]          │
│ "मला मदतीची गरज आहे."             │                                    │
│                                   │   ┌──────────────────────────────┐ │
│ [↺ Clear]  [✓ Complete Message]   │   │       [ ANIMATED AVATAR ]    │ │
│                                   │   │      [▶ Play]  [↻ Replay]    │ │
│                                   │   └──────────────────────────────┘ │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 3. Detailed Scope & Requirements

1. **Integrated Communication Page (`/communication`)**:
   - Assemble components into a unified dual-panel (or tabbed mobile) interface supporting both Direction A (ISL → Text) and Direction B (Text → ISL Avatar).

2. **UX Accessibility Requirements**:
   - Large touch targets ($\ge 48\text{px}$).
   - High contrast colors for hospital desk environments.
   - Clear visual status indicators: `Initializing Camera`, `Detecting Sign`, `Confidence Low`, `Sentence Generated`, `Avatar Animating`.

3. **Reverse Communication & Avatar Controls**:
   - Type input box + Quick Predefined Healthcare Buttons (`Please wait`, `Go to registration`, `Your appointment ok`).
   - Avatar Player with `Play`, `Pause`, and `Replay` controls.
   - Escalation alert banner for complex clinical text inputs.

4. **Error Handling & Resiliency**:
   - Handle camera disconnects gracefully with retry options.
   - Display fallback text formatting if AI backend service fails.
   - Separate Direction A and Direction B state handling to ensure pipeline independence.

5. **Performance Targets**:
   - Camera frame processing $\ge 25\text{ FPS}$.
   - End-to-end latency (gesture finish $\rightarrow$ sentence displayed) $< 1.5\text{ seconds}$.
   - Avatar animation load time $< 300\text{ ms}$.

---

## 4. Granular Deliverables

- [ ] **Communication Screen**: Build `frontend/src/pages/Communication/index.jsx` combining video feed, sequence, text, and avatar modules.
- [ ] **Main Communication Panel**: Implement `frontend/src/components/communication/CommunicationPanel.jsx`.
- [ ] **Avatar Player & Controls**: Implement `frontend/src/components/avatar/AvatarPlayer.jsx`, `PhraseSelector.jsx`, and `AvatarControls.jsx`.
- [ ] **State Coordinator**: Create unified state hook `useCommunicationSession()` managing camera, predictions, buffer, translations, and avatar playback.
- [ ] **Status Banner**: Build `frontend/src/components/common/StatusBanner.jsx` for connection, confidence, and avatar states.
- [ ] **Responsive Styles**: Implement mobile and tablet CSS layouts in `frontend/src/styles/communication.css`.
- [ ] **End-to-End Integration Tests**: Write Playwright/Cypress E2E test verifying complete two-way gesture-to-text and text-to-avatar flows.

---

## 5. Exit Criteria & Verification

- [ ] Live camera gesture $\rightarrow$ MediaPipe $\rightarrow$ Model $\rightarrow$ Sequence $\rightarrow$ AI $\rightarrow$ Multilingual Text works end-to-end without crashing.
- [ ] Interface is intuitive and usable by non-technical users within 10 seconds.
- [ ] Clear, Undo, and Language Selection operate predictably during live video streams.
- [ ] All automated E2E integration tests pass cleanly.
