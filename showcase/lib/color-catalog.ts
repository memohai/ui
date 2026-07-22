// The Colors page catalog — a CURATED list of token names, grouped the way
// AGENTS.md groups them. Only the names live here: the values are always read
// live from the cascade (ColorStack measures each bar's own computed
// background), so this file can never drift out of sync with style.css's
// values — at worst a renamed token renders as a transparent bar, which is
// the visible signal to update this list. The domain families (event /
// capability / context-window / diff / terminal / chart) are Memoh-specific
// semantic palettes, not generic primitives — they get their own section.

export interface ColorRow {
  // Full token name, e.g. '--accent-blue-soft' — what click copies.
  token: string
  // Short label printed inside the bar, e.g. 'soft'.
  short: string
}

export interface ColorFamily {
  // Shown above the stack; omitted when a section has exactly one family
  // (the section title already says it).
  label?: string
  labelZh?: string
  rows: ColorRow[]
}

export interface ColorSection {
  title: string
  titleZh: string
  families: ColorFamily[]
}

// A flat list of tokens → one unlabeled family; the bar label is the token
// name minus the '--'.
function rowsFamily(rows: string[]): ColorFamily {
  return { rows: rows.map(token => ({ token, short: token.replace(/^--/, '') })) }
}

// A role ramp under one prefix (--accent-blue + soft/soft-hover/…) → one
// labeled family; '' is the bare prefix token itself (rendered as "base").
function rampFamily(prefix: string, roles: string[], label?: string, labelZh?: string): ColorFamily {
  return {
    label: label ?? prefix.replace(/^--/, ''),
    labelZh,
    rows: roles.map(role => ({
      token: role ? `${prefix}-${role}` : prefix,
      short: role || 'base',
    })),
  }
}

const STATUS_ROLES = ['soft', 'border', '', 'foreground']
const DOMAIN_ROLES = ['soft', 'border', '', 'foreground']
const ACCENT_ROLES = ['soft', 'soft-hover', 'soft-active', 'border', '', 'deep']

const ACCENT_HUES: Array<[hue: string, label: string, labelZh: string]> = [
  ['gray', 'Gray', '灰'],
  ['brown', 'Brown', '棕'],
  ['orange', 'Orange', '橙'],
  ['yellow', 'Yellow', '黄'],
  ['green', 'Green', '绿'],
  ['teal', 'Teal', '青'],
  ['blue', 'Blue', '蓝'],
  ['purple', 'Purple', '紫'],
  ['pink', 'Pink', '粉'],
  ['red', 'Red', '红'],
]

export const COLOR_SECTIONS: ColorSection[] = [
  {
    title: 'Surfaces & text',
    titleZh: '表面与文字',
    families: [
      rowsFamily([
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
      ]),
    ],
  },
  {
    title: 'Edges & fields',
    titleZh: '边缘与输入框',
    families: [
      rowsFamily([
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
      ]),
    ],
  },
  {
    title: 'Brand',
    titleZh: '品牌色',
    families: [
      rowsFamily(['--brand', '--brand-soft', '--brand-border', '--brand-hover', '--sidebar-primary']),
    ],
  },
  {
    title: 'Status',
    titleZh: '状态色',
    families: [
      rampFamily('--success', STATUS_ROLES, 'Success', '成功'),
      rampFamily('--warning', STATUS_ROLES, 'Warning', '警告'),
      rampFamily('--info', STATUS_ROLES, 'Info', '信息'),
      rampFamily('--destructive', STATUS_ROLES, 'Destructive', '危险'),
    ],
  },
  {
    title: 'Accent palette',
    titleZh: 'Accent 色板',
    families: [
      ...ACCENT_HUES.map(([hue, label, labelZh]) => rampFamily(`--accent-${hue}`, ACCENT_ROLES, label, labelZh)),
      rampFamily('--accent-blue-fill', ['', 'hover', 'active'], 'Blue fill', '蓝填充'),
    ],
  },
  {
    title: 'Interaction overlays',
    titleZh: '交互叠层',
    families: [
      rowsFamily([
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
      ]),
    ],
  },
  {
    title: 'Buttons',
    titleZh: '按钮',
    families: [
      rowsFamily([
        '--btn-primary',
        '--btn-primary-hover',
        '--btn-primary-active',
        '--btn-ghost-hover',
        '--btn-secondary-overlay',
        '--btn-destructive-hover-bg',
        '--btn-destructive-hover-text',
      ]),
    ],
  },
  {
    title: 'Domain colors',
    titleZh: '业务色板',
    families: [
      rampFamily('--event-schedule', DOMAIN_ROLES),
      rampFamily('--event-heartbeat', DOMAIN_ROLES),
      rampFamily('--event-subagent', DOMAIN_ROLES),
      rampFamily('--event-discuss', DOMAIN_ROLES),
      rampFamily('--capability-tool', DOMAIN_ROLES),
      rampFamily('--capability-vision', DOMAIN_ROLES),
      rampFamily('--capability-image', DOMAIN_ROLES),
      rampFamily('--capability-reasoning', DOMAIN_ROLES),
      rampFamily('--context-window', ['xs', 'sm', 'md', 'lg', 'xl', 'foreground']),
      rampFamily('--diff', ['add', 'add-border', 'remove', 'remove-border']),
      rampFamily('--terminal', ['background', 'foreground', 'cursor', 'selection']),
      rampFamily('--chart', ['1', '2', '3', '4', '5']),
    ],
  },
]
