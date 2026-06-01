import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import PitchEditor from "./PitchEditor";
import { exportToPDF, exportToPPTX } from "../../utils/exportUtils";
import { GeminiAPIManager } from "../../utils/geminiApi";
import { CustomImageModelSelector } from "./ModelSelector";

const PitchDetails = ({ data: propData, onUpdate }) => {
  const [displayData, setDisplayData] = useState(propData);
  const [isEditing, setIsEditing] = useState(false);
  const [logoSvg, setLogoSvg] = useState(propData.logo_svg || null);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [generatingConcept, setGeneratingConcept] = useState(null);
  const [imageModel, setImageModel] = useState("gemini-2.5-flash-tts");
  const [copied, setCopied] = useState(false);

  const apiManager = React.useRef(new GeminiAPIManager());
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    setDisplayData(propData);
    if (propData.logo_svg) {
      setLogoSvg(propData.logo_svg);
    } else {
      setLogoSvg(null);
    }
  }, [propData]);

  const handleSave = (newData) => {
    setDisplayData(newData);
    if (onUpdate) onUpdate(newData);
  };

  const extractSvg = (text) => {
    if (!text) return null;
    const match = text.match(/```(?:xml|html|svg)?([\s\S]*?)```/) || text.match(/(<svg[\s\S]*?<\/svg>)/);
    if (match) {
      return match[1].trim();
    }
    return text.trim();
  };

  const handleGenerateLogo = async (concept) => {
    if (!apiKey) return;
    setGeneratingLogo(true);
    setGeneratingConcept(concept);
    try {
      const prompt = `You are a professional brand designer. Generate a clean, modern, minimalist SVG logo based on this concept description: "${concept}".
The startup name is "${data.name}" and the tagline is "${data.tagline}".
Strictly use these brand colors:
- Primary: ${data.colors.primary}
- Secondary: ${data.colors.secondary}
- Accent: ${data.colors.accent}
- Neutral: ${data.colors.neutral}

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
          ...data,
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
    link.download = `${data.name || 'startup'}_logo.svg`;
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

  const data = displayData;

  if (!data) return null;

  return (
    <>
      <div className="flex flex-wrap justify-end gap-3 mb-6">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center border border-gray-600"
        >
          <span className="mr-2">✏️</span> Edit Pitch
        </button>
        <button
          onClick={() => exportToPDF('pitch-content', `${data.name || 'pitch'}.pdf`)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-lg shadow-indigo-500/20"
        >
          <span className="mr-2">📄</span> Export PDF
        </button>
        <button
          onClick={() => exportToPPTX(data)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-lg shadow-orange-500/20"
        >
          <span className="mr-2">📊</span> Export PPT
        </button>
      </div>

      <PitchEditor 
        data={data}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />

      <div id="pitch-content" className="space-y-8 animate-fade-in-up">
      {/* Startup Header */}
      <motion.div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-card)',
          backdropFilter: 'var(--glass-backdrop)',
        }}
        className="p-4 sm:p-6 lg:p-8 rounded-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-0">
            <h2
              style={{ background: 'var(--gradient-primary-bold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              className="text-2xl sm:text-3xl lg:text-4xl font-primary font-bold mb-2 sm:mb-3"
            >
              {data.name}
            </h2>
            <p
              style={{ color: 'var(--text-primary)' }}
              className="text-lg sm:text-xl font-medium mb-3 sm:mb-4"
            >
              {data.tagline}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              style={{
                background: 'var(--gradient-success-subtle)',
                color: 'var(--text-success)',
                border: '1px solid var(--border-success)',
              }}
              className="px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm"
            >
              🚀 Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
            className="p-3 sm:p-4 rounded-lg"
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold mb-1">Industry</h3>
            <p style={{ color: 'var(--text-primary)' }} className="font-medium">{data.industry}</p>
          </div>
          <div
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
            className="p-3 sm:p-4 rounded-lg"
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold mb-1">Target Market</h3>
            <p style={{ color: 'var(--text-primary)' }} className="font-medium">{data.target_audience.description}</p>
          </div>
          <div
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
            className="p-3 sm:p-4 rounded-lg"
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold mb-1">Business Model</h3>
            <p style={{ color: 'var(--text-primary)' }} className="font-medium">B2B SaaS</p>
          </div>
        </div>

        {/* Elevator Pitch */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--accent-primary)',
          }}
          className="p-4 sm:p-6 rounded-r-lg"
        >
          <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-bold mb-2">Elevator Pitch</h3>
          <p style={{ color: 'var(--text-secondary)' }} className="italic leading-relaxed">
            "{data.elevator_pitch}"
          </p>
        </div>
      </motion.div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <motion.div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="p-4 sm:p-6 rounded-xl relative overflow-hidden group hover:shadow-lg transition-all"
          whileHover={{ y: -5 }}
        >
          <div
            style={{ background: 'var(--accent-error)' }}
            className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
          />
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl sm:text-3xl">⚠️</span>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">The Problem</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
            {data.problem}
          </p>
        </motion.div>

        <motion.div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="p-4 sm:p-6 rounded-xl relative overflow-hidden group hover:shadow-lg transition-all"
          whileHover={{ y: -5 }}
        >
          <div
            style={{ background: 'var(--accent-success)' }}
            className="absolute top-0 right-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
          />
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl sm:text-3xl">💡</span>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">The Solution</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
            {data.solution}
          </p>
        </motion.div>
      </div>

      {/* Unique Value Proposition */}
      <motion.div
        style={{
          background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)',
          border: '1px solid var(--border-primary)',
        }}
        className="p-4 sm:p-8 rounded-xl text-center relative overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        <div
          style={{
            background: 'radial-gradient(circle at center, var(--accent-primary-transparent) 0%, transparent 70%)',
          }}
          className="absolute inset-0 opacity-20"
        />
        <div className="relative z-10">
          <h3 style={{ color: 'var(--accent-primary)' }} className="text-sm font-bold uppercase tracking-widest mb-3">Unique Value Proposition</h3>
          <p style={{ color: 'var(--text-primary)' }} className="text-xl sm:text-2xl font-bold leading-tight">
            {data.unique_value_proposition}
          </p>
        </div>
      </motion.div>

      {/* Brand Identity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Logo Concepts */}
        <motion.div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          className="p-4 sm:p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🎨</span> Logo Concepts
            </h3>
            <div className="space-y-3">
              {data.logo_ideas.map((idea, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                  }}
                  className="p-3 rounded-lg flex items-center justify-between gap-3 hover:opacity-95 transition-opacity"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', borderColor: 'var(--border-primary)' }}
                      className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border shrink-0"
                    >
                      {index + 1}
                    </span>
                    <p style={{ color: 'var(--text-primary)' }} className="text-xs leading-relaxed">{idea}</p>
                  </div>
                  <button
                    onClick={() => handleGenerateLogo(idea)}
                    disabled={generatingLogo}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1 shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    {generatingConcept === idea ? "⏳ Drawing..." : "🎨 Draw"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          className="p-4 sm:p-6 rounded-xl"
        >
          <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🎭</span> Brand Colors
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.colors).map(([name, hex]) => (
              <div key={name} className="space-y-2 group cursor-pointer">
                <div
                  className="h-16 w-full rounded-lg shadow-md border border-(--border-secondary) transition-transform transform group-hover:scale-105 relative overflow-hidden"
                  style={{ backgroundColor: hex }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }} className="text-sm capitalize font-medium">{name}</span>
                  <span style={{ color: 'var(--text-tertiary)' }} className="text-xs font-mono bg-neutral-500/10 px-2 py-1 rounded">
                    {hex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brand Logo Card */}
        <motion.div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          className="p-4 sm:p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📐</span> Brand Logo
            </h3>
            
            {/* Logo Preview Area */}
            <div 
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
              className="h-44 rounded-lg flex items-center justify-center relative overflow-hidden mb-4 p-4 shadow-inner"
            >
              {generatingLogo ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="loading-spinner-sm"></div>
                  <span style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium animate-pulse">
                    Generating brand SVG...
                  </span>
                </div>
              ) : logoSvg ? (
                <div 
                  className="w-full h-full flex items-center justify-center logo-preview-container [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:block"
                  dangerouslySetInnerHTML={{ __html: logoSvg }}
                />
              ) : (
                <div className="text-center p-4">
                  <span className="text-3xl mb-2 block filter grayscale">🎨</span>
                  <p style={{ color: 'var(--text-tertiary)' }} className="text-xs leading-relaxed max-w-[200px] mx-auto">
                    Select a concept on the left and click "Draw" to design your brand asset.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <CustomImageModelSelector 
              selectedModel={imageModel} 
              onSelect={setImageModel} 
              className="mb-0!"
            />

            {logoSvg && !generatingLogo && (
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSvg}
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  📥 Download SVG
                </button>
                <button
                  onClick={handleCopySvg}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-gray-600 cursor-pointer"
                >
                  {copied ? "✅ Copied!" : "📋 Copy Code"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Target Audience */}
      <motion.div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
        }}
        className="p-4 sm:p-6 lg:p-8 rounded-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl sm:text-3xl">👥</span>
          <div>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Target Audience</h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Who are we building for?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3">Primary Segment</h4>
            <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed mb-4">
              {data.target_audience.description}
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3">Key Segments</h4>
            <div className="flex flex-wrap gap-2">
              {data.target_audience.segments.map((segment, index) => (
                <span
                  key={index}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-secondary)',
                  }}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {segment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default PitchDetails;
