import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UnitProvider } from './context/UnitContext'
import { ThemeProvider } from './context/ThemeContext'
import { WeatherProvider } from './context/WeatherContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UnitProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </UnitProvider>
    </ThemeProvider>
  </StrictMode>,
)
