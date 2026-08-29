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
  return ''; // Uses same-origin / Vite dev proxy (proxies /health & /predict directly to Flask on port 5000)
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
  if (!text || text.trim().length === 0) {
    return { suggested: '', error: 'Sequence is empty. Please recognise some signs first.' };
  }

  const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || (window as any).GEMINI_API_KEY || '';
  const prompt = [
    "You are a smart Google Keyboard (Gboard) style autocorrect and grammar assistant for Sign Language.",
    `The user has signed the following raw letters or words: '${text.trim()}'.`,
    "",
    "Your Task:",
    "1. If the input contains misspelled words or jumbled letters (e.g. 'HELLZ' -> 'Hello', 'THNK' -> 'Thank you'), autocorrect the spelling.",
    "2. If the input is a sequence of sign words (e.g. 'I GO MARKET YESTERDAY' -> 'I went to the market yesterday.'), convert it to a natural English sentence.",
    "3. Output ONLY the final corrected word or sentence. No quotes, no explanations."
  ].join('\n');

  // Try direct Gemini REST API from browser (avoids backend network issues)
  const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.7-flash'];
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const out = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["']|["']$/g, '');
        if (out) return { suggested: out };
      }
    } catch {
      continue;
    }
  }

  // Fallback: try backend /api/suggest
  try {
    const baseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(`${baseUrl}/api/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return { suggested: data.suggested || '' };
    }
  } catch { /* ignore */ }

  return { suggested: '', error: 'AI suggestion timed out. Please try again.' };
}
