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

## 📱 4. Mobile Access Guide (Step-by-Step)

Follow these steps to open SignBridge on your mobile smartphone:

### Step 1: Connect Both Devices to Same Network
* Turn on your Mobile Hotspot and connect your laptop to it, **OR** connect both laptop and mobile to the same Wi-Fi router.

### Step 2: Find Your Laptop's IP Address
Open PowerShell on your laptop and run:
```powershell
ipconfig
```
Look for **`IPv4 Address`** under your active Wi-Fi adapter (e.g., `10.254.221.109` or `192.168.1.5`).

### Step 3: Open HTTPS Link on Mobile Browser
Mobile browsers (Chrome / Safari) **require an HTTPS origin** to grant camera permissions (`getUserMedia`). 

On your mobile phone browser, open:
```text
https://<YOUR_LAPTOP_IP>:3000
```
*(Example: `https://10.254.221.109:3000`)*

---

### Step 4: Accept the 1-Time Local SSL Warning on Mobile
Because the dev server uses a local self-signed SSL certificate:
1. When your phone opens `https://10.254.221.109:3000`, Chrome/Safari will display a security warning: *"Your connection is not private"* or *"Site Security Warning"*.
2. Tap **Advanced** (or *Show Details*).
3. Tap **Proceed to 10.254.221.109 (unsafe)** or **Visit this website**.
4. Tap **Turn On Camera** and grant camera permissions! 🎥

---

### ⚠️ Troubleshooting: If Phone Says *"Site can't be reached"*
Windows blocks incoming network connections on Public Wi-Fi profiles by default. Fix it in 15 seconds:

* **Fix Option A (Easiest):**
  1. Open laptop **Settings** (`Win + I`) → **Network & Internet** → **Wi-Fi**.
  2. Click your mobile hotspot network.
  3. Change *Network Profile Type* from **Public Network** to **Private Network**.

* **Fix Option B (Firewall App Permission):**
  1. Open Windows Search → Type **"Allow an app through Windows Firewall"**.
  2. Click **Change settings** → Find **Node.js** and **Python** → Check both **Private** and **Public** boxes → Click **OK**.

Refresh your mobile browser, tap **Turn On Camera**, and test live gesture translation!

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
