import { useState, useEffect, useRef } from "react";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Pitch Generation",
    description:
      "Generate compelling startup pitches in seconds. Our AI analyzes your idea and crafts a structured, investor-ready pitch deck.",
    details: [
      "Smart content generation",
      "Industry-specific templates",
      "Multiple tone & style options",
    ],
  },
  {
    icon: "🎯",
    title: "Investor Simulation",
    description:
      "Practice pitching with our AI investor simulator. Get real-time feedback and refine your delivery before the real meeting.",
    details: [
      "Shark Tank style Q&A",
      "Realistic investor personas",
      "Performance analytics",
    ],
  },
  {
    icon: "💬",
    title: "Practice Mode",
    description:
      "Record and review your pitches with AI-powered feedback on pacing, clarity, and persuasiveness.",
    details: [
      "Speech recognition",
      "Real-time scoring",
      "Improvement suggestions",
    ],
  },
  {
    icon: "📊",
    title: "Export & Share",
    description:
      "Export your pitches to PDF or PowerPoint. Share directly with investors and track engagement.",
    details: [
      "PDF export with branding",
      "PowerPoint generation",
      "Direct sharing links",
    ],
  },
];

export default function LandingFeatures() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisibleCards((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
      role="region"
      aria-label="Features"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold mb-4 sm:mb-6"
            style={{ color: "var(--dark-text-primary)" }}
          >
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nail Your Pitch
            </span>
          </h2>
          <p
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--dark-text-secondary)" }}
          >
            From AI-powered generation to investor-ready export, PitchCraft
            covers every step of your pitch journey.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`group relative p-6 sm:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-700 ease-out hover:scale-105 hover:shadow-xl ${
                visibleCards.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                background: "var(--dark-card-bg)",
                borderColor: "var(--dark-border-secondary)",
                transitionDelay: `${index * 150}ms`,
              }}
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              {/* Card glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)",
                }}
                aria-hidden="true"
              ></div>

              <div className="relative z-10">
                <div
                  className="text-3xl sm:text-4xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3
                  id={`feature-title-${index}`}
                  className="text-lg sm:text-xl font-primary font-semibold mb-3"
                  style={{ color: "var(--dark-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-4"
                  style={{ color: "var(--dark-text-tertiary)" }}
                >
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--dark-text-muted)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--dark-loader-primary)" }}
                      ></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
