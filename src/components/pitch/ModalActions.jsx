import { motion } from "framer-motion";

export default function ModalActions({ pitch, onClose, onDelete, onPreview, navigateToPitch }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--border-primary)",
      }}
      className="p-3 sm:p-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-row lg:justify-between lg:items-center gap-2 sm:gap-3 w-full">
        {/* Interactive Playgrounds / Simulators */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateToPitch(pitch, "investor-chat")}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-linear-to-r from-rose-500 to-orange-500 text-white border border-rose-500/20 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">🦈</span>
          <span>Shark Tank</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateToPitch(pitch, "pitch-practice")}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white border border-violet-500/20 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">🎤</span>
          <span>Pitch Dojo</span>
        </motion.button>

        {/* Page Tools & Utilities */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPreview}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-100 hover:text-white border border-neutral-700 hover:border-emerald-500/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">🌐</span>
          <span>Preview Page</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (pitch.landing_code) {
              navigator.clipboard.writeText(pitch.landing_code);
              const el = document.createElement("div");
              el.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-[9999] font-medium text-xs sm:text-sm";
              el.innerText = "✅ Code copied!";
              document.body.appendChild(el);
              setTimeout(() => el.remove(), 3000);
            }
          }}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-100 hover:text-white border border-neutral-700 hover:border-blue-500/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">📋</span>
          <span>Copy Code</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateToPitch(pitch, "generate")}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-100 hover:text-white border border-neutral-700 hover:border-indigo-500/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">🔄</span>
          <span>Restore Draft</span>
        </motion.button>

        {/* Danger Zone */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDelete}
          className="col-span-1 lg:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-800/80 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-500/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="text-sm sm:text-lg">🗑️</span>
          <span>Delete</span>
        </motion.button>

        {/* Modal Dismiss */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="col-span-2 sm:col-span-3 md:col-span-2 lg:col-span-1 lg:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-primary font-semibold sm:font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
        >
          Close
        </motion.button>
      </div>
    </div>
  );
}
