import type { Component } from 'vue'
import type { ComponentSpec } from './lib/spec'
import { componentSpecs } from './specs'
import ColorsPage from './pages/foundations/ColorsPage.vue'
import ElevationPage from './pages/foundations/ElevationPage.vue'
import IconsPage from './pages/foundations/IconsPage.vue'
import LayersPage from './pages/foundations/LayersPage.vue'
import MotionPage from './pages/foundations/MotionPage.vue'
import RadiusPage from './pages/foundations/RadiusPage.vue'
import SpacingPage from './pages/foundations/SpacingPage.vue'
import TypographyPage from './pages/foundations/TypographyPage.vue'
import OverviewPage from './pages/OverviewPage.vue'

// Single manifest: drives the sidebar groups, the hash routes, AND prev/next
// order — one list, three consumers, so they can never drift.
export type PageEntry =
  | { kind: 'static', id: string, title: string, component: Component }
  | { kind: 'component', id: string, title: string, spec: ComponentSpec }

export interface NavGroup {
  id: string
  label: string
  pages: PageEntry[]
}

function foundation(id: string, title: string, component: Component): PageEntry {
  return { kind: 'static', id: `foundations/${id}`, title, component }
}

export const navGroups: NavGroup[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    pages: [
      { kind: 'static', id: 'overview', title: 'Overview', component: OverviewPage },
      foundation('colors', 'Colors', ColorsPage),
      foundation('typography', 'Typography', TypographyPage),
      foundation('spacing', 'Spacing', SpacingPage),
      foundation('radius', 'Radius', RadiusPage),
      foundation('elevation', 'Elevation', ElevationPage),
      foundation('motion', 'Motion', MotionPage),
      foundation('layers', 'Layers', LayersPage),
      foundation('icons', 'Icons', IconsPage),
    ],
  },
  {
    id: 'components',
    label: 'Components',
    pages: componentSpecs.map(spec => ({
      kind: 'component',
      id: `components/${spec.id}`,
      title: spec.name,
      spec,
    })),
  },
]

export const flatPages: PageEntry[] = navGroups.flatMap(g => g.pages)

export function pageById(id: string): PageEntry | undefined {
  return flatPages.find(p => p.id === id)
}

// Prev/next follow the flat manifest order across groups (like Aaru's arrows).
export function neighbor(id: string, delta: -1 | 1): PageEntry | undefined {
  const i = flatPages.findIndex(p => p.id === id)
  return i === -1 ? undefined : flatPages[i + delta]
}
