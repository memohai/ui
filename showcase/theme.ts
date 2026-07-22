import { reactive } from 'vue'

// Theme switching is driven exactly like the host app: dark mode is a `.dark`
// class on <html> (style.css `@custom-variant dark (&:is(.dark *))`) and the
// palette is a `data-color-scheme` attribute (style.css
// `:root[data-color-scheme="ocean"] …`). Rescued from .storybook/preview.ts —
// deliberately self-contained, no host settings-store dependency.
export const SCHEMES = ['memoh', 'ocean', 'forest', 'rose', 'amber'] as const
export type Scheme = (typeof SCHEMES)[number]
export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'felinic-showcase-theme'

function load(): { theme: ThemeMode; scheme: Scheme } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed === 'object' && parsed !== null) {
        const p = parsed as Record<string, unknown>
        if ((p.theme === 'light' || p.theme === 'dark') && SCHEMES.includes(p.scheme as Scheme)) {
          return { theme: p.theme, scheme: p.scheme as Scheme }
        }
      }
    }
  }
  catch {
    // Corrupted / unavailable storage → fall through to defaults.
  }
  return { theme: 'light', scheme: 'memoh' }
}

export const themeState = reactive(load())

export function applyTheme(theme: ThemeMode, scheme: Scheme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.colorScheme = scheme
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themeState))
  }
  catch {
    // Storage unavailable — theme still works for the session.
  }
}

// Wrap in the View Transitions API to pick up the 220ms root crossfade that
// style.css ships (it respects prefers-reduced-motion itself), matching the
// host app's theme switch. Fall back to a hard swap when unsupported.
function withTransition(mutate: () => void) {
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => {
      mutate()
      applyTheme(themeState.theme, themeState.scheme)
    })
  }
  else {
    mutate()
    applyTheme(themeState.theme, themeState.scheme)
  }
  persist()
}

export function setTheme(theme: ThemeMode) {
  if (themeState.theme === theme) return
  withTransition(() => (themeState.theme = theme))
}

export function setScheme(scheme: Scheme) {
  if (themeState.scheme === scheme) return
  withTransition(() => (themeState.scheme = scheme))
}
