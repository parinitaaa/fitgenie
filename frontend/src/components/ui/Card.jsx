import { theme } from '../../styles/theme.js';

const Card = ({ 
  children, 
  padding = '16px',
  style = {},
  ...props 
}) => {
  const cardStyles = {
    backgroundColor: theme.surfaceColor,
    borderRadius: '12px',
    padding: padding,
    ...style,
  };

  return (
    <div style={cardStyles} {...props}>
      {children}
    </div>
  );
};

export default Card;
