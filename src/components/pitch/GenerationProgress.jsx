import { motion } from "framer-motion";

export default function GenerationProgress({ queueStatus }) {
  const steps = [
    { id: "analyzing", label: "Analyzing Vision", icon: "🧠" },
    { id: "generating_pitch", label: "Generating Pitch", icon: "📊" },
    { id: "branding", label: "Branding & Assets", icon: "🎨" },
    { id: "website", label: "Building Website", icon: "🌐" },
  ];

  // Map queue status to step index
  const getActiveStep = () => {
    if (!queueStatus) return 0;
    if (queueStatus.includes("Vision") || queueStatus.includes("Analyzing")) return 0;
    if (queueStatus.includes("Pitch")) return 1;
    if (queueStatus.includes("Logo") || queueStatus.includes("Brand")) return 2;
    if (queueStatus.includes("Website") || queueStatus.includes("Landing")) return 3;
    return 0;
  };

  const activeIndex = getActiveStep();

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted || isActive ? "#6366f1" : "rgba(255,255,255,0.05)",
                    borderColor: isCompleted || isActive ? "#818cf8" : "rgba(255,255,255,0.1)",
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors`}
                >
                  {isCompleted ? (
                    <span className="text-white text-sm">✓</span>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </motion.div>
                <span 
                  className={`mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors
                    ${isActive ? "text-indigo-400" : isCompleted ? "text-white/60" : "text-white/20"}
                  `}
                >
                  {step.label}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="active-dot"
                    className="w-1 h-1 bg-indigo-400 rounded-full mt-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-white/50 animate-pulse">
          {queueStatus || "Starting AI sequence..."}
        </p>
      </div>
    </div>
  );
}
