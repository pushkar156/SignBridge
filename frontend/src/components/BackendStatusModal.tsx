import React, { useState } from 'react';
import { BackendConnectionStatus } from '../types';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, checkBackendHealth } from '../services/api';
import { 
  X, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendStatus: BackendConnectionStatus;
  onStatusChange: (status: BackendConnectionStatus) => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({
  isOpen,
  onClose,
  backendStatus,
  onStatusChange,
}) => {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isOnline: boolean; latencyMs?: number; message?: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await checkBackendHealth(currentUrl);
      setTestResult(result);
      if (result.isOnline) {
        onStatusChange('connected');
      } else {
        onStatusChange('offline');
      }
    } catch (err) {
      setTestResult({ isOnline: false, message: String(err) });
      onStatusChange('offline');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveUrl = () => {
    setApiBaseUrl(currentUrl);
    handleTestConnection();
  };

  const handleResetDefault = () => {
    resetApiBaseUrl();
    const def = getApiBaseUrl();
    setCurrentUrl(def);
  };

  const sampleFlaskCode = `# app.py - SignBridge Flask Backend
from flask import Flask, request, jsonify
from flask_cors import CORS
# from mediapipe_classifier import predict_hand_sign

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "model": "ISL-35-Classes-MediaPipe"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_base64 = data.get('image')
    # Process with MediaPipe HandLandmarker + Keras model...
    # Return { "label": "A", "confidence": 0.94, "top3": [...] }
    return jsonify({
        "label": "A",
        "confidence": 0.94,
        "top3": [{"label": "A", "conf": 0.94}, {"label": "S", "conf": 0.03}, {"label": "E", "conf": 0.02}]
    })

@app.route('/api/suggest', methods=['POST'])
def suggest():
    data = request.get_json()
    raw_text = data.get('text', '')
    # Call Gemini model server-side to format into natural sentence
    return jsonify({"suggested": "Hello, how can I help you today?"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`;

  const copyFlaskSnippet = () => {
    navigator.clipboard.writeText(sampleFlaskCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div 
      id="backend-status-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="backend-status-modal"
        className="bg-white dark:bg-[#19221D] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-[#283830] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-[#283830] bg-[#FAF8F3] dark:bg-[#141C18] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${backendStatus === 'connected' ? 'bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6]' : 'bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] border border-[#FFEDD5] dark:border-[#4B301F]'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183D32] dark:text-[#F0F5F2] leading-tight flex items-center gap-2">
                <span>Flask Backend Connection</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
              </h2>
              <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7]">
                MediaPipe HandLandmarker + TensorFlow/Keras + Gemini Sentence Assist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-[#233128] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            backendStatus === 'connected'
              ? 'bg-emerald-50 dark:bg-[#14291E] border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
              : backendStatus === 'checking'
              ? 'bg-amber-50 dark:bg-[#2A2215] border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
              : 'bg-[#F7F3EA] dark:bg-[#1F2923] border-[#E8E2D2] dark:border-[#2D3F34] text-[#252A27] dark:text-[#D5E2DB]'
          }`}>
            {backendStatus === 'connected' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : backendStatus === 'checking' ? (
              <RefreshCw className="w-5 h-5 text-[#D69A4A] animate-spin shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#D69A4A] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-sm">
                {backendStatus === 'connected'
                  ? 'SignBridge AI is Connected & Ready'
                  : backendStatus === 'checking'
                  ? 'Testing connection to Python Flask server...'
                  : 'SignBridge AI is currently on Standby'}
              </div>
              <p className="text-xs mt-1 text-[#6E756F] dark:text-[#9FB0A7]">
                {backendStatus === 'connected'
                  ? 'Frames captured from your camera are streamed to the MediaPipe + Keras pipeline via POST /predict.'
                  : 'Start your Python Flask backend on the target machine, or update the Base URL below if running on ngrok or a local network IP.'}
              </p>
              {testResult?.latencyMs && (
                <span className="inline-block mt-2 text-[11px] font-mono bg-[#E8F0EC] dark:bg-[#223B2E] text-[#183D32] dark:text-[#76CBA6] px-2.5 py-0.5 rounded-full font-bold">
                  Latency: {testResult.latencyMs} ms
                </span>
              )}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Backend API Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="http://localhost:5000"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#183D32] focus:border-transparent font-mono bg-[#FAF8F3] dark:bg-[#131B16] text-[#202522] dark:text-[#E2EAE5]"
              />
              <button
                onClick={handleSaveUrl}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-[#183D32] dark:bg-[#2F6B57] text-white text-sm font-semibold hover:bg-[#204E40] dark:hover:bg-[#275848] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save & Test'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>Default: <code className="text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#1D2821] px-1 py-0.5 rounded">http://localhost:5000</code> or <code className="text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#1D2821] px-1 py-0.5 rounded">VITE_API_BASE_URL</code></span>
              <button
                onClick={handleResetDefault}
                className="text-[#4F765E] dark:text-[#76CBA6] hover:underline font-semibold"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Integration API Specification Quick Reference */}
          <div className="border border-stone-200 dark:border-[#283830] rounded-2xl overflow-hidden">
            <div className="bg-[#FAF8F3] dark:bg-[#141C18] px-4 py-2.5 border-b border-stone-200 dark:border-[#283830] flex items-center justify-between">
              <span className="text-xs font-bold text-[#183D32] dark:text-[#76CBA6] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#4F765E] dark:text-[#4ADE80]" /> Flask API Contract
              </span>
              <button
                onClick={copyFlaskSnippet}
                className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs flex items-center gap-1 font-semibold"
                title="Copy sample Flask code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D69A4A]" />}
                {copiedCode ? 'Copied' : 'Copy Flask Boilerplate'}
              </button>
            </div>
            <div className="p-4 bg-[#183D32] dark:bg-[#102018] text-[#F7F3EA] font-mono text-xs overflow-x-auto space-y-2">
              <div><span className="text-[#D69A4A] font-bold">POST</span> <span className="text-emerald-300">/predict</span> <span className="text-stone-400">→ Body:</span> <span className="text-[#F7F3EA]">{`{ "image": "data:image/jpeg;base64,..." }`}</span></div>
              <div><span className="text-[#D69A4A] font-bold">POST</span> <span className="text-emerald-300">/api/suggest</span> <span className="text-stone-400">→ Body:</span> <span className="text-[#F7F3EA]">{`{ "text": "HELLO" }`}</span></div>
              <div><span className="text-emerald-400 font-bold">GET</span> <span className="text-emerald-300">/health</span> <span className="text-stone-400">→ Returns:</span> <span className="text-[#F7F3EA]">{`{ "status": "online" }`}</span></div>
            </div>
          </div>

          {/* Instructions to Run Flask */}
          <div className="bg-[#FAF8F3] dark:bg-[#141C18] p-4 rounded-2xl border border-[#E8E2D2] dark:border-[#283830] text-xs space-y-2 text-stone-700 dark:text-stone-300">
            <div className="font-bold text-[#183D32] dark:text-[#76CBA6] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#4F765E] dark:text-[#4ADE80]" /> How to Run Backend Locally
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#6E756F] dark:text-[#9FB0A7]">
              <li>Open terminal in your Flask project directory</li>
              <li>Activate virtualenv: <code className="bg-white dark:bg-[#1E2822] px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200">source venv/bin/activate</code></li>
              <li>Install dependencies: <code className="bg-white dark:bg-[#1E2822] px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200">pip install flask flask-cors mediapipe tensorflow google-genai</code></li>
              <li>Start Flask: <code className="bg-white dark:bg-[#1E2822] px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200">python app.py</code> (runs on port 5000 with CORS enabled)</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F3] dark:bg-[#141C18] border-t border-stone-100 dark:border-[#283830] rounded-b-3xl flex items-center justify-between">
          <div className="text-xs text-[#6E756F] dark:text-[#9FB0A7]">
            Status changes update automatically during live camera capture.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#183D32] dark:bg-[#2F6B57] text-white text-xs font-bold hover:bg-[#204E40] dark:hover:bg-[#275848] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
