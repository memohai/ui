import { computed, reactive, ref } from 'vue'

// Hash router — deliberately no vue-router dependency for a dev-only app.
// Route ids are registry page ids: '#/overview', '#/foundations/colors',
// '#/components/button'.
export const route = reactive({ id: 'overview' })

// Browser-style back/forward for the tab-bar arrows: navigate() (and any
// hash edit) pushes a new entry, goBack/goForward only move the pointer.
// applyingHistory tells the hashchange handler "this change came from the
// arrows — don't push it as a new entry".
const stack = ref<string[]>([])
const pointer = ref(-1)
let applyingHistory = false

export const canBack = computed(() => pointer.value > 0)
export const canForward = computed(() => pointer.value < stack.value.length - 1)

export function navigate(id: string) {
  if (route.id === id) return
  location.hash = `#/${id}`
}

export function goBack() {
  if (!canBack.value) return
  pointer.value--
  applyingHistory = true
  location.hash = `#/${stack.value[pointer.value]}`
}

export function goForward() {
  if (!canForward.value) return
  pointer.value++
  applyingHistory = true
  location.hash = `#/${stack.value[pointer.value]}`
}

// known() guards against stale hand-typed hashes landing on a blank page.
export function initRouter(fallback: string, known: (id: string) => boolean) {
  const parse = () => {
    const id = location.hash.replace(/^#\/?/, '')
    route.id = known(id) ? id : fallback
    if (applyingHistory) {
      applyingHistory = false
    }
    else {
      // A fresh entry truncates the forward tail, like a browser.
      stack.value = [...stack.value.slice(0, pointer.value + 1), route.id]
      pointer.value = stack.value.length - 1
    }
  }
  parse()
  window.addEventListener('hashchange', parse)
}
