import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LinkButton } from "../ui/Button";
import LogoIcon from "../../assets/logo.svg";
import ErrorBoundary from "../ui/ErrorBoundary";
import PitchInputForm from "./PitchInputForm";
import LivePreview from "./LivePreview";
import GenerationProgress from "./GenerationProgress";
import { PitchDetailsSkeleton } from "../ui/Skeleton";
import { usePitchGeneration } from "../../hooks/usePitchGeneration";

const CodePreview = lazy(() => import("./CodePreview"));
const PitchDetails = lazy(() => import("./PitchDetails"));

export default function PitchForm({ user, onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("auto");
  const [activeTab, setActiveTab] = useState("pitch");
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    loading,
    queueStatus,
    result,
    pitchId,
    landingCode,
    generatePitch,
    updatePitchData,
  } = usePitchGeneration(user, showNotification);

  // Handle preview URL with proper cleanup to prevent memory leaks
  useEffect(() => {
    let url = "";
    if (landingCode) {
      try {
        const blob = new Blob([landingCode], { type: "text/html" });
        url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error creating preview URL:", error);
      }
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
        setPreviewUrl("");
      }
    };
  }, [landingCode]);

  function showNotification(message, type) {
    const el = document.createElement("div");
    let statusClass, icon;
    switch (type) {
      case "success": statusClass = "status-success"; icon = "✅"; break;
      case "warning": statusClass = "bg-yellow-100 text-yellow-800 border-yellow-300"; icon = "⚠️"; break;
      case "error": default: statusClass = "status-error"; icon = "❌"; break;
    }

    el.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold backdrop-blur-sm border animate-fade-in-right ${statusClass}`;
    el.innerHTML = `
      <div class="flex items-center">
        <span class="mr-3 text-lg">${icon}</span>
        <span>${message}</span>
        <button class="ml-4 text-lg opacity-70 hover:opacity-100 transition-opacity" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(el);
    const delay = type === "error" || type === "warning" ? 6000 : 4000;
    setTimeout(() => {
      if (el.parentNode) {
        el.style.opacity = "0";
        el.style.transform = "translateX(100%)";
        setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
      }
    }, delay);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPreview(false);
    await generatePitch(prompt, selectedModel);
  };

  return (
    <div className="relative text-(--text-primary) font-sans selection:bg-(--accent-primary) selection:text-white overflow-x-hidden">
      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sm:mb-12 animate-fade-in-down">
          <div className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <div className="absolute inset-0 bg-(--gradient-primary) rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}
                className="relative w-full h-full rounded-xl flex items-center justify-center shadow-xl"
              >
                <img src={LogoIcon} alt="PitchCraft" className="w-6 h-6 sm:w-8 sm:h-8 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold font-primary tracking-tight">
                <span style={{
                  background: 'var(--gradient-primary-bold)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>Pitch</span>
                <span style={{ color: 'var(--text-primary)' }}>Craft</span>
              </h1>
              <span className="text-xs sm:text-sm font-medium tracking-wide" style={{ color: 'var(--text-tertiary)' }}>AI-Powered Startup Builder</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <LinkButton onClick={() => onNavigate('history')} className="hidden sm:flex text-sm font-medium hover:text-(--accent-primary) transition-colors">
              <span className="mr-2">📂</span> History
            </LinkButton>
            <div className="h-8 w-px bg-(--border-primary) hidden sm:block"></div>
            <div className="flex items-center space-x-3 bg-(--bg-secondary) px-3 py-1.5 rounded-full border border-(--border-secondary)">
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                {user.email[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block pr-1" style={{ color: 'var(--text-secondary)' }}>{user.email.split('@')[0]}</span>
            </div>
          </div>
        </header>

        {/* Step Indicator */}
        {!result && (
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-2 sm:space-x-4 bg-(--bg-secondary) px-4 py-2 rounded-full border border-(--border-secondary)">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${!loading ? 'bg-(--accent-primary) text-white' : 'text-(--text-tertiary)'}`}>
                <span>✏️</span>
                <span className="text-sm font-medium hidden sm:inline">Describe Idea</span>
              </div>
              <div className="w-6 h-0.5 bg-(--border-secondary)" />
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${loading ? 'bg-(--accent-primary) text-white' : 'text-(--text-tertiary)'}`}>
                <span>⚡</span>
                <span className="text-sm font-medium hidden sm:inline">Generate</span>
              </div>
              <div className="w-6 h-0.5 bg-(--border-secondary)" />
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-(--text-tertiary)">
                <span>✅</span>
                <span className="text-sm font-medium hidden sm:inline">Review & Save</span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-10 sm:mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-3xl sm:text-4xl">✨</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-primary mb-4 leading-tight animate-fade-in-up">
              <span style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Craft Your Perfect Pitch</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
              Transform your startup idea into a complete business package with AI-powered pitch generation, branding, and production-ready website code.
            </p>
          </div>
        )}

        {/* Input Form */}
        {!result && (
          <>
            {loading && <GenerationProgress queueStatus={queueStatus} />}
            <PitchInputForm
              prompt={prompt}
              setPrompt={setPrompt}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              loading={loading}
              queueStatus={queueStatus}
              handleSubmit={handleSubmit}
              result={result}
            />
          </>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 pb-20"
            >
              {/* Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-(--bg-secondary) p-1.5 rounded-xl border border-(--border-secondary) inline-flex shadow-lg relative z-10">
                  <button
                    onClick={() => setActiveTab("pitch")}
                    className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 flex items-center space-x-2 ${activeTab === "pitch"
                      ? "bg-(--bg-elevated) text-(--text-primary) shadow-md transform scale-105"
                      : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-tertiary)"
                      }`}
                  >
                    <span>📊</span>
                    <span>Pitch Deck</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("website")}
                    className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 flex items-center space-x-2 ${activeTab === "website"
                      ? "bg-(--bg-elevated) text-(--text-primary) shadow-md transform scale-105"
                      : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-tertiary)"
                      }`}
                  >
                    <span>🌐</span>
                    <span>Landing Page</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "pitch" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ErrorBoundary>
                  {activeTab === "pitch" ? (
                    <Suspense fallback={<PitchDetailsSkeleton />}>
                      <PitchDetails data={result} onUpdate={updatePitchData} />
                    </Suspense>
                  ) : (
                    <Suspense fallback={
                      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }} className="flex flex-col items-center justify-center p-12 rounded-xl text-center shadow-lg">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading code preview component...</p>
                      </div>
                    }>
                      <CodePreview code={landingCode} onOpenPreview={() => setShowPreview(true)} onShowNotification={showNotification} />
                    </Suspense>
                  )}
                </ErrorBoundary>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <LivePreview
          isOpen={showPreview}
          onClose={() => { setShowPreview(false); setIsFullscreen(false); }}
          previewUrl={previewUrl}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          resultName={result?.name}
        />
      </div>

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .font-primary { font-family: 'Outfit', sans-serif; }
        @keyframes pulse-custom { 0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); } }
        .generate-btn-pulse { animation: pulse-custom 2s infinite; }
      `}</style>
    </div>
  );
}
