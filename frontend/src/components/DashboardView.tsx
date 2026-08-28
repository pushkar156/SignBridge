import React from 'react';
import { AppView, BackendConnectionStatus } from '../types';
import { 
  Camera, 
  BookOpen, 
  Target, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Stethoscope,
  GraduationCap,
  Landmark,
  Hand,
  Activity,
  Bot
} from 'lucide-react';
import { BridgeMotif } from './BridgeMotif';

interface DashboardViewProps {
  onNavigate: (view: AppView) => void;
  backendStatus: BackendConnectionStatus;
  onOpenBackendModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  backendStatus,
  onOpenBackendModal,
}) => {
  return (
    <div id="dashboard-view" className="space-y-16 pb-20">
      {/* 1. HERO SECTION: Human, warm, welcoming with subtle tricolour & chakra blue ambient gradient */}
      <section 
        id="hero-section"
        className="relative overflow-hidden rounded-3xl bg-[#F7F3EA] dark:bg-[#16201B] border border-[#E8E2D2] dark:border-[#273B30] p-8 sm:p-12 lg:p-16 shadow-xs transition-colors"
      >
        {/* Subtle Ambient Gradients: Orange, Blue, Green */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E07A2B]/12 dark:bg-[#E07A2B]/15 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#1D4ED8]/10 dark:bg-[#1D4ED8]/15 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#4F765E]/15 dark:bg-[#4F765E]/20 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Subtle Tricolour Bridge Accent Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E2C24]/90 backdrop-blur-xs border border-[#E0D8C8] dark:border-[#2F4438] text-[#252A27] dark:text-[#E2EBE6] text-xs font-semibold shadow-2xs">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[#E07A2B]" />
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
              <span className="w-2 h-2 rounded-full bg-[#4F765E]" />
            </span>
            <span>Built for accessible communication across India</span>
          </div>

          {/* Product Headline & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#183D32] dark:text-[#F0F5F2] leading-[1.1]">
              SIGNBRIDGE <span className="font-light text-[#E07A2B]">INDIA</span>
            </h1>
            <p className="text-xl sm:text-2xl font-serif italic text-[#252A27]/90 dark:text-[#D5E2DB] leading-snug">
              "Turning Indian Sign Language into a communication bridge."
            </p>
            <p className="text-sm sm:text-base text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed max-w-2xl pt-1">
              Helping ISL users and frontline service providers communicate more easily through accessible, respectful AI-assisted vision technology.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              id="hero-btn-live"
              onClick={() => onNavigate('live')}
              className="px-6 py-3.5 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2.5 active:scale-[0.99]"
            >
              <Camera className="w-4 h-4 text-[#E07A2B]" />
              <span>Start Live Communication</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              id="hero-btn-learn"
              onClick={() => onNavigate('learn')}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-[#1C2621] hover:bg-[#FAF8F3] dark:hover:bg-[#23312A] text-[#183D32] dark:text-[#E2EBE6] border border-[#DCD5C5] dark:border-[#2F4438] font-semibold text-sm transition-all shadow-2xs hover:shadow-xs flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#4F765E] dark:text-[#76CBA6]" />
              <span>Explore ISL Dictionary</span>
            </button>

            <button
              id="hero-btn-practice"
              onClick={() => onNavigate('practice')}
              className="px-5 py-3.5 rounded-2xl bg-white/80 dark:bg-[#1A2533] hover:bg-white dark:hover:bg-[#1E2D40] text-[#1D4ED8] dark:text-[#70A6FF] border border-[#BFDBFE] dark:border-[#23426A] font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-[#1D4ED8] dark:text-[#70A6FF]" />
              <span>Practice Mode</span>
            </button>
          </div>

          {/* Live Backend Connection Indicator Pill in Hero */}
          <div className="pt-2 flex items-center gap-3 text-xs text-[#6E756F] dark:text-[#8E9E95]">
            <button
              onClick={onOpenBackendModal}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1E2C24]/90 border border-[#E0D8C8] dark:border-[#2F4438] hover:border-[#4F765E] transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-semibold text-[#252A27] dark:text-[#E2EAE5]">
                {backendStatus === 'connected' ? 'Flask AI Engine Online' : 'Flask AI Engine Standby'}
              </span>
              <span className="text-[11px] text-[#6E756F] dark:text-[#8E9E95]">· 35 Gesture Classes (A–Z, 1–9)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: Horizontal Communication Flow */}
      <section id="how-it-works-section" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EC] dark:bg-[#1B2D24] text-[#183D32] dark:text-[#76CBA6] text-xs font-bold uppercase tracking-wider">
            <span>The Communication Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
            How SignBridge Connects People
          </h2>
          <p className="text-xs sm:text-sm text-[#6E756F] dark:text-[#9FB0A7]">
            Four seamless steps turning hand gestures into natural conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {/* Step 1 - Subtle Warm Orange */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative border-t-2 border-t-[#E07A2B]">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] flex items-center justify-center font-bold text-sm border border-[#FFEDD5] dark:border-[#4B301F]">
              01
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Show Sign</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Sign letters A–Z or digits 1–9 in front of the camera. The video feed remains secure and processed frame-by-frame.
            </p>
            <div className="text-[11px] font-semibold text-[#E07A2B] dark:text-[#FBA65B] bg-[#FFF7ED] dark:bg-[#2C1F15] px-2.5 py-1 rounded-lg inline-block border border-transparent dark:border-[#4B301F]">
              Webcam Capture
            </div>
          </div>

          {/* Step 2 - India Green */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs hover:shadow-xs transition-shadow space-y-3 border-t-2 border-t-[#4F765E]">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0EC] dark:bg-[#1B2E24] text-[#4F765E] dark:text-[#76CBA6] flex items-center justify-center font-bold text-sm border border-[#D5E4DC] dark:border-[#2D4537]">
              02
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Recognise</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              21 anatomical hand landmarks are detected via MediaPipe and classified instantly by the TensorFlow neural model.
            </p>
            <div className="text-[11px] font-semibold text-[#4F765E] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1B2E24] px-2.5 py-1 rounded-lg inline-block border border-transparent dark:border-[#2D4537]">
              MediaPipe + Keras Softmax
            </div>
          </div>

          {/* Step 3 - Subtle Warm Saffron */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs hover:shadow-xs transition-shadow space-y-3 border-t-2 border-t-[#D97706]">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7]/60 dark:bg-[#2C2413] text-[#B45309] dark:text-[#FCD34D] flex items-center justify-center font-bold text-sm border border-[#FDE68A] dark:border-[#523F1C]">
              03
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Build Message</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Signs held steady are debounced and accumulated into words, spelling out names, numbers, or key phrases.
            </p>
            <div className="text-[11px] font-semibold text-[#B45309] dark:text-[#FCD34D] bg-[#FEF3C7]/60 dark:bg-[#2C2413] px-2.5 py-1 rounded-lg inline-block border border-transparent dark:border-[#523F1C]">
              Sequence Debouncing
            </div>
          </div>

          {/* Step 4 - Subtle India Green */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs hover:shadow-xs transition-shadow space-y-3 border-t-2 border-t-[#4F765E]">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0EC] dark:bg-[#1B2E24] text-[#4F765E] dark:text-[#76CBA6] flex items-center justify-center font-bold text-sm border border-[#D5E4DC] dark:border-[#2D4537]">
              04
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Communicate</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              AI suggests natural, polite conversational phrasing with one-click voice readout (TTS) and text copy for instant clarity.
            </p>
            <div className="text-[11px] font-semibold text-[#4F765E] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1B2E24] px-2.5 py-1 rounded-lg inline-block border border-transparent dark:border-[#2D4537]">
              Gemini AI + Voice TTS
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: WHY THIS MATTERS (EDITORIAL QUOTE & 3 CORE PILLARS) */}
      <section id="why-this-matters-section" className="space-y-10">
        {/* Strong Typographic Quote Card with Subtle Orange & Blue Atmosphere */}
        <div className="bg-[#183D32] dark:bg-[#132820] text-[#F7F3EA] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md border border-transparent dark:border-[#234234]">
          {/* Subtle Decorative Accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#E07A2B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#1D4ED8]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-4 relative z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E07A2B] font-bold">
                Why This Matters
              </span>
            </div>
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif italic leading-snug text-white">
              "Accessibility is not just about providing a tool. It's about making sure the person on the other side can actually be understood."
            </blockquote>
            <p className="text-xs sm:text-sm text-[#D5E4DC] leading-relaxed pt-2">
              Millions of deaf individuals in India encounter friction every day simply trying to explain symptoms, open bank accounts, or register for public services. SignBridge bridges that gap with empathy, dignity, and real technology.
            </p>
          </div>
        </div>

        {/* 3 Human-Centric Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Subtle Warm Orange */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-7 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3 relative hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] flex items-center justify-center font-bold border border-[#FFEDD5] dark:border-[#4B301F]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Break the Barrier</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Enable deaf signers to express immediate needs and information independently, without relying solely on an interpreter or accompanying relative.
            </p>
          </div>

          {/* Pillar 2: Subtle Chakra Blue */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-7 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3 relative hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#162338] text-[#1D4ED8] dark:text-[#70A6FF] flex items-center justify-center font-bold border border-[#DBEAFE] dark:border-[#233B60]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Learn ISL</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Foster national awareness by offering an interactive dictionary and real-time practice camera for anyone who wants to learn Indian Sign Language.
            </p>
          </div>

          {/* Pillar 3: Deep India Green */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-7 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3 relative hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] dark:bg-[#1B2E24] text-[#183D32] dark:text-[#76CBA6] flex items-center justify-center font-bold border border-[#D5E4DC] dark:border-[#2D4537]">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Make Services Accessible</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Take tangible steps toward ISL-ready hospitals, schools, transport hubs, and public-service desks across the nation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION: DESIGNED FOR EVERYDAY SERVICES */}
      <section id="everyday-services-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 dark:border-[#283830] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FFEDD5] dark:border-[#4B301F]">
              <span>Real-World Impact</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
              Designed for Everyday Public Services
            </h2>
          </div>
          <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] italic">
            Designed with real-world service environments in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Healthcare - Soft Rose */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-[#2E181D] text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Healthcare & Clinics</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Rapid triage, emergency patient intake, symptom spelling, and doctor consultations without communication delay.
            </p>
          </div>

          {/* Education - Warm Saffron Orange */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] dark:bg-[#2C1F15] text-[#E07A2B] dark:text-[#FBA65B] flex items-center justify-center font-bold border border-[#FFEDD5] dark:border-[#4B301F]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Schools & Colleges</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Inclusive classrooms, peer conversations, academic questions, and student welfare support.
            </p>
          </div>

          {/* Banking - Deep Green */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#152B20] text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Banking & Finance</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Account opening, counter transactions, private requests, and document clarification with full privacy.
            </p>
          </div>

          {/* Public Transit & Desks - Subtle Chakra Blue */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-6 border border-stone-200/90 dark:border-[#283830] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-[#162338] text-[#1D4ED8] dark:text-[#70A6FF] flex items-center justify-center font-bold border border-[#DBEAFE] dark:border-[#233B60]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#183D32] dark:text-[#E2EBE6]">Transit & Public Desks</h3>
            <p className="text-xs text-[#6E756F] dark:text-[#9FB0A7] leading-relaxed">
              Railway counters, metro stations, post offices, and municipal citizen service centers.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION: CURRENT WORKING MVP VS FUTURE VISION ROADMAP */}
      <section id="roadmap-vision-section" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EC] dark:bg-[#1B2D24] text-[#183D32] dark:text-[#76CBA6] text-xs font-bold uppercase tracking-wider">
            <span>Product Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183D32] dark:text-[#F0F5F2] tracking-tight">
            From MVP to ISL-Ready India
          </h2>
          <p className="text-xs sm:text-sm text-[#6E756F] dark:text-[#9FB0A7]">
            Transparent roadmap detailing active working features and our vision for national deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1: Today - India Green */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-7 border-2 border-[#4F765E]/50 dark:border-[#4F765E]/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#183D32] dark:text-[#76CBA6] bg-[#E8F0EC] dark:bg-[#1B2E24] px-3 py-1 rounded-full">
                Today · MVP Ready
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Working Core</h3>
            <ul className="space-y-2.5 text-xs text-[#252A27] dark:text-[#CFDBD5]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Gesture Recognition:</strong> 35 ISL classes (Digits 1–9, Alphabet A–Z)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>MediaPipe Landmarks:</strong> 21-point normalized hand landmark extraction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Sequence Builder:</strong> Real-time debounced character accumulator</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Gemini AI Sentence Polishing:</strong> POST /api/suggest context translation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Speech Output:</strong> One-tap browser SpeechSynthesis readout</span>
              </li>
            </ul>
          </div>

          {/* Phase 2: Next - Subtle Warm Orange */}
          <div className="bg-[#FAF8F3] dark:bg-[#17201B] rounded-3xl p-7 border border-[#FFEDD5] dark:border-[#422D1F] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2E3B33] pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E07A2B] dark:text-[#FBA65B] bg-[#FFF7ED] dark:bg-[#2A1D13] px-3 py-1 rounded-full border border-[#FFEDD5] dark:border-[#4B301F]">
                Next · Coming Soon
              </span>
            </div>

            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Expansion Tier</h3>
            <ul className="space-y-2.5 text-xs text-[#6E756F] dark:text-[#9FB0A7]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A2B] shrink-0 mt-1.5" />
                <span><strong>Expanded Vocabulary:</strong> Common words & multi-hand signs (Greetings, Help, Emergency)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A2B] shrink-0 mt-1.5" />
                <span><strong>Two-Way Communication:</strong> Speech-to-ISL visual feedback avatar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A2B] shrink-0 mt-1.5" />
                <span><strong>Verified Video Guides:</strong> Native deaf educator video demonstrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A2B] shrink-0 mt-1.5" />
                <span><strong>Offline Model Caching:</strong> Edge TensorFlow.js for low-connectivity clinics</span>
              </li>
            </ul>
          </div>

          {/* Phase 3: Future Vision - Subtle Chakra Blue */}
          <div className="bg-white dark:bg-[#1A241F] rounded-3xl p-7 border border-[#DBEAFE] dark:border-[#203656] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#283830] pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1D4ED8] dark:text-[#70A6FF] bg-[#EFF6FF] dark:bg-[#162338] px-3 py-1 rounded-full border border-[#DBEAFE] dark:border-[#233B60]">
                Future · National Vision
              </span>
            </div>

            <h3 className="font-bold text-lg text-[#183D32] dark:text-[#E2EBE6]">Ecosystem Scale</h3>
            <ul className="space-y-2.5 text-xs text-[#6E756F] dark:text-[#9FB0A7]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#70A6FF] shrink-0 mt-1.5" />
                <span><strong>Institutional Kiosks:</strong> Dedicated hardware for hospital & railway counters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#70A6FF] shrink-0 mt-1.5" />
                <span><strong>ISL Readiness Certification:</strong> Accessibility benchmarking for public agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#70A6FF] shrink-0 mt-1.5" />
                <span><strong>Regional Dialect Support:</strong> State-level ISL variation adaptation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#70A6FF] shrink-0 mt-1.5" />
                <span><strong>Deaf Community Governance:</strong> Continuous model fine-tuning with ISL community feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="relative overflow-hidden bg-[#E8F0EC] dark:bg-[#17251E] rounded-3xl p-8 sm:p-10 border-2 border-[#4F765E] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1 max-w-lg">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#183D32] dark:text-[#F0F5F2]">
            Ready to test live recognition?
          </h3>
          <p className="text-xs sm:text-sm text-[#4F765E] dark:text-[#88DAB0]">
            Enable your camera and experience real-time ISL gesture recognition and AI sentence translation.
          </p>
        </div>
        <button
          onClick={() => onNavigate('live')}
          className="px-6 py-3.5 rounded-2xl bg-[#183D32] dark:bg-[#2F6B57] hover:bg-[#204E40] dark:hover:bg-[#275848] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <span>Launch Live Communicator</span>
          <ArrowRight className="w-4 h-4 text-[#E07A2B]" />
        </button>
      </section>
    </div>
  );
};
