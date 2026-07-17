import type { Ref } from 'vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { themeState } from '../theme'

// Reactive resolved-value reader for a CSS custom property. The value is read
// from the element ITSELF (getComputedStyle walks the cascade from there), so
// a swatch inside a `.dark` wrapper reports the dark value while its light
// sibling reports light — that's what powers the side-by-side columns.
// Recomputes on every theme/scheme flip; no mutation observer needed because
// themeState is the only driver of token changes in this app.
export function useTokenValue(el: Ref<HTMLElement | undefined>, token: string) {
  const value = ref('')

  async function update() {
    await nextTick()
    if (!el.value) return
    value.value = getComputedStyle(el.value).getPropertyValue(token).trim() || '—'
  }

  onMounted(update)
  watch(() => [themeState.theme, themeState.scheme], update)

  return value
}
