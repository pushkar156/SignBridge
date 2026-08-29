import React, { useState } from 'react';
import { AppView, BackendConnectionStatus, AccessibilitySettings } from '../types';
import { 
  Camera, 
  BookOpen, 
  Target, 
  Home, 
  Info, 
  Activity, 
  Settings, 
  Eye, 
  Menu, 
  X,
  Volume2,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  backendStatus: BackendConnectionStatus;
  onOpenBackendModal: () => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  onOpenShortcutsModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  backendStatus,
  onOpenBackendModal,
  accessibility,
  onUpdateAccessibility,
  onOpenShortcutsModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [a11yMenuOpen, setA11yMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'live', label: 'Live Communicator', icon: <Camera className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn ISL', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    onUpdateAccessibility({ darkMode: !accessibility.darkMode });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#161D19]/95 backdrop-blur-md border-b border-[#E8F0EC] dark:border-[#233128] shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            id="nav-brand"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#183D32] dark:focus:ring-[#4F765E] rounded-xl p-1"
            role="button"
            tabIndex={0}
            aria-label="SignBridge India Home"
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('dashboard')}
          >
            {/* Custom Generated SignBridge Brand Logo Icon Only */}
            <div className="relative w-10 h-10 bg-white dark:bg-[#122D25] rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-all border border-[#2F6B57]/40 overflow-hidden" title="SignBridge India">
              <img 
                src="/signbridge_logo.jpg" 
                alt="SignBridge Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop Navigation Links (Sleek Glassmorphic Pill Bar) */}
          <nav className="hidden md:flex items-center p-1 bg-[#F5F8F6] dark:bg-[#131B16] rounded-2xl border border-stone-200/60 dark:border-[#243329]" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#183D32] text-white shadow-sm dark:bg-[#255746] dark:text-white'
                      : 'text-stone-600 dark:text-[#9FB0A7] hover:text-[#183D32] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1E2A23]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'live' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Backend Settings Icon Button */}
            <button
              id="btn-backend-status"
              onClick={onOpenBackendModal}
              title={`Backend Status: ${backendStatus}. Click to configure connection`}
              className="relative p-2 rounded-xl text-stone-600 dark:text-[#A0B0A7] bg-[#F5F8F6] dark:bg-[#131B16] border border-stone-200/60 dark:border-[#243329] hover:bg-[#E8F0EC] dark:hover:bg-[#1C2821] hover:text-[#183D32] dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#183D32]"
              aria-label={`Backend status: ${backendStatus}. Click to configure connection`}
            >
              <Settings className="w-4 h-4" />
              {/* Status Dot Indicator at top-right of settings icon */}
              <span className="absolute top-1 right-1 flex h-2 w-2">
                {backendStatus === 'connected' ? (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-white dark:ring-[#131B16]"></span>
                ) : backendStatus === 'checking' ? (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse ring-2 ring-white dark:ring-[#131B16]"></span>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-white dark:ring-[#131B16]"></span>
                )}
              </span>
            </button>

            {/* Quick Dark Mode / Light Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-stone-600 dark:text-[#A0B0A7] bg-[#F5F8F6] dark:bg-[#131B16] border border-stone-200/60 dark:border-[#243329] hover:bg-[#E8F0EC] dark:hover:bg-[#1C2821] hover:text-[#183D32] dark:hover:text-[#FBA65B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#183D32]"
              title={accessibility.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={accessibility.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {accessibility.darkMode ? (
                <Sun className="w-4 h-4 text-[#FBA65B]" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Accessibility Dropdown Toggle */}
            <div className="relative">
              <button
                id="btn-a11y-menu"
                onClick={() => setA11yMenuOpen(!a11yMenuOpen)}
                className={`p-2 rounded-xl text-stone-600 dark:text-[#A0B0A7] hover:bg-[#E8F0EC] dark:hover:bg-[#283830] hover:text-[#183D32] dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#183D32] border border-stone-200 dark:border-[#2D3C33] ${
                  a11yMenuOpen ? 'bg-[#E8F0EC] dark:bg-[#2A3E33] text-[#183D32] dark:text-white' : 'bg-stone-50 dark:bg-[#1E2822]'
                }`}
                aria-label="Accessibility & preferences menu"
                aria-expanded={a11yMenuOpen}
              >
                <Eye className="w-4 h-4" />
              </button>

              {a11yMenuOpen && (
                <div 
                  id="a11y-dropdown"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1A231F] text-[#202522] dark:text-[#E2EAE5] shadow-2xl border border-stone-200 dark:border-[#2C3D32] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#2C3D32] pb-2 mb-2">
                    <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sliders className="w-3.5 h-3.5 text-[#2F6B57] dark:text-[#4ADE80]" /> Accessibility & Theme
                    </span>
                    <button
                      onClick={() => setA11yMenuOpen(false)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Dark Mode Toggle */}
                    <label className="flex items-center justify-between p-1.5 hover:bg-stone-50 dark:hover:bg-[#232F29] rounded-xl cursor-pointer">
                      <span className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        {accessibility.darkMode ? <Moon className="w-3.5 h-3.5 text-[#FBA65B]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>Dark Theme</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={accessibility.darkMode}
                        onChange={(e) => onUpdateAccessibility({ darkMode: e.target.checked })}
                        className="rounded text-[#183D32] focus:ring-[#183D32] w-4 h-4 dark:bg-[#283830] dark:border-stone-600"
                      />
                    </label>

                    {/* High Contrast */}
                    <label className="flex items-center justify-between p-1.5 hover:bg-stone-50 dark:hover:bg-[#232F29] rounded-xl cursor-pointer">
                      <span className="font-medium text-stone-800 dark:text-stone-200">High Contrast Mode</span>
                      <input
                        type="checkbox"
                        checked={accessibility.highContrast}
                        onChange={(e) => onUpdateAccessibility({ highContrast: e.target.checked })}
                        className="rounded text-[#183D32] focus:ring-[#183D32] w-4 h-4 dark:bg-[#283830] dark:border-stone-600"
                      />
                    </label>

                    {/* Font Size */}
                    <div className="p-1.5">
                      <span className="font-medium text-stone-800 dark:text-stone-200 block mb-1">Text Size</span>
                      <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-[#141A17] p-1 rounded-xl">
                        {(['normal', 'large', 'xl'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => onUpdateAccessibility({ fontSize: size })}
                            className={`py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${
                              accessibility.fontSize === size
                                ? 'bg-white dark:bg-[#24332B] shadow-xs text-[#183D32] dark:text-[#76CBA6] font-bold'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                            }`}
                          >
                            {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'X-Large'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto Speak */}
                    <label className="flex items-center justify-between p-1.5 hover:bg-stone-50 dark:hover:bg-[#232F29] rounded-xl cursor-pointer">
                      <span className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#2F6B57] dark:text-[#4ADE80]" /> Auto-Speak Sentences
                      </span>
                      <input
                        type="checkbox"
                        checked={accessibility.autoSpeakSuggestions}
                        onChange={(e) => onUpdateAccessibility({ autoSpeakSuggestions: e.target.checked })}
                        className="rounded text-[#183D32] focus:ring-[#183D32] w-4 h-4 dark:bg-[#283830] dark:border-stone-600"
                      />
                    </label>

                    {/* Keyboard Shortcuts Button */}
                    <button
                      onClick={() => {
                        setA11yMenuOpen(false);
                        onOpenShortcutsModal();
                      }}
                      className="w-full text-left p-2 text-[#2F6B57] dark:text-[#76CBA6] font-bold hover:bg-[#E8F0EC]/60 dark:hover:bg-[#23332A] rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>Keyboard Shortcuts</span>
                      <span className="text-[10px] bg-[#E8F0EC] dark:bg-[#283830] text-[#183D32] dark:text-[#76CBA6] px-1.5 py-0.5 rounded-md font-mono">Ctrl+/</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-[#1E2822] border border-stone-200 dark:border-[#2D3C33] hover:bg-[#E8F0EC] dark:hover:bg-[#283830] focus:outline-none focus:ring-2 focus:ring-[#183D32]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-menu"
          className="md:hidden bg-white dark:bg-[#161D19] border-t border-[#E8F0EC] dark:border-[#233128] px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-1"
        >
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-[#183D32] text-white dark:bg-[#2A4D3E]'
                    : 'text-[#6D756F] dark:text-[#9AA8A0] hover:bg-[#E8F0EC] dark:hover:bg-[#202C25] hover:text-[#183D32] dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-stone-100 dark:border-[#233128] flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Theme</span>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-[#202C25] text-stone-800 dark:text-stone-200"
            >
              {accessibility.darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FBA65B]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

