import { useMemo } from 'react'
import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './Pronostico.css'

function obtenerFechaString(fecha) {
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${año}-${mes}-${dia}`
}

function agruparPorDias(lista) {
  const hoyString = obtenerFechaString(new Date())
  const diasAgrupados = {}

  for (const clima of lista) {
    const fechaDelClima = new Date(clima.dt * 1000)
    const fechaString = obtenerFechaString(fechaDelClima)
    
    if (fechaString !== hoyString) {
      if (!diasAgrupados[fechaString]) {
        diasAgrupados[fechaString] = []
      }
      diasAgrupados[fechaString].push(clima)
    }
  }

  const diasOrdenados = Object.keys(diasAgrupados).sort()
  return diasOrdenados.slice(0, 5).map((fecha) => [fecha, diasAgrupados[fecha]])
}

export default function Pronostico() {
  const { forecast, isLoading } = useWeather()
  const { temperatureSymbol } = useUnit()

  const diasDelPronostico = useMemo(() => {
    if (!forecast || !forecast.list || !forecast.list.length) return []
    return agruparPorDias(forecast.list)
  }, [forecast])

  if (isLoading && !forecast) {
    return <div className="panel">Cargando pronóstico...</div>
  }
  
  if (!forecast) return null

  return (
    <div className="pronostico">
      <div className="pronostico-grid">
        {diasDelPronostico.map(([fechaString, datosDelDia]) => {
          let tempMinima = datosDelDia[0].main.temp_min
          let tempMaxima = datosDelDia[0].main.temp_max
          
          for (let i = 0; i < datosDelDia.length; i++) {
            if (datosDelDia[i].main.temp_min < tempMinima) {
              tempMinima = datosDelDia[i].main.temp_min
            }
            if (datosDelDia[i].main.temp_max > tempMaxima) {
              tempMaxima = datosDelDia[i].main.temp_max
            }
          }
          
          const mitadDelDia = Math.floor(datosDelDia.length / 2)
          const climaMitad = datosDelDia[mitadDelDia]
          const iconoDelDia = climaMitad.weather[0].icon
          
          const [año, mes, dia] = fechaString.split('-').map(Number)
          const fechaParaMostrar = new Date(año, mes - 1, dia)
          const nombreDelDia = fechaParaMostrar.toLocaleDateString('es', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
          })
          
          return (
            <div key={fechaString} className="pronostico-card">
              <div className="pronostico-day">{nombreDelDia}</div>
              <img
                className="pronostico-icon"
                src={`https://openweathermap.org/img/wn/${iconoDelDia}@2x.png`}
                alt="icono del clima"
              />
              <div className="pronostico-temps">
                <span>{Math.round(tempMaxima)}{temperatureSymbol}</span>
                <span className="temp-baja">{Math.round(tempMinima)}{temperatureSymbol}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


