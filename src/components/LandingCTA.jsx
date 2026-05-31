import { useState, useEffect, useRef } from "react";

export default function LandingCTA({ onGetStarted }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
      role="region"
      aria-label="Call to action"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`relative p-8 sm:p-12 lg:p-16 rounded-3xl border backdrop-blur-sm transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          }`}
          style={{
            background: "var(--dark-glass-bg)",
            borderColor: "var(--dark-border-primary)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"
            aria-hidden="true"
          ></div>

          <div className="relative z-10">
            {/* Testimonial */}
            <div className="mb-8 sm:mb-10">
              <div className="flex justify-center -space-x-2 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${[
                        "#3b82f6",
                        "#8b5cf6",
                        "#ec4899",
                        "#10b981",
                      ][i]} 0%, ${["#1d4ed8", "#6d28d9", "#db2777", "#059669"][i]} 100%)`,
                    }}
                  >
                    {["JD", "MK", "AL", "SR"][i]}
                  </div>
                ))}
              </div>
              <p
                className="text-sm sm:text-base font-medium max-w-xl mx-auto"
                style={{ color: "var(--dark-text-tertiary)" }}
              >
                "PitchCraft helped me secure my first seed round. The AI
                feedback was invaluable."
              </p>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold mb-4 sm:mb-6"
              style={{ color: "var(--dark-text-primary)" }}
            >
              Ready to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transform Your Idea
              </span>
              ?
            </h2>

            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
              style={{ color: "var(--dark-text-secondary)" }}
            >
              Join thousands of founders who are crafting winning pitches with
              AI. Start for free, no credit card required.
            </p>

            <button
              onClick={onGetStarted}
              className="group relative px-10 py-4 sm:px-12 sm:py-5 rounded-2xl font-semibold text-lg sm:text-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Crafting Your Pitch
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to right, transparent, white, transparent)",
                }}
                aria-hidden="true"
              ></div>
            </button>

            {/* Trust indicators */}
            <div
              className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm"
              style={{ color: "var(--dark-text-muted)" }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free tier available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
