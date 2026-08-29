import React, { useState, useEffect } from 'react';
import { AppView, BackendConnectionStatus, AccessibilitySettings, ISLClassInfo } from './types';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { LiveCommunicatorView } from './components/LiveCommunicatorView';
import { LearnISLView } from './components/LearnISLView';
import { PracticeView } from './components/PracticeView';
import { AboutView } from './components/AboutView';
import { BackendStatusModal } from './components/BackendStatusModal';
import { AccessibilityShortcutsModal } from './components/AccessibilityShortcutsModal';
import { checkBackendHealth } from './services/api';
import { ISL_CLASSES } from './data/islClasses';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [backendStatus, setBackendStatus] = useState<BackendConnectionStatus>('checking');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [selectedPracticeSign, setSelectedPracticeSign] = useState<ISLClassInfo | null>(ISL_CLASSES[0]);

  // Accessibility state with dark mode persistence
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const savedDark = localStorage.getItem('signbridge_dark_mode');
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      darkMode: savedDark !== null ? savedDark === 'true' : prefersDark,
      highContrast: false,
      fontSize: 'normal',
      autoSpeakSuggestions: true,
      speechRate: 1.0,
      highlightDetectionZone: true,
    };
  });

  // Synchronize documentElement class for dark mode
  useEffect(() => {
    if (accessibility.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('signbridge_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('signbridge_dark_mode', 'false');
    }
  }, [accessibility.darkMode]);

  // Initial Backend Health Ping
  useEffect(() => {
    let isMounted = true;
    const testHealth = async () => {
      try {
        const result = await checkBackendHealth();
        if (isMounted) {
          setBackendStatus(result.isOnline ? 'connected' : 'offline');
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    };
    testHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Global Keybindings (1-5 for tab switches, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        setIsBackendModalOpen(false);
        setIsShortcutsModalOpen(false);
      } else if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      } else if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') setCurrentView('dashboard');
        else if (e.key === '2') setCurrentView('live');
        else if (e.key === '3') setCurrentView('learn');
        else if (e.key === '4') setCurrentView('practice');
        else if (e.key === '5') setCurrentView('about');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPracticeSign = (sign: ISLClassInfo) => {
    setSelectedPracticeSign(sign);
    setCurrentView('practice');
  };

  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
  };

  // Font size class mapping
  const fontSizeClass =
    accessibility.fontSize === 'large'
      ? 'text-[17px]'
      : accessibility.fontSize === 'xl'
      ? 'text-[19px]'
      : 'text-[15px]';

  return (
    <div
      id="app-root"
      className={`min-h-screen flex flex-col bg-[#FAFAF7] dark:bg-[#121614] text-[#202522] dark:text-[#E6ECE8] transition-colors duration-200 ${fontSizeClass} ${
        accessibility.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Top Navigation & Status Bar */}
      <Navigation
        currentView={currentView}
        onNavigate={setCurrentView}
        backendStatus={backendStatus}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Content Area with Smooth Page Transition */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div key={currentView} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentView}
              backendStatus={backendStatus}
              onOpenBackendModal={() => setIsBackendModalOpen(true)}
            />
          )}

          {currentView === 'live' && (
            <LiveCommunicatorView
              onBack={() => setCurrentView('dashboard')}
              backendStatus={backendStatus}
              onOpenBackendModal={() => setIsBackendModalOpen(true)}
              accessibility={accessibility}
              onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
            />
          )}

          {currentView === 'learn' && (
            <LearnISLView
              onSelectPracticeSign={handleSelectPracticeSign}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'practice' && (
            <PracticeView
              selectedSign={selectedPracticeSign}
              onSelectSign={setSelectedPracticeSign}
              backendStatus={backendStatus}
              onOpenBackendModal={() => setIsBackendModalOpen(true)}
            />
          )}

          {currentView === 'about' && <AboutView />}
        </div>
      </main>

      {/* Persistent Bottom Bar / Footer with Quick Switch and Status */}
      <footer className="mt-auto bg-white dark:bg-[#161D19] border-t border-[#E8F0EC] dark:border-[#233128] py-4 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6D756F] dark:text-[#8E9E95]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F6B57] dark:bg-[#34D399]" />
            <span className="font-semibold text-[#183D32] dark:text-[#76CBA6]">SignBridge India</span>
            <span>—</span>
            <span>AI-Assisted Indian Sign Language Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-[#183D32] dark:hover:text-white transition-colors"
            >
              Shortcuts (<kbd className="px-1 py-0.5 bg-stone-100 dark:bg-[#222E27] dark:text-stone-300 rounded text-[10px]">Ctrl+/</kbd>)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="hover:text-[#183D32] dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span>API: {backendStatus === 'connected' ? 'Connected' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        backendStatus={backendStatus}
        onStatusChange={setBackendStatus}
      />

      <AccessibilityShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}

