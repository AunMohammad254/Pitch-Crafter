import React from 'react';
import LogoIcon from "../../assets/logo-icon.svg";

export default function BrandPanel({ isVisible }) {
  return (
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
}
