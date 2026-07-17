import { reactive } from 'vue'

// Chrome-level UI state shared between the TopBar (panel toggle) and
// ComponentPage (panel visibility). Page-local state (viewport, code expand,
// spec state) deliberately stays inside ComponentPage.
export const shellState = reactive({
  controlsOpen: true,
})
