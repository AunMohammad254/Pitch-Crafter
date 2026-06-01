import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { exportToPDF, exportToPPTX, exportToMarkdown, exportToWord } from "../../../utils/exportUtils";

export const PitchActionButtons = ({ onEdit, data, saveStatus }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="flex flex-row items-center gap-2.5 relative w-full sm:w-auto justify-end">
      {/* Auto-save Status */}
      <div className="absolute -top-6 right-0 sm:relative sm:top-0 sm:mr-auto flex items-center">
        {saveStatus === "saving" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center text-xs font-medium text-white/50"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2" />
            Saving...
          </motion.div>
        )}
        {saveStatus === "saved" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center text-xs font-medium text-emerald-500"
          >
            <span className="mr-1 text-xs">✅</span>
            Saved
          </motion.div>
        )}
      </div>

      <button
        onClick={onEdit}
        aria-label="Edit pitch details"
        className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center border border-neutral-700 cursor-pointer"
      >
        <span className="mr-2" aria-hidden="true">✏️</span> Edit Pitch
      </button>

      {/* Export Dropdown */}
      <div className="relative flex-1 sm:flex-none flex">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          aria-label="Export options"
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <span className="mr-2" aria-hidden="true">📤</span> Export
        </button>

        <AnimatePresence>
          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="py-1">
                <button
                  onClick={() => { exportToPDF('pitch-content', `${data.name || 'pitch'}.pdf`); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">📄</span> PDF Document
                </button>
                <button
                  onClick={() => { exportToPPTX(data); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">📊</span> PowerPoint
                </button>
                <button
                  onClick={() => { exportToWord(data); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">📝</span> Word Doc
                </button>
                <button
                  onClick={() => { exportToMarkdown(data); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">Ⓜ️</span> Markdown
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const PitchHeader = ({ data }) => {
  return (
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
  );
};
