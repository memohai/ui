import { reactive } from 'vue'

// Minimal locale store for the showcase chrome (en/zh). Deliberately NOT
// vue-i18n: the library itself is i18n-free by contract, and the showcase only
// needs a two-language string picker. tt() reads localeState during render, so
// every localized string is reactive with zero plumbing.
// <html lang> follows the locale — the vendored :lang(zh) weight remap in
// tailwind.css keys off it (CJK runs render lighter, matching the host app).
export type Locale = 'en' | 'zh'

const STORAGE_KEY = 'felinic-showcase-locale'

function load(): Locale {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en'
  }
  catch {
    return 'en'
  }
}

export const localeState = reactive<{ locale: Locale }>({ locale: load() })

export function applyLocale(locale: Locale) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
}

export function setLocale(locale: Locale) {
  if (localeState.locale === locale) return
  localeState.locale = locale
  applyLocale(locale)
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  }
  catch {
    // Storage unavailable — locale still works for the session.
  }
}

/** Pick a string by locale. zh falls back to en when no translation exists. */
export function tt(en: string, zh?: string): string {
  return localeState.locale === 'zh' ? (zh ?? en) : en
}
