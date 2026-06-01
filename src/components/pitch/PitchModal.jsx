import { motion } from "framer-motion";
import { usePitchStore } from "../../stores/pitchStore";
import { useUIStore } from "../../stores/uiStore";
import { useNotification } from "../../hooks/useNotification";
import PitchDetails from "./PitchDetails";
import ModalHeader from "./ModalHeader";
import ModalActions from "./ModalActions";

export default function PitchModal({ pitch, onClose, onDelete, onPreview }) {
    const { updatePitchInStore } = usePitchStore();
    const { navigateToPitch } = useUIStore();
    const { showNotification } = useNotification();
    
    const d = pitch.generated_data;

    const handleUpdate = async (newGeneratedData) => {
        const updatedPitch = {
            ...pitch,
            generated_data: newGeneratedData,
            title: newGeneratedData.name,
            short_description: newGeneratedData.tagline,
            industry: newGeneratedData.industry
        };

        try {
            await updatePitchInStore(updatedPitch);
        } catch (error) {
            console.error("Failed to update pitch:", error);
            showNotification("❌ Failed to update pitch", "error");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 z-50 overflow-y-auto"
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
                className="rounded-xl w-full max-w-6xl max-h-[96vh] sm:max-h-[92vh] lg:max-h-[95vh] overflow-hidden flex flex-col my-2 sm:my-6 lg:my-8"
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader pitch={pitch} d={d} onClose={onClose} />

                {/* Modal Content */}
                <div
                    style={{ background: "var(--bg-secondary)" }}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
                >
                    <PitchDetails
                        data={d}
                        onUpdate={handleUpdate}
                        pitchId={pitch.id}
                    />
                </div>

                <ModalActions 
                  pitch={pitch} 
                  onClose={onClose} 
                  onDelete={onDelete} 
                  onPreview={onPreview} 
                  navigateToPitch={navigateToPitch} 
                />
            </motion.div>
        </motion.div>
    );
}
