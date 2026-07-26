// The settings page-width ladder — single source for SettingsShell (the page
// frame) and DetailPane (whose back row must share the content's rails). The
// host's DetailPane used to carry its own copy of this switch, missing the
// 'full' rung; the ladder now lives here exactly once. 'full' means no max-w
// constraint. Don't add rungs at call sites — a new measure is a new rung
// HERE, not a class there.
export type SettingsWidth = 'narrow' | 'standard' | 'wide' | 'full'

export function settingsWidthClass(width: SettingsWidth): string {
  switch (width) {
    case 'narrow':
      return 'max-w-3xl'
    case 'wide':
      return 'max-w-6xl'
    case 'full':
      return ''
    case 'standard':
    default:
      return 'max-w-4xl'
  }
}
