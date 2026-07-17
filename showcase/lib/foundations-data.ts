// Static foundation scales — the values here are CONSTANTS (they don't change
// with theme/scheme), transcribed from style.css `@theme inline` and the
// AGENTS.md contract sections. The z ladder values are additionally pinned by
// the host guard (check-ui-contract.mjs hard-fails any off-ladder z), so the
// Layers table can't silently drift. If a scale here ever disagrees with
// style.css, style.css is right — update this file.

export const TYPE_SCALE = [
  { cls: 'text-display', px: 24, rem: '1.5rem', lh: '1.85rem', role: 'Hero / empty-state' },
  { cls: 'text-heading', px: 18, rem: '1.125rem', lh: '1.55rem', role: 'Dialog / page headings' },
  { cls: 'text-title', px: 16, rem: '1rem', lh: '1.4rem', role: 'Card / section / sheet titles' },
  { cls: 'text-control', px: 14, rem: '0.875rem', lh: '1.25rem', role: 'Buttons, compact titles' },
  { cls: 'text-label', px: 13, rem: '0.8125rem', lh: '1.125rem', role: 'Form labels, emphasized small' },
  { cls: 'text-body', px: 12, rem: '0.75rem', lh: '1rem', role: 'Default UI body (workhorse)' },
  { cls: 'text-caption', px: 11, rem: '0.6875rem', lh: '1rem', role: 'Badges, tiny meta' },
] as const

export const WEIGHT_ROLES = [
  { cls: 'font-semibold', value: 520, role: 'Surface / section titles' },
  { cls: 'font-medium', value: 450, role: 'Labels, button text, badges, emphasis' },
  { cls: 'font-normal', value: 360, role: 'Body, descriptions, field values, placeholder' },
] as const

export const FONT_STACKS = [
  {
    token: '--font-sans',
    value: '\'Inter Variable\', \'Inter\', \'MiSans\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei UI\', \'Noto Sans SC\'',
  },
  {
    token: '(mono — unset)',
    value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace (Tailwind default; hosts may override --font-mono)',
  },
] as const

export const SPACING_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const

export const RADIUS_SCALE = [
  { token: '--radius-2xs', px: 3, cls: 'rounded-2xs', role: '' },
  { token: '--radius-xs', px: 4, cls: 'rounded-xs', role: '' },
  { token: '--radius-sm', px: 6, cls: 'rounded-sm', role: 'Badge / tag / Tooltip / Kbd' },
  { token: '--radius-md', px: 8, cls: 'rounded-md', role: 'Controls & menu rows' },
  { token: '--radius', px: 10, cls: 'rounded-lg', role: 'Scale base' },
  { token: '--radius-xl', px: 14, cls: 'rounded-xl', role: 'Card / Dialog / Sheet' },
  { token: '--radius-menu', px: 8, cls: '', role: 'Menu rows' },
  { token: '--radius-menu-shell', px: 12, cls: '', role: 'Chromed Popover & menu shell / ActionCard' },
] as const

export const ELEVATION_SCALE = [
  { token: '--shadow-hairline', role: 'The 1px inset edge on secondary/outline buttons (a shadow only so it animates with hover)' },
  { token: '--shadow-thumb', role: 'Faint lift on the SegmentedControl sliding thumb' },
  { token: '--shadow-dropdown', role: 'Floating menus — Dropdown / Select / chromed Popover' },
  { token: '--shadow-modal', role: 'The modal layer — Dialog / Sheet / CommandDialog' },
] as const

export const MOTION_DURATIONS = [
  { ms: 40, what: 'Toggle press' },
  { ms: 70, what: 'Field edge' },
  { ms: 110, what: 'Switch track + thumb glide' },
  { ms: 150, what: 'Button color' },
  { ms: 160, what: 'Toggle release' },
  { ms: 180, what: 'Accordion reveal' },
  { ms: 220, what: 'AutoHeight swap / theme crossfade' },
  { ms: 250, what: 'SegmentedControl thumb' },
  { ms: 255, what: 'Button press-scale (spring)' },
] as const

export const MOTION_EASINGS = [
  { name: 'House spring', value: 'cubic-bezier(0.32, 0.72, 0, 1)', what: 'AutoHeight and other size tweens' },
  { name: 'Ease-out', value: 'cubic-bezier(0.22, 1, 0.36, 1)', what: 'Theme crossfade, overlays' },
  { name: 'Press spring', value: 'linear(…) spring', what: 'Button press-scale — springy, never a straight ease' },
] as const

export const Z_LADDER = [
  { token: '--z-raised', value: 10, role: 'Local elevation: sticky top-fades, resize rails, overlay badges' },
  { token: '--z-sticky', value: 20, role: 'Sticky bars and hand-rolled popovers/rails within a panel' },
  { token: '--z-panel', value: 30, role: 'Panel-level floats: composer, minimap, app-level view switches' },
  { token: '--z-overlay', value: 50, role: 'Every reka floating layer: dialog/sheet/popover/tooltip/menu' },
  { token: '--z-top', value: 100, role: 'Lightbox / full-screen top layer' },
] as const

export const ICONS_USED = [
  'ArrowRight', 'Bold', 'CalendarDays', 'Check', 'ChevronDown', 'ChevronLeft', 'ChevronRight',
  'ChevronsLeft', 'ChevronsRight', 'ChevronUp', 'Circle', 'CircleAlert', 'CircleCheck', 'CircleX',
  'Info', 'Italic', 'Loader2', 'Minus', 'MoreHorizontal', 'PanelLeft', 'Plus', 'RefreshCw',
  'Search', 'Strikethrough', 'TriangleAlert', 'Underline', 'X',
] as const

export const ICON_SIZE_LADDER = [
  { px: 16, role: 'Default controls (buttons, fields, menus)' },
  { px: 14, role: 'Small in-field controls (clear / reveal / steppers)' },
  { px: 12, role: 'Text-scale affordances (TextButton, crumbs) and badges' },
] as const
