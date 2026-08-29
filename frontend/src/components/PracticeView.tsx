import React, { useState, useCallback } from 'react';
import { ISLClassInfo, BackendConnectionStatus, PredictionResponse } from '../types';
import { ISL_CLASSES } from '../data/islClasses';
import { CameraPreview } from './CameraPreview';
import { predictImage } from '../services/api';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  Hand, 
  Shuffle, 
  Info,
  ArrowRight
} from 'lucide-react';

interface PracticeViewProps {
  selectedSign: ISLClassInfo | null;
  onSelectSign: (sign: ISLClassInfo) => void;
  backendStatus: BackendConnectionStatus;
  onOpenBackendModal: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  selectedSign,
  onSelectSign,
  backendStatus,
  onOpenBackendModal,
}) => {
  const currentTarget = selectedSign || ISL_CLASSES[0];
  const [activeCategory, setActiveCategory] = useState<'All' | 'Alphabet' | 'Numbers'>('Alphabet');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Filtered targets list
  const categoryClasses = ISL_CLASSES.filter(
    (c) => activeCategory === 'All' || c.category === activeCategory
  );

  // Capture and validate frame with target
  const handleCaptureFrame = useCallback(async (base64Image: string) => {
    setIsProcessing(true);
    try {
      const res = await predictImage(base64Image);
      setPrediction(res);

      if (res.label !== '?' && !res.error) {
        const isMatch = res.label.toUpperCase() === currentTarget.label.toUpperCase();
        if (isMatch && res.confidence >= 0.5) {
          setStreak((prev) => {
            const next = prev + 1;
            setBestStreak((b) => Math.max(b, next));
            return next;
          });
        } else {
          setStreak(0);
        }
      }
    } catch (err) {
      console.error('Practice prediction error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [currentTarget]);

  // Pick next or random target sign
  const handleNextTarget = () => {
    const currentIndex = ISL_CLASSES.findIndex((c) => c.id === currentTarget.id);
    const nextIndex = (currentIndex + 1) % ISL_CLASSES.length;
    onSelectSign(ISL_CLASSES[nextIndex]);
    setPrediction(null);
  };

  const handleRandomTarget = () => {
    const randomIndex = Math.floor(Math.random() * categoryClasses.length);
    onSelectSign(categoryClasses[randomIndex]);
    setPrediction(null);
  };

  const isMatch = prediction && prediction.label.toUpperCase() === currentTarget.label.toUpperCase();
  const confidencePercent = prediction && prediction.confidence
    ? Math.round(prediction.confidence > 1 ? prediction.confidence : prediction.confidence * 100)
    : 0;

  return (
    <div id="practice-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-[#283830] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] text-xs font-bold mb-2 border border-[#FFEDD5] dark:border-[#4B301F]">
            <Target className="w-3.5 h-3.5" />
            <span>Interactive ISL Practice Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] ml-1" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
            Practice ISL Recognition
          </h1>
          <p className="text-xs sm:text-sm text-[#6E756F] dark:text-[#9FB0A7] mt-1">
            Form the target sign in front of the camera and test your execution with the live Flask ML model.
          </p>
        </div>

        {/* Gamified Practice Stats */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#19221D] p-2.5 rounded-2xl border border-stone-200 dark:border-[#283830] shadow-2xs self-start sm:self-auto">
          <div className="text-center px-3 border-r border-stone-100 dark:border-[#283830]">
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-[#9FB0A7] block">Streak</span>
            <span className="text-lg font-extrabold text-[#E07A2B] dark:text-[#FBA65B]">{streak} 🔥</span>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-[#9FB0A7] block">Best</span>
            <span className="text-lg font-extrabold text-[#1D4ED8] dark:text-[#93C5FD]">{bestStreak} 🏆</span>
          </div>
        </div>
      </div>

      {/* Category selector & Horizontal Target Picker */}
      <div className="space-y-3 bg-white dark:bg-[#19221D] p-4 rounded-3xl border border-stone-200 dark:border-[#283830] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5]">
            Choose Target Sign:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomTarget}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] dark:bg-[#131B16] hover:bg-stone-100 dark:hover:bg-[#1E2822] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E8E2D2] dark:border-[#283830]"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#D69A4A] dark:text-[#FBA65B]" />
              <span>Random Target</span>
            </button>
            <div className="flex gap-1 bg-[#FAF8F3] dark:bg-[#131B16] p-0.5 rounded-xl border border-[#E8E2D2] dark:border-[#283830]">
              {(['Alphabet', 'Numbers'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeCategory === cat 
                      ? 'bg-white dark:bg-[#1D2821] text-[#183D32] dark:text-[#76CBA6] shadow-xs' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Badges of Targets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categoryClasses.map((item) => {
            const isSelected = item.id === currentTarget.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSign(item);
                  setPrediction(null);
                }}
                className={`min-w-[42px] h-11 rounded-xl font-bold font-mono text-base transition-all flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#183D32] dark:bg-[#2F6B57] text-white shadow-md scale-105 ring-2 ring-[#4F765E]/40'
                    : 'bg-[#FAF8F3] dark:bg-[#131B16] text-[#252A27] dark:text-[#D5E2DB] hover:bg-stone-200 dark:hover:bg-[#1F2B24] border border-[#E8E2D2] dark:border-[#283830]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Demonstration Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#19221D] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-[#9FB0A7]">
                Today's Sign
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6]">
                {currentTarget.category}
              </span>
            </div>

            {/* Giant Target Sign Display */}
            <div className="text-center py-3">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-[#183D32] dark:bg-[#2F6B57] text-white text-5xl font-black flex items-center justify-center font-mono shadow-md border-2 border-[#4F765E]/40">
                {currentTarget.label}
              </div>
              <h3 className="font-extrabold text-xl text-[#183D32] dark:text-[#F0F5F2] mt-3">{currentTarget.name}</h3>
              <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] mt-0.5">Show the corresponding ISL gesture in front of the camera.</p>
            </div>

            {/* Demonstration Gesture Reference Image */}
            <div className="bg-stone-900 rounded-2xl p-2 border border-stone-800 text-center flex flex-col items-center justify-center relative overflow-hidden">
              <img 
                src={`/dataset_samples/${currentTarget.label}.jpg`} 
                alt={`ISL Gesture Reference for ${currentTarget.label}`}
                className="w-full h-44 object-contain rounded-xl bg-stone-950"
              />
              <div className="mt-1.5 flex items-center justify-between w-full px-2 text-[10px] text-stone-300 font-mono">
                <span className="font-bold text-emerald-400">Gesture Reference</span>
                <span>Class: {currentTarget.label}</span>
              </div>
            </div>

            {/* Tips and Instructions */}
            <div className="space-y-2 text-xs bg-[#FAF8F3] dark:bg-[#141C18] p-4 rounded-2xl border border-[#E8E2D2] dark:border-[#283830]">
              <div className="font-bold text-[#183D32] dark:text-[#76CBA6] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#4F765E] dark:text-[#76CBA6]" /> How to Form:
              </div>
              <p className="text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
                {currentTarget.handShapeTips}
              </p>
            </div>

            {/* Next Target Button */}
            <button
              onClick={handleNextTarget}
              className="w-full py-3 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Next Challenge Sign</span>
              <ArrowRight className="w-4 h-4 text-[#D69A4A] dark:text-[#FBA65B]" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Camera & Practice Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CameraPreview
            onCaptureFrame={handleCaptureFrame}
            isProcessing={isProcessing}
            lastPrediction={prediction}
            backendStatus={backendStatus}
            onOpenBackendModal={onOpenBackendModal}
          />

          {/* Real-time Match & Accuracy Evaluation Banner */}
          <div className="bg-white dark:bg-[#19221D] rounded-3xl p-6 border border-stone-200 dark:border-[#283830] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-[#E2EAE5]">
                Live Verification Result
              </span>
              <span className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">Actual /predict Model Output</span>
            </div>

            {prediction && prediction.label !== '?' && !prediction.error ? (
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in ${
                isMatch
                  ? 'bg-emerald-50 dark:bg-[#14291E] border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-[#2A2014] border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl font-mono shrink-0 ${
                    isMatch ? 'bg-emerald-600 text-white' : 'bg-[#D69A4A] text-white'
                  }`}>
                    {prediction.label}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-base">
                      {isMatch ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <span>Nice! You got it. Perfect Sign.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <span>Almost there. Try adjusting your hand position.</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">
                      Detected: <strong>{prediction.label}</strong> (Model confidence: <strong>{confidencePercent}%</strong>)
                    </p>
                  </div>
                </div>

                {isMatch && (
                  <button
                    onClick={handleNextTarget}
                    className="px-4 py-2 bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-bold text-xs rounded-xl shadow-xs transition-transform hover:scale-105"
                  >
                    Next Sign →
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-500 dark:text-stone-400 bg-[#FAF8F3] dark:bg-[#141C18] rounded-2xl border border-dashed border-[#E8E2D2] dark:border-[#283830]">
                <Hand className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-1.5" />
                <p className="font-semibold text-xs text-stone-700 dark:text-stone-300">
                  Show target sign '{currentTarget.label}' inside the camera frame
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                  The model will assess your hand shape and confidence in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
