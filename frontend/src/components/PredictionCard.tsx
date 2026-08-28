import React from 'react';
import { PredictionResponse, BackendConnectionStatus } from '../types';
import { 
  AlertCircle, 
  Hand, 
  TrendingUp, 
  RefreshCw, 
  Activity,
  CheckCircle2
} from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResponse | null;
  isProcessing: boolean;
  isCameraActive: boolean;
  backendStatus: BackendConnectionStatus;
  onRetryConnection: () => void;
  stabilityScore?: number; // 0 to 100 towards debounce commit
  currentPendingSign?: string | null;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  isProcessing,
  isCameraActive,
  backendStatus,
  onRetryConnection,
  stabilityScore = 0,
  currentPendingSign = null,
}) => {
  // Determine state
  const isOffline = backendStatus === 'offline';
  const hasNoHand = prediction && (prediction.label === '?' || prediction.error?.toLowerCase().includes('no hand'));
  const hasSuccess = prediction && prediction.label !== '?' && !prediction.error && !isOffline;

  const confidencePercent = hasSuccess && prediction?.confidence
    ? Math.round(prediction.confidence > 1 ? prediction.confidence : prediction.confidence * 100)
    : 0;

  return (
    <div 
      id="prediction-card"
      className="bg-white dark:bg-[#19221D] rounded-3xl p-6 shadow-sm border border-stone-200/90 dark:border-[#283830] flex flex-col justify-between"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold text-xs border border-[#D5E4DC] dark:border-[#2A4435]">
            ML
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5] flex items-center gap-1.5">
              <span>Live Sign Recognition</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
            </h3>
            <p className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">MediaPipe + TensorFlow 35-Class Model</p>
          </div>
        </div>

        {/* Processing pulse */}
        <div className="flex items-center gap-1.5">
          {hasSuccess ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#183D32] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1B3426] border border-[#D5E4DC] dark:border-[#274635] px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-[#4ADE80] animate-pulse" />
              <span>Recognised</span>
              {isProcessing && <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-600 ml-0.5 inline" />}
            </span>
          ) : isProcessing ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#E07A2B] dark:text-[#FBA65B] bg-[#FFF7ED] dark:bg-[#2C1F15] border border-[#FFEDD5] dark:border-[#4B301F] px-2.5 py-0.5 rounded-full">
              <RefreshCw className="w-3 h-3 animate-spin text-[#E07A2B] dark:text-[#FBA65B]" />
              <span>Reading...</span>
            </span>
          ) : (
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium bg-stone-100 dark:bg-[#1E2822] px-2 py-0.5 rounded-full">
              Standby
            </span>
          )}
        </div>
      </div>

      {/* Main Prediction Display State Area */}
      <div className="py-3 flex flex-col items-center justify-center min-h-[160px]">
        {/* STATE: Backend Offline */}
        {isOffline ? (
          <div className="text-center p-4 bg-rose-50/70 dark:bg-[#331C1F] rounded-2xl border border-rose-200 dark:border-rose-800/50 w-full space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
            <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">SignBridge AI Offline</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 max-w-xs mx-auto">
              Please ensure your Flask backend server is running and accessible.
            </p>
            <button
              onClick={onRetryConnection}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
            </button>
          </div>
        ) : !isCameraActive ? (
          /* STATE: Camera Inactive */
          <div className="text-center text-stone-500 dark:text-stone-400 py-6">
            <Hand className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
            <p className="font-semibold text-sm text-stone-700 dark:text-stone-200">Camera is on standby</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Turn on the camera to begin live recognition.</p>
          </div>
        ) : hasNoHand ? (
          /* STATE: No Hand Detected */
          <div className="text-center text-stone-600 dark:text-stone-300 py-5 bg-[#FFF7ED]/50 dark:bg-[#2A1F16] rounded-2xl border border-dashed border-[#FFEDD5] dark:border-[#4B301F] w-full space-y-1">
            <Hand className="w-8 h-8 text-[#E07A2B] dark:text-[#FBA65B] mx-auto opacity-75 mb-1" />
            <p className="font-semibold text-sm text-stone-800 dark:text-stone-100">We can't see your hand yet</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Try positioning your hand inside the guide box.
            </p>
          </div>
        ) : hasSuccess ? (
          /* STATE: Prediction Successful */
          <div className="w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8] dark:text-[#60A5FA] mb-1">
              Got it — {prediction?.label}
            </span>

            {/* Giant Recognized Letter/Digit */}
            <div 
              id="recognised-sign-value"
              className="relative inline-flex items-center justify-center my-1"
            >
              <span className="text-6xl sm:text-7xl font-extrabold text-[#183D32] dark:text-[#76CBA6] tracking-tight font-mono">
                {prediction?.label}
              </span>
              
              {/* Stability / Pending Commit Indicator Ring in Subtle Orange */}
              {stabilityScore > 0 && currentPendingSign === prediction?.label && (
                <div 
                  className="absolute -top-1 -right-5 bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFEDD5] dark:border-[#4B301F]"
                  title="Gesture held stable for sequence addition"
                >
                  {Math.round(stabilityScore)}%
                </div>
              )}
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center gap-1.5 mt-1 mb-3">
              <span className="text-xs font-medium text-stone-500 dark:text-[#9FB0A7]">Recognition confidence:</span>
              <span className="text-xs font-bold text-[#183D32] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1D3227] px-2.5 py-0.5 rounded-full border border-[#D5E4DC] dark:border-[#2A4435]">
                {confidencePercent}%
              </span>
            </div>

            {/* Confidence Bar with tricolour progression */}
            <div className="w-full max-w-xs space-y-1">
              <div className="h-2 w-full bg-stone-100 dark:bg-[#1E2822] rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    confidencePercent >= 80
                      ? 'bg-emerald-600 dark:bg-[#4ADE80]'
                      : confidencePercent >= 50
                      ? 'bg-[#1D4ED8] dark:bg-[#3B82F6]'
                      : 'bg-[#E07A2B] dark:bg-[#F97316]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, confidencePercent))}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* STATE: Reading sign */
          <div className="text-center text-stone-500 dark:text-stone-400 py-6">
            <Activity className="w-8 h-8 text-[#1D4ED8] dark:text-[#60A5FA] mx-auto mb-2 animate-pulse" />
            <p className="font-semibold text-sm text-stone-700 dark:text-stone-200">Reading your sign...</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Hold gesture steady inside the camera frame.</p>
          </div>
        )}
      </div>

      {/* Top-3 Predictions Section */}
      <div className="border-t border-stone-100 dark:border-[#283830] pt-4 mt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-2.5">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#60A5FA]" /> Top Model Candidates
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500">Softmax Probabilities</span>
        </div>

        {hasSuccess && prediction?.top3 && prediction.top3.length > 0 ? (
          <div className="space-y-2">
            {prediction.top3.slice(0, 3).map((item, idx) => {
              const itemConf = Math.round(item.conf > 1 ? item.conf : item.conf * 100);
              const isTop = idx === 0;
              const isSecond = idx === 1;

              return (
                <div 
                  key={`${item.label}-${idx}`}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    isTop 
                      ? 'bg-[#E8F0EC] dark:bg-[#1D3227] border border-[#D5E4DC] dark:border-[#2A4435] font-bold text-[#183D32] dark:text-[#76CBA6]' 
                      : isSecond
                      ? 'bg-[#EFF6FF] dark:bg-[#17253D] border border-[#DBEAFE] dark:border-[#1E3A5F] text-[#1E40AF] dark:text-[#93C5FD]'
                      : 'bg-stone-50 dark:bg-[#1C2620] text-stone-700 dark:text-[#D5E2DB]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono ${
                      isTop 
                        ? 'bg-[#183D32] text-white' 
                        : isSecond
                        ? 'bg-[#1D4ED8] text-white'
                        : 'bg-[#E07A2B] text-white'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold font-mono">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 w-36">
                    <div className="flex-1 h-1.5 bg-stone-200 dark:bg-[#25332A] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isTop 
                            ? 'bg-[#4F765E]' 
                            : isSecond 
                            ? 'bg-[#1D4ED8]' 
                            : 'bg-[#E07A2B]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(3, itemConf))}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold w-9 text-right">{itemConf}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-3 text-stone-400 dark:text-stone-500 text-xs bg-stone-50/50 dark:bg-[#18221C] rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
            {isOffline ? 'Connect Flask backend to stream top predictions' : 'Top predictions will appear once a sign is shown'}
          </div>
        )}
      </div>
    </div>
  );
};
