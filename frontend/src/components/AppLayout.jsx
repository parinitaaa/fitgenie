import './AppLayout.css'

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <div className="app-layout-content">
        {children}
      </div>
    </div>
  )
}

export default AppLayout
