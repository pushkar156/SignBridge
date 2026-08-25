# SignBridge India 🤟🇮🇳

**Multilingual Indian Sign Language (ISL) Communication & Institutional Accessibility Platform**

**Programme:** YUVA Future 6.0 · Young Indians (Yi), CII  
**Track:** Accessibility  
**Initial Pilot:** Healthcare (Pune, Maharashtra)  
**Target Languages:** English, Hindi (हिंदी), Marathi (मराठी)  

---

## 1. Executive Summary

**SignBridge India** bridges the communication barrier between Indian Sign Language (ISL) users and frontline public-service employees (doctors, nurses, receptionists, clerks). 

The immediate MVP focuses on a real-time, low-latency **two-way communication bridge**:

```
Direction A: ISL → Multilingual Text (Primary)
[ ISL Gesture ] ──> [ CV / MediaPipe ] ──> [ Neural Model ] ──> [ Sequence Buffer ] ──> [ LLM Framing ] ──> [ EN / HI / MR Text ]

Direction B: Text → ISL Avatar (Reverse)
[ Non-ISL Staff ] ──> [ Type / Quick Button ] ──> [ Phrase Mapping ] ──> [ Animated ISL Avatar ] ──> [ ISL User ]
```

Beyond real-time gesture recognition, SignBridge provides a complete **institutional accessibility ecosystem** combining point-of-service QR access, bite-sized ISL staff training, and an institutional readiness dashboard.

---

## 2. The Problem & Product Vision

### Problem
While ISL is officially recognized, over 18 million Deaf and hard-of-hearing citizens face severe communication barriers at essential touchpoints: hospitals, government offices, banks, and schools. Frontline employees lack ISL skills, and human interpreters cannot be present at every service desk.

### Product Vision
> **Enable an ISL user to communicate with a non-ISL user immediately at any public service desk, while helping institutions progressively build long-term ISL capability.**

---

## 3. Core Architecture & Product Layers

SignBridge combines three complementary layers:

```
┌────────────────────────────────────────────────────────┐
│                   SIGNBRIDGE INDIA                     │
│                                                        │
│   Layer 1: COMMUNICATION ENGINE (MVP Core)             │
│   Camera ──> CV (MediaPipe) ──> Classifier ──> AI      │
│                                                        │
│   Layer 2: CAPABILITY BUILDING                         │
│   Learn ──> Interactive Practice ──> Assessments       │
│                                                        │
│   Layer 3: INSTITUTIONAL ACCESSIBILITY                 │
│   QR Standee Entry ──> Dashboards ──> Readiness Score   │
└────────────────────────────────────────────────────────┘
```

1. **Layer 1 (Communication Engine)**: Real-time 84-keypoint landmark extraction + neural classifier + AI framing system (ISL → Text) AND controlled phrase mapping + animated ISL Avatar (Text → ISL).
2. **Layer 2 (Capability Building)**: 3-minute healthcare-specific ISL lessons with live camera gesture scoring.
3. **Layer 3 (Institutional Platform)**: QR standees, staff progress tracking, and Institutional Readiness Scores ($0-100$).

---

## 4. Key Architectural Decisions

1. **84-Keypoint Landmark Vector (2 Hands)**:
   - Captures 21 3D joint landmarks per hand ($2 \times 21 \times 2 = 84$ normalized coordinates) to support complex two-handed ISL healthcare signs (`HELP`, `NEED`, `DOCTOR`).
2. **Lightweight Model & Overfitting Mitigation**:
   - Uses an optimized ~15,000 parameter MLP classifier (<100 KB file size) trained with subject-based data splitting to prevent frame-leakage overfitting.
3. **Low-End Mobile & Progressive Web App (PWA)**:
   - Runs client-side via WebAssembly (WASM) and ONNX Web at **25–30 FPS on $100 budget Android smartphones**.
   - Zero video streaming over internet—camera frames are processed locally on device for privacy and low 3G bandwidth usage.
4. **Point-of-Service QR Standee Access**:
   - Patients scan a counter QR standee (like Google Pay UPI) to instantly open SignBridge with location context (*"KEM Hospital OPD Desk 1"*) without downloading an app.
5. **Confidence Filtering & Retry Handling**:
   - Predictions with confidence $\ge 0.75$ commit to the sequence buffer; predictions $< 0.75$ trigger a polite UI prompt requesting gesture clarification (FR-05).
6. **Two-Way Communication & Avatar Independence**:
   - Direction A (ISL → Text) and Direction B (Text → Avatar) are separate, independent pipelines.
   - Avatar uses Level 1/2 predefined, validated ISL gesture animations (`PLEASE`, `WAIT`, `HERE`, `GO`, `REGISTRATION`) to ensure 100% linguistic accuracy without hallucinating signs.

---

## 5. Technology Stack

- **Frontend**: Mobile-First Progressive Web App (React / Next.js, HTML5 Camera API, Tailwind CSS, Noto Sans Devanagari fonts, Animated Avatar Player).
- **Computer Vision**: MediaPipe Hands JS (WebAssembly / WebGL runtime, CLAHE low-light pre-filter).
- **Machine Learning**: Python 3.11, TensorFlow / Keras, ONNX Runtime Web, Scikit-learn.
- **Backend API**: Python FastAPI / Uvicorn (Fast REST API endpoints, Pydantic validation).
- **AI Framing & Phrase Mapping**: LLM Prompt Processing for ISL gloss-to-sentence reconstruction (Direction A) & Controlled Healthcare Phrase Service (Direction B).
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM for institutions, staff progress, and analytics).

---

## 6. Repository Structure

```
signbridge-india/
├── README.md                 # Master Project Overview & Getting Started
├── important.md              # Key Technical Decisions & Architectural Insights
├── docker-compose.yml        # Multi-container local orchestration
│
├── frontend/                 # React/Next.js Web Application
│   ├── public/               # Static assets & PWA manifest
│   └── src/
│       ├── components/       # UI components (camera, sequence, language, avatar, dashboard)
│       ├── pages/            # Page views (Home, Communication, Learning, Dashboard)
│       └── services/         # API, ML inference, avatar player, and language framing adapters
│
├── backend/                  # FastAPI Application
│   └── app/
│       ├── api/routes/       # API endpoints (recognition, language, avatar, institutions)
│       ├── services/         # Business, AI framing & avatar phrase logic
│       └── models/           # Database schemas
│
├── ml/                       # Machine Learning Pipeline
│   ├── data/                 # Raw/processed landmark datasets
│   ├── notebooks/            # Model training & evaluation notebooks
│   ├── src/                  # Preprocessing, augmentation, training, evaluation
│   └── models/               # Exported ONNX and Keras models
│
├── data/                     # Metadata & Class Maps
│   ├── class_map/labels.json # Locked MVP class dictionary
│   └── isl_phrases/          # Predefined healthcare phrase & sign sequence maps
│
├── phases/                   # Detailed Phase Documentation (Phase 0 to Phase 12)
│   ├── README.md             # Phase directory index
│   ├── phase_00_project_setup.md
│   ├── phase_01_dataset_recognition.md
│   └── ... (phases 00-12)
│
└── docs/                     # PRD, Architecture & Pilot Documents
```
---

## 7. Quick Start & Local Setup

### Prerequisites
- **Python**: 3.11+
- **Node.js**: v18+
- **Git**

### 1. Clone & Environment Setup
```bash
git clone https://github.com/your-org/signbridge-india.git
cd signbridge-india
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 8. 90-Day Pune Healthcare Pilot Targets

| Metric | Target Goal |
| :--- | :---: |
| Pilot Healthcare Institutions | **3–5** |
| Frontline Staff Enrolled | **100–150+** |
| Staff Completing Basic Training | **75–100+** |
| Active Service Point QR Access Points | **5–10+** |
| Supported Communication Sessions | **500+** |
| Target Communication Success Rate | **$\ge 80\%$** |
| Output Languages | **English, Hindi, Marathi** |

---

## 9. Non-Goals & Scope Limits

To ensure rapid MVP validation, SignBridge explicitly avoids:
- Unrestricted continuous translation of the complete 10,000+ ISL dictionary.
- Unrestricted free-form natural language to continuous 3D ISL avatar generation (fake/hallucinated signs).
- Dependency on Speech-to-Text or Text-to-Speech for initial MVP.
- Position as a replacement for certified human ISL interpreters in clinical/medical diagnosis.
- Payment, subscription, or monetization features during pilot.

---

## 10. License & Acknowledgments

Developed under **YUVA Future 6.0 (Young Indians, CII)**.
