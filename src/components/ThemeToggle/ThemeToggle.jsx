import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button className="themeToggle" onClick={toggleTheme} title="Cambiar tema">
      <span className="themeToggle-thumb" data-mode={theme}>{theme === 'light' ? '🌞' : '🌙'}</span>
    </button>
  )
}


