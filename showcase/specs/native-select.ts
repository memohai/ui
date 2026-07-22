import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { NativeSelect } from '#/components/native-select'
import { boolAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm', 'lg'] as const

const SCHEMES = ['memoh', 'ocean', 'forest', 'rose', 'amber']

export const nativeSelectSpec: ComponentSpec = {
  id: 'native-select',
  name: 'NativeSelect',
  description:
    'The platform <select> under the same size/type ladder as Select — for dense toolbars that don’t need a menu surface.',
  descriptionZh:
    '原生 <select>，与 Select 共享尺寸/字阶——用于不需要菜单浮层的紧凑工具栏。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  render: state =>
    h(
      NativeSelect,
      {
        size: state.size as never,
        disabled: Boolean(state.disabled),
        modelValue: 'ocean',
        'onUpdate:modelValue': () => {},
      },
      () => SCHEMES.map(s => h('option', { value: s }, s)),
    ),
  code: (state) => {
    const attrs
      = strAttr('size', String(state.size), 'default')
      + boolAttr('disabled', Boolean(state.disabled))
    return `<NativeSelect${attrs}>
  ${SCHEMES.map(s => `<option value="${s}">${s}</option>`).join('\n  ')}
</NativeSelect>`
  },
}
