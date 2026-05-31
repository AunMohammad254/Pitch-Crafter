import { useEffect } from "react";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";
import LogoIcon from "../../assets/logo-icon.svg";

export default function Landing({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleGetStarted = () => {
    onNavigate("auth", "signup");
  };

  const handleSignIn = () => {
    onNavigate("auth", "signin");
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--dark-bg-primary)" }}
    >
      {/* Simple top nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
        style={{
          background: "var(--dark-bg-overlay)",
          borderColor: "var(--dark-border-primary)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-3"
              aria-label="PitchCraft Home"
            >
              <img
                src={LogoIcon}
                alt=""
                className="w-7 h-7 sm:w-8 sm:h-8"
                aria-hidden="true"
              />
              <span
                className="text-lg sm:text-xl font-primary font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                PitchCraft
              </span>
            </a>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleSignIn}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                style={{
                  background: "var(--dark-glass-bg)",
                  borderColor: "var(--dark-border-primary)",
                  color: "var(--dark-text-primary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--dark-card-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--dark-glass-bg)";
                }}
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  color: "white",
                  boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)",
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main role="main">
        {/* Hero */}
        <LandingHero
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />

        {/* Features */}
        <div id="features">
          <LandingFeatures />
        </div>

        {/* CTA */}
        <LandingCTA onGetStarted={handleGetStarted} />

        {/* Footer */}
        <LandingFooter />
      </main>
    </div>
  );
}
