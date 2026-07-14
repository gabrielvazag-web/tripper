import { useEffect, useState } from 'react'
import { applyTheme, loadThemePref, resolveIsDark, saveThemePref, type ThemePref } from './theme'

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => loadThemePref())

  useEffect(() => {
    applyTheme(resolveIsDark(pref))
    saveThemePref(pref)

    if (pref !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(resolveIsDark('system'))
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [pref])

  return { pref, setPref }
}
