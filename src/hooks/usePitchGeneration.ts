import { useState } from "react";
import { GeminiAPIManager } from "../utils/geminiApi";
import { generatePitchPrompt, generateWebsitePrompt } from "../utils/prompts";
import { usePitchStore } from "../stores/pitchStore";
import { PitchData, User } from "../types";

export function usePitchGeneration(user: User | null, showNotification: (msg: string, type: "success" | "error" | "warning" | "info") => void) {
  const { addPitch } = usePitchStore();
  const [loading, setLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState<string | null>(null);
  const [result, setResult] = useState<PitchData | null>(null);
  const [pitchId, setPitchId] = useState<string | null>(null);
  const [landingCode, setLandingCode] = useState<string | null>(null);
  const [apiManager] = useState(() => new GeminiAPIManager());

  const generateFallbackTemplate = (pitchData: PitchData) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pitchData.name} - ${pitchData.tagline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, ${pitchData.colors?.primary || '#3b82f6'}, ${pitchData.colors?.secondary || '#8b5cf6'}); color: white; min-height: 100vh; font-family: system-ui, sans-serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 1rem; }
    </style>
</head>
<body class="flex flex-col items-center justify-center p-8 text-center">
    <div class="glass-panel max-w-4xl p-12 shadow-2xl animate-fade-in-up">
        <h1 class="text-6xl font-bold mb-6">${pitchData.name}</h1>
        <p class="text-2xl mb-8 opacity-90">${pitchData.tagline}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
            <div class="glass-panel p-6">
                <h2 class="text-xl font-bold mb-3 flex items-center"><span class="text-2xl mr-2">🎯</span> The Problem</h2>
                <p class="opacity-80">${pitchData.problem}</p>
            </div>
            <div class="glass-panel p-6">
                <h2 class="text-xl font-bold mb-3 flex items-center"><span class="text-2xl mr-2">💡</span> Our Solution</h2>
                <p class="opacity-80">${pitchData.solution}</p>
            </div>
        </div>
        <button class="bg-white text-black px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-lg">
            ${pitchData.landing_copy?.call_to_action || 'Get Started Now'}
        </button>
    </div>
</body>
</html>`;
  };

  const generateLandingPageCode = async (pitchData: PitchData, selectedModel: string, signal: AbortSignal) => {
    try {
      const websitePrompt = generateWebsitePrompt(pitchData);
      const requestBody = { contents: [{ parts: [{ text: websitePrompt }] }] };
      const responseText = await apiManager.makeRequest(requestBody, selectedModel, 0, setQueueStatus, signal);
      return responseText;
    } catch (error: any) {
      if (error.name === 'AbortError') return null;
      console.error('⚠️ Landing page generation failed, using fallback:', error);
      showNotification("⚠️ Using fallback template for landing page", "warning");
      return generateFallbackTemplate(pitchData);
    }
  };

  const generatePitch = async (prompt: string, selectedModel: string) => {
    const controller = new AbortController();
    setLoading(true);
    setResult(null);
    setLandingCode(null);
    setQueueStatus(null);
    setPitchId(null);

    try {
      // Step 1: Get Pitch Data
      const pitchPrompt = generatePitchPrompt(prompt);
      const requestBody = {
        contents: [{ parts: [{ text: pitchPrompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const responseText = await apiManager.makeRequest(requestBody, selectedModel, 0, setQueueStatus, controller.signal);
      const parsed = apiManager.extractAndParseJSON(responseText);
      setResult(parsed as PitchData);

      // Step 2: Generate landing page code
      const generatedCode = await generateLandingPageCode(parsed as PitchData, selectedModel, controller.signal);
      if (generatedCode) setLandingCode(generatedCode);

      // Step 3: Save to Supabase via Store
      const insertedPitch = await addPitch({
        title: parsed.name,
        short_description: parsed.tagline,
        industry: parsed.industry,
        tone: "auto",
        language: "auto",
        generated_data: parsed,
        landing_code: generatedCode || undefined,
      });

      if (insertedPitch) {
        setPitchId(insertedPitch.id);
      }

      showNotification("✅ Pitch + Website Code Generated!", "success");
      return { success: true, data: parsed };
    } catch (err: any) {
      if (err.name === 'AbortError') return { success: false, aborted: true };
      showNotification(`❌ ${err.message || "Something went wrong."}`, "error");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updatePitchData = async (newData: PitchData) => {
    setResult(newData);
    if (pitchId) {
      try {
        const { updatePitchInStore } = usePitchStore.getState();
        await updatePitchInStore({
          id: pitchId,
          user_id: user?.id || "",
          created_at: new Date().toISOString(),
          generated_data: newData,
          title: newData.name,
          short_description: newData.tagline,
          industry: newData.industry,
        });
      } catch (error) {
        console.error('❌ Database update error:', error);
      }
    }
  };

  return {
    loading,
    queueStatus,
    result,
    pitchId,
    landingCode,
    generatePitch,
    updatePitchData,
    setResult,
  };
}
