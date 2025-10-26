import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { PrimaryButton, LinkButton } from "./Button";
import LogoIcon from "../assets/logo-icon.svg";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Successfully signed in!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          // Ensure Supabase redirects back to current origin (dev/prod)
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100"
         style={{
           background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 25%, #ede9fe 50%, #f3e8ff 75%, #fdf4ff 100%)',
           minHeight: '100vh'
         }}>
      <div className="w-full max-w-sm sm:max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="logo-icon floating mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 scale-110 sm:scale-125">
            <img src={LogoIcon} alt="PitchCraft AI" className="w-full h-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold gradient-text mb-3 sm:mb-4">
            PitchCraft AI
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg font-medium px-2 sm:px-0">
            Transform your innovative ideas into compelling pitches
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="card-glass p-6 sm:p-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-primary font-bold text-neutral-800 mb-2 sm:mb-3">
              {isLogin ? "Welcome Back! 👋" : "Get Started 🚀"}
            </h2>
            <p className="text-neutral-600 font-medium text-sm sm:text-base px-2 sm:px-0">
              {isLogin
                ? "Sign in to continue creating amazing pitches"
                : "Create your account to start building pitches"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field text-base"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field text-base pr-10"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.988 5.556000000000001C6.004 2.681 9.35 1.5 12 1.5c2.682 0 6.029 1.18 8.045 4.056M4.002 18.444C6.018 21.319 9.364 22.5 12 22.5c2.682 0 6.029-1.18 8.045-4.056M12 15a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-sm mr-3"></div>
                  <span className="text-sm sm:text-base">
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? (
                    <>
                      <span className="mr-2">🔐</span>
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      <span className="hidden sm:inline">Create Account</span>
                      <span className="sm:hidden">Sign Up</span>
                    </>
                  )}
                </span>
              )}
            </PrimaryButton>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <LinkButton
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm sm:text-base px-2"
            >
              <span className="hidden sm:inline">
                {isLogin
                  ? "Don't have an account? Sign up →"
                  : "Already have an account? Sign in →"}
              </span>
              <span className="sm:hidden">
                {isLogin ? "Sign up →" : "Sign in →"}
              </span>
            </LinkButton>
          </div>

          {message && (
            <div
              className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium animate-fade-in-up ${
                message.includes("error") ||
                message.includes("Error") ||
                message.includes("Invalid")
                  ? "status-error"
                  : "status-success"
              }`}
            >
              <div className="flex items-start sm:items-center">
                <span className="mr-2 shrink-0 mt-0.5 sm:mt-0">
                  {message.includes("error") ||
                  message.includes("Error") ||
                  message.includes("Invalid")
                    ? "❌"
                    : "✅"}
                </span>
                <span className="leading-relaxed">{message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div
          className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🤖</div>
            <p className="text-xs font-medium text-neutral-600">AI-Powered</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
            <p className="text-xs font-medium text-neutral-600">
              <span className="hidden sm:inline">Lightning Fast</span>
              <span className="sm:hidden">Fast</span>
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔒</div>
            <p className="text-xs font-medium text-neutral-600">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
