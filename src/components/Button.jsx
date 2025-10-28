// Navigation Button Component
export const NavButton = ({ 
  children, 
  isActive, 
  onClick, 
  className = "", 
  variant = "default",
  disabled = false,
  ariaLabel,
  ariaPressed,
  onKeyDown,
  ...props 
}) => {
  const baseClasses = `
    relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-xl font-semibold text-sm sm:text-base
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white/50
    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:pointer-events-none
    overflow-hidden group cursor-pointer select-none
    min-h-[44px] flex items-center justify-center
    active:scale-95 active:transition-transform active:duration-150
  `;

  const variantClasses = {
    default: isActive
      ? `bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg scale-105
         hover:shadow-xl hover:scale-110 hover:from-primary-600 hover:to-secondary-600
         active:scale-100 active:shadow-md
         border border-primary-400/20`
      : `text-neutral-600 bg-white/70 backdrop-blur-sm border border-white/60
         hover:text-primary-600 hover:bg-white/90 hover:shadow-md hover:border-primary-200
         hover:scale-105 active:scale-95 active:bg-white/95`,

    danger: `text-neutral-500 bg-white/70 backdrop-blur-sm border border-white/60
             hover:text-red-500 hover:bg-red-50/90 hover:shadow-md hover:border-red-200
             hover:scale-105 active:scale-95 active:bg-red-100/90`,

    mobile: `p-2 min-h-[44px] w-[44px] bg-white/70 backdrop-blur-sm border border-white/60
             hover:bg-neutral-100/90 hover:scale-105 hover:shadow-md
             active:scale-95 active:bg-neutral-200/90`,
  };

  const glowEffect = isActive
    ? `
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-400 before:to-secondary-400 
    before:opacity-20 before:blur-xl before:scale-110 before:transition-all before:duration-300
    hover:before:opacity-30 hover:before:scale-125
  `
    : "";

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} ${variantClasses[variant]} ${glowEffect} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span className={`relative z-10 flex items-center justify-center gap-1 sm:gap-2 ${isActive ? 'text-black !important' : ''}`}>
        {children}
      </span>

      {/* Ripple effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-700 ease-out"
        ></div>
      </div>
    </button>
  );
};

// Primary Button Component
export const PrimaryButton = ({ children, onClick, disabled = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-4 font-semibold rounded-xl
        transition-all duration-300 ease-in-out transform
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-xl active:scale-95'
        }
        ${className}
      `}
      style={{
        background: disabled 
          ? 'var(--dark-gradient-secondary)' 
          : 'var(--dark-button-primary-bg)',
        color: disabled 
          ? 'var(--dark-text-disabled)' 
          : 'var(--dark-text-primary)',
        border: `1px solid ${disabled ? 'var(--dark-border-tertiary)' : 'var(--dark-border-primary)'}`,
        boxShadow: disabled ? 'none' : 'var(--dark-shadow-md)'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.background = 'var(--dark-button-primary-hover)';
          e.target.style.borderColor = 'var(--dark-border-hover)';
          e.target.style.boxShadow = 'var(--dark-shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.background = 'var(--dark-button-primary-bg)';
          e.target.style.borderColor = 'var(--dark-border-primary)';
          e.target.style.boxShadow = 'var(--dark-shadow-md)';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.target.style.background = 'var(--dark-button-primary-active)';
          e.target.style.boxShadow = 'var(--dark-shadow-sm)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.target.style.background = 'var(--dark-button-primary-hover)';
          e.target.style.boxShadow = 'var(--dark-shadow-lg)';
        }
      }}
    >
      {children}
    </button>
  );
};



// LinkButton - For text-based buttons
export const LinkButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        underline underline-offset-4
        transition-colors duration-200 ease-in-out
        ${className}
      `}
      style={{
        color: 'var(--dark-text-secondary)'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = 'var(--dark-text-primary)';
      }}
      onMouseLeave={(e) => {
        e.target.style.color = 'var(--dark-text-secondary)';
      }}
    >
      {children}
    </button>
  );
};

// MobileMenuButton - Specialized for mobile navigation toggle
export const MobileMenuButton = ({ isOpen, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        md:hidden p-2 rounded-lg
        transition-all duration-200 ease-in-out
        ${className}
      `}
      style={{
        color: 'var(--dark-text-secondary)',
        background: 'transparent'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = 'var(--dark-text-primary)';
        e.target.style.background = 'var(--dark-button-ghost-hover)';
      }}
      onMouseLeave={(e) => {
        e.target.style.color = 'var(--dark-text-secondary)';
        e.target.style.background = 'transparent';
      }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span 
          className={`block w-5 h-0.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}
          style={{ backgroundColor: 'currentColor' }}
        />
        <span 
          className={`block w-5 h-0.5 transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}
          style={{ backgroundColor: 'currentColor' }}
        />
        <span 
          className={`block w-5 h-0.5 transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}
          style={{ backgroundColor: 'currentColor' }}
        />
      </div>
    </button>
  );
};

// MobileNavItem - For mobile navigation menu items
export const MobileNavItem = ({ 
  children, 
  onClick, 
  onKeyDown,
  active = false, 
  className = "",
  ariaLabel,
  ariaPressed,
  style = {},
  ...props 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        w-full p-3 rounded-lg text-left
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        min-h-[60px] flex items-center
        ${active ? 'scale-[0.98]' : 'hover:scale-[1.02]'}
        ${className}
      `}
      style={{
        background: active 
          ? 'var(--dark-button-primary-bg)' 
          : 'var(--dark-glass-subtle)',
        color: active 
          ? 'var(--dark-text-primary)' 
          : 'var(--dark-text-secondary)',
        border: `1px solid ${active ? 'var(--dark-border-primary)' : 'var(--dark-border-subtle)'}`,
        boxShadow: active 
          ? 'var(--dark-shadow-md)' 
          : 'var(--dark-shadow-sm)',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.background = 'var(--dark-button-ghost-hover)';
          e.target.style.borderColor = 'var(--dark-border-primary)';
          e.target.style.color = 'var(--dark-text-primary)';
          e.target.style.boxShadow = 'var(--dark-shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.background = 'var(--dark-glass-subtle)';
          e.target.style.borderColor = 'var(--dark-border-subtle)';
          e.target.style.color = 'var(--dark-text-secondary)';
          e.target.style.boxShadow = 'var(--dark-shadow-sm)';
        }
      }}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
    </button>
  );
};

export default {
  NavButton,
  PrimaryButton,
  LinkButton,
  MobileMenuButton,
  MobileNavItem,
};
