import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/components/select'
import { boolAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm', 'lg'] as const

const CLAUDE_MODELS = [
  { value: 'fable-5', label: 'Claude Fable 5' },
  { value: 'opus-4-8', label: 'Claude Opus 4.8' },
  { value: 'sonnet-5', label: 'Claude Sonnet 5' },
]
const OPENAI_MODELS = [
  { value: 'gpt-5-2', label: 'GPT-5.2' },
  { value: 'gpt-5-mini', label: 'GPT-5 mini' },
]
const ALL_MODELS = [...CLAUDE_MODELS, ...OPENAI_MODELS]

const PLACEHOLDER = 'Pick a model'

function triggerAndContent(state: Record<string, unknown>, items: () => unknown) {
  const size = state.size as 'default' | 'sm' | 'lg'
  return [
    h(SelectTrigger, { size, class: 'w-64' }, () => h(SelectValue, { placeholder: PLACEHOLDER })),
    // SelectContent has no lg rung — the lg trigger pairs with the default menu.
    h(SelectContent, { size: size === 'lg' ? 'default' : size }, items),
  ]
}

export const selectSpec: ComponentSpec = {
  id: 'select',
  name: 'Select',
  description:
    'Single-value picker on a trigger + floating menu. The trigger follows the field-edge contract; the menu is the shared floating surface.',
  descriptionZh:
    '触发器 + 浮层菜单的单选选择器。触发器遵循 field-edge 契约；菜单是共享的浮层表面。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'string', key: 'value', label: 'Value', default: 'fable-5' },
    { kind: 'boolean', key: 'open', label: 'Open', default: false },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  examples: [
    {
      name: 'Groups and separators',
      nameZh: '分组与分隔线',
      state: { value: 'opus-4-8', open: true },
      render: state =>
        h(
          Select,
          {
            modelValue: String(state.value),
            'onUpdate:modelValue': (v: unknown) => (state.value = String(v)),
            open: Boolean(state.open),
            'onUpdate:open': (v: boolean) => (state.open = v),
          },
          () =>
            triggerAndContent(state, () => [
              h(SelectGroup, null, () => [
                h(SelectLabel, null, () => 'Anthropic'),
                ...CLAUDE_MODELS.map(m => h(SelectItem, { value: m.value }, () => h(SelectItemText, null, () => m.label))),
              ]),
              h(SelectSeparator),
              h(SelectGroup, null, () => [
                h(SelectLabel, null, () => 'OpenAI'),
                ...OPENAI_MODELS.map(m => h(SelectItem, { value: m.value }, () => h(SelectItemText, null, () => m.label))),
              ]),
            ]),
        ),
      code: state => `<Select model-value="${state.value}">
  <SelectTrigger class="w-64">
    <SelectValue placeholder="${PLACEHOLDER}" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Anthropic</SelectLabel>
      ${CLAUDE_MODELS.map(m => `<SelectItem value="${m.value}"><SelectItemText>${m.label}</SelectItemText></SelectItem>`).join('\n      ')}
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>OpenAI</SelectLabel>
      ${OPENAI_MODELS.map(m => `<SelectItem value="${m.value}"><SelectItemText>${m.label}</SelectItemText></SelectItem>`).join('\n      ')}
    </SelectGroup>
  </SelectContent>
</Select>`,
    },
  ],
  render: state =>
    h(
      Select,
      {
        modelValue: String(state.value),
        'onUpdate:modelValue': (v: unknown) => (state.value = String(v)),
        open: Boolean(state.open),
        'onUpdate:open': (v: boolean) => (state.open = v),
        disabled: Boolean(state.disabled),
      },
      () => triggerAndContent(state, () => ALL_MODELS.map(m => h(SelectItem, { value: m.value }, () => h(SelectItemText, null, () => m.label)))),
    ),
  code: (state) => {
    const attrs
      = (state.value ? ` model-value="${state.value}"` : '')
      + boolAttr('disabled', Boolean(state.disabled))
    return `<Select${attrs}>
  <SelectTrigger${strAttr('class', 'w-64')}${strAttr('size', String(state.size), 'default')}>
    <SelectValue placeholder="${PLACEHOLDER}" />
  </SelectTrigger>
  <SelectContent>
    ${ALL_MODELS.map(m => `<SelectItem value="${m.value}"><SelectItemText>${m.label}</SelectItemText></SelectItem>`).join('\n    ')}
  </SelectContent>
</Select>`
  },
  usage: `The trigger is a FIELD — it follows the field-edge contract, engaged on focus (click), never hover.

- Never inject bg-* / border / hover classes into SelectTrigger; pick size, nothing else.
- The chosen value shows in the trigger via SelectValue; menu selection is the check indicator, never a row background.
- For a plain native dropdown (dense toolbars, scheme pickers) use NativeSelect instead — same ladder, no menu surface.`,
  usageZh: `触发器是一个"输入框"——遵循 field-edge 契约,点击聚焦时激活,hover 不变。

- 永远不要往 SelectTrigger 注入 bg-* / border / hover 类;只能选 size。
- 选中值由 SelectValue 显示在触发器里;菜单内的选中是对勾指示器,绝不是行底色。
- 只是要一个朴素的原生下拉(紧凑工具栏、scheme 选择)就用 NativeSelect——同一阶梯,没有菜单浮层。`,
}
