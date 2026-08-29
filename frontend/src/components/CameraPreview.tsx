import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PredictionResponse, BackendConnectionStatus } from '../types';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  FlipHorizontal, 
  Eye, 
  EyeOff, 
  Hand,
  ShieldAlert,
  Activity
} from 'lucide-react';

interface CameraPreviewProps {
  onCaptureFrame: (base64Image: string) => Promise<void>;
  isProcessing: boolean;
  lastPrediction: PredictionResponse | null;
  backendStatus: BackendConnectionStatus;
  onOpenBackendModal: () => void;
  sequence?: string[];
  stabilityScore?: number;
  currentPendingSign?: string | null;
  onUndo?: () => void;
  onClear?: () => void;
  onAddSpace?: () => void;
  onRequestAISuggestion?: () => void;
  isSuggesting?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  onCaptureFrame,
  isProcessing,
  lastPrediction,
  backendStatus,
  onOpenBackendModal,
  sequence = [],
  stabilityScore = 0,
  currentPendingSign = null,
  onUndo,
  onClear,
  onAddSpace,
  onRequestAISuggestion,
  isSuggesting = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showGuide, setShowGuide] = useState(true);
  const [fps, setFps] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastCaptureTime = useRef<number>(0);
  const fpsFrameCount = useRef<number>(0);
  const fpsLastTime = useRef<number>(0);
  
  const hasNoHand = lastPrediction && (lastPrediction.label === '?' || lastPrediction.error?.toLowerCase().includes('no hand'));

  // MediaPipe Hand connections matching old index.html
  const CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17]
  ];

  // Helper function to draw rounded bounding box
  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };

  // Initialize MediaPipe Hands
  useEffect(() => {
    // @ts-ignore
    if (!window.Hands) return;

    // @ts-ignore
    handsRef.current = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsRef.current.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.60,
      minTrackingConfidence: 0.50,
    });

    handsRef.current.onResults((results: any) => {
      // Calculate FPS
      fpsFrameCount.current++;
      const now = performance.now();
      if (now - fpsLastTime.current >= 1000) {
        setFps(fpsFrameCount.current);
        fpsFrameCount.current = 0;
        fpsLastTime.current = now;
      }

      if (!overlayCanvasRef.current || !videoRef.current) return;
      
      const canvas = overlayCanvasRef.current;
      const video = videoRef.current;
      
      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        setHandDetected(false);
        return;
      }

      setHandDetected(true);

      const allXs: number[] = [];
      const allYs: number[] = [];

      // Render 21 landmark nodes & skeleton for each hand exactly like old index.html
      if (showGuide) {
        results.multiHandLandmarks.forEach((landmarks: any[]) => {
          landmarks.forEach((l: any) => {
            const px = l.x * canvas.width;
            const py = l.y * canvas.height;
            allXs.push(px);
            allYs.push(py);
          });

          // Draw skeleton lines
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
          ctx.lineWidth = 2.5;
          CONNECTIONS.forEach(([a, b]) => {
            if (landmarks[a] && landmarks[b]) {
              ctx.beginPath();
              ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height);
              ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height);
              ctx.stroke();
            }
          });

          // Draw 21 keypoint circles
          landmarks.forEach((l: any) => {
            ctx.beginPath();
            ctx.arc(l.x * canvas.width, l.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#6366f1';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        });
      } else {
        // Collect coordinates even if guide drawing is turned off
        results.multiHandLandmarks.forEach((landmarks: any[]) => {
          landmarks.forEach((l: any) => {
            allXs.push(l.x * canvas.width);
            allYs.push(l.y * canvas.height);
          });
        });
      }

      // Compute unified bounding box enclosing ALL hands with padding
      if (allXs.length > 0 && allYs.length > 0) {
        const pad = 40;
        const x1 = Math.max(0, Math.min(...allXs) - pad);
        const y1 = Math.max(0, Math.min(...allYs) - pad);
        const x2 = Math.min(canvas.width, Math.max(...allXs) + pad);
        const y2 = Math.min(canvas.height, Math.max(...allYs) + pad);
        const w = x2 - x1;
        const h = y2 - y1;

        // Draw green glowing bounding box matching old index.html
        if (showGuide && w > 10 && h > 10) {
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 12;
          drawRoundRect(ctx, x1, y1, w, h, 10);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset shadow
        }

        // Send hand-cropped image to backend (throttled ~400ms)
        if (canvasRef.current && w > 10 && h > 10) {
          if (now - lastCaptureTime.current > 350) {
            lastCaptureTime.current = now;
            const processingCanvas = canvasRef.current;
            processingCanvas.width = w;
            processingCanvas.height = h;
            const pCtx = processingCanvas.getContext('2d');
            if (pCtx) {
              // Crop exact hand bounding box from raw video frame
              pCtx.drawImage(video, x1, y1, w, h, 0, 0, w, h);
              const base64Data = processingCanvas.toDataURL('image/jpeg', 0.85);
              onCaptureFrame(base64Data);
            }
          }
        }
      }
    });

    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [showGuide, facingMode, onCaptureFrame]);

  // Start webcam
  const startCamera = async () => {
    setError(null);
    try {
      if (!videoRef.current) return;
      
      // @ts-ignore
      if (window.Camera && handsRef.current) {
        fpsLastTime.current = performance.now();
        
        // @ts-ignore
        cameraRef.current = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
          facingMode: facingMode
        });
        await cameraRef.current.start();
        setIsActive(true);
      } else {
        setError("MediaPipe is not loaded yet. Please refresh the page.");
      }
    } catch (err: any) {
      console.error('Webcam access error:', err);
      setError('Failed to access camera.');
      setIsActive(false);
    }
  };

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    setIsActive(false);
    setHandDetected(false);
  }, []);

  // Toggle facing mode (front / back)
  const toggleFacingMode = () => {
    setFacingMode(prev => {
      const newMode = prev === 'user' ? 'environment' : 'user';
      if (isActive) {
        stopCamera();
        setTimeout(() => setFacingMode(newMode), 150);
      }
      return newMode;
    });
  };

  return (
    <div 
      id="camera-preview-container" 
      className="bg-white dark:bg-[#19221D] rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/90 dark:border-[#283830] space-y-4"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold text-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5]">
              Webcam Vision Stream
            </h2>
            <p className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">
              21-Node MediaPipe Client Tracking + Flask Landmark AI
            </p>
          </div>
        </div>

        {/* Live FPS & Status Indicator */}
        <div className="flex items-center gap-2">
          {isActive && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] text-[11px] font-mono font-medium">
              <span className={`w-2 h-2 rounded-full ${handDetected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span>{fps > 0 ? `${fps} FPS` : 'Streaming'}</span>
            </div>
          )}

          <button
            onClick={onOpenBackendModal}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition-colors ${
              backendStatus === 'connected'
                ? 'bg-emerald-50 dark:bg-[#14291E] text-emerald-800 dark:text-[#76CBA6] border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-[#1D3B2C]'
                : 'bg-rose-50 dark:bg-[#331C1F] text-rose-800 dark:text-[#FBA65B] border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-[#422226]'
            }`}
            title="Check Flask Backend Connection Details"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-600' : 'bg-rose-500'}`} />
            <span>{backendStatus === 'connected' ? 'AI Online' : 'AI Offline'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport (Perfectly Contained Responsive Aspect Ratio) */}
      <div className={`relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-stone-800 shadow-inner ${handDetected ? 'ring-2 ring-emerald-500/50' : ''}`}>
        {/* Hidden processing canvas for hand crop */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        {/* Tracking Overlay Canvas (CSS mirrored when user camera facing) */}
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        {/* HUD Overlay: Live Detecting Letter Badge (Top Right of Video) */}
        {isActive && lastPrediction && lastPrediction.label !== '?' && !hasNoHand && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-white shadow-lg animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">Detecting</span>
              <span className="text-xl font-black font-mono leading-none text-white">{lastPrediction.label}</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-[10px] font-semibold text-stone-300 flex flex-col">
              <span className="text-emerald-400 font-bold">{Math.round((lastPrediction.confidence || 0) * 100)}% Match</span>
              {stabilityScore > 0 && (
                <span className="text-[9px] text-amber-300">Holding: {stabilityScore}%</span>
              )}
            </div>
          </div>
        )}

        {/* HUD Overlay: Live Accumulated Sequence Bar (Bottom of Video) */}
        {isActive && sequence.length > 0 && (
          <div className="absolute bottom-3 inset-x-3 z-30 bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 text-white shadow-xl flex items-center justify-between gap-2 overflow-x-auto animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-1.5 font-mono overflow-x-auto">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-400 shrink-0 mr-1">
                Sequence:
              </span>
              {sequence.map((char, idx) => (
                <span
                  key={`hud-${char}-${idx}`}
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-sm font-black ${
                    char === ' '
                      ? 'bg-white/20 text-stone-300 min-w-[18px]'
                      : 'bg-emerald-500 text-black shadow-xs'
                  }`}
                >
                  {char === ' ' ? '␣' : char}
                </span>
              ))}
            </div>

            {/* Quick Actions inside HUD Bar */}
            <div className="flex items-center gap-1 shrink-0">
              {onUndo && (
                <button
                  onClick={onUndo}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-stone-200 transition-colors"
                  title="Undo last sign"
                >
                  Undo
                </button>
              )}
              {onAddSpace && (
                <button
                  onClick={onAddSpace}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-stone-200 transition-colors"
                  title="Add space"
                >
                  Space
                </button>
              )}
              {onClear && (
                <button
                  onClick={onClear}
                  className="px-2 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-[10px] font-bold text-rose-200 transition-colors"
                  title="Clear all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Camera Inactive State */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#183D32]/95 dark:bg-[#0F1C15]/95 text-stone-200 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Camera className="w-8 h-8 text-[#E07A2B]" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg font-bold text-white">Start Camera</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Allow camera access to begin real-time sign language detection (21-node MediaPipe tracking).
              </p>
            </div>
            <button
              id="btn-start-camera"
              onClick={startCamera}
              className="px-6 py-3 bg-[#E07A2B] hover:bg-[#c9671d] text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span>Enable Camera</span>
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-rose-950/95 text-rose-200 space-y-3 z-20">
            <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Camera Access Notice</h3>
            <p className="text-xs text-rose-300 max-w-xs">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Live Camera Overlays */}
        {isActive && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xs text-white text-xs font-medium border border-white/10 flex items-center gap-2">
              {!handDetected ? (
                <>
                  <Hand className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-300">Show hand to start 21-node tracking</span>
                </>
              ) : lastPrediction && lastPrediction.label !== '?' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Detected — <strong className="text-[#E07A2B] font-bold font-mono text-sm">{lastPrediction.label}</strong> ({Math.round((lastPrediction.confidence || 0) * 100)}%)</span>
                  {isProcessing && <RefreshCw className="w-3 h-3 text-stone-400 animate-spin ml-1 inline" />}
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>21 Hand Nodes Active — Reading...</span>
                  {isProcessing && <RefreshCw className="w-3 h-3 text-[#E07A2B] animate-spin ml-1 inline" />}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Camera Control Toolbar */}
      <div className="flex items-center justify-between pt-1">
        {/* Toggle On/Off */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              id="btn-stop-camera"
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-[#1E2822] hover:bg-stone-200 dark:hover:bg-[#283830] text-stone-700 dark:text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <CameraOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Turn Off Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#E07A2B] dark:text-[#FBA65B]" />
              <span>Turn On Camera</span>
            </button>
          )}
        </div>

        {/* View and Guide Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showGuide 
                ? 'bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] border-[#2F6B57]/30 dark:border-[#2F6B57]/50 font-semibold' 
                : 'bg-stone-50 dark:bg-[#1E2822] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-[#283830]'
            }`}
            title="Toggle Hand Overlay Nodes & Bounding Box"
            aria-label="Toggle hand guide overlay"
          >
            {showGuide ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFacingMode}
            className="p-2 rounded-xl bg-stone-50 dark:bg-[#1E2822] hover:bg-stone-100 dark:hover:bg-[#283830] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs transition-colors"
            title="Flip camera view (Front / Rear)"
            aria-label="Flip camera view"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
