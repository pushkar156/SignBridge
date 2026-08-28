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

## 6. Low-End Devices & Mobile Deployment Strategy

### Problem Statement
SignBridge must run smoothly on budget smartphones ($100 / ₹7,000 Android devices) and low-power hospital reception terminals without requiring a heavy app store installation.

### Technical Solution (Current MVP Approach):
1. **Zero-Friction Web Access**: Users scan a QR code and open the app instantly in Chrome/Safari without downloading a 50 MB APK.
2. **Server-Side Inference (Track Change)**: 
   - *Original Plan*: Run everything client-side via WebAssembly to save bandwidth.
   - *Current Implementation*: For the MVP, mobile browsers capture camera frames and send them as base64 images to the Python Flask backend (`/predict`). The backend runs MediaPipe Hands and the custom Keras model, then returns the result. This simplifies the MVP deployment while still ensuring the user only needs a web browser.
3. **Mobile Camera Access**: Requires serving the app over HTTPS (even locally using self-signed certificates) so mobile browsers grant `getUserMedia` permissions.

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

---

## 11. Urgent 3-Day MVP ML Strategy & Track Change

### Objective & Rationale
To produce a working, reliable demonstration of SignBridge India for the **YUVA Future 6.0 competition round** within a 3-day window, we originally planned to use an existing image-based CNN (e.g. `BRO-CODES-HERE`). However, we **changed tracks** because CNNs failed on real webcam input.

Instead, we implemented a **Hybrid 84-Keypoint Landmark Model**:
1. **Reference Architecture (The Shift)**: We abandoned the CNN and built a hybrid model combining the best of the **Maitree Model** (which proved that processing relative landmarks is superior to raw pixels) and the **Bros Model's logic** (adapted to capture 2 hands / 84 keypoints using the modern MediaPipe Tasks API).
2. **Dataset Scope**: We extract these 84 keypoints from the **Kaggle ISL Dataset 1** (35 character classes: `A-Z` + digits `1-9`) and train a highly optimized, lightweight Multi-Layer Perceptron (MLP).
3. **Character-Level Task (`ISL Sign → Character`)**:
   - The ML model is strictly responsible for recognizing character signs (`H`, `E`, `L`, `P`), **not** full word/sentence signs.
   - Word assembly (`HELP`) and sentence reconstruction (*"I need help."*) are handled upstream in the sequence and AI framing layers.
4. **Modular Inference Abstraction**:
   - The model sits behind a clean `Recognition Interface`. Post-competition, the model engine can be replaced without modifying the SignBridge UI or application services.

---

## 12. Prediction Stabilization & Word Boundary Mechanics

### 1. Hold-to-Confirm Prediction Stabilization
Live video streams output 30 FPS, causing identical gestures to fire repeatedly (`HHHHH`). To prevent sequence buffer overflow:
- **Stabilization Rule**: A prediction is accepted into the character buffer **only** when the exact same class prediction remains stable across $N$ consecutive frames with confidence $\ge \text{threshold}$ (e.g., $0.75$).
- **Locking**: Once confirmed (`CONFIRM H`), candidate accumulation locks until the user resets/changes their hand shape.

```text
Frame 1: H (0.95)
Frame 2: H (0.96)
Frame 3: H (0.94)  ──>  [ STABILIZED: H ]  ──>  Commit to Character Buffer
Frame 4: H (0.95)  ──>  (Suppressed duplicate)
```

### 2. Pause-Based Word Boundary Detection
Because character-level datasets (A-Z, 1-9) do not include a dedicated "space bar" gesture:
- **Pause Trigger**: An idle gesture pause of **1.0 to 1.5 seconds** automatically inserts a word boundary space into the character buffer.
- **Example Flow**:
  $$\text{H} \rightarrow \text{E} \rightarrow \text{L} \rightarrow \text{P} \quad \xrightarrow{\text{1.2s Pause}} \quad \text{I} \quad \xrightarrow{\text{1.2s Pause}} \quad \text{N} \rightarrow \text{E} \rightarrow \text{E} \rightarrow \text{D}$$
  $$\Downarrow$$
  $$\text{Raw Sequence: "HELP I NEED"}$$
  $$\Downarrow \text{ (AI Framing Layer)}$$
  $$\text{Coherent English Sentence: "I need help."}$$

---

## 13. 3-Day Competition Execution Roadmap

### English-First Delivery Order
For the 3-day hackathon window, **English output is the primary target**. Regional translation (Hindi & Marathi) is performed at the AI language layer once the core English sequence-to-sentence pipeline is rock-solid.

```text
ISL Sign  ──>  Characters  ──>  English Words  ──>  English AI Sentence  ──>  Hindi / Marathi Translation
```

### 3-Day Development Priorities

| Day | Priority Milestone | Key Deliverables & Success Conditions |
| :--- | :--- | :--- |
| **Day 1** | **ML Recognition & Webcam Pipeline** | • Build the 84-keypoint Hybrid MLP (Maitree + Bros).<br>• Generate dataset from Kaggle images and train model.<br>• Implement Hold-to-Confirm stabilization.<br>• *Success*: Live webcam reliably outputs stable character stream (`H` `E` `L` `P`). |
| **Day 2** | **SignBridge Core & English Framing** | • Character buffer to word formation (`HELP`).<br>• Pause-based word boundary detection (1.2s).<br>• LLM AI sentence framing layer (*"I need help."*).<br>• Mobile-first Communication UI integration (English first). |
| **Day 3** | **Demo Polish, Avatar & QR Standees** | • Quick Healthcare Phrase buttons & reverse ISL Avatar player.<br>• Hospital reception QR standee routing.<br>• Basic institutional readiness dashboard.<br>• Multilingual output toggle (Hindi & Marathi). |


