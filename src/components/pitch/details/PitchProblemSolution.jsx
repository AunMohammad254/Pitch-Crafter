import { motion } from "framer-motion";

export const PitchProblemSolution = ({ data }) => {
  return (
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
  );
};

export const PitchUniqueValue = ({ data }) => {
  return (
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
  );
};
