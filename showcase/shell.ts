import { reactive } from 'vue'

// Chrome-level UI state shared across the shell: the sidebar reads navOpen,
// the right controls rail reads controlsOpen, and the tab bar toggles both.
// Page-local state (viewport, spec state) deliberately stays inside
// ComponentPage.
export const shellState = reactive({
  navOpen: true,
  controlsOpen: true,
})
