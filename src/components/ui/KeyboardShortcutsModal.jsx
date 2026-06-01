import { motion, AnimatePresence } from 'framer-motion';

const ShortcutItem = ({ keys, description }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <span className="text-white/60 text-sm font-medium">{description}</span>
    <div className="flex items-center space-x-1">
      {keys.map((key, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-white/10 border border-white/20 rounded-md text-xs font-mono text-white min-w-[24px] text-center"
        >
          {key}
        </span>
      ))}
    </div>
  </div>
);

export const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⌨️</span>
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-1">
                <ShortcutItem keys={['?']} description="Show / Hide this help menu" />
                <ShortcutItem keys={['Esc']} description="Close modals or previews" />
                <ShortcutItem keys={['Ctrl', 'G']} description="Go to Generation page" />
                <ShortcutItem keys={['Ctrl', 'H']} description="Go to History page" />
                <ShortcutItem keys={['/']} description="Focus search bar (where available)" />
              </div>
              
              <div className="mt-8 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-xs text-primary-300 font-medium leading-relaxed">
                  <span className="font-bold">Pro Tip:</span> Using keyboard shortcuts can significantly speed up your workflow when refining multiple startup pitches.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
