import { theme } from '../../styles/theme.js';

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.accentColor,
      color: theme.backgroundColor,
    },
    secondary: {
      backgroundColor: theme.surfaceColor,
      color: theme.primaryTextColor,
      border: `1px solid ${theme.borderColor}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.primaryTextColor,
    },
  };

  const hoverStyles = !disabled && {
    primary: {
      filter: 'brightness(1.1)',
    },
    secondary: {
      backgroundColor: theme.backgroundColor,
    },
    ghost: {
      backgroundColor: theme.surfaceColor,
    },
  };

  const activeStyles = !disabled && {
    primary: {
      filter: 'brightness(0.9)',
    },
    secondary: {
      backgroundColor: theme.backgroundColor,
    },
    ghost: {
      backgroundColor: theme.backgroundColor,
    },
  };

  const handleMouseEnter = (e) => {
    if (!disabled && hoverStyles[variant]) {
      Object.assign(e.target.style, hoverStyles[variant]);
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      Object.assign(e.target.style, variantStyles[variant]);
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled && activeStyles[variant]) {
      Object.assign(e.target.style, activeStyles[variant]);
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && hoverStyles[variant]) {
      Object.assign(e.target.style, hoverStyles[variant]);
    }
  };

  return (
    <button
      type={type}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
