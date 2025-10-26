// NavButton - Based on fuzzy-bullfrog-72 design pattern
export const NavButton = ({
  children,
  onClick,
  onKeyDown,
  className = "",
  active = false,
  variant = "default",
  disabled = false,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
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
    default: active
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

  const glowEffect = active
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
      <span className={`relative z-10 flex items-center justify-center gap-1 sm:gap-2 ${active ? 'text-black' : ''}`}style={active ? { color: '#000000 !important' } : {}}>
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

// PrimaryButton - Based on stale-baboon-45 design pattern
export const PrimaryButton = ({
  children,
  onClick,
  onKeyDown,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px]",
    lg: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg min-h-[48px]",
    xl: "px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl min-h-[52px]",
  };

  const baseClasses = `
    relative font-semibold rounded-xl transition-all duration-300 ease-in-out
    transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:pointer-events-none
    overflow-hidden group active:scale-95 cursor-pointer select-none
    flex items-center justify-center
    ${sizeClasses[size]}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-secondary-500 text-white
      hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl hover:scale-105
      focus:ring-primary-500 shadow-lg border border-primary-400/20
      active:shadow-md active:scale-95
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,

    secondary: `
      bg-white text-primary-600 border-2 border-primary-500 shadow-md
      hover:bg-primary-50 hover:border-primary-600 hover:shadow-lg hover:scale-105
      focus:ring-primary-500 active:bg-primary-100 active:scale-95
    `,

    outline: `
      border-2 border-white text-white bg-transparent shadow-md
      hover:bg-white/10 hover:shadow-lg hover:scale-105 hover:border-white/90
      focus:ring-white/50 active:bg-white/20 active:scale-95
    `,

    ghost: `
      text-primary-600 bg-transparent
      hover:bg-primary-50 hover:text-primary-700 hover:scale-105
      focus:ring-primary-500 active:bg-primary-100 active:scale-95
    `,

    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105
      focus:ring-red-500 shadow-lg border border-red-400/20
      active:shadow-md active:scale-95
    `,
  };

  const pulseEffect = loading ? "animate-pulse" : "";

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} ${variantClasses[variant]} ${pulseEffect} ${className}`}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
        )}
        {children}
      </span>

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out"
        ></div>
      </div>
    </button>
  );
};



// LinkButton - For text-based buttons
export const LinkButton = ({
  children,
  onClick,
  onKeyDown,
  className = "",
  variant = "primary",
  disabled = false,
  "aria-label": ariaLabel,
  ...props
}) => {
  const variantClasses = {
    primary: "text-primary-600 hover:text-primary-700 focus:text-primary-800",
    secondary: "text-neutral-600 hover:text-neutral-800 focus:text-neutral-900",
    danger: "text-red-600 hover:text-red-700 focus:text-red-800",
  };

  const baseClasses = `
    font-semibold transition-all duration-200 ease-in-out inline-flex items-center gap-1
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current focus:rounded-sm
    focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    hover:scale-105 active:scale-95 cursor-pointer select-none min-h-[24px] py-1 px-1
    relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
    after:bg-current after:transition-all after:duration-300
    hover:after:w-full focus:after:w-full
  `;

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
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  );
};

// MobileMenuButton - Specialized for mobile navigation
export const MobileMenuButton = ({
  children,
  onClick,
  onKeyDown,
  className = "",
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  ...props
}) => {
  const baseClasses = `
    w-full text-left px-3 py-3 sm:px-4 sm:py-3 rounded-xl text-base font-medium 
    transition-all duration-300 flex items-center min-h-[56px]
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    hover:scale-105 active:scale-95 group cursor-pointer select-none
    border border-transparent
  `;

  const stateClasses = active
    ? `bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg border-primary-400/20
       hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl`
    : `text-neutral-700 bg-white/70 backdrop-blur-sm border-white/60
       hover:bg-neutral-100/90 hover:text-primary-600 hover:shadow-md hover:border-primary-200`;

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
      className={`${baseClasses} ${stateClasses} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span className={`relative z-10 flex items-center w-full gap-2 sm:gap-3 ${active ? 'text-black' : ''}`}style={active ? { color: '#000000 !important' } : {}}>{children}</span>

      {/* Subtle glow for active state */}
      {active && (
        <div
          className="absolute inset-0 bg-linear-to-r from-primary-400 to-secondary-400 
                        opacity-20 blur-sm scale-105 transition-all duration-300 
                        group-hover:opacity-30 group-hover:scale-110 pointer-events-none"
        ></div>
      )}

      {/* Ripple effect for inactive state */}
      {!active && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-primary-100/50 to-transparent 
                          transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                          transition-transform duration-700 ease-out"
          ></div>
        </div>
      )}
    </button>
  );
};

export default {
  NavButton,
  PrimaryButton,
  LinkButton,
  MobileMenuButton,
};
