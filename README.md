# 🚀 PitchCraft AI

<div align="center">
  <img src="src/assets/logo.svg" alt="PitchCraft AI Logo" width="120" height="120">
  
  **Transform your startup ideas into compelling pitches and practice your delivery with interactive AI simulators**
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
</div>

---

## 📖 About

**PitchCraft AI** is an innovative, high-fidelity web application that transforms your raw startup ideas into complete, developer-ready launch packages. PitchCraft doesn't just generate your business plan, tagline, and code—it gives you the ultimate sandbox to **practice your elevator pitch** and **interact with ruthless VC investors** using state-of-the-art conversational AI simulators.

---

## 🥋 The Interactive Simulators

### 1. Pitch Practice Dojo (Voice & Type Arena)
The **Dojo** is a specialized environment to practice delivering your startup elevator pitch:
- **🎙️ Unified Input Workspace**: Speak, dictate, or type your pitch. The Speech-to-Text engine streams live transcriptions directly into a standard text editor. Correct speech recognition errors or copy-paste prepared scripts seamlessly.
- **⏱️ Real-time Metrics**: Tracks live word count and estimates speaking duration based on average pacing (~140 WPM). Automatically rates your pitch length (Too Short, Perfect, Too Long) to help keep your delivery under the critical 60-second limit.
- **💡 Script Template Loader**: Click a button to instantly pre-populate the workspace with your generated elevator pitch to read along or edit.
- **📊 Public Speaking Coach Review**: Gemini AI evaluates your pitch delivery and provides structured feedback:
  - Overall Dojo Score (0–100)
  - Pacing Analysis (e.g., Fast, Slow, Good)
  - Clarity assessment
  - Positive highlights and specific areas for improvement
  - List of missing key points compared to the original elevator pitch draft

### 2. Shark Tank VC Simulator
Step into the tank and pitch your idea to **Marcus**, a tough, skeptical venture capitalist:
- **💬 Adversarial Chat Interface**: Practice defending your startup idea in a dynamic conversation.
- **🧠 Aggressive VC Agent**: The AI VCs won't just support you—they will grill you, finding holes in your business model, customer acquisition costs (CAC), lifetime value (LTV), market size, and competitor landscape.
- **🎯 Short & Direct Prompts**: VCs keep responses conversational, direct, and under 3 sentences, ending with a challenging follow-up question.

---

## 🌟 Key Features

### 🎯 **Intelligent Pitch Generation**
- **Elevator Pitch Creation**: Concise, compelling summaries of your startup vision.
- **Problem-Solution Mapping**: Articulates customer pain points and your unique software solution.
- **Target Audience Identification**: Visualizes customer segments, descriptions, and market sizing.
- **Branding & Theme Engine**: Curates color schemes (primary, secondary, accent, neutral) with matching hex codes and lists modern logo design ideas.

### 💻 **Website Code Generation & Live Sandbox**
- **Responsive Layouts**: Generates modern mobile-first web designs using Tailwind CSS.
- **Safe Rendering Sandbox**: Render generated static HTML safely without React-style JSX clashes.
- **Image placeholders**: Avoids broken link rendering by using inline SVG elements and rich layouts.

---

## 🛠️ Technology Stack

<<<<<<< HEAD
| Category       | Technology                 | Purpose                                          |
| -------------- | -------------------------- | ------------------------------------------------ |
| **Runtime**    | Bun                        | Package manager and JavaScript runtime           |
| **Frontend**   | React 19.1.1               | High-performance modern UI component framework   |
| **Build Tool** | Vite 7.1.7                 | Lightning-fast HMR and build pipelines           |
| **Styling**    | Tailwind CSS 4.1.14        | Responsive design and customizable utilities     |
| **Animations** | Framer Motion 12.23.24     | Micro-interactions and fluid screen transitions  |
| **Backend**    | Supabase                   | User authentication, secure database, and API proxy|
| **AI Engine**  | Google Gemini 2.5 Flash    | Advanced AI model for generation and evaluation |
=======
| Category       | Technology              | Purpose                                          |
| -------------- | ----------------------- | ------------------------------------------------ |
| **Frontend**   | React 19.1.1            | Modern UI framework with latest features         |
| **Build Tool** | Vite 7.1.7              | Lightning-fast development and building          |
| **Styling**    | Tailwind CSS 4.1.14     | Utility-first CSS framework                      |
| **Animations** | Framer Motion 12.23.24  | Smooth, professional animations                  |
| **Backend**    | Supabase                | Authentication, database, and real-time features |
| **AI Engine**  | Google Gemini 2.5 Flash | Advanced language model for content generation   |
| **Deployment** | Vercel Ready    | Optimized for modern hosting platforms           |
>>>>>>> 7a70f3d19a10e26fb76bd1e100adf452e35b7960

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** or **Bun** installed
- **Supabase Account** (with database schema)
- **Google AI Studio API Key** (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AunMohammad254/Pitch-Crafter.git
   cd Pitch-Crafter/frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google Gemini API (Direct fallback key)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

   *Tip:* Set up Site URLs in your Supabase Auth dashboard as `http://localhost:5173` to prevent redirection issues.

4. **Start local development**
   ```bash
   bun run dev
   ```
   Navigate to `http://localhost:5173` to experience PitchCraft.

---

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── auth/            # Sign In / Sign Up & Password Updates
│   ├── layout/          # Navigation and general layout
│   ├── pitch/           # Pitch Form & Saved Pitch Dashboard
│   ├── simulator/       # AI Simulators (Dojo & Shark Tank VCs)
│   │   ├── InvestorChat.jsx      # Shark Tank VC Chat Simulator
│   │   ├── PitchPractice.jsx     # Main Pitch Practice Dojo Router
│   │   ├── PracticeSession.jsx   # Voice/Type Arena editor & mic inputs
│   │   ├── PracticeResults.jsx   # Public Speaking Coach Scorecards
│   │   └── PracticeHistory.jsx   # Saved past practice runs
│   └── ui/              # Global UI elements
├── hooks/               # Custom React hooks (usePracticeSession, etc.)
├── utils/               # Prompts, API Managers, and error handlers
├── App.jsx              # Main view state router
└── main.jsx             # React DOM entrypoint
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google DeepMind** for the powerful Gemini API.
- **Supabase** for user database tables and proxy middleware.
- **Tailwind CSS & Framer Motion** for beautiful layout aesthetics.

---

<div align="center">
  <p><strong>Developed with ❤️ by Aun Abbas</strong></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
