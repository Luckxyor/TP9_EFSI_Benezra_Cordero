import './App.css'
import SearchBar from './components/SearchBar/SearchBar'
import UnitToggle from './components/UnitToggle/UnitToggle'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import CurrentWeather from './components/ClimaActual'
import Forecast from './components/Forecast/Forecast'
import HourlyForecast from './components/HourlyForecast/HourlyForecast'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <SearchBar />
        <div className="header-actions">
          <UnitToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className="app-main">
        <section className="hero-top">
          <CurrentWeather />
          <HourlyForecast />
        </section>
        <section>
          <Forecast />
        </section>
      </main>
      <footer className="app-footer">
        <span>Clima Granate</span>
      </footer>
    </div>
  )
}

export default App
