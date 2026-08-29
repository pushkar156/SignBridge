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
  const isOffline = backendStatus === 'offline';
  const hasNoHand = prediction && (prediction.label === '?' || prediction.error?.toLowerCase().includes('no hand'));
  const hasSuccess = prediction && prediction.label !== '?' && !prediction.error && !isOffline;

  const confidencePercent = hasSuccess && prediction?.confidence
    ? Math.round(prediction.confidence > 1 ? prediction.confidence : prediction.confidence * 100)
    : 0;

  return (
    <div 
      id="prediction-card"
      className="bg-white dark:bg-[#19221D] rounded-3xl p-4 shadow-sm border border-stone-200/90 dark:border-[#283830] space-y-3"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold text-[10px] border border-[#D5E4DC] dark:border-[#2A4435]">
            ML
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5]">
              Live Sign Recognition
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {hasSuccess ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#183D32] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1B3426] border border-[#D5E4DC] dark:border-[#274635] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Recognised</span>
            </span>
          ) : isProcessing ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#E07A2B] dark:text-[#FBA65B] bg-[#FFF7ED] dark:bg-[#2C1F15] border border-[#FFEDD5] dark:border-[#4B301F] px-2 py-0.5 rounded-full">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Reading...</span>
            </span>
          ) : (
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium bg-stone-100 dark:bg-[#1E2822] px-2 py-0.5 rounded-full">
              Standby
            </span>
          )}
        </div>
      </div>

      {/* Main Compact Prediction Display */}
      {isOffline ? (
        <div className="p-3 bg-rose-50/70 dark:bg-[#331C1F] rounded-xl border border-rose-200 dark:border-rose-800/50 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
          <span className="font-semibold">Backend Offline</span>
          <button onClick={onRetryConnection} className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold">
            Retry
          </button>
        </div>
      ) : !isCameraActive ? (
        <div className="py-2 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
          <Hand className="w-4 h-4 opacity-50" />
          <span>Turn on camera to start live gesture recognition</span>
        </div>
      ) : hasNoHand ? (
        <div className="py-2 text-center text-[#E07A2B] dark:text-[#FBA65B] text-xs font-medium flex items-center justify-center gap-2 bg-[#FFF7ED] dark:bg-[#2A1F16] rounded-xl border border-[#FFEDD5] dark:border-[#4B301F]">
          <Hand className="w-4 h-4 opacity-75" />
          <span>No hand in frame — position hand in camera box</span>
        </div>
      ) : hasSuccess ? (
        <div className="flex items-center justify-between bg-[#FAF8F3] dark:bg-[#131B16] p-3 rounded-2xl border border-[#E8E2D2] dark:border-[#283830]">
          {/* Detected Character Badge */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white dark:bg-[#1D2821] rounded-xl flex items-center justify-center border border-[#D5E4DC] dark:border-[#2C3F34] shadow-xs">
              <span className="text-3xl font-black font-mono text-[#183D32] dark:text-[#76CBA6]">
                {prediction?.label}
              </span>
              {stabilityScore > 0 && currentPendingSign === prediction?.label && (
                <span className="absolute -top-1 -right-1 bg-[#E07A2B] text-white text-[8px] font-extrabold px-1 rounded-full">
                  {Math.round(stabilityScore)}%
                </span>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-stone-800 dark:text-[#E2EAE5]">
                Detected: <span className="text-[#1D4ED8] dark:text-[#60A5FA] font-mono">{prediction?.label}</span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-[#9FB0A7] flex items-center gap-1">
                <span>Confidence:</span>
                <span className="font-bold text-emerald-600 dark:text-[#4ADE80]">{confidencePercent}%</span>
              </div>
            </div>
          </div>

          {/* Inline Top Candidates */}
          {prediction?.top3 && prediction.top3.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono">
              {prediction.top3.slice(0, 3).map((c, i) => (
                <span
                  key={c.label}
                  className={`px-2 py-1 rounded-lg border ${
                    i === 0
                      ? 'bg-emerald-50 dark:bg-[#172E21] text-emerald-800 dark:text-[#76CBA6] border-emerald-200 dark:border-emerald-800/40 font-bold'
                      : 'bg-stone-50 dark:bg-[#1A241F] text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  #{i + 1} {c.label} ({Math.round(c.conf > 1 ? c.conf : c.conf * 100)}%)
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
