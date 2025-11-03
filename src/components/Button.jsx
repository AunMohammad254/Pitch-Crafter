/**
 * Enhanced Navigation Button Component
 * 
 * Features:
 * - Smooth scale transformations (1.05x to 1.1x) on hover with 300ms ease-in-out transitions
 * - Vibrant active button styling with glow effects and WCAG AA compliant contrast
 * - Theme-appropriate inactive styling with 30-40% opacity reduction
 * - Performance-optimized CSS transforms for responsive behavior
 * - Maintains original position during scaling to prevent layout shifts
 */
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
    transition-all duration-300 ease-in-out transform-gpu
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white/50
    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:pointer-events-none
    overflow-hidden group cursor-pointer select-none
    min-h-[44px] flex items-center justify-center
    active:scale-95 active:transition-transform active:duration-150
    will-change-transform origin-center
  `;

  const variantClasses = {
    default: isActive
      ? `bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 
         text-white font-bold shadow-2xl scale-105
         hover:shadow-[0_20px_40px_rgba(59,130,246,0.4)] hover:scale-110 
         hover:from-primary-600 hover:via-primary-700 hover:to-secondary-600
         active:scale-100 active:shadow-lg
         border border-primary-400/30 backdrop-blur-sm
         ring-2 ring-primary-300/50 ring-offset-2 ring-offset-white/10`
      : `text-neutral-500 bg-white/50 backdrop-blur-sm border border-white/40
         opacity-70 hover:opacity-100
         hover:text-primary-700 hover:bg-white/80 hover:shadow-lg hover:border-primary-300/60
         hover:scale-108 active:scale-95 active:bg-white/90
         transition-opacity duration-300`,

    danger: `text-neutral-400 bg-white/50 backdrop-blur-sm border border-white/40
             opacity-70 hover:opacity-100
             hover:text-red-600 hover:bg-red-50/80 hover:shadow-lg hover:border-red-300/60
             hover:scale-108 active:scale-95 active:bg-red-100/80
             transition-opacity duration-300`,

    mobile: `p-2 min-h-[44px] w-[44px] bg-white/50 backdrop-blur-sm border border-white/40
             opacity-70 hover:opacity-100
             hover:bg-neutral-100/80 hover:scale-108 hover:shadow-md
             active:scale-95 active:bg-neutral-200/80
             transition-opacity duration-300`,
  };

  const glowEffect = isActive
    ? `
    before:absolute before:inset-0 before:bg-gradient-to-r 
    before:from-primary-400/30 before:via-primary-500/40 before:to-secondary-400/30 
    before:opacity-60 before:blur-2xl before:scale-110 before:transition-all before:duration-300
    hover:before:opacity-80 hover:before:scale-125 hover:before:blur-3xl
    after:absolute after:inset-0 after:bg-gradient-to-r 
    after:from-primary-300/20 after:to-secondary-300/20 
    after:opacity-0 after:blur-xl after:scale-105 after:transition-all after:duration-300
    hover:after:opacity-100 hover:after:scale-115
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
      style={{
        // Ensure smooth scaling without layout shifts
        transformOrigin: 'center',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
      }}
      {...props}
    >
      <span className={`relative z-20 flex items-center justify-center gap-1 sm:gap-2 ${
        isActive 
          ? 'text-white font-bold drop-shadow-sm' 
          : 'text-current font-medium'
      }`}>
        {children}
      </span>

      {/* Enhanced ripple effect overlay with improved performance */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-700 ease-out will-change-transform"
        ></div>
      </div>

      {/* Additional glow layer for active buttons */}
      {isActive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-primary-500/20 to-secondary-400/10 
                         blur-xl scale-150 animate-pulse"></div>
        </div>
      )}
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

  // Remove active from props to prevent it from being passed to DOM
  const { active: _, ...domProps } = { active, ...props };

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
      {...domProps}
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
