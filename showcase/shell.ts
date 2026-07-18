import { reactive } from 'vue'

// Chrome-level UI state shared across pages: the right controls rail reads
// and toggles it from ComponentPage. Page-local state (viewport, spec state)
// deliberately stays inside ComponentPage.
export const shellState = reactive({
  controlsOpen: true,
})
