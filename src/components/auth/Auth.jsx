import { useState, useEffect } from "react";
import LogoIcon from "../../assets/logo-icon.svg";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function Auth({ initialMode, onBackToHome }) {
  const [authMode, setAuthMode] = useState(initialMode || "signin");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setAuthMode(initialMode || "signin");
  }, [initialMode]);

  useEffect(() => {
    setMessage("");
    setMessageType("");
  }, [authMode]);

  const showNotification = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const brandPanel = (
    <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8 xl:p-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse animate-delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse animate-delay-2000"></div>
      </div>

      <div className={`relative z-10 max-w-md text-center transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className={`mx-auto mb-6 w-20 h-20 xl:w-24 xl:h-24 relative transition-all duration-700 ease-out ${isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12"}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" aria-hidden="true"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 xl:p-4 border border-white/20">
            <img src={LogoIcon} alt="PitchCraft AI" className="w-full h-full filter drop-shadow-lg" />
          </div>
        </div>
        <h2 className="text-3xl xl:text-4xl font-primary font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">PitchCraft AI</span>
        </h2>
        <p className="text-gray-300 text-lg xl:text-xl font-medium leading-relaxed mb-10">
          Transform your innovative ideas into compelling investment pitches
        </p>
        <div className="space-y-4 text-left max-w-xs mx-auto">
          {[
            { icon: "🤖", text: "AI-powered pitch generation" },
            { icon: "🎯", text: "Investor simulation & practice" },
            { icon: "📊", text: "Export to PDF & PowerPoint" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border" style={{ background: "var(--dark-card-bg)", borderColor: "var(--dark-border-primary)" }}>
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: "var(--dark-bg-primary)" }}>
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse animate-delay-1000"></div>
      </div>

      {brandPanel}

      <div className="hidden lg:block w-px self-stretch shrink-0" style={{ background: "linear-gradient(to bottom, transparent, var(--dark-border-primary), transparent)" }}></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto">
        <div className={`w-full max-w-md transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {onBackToHome && (
            <button onClick={onBackToHome} className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm font-medium hover:underline" style={{ color: "var(--dark-text-muted)" }}>
              ← Back to Home
            </button>
          )}

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
