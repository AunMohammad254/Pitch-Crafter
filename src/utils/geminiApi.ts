import { checkNetworkStatus, logNetworkDiagnostics } from "./networkUtils";
import { handleError } from "./errorHandler";
import { supabase } from "../lib/supabaseClient";

export const MODELS: Record<string, { id: string; name: string }> = {
  "auto": { id: "auto", name: "✨ Auto (Smart Select)" },
  "gemini-2.5-pro": { id: "gemini-2.5-pro", name: "🧠 Gemini 2.5 Pro" },
  "gemini-2.5-flash": { id: "gemini-2.5-flash", name: "🤖 Gemini 2.5 Flash" }
};

export const IMAGE_MODELS: Record<string, { id: string; name: string }> = {
  "nano-banana-pro": { id: "nano-banana-pro", name: "🍌 Nano Banana Pro (Gemini 3 Pro Image)" },
  "nano-banana-2": { id: "nano-banana-2", name: "🍌 Nano Banana 2 (Gemini 3.1 Flash Image)" },
  "gemini-3.1-flash-tts": { id: "gemini-3.1-flash-tts", name: "🔊 Gemini 3.1 Flash TTS" },
  "gemini-2.5-flash-tts": { id: "gemini-2.5-flash-tts", name: "🔊 Gemini 2.5 Flash TTS" }
};

export class GeminiAPIManager {
  queue: any[];
  isProcessing: boolean;
  maxRetries: number;
  rateLimits: Record<string, { rpm: number; window: number }>;
  baseDelay: number = 1000;

  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 5;
    this.rateLimits = {
      "nano-banana-pro": { rpm: 4, window: 60000 },
      "nano-banana-2": { rpm: 15, window: 60000 },
      "gemini-3.1-flash-tts": { rpm: 2, window: 60000 },
      "gemini-2.5-flash-tts": { rpm: 2, window: 60000 },
      "gemini-3.5-flash": { rpm: 4, window: 60000 },
      "gemini-3.1-flash-lite": { rpm: 14, window: 60000 },
      "gemini-3-flash": { rpm: 4, window: 60000 },
      "gemini-2.5-pro": { rpm: 4, window: 60000 },
      "gemini-2.5-flash": { rpm: 4, window: 60000 },
      "default": { rpm: 4, window: 60000 }
    };
  }

  // Get locally stored usage timestamp to enforce rate limit interval
  canMakeLocalRequest(modelId: string): boolean {
    if (modelId === 'auto') return true;

    const limit = this.rateLimits[modelId] || this.rateLimits.default;
    const interval = Math.ceil(limit.window / limit.rpm);

    const lastUsageKey = `pitchcraft_last_usage_${modelId}`;
    const lastUsage = localStorage.getItem(lastUsageKey);
    const now = Date.now();

    if (lastUsage && (now - parseInt(lastUsage)) < interval) {
      const remaining = Math.ceil((interval - (now - parseInt(lastUsage))) / 1000);
      const modelName = MODELS[modelId]?.name || modelId;
      throw new Error(`Wait ${remaining}s before reusing ${modelName}. Rate limit: ${limit.rpm} RPM.`);
    }
    return true;
  }

  recordUsage(modelId: string) {
    if (modelId !== 'auto') {
      localStorage.setItem(`pitchcraft_last_usage_${modelId}`, Date.now().toString());
    }
  }

  // Main Entry Point for Request
  async makeRequest(
    requestBody: any, 
    modelId: string = 'auto', 
    retryCount: number = 0, 
    onQueueUpdate: ((status: string | null) => void) | null = null, 
    signal: AbortSignal | null = null
  ): Promise<string> {
    this.canMakeLocalRequest(modelId);

    if (!checkNetworkStatus()) {
      logNetworkDiagnostics();
      throw new Error("No internet connection.");
    }

    // Resolve Model ID
    let targetModel = modelId;
    if (modelId === 'auto') {
      targetModel = 'gemini-2.5-flash';
    }

    // Map custom/experimental models to standard available endpoints
    const modelMapping: Record<string, string> = {
      "nano-banana-pro": "gemini-2.5-pro",
      "nano-banana-2": "gemini-2.5-flash",
      "gemini-3.1-flash-tts": "gemini-2.5-flash",
      "gemini-2.5-flash-tts": "gemini-2.5-flash",
      "gemini-3.5-flash": "gemini-2.5-flash",
      "gemini-3.1-flash-lite": "gemini-2.5-flash",
      "gemini-3-flash": "gemini-2.5-flash",
      "gemini-2.5-pro": "gemini-2.5-pro",
      "gemini-2.5-flash": "gemini-2.5-flash",
      "imagen-3": "gemini-2.5-flash",
      "gemini-svg": "gemini-2.5-pro"
    };

    if (modelMapping[targetModel]) {
      targetModel = modelMapping[targetModel];
    }

    return this._executeRequestWithRetry(requestBody, targetModel, retryCount, onQueueUpdate, signal);
  }

  async _executeRequestWithRetry(
    requestBody: any, 
    modelId: string, 
    retryCount: number, 
    onQueueUpdate: ((status: string | null) => void) | null, 
    signal: AbortSignal | null
  ): Promise<string> {
    try {
      console.log(`🚀 Sending request to ${modelId} via Edge Function (Attempt ${retryCount + 1})`);

      const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: { requestBody, modelId },
        headers: {}, 
        // @ts-ignore
        signal: signal
      });

      if (error) {
        if (error.name === 'AbortError') {
          console.log('🛑 Request cancelled by user');
          throw error;
        }
        throw error;
      }

      // Handle application-level errors from the Edge Function/Gemini API
      if (data && data.error) {
        if (data.error.code === 429 || data.status === 429) {
          console.warn(`⏳ Rate limit hit for ${modelId}. Entering waiting list...`);

          if (retryCount >= this.maxRetries) {
            throw new Error("All slots are currently full. Please try a different model or wait a few minutes.");
          }

          const waitTime = Math.min(2000 * Math.pow(2, retryCount), 15000);

          if (onQueueUpdate) {
            onQueueUpdate(`High traffic. Waiting for open slot... (Queue #${this.maxRetries - retryCount})`);
          }

          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this._executeRequestWithRetry(requestBody, modelId, retryCount + 1, onQueueUpdate, signal);
        }
        throw new Error(data.error.message || "Gemini API Error via Proxy");
      }

      this.recordUsage(modelId);
      return this.validateAndParseResponse(data);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }

      const localKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (localKey) {
        console.warn(`⚠️ Supabase Edge Function failed (${error.message || error}). Falling back to direct client-side API call...`);
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${localKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: signal as any
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP error ${response.status}`);
          }

          const data = await response.json();
          this.recordUsage(modelId);
          return this.validateAndParseResponse(data);
        } catch (fallbackError: any) {
          console.error("❌ Direct client-side fallback failed:", fallbackError);
          handleError(fallbackError, `Gemini API Proxy Fallback (${modelId})`);
          throw fallbackError;
        }
      }

      handleError(error, `Gemini API Proxy (${modelId})`);
      throw error;
    }
  }


  // Validate and parse API response
  validateAndParseResponse(data: any): string {
    // Check for API error in response
    if (data.error) {
      console.error('🚨 API returned error:', data.error);
      throw new Error(`Gemini API Error: ${data.error.message || 'Unknown error'}`);
    }

    // Validate response structure
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('🚨 Invalid response structure:', data);
      throw new Error("Invalid response from Gemini API. No candidates found.");
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
      console.error('🚨 Invalid candidate structure:', candidate);
      throw new Error("Invalid response structure from Gemini API.");
    }

    const text = candidate.content.parts[0]?.text;
    if (!text || typeof text !== 'string') {
      console.error('🚨 No text content in response:', candidate);
      throw new Error("No text content received from Gemini API.");
    }

    console.log('📝 Extracted text content:', text.substring(0, 200) + '...');
    return text;
  }

  // Calculate exponential backoff delay
  calculateBackoffDelay(retryCount: number): number {
    return Math.min(this.baseDelay * Math.pow(2, retryCount) + Math.random() * 1000, 30000);
  }

  // Sleep utility
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // JSON parsing - simpler version since we expect application/json response
  extractAndParseJSON(text: string): any {
    console.log('🔍 Attempting to parse JSON from response...');
    
    // Clean up if the model still returns markdown code blocks despite config
    let jsonString = text;
    if (jsonString.includes('```json')) {
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');
    } else if (jsonString.includes('```')) {
        jsonString = jsonString.replace(/```/g, '');
    }
    jsonString = jsonString.trim();

    try {
      const parsed = JSON.parse(jsonString);
      console.log('✅ Successfully parsed JSON');
      return this.validateParsedData(parsed);
    } catch (error: any) {
      console.error('❌ JSON parsing failed:', error);
      throw new Error(`Failed to parse AI response as JSON: ${error.message}.`);
    }
  }

  // Validate parsed data structure
  validateParsedData(data: any): any {
    console.log('🔍 Validating parsed data structure...');

    // If this looks like pitch feedback (has score, pacing, clarity, positive_feedback, or improvements)
    if (data && (data.score !== undefined || data.pacing !== undefined || data.clarity !== undefined || data.positive_feedback !== undefined)) {
      console.log('✅ Pitch feedback data detected, bypassing startup pitch validation');
      return {
        score: typeof data.score === 'number' ? data.score : parseInt(data.score) || 70,
        pacing: data.pacing || 'Good',
        clarity: data.clarity || 'Clear',
        positive_feedback: data.positive_feedback || 'Good delivery.',
        improvements: Array.isArray(data.improvements) ? data.improvements : [],
        missing_points: Array.isArray(data.missing_points) ? data.missing_points : []
      };
    }

    // Ensure required fields exist with fallbacks
    const validated = {
      name: data.name || "Untitled Startup",
      tagline: data.tagline || "Transforming ideas into reality",
      elevator_pitch: data.elevator_pitch || data.description || "An innovative startup solution.",
      problem: data.problem || "A significant market problem that needs solving.",
      solution: data.solution || "An innovative solution to address the problem.",
      target_audience: {
        description: data.target_audience?.description || "General consumers and businesses",
        segments: Array.isArray(data.target_audience?.segments)
          ? data.target_audience.segments
          : ["Early adopters", "Tech-savvy users", "Business professionals"]
      },
      unique_value_proposition: data.unique_value_proposition || data.uvp || "Unique value in the market",
      landing_copy: {
        headline: data.landing_copy?.headline || data.name || "Welcome to the Future",
        subheadline: data.landing_copy?.subheadline || data.tagline || "Innovation at your fingertips",
        call_to_action: data.landing_copy?.call_to_action || "Get Started Today"
      },
      industry: data.industry || "Technology",
      colors: {
        primary: data.colors?.primary || "#3B82F6",
        secondary: data.colors?.secondary || "#8B5CF6",
        accent: data.colors?.accent || "#06B6D4",
        neutral: data.colors?.neutral || "#6B7280"
      },
      logo_ideas: Array.isArray(data.logo_ideas)
        ? data.logo_ideas
        : ["Modern minimalist design", "Tech-inspired icon", "Professional wordmark"]
    };

    console.log('✅ Data validation complete');
    return validated;
  }
}
