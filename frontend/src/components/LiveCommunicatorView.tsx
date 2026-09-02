import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PredictionResponse, 
  BackendConnectionStatus, 
  AppView, 
  AccessibilitySettings 
} from '../types';
import { predictImage, suggestSentence } from '../services/api';
import { CameraPreview } from './CameraPreview';
import { PredictionCard } from './PredictionCard';
import { SequenceBuilder } from './SequenceBuilder';
import { AISuggestionCard } from './AISuggestionCard';
import { 
  ArrowLeft, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Keyboard, 
  Info,
  Radio
} from 'lucide-react';

interface LiveCommunicatorViewProps {
  onBack: () => void;
  backendStatus: BackendConnectionStatus;
  onOpenBackendModal: () => void;
  accessibility: AccessibilitySettings;
  onOpenShortcutsModal: () => void;
}

export const LiveCommunicatorView: React.FC<LiveCommunicatorViewProps> = ({
  onBack,
  backendStatus,
  onOpenBackendModal,
  accessibility,
  onOpenShortcutsModal,
}) => {
  // Live state
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  // Sequence builder state
  const [sequence, setSequence] = useState<string[]>([]);
  const [autoDebounceEnabled, setAutoDebounceEnabled] = useState<boolean>(true);
  const [stabilityScore, setStabilityScore] = useState<number>(0);
  const [currentPendingSign, setCurrentPendingSign] = useState<string | null>(null);

  // Debounce tracking refs with 1-frame glitch tolerance
  const holdLabelRef = useRef<string | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const lastCommittedSignRef = useRef<string | null>(null);
  const missedFramesRef = useRef<number>(0);
  const HOLD_MS = 1200; // 1.2 seconds hold requirement (smooth, stable, and responsive)

  // AI Interpretation state
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Frame Capture Handler (sends Base64 image to POST /predict)
  const handleCaptureFrame = useCallback(async (base64Image: string) => {
    setIsProcessing(true);
    setIsCameraActive(true);

    try {
      const res = await predictImage(base64Image);
      setPrediction(res);

      const detectedLabel = res.label;
      const confidence = res.confidence || 0;
      const isReliable = detectedLabel !== '?' && !res.error && confidence >= 0.50;

      // Handle Hold Timer Logic with transient frame smoothing
      if (isReliable) {
        missedFramesRef.current = 0;
        const now = Date.now();
        if (holdLabelRef.current !== detectedLabel) {
          holdLabelRef.current = detectedLabel;
          holdStartRef.current = now;
        }

        const elapsed = now - (holdStartRef.current || now);
        const progress = Math.min(elapsed / HOLD_MS, 1.0);
        const score = Math.round(progress * 100);
        
        setStabilityScore(score);
        setCurrentPendingSign(detectedLabel);

        // Commit character after continuous hold if not already committed
        if (
          autoDebounceEnabled &&
          progress >= 1.0 &&
          lastCommittedSignRef.current !== detectedLabel
        ) {
          setSequence((prev) => [...prev, detectedLabel]);
          lastCommittedSignRef.current = detectedLabel; // Lock character
          holdStartRef.current = Date.now(); // Reset timer for next sign
        }
      } else {
        // Tolerant reset: only clear hold state if hand missing for 2+ consecutive frames
        missedFramesRef.current += 1;
        if (missedFramesRef.current >= 2) {
          holdLabelRef.current = null;
          holdStartRef.current = null;
          lastCommittedSignRef.current = null;
          setStabilityScore(0);
          setCurrentPendingSign(null);
        }
      }
    } catch (err) {
      console.error('Prediction call failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [autoDebounceEnabled]);

  // Sequence Operations
  const handleUndo = () => {
    setSequence((prev) => prev.slice(0, -1));
    lastCommittedSignRef.current = null;
  };

  const handleClear = () => {
    setSequence([]);
    setSuggestion(null);
    setSuggestionError(null);
    lastCommittedSignRef.current = null;
    holdLabelRef.current = null;
    holdStartRef.current = null;
    setStabilityScore(0);
  };

  const handleAddCharacter = (char: string) => {
    setSequence((prev) => [...prev, char]);
  };

  const handleAddSpace = () => {
    setSequence((prev) => [...prev, ' ']);
    lastCommittedSignRef.current = null;
  };

  // Trigger AI Sentence Suggestion (calls POST /api/suggest)
  const handleSuggestSentence = async () => {
    const rawText = sequence.join('').trim();
    if (!rawText) return;

    setIsSuggesting(true);
    setSuggestionError(null);

    try {
      const res = await suggestSentence(rawText);
      if (res.error) {
        setSuggestionError(res.error);
        setSuggestion(null);
      } else {
        setSuggestion(res.suggested);
        if (accessibility.autoSpeakSuggestions) {
          handleSpeak(res.suggested);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Suggestion request failed';
      setSuggestionError(msg);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Text to Speech
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = accessibility.speechRate || 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
      } else if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSuggestSentence();
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (e.altKey && e.key.toLowerCase() === 'l' && suggestion) {
        e.preventDefault();
        handleSpeak(suggestion);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, suggestion]);

  return (
    <div id="live-communicator-view" className="space-y-4">
      {/* Main Grid Layout: Stationary Camera on Left, Scrollable Output cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stationary Camera Preview (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-3">
          <CameraPreview
            onCaptureFrame={handleCaptureFrame}
            isProcessing={isProcessing}
            lastPrediction={prediction}
            backendStatus={backendStatus}
            onOpenBackendModal={onOpenBackendModal}
            sequence={sequence}
            stabilityScore={stabilityScore}
            currentPendingSign={currentPendingSign}
            onUndo={handleUndo}
            onClear={handleClear}
            onAddSpace={handleAddSpace}
            onRequestAISuggestion={handleSuggestSentence}
            isSuggesting={isSuggesting}
          />

          {/* Quick helpful gesture hint banner */}
          <div className="bg-[#E8F0EC]/60 dark:bg-[#182820] rounded-2xl p-3 border border-[#2F6B57]/20 dark:border-[#2F6B57]/40 flex items-center justify-between text-xs text-stone-700 dark:text-[#D5E2DB]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2F6B57] dark:text-[#4ADE80] shrink-0" />
              <span>
                <strong>Tip:</strong> Keep palm facing the camera and hold each sign steady for ~1.5s to lock character into sequence.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Independently Scrollable Prediction, Sequence, & AI Cards (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 custom-scrollbar">
          {/* Prediction Result & Confidence Card */}
          <PredictionCard
            prediction={prediction}
            isProcessing={isProcessing}
            isCameraActive={isCameraActive}
            backendStatus={backendStatus}
            onRetryConnection={onOpenBackendModal}
            stabilityScore={stabilityScore}
            currentPendingSign={currentPendingSign}
          />

          {/* Recognised Sequence Builder Card */}
          <SequenceBuilder
            sequence={sequence}
            onUndo={handleUndo}
            onClear={handleClear}
            onAddCharacter={handleAddCharacter}
            onAddSpace={handleAddSpace}
            onRequestAISuggestion={handleSuggestSentence}
            isSuggesting={isSuggesting}
            autoDebounceEnabled={autoDebounceEnabled}
            onToggleAutoDebounce={() => setAutoDebounceEnabled(!autoDebounceEnabled)}
            lastPredictionLabel={prediction?.label}
          />

          {/* AI Interpretation Card */}
          <AISuggestionCard
            suggestion={suggestion}
            rawSequenceText={sequence.join('')}
            isSuggesting={isSuggesting}
            error={suggestionError}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    </div>
  );
};
