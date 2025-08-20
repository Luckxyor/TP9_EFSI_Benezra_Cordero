import { createContext, useContext, useMemo, useState } from 'react'

const UnitContext = createContext({
  unitSystem: 'metric',
  temperatureSymbol: '°C',
  speedSymbol: 'm/s',
  toggleUnitSystem: () => {},
})

export function UnitProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState('metric')

  const contextValue = useMemo(() => {
    return {
      unitSystem,
      temperatureSymbol: unitSystem === 'metric' ? '°C' : '°F',
      speedSymbol: unitSystem === 'metric' ? 'm/s' : 'mph',
      toggleUnitSystem: () =>
        setUnitSystem((prev) => (prev === 'metric' ? 'imperial' : 'metric')),
    }
  }, [unitSystem])

  return <UnitContext.Provider value={contextValue}>{children}</UnitContext.Provider>
}

export function useUnit() {
  return useContext(UnitContext)
}


