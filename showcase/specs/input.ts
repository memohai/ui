import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Input } from '#/components/input'
import { boolAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm', 'lg'] as const
const EMPHASES = ['solid', 'subtle'] as const

export const inputSpec: ComponentSpec = {
  id: 'input',
  name: 'Input',
  description:
    'Single-line text field. The edge is one inset hairline that deepens on focus — never an outer ring, never a grown border.',
  descriptionZh:
    '单行文本输入。边缘是一条内嵌发丝线，聚焦时原位加深——不是外圈 ring，也不加粗边框。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    {
      kind: 'enum',
      key: 'emphasis',
      label: 'Focus emphasis',
      options: EMPHASES,
      default: 'solid',
      display: 'radio-list',
    },
    { kind: 'string', key: 'placeholder', label: 'Placeholder', default: 'Email address' },
    { kind: 'string', key: 'value', label: 'Value', default: '' },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  matrix: { rows: 'size', cols: 'emphasis' },
  render: state =>
    h(Input, {
      // defaultValue + key: editing the Value control remounts the field with
      // the new initial text; typing in the canvas stays uncontrolled.
      key: String(state.value),
      size: state.size as never,
      emphasis: state.emphasis as never,
      placeholder: String(state.placeholder),
      defaultValue: String(state.value),
      disabled: Boolean(state.disabled),
      class: 'w-64',
    }),
  code: (state) => {
    const attrs
      = strAttr('size', String(state.size), 'default')
      + strAttr('emphasis', String(state.emphasis), 'solid')
      + strAttr('placeholder', String(state.placeholder), 'Email address')
      + (state.value ? ` model-value="${state.value}"` : '')
      + boolAttr('disabled', Boolean(state.disabled))
    return `<Input${attrs} />`
  },
  usage: `Fields engage on FOCUS only, never hover.

- Focus swaps the field edge to --field-edge-solid in place — do not add an outer ring or grow the border width.
- emphasis="subtle" is for search boxes and other low-chrome fields; forms keep the default "solid".
- Sizes follow the control ladder (sm 32 / default 36 / lg 40) with matching type scale — never a fixed 16px field.
- Need a label, description, or error? Wrap in Field — it wires for/aria for you.`,
  usageZh: `输入框只在聚焦时激活,hover 永远不变。

- 聚焦把 field edge 原位换成 --field-edge-solid——不要加外圈 ring,也不要加粗边框宽度。
- emphasis="subtle" 用于搜索框等低铬场景;表单保持默认 "solid"。
- 尺寸走控件阶梯(sm 32 / default 36 / lg 40)并带配套字阶——绝不做固定 16px 的输入框。
- 需要标签、描述或错误?用 Field 包一层,for/aria 它来接。`,
}
