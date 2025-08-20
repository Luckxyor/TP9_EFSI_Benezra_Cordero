import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './CurrentWeather.css'

function formatTemp(value, symbol) {
  if (value == null) return '-'
  return `${Math.round(value)}${symbol}`
}

export default function CurrentWeather() {
  const { current, location, isLoading, error } = useWeather()
  const { temperatureSymbol, speedSymbol } = useUnit()

  if (isLoading && !current) {
    return <div className="current panel">Cargando...</div>
  }

  if (error && !current) {
    return <div className="current panel">{error}</div>
  }

  if (!current) {
    return <div className="current panel">Sin datos</div>
  }

  const temp = current.main?.temp
  const feels = current.main?.feels_like
  const humidity = current.main?.humidity
  const wind = current.wind?.speed
  const description = current.weather?.[0]?.description
  const icon = current.weather?.[0]?.icon

  return (
    <div className="current panel">
      <div className="current-header">
        <div className="current-location">{location?.name}{location?.country ? `, ${location.country}` : ''}</div>
        <div className="current-description">{description}</div>
      </div>
      <div className="current-body">
        <div className="current-tempBlock">
          <img
            className="current-icon"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description || 'icono'}
          />
          <div className="current-temp">{formatTemp(temp, temperatureSymbol)}</div>
        </div>
        <div className="current-stats">
          <div className="stat"><span>Humedad</span><strong>{humidity}%</strong></div>
          <div className="stat"><span>Viento</span><strong>{Math.round(wind)} {speedSymbol}</strong></div>
          <div className="stat"><span>Sensación</span><strong>{formatTemp(feels, temperatureSymbol)}</strong></div>
        </div>
      </div>
    </div>
  )
}


