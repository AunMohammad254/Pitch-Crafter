import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import LogoIcon from "../assets/logo.svg";

export default function PitchForm({ user, onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [landingCode, setLandingCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pitch");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Generate preview URL when landing code changes
  useEffect(() => {
    if (landingCode && !previewUrl) {
      generatePreview();
    }
  }, [landingCode]);

  const generatePreview = () => {
    if (!landingCode) return;

    // Create blob from HTML code
    const blob = new Blob([landingCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const openPreview = () => {
    if (!previewUrl) {
      generatePreview();
    }
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setLandingCode(null);
    setPreviewUrl("");
    setShowPreview(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key missing in .env");

      // Step 1: Get Pitch Data
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `
ACT AS A PROFESSIONAL STARTUP CONSULTANT. Generate a comprehensive startup pitch package from this idea: "${prompt}"

Return ONLY valid JSON with this exact structure:
{
  "name": "Creative startup name",
  "tagline": "Catchy one-liner",
  "elevator_pitch": "2-4 sentence compelling story",
  "problem": "Clear problem statement",
  "solution": "Innovative solution description", 
  "target_audience": {
    "description": "Primary customer description",
    "segments": ["segment 1", "segment 2", "segment 3"]
  },
  "unique_value_proposition": "What makes it unique vs competitors",
  "landing_copy": {
    "headline": "Attention-grabbing headline",
    "subheadline": "Supporting description",
    "call_to_action": "Action-oriented CTA"
  },
  "industry": "Relevant industry",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex", 
    "accent": "#hex",
    "neutral": "#hex"
  },
  "logo_ideas": ["creative idea 1", "creative idea 2", "creative idea 3"]
}

IMPORTANT: Return ONLY the JSON object, no other text.`,
              },
            ],
          },
        ],
      };

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await resp.json();
      console.log("Gemini Raw:", data);

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch)
        throw new Error("Could not find JSON object in AI response.");

      const cleaned = jsonMatch[0];
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        const attempt = cleaned
          .replace(/'\s*:\s*'/g, '": "')
          .replace(/([{\[,])\s*'([^']+?)'\s*(?=[:,\]}])/g, '$1"$2"')
          .replace(/,(\s*[}\]])/g, "$1");
        parsed = JSON.parse(attempt);
      }

      // Ensure basic structure
      parsed.name = parsed.name || "Untitled Startup";
      parsed.tagline = parsed.tagline || "Transforming ideas into reality";
      parsed.industry = parsed.industry || "Technology";

      setResult(parsed);

      // Generate landing page code
      const generatedCode = await generateLandingPageCode(parsed);
      setLandingCode(generatedCode);

      // Save to Supabase
      const { error } = await supabase.from("pitches").insert({
        user_id: user.id,
        title: parsed.name,
        short_description: parsed.tagline,
        industry: parsed.industry,
        tone: "auto",
        language: "auto",
        generated_data: parsed,
        landing_code: generatedCode,
      });

      if (error) throw error;

      // Success notification
      showNotification("✅ Pitch + Website Code Generated!", "success");
    } catch (err) {
      console.error(err);
      showNotification(
        "❌ " + (err.message || "Something went wrong"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateLandingPageCode(pitchData) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const websitePrompt = `Create a stunning, modern landing page HTML for: ${
        pitchData.name
      } - ${pitchData.tagline}

Details:
- Problem: ${pitchData.problem}
- Solution: ${pitchData.solution} 
- UVP: ${pitchData.unique_value_proposition}
- Colors: ${JSON.stringify(pitchData.colors)}
- Audience: ${pitchData.target_audience?.description}

Requirements:
- Use Tailwind CSS CDN
- Modern glass morphism design
- Fully responsive layout
- Smooth animations
- Professional startup aesthetic
- Include: Hero, Features, Testimonials, CTA, Footer
- Add interactive elements
- IMPORTANT: Do NOT use any external images (no Unsplash, no external URLs)
- Use CSS gradients, emoji icons, and solid colors for visual elements
- Use placeholder text for testimonials instead of external images
- Create visual appeal through typography, gradients, and geometric shapes

Return ONLY complete HTML code:`;

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: websitePrompt }] }],
          }),
        }
      );

      const data = await resp.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        generateFallbackTemplate(pitchData)
      );
    } catch (error) {
      return generateFallbackTemplate(pitchData);
    }
  }

  function generateFallbackTemplate(pitchData) {
    const colors = pitchData.colors || {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#06B6D4",
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pitchData.name} - ${pitchData.tagline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg { background: linear-gradient(135deg, ${
          colors.primary
        }20, ${colors.secondary}20); }
        .hero-gradient { background: linear-gradient(135deg, ${
          colors.primary
        }, ${colors.secondary}); }
    </style>
</head>
<body class="bg-white">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[${
                      colors.primary
                    }] to-[${
      colors.secondary
    }] rounded-lg flex items-center justify-center">
                        <img src={LogoIcon} alt="Pitch Crafter" className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <span class="text-xl font-bold text-gray-900">${
                      pitchData.name
                    }</span>
                </div>
                <button class="bg-[${
                  colors.primary
                }] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[${
      colors.secondary
    }] transition-colors">
                    Get Started
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-gradient text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-5xl font-bold mb-6">${
              pitchData.landing_copy?.headline || pitchData.name
            }</h1>
            <p class="text-xl opacity-90 mb-8 max-w-3xl mx-auto">${
              pitchData.landing_copy?.subheadline || pitchData.tagline
            }</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-white text-[${
                  colors.primary
                }] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                    ${
                      pitchData.landing_copy?.call_to_action ||
                      "Get Started Free"
                    }
                </button>
                <button class="border border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
                    Learn More
                </button>
            </div>
        </div>
    </section>

    <!-- Problem Section -->
    <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">The Problem We Solve</h2>
            <p class="text-lg text-gray-600 leading-relaxed">${
              pitchData.problem
            }</p>
        </div>
    </section>

    <!-- Solution Section -->
    <section class="py-20 gradient-bg">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Innovative Solution</h2>
            <p class="text-lg text-gray-600 leading-relaxed">${
              pitchData.solution
            }</p>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p class="text-gray-300 mb-8 text-lg">Join the future with ${
              pitchData.name
            }</p>
            <button class="bg-[${
              colors.accent
            }] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[${
      colors.primary
    }] transition-colors">
                Start Your Journey
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 ${pitchData.name}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  function showNotification(message, type) {
    const el = document.createElement("div");
    el.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold backdrop-blur-sm border animate-fade-in-right ${
      type === "success" ? "status-success" : "status-error"
    }`;
    el.innerHTML = `
      <div class="flex items-center">
        <span class="mr-3 text-lg">${type === "success" ? "✅" : "❌"}</span>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(100%)";
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }

  // ✅ COMPLETE PITCH DETAILS COMPONENT
  const RenderPitchDetails = ({ data }) => {
    if (!data) return null;

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Startup Header */}
        <motion.div
          className="card-glass p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-primary font-bold gradient-text mb-2 sm:mb-3">
                {data.name}
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 font-medium mb-3 sm:mb-4">
                {data.tagline}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-indicator bg-accent-100 text-accent-700 border-accent-200 text-xs sm:text-sm">
                🚀 Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-xs sm:text-sm">
              <span className="mr-1 sm:mr-2">🏢</span>
              {data.industry}
            </span>
            <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary-100 text-secondary-700 font-medium text-xs sm:text-sm">
              <span className="mr-1 sm:mr-2">🎯</span>
              {data.target_audience?.segments?.length || 0} Target Segments
            </span>
            <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent-100 text-accent-700 font-medium text-xs sm:text-sm">
              <span className="mr-1 sm:mr-2">💡</span>
              AI Generated
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Elevator Pitch */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="font-primary font-bold text-base sm:text-lg text-neutral-800">
                Elevator Pitch
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              {data.elevator_pitch}
            </p>
          </motion.div>

          {/* Unique Value Proposition */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-100 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                💎
              </div>
              <h3 className="font-primary font-bold text-base sm:text-lg text-neutral-800">
                Unique Value Proposition
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              {data.unique_value_proposition}
            </p>
          </motion.div>

          {/* Problem */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                🧩
              </div>
              <h3 className="font-primary font-bold text-base sm:text-lg text-neutral-800">
                The Problem
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              {data.problem}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 className="font-primary font-bold text-base sm:text-lg text-neutral-800">
                Our Solution
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              {data.solution}
            </p>
          </motion.div>
        </div>

        {/* Target Audience */}
        <motion.div
          className="card-glass p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-accent-50 to-primary-50 border-accent-200"
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg sm:text-xl font-primary font-bold text-accent-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">🎯</span>
            Target Audience
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 mb-3 sm:mb-4 font-medium">
            {data.target_audience?.description}
          </p>
          {data.target_audience?.segments && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {data.target_audience.segments.map((segment, idx) => (
                <span
                  key={idx}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-accent-700 border border-accent-200"
                >
                  {segment}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Landing Page Copy */}
        {data.landing_copy && (
          <motion.div
            className="card-glass p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-secondary-50 to-accent-50 border-secondary-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg sm:text-xl font-primary font-bold text-secondary-800 mb-4 sm:mb-6 flex items-center">
              <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">📝</span>
              Landing Page Copy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div>
                <h4 className="font-bold text-secondary-700 mb-2 flex items-center text-sm sm:text-base">
                  <span className="mr-1.5 sm:mr-2">🎯</span>
                  Headline
                </h4>
                <p className="text-sm sm:text-base text-neutral-700 font-medium bg-white/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-secondary-200 leading-relaxed">
                  {data.landing_copy.headline}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-secondary-700 mb-2 flex items-center text-sm sm:text-base">
                  <span className="mr-1.5 sm:mr-2">📢</span>
                  Subheadline
                </h4>
                <p className="text-sm sm:text-base text-neutral-700 font-medium bg-white/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-secondary-200 leading-relaxed">
                  {data.landing_copy.subheadline}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-secondary-700 mb-2 flex items-center text-sm sm:text-base">
                  <span className="mr-1.5 sm:mr-2">🚀</span>
                  Call to Action
                </h4>
                <p className="text-sm sm:text-base text-neutral-700 font-medium bg-white/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-secondary-200 leading-relaxed">
                  {data.landing_copy.call_to_action}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-secondary-700 mb-2 flex items-center text-sm sm:text-base">
                  <span className="mr-1.5 sm:mr-2">✨</span>
                  Key Features
                </h4>
                <div className="bg-white/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-secondary-200">
                  {data.landing_copy.key_features?.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 mb-2 last:mb-0"
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                      <span className="text-neutral-700 font-medium text-xs sm:text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Brand Colors & Logo Ideas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Brand Colors */}
          {data.colors && (
            <motion.div
              className="card-glass p-4 sm:p-5 lg:p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-base sm:text-lg font-primary font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">🎨</span>
                Brand Colors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(data.colors).map(([name, color]) => (
                  <div
                    key={name}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-neutral-700 capitalize truncate">
                        {name}
                      </p>
                      <p className="text-xs text-neutral-500 font-mono truncate">
                        {color}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Logo Ideas */}
          {data.logo_ideas && (
            <motion.div
              className="card-glass p-4 sm:p-5 lg:p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-base sm:text-lg font-primary font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">🎭</span>
                Logo Ideas
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {data.logo_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">
                      💡
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-neutral-700 leading-relaxed">
                      {idea}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // ✅ RENDER WEBSITE CODE COMPONENT
  const RenderWebsiteCode = ({ code }) => {
    if (!code) return null;

    return (
      <motion.div
        className="mt-6 card-glass overflow-hidden animate-fade-in-up"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Code Header */}
        <div className="flex mt-50 flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 lg:p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
            </div>
            <h3 className="font-primary font-bold text-sm sm:text-base text-neutral-800 flex items-center">
              <span className="mr-2 sm:mr-3 text-lg sm:text-xl">🌐</span>
              <span className="hidden sm:inline">
                Generated Landing Page Code
              </span>
              <span className="sm:hidden">Website Code</span>
            </h3>
          </div>
          <div className="flex mt-4 sm:mt-0 flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openPreview}
              className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span className="text-base sm:text-lg">👁️</span>
              <span className="hidden sm:inline">Preview Website</span>
              <span className="sm:hidden">Preview</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(code);
                showNotification("Code copied to clipboard!", "success");
              }}
              className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span className="text-base sm:text-lg">📋</span>
              <span className="hidden sm:inline">Copy Code</span>
              <span className="sm:hidden">Copy</span>
            </motion.button>
          </div>
        </div>

        {/* Code Display */}
        <div className="p-3 sm:p-4 lg:p-6 bg-neutral-900 max-h-64 sm:max-h-80 lg:max-h-96 overflow-auto">
          <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {code}
          </pre>
        </div>

        {/* Code Footer */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-t border-neutral-200">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-600 mb-2">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
              Ready to Deploy
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
              Responsive Design
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
              Modern Styling
            </span>
          </div>
          <p className="text-center text-neutral-600 font-medium text-xs sm:text-sm leading-relaxed">
            💡 <strong>Pro Tip:</strong>{" "}
            <span className="hidden sm:inline">
              Click "Preview Website" to see your landing page in action, or
              copy the code to deploy instantly!
            </span>
            <span className="sm:hidden">
              Preview or copy your code to deploy!
            </span>
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && landingCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="card-glass w-full max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white rounded-t-2xl">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 bg-red-400 rounded-full cursor-pointer hover:bg-red-500 transition-colors"
                      onClick={closePreview}
                    ></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <h3 className="font-primary font-bold text-lg text-neutral-800 flex items-center">
                    <span className="mr-3 text-xl">🌐</span>
                    Website Preview - {result?.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(landingCode);
                      showNotification("Code copied to clipboard!", "success");
                    }}
                    className="btn-secondary text-sm"
                  >
                    📋 Copy Code
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closePreview}
                    className="btn-primary text-sm"
                  >
                    ✕ Close
                  </motion.button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header with Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => onNavigate && onNavigate("my-pitches")}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <span className="text-lg">←</span>
              <span className="font-medium">Back to My Pitches</span>
            </button>

            {/* Step Indicators */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !result
                    ? "bg-primary-100 text-primary-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <span className="text-base">{!result ? "✏️" : "✅"}</span>
                <span className="hidden sm:inline">Describe Idea</span>
                <span className="sm:hidden">1</span>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  result && !landingCode
                    ? "bg-primary-100 text-primary-700"
                    : landingCode
                    ? "bg-green-100 text-green-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                <span className="text-base">
                  {landingCode ? "✅" : result ? "⚡" : "⏳"}
                </span>
                <span className="hidden sm:inline">Generate</span>
                <span className="sm:hidden">2</span>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  landingCode
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                <span className="text-base">{landingCode ? "🎯" : "⏳"}</span>
                <span className="hidden sm:inline">Review & Save</span>
                <span className="sm:hidden">3</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-8"
            >
              <img
                src={LogoIcon}
                alt="Pitch Crafter"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 sm:mb-6 px-4">
              Craft the Pitch Using AI
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Transform your startup idea into a complete business package with
              AI-powered pitch generation and professional website code.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="flex flex-col sm:flex-row sm:items-center text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs mb-2 sm:mb-0 sm:mr-2 w-fit">
                  STEP 1
                </span>
                <span>Describe Your Startup Vision</span>
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.005 }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="💡 Example: I want to build an AI-powered fitness app that creates personalized workout plans with real-time form correction using computer vision, targeting busy professionals who want effective home workouts..."
                className="w-full min-h-[150px] sm:min-h-[200px] p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none resize-none shadow-inner bg-white/50 backdrop-blur-sm text-gray-700 placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-white shadow-2xl transition-all duration-300 relative overflow-hidden text-sm sm:text-base ${
                loading
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="hidden sm:inline">
                    AI is crafting your startup...
                  </span>
                  <span className="sm:hidden">Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  <span className="hidden sm:inline">
                    Generate Complete Startup Package
                  </span>
                  <span className="sm:hidden">Generate Package</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mb-12"
            >
              {/* Enhanced Tabs */}
              <motion.div
                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6 sm:mb-8 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 w-full sm:w-fit mx-auto border border-white/30 shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  {
                    id: "pitch",
                    label: "📊 Pitch Details",
                    shortLabel: "📊 Pitch",
                    icon: "💼",
                  },
                  {
                    id: "website",
                    label: "🌐 Website Code",
                    shortLabel: "🌐 Code",
                    icon: "🚀",
                  },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "pitch" && (
                  <motion.div
                    key="pitch"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <RenderPitchDetails data={result} />
                  </motion.div>
                )}

                {activeTab === "website" && landingCode && (
                  <motion.div
                    key="website"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <RenderWebsiteCode code={landingCode} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
