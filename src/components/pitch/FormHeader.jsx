import React from 'react';
import LogoIcon from "../../assets/logo.svg";
import { LinkButton } from "../ui/Button";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";

export default function FormHeader() {
  const { user } = useAuthStore();
  const { setCurrentView } = useUIStore();

  if (!user) return null;

  return (
    <header className="flex justify-between items-center mb-8 sm:mb-12 animate-fade-in-down">
      <div className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer" onClick={() => setCurrentView('landing')}>
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          <div className="absolute inset-0 bg-(--gradient-primary) rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <div
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}
            className="relative w-full h-full rounded-xl flex items-center justify-center shadow-xl"
          >
            <img src={LogoIcon} alt="PitchCraft" className="w-6 h-6 sm:w-8 sm:h-8 transform group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold font-primary tracking-tight">
            <span style={{
              background: 'var(--gradient-primary-bold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Pitch</span>
            <span style={{ color: 'var(--text-primary)' }}>Craft</span>
          </h1>
          <span className="text-xs sm:text-sm font-medium tracking-wide" style={{ color: 'var(--text-tertiary)' }}>AI-Powered Startup Builder</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <LinkButton onClick={() => setCurrentView('my-pitches')} className="hidden sm:flex text-sm font-medium hover:text-(--accent-primary) transition-colors">
          <span className="mr-2">📂</span> History
        </LinkButton>
        <div className="h-8 w-px bg-(--border-primary) hidden sm:block"></div>
        <div className="flex items-center space-x-3 bg-(--bg-secondary) px-3 py-1.5 rounded-full border border-(--border-secondary)">
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
            {user.email[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:block pr-1" style={{ color: 'var(--text-secondary)' }}>{user.email.split('@')[0]}</span>
        </div>
      </div>
    </header>
  );
}
