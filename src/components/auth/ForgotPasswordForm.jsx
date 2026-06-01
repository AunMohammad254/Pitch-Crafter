import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { validateEmail } from "../../utils/validation";

export default function ForgotPasswordForm({ onBackToSignIn, onShowMessage }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValidation = validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValidation.valid) {
      onShowMessage("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      onShowMessage("Check your email for the password reset link!", "success");
    } catch (error) {
      onShowMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate aria-label="Reset password form">
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

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3 sm:py-3.5 px-5 font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        style={{ background: loading ? "var(--dark-gradient-secondary)" : "var(--dark-button-primary-bg)", color: loading ? "var(--dark-text-disabled)" : "var(--dark-text-primary)", border: `1px solid ${loading ? "var(--dark-border-tertiary)" : "var(--dark-border-primary)"}` }}
        aria-live="polite">
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></>
          ) : (
            <><span className="text-lg">📧</span><span>Send Instructions</span></>
          )}
        </span>
      </button>

      {/* Back Switch */}
      <div className="text-center">
        <button type="button" onClick={onBackToSignIn}
          className="font-medium hover:underline focus:outline-none focus:underline text-xs sm:text-sm" style={{ color: "var(--dark-text-secondary)" }}>
          ← Back to Sign In
        </button>
      </div>
    </form>
  );
}
