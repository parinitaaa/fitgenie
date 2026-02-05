import './Card.css'

function Card({ children, padding = true, className = '', ...props }) {
  return (
    <div 
      className={`card ${padding ? 'card-padded' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
