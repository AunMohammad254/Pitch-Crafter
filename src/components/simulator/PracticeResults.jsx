import { motion } from "framer-motion";

export default function PracticeResults({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col justify-between h-full card-glass p-5 sm:p-6 lg:p-8 bg-white/5 border border-neutral-850">
        <div>
          <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-neutral-800/80">
            <span className="text-2xl">🥋</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-primary">Dojo Training Guide</h3>
              <p className="text-xs text-neutral-400">Master your startup pitch delivery</p>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-5">
            {/* Tip 1 */}
            <div className="flex items-start space-x-3">
              <span className="text-indigo-400 text-base sm:text-lg mt-0.5">⏱️</span>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Keep the Pace (130-150 WPM)</h4>
                <p className="text-[11px] sm:text-xs text-neutral-300 mt-1 leading-relaxed">Speaking too fast makes details hard to catch. Keep it calm, steady, and use brief pauses between sections.</p>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="flex items-start space-x-3">
              <span className="text-violet-400 text-base sm:text-lg mt-0.5">📢</span>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Project Your Voice</h4>
                <p className="text-[11px] sm:text-xs text-neutral-300 mt-1 leading-relaxed">Ensure you speak clearly into your mic in a quiet environment. The AI will evaluate your clarity and structure.</p>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="flex items-start space-x-3">
              <span className="text-fuchsia-400 text-base sm:text-lg mt-0.5">🔑</span>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Cover the Essentials</h4>
                <p className="text-[11px] sm:text-xs text-neutral-300 mt-1 leading-relaxed">Make sure to address the core problem, your unique value proposition, and how your technology delivers the solution.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-flight Checklist */}
        <div className="mt-6 bg-neutral-950/40 border border-neutral-850 p-4 rounded-xl">
          <h4 className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">Pre-pitch Checklist</h4>
          <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-neutral-300">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Quiet Room</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Microphone Active</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Read Script on Left</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Stay under 60s</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      {/* Score Card */}
      <div className="card-glass p-6 sm:p-8 bg-gradient-to-br from-violet-950/40 to-indigo-950/40 text-center border-violet-500/20 rounded-2xl shadow-xl">
        <span className="block text-neutral-300 text-xs font-bold uppercase tracking-wider mb-1.5">Overall Dojo Score</span>
        <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2 font-primary">{analysis.score}</div>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg sm:text-xl ${i < Math.round(analysis.score / 20) ? "text-yellow-400" : "text-neutral-700"}`}>★</span>
          ))}
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="card-glass p-5 sm:p-6 bg-white/5">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center">
          <span className="bg-primary-500/20 p-2 rounded-lg mr-3 text-lg sm:text-xl">📊</span>
          Detailed Feedback
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-neutral-400 text-xs sm:text-sm">Pacing</span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${analysis.pacing === 'Good' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
              {analysis.pacing}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 text-xs sm:text-sm block mb-1">Clarity</span>
            <p className="text-white text-xs sm:text-sm leading-relaxed">{analysis.clarity}</p>
          </div>

          <div>
            <span className="text-neutral-400 text-xs sm:text-sm block mb-1">Positive Highlights</span>
            <p className="text-green-300 text-xs sm:text-sm italic border-l-2 border-green-500 pl-3 leading-relaxed">"{analysis.positive_feedback}"</p>
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div className="card-glass p-5 sm:p-6 bg-white/5">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center">
          <span className="bg-orange-500/20 p-2 rounded-lg mr-3 text-lg sm:text-xl">🚀</span>
          Areas for Improvement
        </h3>
        <ul className="space-y-2.5">
          {(analysis.improvements || []).map((item, i) => (
            <li key={i} className="flex items-start text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <span className="text-orange-500 mr-2 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Points */}
      {analysis.missing_points && analysis.missing_points.length > 0 && (
        <div className="card-glass p-5 sm:p-6 bg-white/5">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center">
            <span className="bg-red-500/20 p-2 rounded-lg mr-3 text-lg sm:text-xl">⚠️</span>
            Missing Key Points
          </h3>
          <ul className="space-y-2.5">
            {(analysis.missing_points || []).map((item, i) => (
              <li key={i} className="flex items-start text-xs sm:text-sm text-neutral-300 leading-relaxed">
                <span className="text-red-500 mr-2 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
