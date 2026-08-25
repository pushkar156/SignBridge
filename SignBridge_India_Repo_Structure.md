# SignBridge India - Repository Structure

This repository structure is designed for the SignBridge India MVP and keeps the **frontend, backend, AI/CV model, data, institutional features and documentation modular**.

The most important principle is that the recognition model should be replaceable without requiring the entire application to be rebuilt.

---

## 1. Recommended Repository Structure

```text
signbridge-india/
│
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── MODEL.md
│   ├── DATASET.md
│   ├── DEPLOYMENT.md
│   ├── TESTING.md
│   └── PILOT.md
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── icons/
│   │   ├── images/
│   │   └── demo/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── camera/
│       │   ├── recognition/
│       │   ├── communication/
│       │   ├── language/
│       │   ├── avatar/
│       │   │   ├── AvatarPlayer
│       │   │   ├── PhraseSelector
│       │   │   └── AvatarControls
│       │   ├── learning/
│       │   └── dashboard/
│       │
│       ├── pages/
│       │   ├── Home/
│       │   ├── Communication/
│       │   ├── Learning/
│       │   ├── Institution/
│       │   └── Dashboard/
│       │
│       ├── hooks/
│       ├── services/
│       │   ├── api/
│       │   ├── recognition/
│       │   └── language/
│       │
│       ├── state/
│       ├── utils/
│       ├── constants/
│       ├── types/
│       ├── styles/
│       └── App.*
│
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── recognition.py
│   │   │   │   ├── communication.py
│   │   │   │   ├── language.py
│   │   │   │   ├── institutions.py
│   │   │   │   ├── training.py
│   │   │   │   └── feedback.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── services/
│   │   │   ├── recognition_service.py
│   │   │   ├── sequence_service.py
│   │   │   ├── language_service.py
│   │   │   ├── communication_service.py
│   │   │   ├── avatar_service.py
│   │   │   ├── phrase_service.py
│   │   │   ├── institution_service.py
│   │   │   └── training_service.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── institution.py
│   │   │   ├── session.py
│   │   │   ├── training.py
│   │   │   ├── assessment.py
│   │   │   └── feedback.py
│   │   │
│   │   ├── schemas/
│   │   ├── database/
│   │   ├── config/
│   │   └── utils/
│   │
│   └── tests/
│       ├── unit/
│       └── integration/
│
├── ml/
│   ├── README.md
│   │
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   ├── train/
│   │   ├── validation/
│   │   └── test/
│   │
│   ├── notebooks/
│   │   ├── data_exploration.ipynb
│   │   ├── training_experiments.ipynb
│   │   └── evaluation.ipynb
│   │
│   ├── src/
│   │   ├── preprocessing/
│   │   │   ├── preprocessing.py
│   │   │   └── augmentation.py
│   │   │
│   │   ├── training/
│   │   │   ├── train.py
│   │   │   └── config.py
│   │   │
│   │   ├── evaluation/
│   │   │   ├── evaluate.py
│   │   │   ├── metrics.py
│   │   │   └── confusion_matrix.py
│   │   │
│   │   └── inference/
│   │       ├── predictor.py
│   │       └── model_loader.py
│   │
│   ├── models/
│   │   ├── checkpoints/
│   │   ├── exported/
│   │   └── metadata/
│   │
│   └── tests/
│       ├── test_preprocessing.py
│       ├── test_inference.py
│       └── test_model.py
│
├── data/
│       ├── README.md
│       ├── class_map/
│       │   └── labels.json
│       ├── isl_phrases/
│       │   ├── phrases.json
│       │   └── sign_mapping.json
│       └── samples/
│           └── .gitkeep
│
├── scripts/
│   ├── setup.sh
│   ├── seed_database.py
│   ├── prepare_dataset.py
│   └── run_local.sh
│
└── tests/
    ├── e2e/
    ├── api/
    └── frontend/
```

---

# 2. Folder Responsibilities

## `/frontend`

Contains the user-facing SignBridge application.

Main responsibilities:

- Landing page
- Communication interface
- Camera interface
- Recognition display
- Confidence feedback
- Sequence display
- Language selection
- Generated text
- Learning interface
- Institution dashboard

The frontend should **not contain model-training logic**.

---

## `/backend`

Contains application/API logic.

Responsibilities:

- API endpoints
- Communication sessions
- Model inference orchestration
- AI language-processing integration
- Institution data
- Training data
- Assessment data
- Feedback
- Analytics

The backend should communicate with the ML layer through a clean interface.

---

## `/ml`

Contains all machine-learning work.

Responsibilities:

- Dataset preprocessing
- Training
- Validation
- Evaluation
- Model export
- Inference

The ML directory should be independent enough that the recognition model can be retrained or replaced without changing the frontend architecture.

---

## `/data`

Contains lightweight metadata and sample data.

Do **not** commit large raw datasets to Git unless explicitly intended.

For large datasets, document:

- source
- licensing/permission
- structure
- download/preparation process

---

## `/docs`

Contains project documentation.

Recommended documents:

### `PRD.md`

Product requirements and scope.

### `ARCHITECTURE.md`

System architecture and data flow.

### `API.md`

Backend API contracts.

### `MODEL.md`

Model architecture, input/output, training and evaluation.

### `DATASET.md`

Dataset source, classes, preprocessing and validation.

### `DEPLOYMENT.md`

Local, staging and production deployment.

### `TESTING.md`

Testing strategy.

### `PILOT.md`

Pune healthcare pilot workflow and measurement.

---

# 3. Frontend Structure

## `/frontend/src/components`

Reusable UI components.

### `/camera`

Examples:

```text
CameraView
CameraPermission
CameraControls
FrameStatus
```

### `/recognition`

Examples:

```text
RecognitionResult
ConfidenceIndicator
RecognitionStatus
RetryPrompt
```

### `/communication`

Examples:

```text
CommunicationPanel
SequenceDisplay
GeneratedMessage
SessionControls
```

### `/language`

Examples:

```text
LanguageSelector
LanguageBadge
```

### `/avatar`

Examples:

```text
AvatarPlayer
PhraseSelector
QuickPhraseButtons
AvatarControls
```

### `/learning`

Examples:

```text
LessonCard
PracticeCard
Quiz
ProgressBar
```

### `/dashboard`

Examples:

```text
StaffProgress
TrainingStats
SessionStats
ReadinessScore
InstitutionOverview
```

---

# 4. Frontend Pages

## `/pages/Home`

Landing page.

Primary actions:

```text
Start Communication
Learn ISL
Institution Login
```

## `/pages/Communication`

The most important MVP page.

It should contain:

```text
Camera
 ↓
Recognition
 ↓
Sequence
 ↓
Generated Message
 ↓
Language
```

## `/pages/Learning`

ISL training/practice.

## `/pages/Institution`

Institution onboarding/access.

## `/pages/Dashboard`

Institution-level monitoring.

---

# 5. Frontend Services

## `/services/recognition`

Handles communication with the recognition system.

Example:

```text
recognizeFrame()
getPrediction()
getConfidence()
```

## `/services/language`

Handles AI language processing.

Example:

```text
generateSentence()
translateOutput()
```

## `/services/api`

Centralised API communication.

Do not scatter raw HTTP/API calls throughout UI components.

---

# 6. Backend Architecture

Recommended flow:

```text
Frontend
   ↓
API
   ↓
Service Layer
   ↓
Model / AI / Database
```

Avoid putting business logic directly inside API route handlers.

---

# 7. Backend Services

## `recognition_service.py`

Responsibilities:

- Receive recognition request
- Load/use the recognition model
- Return class + confidence
- Handle inference errors

Example response:

```json
{
  "class": "HELP",
  "confidence": 0.94
}
```

---

## `sequence_service.py`

Responsibilities:

- Maintain recognised sequence
- Add predictions
- Remove predictions
- Clear sequence
- Prepare sequence for language processing

---

## `language_service.py`

Responsibilities:

- Send sequence to language model
- Generate coherent sentence
- Return selected language output
- Handle failures/fallbacks

---

## `communication_service.py`

Responsibilities:

- Create communication sessions
- Track session state
- Record appropriate non-sensitive usage metrics
- Connect recognition + sequence + language layers

---

## `avatar_service.py`

Responsibilities:

- Render/resolve ISL sign sequence animations
- Serve avatar animation assets/metadata
- Handle animation playback state (Play/Pause/Replay)

---

## `phrase_service.py`

Responsibilities:

- Maintain controlled healthcare phrase library
- Match receptionist text input to validated ISL phrase sequences
- Handle medical escalation triggers for complex clinical queries

---

## `institution_service.py`

Responsibilities:

- Institution profiles
- Staff
- Service points
- QR configuration
- Basic readiness data

---

## `training_service.py`

Responsibilities:

- Lessons
- Progress
- Assessments
- Completion

---

# 8. ML Structure

The ML pipeline should be:

```text
Raw Dataset
    ↓
Cleaning
    ↓
Preprocessing
    ↓
Train / Validation / Test Split
    ↓
Augmentation
    ↓
CNN Training
    ↓
Evaluation
    ↓
Model Export
    ↓
Inference
```

---

# 9. ML Dataset Structure

Recommended:

```text
ml/data/
├── raw/
├── processed/
├── train/
├── validation/
└── test/
```

Example:

```text
train/
├── class_A/
├── class_B/
├── class_C/
└── ...
```

The actual number of classes must match the validated MVP scope.

---

# 10. Class Metadata

Keep a class mapping file:

```text
data/class_map/labels.json
```

Example:

```json
{
  "0": {
    "label": "HELP",
    "type": "supported_sign",
    "validated": true
  },
  "1": {
    "label": "I",
    "type": "supported_character",
    "validated": true
  }
}
```

The exact labels must come from the validated dataset.

Do not invent labels simply to populate the demo.

---

# 11. Model Interface

The model should return a predictable structure:

```json
{
  "class": "HELP",
  "confidence": 0.94
}
```

Multiple results:

```json
{
  "predictions": [
    {
      "class": "I",
      "confidence": 0.96
    },
    {
      "class": "NEED",
      "confidence": 0.91
    },
    {
      "class": "HELP",
      "confidence": 0.94
    }
  ]
}
```

The frontend should not know whether the model is:

- TensorFlow
- PyTorch
- ONNX
- TensorFlow.js
- another implementation

Only the interface matters.

---

# 12. Model Versioning

Use explicit model versions.

Example:

```text
models/
├── v0.1/
├── v0.2/
└── v1.0/
```

Each version should document:

- supported classes
- dataset version
- training date
- evaluation results
- known limitations

Never overwrite a validated model without versioning it.

---

# 13. API Structure

Suggested endpoints:

```text
/api/recognition
/api/communication
/api/language
/api/avatar
/api/institutions
/api/training
/api/assessment
/api/feedback
```

### Avatar & Reverse Communication

```text
POST /api/avatar/translate
GET /api/avatar/phrases
```

Example request (`POST /api/avatar/translate`):

```json
{
  "text": "Please wait here.",
  "language": "en"
}
```

Example response:

```json
{
  "phrase_id": "please_wait",
  "isl_sequence": ["PLEASE", "WAIT", "HERE"],
  "animation_urls": [
    "/assets/avatar/signs/PLEASE.mp4",
    "/assets/avatar/signs/WAIT.mp4",
    "/assets/avatar/signs/HERE.mp4"
  ],
  "validated": true
}
```

Example:

### Recognition

```text
POST /api/recognition/predict
```

Response:

```json
{
  "class": "HELP",
  "confidence": 0.94
}
```

### Language Processing

```text
POST /api/language/generate
```

Request:

```json
{
  "sequence": ["I", "NEED", "HELP"],
  "language": "en"
}
```

Response:

```json
{
  "text": "I need help."
}
```

---

# 14. Database Structure

A simple MVP database can contain:

```text
users
institutions
staff
training_progress
assessments
communication_sessions
service_points
feedback
```

Do not over-normalise the database before the MVP requirements are stable.

---

# 15. Communication Session Structure

Conceptual record:

```json
{
  "session_id": "...",
  "institution_id": "...",
  "language": "mr",
  "started_at": "...",
  "prediction_count": 3,
  "completed": true
}
```

Avoid storing raw camera video unless there is a specific, justified and consented requirement.

---

# 16. Environment Variables

Use:

```text
.env
.env.example
```

Example:

```text
API_BASE_URL=
DATABASE_URL=
AI_API_KEY=
MODEL_PATH=
```

Never commit real secrets.

`.env` must be in `.gitignore`.

---

# 17. Testing Structure

Testing should exist at multiple levels.

## Unit Tests

Test:

- preprocessing
- model inference interface
- sequence construction
- language service
- database services

## Integration Tests

Test:

```text
Frontend → Backend
Backend → Model
Backend → AI
Backend → Database
```

## End-to-End Tests

Test:

```text
Open communication
 ↓
Camera
 ↓
Recognition
 ↓
Sequence
 ↓
Language processing
 ↓
Output
```

---

# 18. Development Order

The repository should be developed in this order:

```text
1. Project setup
       ↓
2. ML dataset/model
       ↓
3. Camera/CV
       ↓
4. Recognition API
       ↓
5. Sequence
       ↓
6. AI language layer
       ↓
7. Multilingual output
       ↓
8. Communication UI
       ↓
9. QR/service workflow
       ↓
10. Learning
       ↓
11. Institution dashboard
       ↓
12. Pilot analytics
```

---

# 19. Git Branching

Recommended simple workflow:

```text
main
  │
  ├── develop
  │
  ├── feature/frontend
  ├── feature/recognition
  ├── feature/ml-model
  ├── feature/language
  ├── feature/dashboard
  └── feature/learning
```

For a small hackathon team, avoid excessive branching complexity.

---

# 20. What Should NOT Go Into Git

Do not commit:

```text
.env
API keys
passwords
large raw datasets
private user data
raw user videos
model cache files
node_modules/
Python virtual environments
temporary files
IDE-specific files
```

Use `.gitignore`.

---

# 21. Suggested Root README

The root `README.md` should contain:

1. Project overview
2. Problem
3. Product vision
4. MVP flow
5. Architecture
6. Tech stack
7. Repository structure
8. Setup instructions
9. Environment variables
10. Running frontend
11. Running backend
12. Running ML inference
13. Dataset setup
14. Model information
15. Testing
16. Current limitations
17. Roadmap

---

# 22. MVP vs Future Code Boundary

Keep future features separated.

For example:

```text
src/
├── core/
│   ├── communication/
│   ├── recognition/
│   └── language/
│
├── platform/
│   ├── learning/
│   ├── institution/
│   └── analytics/
│
└── future/
    ├── speech/
    ├── two-way/
    └── advanced-recognition/
```

This prevents future concepts from becoming tangled with the MVP.

---

# 23. Most Important Architectural Rule

The frontend must not directly depend on the internal CNN implementation.

Use:

```text
Frontend
   ↓
Recognition Interface
   ↓
Inference Service
   ↓
Current Model
```

Later:

```text
Current CNN
     ↓
Replace with improved model
     ↓
Same interface
```

This allows the recognition technology to evolve without rewriting the product.

---

# 24. Final Repository Principle

The repository should make the following architecture obvious:

```text
                    SIGNBRIDGE INDIA
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     Communication      Learning       Institution
          │                │                │
       Camera          Lessons          Dashboard
          │             Practice         Staff
          ↓             Assessment       Readiness
       CV/CNN
          ↓
      Confidence
          ↓
      Sequence
          ↓
   AI Language Layer
          ↓
 English / Hindi / Marathi
          ↓
    Non-ISL User
```

The **communication engine is the MVP core**.

Learning and institutional readiness are the platform layer around it.

The architecture must remain modular so that future recognition improvements, speech, larger vocabularies and additional languages can be added without rebuilding the entire system.
