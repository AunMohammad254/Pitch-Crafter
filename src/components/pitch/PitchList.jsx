import { memo } from "react";
import { motion } from "framer-motion";
import PitchCard from "./PitchCard";

const PitchList = memo(function PitchList({ 
  pitches, 
  filteredPitches, 
  onView, 
  onDelete, 
  onPreview,
  onCreateNew
}) {

  if (filteredPitches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-card)',
          backdropFilter: 'var(--glass-backdrop)',
        }}
        className="p-8 sm:p-12 lg:p-16 text-center animate-fade-in-up rounded-2xl"
      >
        <div
          style={{ background: 'var(--gradient-primary-subtle)' }}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
        >
          <span className="text-4xl sm:text-6xl">💡</span>
        </div>
        <h3
          style={{ color: 'var(--text-primary)' }}
          className="text-2xl sm:text-3xl font-primary font-bold mb-3 sm:mb-4"
        >
          No Pitches Found
        </h3>
        <p
          style={{ color: 'var(--text-secondary)' }}
          className="text-base sm:text-lg max-w-md mx-auto mb-6 sm:mb-8 font-medium leading-relaxed"
        >
          {pitches.length === 0
            ? "You haven't generated any startup pitches yet. Create your first pitch to see it here!"
            : "No pitches match your search criteria. Try adjusting your filters."
          }
        </p>
        {pitches.length === 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
          >
            <span className="mr-2 sm:mr-3 text-lg sm:text-xl">✨</span>
            Create Your First Pitch
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-stagger"
    >
      {filteredPitches.map((pitch, index) => (
        <PitchCard
          key={pitch.id}
          pitch={pitch}
          index={index}
          onView={() => onView(pitch)}
          onDelete={() => onDelete(pitch.id)}
          onPreview={() => onPreview(pitch)}
        />
      ))}
    </motion.div>
  );
});

export default PitchList;
