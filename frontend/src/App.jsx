import { useState } from 'react'
import AppLayout from './components/AppLayout'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppLayout>
      <div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

export default App
