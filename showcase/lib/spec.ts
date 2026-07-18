import type { VNodeChild } from 'vue'

// A ControlSpec declares ONE knob on the Controls panel. The panel renders the
// widget from this declaration; the spec's render()/code() consume the
// resulting state. Options must come from the component's own exported key
// arrays (buttonVariantKeys, buttonSizeKeys, …) — never a hand-copied list, so
// the showcase can never drift from the shipped component (single-source rule,
// same as the dev wall and the old stories).
export type SpecState = Record<string, string | number | boolean>

interface ControlBase {
  key: string
  label: string
  // When present and false, the control renders disabled (opacity-40), not
  // hidden — inapplicable knobs stay visible so the panel layout is stable.
  when?: (state: SpecState) => boolean
}

export interface EnumControl extends ControlBase {
  kind: 'enum'
  options: readonly string[]
  default: string
  // radio-list = full-width menu-vocabulary rows (≤5 options); select = a
  // right-aligned dropdown for longer lists. Default picks by option count.
  display?: 'radio-list' | 'select'
}

export interface BooleanControl extends ControlBase {
  kind: 'boolean'
  default: boolean
}

export interface NumberControl extends ControlBase {
  kind: 'number'
  default: number
  min?: number
  max?: number
}

export interface StringControl extends ControlBase {
  kind: 'string'
  default: string
  placeholder?: string
}

export type ControlSpec = EnumControl | BooleanControl | NumberControl | StringControl

// A named preset (the "Example" radio-list atop the Controls panel). Selecting
// one replaces the current state; further manual tweaks keep working.
export interface ExampleSpec {
  name: string
  nameZh?: string
  state?: Partial<SpecState>
  // Optional overrides for cases the default render/code can't express (e.g.
  // slot-heavy compositions like InputGroup adornments).
  render?: (state: SpecState) => VNodeChild
  code?: (state: SpecState) => string
}

export interface ComponentSpec {
  id: string // 'button' → route '#/components/button'
  name: string // 'Button'
  // 1–2 lines atop the Controls panel: what it IS, not how to use it.
  description: string
  // zh translation of description; falls back to description when absent.
  descriptionZh?: string
  controls: ControlSpec[]
  examples?: ExampleSpec[]
  // Optional stage matrix: cross two control axes over spec defaults so the
  // full variant grid is visible at once (Button: variant × size). rows/cols
  // are control keys — enum controls contribute their options, booleans
  // contribute [false, true]. Opt-in per spec: only axes a reviewer actually
  // scans belong in a matrix.
  matrix?: { rows: string, cols: string }
  render: (state: SpecState) => VNodeChild
  // Live Vue snippet mirroring exactly what render() shows. Hand-written per
  // spec (not a generic serializer) — snippet quality is the whole point.
  code: (state: SpecState) => string
  // Agent-facing do/don't notes; renders the Usage tab when present.
  usage?: string
  usageZh?: string
}

export function defaultState(spec: ComponentSpec): SpecState {
  return Object.fromEntries(spec.controls.map(c => [c.key, c.default]))
}
