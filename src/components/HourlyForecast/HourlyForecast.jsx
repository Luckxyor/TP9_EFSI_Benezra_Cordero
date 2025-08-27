import { useMemo } from 'react'
import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './HourlyForecast.css'

export default function HourlyForecast() {
  const { forecast, isLoading } = useWeather()
  const { temperatureSymbol } = useUnit()

  const hours = useMemo(() => {
    if (!forecast?.list?.length) return []
    // Próximas ~24h (8 slots de 3h)
    return forecast.list.slice(0, 8)
  }, [forecast])

  if (isLoading && !forecast) return <div className="hourly panel">Cargando horario...</div>
  if (!forecast) return <div className="hourly panel">Sin pronóstico horario</div>

  return (
    <div className="hourly panel">
      <div className="hourly-header">Hoy por hora</div>
      <div className="hourly-scroller">
        {hours.map((item) => {
          const date = new Date(item.dt * 1000)
          const label = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
          const icon = item.weather?.[0]?.icon
          const temp = Math.round(item.main?.temp)
          const pop = Math.round((item.pop || 0) * 100)
          return (
            <div key={item.dt} className="hourly-cell">
              <div className="hourly-time">{label}</div>
              <img
                className="hourly-icon"
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={item.weather?.[0]?.description || 'icono'}
              />
              <div className="hourly-temp">{temp}{temperatureSymbol}</div>
              <div className="hourly-pop" title="Prob. precipitación">{pop}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


