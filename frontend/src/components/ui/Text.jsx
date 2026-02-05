import './Text.css'

function Text({ 
  children, 
  variant = 'body', 
  color = 'primary',
  as: Component = 'p',
  className = '',
  ...props 
}) {
  return (
    <Component 
      className={`text text-${variant} text-color-${color} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Text
