import { useEffect } from 'react'
import { useUnit } from '../../context/UnitContext'
import { useWeather } from '../../context/WeatherContext'
import './UnitToggle.css'

export default function UnitToggle() {
  const { unitSystem, toggleUnitSystem } = useUnit()
  const { location, loadByCoords } = useWeather()

  useEffect(() => {
    if (location?.lat && location?.lon) {
      loadByCoords(location.lat, location.lon, unitSystem)
    }
  }, [unitSystem])

  return (
    <div className="unitToggle" role="group" aria-label="Seleccionar unidad">
      <button
        className={`unitToggle-segment ${unitSystem === 'metric' ? 'is-active' : ''}`}
        onClick={() => unitSystem !== 'metric' && toggleUnitSystem()}
      >°C</button>
      <button
        className={`unitToggle-segment ${unitSystem === 'imperial' ? 'is-active' : ''}`}
        onClick={() => unitSystem !== 'imperial' && toggleUnitSystem()}
      >°F</button>
    </div>
  )
}


