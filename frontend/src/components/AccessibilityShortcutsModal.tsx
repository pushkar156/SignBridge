import React from 'react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';

interface AccessibilityShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityShortcutsModal: React.FC<AccessibilityShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Capture / Pause camera frame loop' },
    { key: 'Backspace', desc: 'Undo last character in sequence' },
    { key: 'Alt + S', desc: 'Trigger AI Sentence Suggestion' },
    { key: 'Alt + C', desc: 'Clear recognised sequence' },
    { key: 'Alt + L', desc: 'Listen / Read out last AI interpretation' },
    { key: '1 - 5', desc: 'Navigate between tabs (Dashboard, Live, Learn, Practice, About)' },
    { key: 'Esc', desc: 'Close any active dialog/modal' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#1A241F] rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 dark:border-[#283830] p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3 mb-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-[#F0F5F2] font-bold">
            <Keyboard className="w-5 h-5 text-[#2F6B57] dark:text-[#4ADE80]" />
            <span>Keyboard Navigation & Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-[#9FB0A7] mb-4">
          Designed for accessibility and rapid hands-free interaction for signers and educators.
        </p>

        <div className="space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 dark:bg-[#141B17] border border-stone-100 dark:border-[#24332A]">
              <span className="text-stone-700 dark:text-[#D5E2DB] font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-[#1E2822] rounded border border-stone-300 dark:border-stone-600 font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#2F6B57] dark:hover:bg-[#275848] text-white text-xs font-semibold rounded-xl transition-colors"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
