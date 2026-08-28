import React from 'react';
import { 
  HeartHandshake, 
  Code2, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Hand,
  CheckCircle2
} from 'lucide-react';
import { BridgeMotif } from './BridgeMotif';

export const AboutView: React.FC = () => {
  return (
    <div id="about-view" className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Title & Mission */}
      <div className="text-center space-y-4 border-b border-stone-200 dark:border-[#283830] pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] text-xs font-bold border border-[#FFEDD5] dark:border-[#4B301F]">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Social Impact & Assistive Technology</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
          About SignBridge India
        </h1>
        <p className="text-[#6E756F] dark:text-[#9FB0A7] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          An AI-assisted Indian Sign Language (ISL) recognition platform engineered to reduce communication barriers between deaf and hard-of-hearing signers and frontline service providers.
        </p>
      </div>

      {/* Vision Statement Quote */}
      <div className="bg-[#183D32] dark:bg-[#14231B] text-[#F7F3EA] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-md border border-transparent dark:border-[#283830]">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E07A2B]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#1D4ED8]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#E07A2B] dark:text-[#FBA65B] font-bold block flex items-center gap-1.5">
            <span>Our Vision</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
          </span>
          <blockquote className="text-xl sm:text-2xl font-serif italic leading-snug text-white">
            "An India where accessibility is built into the service, not added after the problem appears."
          </blockquote>
          <p className="text-xs sm:text-sm text-[#D5E4DC] dark:text-[#B5C7BD] leading-relaxed pt-1">
            Bridging everyday touchpoints across hospitals, railways, schools, and banking counters so every Indian citizen can be understood with dignity.
          </p>
        </div>
      </div>

      {/* 3 Storytelling Pillars: The Problem, The Approach, The Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#19221D] p-7 rounded-3xl border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F7F3EA] dark:bg-[#1D2B22] text-[#D69A4A] dark:text-[#FBA65B] flex items-center justify-center font-bold text-sm border border-[#E8E2D2] dark:border-[#283830]">
            01
          </div>
          <h3 className="font-bold text-[#183D32] dark:text-[#76CBA6] text-base">The Real Challenge</h3>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
            Over 18 million deaf individuals across India experience significant communication hurdles when frontline staff, doctors, and tellers do not understand Indian Sign Language.
          </p>
        </div>

        <div className="bg-white dark:bg-[#19221D] p-7 rounded-3xl border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F0EC] dark:bg-[#172E22] text-[#4F765E] dark:text-[#76CBA6] flex items-center justify-center font-bold text-sm border border-[#D5E4DC] dark:border-[#283830]">
            02
          </div>
          <h3 className="font-bold text-[#183D32] dark:text-[#76CBA6] text-base">Our Approach</h3>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
            Combining MediaPipe hand landmarks, a trained 35-class Keras neural network, and server-side Gemini sentence formatting to create an immediate, accessible translation bridge.
          </p>
        </div>

        <div className="bg-white dark:bg-[#19221D] p-7 rounded-3xl border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F0EC] dark:bg-[#172E22] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold text-sm border border-[#D5E4DC] dark:border-[#283830]">
            03
          </div>
          <h3 className="font-bold text-[#183D32] dark:text-[#76CBA6] text-base">Learning & Community</h3>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
            SignBridge is both a live communication tool and an educational platform, helping hearing staff and citizens learn and practice verified ISL signs with real-time feedback.
          </p>
        </div>
      </div>

      {/* Current MVP vs Future Ecosystem Comparison Table */}
      <div className="bg-white dark:bg-[#19221D] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-[#283830] shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F765E] dark:text-[#76CBA6]">
            Product Matrix
          </span>
          <h2 className="text-xl font-bold text-[#183D32] dark:text-[#F0F5F2] mt-1">
            Current Working MVP vs. Future Ecosystem
          </h2>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] mt-1">
            Maintaining total transparency on active deployed capabilities versus strategic expansion.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-[#283830] text-stone-500 dark:text-[#9FB0A7] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Feature / Dimension</th>
                <th className="py-3 px-4 bg-[#E8F0EC] dark:bg-[#1D3227] text-[#183D32] dark:text-[#76CBA6] font-bold">Current Working MVP</th>
                <th className="py-3 px-4 text-stone-600 dark:text-[#9FB0A7]">Future Roadmap Ecosystem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#283830] text-[#252A27] dark:text-[#E2EAE5]">
              <tr>
                <td className="py-3 px-4 font-semibold">Vocabulary Scale</td>
                <td className="py-3 px-4 bg-[#E8F0EC]/40 dark:bg-[#1D3227]/40 font-medium text-[#183D32] dark:text-[#76CBA6]">
                  35 Classes (Digits 1–9, Letters A–Z)
                </td>
                <td className="py-3 px-4 text-[#6E756F] dark:text-[#9FB0A7]">
                  5000+ Full ISL dynamic word signs & compound sentences
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Machine Learning Core</td>
                <td className="py-3 px-4 bg-[#E8F0EC]/40 dark:bg-[#1D3227]/40 font-medium text-[#183D32] dark:text-[#76CBA6]">
                  MediaPipe HandLandmarker + Keras Softmax
                </td>
                <td className="py-3 px-4 text-[#6E756F] dark:text-[#9FB0A7]">
                  Multi-modal Spatial-Temporal GCNs (Graph Convolutional Networks)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">AI Enhancement</td>
                <td className="py-3 px-4 bg-[#E8F0EC]/40 dark:bg-[#1D3227]/40 font-medium text-[#183D32] dark:text-[#76CBA6]">
                  Gemini-assisted sequence formatting (<code className="text-[10px] bg-stone-100 dark:bg-[#141C18] text-[#183D32] dark:text-[#76CBA6] px-1 py-0.5 rounded">/api/suggest</code>)
                </td>
                <td className="py-3 px-4 text-[#6E756F] dark:text-[#9FB0A7]">
                  Bidirectional two-way ISL avatar rendering
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Deployment Context</td>
                <td className="py-3 px-4 bg-[#E8F0EC]/40 dark:bg-[#1D3227]/40 font-medium text-[#183D32] dark:text-[#76CBA6]">
                  Interactive Browser Webcam (Mobile & Desktop)
                </td>
                <td className="py-3 px-4 text-[#6E756F] dark:text-[#9FB0A7]">
                  Dedicated Hardware Kiosks for Banks, Hospitals, and Transit
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend API Contract & Verification */}
      <div className="bg-[#183D32] dark:bg-[#132019] text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-transparent dark:border-[#283830]">
        <div className="flex items-center justify-between border-b border-[#2F6B57] dark:border-[#283830] pb-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-[#D69A4A] dark:text-[#FBA65B]" />
            <h3 className="font-bold text-base">Backend API Specification</h3>
          </div>
          <span className="text-xs font-mono text-[#D69A4A] dark:text-[#FBA65B] bg-black/30 px-2.5 py-1 rounded-full border border-[#D69A4A]/30">
            Flask v3.x + CORS
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <div className="text-[#D5E4DC] mb-1 font-sans font-semibold">1. Predict Endpoint:</div>
            <pre className="p-3 bg-black/40 rounded-xl overflow-x-auto text-[#F7F3EA] border border-white/10">
{`POST /predict
Content-Type: application/json

Request:
{ "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." }

Response:
{
  "label": "A",
  "confidence": 0.94,
  "top3": [
    { "label": "A", "conf": 0.94 },
    { "label": "S", "conf": 0.03 },
    { "label": "E", "conf": 0.02 }
  ]
}`}
            </pre>
          </div>

          <div>
            <div className="text-[#D5E4DC] mb-1 font-sans font-semibold">2. Sentence Suggestion Endpoint:</div>
            <pre className="p-3 bg-black/40 rounded-xl overflow-x-auto text-[#F7F3EA] border border-white/10">
{`POST /api/suggest
Content-Type: application/json

Request:
{ "text": "H E L L O" }

Response:
{ "suggested": "Hello, how can I help you today?" }`}
            </pre>
          </div>
        </div>
      </div>

      {/* Accessibility Commitment */}
      <div className="bg-[#F7F3EA] dark:bg-[#19221D] rounded-3xl p-6 border border-[#E8E2D2] dark:border-[#283830] flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#D69A4A] dark:text-[#FBA65B]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#183D32] dark:text-[#76CBA6] text-sm">WCAG 2.1 AA Accessibility Standards</h4>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
            Built with strict optical contrast ratios, high contrast mode support, keyboard shortcut controls (<kbd className="bg-white dark:bg-[#131B16] text-[#183D32] dark:text-[#76CBA6] px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700 font-mono text-[10px]">Ctrl + /</kbd>), responsive mobile scaling, and non-reliant color feedback.
          </p>
        </div>
      </div>
    </div>
  );
};
