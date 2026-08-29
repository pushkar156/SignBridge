import React, { useState } from 'react';
import { ISLClassInfo, AppView } from '../types';
import { ISL_CLASSES } from '../data/islClasses';
import { 
  BookOpen, 
  Search, 
  Target, 
  Hand, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LearnISLViewProps {
  onSelectPracticeSign: (sign: ISLClassInfo) => void;
  onNavigate: (view: AppView) => void;
}

export const LearnISLView: React.FC<LearnISLViewProps> = ({
  onSelectPracticeSign,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Alphabet' | 'Numbers'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ISLClassInfo | null>(null);

  const filteredClasses = ISL_CLASSES.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || (
      item.label.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.handShapeTips.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.commonMistakes && item.commonMistakes.toLowerCase().includes(query))
    );

    // If active search query exists, match globally across all categories
    const matchesTab = activeTab === 'All' || item.category === activeTab || Boolean(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div id="learn-isl-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-[#283830] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] text-xs font-bold mb-2 border border-[#FFEDD5] dark:border-[#4B301F]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ISL Dictionary & Knowledge Base</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] ml-1" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
            Start with a sign. Build a language.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E756F] dark:text-[#9FB0A7] mt-1">
            Master all 35 supported gestures (Letters A–Z and Digits 1–9) with verified anatomical hand configurations.
          </p>
        </div>

        {/* Practice All CTA */}
        <button
          onClick={() => onNavigate('practice')}
          className="px-5 py-2.5 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Target className="w-4 h-4 text-[#E07A2B] dark:text-[#FBA65B]" />
          <span>Launch Practice Studio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#19221D] p-3.5 rounded-2xl border border-stone-200 dark:border-[#283830] shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto bg-[#FAF8F3] dark:bg-[#131B16] p-1 rounded-xl border border-[#E8E2D2] dark:border-[#283830]">
          {(['All', 'Alphabet', 'Numbers'] as const).map((tab) => {
            const isActive = activeTab === tab && !searchQuery.trim();
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-[#1D2821] text-[#183D32] dark:text-[#76CBA6] shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  tab === 'Alphabet' 
                    ? 'bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B]' 
                    : tab === 'Numbers' 
                    ? 'bg-[#EFF6FF] dark:bg-[#17253D] text-[#1D4ED8] dark:text-[#93C5FD]' 
                    : 'bg-stone-100 dark:bg-[#1E2822] text-stone-500 dark:text-stone-400'
                }`}>
                  {tab === 'All' ? '35' : tab === 'Alphabet' ? 'A–Z' : '1–9'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field with Instant Reset Button */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-learn-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sign (e.g., A, 5, thumb, fist)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 dark:border-[#283830] text-xs focus:outline-none focus:ring-2 focus:ring-[#183D32] bg-[#FAF8F3] dark:bg-[#131B16] text-[#202522] dark:text-[#E2EAE5]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 text-xs font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of 35 ISL Sign Cards */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredClasses.map((sign) => (
          <div
            key={sign.id}
            id={`learn-card-${sign.label}`}
            className="bg-white dark:bg-[#19221D] rounded-3xl p-5 border border-stone-200/90 dark:border-[#283830] shadow-2xs hover:shadow-md hover:border-[#4F765E] transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top: Label & Category */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F3EA] dark:bg-[#16201B] text-[#183D32] dark:text-[#76CBA6] font-black text-2xl flex items-center justify-center border border-[#E8E2D2] dark:border-[#273B30] shadow-inner group-hover:scale-105 transition-transform font-mono">
                  {sign.label}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F3] dark:bg-[#141C18] text-stone-600 dark:text-stone-400 uppercase tracking-wider border border-[#E8E2D2] dark:border-[#283830]">
                  {sign.category}
                </span>
              </div>

              {/* Title & Name */}
              <h3 className="font-bold text-base text-stone-900 dark:text-[#F0F5F2] mb-1">
                {sign.name}
              </h3>

              {/* Demonstration Gesture Image */}
              <div className="my-3 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center p-1 shadow-inner">
                <img 
                  src={`/dataset_samples/${sign.label}.jpg`} 
                  alt={`ISL Gesture for ${sign.label}`}
                  className="w-full h-36 object-contain rounded-xl bg-stone-950"
                />
              </div>

              {/* Hand Shape Guidance Description */}
              <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed line-clamp-3 mb-2">
                {sign.handShapeTips}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-[#283830] flex items-center gap-2 mt-2">
              <button
                onClick={() => setSelectedClass(sign)}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-100 dark:bg-[#1E2822] hover:bg-stone-200 dark:hover:bg-[#283830] text-stone-700 dark:text-stone-200 text-xs font-semibold transition-colors text-center"
              >
                Inspect
              </button>

              <button
                onClick={() => onSelectPracticeSign(sign)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <Target className="w-3.5 h-3.5 text-[#D69A4A] dark:text-[#FBA65B]" />
                <span>Practice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="bg-white dark:bg-[#19221D] rounded-3xl p-12 text-center border border-stone-200 dark:border-[#283830] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-[#1D2821] text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800 dark:text-[#E2EAE5]">No ISL Signs Found</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            No supported signs match "<span className="font-semibold text-[#183D32] dark:text-[#76CBA6]">{searchQuery}</span>". Try searching for a letter (A–Z), digit (1–9), or gesture description.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-[#183D32] dark:bg-[#2F6B57] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#204E40]"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Inspect Detail Modal */}
      {selectedClass && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedClass(null)}
        >
          <div 
            className="bg-white dark:bg-[#19221D] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-[#283830] animate-in fade-in zoom-in-95 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] text-white font-extrabold text-2xl flex items-center justify-center font-mono">
                  {selectedClass.label}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-[#F0F5F2]">{selectedClass.name}</h3>
                  <span className="text-xs text-stone-500 dark:text-[#9FB0A7]">{selectedClass.category} Class</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Demonstration Media Gesture Image */}
            <div className="bg-stone-900 rounded-2xl p-2 border border-stone-800 text-center flex flex-col items-center justify-center relative">
              <img 
                src={`/dataset_samples/${selectedClass.label}.jpg`} 
                alt={`ISL Gesture for ${selectedClass.label}`}
                className="w-full h-52 object-contain rounded-xl bg-stone-950"
              />
              <span className="mt-2 text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Gesture Reference for Sign {selectedClass.label}</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#183D32] dark:text-[#76CBA6] uppercase tracking-wider block mb-1">
                  Hand Shape & Finger Alignment
                </span>
                <p className="text-[#6E756F] dark:text-[#9FB0A7] bg-[#FAF8F3] dark:bg-[#141C18] p-3 rounded-xl border border-[#E8E2D2] dark:border-[#283830]">
                  {selectedClass.handShapeTips}
                </p>
              </div>

              {selectedClass.commonMistakes && (
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block mb-1">
                    Recognition Precision Tips
                  </span>
                  <p className="text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-[#2A2215] p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
                    {selectedClass.commonMistakes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedClass(null)}
                className="flex-1 py-2.5 bg-stone-100 dark:bg-[#1E2822] hover:bg-stone-200 dark:hover:bg-[#283830] text-stone-700 dark:text-stone-200 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedClass;
                  setSelectedClass(null);
                  onSelectPracticeSign(s);
                }}
                className="flex-1 py-2.5 bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Target className="w-4 h-4 text-[#D69A4A] dark:text-[#FBA65B]" />
                <span>Practice this sign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
