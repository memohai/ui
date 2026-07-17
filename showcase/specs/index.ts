import type { ComponentSpec } from '../lib/spec'

// Component specs are registered here as they land. Order = sidebar order =
// prev/next order. Single manifest drives nav + routes so the two never drift
// (same pattern as the dev wall's registry.ts).
export const componentSpecs: ComponentSpec[] = []
