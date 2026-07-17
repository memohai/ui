import { reactive } from 'vue'

// Hash router — deliberately no vue-router dependency for a dev-only app.
// Route ids are registry page ids: '#/overview', '#/foundations/colors',
// '#/components/button'.
export const route = reactive({ id: 'overview' })

export function navigate(id: string) {
  if (route.id === id) return
  location.hash = `#/${id}`
}

// known() guards against stale hand-typed hashes landing on a blank page.
export function initRouter(fallback: string, known: (id: string) => boolean) {
  const parse = () => {
    const id = location.hash.replace(/^#\/?/, '')
    route.id = known(id) ? id : fallback
  }
  parse()
  window.addEventListener('hashchange', parse)
}
