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
┌────────────────────────────────────────────────────────┐
│               SIGNBRIDGE COMMUNICATION                 │
│                                                        │
│ Output Language: [ Marathi (मराठी) ▼ ]                 │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                    │ │
│ │                 [ CAMERA FEED ]                    │ │
│ │           Live Skeleton Overlay Active             │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│ Status: Recognized (Confidence: 94%)                   │
│ Sequence:  [ I ]  →  [ NEED ]  →  [ HELP ]             │
│                                                        │
│ Generated Message:                                     |
│ "मला मदतीची गरज आहे."                                   │
│                                                        │
│ [ ↺ Clear ]   [ ⌫ Undo Last ]   [ ✓ Complete Message ] │
└────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Scope & Requirements

1. **Integrated Communication Page (`/communication`)**:
   - Assemble components into a unified responsive interface optimized for desktop, tablet, and mobile devices.

2. **UX Accessibility Requirements**:
   - Large touch targets ($\ge 48\text{px}$).
   - High contrast colors for hospital desk environments.
   - Clear visual status indicators: `Initializing Camera`, `Detecting Sign`, `Confidence Low`, `Sentence Generated`.

3. **Error Handling & Resiliency**:
   - Handle camera disconnects gracefully with retry options.
   - Display fallback text formatting if AI backend service fails.

4. **Performance Targets**:
   - Camera frame processing $\ge 25\text{ FPS}$.
   - End-to-end latency (gesture finish $\rightarrow$ sentence displayed) $< 1.5\text{ seconds}$.

---

## 4. Granular Deliverables

- [ ] **Communication Screen**: Build `frontend/src/pages/Communication/index.jsx` combining video feed, sequence, and text modules.
- [ ] **Main Communication Panel**: Implement `frontend/src/components/communication/CommunicationPanel.jsx`.
- [ ] **State Coordinator**: Create unified state hook `useCommunicationSession()` managing camera, predictions, buffer, and translations.
- [ ] **Status Banner**: Build `frontend/src/components/common/StatusBanner.jsx` for connection and confidence states.
- [ ] **Responsive Styles**: Implement mobile and tablet CSS layouts in `frontend/src/styles/communication.css`.
- [ ] **End-to-End Integration Tests**: Write Playwright/Cypress E2E test verifying complete gesture-to-text flow.

---

## 5. Exit Criteria & Verification

- [ ] Live camera gesture $\rightarrow$ MediaPipe $\rightarrow$ Model $\rightarrow$ Sequence $\rightarrow$ AI $\rightarrow$ Multilingual Text works end-to-end without crashing.
- [ ] Interface is intuitive and usable by non-technical users within 10 seconds.
- [ ] Clear, Undo, and Language Selection operate predictably during live video streams.
- [ ] All automated E2E integration tests pass cleanly.
