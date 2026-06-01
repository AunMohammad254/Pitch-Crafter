import { motion } from "framer-motion";

export default function ModalHeader({ pitch, d, onClose }) {
  return (
    <div
      style={{
        background: "var(--gradient-primary-bold)",
        color: "var(--text-on-primary)",
      }}
      className="p-3.5 sm:p-6 lg:p-8 bg-clip-padding backdrop-filter backdrop-blur-sm rounded-t-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-primary font-bold mb-1 sm:mb-3 line-clamp-2">
            {d?.name || "Untitled Pitch"}
          </h2>
          <p className="text-primary-100 text-xs sm:text-base lg:text-xl font-medium mb-3 sm:mb-6 italic line-clamp-2">
            {d?.tagline || "No tagline available"}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-3">
            <span className="bg-white/20 px-2 py-0.5 sm:px-3 lg:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm backdrop-blur-sm font-medium border border-white/30">
              🏢 {pitch.industry || "General"}
            </span>
            <span className="bg-white/20 px-2 py-0.5 sm:px-3 lg:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm backdrop-blur-sm font-medium border border-white/30">
              📅 {new Date(pitch.created_at).toLocaleDateString()}
            </span>
            {d?.target_audience?.segments && (
              <span className="bg-white/20 px-2 py-0.5 sm:px-3 lg:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                🎯 {d.target_audience.segments.length} segments
              </span>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors text-xs sm:text-xl lg:text-2xl border border-white/30 shrink-0"
        >
          ✕
        </motion.button>
      </div>
    </div>
  );
}
