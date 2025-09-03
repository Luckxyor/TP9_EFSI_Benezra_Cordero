import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './ClimaActual.css'

function formatearTemperatura(valor, simbolo) {
  if (valor == null) return '-'
  return `${Math.round(valor)}${simbolo}`
}

export default function ClimaActual() {
  const { current, location, isLoading, error } = useWeather()
  const { temperatureSymbol, speedSymbol } = useUnit()

  if (isLoading && !current) {
    return <div className="clima-actual panel">Cargando...</div>
  }

  if (error && !current) {
    return <div className="clima-actual panel">{error}</div>
  }

  if (!current) {
    return <div className="clima-actual panel">Sin datos</div>
  }

  const temperatura = current.main.temp
  const sensacionTermica = current.main.feels_like
  const humedad = current.main.humidity
  const viento = current.wind.speed
  const descripcion = current.weather[0].description
  const icono = current.weather[0].icon

  let ubicacionCompleta = location.name
  if (location.country) {
    ubicacionCompleta = ubicacionCompleta + ', ' + location.country
  }

  return (
    <div className="clima-actual panel">
      <div className="clima-actual-encabezado">
        <div className="clima-actual-ubicacion">{ubicacionCompleta}</div>
        <div className="clima-actual-descripcion">{descripcion}</div>
      </div>
      <div className="clima-actual-cuerpo">
        <div className="clima-actual-bloqueTemperatura">
          <img
            className="clima-actual-icono"
            src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
            alt={descripcion}
          />
          <div className="clima-actual-temperatura">{formatearTemperatura(temperatura, temperatureSymbol)}</div>
        </div>
        <div className="clima-actual-estadisticas">
          <div className="estadistica"><span>Humedad</span><strong>{humedad}%</strong></div>
          <div className="estadistica"><span>Viento</span><strong>{Math.round(viento)} {speedSymbol}</strong></div>
          <div className="estadistica"><span>Sensación</span><strong>{formatearTemperatura(sensacionTermica, temperatureSymbol)}</strong></div>
        </div>
      </div>
    </div>
  )
}


