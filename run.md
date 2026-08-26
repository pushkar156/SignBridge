# How to Run SignBridge

SignBridge uses a Flask backend with a MediaPipe Tasks API pipeline and a custom Keras Deep Learning model. To run it, follow these instructions:

## 1. Set Environment Variables (Optional)
If you want the AI brain (smart sentence framing) to work, you need to open the `.env` file located in the root of the project and paste your Gemini API key:

```text
GEMINI_API_KEY=your-api-key-here
```

*Note: If you do not set this, the AI brain will be disabled, but the sign recognition will still work.*

## 2. Run the Backend Server
Navigate to the `src` directory (which contains the final, clean server) and run `app.py`:

```powershell
cd "d:\Pushkar\Pushkar\Personal Projects\SignBridge\src"
python app.py
```

## 3. Access the App
Once the server starts, it will print out two URLs. 

**On Desktop:**
Go to `https://localhost:5000` in your web browser.

**On Mobile:**
Make sure your phone is connected to the same Wi-Fi network as your computer. Go to the mobile IP address printed in your terminal (for example: `https://192.168.1.34:5000`).

> [!WARNING]
> Because we are using a self-signed HTTPS certificate (required for mobile browsers to allow Camera access), you will see a security warning on your browser. 
> 
> **How to bypass it on Mobile Chrome:** Click `Advanced` -> `Proceed to 192.168.x.x (unsafe)`.

## 4. Retraining the Model (Optional)
If you ever want to retrain the neural network with new Kaggle images, navigate to the `ml_pipeline` folder:
```powershell
cd "d:\Pushkar\Pushkar\Personal Projects\SignBridge\src\ml_pipeline"
# 1. Generate 84-feature dataset from images
python generate_dataset.py
# 2. Augment data and train the neural network
python train_model.py
```
This will automatically overwrite `signbridge_model_v1.h5` which the live server uses.
