import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TripProvider } from './store/TripContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TripProvider>
      <App />
    </TripProvider>
  </StrictMode>,
)
