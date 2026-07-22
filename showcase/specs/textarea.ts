import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Textarea } from '#/components/textarea'
import { boolAttr, numAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm', 'lg'] as const

export const textareaSpec: ComponentSpec = {
  id: 'textarea',
  name: 'Textarea',
  description:
    'Multi-line text field sharing the Input field-edge contract: one inset hairline, swapped in place on focus.',
  descriptionZh:
    '多行文本输入，与 Input 共享 field-edge 契约：一条内嵌发丝线，聚焦时原位换色。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'string', key: 'placeholder', label: 'Placeholder', default: 'Tell the bot what to do…' },
    { kind: 'number', key: 'rows', label: 'Rows', default: 3, min: 2, max: 10 },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  render: state =>
    h(Textarea, {
      size: state.size as never,
      placeholder: String(state.placeholder),
      rows: Number(state.rows),
      disabled: Boolean(state.disabled),
      class: 'w-80',
    }),
  code: (state) => {
    const attrs
      = strAttr('size', String(state.size), 'default')
      + strAttr('placeholder', String(state.placeholder), 'Tell the bot what to do…')
      + numAttr('rows', Number(state.rows), 3)
      + boolAttr('disabled', Boolean(state.disabled))
    return `<Textarea${attrs} />`
  },
}
