import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type EffectiveTheme, type ThemePreference } from './theme.context'

const STORAGE_KEY = 'school-finder-theme'

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function applyThemeClass(effectiveTheme: EffectiveTheme, preference: ThemePreference) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (preference === 'system') return
  root.classList.add(effectiveTheme)
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference)
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>(getSystemTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const effectiveTheme: EffectiveTheme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    applyThemeClass(effectiveTheme, preference)
  }, [effectiveTheme, preference])

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  const value = useMemo(
    () => ({ preference, effectiveTheme, setPreference }),
    [preference, effectiveTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
