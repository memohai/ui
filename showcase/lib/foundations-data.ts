// Static foundation scales — the values here are CONSTANTS (they don't change
// with theme/scheme), transcribed from style.css `@theme inline` and the
// AGENTS.md contract sections. The z ladder values are additionally pinned by
// the host guard (check-ui-contract.mjs hard-fails any off-ladder z), so the
// Layers table can't silently drift. If a scale here ever disagrees with
// style.css, style.css is right — update this file.
// role/what fields carry a zh twin (roleZh/whatZh) for the locale toggle;
// token names and class names are never translated.

export const TYPE_SCALE = [
  { cls: 'text-display', px: 24, rem: '1.5rem', lh: '1.85rem', role: 'Hero / empty-state', roleZh: '主视觉 / 空状态' },
  { cls: 'text-heading', px: 18, rem: '1.125rem', lh: '1.55rem', role: 'Dialog / page headings', roleZh: '对话框 / 页面标题' },
  { cls: 'text-title', px: 16, rem: '1rem', lh: '1.4rem', role: 'Card / section / sheet titles', roleZh: '卡片 / 分区 / 抽屉标题' },
  { cls: 'text-control', px: 14, rem: '0.875rem', lh: '1.25rem', role: 'Buttons, compact titles', roleZh: '按钮、紧凑标题' },
  { cls: 'text-label', px: 13, rem: '0.8125rem', lh: '1.125rem', role: 'Form labels, emphasized small', roleZh: '表单标签、小号强调' },
  { cls: 'text-body', px: 12, rem: '0.75rem', lh: '1rem', role: 'Default UI body (workhorse)', roleZh: '默认正文(主力)' },
  { cls: 'text-caption', px: 11, rem: '0.6875rem', lh: '1rem', role: 'Badges, tiny meta', roleZh: '徽章、微型元信息' },
] as const

export const WEIGHT_ROLES = [
  { cls: 'font-semibold', value: 520, role: 'Surface / section titles', roleZh: '表面 / 分区标题' },
  { cls: 'font-medium', value: 450, role: 'Labels, button text, badges, emphasis', roleZh: '标签、按钮文字、徽章、强调' },
  { cls: 'font-normal', value: 360, role: 'Body, descriptions, field values, placeholder', roleZh: '正文、描述、字段值、占位符' },
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
  { token: '--radius-2xs', px: 3, cls: 'rounded-2xs', role: '', roleZh: '' },
  { token: '--radius-xs', px: 4, cls: 'rounded-xs', role: '', roleZh: '' },
  { token: '--radius-sm', px: 6, cls: 'rounded-sm', role: 'Badge / tag / Tooltip / Kbd', roleZh: '徽章 / 标签 / Tooltip / Kbd' },
  { token: '--radius-md', px: 8, cls: 'rounded-md', role: 'Controls & menu rows', roleZh: '控件与菜单行' },
  { token: '--radius', px: 10, cls: 'rounded-lg', role: 'Scale base', roleZh: '阶梯基准' },
  { token: '--radius-xl', px: 14, cls: 'rounded-xl', role: 'Card / Dialog / Sheet', roleZh: '卡片 / 对话框 / 抽屉' },
  { token: '--radius-menu', px: 8, cls: '', role: 'Menu rows', roleZh: '菜单行' },
  { token: '--radius-menu-shell', px: 12, cls: '', role: 'Chromed Popover & menu shell / ActionCard', roleZh: '带铬 Popover 与菜单壳 / ActionCard' },
] as const

export const ELEVATION_SCALE = [
  { token: '--shadow-hairline', role: 'The 1px inset edge on secondary/outline buttons (a shadow only so it animates with hover)', roleZh: 'secondary/outline 按钮的 1px 内嵌边(只是为了让边随 hover 动画)' },
  { token: '--shadow-thumb', role: 'Faint lift on the SegmentedControl sliding thumb', roleZh: 'SegmentedControl 滑块拇指的轻微浮起' },
  { token: '--shadow-dropdown', role: 'Floating menus — Dropdown / Select / chromed Popover', roleZh: '浮层菜单——Dropdown / Select / 带铬 Popover' },
  { token: '--shadow-modal', role: 'The modal layer — Dialog / Sheet / CommandDialog', roleZh: '模态层——Dialog / Sheet / CommandDialog' },
] as const

export const MOTION_DURATIONS = [
  { ms: 40, what: 'Toggle press', whatZh: 'Toggle 按下' },
  { ms: 70, what: 'Field edge', whatZh: '输入框边缘' },
  { ms: 110, what: 'Switch track + thumb glide', whatZh: 'Switch 轨道 + 滑块' },
  { ms: 150, what: 'Button color', whatZh: '按钮颜色' },
  { ms: 160, what: 'Toggle release', whatZh: 'Toggle 释放' },
  { ms: 180, what: 'Accordion reveal', whatZh: '折叠展开' },
  { ms: 220, what: 'AutoHeight swap / theme crossfade', whatZh: 'AutoHeight 切换 / 换肤渐变' },
  { ms: 250, what: 'SegmentedControl thumb', whatZh: 'SegmentedControl 滑块' },
  { ms: 255, what: 'Button press-scale (spring)', whatZh: '按钮按下缩放(弹簧)' },
] as const

export const MOTION_EASINGS = [
  { name: 'House spring', value: 'cubic-bezier(0.32, 0.72, 0, 1)', what: 'AutoHeight and other size tweens', whatZh: 'AutoHeight 等尺寸补间' },
  { name: 'Ease-out', value: 'cubic-bezier(0.22, 1, 0.36, 1)', what: 'Theme crossfade, overlays', whatZh: '换肤渐变、浮层' },
  { name: 'Press spring', value: 'linear(…) spring', what: 'Button press-scale — springy, never a straight ease', whatZh: '按钮按下缩放——弹簧感,绝不用直线缓动' },
] as const

export const Z_LADDER = [
  { token: '--z-raised', value: 10, role: 'Local elevation: sticky top-fades, resize rails, overlay badges', roleZh: '局部抬升:吸顶渐隐、拖拽轨道、悬浮徽章' },
  { token: '--z-sticky', value: 20, role: 'Sticky bars and hand-rolled popovers/rails within a panel', roleZh: '吸顶栏、面板内手写浮层/轨道' },
  { token: '--z-panel', value: 30, role: 'Panel-level floats: composer, minimap, app-level view switches', roleZh: '面板级浮层:输入坞、缩略图、视图切换' },
  { token: '--z-overlay', value: 50, role: 'Every reka floating layer: dialog/sheet/popover/tooltip/menu', roleZh: '所有 reka 浮层:对话框/抽屉/Popover/Tooltip/菜单' },
  { token: '--z-top', value: 100, role: 'Lightbox / full-screen top layer', roleZh: '灯箱 / 全屏顶层' },
] as const

export const ICON_SIZE_LADDER = [
  { px: 16, role: 'Default controls (buttons, fields, menus)', roleZh: '默认控件(按钮、输入框、菜单)' },
  { px: 14, role: 'Small in-field controls (clear / reveal / steppers)', roleZh: '框内小控件(清除 / 显隐 / 步进)' },
  { px: 12, role: 'Text-scale affordances (TextButton, crumbs) and badges', roleZh: '文字级操作(TextButton、面包屑)与徽章' },
] as const
