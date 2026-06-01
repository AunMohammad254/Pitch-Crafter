import { useState, useEffect } from "react";
import BrandPanel from "./BrandPanel";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useUIStore } from "../../stores/uiStore";

export default function Auth() {
  const { authInitialMode, setCurrentView } = useUIStore();
  const [authMode, setAuthMode] = useState(authInitialMode || "signin");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setAuthMode(authInitialMode || "signin");
  }, [authInitialMode]);

  useEffect(() => {
    setMessage("");
    setMessageType("");
  }, [authMode]);

  const showNotification = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  return (
    <main className="min-h-screen h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: "var(--dark-bg-primary)" }}>
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse animate-delay-1000"></div>
      </div>

      <BrandPanel isVisible={isVisible} />

      <div className="hidden lg:block w-px self-stretch shrink-0" style={{ background: "linear-gradient(to bottom, transparent, var(--dark-border-primary), transparent)" }}></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto">
        <div className={`w-full max-w-md transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button onClick={() => setCurrentView('landing')} className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm font-medium hover:underline" style={{ color: "var(--dark-text-muted)" }}>
            ← Back to Home
          </button>

          <header className="mb-5">
            <h1 className="text-xl sm:text-2xl font-primary font-bold mb-1" style={{ color: "var(--dark-text-primary)" }}>
              {authMode === "signin" && "👋 Welcome Back!"}
              {authMode === "signup" && "🚀 Get Started"}
              {authMode === "forgot-password" && "🔐 Reset Password"}
            </h1>
            <p className="text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>
              {authMode === "signin" && "Sign in to continue creating amazing pitches"}
              {authMode === "signup" && "Create your account to start building pitches"}
              {authMode === "forgot-password" && "Enter your email to receive reset instructions"}
            </p>
          </header>

          {authMode === "signin" && <SignInForm onSwitchMode={setAuthMode} onForgotPassword={() => setAuthMode("forgot-password")} onShowMessage={showNotification} />}
          {authMode === "signup" && <SignUpForm onSwitchMode={setAuthMode} onShowMessage={showNotification} />}
          {authMode === "forgot-password" && <ForgotPasswordForm onBackToSignIn={() => setAuthMode("signin")} onShowMessage={showNotification} />}

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-xs sm:text-sm font-medium border animate-fade-in-up ${messageType === "error" ? "bg-red-500/10 border-red-500/30 text-red-200" : "bg-green-500/10 border-green-500/30 text-green-200"}`}>
              {messageType === "error" ? "❌ " : "✅ "}{message}
            </div>
          )}

          <div className="mt-6 pt-3 border-t text-center" style={{ borderColor: "var(--dark-border-secondary)" }}>
            <p className="text-[10px] sm:text-xs" style={{ color: "var(--dark-text-muted)" }}>
              By continuing, you agree to our <a href="#" className="font-medium hover:underline" style={{ color: "#60a5fa" }}>Terms</a> and <a href="#" className="font-medium hover:underline" style={{ color: "#60a5fa" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
