import { useMemo } from 'react'
import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './Forecast.css'

function toLocalDayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function groupByDayStartingTomorrow(list) {
  const todayKey = toLocalDayKey(new Date())
  const byDay = {}

  for (const item of list) {
    const localDate = new Date(item.dt * 1000)
    const key = toLocalDayKey(localDate)
    if (key === todayKey) continue
    if (!byDay[key]) byDay[key] = []
    byDay[key].push(item)
  }

  const sortedKeys = Object.keys(byDay).sort()
  return sortedKeys.slice(0, 5).map((key) => [key, byDay[key]])
}

export default function Forecast() {
  const { forecast, isLoading } = useWeather()
  const { temperatureSymbol } = useUnit()

  const days = useMemo(() => {
    if (!forecast?.list?.length) return []
    return groupByDayStartingTomorrow(forecast.list)
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
          const [y, m, d] = day.split('-').map(Number)
          const localDate = new Date(y, m - 1, d)
          const label = localDate.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
          return (
            <div key={day} className="forecast-card">
              <div className="forecast-day">{label}</div>
              <img
                className="forecast-icon"
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={items[Math.floor(items.length / 2)]?.weather?.[0]?.description || 'icono'}
              />
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


