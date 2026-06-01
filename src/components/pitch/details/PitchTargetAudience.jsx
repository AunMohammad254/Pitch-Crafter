import { motion } from "framer-motion";

export const PitchTargetAudience = ({ data }) => {
  return (
    <motion.div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
      }}
      className="p-4 sm:p-6 lg:p-8 rounded-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl sm:text-3xl">👥</span>
        <div>
          <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Target Audience</h3>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Who are we building for?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3">Primary Segment</h4>
          <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed mb-4">
            {data.target_audience.description}
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3">Key Segments</h4>
          <div className="flex flex-wrap gap-2">
            {data.target_audience.segments.map((segment, index) => (
              <span
                key={index}
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-secondary)',
                }}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {segment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
