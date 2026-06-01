import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GenerationProgress({ queueStatus }) {
  const [progress, setProgress] = useState(0);
  
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
    if (queueStatus.includes("Pitch") || queueStatus.includes("Waiting")) return 1;
    if (queueStatus.includes("Logo") || queueStatus.includes("Brand")) return 2;
    if (queueStatus.includes("Website") || queueStatus.includes("Landing") || queueStatus.includes("Code")) return 3;
    return 0;
  };

  const activeIndex = getActiveStep();
  
  // Simulate progress within steps
  useEffect(() => {
    const baseProgress = (activeIndex / steps.length) * 100;
    setProgress(baseProgress);
    
    const interval = setInterval(() => {
      setProgress(p => {
        const targetMax = ((activeIndex + 1) / steps.length) * 100;
        // Increment slowly towards the max for this step
        if (p < targetMax - 5) {
          return p + Math.random() * 2;
        }
        return p;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeIndex, steps.length]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10 rounded-full" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
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
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors bg-[var(--bg-elevated)]`}
                >
                  {isCompleted ? (
                    <span className="text-white text-sm">✓</span>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </motion.div>
                <span 
                  className={`mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors
                    ${isActive ? "text-indigo-400" : isCompleted ? "text-white/80" : "text-white/30"}
                  `}
                >
                  {step.label}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-white tracking-wide">
            {queueStatus || "Initializing AI engine..."}
          </p>
        </div>
        <p className="text-xs text-indigo-300 font-medium">
          {activeIndex === 0 && "Estimated time: ~5 seconds"}
          {activeIndex === 1 && "Estimated time: ~10 seconds"}
          {activeIndex === 2 && "Estimated time: ~15 seconds"}
          {activeIndex === 3 && "Almost done! Rendering UI..."}
        </p>
      </div>
    </div>
  );
}
