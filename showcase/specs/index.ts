import type { ComponentSpec } from '../lib/spec'
import { actionCardSpec } from './action-card'
import { buttonSpec } from './button'
import { checkboxSpec } from './checkbox'
import { fieldSpec } from './field'
import { inputSpec } from './input'
import { inputGroupSpec } from './input-group'
import { nativeSelectSpec } from './native-select'
import { numberFieldSpec } from './number-field'
import { segmentedSpec } from './segmented'
import { selectSpec } from './select'
import { switchSpec } from './switch'
import { textareaSpec } from './textarea'
import { toggleSpec } from './toggle'

// Component specs are registered here as they land. Order = sidebar order =
// prev/next order. Single manifest drives nav + routes so the two never drift
// (same pattern as the dev wall's registry.ts). Currently: the 13 Reference
// components from AGENTS.md; in-progress and legacy components follow.
export const componentSpecs: ComponentSpec[] = [
  buttonSpec,
  inputSpec,
  textareaSpec,
  selectSpec,
  nativeSelectSpec,
  checkboxSpec,
  switchSpec,
  numberFieldSpec,
  inputGroupSpec,
  fieldSpec,
  segmentedSpec,
  toggleSpec,
  actionCardSpec,
]
