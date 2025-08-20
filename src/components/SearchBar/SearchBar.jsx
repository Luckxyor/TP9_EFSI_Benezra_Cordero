import { useState } from 'react'
import { useWeather } from '../../context/WeatherContext'
import { useUnit } from '../../context/UnitContext'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const { searchCity, isLoading } = useWeather()
  const { unitSystem } = useUnit()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    searchCity(query.trim(), unitSystem)
    setQuery('')
  }

  return (
    <form onSubmit={onSubmit} className="searchBar">
      <div className="searchBar-field">
        <input
          className="searchBar-input"
          placeholder="Buscar ciudad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button className="searchBar-button" disabled={isLoading}>{isLoading ? 'Buscando...' : 'Buscar'}</button>
    </form>
  )
}


