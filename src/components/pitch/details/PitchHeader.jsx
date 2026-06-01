import { motion } from "framer-motion";
import { exportToPDF, exportToPPTX } from "../../../utils/exportUtils";

export const PitchActionButtons = ({ onEdit, data, saveStatus }) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      {/* Auto-save Status */}
      <div className="mr-auto flex items-center">
        {saveStatus === "saving" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center text-xs font-medium text-white/50"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2" />
            Saving changes...
          </motion.div>
        )}
        {saveStatus === "saved" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center text-xs font-medium text-emerald-500"
          >
            <span className="mr-2 text-sm">✅</span>
            All changes saved
          </motion.div>
        )}
      </div>

      <button
        onClick={onEdit}
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
