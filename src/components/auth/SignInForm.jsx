import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { validateEmail } from "../../utils/validation";

export default function SignInForm({ onSwitchMode, onForgotPassword, onShowMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailValidation = validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValidation.valid) {
      onShowMessage("Please enter a valid email address", "error");
      return;
    }
    if (password.length < 6) {
      onShowMessage("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      onShowMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate aria-label="Sign in form">
      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>
          Email Address <span className="text-red-400" aria-label="required">*</span>
        </label>
        <div className="relative">
          <input
            id="email" name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)} onFocus={() => setEmailTouched(true)}
            required
            className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out text-sm sm:text-base pr-9 ${emailTouched && email && !emailValidation.valid ? "border-red-500/50" : ""}`}
            placeholder="you@example.com"
            aria-required="true"
            autoComplete="email"
            style={{ background: "var(--dark-input-bg)", borderColor: emailTouched && email && !emailValidation.valid ? "rgba(239, 68, 68, 0.5)" : "var(--dark-border-secondary)", color: "var(--dark-text-primary)" }}
          />
          {emailTouched && email && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {emailValidation.valid ? (
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          )}
        </div>
        {emailTouched && email && !emailValidation.valid && <p className="text-xs mt-0.5" style={{ color: "#ef4444" }} role="alert">{emailValidation.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>
            Password <span className="text-red-400" aria-label="required">*</span>
          </label>
          <button type="button" onClick={onForgotPassword} className="text-xs font-medium hover:underline focus:outline-none focus:underline" style={{ color: "#60a5fa" }}>
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)} onFocus={() => setPasswordTouched(true)}
            required minLength={6}
            className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out pr-10 text-sm sm:text-base"
            placeholder="Enter your password"
            aria-required="true"
            autoComplete="current-password"
            style={{ background: "var(--dark-input-bg)", borderColor: "var(--dark-border-secondary)", color: "var(--dark-text-primary)" }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
            style={{ color: "var(--dark-text-muted)" }}
            aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3 sm:py-3.5 px-5 font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden group"
        style={{ background: loading ? "var(--dark-gradient-secondary)" : "var(--dark-button-primary-bg)", color: loading ? "var(--dark-text-disabled)" : "var(--dark-text-primary)", border: `1px solid ${loading ? "var(--dark-border-tertiary)" : "var(--dark-border-primary)"}`, boxShadow: loading ? "none" : "var(--dark-shadow-md)" }}
        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "var(--dark-button-primary-hover)"; e.currentTarget.style.borderColor = "var(--dark-border-hover)"; e.currentTarget.style.boxShadow = "var(--dark-shadow-lg)"; } }}
        onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "var(--dark-button-primary-bg)"; e.currentTarget.style.borderColor = "var(--dark-border-primary)"; e.currentTarget.style.boxShadow = "var(--dark-shadow-md)"; } }}
        aria-live="polite">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" style={{ background: "var(--dark-gradient-primary)" }} aria-hidden="true"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--dark-text-disabled)", borderTopColor: "transparent" }} aria-hidden="true"></div>
              <span>Signing In...</span>
            </>
          ) : (
            <><span className="text-lg" aria-hidden="true">🔐</span>
              <span>Sign In</span>
            </>
          )}
        </span>
      </button>

      {/* Mode Switch */}
      <p className="text-xs sm:text-sm text-center">
        Don't have an account?{" "}
        <button type="button" onClick={() => onSwitchMode("signup")}
          className="font-medium transition-colors duration-200 hover:underline focus:outline-none focus:underline" style={{ color: "#60a5fa" }}>
          Create one
        </button>
      </p>
    </form>
  );
}
