import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const API_KEY = '30a33825a49c5f843e7151f3ae30abd8'

const WeatherContext = createContext({
  isLoading: false,
  error: null,
  current: null,
  forecast: null,
  location: null,
  searchCity: async (q) => {},
  loadByCoords: async (lat, lon) => {},
})

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  return res.json()
}

export function WeatherProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [location, setLocation] = useState(null)

  const loadByCoords = useCallback(async (lat, lon, units = 'metric') => {
    try {
      setIsLoading(true)
      setError(null)
      const [weather, daily] = await Promise.all([
        fetchJson(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`),
        fetchJson(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`),
      ])
      setCurrent(weather)
      setForecast(daily)
      setLocation({ name: weather.name, country: weather.sys?.country, lat, lon })
      localStorage.setItem('lastWeather', JSON.stringify({ lat, lon }))
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchCity = useCallback(async (query, units = 'metric') => {
    if (!query) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchJson(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`)
      if (!data?.length) throw new Error('Ciudad no encontrada')
      const { lat, lon, name, country } = data[0]
      await loadByCoords(lat, lon, units)
      setLocation({ name, country, lat, lon })
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [loadByCoords])

  useEffect(() => {
    const last = localStorage.getItem('lastWeather')
    if (last) {
      try {
        const { lat, lon } = JSON.parse(last)
        if (lat && lon) loadByCoords(lat, lon)
        return
      } catch {}
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          loadByCoords(latitude, longitude)
        },
        () => {
          searchCity('Buenos Aires')
        }
      )
    } else {
      searchCity('Buenos Aires')
    }
  }, [loadByCoords, searchCity])

  const value = useMemo(() => ({
    isLoading,
    error,
    current,
    forecast,
    location,
    searchCity,
    loadByCoords,
  }), [isLoading, error, current, forecast, location, searchCity, loadByCoords])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  return useContext(WeatherContext)
}


