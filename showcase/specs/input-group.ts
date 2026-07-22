import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Eye, Search, X } from 'lucide-vue-next'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/input-group'
import { boolAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm', 'lg'] as const

export const inputGroupSpec: ComponentSpec = {
  id: 'input-group',
  name: 'InputGroup',
  description:
    'A field with addons — leading icons, in-field buttons, text — inside ONE shared edge. Adornments never grow a second border.',
  descriptionZh:
    '带附件的输入框——前导图标、框内按钮、文本——共处一条边缘内。装饰物不长第二个边框。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'string', key: 'placeholder', label: 'Placeholder', default: 'Search bots…' },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  examples: [
    {
      name: 'Clear button',
      nameZh: '清除按钮',
      state: { placeholder: 'Search bots…' },
      render: state =>
        h(InputGroup, { size: state.size as never, disabled: Boolean(state.disabled), class: 'w-80' }, () => [
          h(InputGroupInput, { placeholder: String(state.placeholder) }),
          h(InputGroupAddon, { align: 'inline-end' }, () =>
            h(InputGroupButton, { variant: 'ghost', size: 'icon-xs', 'aria-label': 'Clear' }, () => h(X)),
          ),
        ]),
      code: state => `<InputGroup${strAttr('size', String(state.size), 'default')}>
  <InputGroupInput placeholder="${state.placeholder}" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton variant="ghost" size="icon-xs" aria-label="Clear">
      <X />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`,
    },
    {
      name: 'Password reveal',
      nameZh: '密码显隐',
      state: { placeholder: 'API key' },
      render: state =>
        h(InputGroup, { size: state.size as never, disabled: Boolean(state.disabled), class: 'w-80' }, () => [
          h(InputGroupInput, { placeholder: String(state.placeholder), type: 'password', modelValue: 'sk-live-9f2c…' }),
          h(InputGroupAddon, { align: 'inline-end' }, () =>
            h(InputGroupButton, { variant: 'quiet', size: 'icon-xs', 'aria-label': 'Reveal' }, () => h(Eye)),
          ),
        ]),
      code: state => `<InputGroup${strAttr('size', String(state.size), 'default')}>
  <InputGroupInput placeholder="${state.placeholder}" type="password" model-value="sk-live-9f2c…" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton variant="quiet" size="icon-xs" aria-label="Reveal">
      <Eye />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`,
    },
  ],
  render: state =>
    h(InputGroup, { size: state.size as never, disabled: Boolean(state.disabled), class: 'w-80' }, () => [
      h(InputGroupAddon, { align: 'inline-start' }, () => h(Search)),
      h(InputGroupInput, { placeholder: String(state.placeholder) }),
    ]),
  code: (state) => {
    const attrs = strAttr('size', String(state.size), 'default') + boolAttr('disabled', Boolean(state.disabled))
    return `<InputGroup${attrs}>
  <InputGroupAddon align="inline-start">
    <Search />
  </InputGroupAddon>
  <InputGroupInput placeholder="${state.placeholder}" />
</InputGroup>`
  },
  usage: `In-field affordances (clear, reveal, steppers) are InputGroupButton — a real Button variant — never a hand-rolled icon with a hover background.

- ghost for discrete actions (Clear); quiet for low-stakes peeks (password reveal) — quiet draws no hover chip so the field stays one clean rectangle.
- One edge total: the group owns the field edge; addons are chromeless.
- In-field small controls share the tuned 5px radius — don't round them like standalone buttons.`,
  usageZh: `框内小按钮(清除、显隐、步进)都是 InputGroupButton——真正的 Button 变体——绝不是手写图标加 hover 背景。

- 离散动作用 ghost(清除);低风险窥视用 quiet(密码显隐)——quiet 不画 hover 衬底,输入框保持一整块干净矩形。
- 全组只有一条边:组拥有 field edge,附件不带铬。
- 框内小控件共享调好的 5px 圆角——别按独立按钮那样取圆角。`,
}
