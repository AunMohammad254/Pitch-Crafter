import { motion, AnimatePresence } from "framer-motion";
import CustomModelSelector from "./ModelSelector";
import GalaxyButton from "../ui/GalaxyButton";

export default function PitchInputForm({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  loading,
  queueStatus,
  handleSubmit,
  result
}) {
  return (
    <motion.div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-2xl)',
      }}
      className={`max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-1 backdrop-blur-xl transition-all duration-500 ${result ? 'mb-8' : 'mb-20'}`}
      animate={{
        scale: loading ? 0.98 : 1,
        opacity: 1
      }}
    >
      <div className="bg-(--bg-primary) rounded-[1.2rem] sm:rounded-[1.4rem] p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <CustomModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />

          {/* Form Label */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">💡</span>
            <label className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Describe Your Startup Vision
            </label>
          </div>

          {/* Textarea */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={5000}
                placeholder="I want to build an AI-powered fitness app that creates personalized workout plans with real-time form correction using computer vision, targeting busy professionals..."
                className="w-full h-32 sm:h-36 bg-(--bg-secondary) text-(--text-primary) border border-(--border-primary) rounded-xl px-4 py-4 sm:px-5 sm:py-4 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-(--text-disabled)"
                disabled={loading}
              />
            </div>
          </div>

          {/* Character Counter Row */}
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>
              {prompt.length} / 5000 Characters
            </span>
            <span style={{ color: 'var(--text-tertiary)' }} className="flex items-center">
              <span className="mr-1">💭</span> Be detailed for better results
            </span>
          </div>

          {/* Quick Suggestion Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { icon: '💳', label: 'FinTech App' },
              { icon: '🤖', label: 'AI Startup' },
              { icon: '☁️', label: 'SaaS Platform' },
              { icon: '🛒', label: 'E-commerce' },
              { icon: '🏥', label: 'HealthTech' },
              { icon: '📚', label: 'EdTech' },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setPrompt(prev => prev ? `${prev} ${tag.icon} ${tag.label}` : `I want to build a ${tag.label.toLowerCase()} that...`)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <GalaxyButton
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`${!loading && prompt.trim() ? 'generate-btn-pulse' : ''}`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>AI is crafting your startup...</span>
                </motion.div>
              ) : queueStatus ? (
                <motion.div
                  key="queue"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center space-x-2 text-yellow-500 font-medium"
                >
                  <span className="animate-pulse">⏳</span>
                  <span>{queueStatus}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <span className="text-xl">✨</span>
                  <span>Generate Complete Startup Package</span>
                  <span className="text-xl">🚀</span>
                </motion.div>
              )}
            </AnimatePresence>
          </GalaxyButton>
        </form>
      </div>
    </motion.div>
  );
}
