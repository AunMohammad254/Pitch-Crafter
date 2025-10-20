import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import Auth from "./components/Auth"
import PitchForm from "./components/PitchForm"
import MyPitches from "./components/MyPitches"
import LogoIcon from "./assets/logo-icon.svg"
import "./App.css"

export default function App() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState("generate")
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            setCurrentView('generate')
            break
          case '2':
            e.preventDefault()
            setCurrentView('my-pitches')
            break
          case 'm':
            e.preventDefault()
            setMobileMenuOpen(!mobileMenuOpen)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

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
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen main-content">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Section */}
            <div className="logo-container animate-fade-in-left">
              <div className="logo-icon floating">
                <img src={LogoIcon} alt="PitchCraft AI" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h1 className="logo-text text-lg sm:text-xl">
                PitchCraft AI
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 animate-fade-in-right">
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-white/80">
                <button
                  onClick={() => setCurrentView("generate")}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentView("generate")}
                  className={`nav-button transition-all duration-300 ${
                    currentView === "generate" 
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105" 
                      : "text-neutral-600 hover:text-primary-600 hover:bg-white/80"
                  }`}
                  aria-label="Generate new pitch"
                  aria-pressed={currentView === "generate"}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">✨</span>
                    <span>Generate Pitch</span>
                  </span>
                </button>
                <button
                  onClick={() => setCurrentView("my-pitches")}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentView("my-pitches")}
                  className={`nav-button transition-all duration-300 ${
                    currentView === "my-pitches" 
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105" 
                      : "text-neutral-600 hover:text-primary-600 hover:bg-white/80"
                  }`}
                  aria-label="View my pitches"
                  aria-pressed={currentView === "my-pitches"}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">📚</span>
                    <span>My Pitches</span>
                  </span>
                </button>
              </div>
              <div className="w-px h-8 bg-neutral-200 mx-2"></div>
              <button
                onClick={() => supabase.auth.signOut()}
                className="nav-button text-neutral-500 hover:text-red-500 hover:bg-red-50"
              >
                <span className="relative z-10">👋 Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="nav-button p-2"
                aria-label="Toggle mobile menu"
              >
                <span className="relative z-10">
                  {mobileMenuOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 bg-white/95 backdrop-blur-sm animate-fade-in-down">
              <div className="px-3 pt-3 pb-4 space-y-2">
                {/* Navigation Section */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-1">
                    Navigation
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView("generate")
                      setMobileMenuOpen(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentView("generate")
                        setMobileMenuOpen(false)
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center ${
                      currentView === "generate"
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
                    }`}
                    aria-label="Generate new pitch"
                    aria-pressed={currentView === "generate"}
                  >
                    <span className="mr-3 text-lg">✨</span>
                    <div>
                      <div className="font-semibold">Generate Pitch</div>
                      <div className={`text-xs ${currentView === "generate" ? "text-white/80" : "text-neutral-500"}`}>
                        Create a new startup pitch
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("my-pitches")
                      setMobileMenuOpen(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentView("my-pitches")
                        setMobileMenuOpen(false)
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center ${
                      currentView === "my-pitches"
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
                    }`}
                    aria-label="View my pitches"
                    aria-pressed={currentView === "my-pitches"}
                  >
                    <span className="mr-3 text-lg">📚</span>
                    <div>
                      <div className="font-semibold">My Pitches</div>
                      <div className={`text-xs ${currentView === "my-pitches" ? "text-white/80" : "text-neutral-500"}`}>
                        View and manage your pitches
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* Account Section */}
                <div className="border-t border-neutral-200 pt-3 mt-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-1 mb-1">
                    Account
                  </p>
                  <button
                    onClick={() => {
                      supabase.auth.signOut()
                      setMobileMenuOpen(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        supabase.auth.signOut()
                        setMobileMenuOpen(false)
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 flex items-center"
                    aria-label="Sign out of account"
                  >
                    <span className="mr-3 text-lg">👋</span>
                    <div>
                      <div className="font-semibold">Sign Out</div>
                      <div className="text-xs text-red-500">
                        Log out of your account
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <nav className="flex items-center space-x-2 text-sm text-neutral-600">
            <img src={LogoIcon} alt="PitchCraft AI" className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-primary-600 font-medium">PitchCraft AI</span>
            <span>/</span>
            <span className="font-medium text-neutral-800">
              {currentView === "generate" ? "Generate Pitch" : "My Pitches"}
            </span>
          </nav>
        </div>

        {/* Content with smooth transitions */}
        <div className="animate-fade-in-up transition-all duration-500 ease-in-out">
          {currentView === "generate" ? (
            <div key="generate" className="animate-fade-in-up">
              <PitchForm user={user} onNavigate={setCurrentView} />
            </div>
          ) : (
            <div key="my-pitches" className="animate-fade-in-up">
              <MyPitches user={user} onNavigate={setCurrentView} />
            </div>
          )}
        </div>
      </main>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl p-3 shadow-lg">
          <div className="text-xs text-neutral-600 space-y-1">
            <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Alt</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">1</kbd>
              <span className="text-neutral-500">Generate Pitch</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Alt</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">2</kbd>
              <span className="text-neutral-500">My Pitches</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Alt</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">M</kbd>
              <span className="text-neutral-500">Toggle Menu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-glass mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <img src={LogoIcon} alt="PitchCraft AI" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              <span className="font-primary font-bold text-lg sm:text-xl gradient-text">PitchCraft AI</span>
            </div>
            <p className="text-neutral-600 font-medium mb-2 text-sm sm:text-base">
              Built with ❤️ by <span className="font-semibold text-primary-600">Aun Abbas</span> using React + Supabase + Gemini
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto px-4">
              Transform your innovative ideas into compelling startup pitches with the power of artificial intelligence
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-neutral-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                AI-Powered
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                Real-time
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse"></span>
                Secure
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}