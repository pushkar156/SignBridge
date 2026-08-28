import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Info, 
  Bot
} from 'lucide-react';

interface AISuggestionCardProps {
  suggestion: string | null;
  rawSequenceText: string;
  isSuggesting: boolean;
  error?: string | null;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  rawSequenceText,
  isSuggesting,
  error,
  onSpeak,
  isSpeaking,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!suggestion) return;
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="ai-interpretation-card"
      className="bg-white dark:bg-[#19221D] rounded-3xl p-6 shadow-sm border border-stone-200/90 dark:border-[#283830] space-y-4 relative overflow-hidden"
    >
      {/* Subtle Saffron & Chakra Blue Accent Line at Top of Card */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E07A2B] via-[#1D4ED8]/70 to-[#4F765E]" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] flex items-center justify-center font-bold text-xs border border-[#FFEDD5] dark:border-[#4B301F]">
            <Sparkles className="w-4 h-4 text-[#E07A2B] dark:text-[#FBA65B]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5] flex items-center gap-1.5">
              <span>AI-Assisted Interpretation</span>
              <span className="text-[10px] font-normal text-stone-400 dark:text-[#9FB0A7]">(/api/suggest)</span>
            </h3>
            <p className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">
              Natural conversational sentence formatting
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold bg-[#EFF6FF] dark:bg-[#17253D] text-[#1D4ED8] dark:text-[#93C5FD] border border-[#DBEAFE] dark:border-[#1E3A5F] px-2.5 py-0.5 rounded-full">
          Gemini Assist
        </span>
      </div>

      {/* Main Sentence Result Box */}
      <div className="bg-[#FAF8F3] dark:bg-[#131B16] rounded-2xl p-5 border border-[#E8E2D2] dark:border-[#283830] min-h-[110px] flex flex-col justify-between">
        {isSuggesting ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Sparkles className="w-6 h-6 text-[#E07A2B] animate-spin" />
            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
              Generating natural English sentence via Flask backend...
            </p>
          </div>
        ) : error ? (
          <div className="text-xs text-rose-600 dark:text-rose-400 p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/40">
            {error}
          </div>
        ) : suggestion ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-xs text-stone-500 dark:text-[#9FB0A7] font-medium flex items-center justify-between">
              <span>Your recognised signs were converted into a natural English sentence:</span>
              <span className="font-mono text-[11px] text-[#1D4ED8] dark:text-[#60A5FA]">[{rawSequenceText || '—'}]</span>
            </div>
            
            <blockquote className="text-xl sm:text-2xl font-serif italic font-bold text-[#183D32] dark:text-[#76CBA6] leading-snug tracking-tight">
              "{suggestion}"
            </blockquote>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-stone-400 dark:text-stone-500 text-center">
            <Bot className="w-8 h-8 text-[#1D4ED8]/60 dark:text-[#60A5FA]/60 mb-1" />
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              No sentence generated yet
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
              Recognise a sequence of ISL signs above and click "Suggest Natural Sentence".
            </p>
          </div>
        )}

        {/* Action Controls for Result */}
        {suggestion && (
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D2] dark:border-[#283830] mt-3">
            <button
              id="btn-copy-interpretation"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1E2822] hover:bg-stone-50 dark:hover:bg-[#27362E] text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Copy translated sentence to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              id="btn-speak-interpretation"
              onClick={() => onSpeak(suggestion)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-2xs ${
                isSpeaking
                  ? 'bg-[#E07A2B] text-white animate-pulse'
                  : 'bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#255746] text-white'
              }`}
              title="Read sentence aloud via browser speech synthesis"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Clear Label & Pipeline Explanation note */}
      <div className="p-3 bg-[#E8F0EC]/50 dark:bg-[#16251E] rounded-xl border border-[#D5E4DC] dark:border-[#274033] flex items-start gap-2.5 text-[11px] text-stone-600 dark:text-[#D5E2DB]">
        <Info className="w-4 h-4 text-[#4F765E] dark:text-[#4ADE80] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#183D32] dark:text-[#76CBA6]">Pipeline Transparency:</strong> ISL Gestures → MediaPipe 21 Landmarks → Keras Classifier → Sequence Builder → Gemini AI Polish (POST /api/suggest).
        </p>
      </div>
    </div>
  );
};
