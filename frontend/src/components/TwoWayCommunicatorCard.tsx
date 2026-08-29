import React, { useState } from 'react';
import { MessageSquare, Send, Volume2, Sparkles, ArrowRightLeft } from 'lucide-react';

interface TwoWayCommunicatorCardProps {
  onSpeak: (text: string) => void;
}

export const TwoWayCommunicatorCard: React.FC<TwoWayCommunicatorCardProps> = ({ onSpeak }) => {
  const [replyText, setReplyText] = useState('');
  const [activeSentence, setActiveSentence] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setActiveSentence(replyText.trim());
    onSpeak(replyText.trim());
  };

  const getLetterCards = (text: string) => {
    return text.toUpperCase().split('').map((char, i) => {
      const isAlpha = /^[A-Z0-9]$/.test(char);
      return {
        char,
        isAlpha,
        key: `${char}-${i}`,
      };
    });
  };

  return (
    <div 
      id="two-way-communicator-card"
      className="bg-white dark:bg-[#19221D] rounded-3xl p-6 shadow-sm border border-stone-200/90 dark:border-[#283830] space-y-4 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] dark:bg-[#17253D] text-[#1D4ED8] dark:text-[#93C5FD] flex items-center justify-center font-bold text-xs border border-[#DBEAFE] dark:border-[#1E3A5F]">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-[#E2EAE5]">
              Two-Way Communication (Hearing Reply)
            </h3>
            <p className="text-[11px] text-stone-400 dark:text-[#9FB0A7]">
              Non-signing user types/speaks → Converts to Sign Badges & Audio
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] px-2.5 py-0.5 rounded-full border border-[#D5E4DC] dark:border-[#2A4435]">
          Hearing → Deaf Mode
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type reply for deaf user (e.g., Hello, how can I help?)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#131B16] border border-[#E8E2D2] dark:border-[#283830] text-xs font-medium text-stone-800 dark:text-[#E2EAE5] focus:outline-none focus:ring-2 focus:ring-[#183D32] dark:focus:ring-[#2F6B57]"
        />
        <button
          type="submit"
          disabled={!replyText.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#1D4ED8] dark:bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Reply</span>
        </button>
      </form>

      {/* Visual Sign Card Display for Reply */}
      {activeSentence && (
        <div className="bg-[#FAF8F3] dark:bg-[#131B16] rounded-2xl p-4 border border-[#E8E2D2] dark:border-[#283830] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#9FB0A7] font-medium">
            <span>Visual Sign Sequence for Deaf Recipient:</span>
            <button
              onClick={() => onSpeak(activeSentence)}
              className="text-[#1D4ED8] dark:text-[#60A5FA] hover:underline text-[11px] font-semibold flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Replay Audio</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 font-mono">
            {getLetterCards(activeSentence).map((item) => (
              <span
                key={item.key}
                className={`inline-flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl text-sm font-bold shadow-2xs ${
                  item.char === ' '
                    ? 'bg-stone-200 dark:bg-[#25332A] text-stone-400 min-w-[20px] border border-stone-300 dark:border-stone-600'
                    : 'bg-white dark:bg-[#1D2821] text-[#1D4ED8] dark:text-[#93C5FD] border border-[#BFDBFE] dark:border-[#2E4A6B]'
                }`}
              >
                <span>{item.char === ' ' ? '␣' : item.char}</span>
                {item.isAlpha && <span className="text-[8px] font-sans font-normal opacity-60">ISL</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
