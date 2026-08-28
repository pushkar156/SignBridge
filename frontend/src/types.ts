export interface TopPrediction {
  label: string;
  conf: number;
}

export interface PredictionResponse {
  label: string;
  confidence: number;
  top3: TopPrediction[];
  landmarks?: {
    left: {x: number, y: number, z: number}[];
    right: {x: number, y: number, z: number}[];
  };
  error?: string;
}

export interface SuggestionResponse {
  suggested: string;
  error?: string;
}

export type BackendConnectionStatus = 'checking' | 'connected' | 'offline';

export type CameraStatus = 'inactive' | 'requesting' | 'active' | 'processing' | 'error' | 'denied';

export type AppView = 'dashboard' | 'live' | 'learn' | 'practice' | 'about';

export interface ISLClassInfo {
  id: string;
  label: string;
  type: 'digit' | 'letter';
  name: string;
  description: string;
  handShapeTips: string;
  commonMistakes?: string;
  category: 'Alphabet' | 'Numbers';
}

export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  autoSpeakSuggestions: boolean;
  speechRate: number;
  highlightDetectionZone: boolean;
}
