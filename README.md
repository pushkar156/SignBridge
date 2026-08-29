# SignBridge India 🤟🇮🇳

**Multilingual Indian Sign Language (ISL) Communication & Institutional Accessibility Platform**

**Programme:** YUVA Future 6.0 · Young Indians (Yi), CII  
**Track:** Accessibility  
**Initial Pilot:** Healthcare (Pune, Maharashtra)  
**Target Languages:** English, Hindi (हिंदी), Marathi (मराठी)  

---

## 1. Executive Summary

**SignBridge India** bridges the communication barrier between Indian Sign Language (ISL) users and frontline public-service employees (doctors, nurses, receptionists, clerks). 

The application provides a real-time, low-latency **Two-Way Communication Bridge**:

```text
[ Direction A: ISL Gesture → Multilingual Text & Speech ]
[ Camera Feed ] ──> [ MediaPipe 21 Landmarks ] ──> [ 42-Feature Keras Model (35 Classes) ] ──> [ Hold Timer ] ──> [ Gboard Predictive Chips ] ──> [ Gemini AI Autocorrect ] ──> [ Speech TTS ]

[ Direction B: Hearing Person Text → Visual Sign Cards & Audio ]
[ Hearing Staff ] ──> [ Type / Preset Phrase ] ──> [ Visual Sign Sequence Cards ] ──> [ Speech Audio ] ──> [ Deaf User ]
```

Beyond real-time gesture recognition, SignBridge provides a complete **institutional accessibility ecosystem** combining point-of-service QR access, bite-sized ISL staff training, and an institutional readiness dashboard.

---

## 2. Core Features (MVP Complete)

* ⌨️ **Gboard Predictive Word Suggestions**: Dynamic word completion chips (`[ HELLO ↵ ]`, `[ HELP ↵ ]`, `[ HEALTH ↵ ]`) appear under the sequence builder for fast gesture typing.
* 🤖 **Gemini AI Autocorrect & Restructuring**: Instant AI polishing (`HELLZ` → **`Hello`**) and sign gloss restructuring via Gemini 3.6 Flash.
* ↔️ **Two-Way Communication Card**: Non-signing hearing users can type or speak replies, which are instantly rendered into visual sign badges for the deaf user alongside audio playback.
* 🚑 **Quick Emergency Presets**: One-tap healthcare shortcuts (`Need Help`, `Hospital`, `Thank You`, `I am Deaf`, `Need Water`).
* 📱 **Mobile Access over Local Network**: Access the web app on any smartphone browser over local Wi-Fi / Hotspot with full camera tracking (`https://<YOUR_IP>:3000`).

---

## 3. Technology Stack

* **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide React Icons, `@vitejs/plugin-basic-ssl`.
* **Backend API**: Python 3.11, Flask (`backend/app.py`), OpenCV, NumPy, Pandas.
* **Computer Vision**: MediaPipe HandLandmarker Task API (21 3D landmarks per hand).
* **Machine Learning**: Custom 42-feature wrist-relative Keras Sequential Neural Network (`backend/ml_pipeline/signbridge_model_v1.h5`).
* **AI Engine**: Google Gemini 3.6 Flash Client REST API (Gboard-style autocorrect & sentence reconstruction).

---

## 4. Repository Structure

```text
SignBridge/
├── backend/
│   ├── app.py                      # Flask API Server (/predict & /health)
│   ├── models/
│   │   └── hand_landmarker.task    # MediaPipe HandLandmarker Task file
│   └── ml_pipeline/
│       ├── signbridge_model_v1.h5  # Active 42-feature Keras landmark classifier
│       ├── generate_dataset.py     # Offline landmark extraction script
│       └── train_model.py          # Offline neural network training script
├── frontend/                       # React + Vite + Tailwind CSS User Interface
│   ├── src/components/             # LiveCommunicator, SequenceBuilder, TwoWayCommunicatorCard, etc.
│   └── src/services/api.ts         # Browser API integration (Gemini & Flask)
├── .env / .env.example             # Environment configuration file
├── requirements.txt                # Python backend dependencies
└── run.md                          # Detailed setup & execution guide
```

---

## 5. Quick Start

### 1. Start Python Backend
```powershell
cd backend
pip install -r ../requirements.txt
python app.py
```
* **Endpoint:** `http://localhost:5000`

### 2. Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
* **Desktop UI:** `http://localhost:3000`
* **Mobile UI:** `https://<YOUR_LAPTOP_IP>:3000` *(accept local SSL warning on first load)*

> 📖 **Full First-Time User & Mobile Guide:** See **[`run.md`](file:///d:/Pushkar/Pushkar/Personal%20Projects/SignBridge/run.md)** for detailed mobile hotspot & model retraining instructions.

---

## 6. License & Acknowledgments

Developed for **YUVA Future 6.0 (Young Indians, CII)** under the Accessibility Track.
