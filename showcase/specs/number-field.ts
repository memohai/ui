import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { NumberField } from '#/components/number-field'

const SIZES = ['default', 'sm', 'lg'] as const

export const numberFieldSpec: ComponentSpec = {
  id: 'number-field',
  name: 'NumberField',
  description:
    'Numeric input with steppers inside the shared field edge. The ± buttons are real ghost Buttons — no hand-rolled hover.',
  descriptionZh:
    '共享 field edge 内的数字输入与步进器。± 按钮是真正的 ghost Button，没有手写 hover。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'number', key: 'value', label: 'Value', default: 3, min: 0, max: 100 },
    { kind: 'number', key: 'min', label: 'Min', default: 0, min: 0, max: 50 },
    { kind: 'number', key: 'max', label: 'Max', default: 100, min: 10, max: 100 },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  render: state =>
    h(NumberField, {
      size: state.size as never,
      min: Number(state.min),
      max: Number(state.max),
      disabled: Boolean(state.disabled),
      class: 'w-40',
      modelValue: Number(state.value),
      'onUpdate:modelValue': (v: number) => (state.value = v),
    }),
}
