import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { validateEmail, getPasswordStrength } from "../../utils/validation";

export default function SignUpForm({ onSwitchMode, onShowMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const emailValidation = validateEmail(email);
  const passwordStrength = getPasswordStrength(password);

  const getPasswordErrors = () => {
    const errors = [];
    if (!password) return errors;
    if (password.length < 6) errors.push("At least 6 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    return errors;
  };

  const passwordErrors = getPasswordErrors();

  const getConfirmPasswordError = () => {
    if (!confirmTouched || !confirmPassword) return "";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const confirmPasswordError = getConfirmPasswordError();

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
    if (password !== confirmPassword) {
      onShowMessage("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      onShowMessage("Check your email for the confirmation link!", "success");
    } catch (error) {
      onShowMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate aria-label="Create account form">
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
        </div>
        {emailTouched && email && !emailValidation.valid && <p className="text-xs mt-0.5" style={{ color: "#ef4444" }} role="alert">{emailValidation.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>
          Password <span className="text-red-400" aria-label="required">*</span>
        </label>
        <div className="relative">
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)} onFocus={() => setPasswordTouched(true)}
            required minLength={6}
            className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out pr-10 text-sm sm:text-base"
            placeholder="Create a strong password"
            aria-required="true"
            autoComplete="new-password"
            style={{ background: "var(--dark-input-bg)", borderColor: passwordTouched && passwordErrors.length > 0 ? "rgba(239, 68, 68, 0.5)" : passwordTouched && passwordStrength.score >= 3 ? "rgba(16, 185, 129, 0.5)" : "var(--dark-border-secondary)", color: "var(--dark-text-primary)" }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
            style={{ color: "var(--dark-text-muted)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        </div>
        {passwordTouched && password && (
          <div className="space-y-1" role="status">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < passwordStrength.score ? passwordStrength.color : "rgba(255,255,255,0.1)" }}></div>
              ))}
            </div>
            {passwordErrors.length > 0 && (
              <ul className="space-y-0.5">
                {passwordErrors.map((err, i) => (
                  <li key={i} className="text-[10px] flex items-center gap-1" style={{ color: "#ef4444" }}>
                    <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    {err}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-medium" style={{ color: "var(--dark-text-secondary)" }}>
          Confirm Password <span className="text-red-400" aria-label="required">*</span>
        </label>
        <div className="relative">
          <input
            id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmTouched(true)} onFocus={() => setConfirmTouched(true)}
            required
            className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out pr-10 text-sm sm:text-base ${confirmPasswordError ? "border-red-500/50" : ""}`}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            style={{ background: "var(--dark-input-bg)", borderColor: confirmPasswordError ? "rgba(239, 68, 68, 0.5)" : confirmTouched && confirmPassword === password && password ? "rgba(16, 185, 129, 0.5)" : "var(--dark-border-secondary)", color: "var(--dark-text-primary)" }}
          />
        </div>
        {confirmPasswordError && <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#ef4444" }} role="alert">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {confirmPasswordError}
        </p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3 sm:py-3.5 px-5 font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        style={{ background: loading ? "var(--dark-gradient-secondary)" : "var(--dark-button-primary-bg)", color: loading ? "var(--dark-text-disabled)" : "var(--dark-text-primary)", border: `1px solid ${loading ? "var(--dark-border-tertiary)" : "var(--dark-border-primary)"}` }}
        aria-live="polite">
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent rounded-full animate-spin"></div><span>Creating Account...</span></>
          ) : (
            <><span className="text-lg">✨</span><span>Create Account</span></>
          )}
        </span>
      </button>

      {/* Mode Switch */}
      <p className="text-xs sm:text-sm text-center">
        Already have an account?{" "}
        <button type="button" onClick={() => onSwitchMode("signin")}
          className="font-medium transition-colors duration-200 hover:underline focus:outline-none focus:underline" style={{ color: "#60a5fa" }}>
          Sign in
        </button>
      </p>
    </form>
  );
}
