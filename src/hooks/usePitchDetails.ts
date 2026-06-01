import { useState, useEffect, useRef, useCallback } from "react";
import { GeminiAPIManager } from "../utils/geminiApi";
import { handleError } from "../utils/errorHandler";
import { usePitchStore } from "../stores/pitchStore";
import { PitchData, PitchVersion } from "../types";

export function usePitchDetails(propData: PitchData | null, onUpdate: (data: PitchData) => void, pitchId: string) {
  const [displayData, setDisplayData] = useState<PitchData | null>(propData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PitchData | null>(null);
  const [logoSvg, setLogoSvg] = useState<string | null>(null);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [generatingConcept, setGeneratingConcept] = useState<string | null>(null);
  const [imageModel, setImageModel] = useState("gemini-svg");
  
  // Version history state
  const [versions, setVersions] = useState<PitchVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const fetchVersions = usePitchStore(state => state.fetchVersions);
  const saveVersion = usePitchStore(state => state.saveVersion);

  const apiManager = useRef(new GeminiAPIManager());

  const handleFetchVersions = useCallback(async () => {
    if (!pitchId) return;
    setIsLoadingVersions(true);
    try {
      const history = await fetchVersions(pitchId);
      setVersions(history);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    } finally {
      setIsLoadingVersions(false);
    }
  }, [pitchId, fetchVersions]);

  useEffect(() => {
    setDisplayData(propData);
    if (propData && 'logo_svg' in propData) {
      setLogoSvg((propData as any).logo_svg || null);
    } else {
      setLogoSvg(null);
    }
    
    if (pitchId) {
      handleFetchVersions();
    }
  }, [propData, pitchId, handleFetchVersions]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData(null);
    } else {
      setEditedData(displayData);
    }
    setIsEditing(!isEditing);
  };

  const handleCreateVersion = async () => {
    if (!pitchId || !displayData) return;
    try {
      await saveVersion(pitchId, displayData, ""); // Assuming landing code isn't needed here
      handleFetchVersions();
    } catch (err) {
      handleError(err, "Create Version");
    }
  };

  const handleRestoreVersion = (version: PitchVersion) => {
    const data = version.generated_data;
    setDisplayData(data);
    onUpdate(data);
    setShowVersionHistory(false);
  };

  const extractSvg = (text: string): string | null => {
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
    return svgMatch ? svgMatch[0] : null;
  };

  const handleSave = async (newData: PitchData) => {
    setDisplayData(newData);
    setIsEditing(false);
    
    // Save as a new version
    if (pitchId) {
      try {
        await saveVersion(pitchId, newData, "");
        handleFetchVersions();
      } catch (err) {
        console.error("Failed to save version:", err);
      }
    }
    
    onUpdate(newData);
  };

  const handleGenerateLogo = async (concept: string) => {
    if (!displayData) return;
    const controller = new AbortController();
    setGeneratingLogo(true);
    setGeneratingConcept(concept);
    try {
      const prompt = `You are a professional brand designer. Generate a clean, modern, minimalist SVG logo based on this concept description: "${concept}".
The startup name is "${displayData.name || 'Startup'}" and the tagline is "${displayData.tagline || ''}".
Strictly use these brand colors:
- Primary: ${displayData.colors?.primary || '#3B82F6'}
- Secondary: ${displayData.colors?.secondary || '#8B5CF6'}
- Accent: ${displayData.colors?.accent || '#06B6D4'}
- Neutral: ${displayData.colors?.neutral || '#6B7280'}

Output specifications:
1. Output ONLY valid, raw SVG XML code.
2. Wrap the code in an \`\`\`xml or \`\`\`svg markdown block. Do not write any explanations, preamble, or notes.
3. Make the SVG responsive using a viewBox attribute (e.g. viewBox="0 0 200 200"). Do not use hardcoded width/height outside viewBox.
4. Ensure the background of the SVG is transparent (no solid filled background rectangle).
5. Style all text elements cleanly (e.g. using standard sans-serif system fonts).`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const responseText = await apiManager.current.makeRequest(requestBody, imageModel, 0, null, controller.signal);
      const extracted = extractSvg(responseText);
      if (extracted) {
        setLogoSvg(extracted);
        const updatedData = {
          ...displayData,
          logo_svg: extracted
        };
        handleSave(updatedData);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      handleError(err, "Generate Logo SVG");
    } finally {
      setGeneratingLogo(false);
      setGeneratingConcept(null);
    }
  };

  const handleDownloadSvg = () => {
    if (!logoSvg || !displayData) return;
    const blob = new Blob([logoSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(displayData.name || 'startup').toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = async () => {
    if (!logoSvg) return;
    try {
      await navigator.clipboard.writeText(logoSvg);
      return true;
    } catch (err) {
      console.error("Failed to copy SVG:", err);
      return false;
    }
  };

  return {
    displayData,
    isEditing,
    editedData,
    setEditedData,
    handleEditToggle,
    handleSave,
    // Logo generation state
    logoSvg,
    generatingLogo,
    generatingConcept,
    imageModel,
    setImageModel,
    handleGenerateLogo,
    handleDownloadSvg,
    handleCopySvg,
    // Version history
    versions,
    isLoadingVersions,
    showVersionHistory,
    setShowVersionHistory,
    handleCreateVersion,
    handleRestoreVersion
  };
}
