import { motion, AnimatePresence } from "framer-motion";

export default function PracticeHistory({ history, showHistory, setShowHistory }) {
  if (!showHistory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={() => setShowHistory(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">📜</span> Practice History
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-neutral-400 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="overflow-y-auto p-6 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center text-neutral-500 py-12">
                No practice history yet. Start recording!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((attempt, index) => {
                  const prevAttempt = history[index + 1];
                  const scoreDiff = prevAttempt ? attempt.score - prevAttempt.score : 0;

                  return (
                    <div key={attempt.id} className="card-glass p-5 bg-white/5 flex flex-col hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs text-neutral-400 font-mono">
                          {new Date(attempt.date).toLocaleDateString()} • {new Date(attempt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex items-center">
                          <span className={`font-black text-2xl ${attempt.score >= 80 ? 'text-green-400' : attempt.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {attempt.score}
                          </span>
                          {index < history.length - 1 && (
                            <span className={`ml-2 text-sm font-bold ${scoreDiff > 0 ? 'text-green-400' : scoreDiff < 0 ? 'text-red-400' : 'text-neutral-500'}`}>
                              {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-neutral-300 mb-3">
                        <span className={`px-2 py-1 rounded-md bg-black/30 border border-white/10`}>Pacing: {attempt.pacing}</span>
                      </div>
                      <p className="text-sm text-neutral-300 italic border-l-2 border-primary-500 pl-3 py-1">"{attempt.feedback_summary}"</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
