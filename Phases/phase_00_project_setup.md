# Phase 0: Project Setup & Scope Lock

**Status:** Planned  
**Module:** Foundation & Architecture  
**Dependencies:** None  

---

## 1. Phase Overview

Phase 0 establishes the engineering foundation, repository layout, development environment, and architectural scope lock for **SignBridge India**. It ensures all team members align on technology choices, data contracts, non-goals, and setup instructions before feature development begins.

---

## 2. Technical Architecture Scope

```
signbridge-india/
├── frontend/             # Web UI (React/Next.js or Vanilla HTML/JS)
├── backend/              # API & Service Layer (Python FastAPI / Node.js)
├── ml/                   # Model Training, Augmentation & Evaluation Pipeline
├── data/                 # Class Maps, Labels & Sample Keypoints
├── phases/               # Phase Workflows & Detailed Documentation
└── docs/                 # Product PRD, Architecture & Pilot Specifications
```

---

## 3. Detailed Scope & Requirements

### Key Responsibilities
- **Frontend**: Camera capture interface, real-time prediction display, confidence indicators, sequence builder, multilingual text rendering, learning UI, institutional dashboards.
- **Backend**: API routing, model inference orchestration (or serving ONNX/TF.js models), sequence processing, AI language framing integration, institution database, usage tracking.
- **ML Layer**: Keypoint dataset cleaning, normalization, model training scripts, validation metrics, model export (`.onnx` / `.keras`).

### Scope Lock & Non-Goals
- **In Scope (MVP)**:
  - Supported ISL static characters (`A-Z`, `1-9`) and core Healthcare word signs (`HELP`, `NEED`, `DOCTOR`, `WATER`, `PAIN`, `REGISTRATION`).
  - Output languages: English, Hindi, Marathi.
  - Healthcare reception desk scenario (Pune pilot).
- **Out of Scope (Non-Goals)**:
  - Complete continuous natural ISL translation (all 10,000+ dictionary terms).
  - Voice/Speech synthesis dependency for initial MVP.
  - Payment or monetization features.

---

## 4. Granular Deliverables

- [ ] **Repository Setup**: Create Git repository with `.gitignore`, `.env.example`, and standard folder skeleton.
- [ ] **Architecture Lock**: Define input/output API contracts between Frontend, Backend, ML, and AI framing layers.
- [ ] **Environment Configuration**: Set up Python virtual environment (`requirements.txt`) and Node.js package setup (`package.json`).
- [ ] **Documentation**: Create root `README.md` with step-by-step local execution instructions.
- [ ] **Coding Conventions**: Establish code formatting, linting rules, and branch naming guidelines (`feature/*`, `fix/*`).
- [ ] **Scope Lock Sign-off**: Freeze supported class vocabulary list (`labels.json`).

---

## 5. Exit Criteria & Verification

- [ ] Workspace runs locally without configuration errors.
- [ ] All team members understand data contracts and API specifications.
- [ ] `labels.json` class mapping file is locked.
- [ ] `.env.example` file is populated with required configuration parameters.
