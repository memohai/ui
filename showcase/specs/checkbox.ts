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
  descriptionZh:
    '多选勾选控件。对勾与 Switch、Radio 共用同一个选择蓝填充——一处蓝，处处蓝。',
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
  usageZh: `选中是一个指示器(对勾),永远不是持久的行底色。

- 永远配 Label——点标签即可切换勾选(for/id)。
- indeterminate 用于"部分子项选中"的父行,不是给用户的第三种选择。
- 边缘是控件发丝边;选中时原位换成蓝色填充。`,
}
