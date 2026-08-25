# SignBridge India - Key Technical Decisions & Architecture Insights

This document captures critical architectural decisions, technical trade-offs, model fixes, and environmental handling mechanisms established during project planning.

---

## 1. Handling Environmental Variations (Lighting & Backgrounds)

### Problem
Training datasets are often recorded against clean black or white studio backgrounds. In real-world deployments (e.g., hospital reception desks, registration counters), ambient lighting, shadows, and busy surroundings vary significantly.

### Solution: 4-Layer Resolution Strategy

1. **MediaPipe Landmark Abstraction (Pixel-to-Coordinate Layer)**
   - Instead of passing raw RGB image pixels into a CNN, we use MediaPipe to extract 21 3D joint landmarks per hand.
   - The classifier model **never sees background pixels, colors, or wall textures**—it only processes a 3D geometric map of joint coordinates.

2. **Relative Coordinate Normalization**
   - Coordinates are normalized relative to the wrist base landmark:
     $$\mathbf{x}_{\text{norm}} = \frac{\mathbf{x} - \mathbf{x}_{\text{wrist}}}{\text{max\_hand\_span}}$$
   - Ensures invariance to user distance from camera, frame placement, and individual hand sizes.

3. **Synthetic Keypoint Augmentation**
   - To handle landmark detection jitter caused by low light or motion blur, training includes synthetic coordinate augmentation:
     - **Gaussian Jitter**: $\pm 2\%$ noise added to joint positions.
     - **Rotation**: $\pm 10^\circ - 15^\circ$ coordinate rotation.
     - **Scale Jitter**: $\pm 10\%$ scale variation.

4. **Dynamic Lighting Preprocessing (CV Pre-Filter)**
   - For low-light or strongly backlit environments, apply CLAHE (Contrast Limited Adaptive Histogram Equalization) before passing frames to MediaPipe:
     ```python
     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
     # Applied to L-channel in LAB color space
     ```

---

## 2. Model Architecture & Overfitting Mitigation

### Evaluation of Baseline Keypoint Classifiers (e.g., Maitree Model)
- **Identified Issues**:
  - **Data Leakage**: Random frame-level `train_test_split` on video sequences caused near-identical consecutive frames to split across train/test sets, producing a false $100\%$ accuracy metric on Epoch 3.
  - **Over-Parameterization**: 5 dense layers with 2.2M parameters (`42 → 1470 → 832 → 428 → 264 → 35`) created an 11.5 MB model file for just 42 inputs, causing heavy memorization.

### SignBridge Optimized Architecture
- **Model Design**: Lightweight 2-layer MLP (~15,000 parameters) with Dropout (0.3).
  ```python
  model = Sequential([
      Dense(128, activation='relu', input_shape=(input_dim,)),
      Dropout(0.3),
      Dense(64, activation='relu'),
      Dropout(0.2),
      Dense(num_classes, activation='softmax')
  ])
  ```
- **Benefits**:
  - Model file size drops from 11.5 MB to **< 100 KB**.
  - Prevents memorization and improves generalization on new users.
  - Exportable to **ONNX / TensorFlow.js** for in-browser zero-latency inference.

---

## 3. Two-Handed Gesture Support (84 Keypoints)

- **Vector Format**: Concatenated 84-element vector (2 hands $\times$ 21 landmarks $\times$ 2 coordinates).
- **Single-Hand Fallback**: Padded with zeros if only one hand is detected in frame.
- **Requirement**: Essential for complex ISL healthcare signs (`HELP`, `NEED`, `DOCTOR`, `A`, `B`).

---

## 4. Confidence Thresholding & Retry Mechanism (FR-05)

- **Interface Contract**:
  ```json
  {
    "class": "HELP",
    "confidence": 0.94
  }
  ```
- **Threshold Rule**:
  - If $\text{confidence} \ge 0.75$: Accept prediction into the sequence buffer (`I → NEED → HELP`).
  - If $\text{confidence} < 0.75$: Trigger a polite UI prompt requesting the user to repeat the gesture.

---

## 5. End-to-End Core Communication Loop

```
[ Live Camera Feed ]
         │
         ▼
MediaPipe Hands (84 Landmark Extraction)
         │
         ▼
Relative Coordinate Normalization
         │
         ▼
Lightweight Neural Classifier (<100 KB)
         │
         ▼
Sequence Buffer ("I" → "NEED" → "HELP")
         │
         ▼
AI Framing System (LLM / Language Layer)
         │
         ▼
Multilingual Output (English / Hindi / Marathi)
```

---

## 6. Low-End Devices & Mobile PWA Deployment Strategy

### Problem Statement
SignBridge must run smoothly on budget smartphones ($100 / ₹7,000 Android devices) and low-power hospital reception terminals without requiring a heavy app store installation.

### Technical Solution: Progressive Web App (PWA)
1. **Zero-Friction Access**: Users scan a QR code and open the app instantly in Chrome/Safari without downloading a 50 MB APK.
2. **Client-Side WebAssembly (WASM) & ONNX Web**:
   - MediaPipe Hands (`model_complexity: 0`) and ONNX Web run inside the device browser via WebAssembly and WebGL.
   - Operates at **25–30 FPS** directly on mobile ARM chipsets.
3. **Zero Bandwidth Video Overhead**:
   - Camera frames are processed **locally on the user's phone**. Video is never transmitted over the network. Only small text tokens/landmark vectors pass over 3G/4G.
4. **Offline Caching**: Service Workers cache assets and model weights (<100 KB) for instant offline access.

---

## 7. Point-of-Service QR Code Access Concept

### Real-World Hospital Workflow
1. **Desk Standee**: A QR code standee (similar to Google Pay/PhonePe UPI) is placed at hospital reception desks, OPD registration counters, and pharmacy windows.
2. **Instant Scanning**: A Deaf citizen scans the desk QR code with their mobile camera.
3. **Dynamic Context Routing**:
   - URL parameter (`https://signbridge.in/c?inst=kem_pune&sp=opd_01`) pre-loads location context (*"KEM Hospital OPD Desk 1"*) and target output language (*Marathi / Hindi*).
4. **Hygienic Personal Device Use**: Citizens sign into their own smartphone camera rather than touching a public shared screen.
5. **Screen Flip Interaction**: The translated sentence (e.g. *"मला डॉक्टरांच्या भेटीची वेळ हवी आहे."*) renders on screen for the receptionist to read immediately.

---

## 8. Two-Way Communication Architecture & Avatar Independence Principle

### Architecture Separation
The recognition engine (Direction A: ISL → Text) and the avatar player system (Direction B: Text → ISL Avatar) operate as **completely independent pipelines**:

```
[ Direction A: ISL → Text ]
Camera → MediaPipe CV (84 keypoints) → Neural Model → Sequence Buffer → LLM Framing → Multilingual Text

[ Direction B: Text → ISL Avatar ]
Typed Text / Quick Button → Phrase Service → Controlled Mapping → Validated Sign Sequence → Avatar Player
```

- **No Shared Model Dependency**: The gesture classifier model is not used for avatar rendering.
- **Independent Failure Domains**: A failure or retrying of recognition on Direction A does not block or impair Direction B playback.

---

## 9. Avatar Implementation Strategy: Correctness > Realism

### Non-Goal: Unrestricted 3D Natural-Language Generation
For the MVP, we explicitly avoid generating continuous, real-time 3D human avatar animations for arbitrary text. Unrestricted LLM-to-3D sign translation risks generating linguistically incorrect, hallucinated, or unvalidated hand signs.

### Controlled Level 1 / Level 2 Animation Pipeline
- **Level 1 (Predefined Sign Clips)**: Pre-rendered, validated video clips/animations for individual supported ISL signs (`PLEASE`, `WAIT`, `HERE`, `GO`, `REGISTRATION`).
- **Level 2 (Sequence Stitching)**: Combining individual sign clips into fluid phrase sequences (`PLEASE` + `WAIT` + `HERE`).
- **Linguistic Validation**: Every phrase mapping in `phrases.json` is audited by ISL experts before deployment (`validated: true`).

---

## 10. Healthcare Safety Boundary & Interpreter Escalations

### Autonomous AI Scope vs Escalation Criteria
SignBridge MVP is designed for **routine service interactions** in public healthcare touchpoints.

| Category | Permitted Autonomous Scope | Interpreter Escalation Required |
| :--- | :--- | :--- |
| **Reception & OPD** | Token numbers, registration desk direction, general help | Complex registration disputes, legal disclosures |
| **Appointments** | Doctor availability, room numbers, waiting alerts | Clinical diagnosis, symptom consultation |
| **Pharmacy & Billing** | Counter directions, payment queue guidance | Medication dosage instruction, drug allergy warning |
| **Clinical / Surgery** | *None* | Informed consent, surgery risks, procedure details |

### Safety Guardrail Mechanism
If staff attempts to enter unvalidated clinical text or complex medical descriptions into the avatar system, the system triggers a safety fallback card:

```text
┌────────────────────────────────────────────────────────┐
│ ⚠️ CLINICAL SAFETY BOUNDARY TRIGGERED                   │
│                                                        │
│ Complex medical instructions or clinical consultations │
│ require a certified human ISL interpreter.              │
│                                                        │
│ [ Call On-Duty ISL Interpreter ] [ Re-enter Simple ]   │
└────────────────────────────────────────────────────────┘
```

