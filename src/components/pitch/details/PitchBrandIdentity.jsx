import { motion } from "framer-motion";
import { CustomImageModelSelector } from "../ModelSelector";

export const PitchBrandIdentity = ({
  data,
  logoSvg,
  generatingLogo,
  generatingConcept,
  onGenerateLogo,
  imageModel,
  onModelSelect,
  onDownload,
  onCopy,
  copied
}) => {
  return (
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
            {(data.logo_ideas || []).map((idea, index) => (
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
                  onClick={() => onGenerateLogo(idea)}
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
          {Object.entries(data.colors || {}).map(([name, hex]) => (
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
            onSelect={onModelSelect} 
            className="mb-0!"
          />

          {logoSvg && !generatingLogo && (
            <div className="flex gap-2">
              <button
                onClick={onDownload}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                📥 Download SVG
              </button>
              <button
                onClick={onCopy}
                className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-gray-600 cursor-pointer"
              >
                {copied ? "✅ Copied!" : "📋 Copy Code"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
