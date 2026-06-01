import { motion } from "framer-motion";

export default function PracticeSession({
  data,
  pitchText,
  setPitchText,
  isRecording,
  analysis,
  loading,
  queueStatus,
  error,
  toggleRecording,
  analyzePitch
}) {
  const wordCount = pitchText ? pitchText.trim().split(/\s+/).filter(Boolean).length : 0;
  // Estimated duration in seconds at a normal ~140 WPM pace
  const estDuration = Math.round(wordCount / (140 / 60));

  const getLengthStatus = () => {
    if (wordCount === 0) return { label: "Empty draft", color: "text-neutral-500" };
    if (estDuration < 20) return { label: "Too short (aim for 30-60s)", color: "text-yellow-400" };
    if (estDuration <= 60) return { label: "Perfect length (30-60s)", color: "text-green-400" };
    return { label: "Too long (keep under 60s for clarity)", color: "text-orange-400" };
  };

  const lengthStatus = getLengthStatus();

  return (
    <div className="space-y-6">
      {/* Original script view card */}
      <div className="card-glass p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
            <span className="mr-2">📋</span> Original Script Reference
          </h3>
          {data?.elevator_pitch && (
            <button
              onClick={() => setPitchText(data.elevator_pitch)}
              className="text-xs py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-violet-300 hover:text-white transition-all font-semibold flex items-center space-x-1.5 border border-white/10 cursor-pointer"
              title="Copy original elevator pitch to your practice workspace"
            >
              <span>✍️</span>
              <span>Use as Template</span>
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-1">Tagline</span>
            <p className="text-white font-medium italic text-sm">"{data?.tagline || "No tagline"}"</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-1">Elevator Pitch</span>
            <p className="text-neutral-300 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5 font-sans select-all">
              {data?.elevator_pitch || "No elevator pitch available."}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Practice Workspace */}
      <div className="card-glass p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
            <span className="mr-2">🥋</span> Interactive Practice Arena
          </h3>
          {pitchText && (
            <button
              onClick={() => setPitchText("")}
              className="text-xs py-1 px-2.5 rounded-md bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Textarea Workspace */}
        <div className="relative mb-4 flex-1">
          <textarea
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            disabled={isRecording}
            placeholder={
              isRecording
                ? "🎙️ Speaking... Dictated words will appear here in real-time."
                : "Type or paste your elevator pitch here, or click the microphone to dictate your spoken practice..."
            }
            className={`w-full min-h-[160px] bg-black/40 border rounded-xl p-4 text-white text-sm placeholder-neutral-500 focus:outline-none transition-all leading-relaxed custom-scrollbar font-sans ${
              isRecording 
                ? "border-red-500/40 ring-1 ring-red-500/20 shadow-inner shadow-red-500/10" 
                : "border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
            }`}
          />
          {isRecording && (
            <div className="absolute right-4 bottom-4 flex items-center space-x-2 bg-red-950/85 border border-red-500/30 px-3 py-1 rounded-full text-[10px] text-red-400 font-bold tracking-wide animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              <span>LIVE RECORDING</span>
            </div>
          )}
        </div>

        {/* Live Metrics Bar */}
        <div className="flex flex-wrap justify-between items-center text-xs text-neutral-400 gap-3 mb-6 bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center space-x-4">
            <div>
              Words: <span className="font-bold text-white">{wordCount}</span>
            </div>
            <div>
              Est. Speaking Time: <span className="font-bold text-white">{estDuration}s</span>
            </div>
          </div>
          {wordCount > 0 && (
            <div className={`font-semibold flex items-center space-x-1 ${lengthStatus.color}`}>
              <span>⏱️</span>
              <span>{lengthStatus.label}</span>
            </div>
          )}
        </div>

        {/* Speech Dictation Trigger */}
        <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-white/5">
          <div className="relative mb-3">
            <motion.button
              onClick={toggleRecording}
              animate={isRecording ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all cursor-pointer ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/40 animate-pulse"
                  : "bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-500/20"
              }`}
              title={isRecording ? "Stop dictation" : "Start speech to text dictation"}
            >
              {isRecording ? "⏹" : "🎤"}
            </motion.button>
            {isRecording && (
              <span className="absolute -inset-2 rounded-full border border-red-500/30 animate-ping"></span>
            )}
          </div>
          <div className="text-center">
            <p className="text-neutral-355 font-bold text-xs sm:text-sm">
              {isRecording ? "Dictation active. Speak clearly." : "Dictate Pitch Spoken"}
            </p>
            <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
              {isRecording 
                ? "Click stop to pause/finish dictation. You can edit the text immediately after." 
                : "Microphone appends spoken words directly into the workspace above."}
            </p>
          </div>

          {/* Wave Animation */}
          {isRecording && (
            <div className="flex items-center space-x-1.5 justify-center h-5 mt-4">
              <span className="w-0.5 bg-red-500 rounded-full h-3 animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-red-500 rounded-full h-5 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-red-500 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-red-500 rounded-full h-5 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-red-500 rounded-full h-3 animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '0.6s' }}></span>
            </div>
          )}
        </div>

        {/* AI Analysis Trigger */}
        {pitchText?.trim() && !isRecording && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={analyzePitch}
            disabled={loading}
            className="btn-primary w-full py-3 text-sm sm:text-base font-bold flex items-center justify-center space-x-2 rounded-xl"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{queueStatus || "Analyzing Performance..."}</span>
              </>
            ) : (
              <>
                <span>{analysis ? "🔄" : "✨"}</span>
                <span>{analysis ? "Re-analyze Performance" : "Analyze My Performance"}</span>
              </>
            )}
          </motion.button>
        )}

        {error && (
          <div className="text-red-400 text-xs sm:text-sm mt-3 bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
