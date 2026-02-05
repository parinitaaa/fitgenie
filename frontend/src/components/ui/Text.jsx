import { theme } from '../../styles/theme.js';

const Text = ({ 
  children, 
  variant = 'body', 
  color = 'primary',
  style = {},
  as = 'p',
  ...props 
}) => {
  const variantStyles = {
    heading: {
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '1.2',
    },
    subheading: {
      fontSize: '20px',
      fontWeight: '500',
      lineHeight: '1.4',
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    caption: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.4',
    },
  };

  const colorStyles = {
    primary: theme.primaryTextColor,
    secondary: theme.secondaryTextColor,
  };

  const textStyles = {
    fontFamily: 'Inter, sans-serif',
    color: colorStyles[color],
    margin: 0,
    ...variantStyles[variant],
    ...style,
  };

  const Component = as;

  return (
    <Component style={textStyles} {...props}>
      {children}
    </Component>
  );
};

export default Text;
