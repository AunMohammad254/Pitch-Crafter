import { useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { GeminiAPIManager } from "../utils/geminiApi";
import { generatePitchPrompt, generateWebsitePrompt } from "../utils/prompts";

export function usePitchGeneration(user, showNotification) {
  const [loading, setLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [pitchId, setPitchId] = useState(null);
  const [landingCode, setLandingCode] = useState(null);
  const [apiManager] = useState(() => new GeminiAPIManager());

  const generateFallbackTemplate = (pitchData) => {
    const colors = pitchData.colors || {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#06B6D4",
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pitchData.name} - ${pitchData.tagline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg { background: linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20); }
        .hero-gradient { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); }
    </style>
</head>
<body class="bg-white text-gray-900">
    <nav class="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[${colors.primary}] to-[${colors.secondary}] rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span class="text-xl font-bold text-gray-900">${pitchData.name}</span>
                </div>
            </div>
        </div>
    </nav>
    <section class="hero-gradient text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-5xl font-bold mb-6">${pitchData.landing_copy?.headline || pitchData.name}</h1>
            <p class="text-xl opacity-90 mb-8 max-w-3xl mx-auto">${pitchData.landing_copy?.subheadline || pitchData.tagline}</p>
        </div>
    </section>
    <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">The Problem We Solve</h2>
            <p class="text-lg text-gray-600 leading-relaxed">${pitchData.problem}</p>
        </div>
    </section>
</body>
</html>`;
  };

  const generateLandingPageCode = async (pitchData, selectedModel, apiKey) => {
    try {
      const websitePrompt = generateWebsitePrompt(pitchData);
      const requestBody = { contents: [{ parts: [{ text: websitePrompt }] }] };
      const responseText = await apiManager.makeRequest(requestBody, apiKey, selectedModel, 0, setQueueStatus);
      return responseText;
    } catch (error) {
      console.error('⚠️ Landing page generation failed, using fallback:', error);
      showNotification("⚠️ Using fallback template for landing page", "warning");
      return generateFallbackTemplate(pitchData);
    }
  };

  const generatePitch = async (prompt, selectedModel) => {
    setLoading(true);
    setResult(null);
    setLandingCode(null);
    setQueueStatus(null);
    setPitchId(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      apiManager.validateApiKey(apiKey);

      // Step 1: Get Pitch Data
      const pitchPrompt = generatePitchPrompt(prompt);
      const requestBody = {
        contents: [{ parts: [{ text: pitchPrompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const responseText = await apiManager.makeRequest(requestBody, apiKey, selectedModel, 0, setQueueStatus);
      const parsed = apiManager.extractAndParseJSON(responseText);
      setResult(parsed);

      // Step 2: Generate landing page code
      const generatedCode = await generateLandingPageCode(parsed, selectedModel, apiKey);
      setLandingCode(generatedCode);

      // Step 3: Save to Supabase
      const { data: insertedData, error } = await supabase.from("pitches").insert({
        user_id: user.id,
        title: parsed.name,
        short_description: parsed.tagline,
        industry: parsed.industry,
        tone: "auto",
        language: "auto",
        generated_data: parsed,
        landing_code: generatedCode,
      }).select();

      if (error) throw new Error(`Failed to save pitch: ${error.message}`);
      if (insertedData && insertedData.length > 0) setPitchId(insertedData[0].id);

      showNotification("✅ Pitch + Website Code Generated!", "success");
      return { success: true, data: parsed };
    } catch (err) {
      showNotification(`❌ ${err.message || "Something went wrong."}`, "error");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updatePitchData = async (newData) => {
    setResult(newData);
    if (pitchId) {
      const { error } = await supabase
        .from("pitches")
        .update({
          generated_data: newData,
          title: newData.name,
          short_description: newData.tagline,
          industry: newData.industry,
        })
        .eq("id", pitchId);
      if (error) console.error('❌ Database update error:', error);
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
