import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/layout/Navbar";
import LogoIcon from "./assets/logo-icon.svg";
import { KeyboardShortcutsModal } from "./components/ui/KeyboardShortcutsModal";
import "./App.css";

const Auth = lazy(() => import("./components/auth/Auth"));
const Landing = lazy(() => import("./components/landing/Landing"));
const PitchForm = lazy(() => import("./components/pitch/PitchForm"));
const MyPitches = lazy(() => import("./components/pitch/MyPitches"));
const UpdatePassword = lazy(() => import("./components/auth/UpdatePassword"));
const InvestorChat = lazy(() => import("./components/simulator/InvestorChat"));
const PitchPractice = lazy(() => import("./components/simulator/PitchPractice"));
const AuroraBackground = lazy(() => import("./components/ui/AuroraBackground"));

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("landing");
  const [authInitialMode, setAuthInitialMode] = useState("signin");
  const [activePitch, setActivePitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentView("generate");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setCurrentView("update-password");
      } else if (event === "SIGNED_IN") {
        setCurrentView("generate");
      } else if (event === "SIGNED_OUT") {
        setCurrentView("landing");
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthNavigate = (view, initialMode) => {
    setAuthInitialMode(initialMode || "signin");
    setCurrentView(view);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
        return;

      // Global toggle for help modal
      if (e.key === "?" || (e.ctrlKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Close modal on escape
      if (e.key === "Escape") {
        setShowShortcuts(false);
        return;
      }

      // Navigation shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "g":
            e.preventDefault();
            setCurrentView("generate");
            break;
          case "h":
            e.preventDefault();
            setCurrentView("my-pitches");
            break;
        }
      }

      // Legacy Alt shortcuts
      if (e.altKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            setCurrentView("generate");
            break;
          case "2":
            e.preventDefault();
            setCurrentView("my-pitches");
            break;
          case "m":
            e.preventDefault();
            setMobileMenuOpen(!mobileMenuOpen);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen main-content flex items-center justify-center px-4">
        <div className="flex flex-col items-center animate-fade-in-up text-center loading-container">
          <div className="loading-spinner"></div>
          <p className="mt-4 sm:mt-6 text-neutral-700 text-base sm:text-lg font-primary font-medium loading-text">
            Loading your workspace...
          </p>
          <div className="mt-2 text-xs sm:text-sm text-neutral-500 loading-subtext">
            Preparing your AI-powered pitch creation environment
          </div>
        </div>
      </div>
    );
  }

  if (!user && currentView !== "update-password") {
    if (currentView === "auth") {
      return (
        <Suspense fallback={
          <div className="min-h-screen main-content flex items-center justify-center px-4">
            <div className="loading-spinner"></div>
          </div>
        }>
          <Auth initialMode={authInitialMode} onBackToHome={handleBackToLanding} />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={
        <div className="min-h-screen main-content flex items-center justify-center px-4">
          <div className="loading-spinner"></div>
        </div>
      }>
        <Landing onNavigate={handleAuthNavigate} />
      </Suspense>
    );
  }

  return (
    <div
      className="min-h-screen dark-mode-root flex flex-col"
      style={{
        background: "var(--dark-gradient-primary)",
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
        onSignOut={() => supabase.auth.signOut()}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Main Content */}
      <main
        className="flex-1 relative overflow-hidden"
        style={{
          background: "transparent",
        }}
      >
        <Suspense fallback={null}>
          <AuroraBackground
            speed={0.5}
            blend={0.5}
            amplitude={1.0}
            colorStops={["#4ade80", "#a855f7", "#3b82f6"]}
            paused={!animationsEnabled}
            style={{
              opacity: 0.6,
              backgroundColor: "#0f172a"
            }}
          />
        </Suspense>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-28 sm:pt-32">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up w-full">
            <nav className="flex items-center space-x-2 text-sm text-neutral-600 w-full">
              <img
                src={LogoIcon}
                alt="PitchCrafter"
                className="w-6 h-6 sm:w-8 sm:h-8 shrink-0"
              />
              <span className="text-primary-600 font-medium">
                Pitch Crafter
              </span>
              <span>/</span>
              <span className="font-medium text-neutral-800 truncate">
                {currentView === "generate" ? "Generate Pitch"
                  : currentView === "my-pitches" ? "My Pitches"
                    : currentView === "investor-chat" ? "Shark Tank Simulator"
                      : currentView === "pitch-practice" ? "Pitch Dojo"
                        : "Update Password"}
              </span>
            </nav>
          </div>

          {/* Content with smooth transitions */}
          <div className="animate-fade-in-up transition-all duration-500 ease-in-out w-full">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="loading-spinner"></div>
                <p className="mt-4 text-neutral-400 text-sm font-medium">Loading component view...</p>
              </div>
            }>
              {currentView === "my-pitches" ? (
                <div key="my-pitches" className="animate-fade-in-up w-full">
                  <MyPitches user={user} onNavigate={(view, pitch) => {
                    if (pitch) setActivePitch(pitch);
                    setCurrentView(view);
                  }} />
                </div>
              ) : currentView === "investor-chat" && activePitch ? (
                <div key="investor-chat" className="animate-fade-in-up w-full">
                  <InvestorChat pitch={activePitch} onExit={() => setCurrentView("my-pitches")} />
                </div>
              ) : currentView === "pitch-practice" && activePitch ? (
                <div key="pitch-practice" className="animate-fade-in-up w-full">
                  <PitchPractice pitch={activePitch} onExit={() => setCurrentView("my-pitches")} />
                </div>
              ) : currentView === "update-password" ? (
                <div key="update-password" className="animate-fade-in-up w-full">
                  <UpdatePassword onFullfill={() => {
                    setCurrentView("generate");
                    // Ensure user is set if session exists
                    supabase.auth.getSession().then(({ data: { session } }) => {
                      setUser(session?.user ?? null);
                    });
                  }} />
                </div>
              ) : (
                <div key="generate" className="animate-fade-in-up w-full">
                  <PitchForm user={user} onNavigate={setCurrentView} />
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg shadow-xl"
        >
          <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/80">?</kbd>
          <span className="text-[10px] font-medium text-white/60 tracking-wider uppercase">Press for help</span>
        </motion.div>
      </div>

      {/* Footer */}
      < footer className="footer-glass glass-footer mt-12 sm:mt-16 lg:mt-20 w-full" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 w-full">
          <div className="text-center w-full">
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <img
                src={LogoIcon}
                alt="Pitch Crafter"
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 shrink-0"
              />
              <span className="font-primary font-bold text-lg sm:text-xl gradient-text">
                Pitch Crafter
              </span>
            </div>
            <p className="text-neutral-600 font-medium mb-2 text-sm sm:text-base">
              Built with ❤️ by{" "}
              <span className="font-semibold text-primary-600">Aun Abbas</span>{" "}
              using React + Supabase + Gemini
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto px-4">
              Transform your innovative ideas into compelling startup pitches
              with the power of artificial intelligence
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-neutral-400 flex-wrap">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse shrink-0"></span>
                AI-Powered
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse shrink-0"></span>
                Real-time
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse shrink-0"></span>
                Secure
              </span>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}
