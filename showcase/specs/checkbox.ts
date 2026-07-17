import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Checkbox } from '#/components/checkbox'
import { Label } from '#/components/label'
import { boolAttr } from '../lib/codegen'

const STATES = ['unchecked', 'checked', 'indeterminate'] as const

function toModel(state: string): boolean | 'indeterminate' {
  if (state === 'indeterminate') return 'indeterminate'
  return state === 'checked'
}

export const checkboxSpec: ComponentSpec = {
  id: 'checkbox',
  name: 'Checkbox',
  description:
    'Multi-select check control. The tick is the same selection blue fill as Switch and Radio — one blue, everywhere.',
  controls: [
    { kind: 'enum', key: 'state', label: 'State', options: STATES, default: 'checked', display: 'radio-list' },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
    { kind: 'string', key: 'label', label: 'Label', default: 'Include archived bots' },
  ],
  render: state =>
    h('div', { class: 'flex items-center gap-2' }, [
      h(Checkbox, {
        id: 'showcase-checkbox',
        disabled: Boolean(state.disabled),
        modelValue: toModel(String(state.state)),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') =>
          (state.state = v === 'indeterminate' ? 'indeterminate' : v ? 'checked' : 'unchecked'),
      }),
      h(Label, { for: 'showcase-checkbox' }, () => String(state.label)),
    ]),
  code: (state) => {
    const model
      = state.state === 'indeterminate'
        ? ' model-value="indeterminate"'
        : state.state === 'checked'
          ? ' model-value="true"'
          : ''
    return `<Checkbox${model}${boolAttr('disabled', Boolean(state.disabled))} />`
  },
  usage: `Selection is an indicator (the tick), never a persistent row background.

- Always pair with a Label — clicking the label toggles the box via for/id.
- indeterminate is for "some children selected" parent rows, not a third user choice.
- The edge is a control-edge hairline; checked swaps to the blue fill in place.`,
}
