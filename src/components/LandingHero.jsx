import { useState, useEffect } from "react";
import LogoIcon from "../assets/logo-icon.svg";

export default function LandingHero({ onGetStarted, onLearnMore }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Hero section"
    >
      {/* Aurora background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animate-delay-1000"></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse animate-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 sm:mb-10 backdrop-blur-sm transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            background: "var(--dark-glass-bg)",
            borderColor: "var(--dark-border-primary)",
          }}
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--dark-text-secondary)" }}
          >
            AI-Powered Pitch Generation
          </span>
        </div>

        {/* Logo */}
        <div
          className={`mx-auto mb-6 sm:mb-8 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 transition-all duration-700 ease-out ${
            isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12"
          }`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"
            aria-hidden="true"
          ></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
            <img
              src={LogoIcon}
              alt="PitchCraft AI"
              className="w-full h-full filter drop-shadow-lg"
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-primary font-bold leading-tight mb-6 sm:mb-8 transition-all duration-700 ease-out animate-delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
            Craft Pitches That
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
            Win Investors Over
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-12 transition-all duration-700 ease-out animate-delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ color: "var(--dark-text-secondary)" }}
        >
          Transform your startup ideas into compelling investment pitches with
          AI. Practice, refine, and present with confidence.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-700 ease-out animate-delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
              color: "white",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Free
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

          <button
            onClick={onLearnMore}
            className="group px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
            style={{
              background: "var(--dark-glass-bg)",
              borderColor: "var(--dark-border-primary)",
              color: "var(--dark-text-primary)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--dark-card-hover-bg)";
              e.target.style.borderColor = "var(--dark-border-hover)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--dark-glass-bg)";
              e.target.style.borderColor = "var(--dark-border-primary)";
            }}
          >
            <span className="flex items-center gap-2">
              Learn More
              <svg
                className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto transition-all duration-700 ease-out animate-delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { value: "10x", label: "Faster Pitches" },
            { value: "99%", label: "Uptime" },
            { value: "5K+", label: "Pitches Generated" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl font-bold font-primary mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div
                className="text-sm sm:text-base font-medium"
                style={{ color: "var(--dark-text-muted)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
