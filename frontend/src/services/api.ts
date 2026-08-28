import { PredictionResponse, SuggestionResponse } from '../types';

const STORAGE_KEY_API_URL = 'signbridge_api_base_url';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_KEY_API_URL);
    if (custom && custom.trim() !== '') {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return ''; // Uses Vite proxy in dev (same-origin), configurable via VITE_API_BASE_URL or localStorage
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || url.trim() === '') {
      localStorage.removeItem(STORAGE_KEY_API_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_API_URL, url.trim().replace(/\/+$/, ''));
    }
  }
}

export function resetApiBaseUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  }
}

export async function checkBackendHealth(customUrl?: string): Promise<{ isOnline: boolean; latencyMs?: number; message?: string }> {
  const baseUrl = (customUrl || getApiBaseUrl()).replace(/\/+$/, '');
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Attempt to ping health or root
    let response: Response | null = null;
    try {
      response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
    } catch {
      // If /health returns 404 or fails, try root / or an OPTIONS test
      response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - startTime);

    if (response && (response.ok || response.status === 404 || response.status === 405)) {
      return { isOnline: true, latencyMs: latency };
    }

    return { isOnline: false, message: 'Server unreachable or returned unexpected status' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection failed';
    return { isOnline: false, message };
  }
}

export async function predictImage(base64Image: string): Promise<PredictionResponse> {
  const baseUrl = getApiBaseUrl();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 400 || response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        return {
          label: '?',
          confidence: 0,
          top3: [],
          error: errorData.error || 'No hand detected or invalid frame',
        };
      }
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();

    // Standardize backend response format
    const label = data.label ?? '?';
    const confidence = typeof data.confidence === 'number' ? data.confidence : 0;
    const top3 = Array.isArray(data.top3)
      ? data.top3.map((item: { label?: string; conf?: number; confidence?: number }) => ({
          label: String(item.label || '?'),
          conf: typeof item.conf === 'number' ? item.conf : (typeof item.confidence === 'number' ? item.confidence : 0),
        }))
      : [];

    return {
      label,
      confidence,
      top3,
      landmarks: data.landmarks,
      error: data.error,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return {
      label: '?',
      confidence: 0,
      top3: [],
      error: `Connection error: ${message}. Ensure the Flask server is running at ${baseUrl}.`,
    };
  }
}

export async function suggestSentence(text: string): Promise<SuggestionResponse> {
  const baseUrl = getApiBaseUrl();
  
  if (!text || text.trim().length === 0) {
    return { suggested: '', error: 'Sequence is empty. Please recognise some signs first.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${baseUrl}/api/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      suggested: data.suggested || data.text || 'Unable to generate interpretation',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return {
      suggested: '',
      error: `Failed to contact AI suggestion endpoint at ${baseUrl}/api/suggest: ${message}`,
    };
  }
}
