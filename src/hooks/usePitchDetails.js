import { useState, useEffect, useRef } from "react";
import { GeminiAPIManager } from "../utils/geminiApi";

export function usePitchDetails(propData, onUpdate) {
  const [displayData, setDisplayData] = useState(propData);
  const [isEditing, setIsEditing] = useState(false);
  const [logoSvg, setLogoSvg] = useState(propData.logo_svg || null);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [generatingConcept, setGeneratingConcept] = useState(null);
  const [imageModel, setImageModel] = useState("gemini-2.5-flash-tts");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error

  const apiManager = useRef(new GeminiAPIManager());
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    setDisplayData(propData);
    if (propData.logo_svg) {
      setLogoSvg(propData.logo_svg);
    } else {
      setLogoSvg(null);
    }
  }, [propData]);

  const extractSvg = (text) => {
    if (!text) return null;
    const match = text.match(/```(?:xml|html|svg)?([\s\S]*?)```/) || text.match(/(<svg[\s\S]*?<\/svg>)/);
    if (match) {
      return match[1].trim();
    }
    return text.trim();
  };

  const handleSave = async (newData) => {
    setSaveStatus("saving");
    setDisplayData(newData);
    try {
      if (onUpdate) {
        await onUpdate(newData);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    }
  };

  const handleGenerateLogo = async (concept) => {
    if (!apiKey) return;
    setGeneratingLogo(true);
    setGeneratingConcept(concept);
    try {
      const prompt = `You are a professional brand designer. Generate a clean, modern, minimalist SVG logo based on this concept description: "${concept}".
The startup name is "${displayData.name}" and the tagline is "${displayData.tagline}".
Strictly use these brand colors:
- Primary: ${displayData.colors.primary}
- Secondary: ${displayData.colors.secondary}
- Accent: ${displayData.colors.accent}
- Neutral: ${displayData.colors.neutral}

Output specifications:
1. Output ONLY valid, raw SVG XML code.
2. Wrap the code in an \`\`\`xml or \`\`\`svg markdown block. Do not write any explanations, preamble, or notes.
3. Make the SVG responsive using a viewBox attribute (e.g. viewBox="0 0 200 200"). Do not use hardcoded width/height outside viewBox.
4. Ensure the background of the SVG is transparent (no solid filled background rectangle).
5. Style all text elements cleanly (e.g. using standard sans-serif system fonts).`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const responseText = await apiManager.current.makeRequest(requestBody, apiKey, imageModel);
      const extracted = extractSvg(responseText);
      if (extracted) {
        setLogoSvg(extracted);
        const updatedData = {
          ...displayData,
          logo_svg: extracted
        };
        handleSave(updatedData);
      }
    } catch (err) {
      console.error("Logo generation failed:", err);
    } finally {
      setGeneratingLogo(false);
      setGeneratingConcept(null);
    }
  };

  const handleDownloadSvg = () => {
    if (!logoSvg) return;
    const blob = new Blob([logoSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${displayData.name || 'startup'}_logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    if (!logoSvg) return;
    navigator.clipboard.writeText(logoSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    displayData,
    isEditing,
    setIsEditing,
    logoSvg,
    generatingLogo,
    generatingConcept,
    imageModel,
    setImageModel,
    copied,
    saveStatus,
    handleSave,
    handleGenerateLogo,
    handleDownloadSvg,
    handleCopySvg
  };
}
