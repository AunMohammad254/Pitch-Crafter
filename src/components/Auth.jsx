import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LogoIcon from "../assets/logo-icon.svg";

function validateEmail(email) {
  if (!email) return { valid: false, message: "" };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false, message: "Enter a valid email address" };
  return { valid: true, message: "Valid email" };
}

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { score: 0, label: "Weak", color: "#ef4444" },
    { score: 1, label: "Weak", color: "#ef4444" },
    { score: 2, label: "Fair", color: "#f59e0b" },
    { score: 3, label: "Good", color: "#3b82f6" },
    { score: 4, label: "Strong", color: "#10b981" },
    { score: 5, label: "Very Strong", color: "#10b981" },
  ];
  return levels[Math.min(score, 5)];
}

export default function Auth({ initialMode, onBackToHome }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMode, setAuthMode] = useState(initialMode || "signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setAuthMode(initialMode || "signin");
  }, [initialMode]);

  // Reset fields on mode change
  useEffect(() => {
    setMessage("");
    setMessageType("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordTouched(false);
    setConfirmTouched(false);
  }, [authMode]);

  const emailValidation = validateEmail(email);
  const passwordStrength = getPasswordStrength(password);

  const getPasswordErrors = () => {
    const errors = [];
    if (!password) return errors;
    if (password.length < 6) errors.push("At least 6 characters");
    if (authMode === "signup") {
      if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
      if (!/[0-9]/.test(password)) errors.push("One number");
      if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    }
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
    setMessage("");
    setMessageType("");

    // Client-side validation
    if (!emailValidation.valid) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    if (authMode !== "forgot-password" && password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return;
    }

    if (authMode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
        setMessageType("success");
      } else if (authMode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("Check your email for the password reset link!");
        setMessageType("success");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 relative overflow-hidden"
      role="main"
      aria-label="Authentication page"
      style={{ background: "var(--dark-gradient-primary)" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animate-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse animate-delay-2000"></div>
      </div>

      <div
        className={`w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Back to Home */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline focus:outline-none focus:underline"
            style={{ color: "var(--dark-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--dark-text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--dark-text-muted)")
            }
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div
            className={`mx-auto mb-3 sm:mb-4 lg:mb-5 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 relative transition-all duration-700 ease-out ${
              isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12"
            }`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"
              aria-hidden="true"
            ></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 sm:p-3 border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <img
                src={LogoIcon}
                alt="PitchCraft AI"
                className="w-full h-full filter drop-shadow-lg"
              />
            </div>
          </div>
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-primary font-bold mb-2 transition-all duration-700 ease-out animate-delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PitchCraft AI
            </span>
          </h1>
          <p
            className={`text-gray-300 text-base sm:text-lg font-medium max-w-md mx-auto leading-relaxed transition-all duration-700 ease-out animate-delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Transform your innovative ideas into compelling pitches
          </p>
        </div>

        {/* Auth Card */}
        <section
          className={`relative backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border shadow-2xl transition-all duration-700 ease-out animate-delay-600 ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
          role="region"
          aria-labelledby="auth-heading"
          aria-describedby="auth-description"
          style={{
            background: "var(--dark-glass-bg)",
            borderColor: "var(--dark-border-primary)",
            boxShadow: "var(--dark-shadow-xl)",
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-50"
            aria-hidden="true"
          ></div>

          <div className="relative z-10">
            <header className="text-center mb-6 sm:mb-8">
              <h1
                id="auth-heading"
                className={`text-xl sm:text-2xl lg:text-3xl font-primary font-bold mb-2 sm:mb-3 transition-all duration-500 ease-out`}
                style={{ color: "var(--dark-text-primary)" }}
              >
                {authMode === "signin" && (
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl" aria-hidden="true">👋</span>
                    Welcome Back!
                  </span>
                )}
                {authMode === "signup" && (
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl" aria-hidden="true">🚀</span>
                    Get Started
                  </span>
                )}
                {authMode === "forgot-password" && (
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl" aria-hidden="true">🔐</span>
                    Reset Password
                  </span>
                )}
              </h1>
              <p
                id="auth-description"
                className="font-medium text-sm sm:text-base leading-relaxed max-w-sm mx-auto"
                style={{ color: "var(--dark-text-secondary)" }}
              >
                {authMode === "signin" &&
                  "Sign in to continue creating amazing pitches"}
                {authMode === "signup" &&
                  "Create your account to start building pitches"}
                {authMode === "forgot-password" &&
                  "Enter your email to receive reset instructions"}
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
              noValidate
              aria-label={
                authMode === "signin"
                  ? "Sign in form"
                  : authMode === "signup"
                  ? "Create account form"
                  : "Reset password form"
              }
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium"
                  style={{ color: "var(--dark-text-secondary)" }}
                >
                  Email Address{" "}
                  <span className="text-red-400" aria-label="required">
                    *
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    onFocus={() => setEmailTouched(true)}
                    required
                    className={`w-full px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out text-base sm:text-lg pr-10 ${
                      emailTouched && email && !emailValidation.valid
                        ? "border-red-500/50"
                        : ""
                    }`}
                    placeholder="you@example.com"
                    aria-required="true"
                    aria-describedby="email-validation"
                    autoComplete="email"
                    style={{
                      background: "var(--dark-input-bg)",
                      borderColor: emailTouched && email && !emailValidation.valid
                        ? "rgba(239, 68, 68, 0.5)"
                        : "var(--dark-border-secondary)",
                      color: "var(--dark-text-primary)",
                    }}
                  />
                  {emailTouched && email && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailValidation.valid ? (
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
                <div id="email-validation" className="sr-only" role="status">
                  {emailTouched && email
                    ? emailValidation.valid
                      ? "Email format is valid"
                      : "Invalid email format"
                    : ""}
                </div>
                {emailTouched && email && !emailValidation.valid && (
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: "#ef4444" }}
                    role="alert"
                  >
                    {emailValidation.message}
                  </p>
                )}
              </div>

              {/* Password */}
              {authMode !== "forgot-password" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm sm:text-base font-medium"
                      style={{ color: "var(--dark-text-secondary)" }}
                    >
                      Password{" "}
                      <span className="text-red-400" aria-label="required">
                        *
                      </span>
                    </label>
                    {authMode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot-password")}
                        className="text-sm font-medium hover:underline focus:outline-none focus:underline"
                        style={{ color: "#60a5fa" }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      onFocus={() => setPasswordTouched(true)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out pr-12 sm:pr-14 text-base sm:text-lg"
                      placeholder={
                        authMode === "signup"
                          ? "Create a strong password"
                          : "Enter your password"
                      }
                      aria-required="true"
                      aria-describedby="password-strength"
                      autoComplete={
                        authMode === "signin"
                          ? "current-password"
                          : "new-password"
                      }
                      style={{
                        background: "var(--dark-input-bg)",
                        borderColor:
                          passwordTouched && passwordErrors.length > 0
                            ? "rgba(239, 68, 68, 0.5)"
                            : passwordTouched && passwordStrength.score >= 3
                            ? "rgba(16, 185, 129, 0.5)"
                            : "var(--dark-border-secondary)",
                        color: "var(--dark-text-primary)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 sm:p-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
                      style={{ color: "var(--dark-text-muted)" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordTouched && password && authMode === "signup" && (
                    <div className="mt-2 space-y-2" role="status" aria-label="Password strength">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                i < passwordStrength.score
                                  ? passwordStrength.color
                                  : "rgba(255,255,255,0.1)",
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xs font-medium"
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--dark-text-muted)" }}
                        >
                          {passwordStrength.score}/5
                        </span>
                      </div>
                      {passwordErrors.length > 0 && (
                        <ul className="space-y-1">
                          {passwordErrors.map((err, i) => (
                            <li
                              key={i}
                              className="text-xs flex items-center gap-1.5"
                              style={{ color: "#ef4444" }}
                            >
                              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              {err}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  <div id="password-strength" className="sr-only">
                    Password strength: {passwordStrength.label}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              {authMode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm sm:text-base font-medium"
                    style={{ color: "var(--dark-text-secondary)" }}
                  >
                    Confirm Password{" "}
                    <span className="text-red-400" aria-label="required">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setConfirmTouched(true)}
                      onFocus={() => setConfirmTouched(true)}
                      required
                      className={`w-full px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-out pr-12 sm:pr-14 text-base sm:text-lg ${
                        confirmPasswordError ? "border-red-500/50" : ""
                      }`}
                      placeholder="Re-enter your password"
                      aria-required="true"
                      aria-describedby="confirm-password-error"
                      autoComplete="new-password"
                      style={{
                        background: "var(--dark-input-bg)",
                        borderColor: confirmPasswordError
                          ? "rgba(239, 68, 68, 0.5)"
                          : confirmTouched && confirmPassword === password && password
                          ? "rgba(16, 185, 129, 0.5)"
                          : "var(--dark-border-secondary)",
                        color: "var(--dark-text-primary)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 sm:p-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
                      style={{ color: "var(--dark-text-muted)" }}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p
                      className="text-xs sm:text-sm mt-1 flex items-center gap-1"
                      style={{ color: "#ef4444" }}
                      role="alert"
                      id="confirm-password-error"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 sm:py-5 px-6 font-semibold text-base sm:text-lg rounded-2xl
                         transition-all duration-300 ease-out transform
                         hover:scale-105 hover:shadow-2xl active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                         relative overflow-hidden group touch-manipulation"
                style={{
                  background: loading
                    ? "var(--dark-gradient-secondary)"
                    : "var(--dark-button-primary-bg)",
                  color: loading
                    ? "var(--dark-text-disabled)"
                    : "var(--dark-text-primary)",
                  border: `1px solid ${
                    loading
                      ? "var(--dark-border-tertiary)"
                      : "var(--dark-border-primary)"
                  }`,
                  boxShadow: loading ? "none" : "var(--dark-shadow-md)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "var(--dark-button-primary-hover)";
                    e.currentTarget.style.borderColor =
                      "var(--dark-border-hover)";
                    e.currentTarget.style.boxShadow =
                      "var(--dark-shadow-lg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "var(--dark-button-primary-bg)";
                    e.currentTarget.style.borderColor =
                      "var(--dark-border-primary)";
                    e.currentTarget.style.boxShadow =
                      "var(--dark-shadow-md)";
                  }
                }}
                aria-live="polite"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                  style={{ background: "var(--dark-gradient-primary)" }}
                  aria-hidden="true"
                ></div>

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "var(--dark-text-disabled)",
                          borderTopColor: "transparent",
                        }}
                        aria-hidden="true"
                      ></div>
                      <span>
                        {authMode === "signin"
                          ? "Signing In..."
                          : authMode === "signup"
                          ? "Creating Account..."
                          : "Sending..."}
                      </span>
                    </>
                  ) : (
                    <>
                      {authMode === "signin" ? (
                        <>
                          <span className="text-xl" aria-hidden="true">🔐</span>
                          <span>Sign In</span>
                        </>
                      ) : authMode === "signup" ? (
                        <>
                          <span className="text-xl" aria-hidden="true">✨</span>
                          <span>Create Account</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl" aria-hidden="true">📧</span>
                          <span>Send Instructions</span>
                        </>
                      )}
                    </>
                  )}
                </span>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                  <div
                    className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, var(--dark-text-primary-10), transparent)",
                    }}
                  ></div>
                </div>
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium backdrop-blur-sm border transition-all duration-500 ease-out animate-fade-in-up ${
                    messageType === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-200"
                      : "bg-green-500/10 border-green-500/30 text-green-200"
                  }`}
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                      {messageType === "error" ? "❌" : "✅"}
                    </span>
                    <span className="leading-relaxed">{message}</span>
                  </div>
                </div>
              )}
            </form>

            {/* Social Login */}
            {authMode !== "forgot-password" && (
              <div className="mt-6 sm:mt-8">
                <div className="relative flex items-center gap-3 mb-4 sm:mb-5">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--dark-border-secondary)" }}
                  ></div>
                  <span
                    className="text-xs sm:text-sm font-medium shrink-0"
                    style={{ color: "var(--dark-text-muted)" }}
                  >
                    Or continue with
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--dark-border-secondary)" }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 sm:py-3.5 rounded-xl border backdrop-blur-sm text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{
                      background: "var(--dark-glass-bg)",
                      borderColor: "var(--dark-border-secondary)",
                      color: "var(--dark-text-muted)",
                    }}
                    title="Google OAuth - Coming Soon"
                    aria-label="Sign in with Google - Coming Soon"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 sm:py-3.5 rounded-xl border backdrop-blur-sm text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{
                      background: "var(--dark-glass-bg)",
                      borderColor: "var(--dark-border-secondary)",
                      color: "var(--dark-text-muted)",
                    }}
                    title="GitHub OAuth - Coming Soon"
                    aria-label="Sign in with GitHub - Coming Soon"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
                <p
                  className="text-xs text-center mt-2"
                  style={{ color: "var(--dark-text-muted)" }}
                >
                  Social login coming soon
                </p>
              </div>
            )}

            {/* Mode Switch */}
            <div
              className="mt-6 sm:mt-8 text-center space-y-3"
            >
              {authMode !== "forgot-password" ? (
                <p
                  className="text-sm sm:text-base"
                  style={{ color: "var(--dark-text-secondary)" }}
                >
                  {authMode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode(authMode === "signin" ? "signup" : "signin")
                    }
                    className="font-medium transition-colors duration-200 hover:underline focus:outline-none focus:underline"
                    style={{ color: "#60a5fa" }}
                  >
                    {authMode === "signin" ? "Create one" : "Sign in"}
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="font-medium hover:underline focus:outline-none focus:underline text-sm sm:text-base"
                  style={{ color: "var(--dark-text-secondary)" }}
                >
                  ← Back to Sign In
                </button>
              )}

              {onBackToHome && (
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--dark-text-muted)" }}
                >
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="hover:underline focus:outline-none focus:underline"
                  >
                    Back to Home
                  </button>
                </p>
              )}
            </div>

            {/* Terms & Privacy */}
            <div
              className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-center"
              style={{
                borderColor: "var(--dark-border-secondary)",
              }}
            >
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--dark-text-muted)" }}
              >
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="font-medium hover:underline focus:outline-none focus:underline"
                  style={{ color: "#60a5fa" }}
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium hover:underline focus:outline-none focus:underline"
                  style={{ color: "#60a5fa" }}
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
