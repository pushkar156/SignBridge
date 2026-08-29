import React from 'react';
import { 
  Delete, 
  RotateCcw, 
  Sparkles, 
  Space, 
  Type, 
  Plus
} from 'lucide-react';

interface SequenceBuilderProps {
  sequence: string[];
  onUndo: () => void;
  onClear: () => void;
  onAddCharacter: (char: string) => void;
  onAddSpace: () => void;
  onRequestAISuggestion: () => void;
  isSuggesting: boolean;
  autoDebounceEnabled: boolean;
  onToggleAutoDebounce: () => void;
  lastPredictionLabel?: string | null;
}

export const SequenceBuilder: React.FC<SequenceBuilderProps> = ({
  sequence,
  onUndo,
  onClear,
  onAddCharacter,
  onAddSpace,
  onRequestAISuggestion,
  isSuggesting,
  autoDebounceEnabled,
  onToggleAutoDebounce,
  lastPredictionLabel,
}) => {
  const hasItems = sequence.length > 0;

  return (
    <div 
      id="sequence-builder-card"
      className="bg-white dark:bg-[#19221D] rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200/90 dark:border-[#283830] space-y-3"
    >
      {/* Header with Title and Mode Toggle */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold text-xs">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5]">
              Recognised Message Sequence
            </h3>
            <p className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">
              Debounced Sign Accumulator ({sequence.length} characters)
            </p>
          </div>
        </div>

        {/* Auto debounce stability pill */}
        <button
          onClick={onToggleAutoDebounce}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
            autoDebounceEnabled
              ? 'bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] border-[#D5E4DC] dark:border-[#2A4435]'
              : 'bg-stone-100 dark:bg-[#1E2822] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
          title="Auto-debounce appends characters only when held stable"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoDebounceEnabled ? 'bg-emerald-600 dark:bg-[#4ADE80]' : 'bg-stone-400'}`} />
          <span>Auto-Append: {autoDebounceEnabled ? 'ON' : 'MANUAL'}</span>
        </button>
      </div>

      {/* Sequence Display Box */}
      <div className="bg-[#FAF8F3] dark:bg-[#131B16] rounded-2xl p-4 border border-[#E8E2D2] dark:border-[#283830] min-h-[90px] flex items-center justify-between gap-3 overflow-x-auto">
        {hasItems ? (
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            {sequence.map((char, index) => {
              const isSpace = char === ' ';
              return (
                <span
                  key={`${char}-${index}`}
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-base sm:text-lg font-bold shadow-2xs transition-transform hover:scale-105 ${
                    isSpace
                      ? 'bg-stone-200 dark:bg-[#25332A] text-stone-500 dark:text-stone-400 min-w-[28px] border border-stone-300 dark:border-stone-600'
                      : 'bg-white dark:bg-[#1D2821] text-[#183D32] dark:text-[#76CBA6] border border-[#D5E4DC] dark:border-[#2C3F34]'
                  }`}
                  title={`Character #${index + 1}: ${isSpace ? 'Space' : char}`}
                >
                  {isSpace ? '␣' : char}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-stone-400 dark:text-[#9FB0A7] text-xs italic flex items-center gap-2">
            <span>Show ISL signs or use manual addition to construct words...</span>
          </div>
        )}

        {/* Quick Manual Add Current Sign Button */}
        {lastPredictionLabel && lastPredictionLabel !== '?' && !autoDebounceEnabled && (
          <button
            onClick={() => onAddCharacter(lastPredictionLabel)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#4F765E] dark:bg-[#2F6B57] text-white text-xs font-semibold hover:bg-[#183D32] transition-colors flex items-center gap-1 shadow-2xs"
            title={`Append current sign '${lastPredictionLabel}'`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add '{lastPredictionLabel}'</span>
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Left Action Buttons: Undo, Space, Clear */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-undo-sequence"
            onClick={onUndo}
            disabled={!hasItems}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#1E2822] hover:bg-stone-200 dark:hover:bg-[#283830] text-stone-700 dark:text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-200 dark:border-stone-700"
            title="Undo last character"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            id="btn-space-sequence"
            onClick={onAddSpace}
            disabled={!hasItems || sequence[sequence.length - 1] === ' '}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#1E2822] hover:bg-stone-200 dark:hover:bg-[#283830] text-stone-700 dark:text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-200 dark:border-stone-700"
            title="Add space between words"
          >
            <Space className="w-3.5 h-3.5" />
            <span>Space</span>
          </button>

          <button
            id="btn-clear-sequence"
            onClick={onClear}
            disabled={!hasItems}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#1E2822] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-stone-600 dark:text-stone-300 font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-200 dark:border-stone-700"
            title="Clear sequence"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Right CTA Button: Suggest Natural English Sentence */}
        <button
          id="btn-suggest-sentence"
          onClick={onRequestAISuggestion}
          disabled={!hasItems || isSuggesting}
          className="px-5 py-2.5 rounded-xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#255746] text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#E07A2B] dark:text-[#FBA65B] ${isSuggesting ? 'animate-spin' : ''}`} />
          <span>{isSuggesting ? 'Processing AI...' : 'Suggest Natural Sentence'}</span>
        </button>
      </div>

      {/* Gboard Predictive Word Suggestion Chips */}
      {(() => {
        const rawText = sequence.join('');
        const words = rawText.split(' ');
        const lastWord = words[words.length - 1].toUpperCase();

        const DICTIONARY = [
          'HELLO', 'HELP', 'HEALTH', 'HOSPITAL', 'HAPPY', 'HOW', 'HOME',
          'THANK', 'THANKS', 'TODAY', 'TIME',
          'WATER', 'WHERE', 'WHAT', 'WHEN', 'WHY', 'WORLD',
          'PLEASE', 'POLICE', 'PAIN',
          'GOOD', 'GREAT', 'GO',
          'MORNING', 'MEET', 'NAME',
          'YES', 'NO', 'DEAF', 'SIGN', 'FRIEND', 'FAMILY', 'DOCTOR'
        ];

        let matches: string[] = [];
        if (lastWord.length >= 1) {
          matches = DICTIONARY.filter(w => w.startsWith(lastWord) && w !== lastWord).slice(0, 4);
        }

        if (matches.length === 0) return null;

        const handleSelectSuggestion = (fullWord: string) => {
          // Replace last word in sequence with fullWord + space
          const prevWords = words.slice(0, -1);
          const newText = [...prevWords, fullWord, ''].join(' ');
          const newSeq = newText.split('');
          // Update sequence in parent via onClear & onAddCharacter
          onClear();
          newSeq.forEach(c => onAddCharacter(c));
        };

        return (
          <div className="pt-2 border-t border-stone-100 dark:border-[#283830] animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-[#E07A2B]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-[#9FB0A7]">
                Gboard Word Predictions:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {matches.map((word) => (
                <button
                  key={word}
                  onClick={() => handleSelectSuggestion(word)}
                  className="px-3 py-1.5 rounded-full bg-[#EFF6FF] dark:bg-[#1E2E3D] hover:bg-[#DBEAFE] dark:hover:bg-[#2A3E52] text-[#1D4ED8] dark:text-[#93C5FD] border border-[#BFDBFE] dark:border-[#2E4A6B] text-xs font-semibold transition-all hover:scale-105 shadow-2xs flex items-center gap-1"
                  title={`Complete word to '${word}'`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] opacity-60">↵</span>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Quick Emergency & Preset Phrases Bar */}
      <div className="pt-2 border-t border-stone-100 dark:border-[#283830]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
          Quick Emergency & Phrase Shortcuts:
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { label: '🚑 Need Help', phrase: 'HELP NEEDED' },
            { label: '🏥 Hospital', phrase: 'WHERE HOSPITAL' },
            { label: '🙏 Thank You', phrase: 'THANK YOU' },
            { label: '🤟 I am Deaf', phrase: 'I AM DEAF' },
            { label: '💧 Need Water', phrase: 'NEED WATER' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onClear();
                preset.phrase.split('').forEach(c => onAddCharacter(c));
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1E2822] hover:bg-[#E8F0EC] dark:hover:bg-[#25382E] text-stone-700 dark:text-[#D5E2DB] text-[11px] font-medium transition-colors border border-stone-200 dark:border-[#283830]"
              title={`Load preset '${preset.phrase}'`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
