import { useMemo } from 'react'
import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './Forecast.css'

function groupByDay(list) {
  const byDay = {}
  list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const key = date.toISOString().slice(0, 10)
    if (!byDay[key]) byDay[key] = []
    byDay[key].push(item)
  })
  return Object.entries(byDay).slice(0, 5)
}

export default function Forecast() {
  const { forecast, isLoading } = useWeather()
  const { temperatureSymbol } = useUnit()

  const days = useMemo(() => {
    if (!forecast?.list?.length) return []
    return groupByDay(forecast.list)
  }, [forecast])

  if (isLoading && !forecast) return <div className="panel">Cargando pronóstico...</div>
  if (!forecast) return null

  return (
    <div className="forecast">
      <div className="forecast-grid">
        {days.map(([day, items]) => {
          const min = Math.min(...items.map((i) => i.main.temp_min))
          const max = Math.max(...items.map((i) => i.main.temp_max))
          const icon = items[Math.floor(items.length / 2)]?.weather?.[0]?.icon
          const label = new Date(day).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
          return (
            <div key={day} className="forecast-card">
              <div className="forecast-day">{label}</div>
              <img className="forecast-icon" src={`https://openweathermap.org/img/wn/${icon}.png`} />
              <div className="forecast-temps">
                <span>{Math.round(max)}{temperatureSymbol}</span>
                <span className="muted">{Math.round(min)}{temperatureSymbol}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


