# How to Run SignBridge

SignBridge uses a high-performance **client-side MediaPipe 21-node hand tracker** combined with a **Flask ML backend (84-feature Keras MLP model + Gemini AI Brain)**.

---

## 1. Environment Setup (Gemini API Key)
To enable the AI Brain (smart sentence framing), create/update the `.env` file in the root project folder:

```env
GEMINI_API_KEY=your-api-key-here
```
*(If omitted, sign recognition will continue to work normally with standard sentence output).*

---

## 2. Start the Flask Backend (ML & AI Server)
Open a terminal and start the Flask server:

```powershell
cd "d:\Pushkar\Pushkar\Personal Projects\SignBridge\backend"
python app.py
```
* **Desktop endpoint:** `https://localhost:5000` (or `http://localhost:5000`)
* **Mobile endpoint:** `https://<YOUR_LOCAL_IP>:5000`

---

## 3. Start the Modern React Frontend (Vite)
Open a **second, separate terminal** and start the Vite dev server:

```powershell
cd "d:\Pushkar\Pushkar\Personal Projects\SignBridge\frontend"
npm install
npm run dev
```

---

## 4. Access the Application
Once both servers are running:

* **Desktop:** Open `http://localhost:3000` in your web browser.
* **Mobile:** Connect your mobile device to the same Wi-Fi network and open `http://<YOUR_LOCAL_IP>:3000` (or `http://192.168.56.1:3000`).

---

## 5. Architecture Summary
1. **Client-Side Vision (30 FPS):** Loads MediaPipe Hands via CDN in browser to track 21 landmark nodes per hand and render green glowing bounding boxes with 0 latency.
2. **Hand Crop Transmission:** Crops the exact hand bounding box and sends base64 image payload to `/predict` every ~350ms.
3. **ML Classifier:** Flask extracts 84 normalized features and runs `signbridge_model_v1.h5` to return predicted label (A–Z, 1–9) and top-3 confidence ranks.
4. **Hold Timer (1.5s):** Continuous holding of a sign for 1.5 seconds locks the character into the active sentence.
5. **AI Sentence Construction:** Calls `/api/suggest` (Gemini API) to reframe raw sign strings into natural English sentences.

---

## 6. Retraining the Neural Network (Optional)
To retrain the 84-feature MLP model:
```powershell
cd "d:\Pushkar\Pushkar\Personal Projects\SignBridge\src\ml_pipeline"
# 1. Extract 84-landmark vectors from raw image dataset
python generate_dataset.py
# 2. Train model and save signbridge_model_v1.h5
python train_model.py
```

