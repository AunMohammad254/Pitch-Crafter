import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import PitchForm from "./components/PitchForm";
import MyPitches from "./components/MyPitches";
import {
  NavButton,
  MobileMenuButton,
  MobileNavItem,
} from "./components/Button";
import LogoIcon from "./assets/logo-icon.svg";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("generate");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

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
        <div className="flex flex-col items-center animate-fade-in-up text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 sm:mt-6 text-neutral-700 text-base sm:text-lg font-primary font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div
      className="min-h-screen dark-mode-root"
      style={{
        background: "var(--dark-gradient-primary)",
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <nav
        className="rounded-xl pb-2 z-50 backdrop-blur-md border-b sticky top-0 w-full"
        style={{
          background: "var(--dark-glass-bg)",
          borderBottomColor: "var(--dark-border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 sm:h-20 w-full">
            {/* Logo Section */}
            <div className="logo-container animate-fade-in-left shrink-0">
              <div className="logo-icon floating">
                <img
                  src={LogoIcon}
                  alt="Pitch Crafter"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <h1
                className="logo-text text-lg sm:text-xl"
                style={{ color: "var(--dark-text-primary)" }}
              >
                Pitch Crafter
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 animate-fade-in-right shrink-0">
              <div className="flex items-center backdrop-blur-sm rounded-2xl p-1 gap-4">
                <NavButton
                  onClick={() => setCurrentView("generate")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setCurrentView("generate")
                  }
                  active={currentView === "generate"}
                  aria-label="Generate new pitch"
                  aria-pressed={currentView === "generate"}
                >
                  <span className="mr-2">✨</span>
                  <span>Generate Pitch</span>
                </NavButton>
                <NavButton
                  onClick={() => setCurrentView("my-pitches")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setCurrentView("my-pitches")
                  }
                  active={currentView === "my-pitches"}
                  aria-label="View my pitches"
                  aria-pressed={currentView === "my-pitches"}
                >
                  <span className="mr-2">📚</span>
                  <span>My Pitches</span>
                </NavButton>
              </div>
              <div className="w-px h-8 mx-2"></div>
              <NavButton
                onClick={() => supabase.auth.signOut()}
                variant="danger"
              >
                👋 Sign Out
              </NavButton>
            </div>

            {/* Mobile Menu Button */}
            <div className=" md:hidden shrink-0">
              <NavButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="mobile"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </NavButton>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div
              className="rounded-xl md:hidden mobile-menu border-t backdrop-blur-sm animate-fade-in-down w-full"
              style={{
                background: "var(--dark-gradient-primary)",
                borderTopColor: "var(--dark-border-primary)",
              }}
            >
              <div className="px-3 pt-3 pb-4 space-y-2 w-full">
                {/* Navigation Section */}
                <div className="space-y-2 w-full">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1"
                    style={{ color: "var(--dark-text-secondary)" }}
                  >
                    Navigation
                  </p>
                  <MobileNavItem
                    onClick={() => {
                      setCurrentView("generate");
                      setMobileMenuOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrentView("generate");
                        setMobileMenuOpen(false);
                      }
                    }}
                    active={currentView === "generate"}
                    ariaLabel="Generate new pitch"
                    ariaPressed={currentView === "generate"}
                    className="w-full"
                  >
                    <span className="mr-3 text-lg">✨</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Generate Pitch</div>
                      <div
                        className="text-xs"
                        style={{
                          color:
                            currentView === "generate"
                              ? "var(--dark-text-primary)"
                              : "var(--dark-text-tertiary)",
                        }}
                      >
                        Create a new startup pitch
                      </div>
                    </div>
                  </MobileNavItem>
                  <MobileNavItem
                    onClick={() => {
                      setCurrentView("my-pitches");
                      setMobileMenuOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrentView("my-pitches");
                        setMobileMenuOpen(false);
                      }
                    }}
                    active={currentView === "my-pitches"}
                    ariaLabel="View my pitches"
                    ariaPressed={currentView === "my-pitches"}
                    className="w-full"
                  >
                    <span className="mr-3 text-lg">📚</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">My Pitches</div>
                      <div
                        className={`text-xs ${
                          currentView === "my-pitches"
                            ? "text-black/80"
                            : "text-neutral-500"
                        }`}
                      >
                        View and manage your pitches
                      </div>
                    </div>
                  </MobileNavItem>
                </div>

                {/* Account Section */}
                <div
                  className="border-t pt-3 mt-3 w-full"
                  style={{ borderTopColor: "var(--dark-border-primary)" }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 mb-1"
                    style={{ color: "var(--dark-text-secondary)" }}
                  >
                    Account
                  </p>
                  <MobileNavItem
                    onClick={() => {
                      supabase.auth.signOut();
                      setMobileMenuOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        supabase.auth.signOut();
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="w-full"
                    ariaLabel="Sign out of account"
                  >
                    <span className="mr-3 text-lg">👋</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Sign Out</div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--dark-text-tertiary)" }}
                      >
                        Log out of your account
                      </div>
                    </div>
                  </MobileNavItem>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="flex-1 relative"
        style={{
          background: "transparent",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderBottomColor: "var(--dark-text-primary)" }}
              ></div>
              <p style={{ color: "var(--dark-text-secondary)" }}>Loading...</p>
            </div>
          </div>
        ) : !user ? (
          <Auth onAuthSuccess={handleAuthSuccess} />
        ) : (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
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
                  {currentView === "generate" ? "Generate Pitch" : "My Pitches"}
                </span>
              </nav>
            </div>

            {/* Content with smooth transitions */}
            <div className="animate-fade-in-up transition-all duration-500 ease-in-out w-full">
              {currentView === "generate" ? (
                <div key="generate" className="animate-fade-in-up w-full">
                  <PitchForm user={user} onNavigate={setCurrentView} />
                </div>
              ) : (
                <div key="my-pitches" className="animate-fade-in-up w-full">
                  <MyPitches user={user} onNavigate={setCurrentView} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        <div className="card bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl p-3 shadow-lg max-w-xs">
          <div className="text-xs text-neutral-600 space-y-1">
            <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
            <div className="flex items-center space-x-2 flex-wrap">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">
                Alt
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">1</kbd>
              <span className="text-neutral-500 text-xs">Generate Pitch</span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">
                Alt
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">2</kbd>
              <span className="text-neutral-500 text-xs">My Pitches</span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">
                Alt
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">M</kbd>
              <span className="text-neutral-500 text-xs">Toggle Menu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-glass glass-footer mt-12 sm:mt-16 lg:mt-20 w-full">
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
      </footer>
    </div>
  );
}
