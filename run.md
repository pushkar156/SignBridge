# 🚀 How to Run & Setup SignBridge (First-Time Guide)

Welcome to **SignBridge**! This guide will walk you step-by-step through setting up, running, testing on mobile, and optionally retraining the machine learning model.

---

## 📋 1. Prerequisites

Make sure you have the following installed on your machine:
* **Python 3.10+**
* **Node.js 18+** & `npm`
* **Git**

---

## 🛠️ 2. First-Time Setup

### Step A: Clone Repository & Setup Python Dependencies
Open your terminal in the project root folder:
```powershell
# 1. Install Python backend dependencies
pip install -r requirements.txt
```

### Step B: Setup React Frontend Dependencies
```powershell
# 2. Navigate to frontend folder and install node modules
cd frontend
npm install
cd ..
```

### Step C: Environment Configuration (`.env`)
Create a `.env` file in the root project folder (or copy from `.env.example`):
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
> 💡 **Get a free Gemini API key:** Go to [Google AI Studio (aistudio.google.com/app/apikey)](https://aistudio.google.com/app/apikey) and click **Create API key**.

---

## 🏃 3. Running the Application

To run SignBridge, you need **two terminal windows** open simultaneously:

### Terminal 1: Start Python Backend (Flask + TensorFlow)
```powershell
cd backend
python app.py
```
* **Backend Endpoint:** `http://localhost:5000`

---

### Terminal 2: Start React Frontend (Vite)
```powershell
cd frontend
npm run dev
```
* **Frontend UI:** `http://localhost:3000`

---

## 📱 4. Mobile Setup (Same Wi-Fi / Hotspot)

To access SignBridge on your mobile phone:

1. Connect your phone and laptop to the **same Wi-Fi network** or **mobile hotspot**.
2. Find your laptop's IPv4 address:
   ```powershell
   ipconfig
   ```
   *(Look for `IPv4 Address` under Wi-Fi, e.g. `10.254.221.109` or `192.168.1.5`).*
3. Open your mobile browser and go to:
   ```text
   http://<YOUR_LAPTOP_IP>:3000
   ```
   *(Example: `http://10.254.221.109:3000`)*

> ⚠️ **Windows Firewall Note:** If your phone says *"Site can't be reached"*, change your Wi-Fi profile from **Public** to **Private** in *Windows Settings → Network & Internet → Wi-Fi*, or allow ports `3000` & `5000` through Windows Firewall.

---

## 🧠 5. Retraining the Neural Network (Optional)

If you add new training images or want to retrain the 42-feature Keras landmark model:

```powershell
# 1. Navigate to ML pipeline folder
cd backend/ml_pipeline

# 2. Extract 42 wrist-relative landmark coordinates from raw image dataset into dataset.csv
python generate_dataset.py

# 3. Train Keras sequential neural network and save signbridge_model_v1.h5
python train_model.py
```

---

## 📁 6. Repository Overview

```text
SignBridge/
├── backend/
│   ├── app.py                      # Flask API Server (/predict & /health)
│   ├── models/
│   │   └── hand_landmarker.task    # MediaPipe HandLandmarker Task file
│   └── ml_pipeline/
│       ├── signbridge_model_v1.h5  # Trained Keras 42-feature landmark classifier
│       ├── generate_dataset.py     # Offline landmark extraction script
│       └── train_model.py          # Offline neural network training script
├── frontend/                       # React + Vite + Tailwind CSS User Interface
│   ├── src/components/             # LiveCommunicator, SequenceBuilder, AISuggestionCard, etc.
│   └── src/services/api.ts         # Browser API integration (Gemini & Flask)
├── .env / .env.example             # Environment configuration file
├── requirements.txt                # Python backend package dependencies
└── run.md                          # First-Time setup & command guide
```
