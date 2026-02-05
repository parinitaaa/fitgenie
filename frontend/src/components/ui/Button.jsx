import './Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick,
  type = 'button',
  ...props 
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
