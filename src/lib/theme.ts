export type ThemePref = 'light' | 'dark' | 'system'

const THEME_KEY = 'africatrip:theme:v1'

export function loadThemePref(): ThemePref {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // ignora — cai pro default
  }
  return 'system'
}

export function saveThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(THEME_KEY, pref)
  } catch {
    // storage indisponível — tema simplesmente não persiste
  }
}

export function resolveIsDark(pref: ThemePref): boolean {
  if (pref === 'dark') return true
  if (pref === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}
