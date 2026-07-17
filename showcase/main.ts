import { createApp } from 'vue'
import App from './App.vue'
import './tailwind.css'
// Inter Variable (full 100-900 axis) — the design system's fractional weights
// (360/450/520) only render correctly with the variable font; without it a
// system fallback (PingFang etc.) renders those rungs visibly too thin.
// Same import the host app makes in its main.ts.
import '@fontsource-variable/inter'
import { applyLocale, localeState } from './lib/i18n'

applyLocale(localeState.locale)
createApp(App).mount('#app')
