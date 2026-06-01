export function validateEmail(email) {
  if (!email) return { valid: false, message: "" };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false, message: "Enter a valid email address" };
  return { valid: true, message: "Valid email" };
}

export function getPasswordStrength(password) {
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
