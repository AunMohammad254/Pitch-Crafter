import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import PitchDetails from "./PitchDetails";

export default function PitchModal({ pitch, onClose, onDelete, onPreview, onSimulate, onPractice, onUpdate }) {
    const d = pitch.generated_data;

    const handleUpdate = async (newGeneratedData) => {
        const updatedPitch = {
            ...pitch,
            generated_data: newGeneratedData,
            title: newGeneratedData.name,
            short_description: newGeneratedData.tagline,
            industry: newGeneratedData.industry
        };

        const { error } = await supabase
            .from("pitches")
            .update({
                generated_data: newGeneratedData,
                title: newGeneratedData.name,
                short_description: newGeneratedData.tagline,
                industry: newGeneratedData.industry
            })
            .eq("id", pitch.id);

        if (error) {
            console.error("Failed to update pitch:", error);
        } else {
            if (onUpdate) onUpdate(updatedPitch);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 z-50 overflow-y-auto mt-15"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-primary)",
                    boxShadow: "var(--shadow-modal)",
                    backdropFilter: "var(--glass-backdrop)",
                }}
                className="rounded-xl w-full max-w-6xl max-h-[80vh] sm:max-h-[92vh] lg:max-h-[95vh] overflow-hidden flex flex-col my-4 sm:my-6 lg:my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div
                    style={{
                        background: "var(--gradient-primary-bold)",
                        color: "var(--text-on-primary)",
                    }}
                    className="p-4 sm:p-6 lg:p-8 bg-clip-padding backdrop-filter backdrop-blur-sm mt-10 rounded-t-xl"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-primary font-bold mb-2 sm:mb-3 line-clamp-2">
                                {d?.name || "Untitled Pitch"}
                            </h2>
                            <p className="text-primary-100 text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-6 italic line-clamp-2">
                                {d?.tagline || "No tagline available"}
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                                    🏢 {pitch.industry || "General"}
                                </span>
                                <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                                    📅 {new Date(pitch.created_at).toLocaleDateString()}
                                </span>
                                {d?.target_audience?.segments && (
                                    <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                                        🎯 {d.target_audience.segments.length} segments
                                    </span>
                                )}
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors text-lg sm:text-xl lg:text-2xl border border-white/30 shrink-0"
                        >
                            ✕
                        </motion.button>
                    </div>
                </div>

                {/* Modal Content */}
                <div
                    style={{ background: "var(--bg-secondary)" }}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
                >
                    <PitchDetails
                        data={d}
                        onUpdate={handleUpdate}
                    />
                </div>

                {/* Modal Footer */}
                <div
                    style={{
                        background: "var(--bg-elevated)",
                        borderTop: "1px solid var(--border-primary)",
                    }}
                    className="p-3 sm:p-4"
                >
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
                        {/* Primary Action Group */}
                        <div className="flex flex-wrap justify-center gap-2 w-full xl:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onSimulate}
                                className="flex-1 sm:flex-none btn-primary px-4 py-3 text-base sm:text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-red-600 to-orange-600 flex items-center justify-center space-x-2 border border-red-500/30 whitespace-nowrap"
                            >
                                <span>🦈</span>
                                <span>Shark Tank</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onPractice}
                                className="flex-1 sm:flex-none btn-primary px-4 py-3 text-base sm:text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center space-x-2 border border-violet-500/30 whitespace-nowrap"
                            >
                                <span>🎤</span>
                                <span>Pitch Dojo</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onPreview}
                                className="flex-1 sm:flex-none btn-primary px-4 py-3 text-base sm:text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center space-x-2 whitespace-nowrap"
                            >
                                <span>🌐</span>
                                <span>Preview Page</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (pitch.landing_code) {
                                        navigator.clipboard.writeText(pitch.landing_code);
                                        const el = document.createElement("div");
                                        el.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50";
                                        el.innerText = "✅ Code copied!";
                                        document.body.appendChild(el);
                                        setTimeout(() => el.remove(), 3000);
                                    }
                                }}
                                className="flex-1 sm:flex-none btn-secondary px-4 py-3 text-base sm:text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 flex items-center justify-center space-x-1 whitespace-nowrap"
                            >
                                <span>📋</span>
                                <span>Copy Code</span>
                            </motion.button>
                        </div>

                        {/* Secondary Action Group */}
                        <div className="flex flex-wrap justify-center gap-2 w-full xl:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onDelete}
                                className="flex-1 sm:flex-none px-4 py-3 text-base sm:text-lg font-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-red-500 to-pink-600 text-white border-0 flex items-center justify-center space-x-1 whitespace-nowrap"
                            >
                                <span>🗑️</span>
                                <span>Delete</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-6 py-3 text-base sm:text-lg font-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-neutral-500 to-neutral-600 text-white border-0"
                            >
                                Close
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
