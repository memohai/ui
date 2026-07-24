import { reactive } from 'vue'

// Chrome-level UI state shared across the shell: the sidebar reads navOpen
// and the tab bar toggles it. Page-local state (viewport, spec state)
// deliberately stays inside ComponentPage.
export const shellState = reactive({
  navOpen: true,
})
