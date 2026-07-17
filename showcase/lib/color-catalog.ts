// The Colors page catalog — a CURATED list of token names, grouped the way
// AGENTS.md groups them. Only the names live here: the values are always read
// live from the cascade (useTokenValue), so this file can never drift out of
// sync with style.css's values — at worst a renamed token shows "—", which is
// the visible signal to update this list. The domain families (event /
// capability / context-window / diff / terminal / chart) are Memoh-specific
// semantic palettes, not generic primitives — they get their own section.

export interface RampSpec {
  // Label shown above the bar, and the token prefix segments are appended to.
  label: string
  prefix: string
  // '' = the bare prefix token itself (rendered as "base").
  roles: string[]
}

export interface ColorSection {
  title: string
  rows?: string[]
  ramps?: RampSpec[]
}

const STATUS_ROLES = ['soft', 'border', '', 'foreground']
const DOMAIN_ROLES = ['soft', 'border', '', 'foreground']

const ACCENT_HUES = ['gray', 'brown', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'red']
const ACCENT_ROLES = ['soft', 'soft-hover', 'soft-active', 'border', '', 'deep']

function ramp(prefix: string, roles: string[], label = prefix): RampSpec {
  return { label, prefix, roles }
}

export const COLOR_SECTIONS: ColorSection[] = [
  {
    title: 'Surfaces & text',
    rows: [
      '--background',
      '--background-chrome',
      '--card',
      '--foreground',
      '--muted',
      '--muted-foreground',
      '--muted-soft',
      '--accent',
      '--sidebar',
      '--sidebar-accent',
    ],
  },
  {
    title: 'Edges & fields',
    rows: [
      '--border',
      '--border-soft',
      '--border-hairline',
      '--border-menu',
      '--border-menu-elevated',
      '--ring',
      '--scrim',
      '--field-edge-rest',
      '--field-edge-engaged',
      '--field-edge-solid',
      '--field-placeholder',
    ],
  },
  {
    title: 'Brand',
    rows: ['--brand', '--brand-soft', '--brand-border', '--brand-hover', '--sidebar-primary'],
  },
  {
    title: 'Status',
    ramps: [
      ramp('--success', STATUS_ROLES),
      ramp('--warning', STATUS_ROLES),
      ramp('--info', STATUS_ROLES),
      ramp('--destructive', STATUS_ROLES),
    ],
  },
  {
    title: 'Accent palette',
    ramps: [
      ...ACCENT_HUES.map(hue => ramp(`--accent-${hue}`, ACCENT_ROLES)),
      ramp('--accent-blue-fill', ['', 'hover', 'active']),
    ],
  },
  {
    title: 'Interaction overlays',
    rows: [
      '--overlay-hover-light',
      '--overlay-hover',
      '--overlay-hover-strong',
      '--overlay-active',
      '--overlay-active-strong',
      '--ui-hover',
      '--ui-selected',
      '--ui-on',
      '--ui-pressed',
      '--ui-selected-pressed',
      '--selected-bg',
    ],
  },
  {
    title: 'Buttons',
    rows: [
      '--btn-primary',
      '--btn-primary-hover',
      '--btn-primary-active',
      '--btn-ghost-hover',
      '--btn-secondary-overlay',
      '--btn-destructive-hover-bg',
      '--btn-destructive-hover-text',
    ],
  },
  {
    title: 'Domain colors',
    ramps: [
      ramp('--event-schedule', DOMAIN_ROLES),
      ramp('--event-heartbeat', DOMAIN_ROLES),
      ramp('--event-subagent', DOMAIN_ROLES),
      ramp('--event-discuss', DOMAIN_ROLES),
      ramp('--capability-tool', DOMAIN_ROLES),
      ramp('--capability-vision', DOMAIN_ROLES),
      ramp('--capability-image', DOMAIN_ROLES),
      ramp('--capability-reasoning', DOMAIN_ROLES),
      ramp('--context-window', ['xs', 'sm', 'md', 'lg', 'xl', 'foreground']),
      ramp('--diff', ['add', 'add-border', 'remove', 'remove-border']),
      ramp('--terminal', ['background', 'foreground', 'cursor', 'selection']),
      ramp('--chart', ['1', '2', '3', '4', '5']),
    ],
  },
]
