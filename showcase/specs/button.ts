import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { ArrowRight, Plus, RefreshCw } from 'lucide-vue-next'
import { Button, buttonSizeKeys, buttonVariantKeys } from '#/components/button'
import { boolAttr, strAttr } from '../lib/codegen'

const LOADING_MODES = ['overlay', 'icon', 'leading'] as const

function isLink(variant: unknown): boolean {
  return String(variant).startsWith('link')
}

// Link variants are inline text affordances — they render as <a>, never a
// button box (same split as the dev wall and the old stories).
function linkAttrs(variant: unknown): Record<string, string> {
  return isLink(variant) ? { as: 'a', href: '#' } : {}
}

export const buttonSpec: ComponentSpec = {
  id: 'button',
  name: 'Button',
  description:
    'Triggers an action. The charcoal default is the high-emphasis CTA; brand purple is scarce and reserved for rare moments.',
  descriptionZh:
    '触发一个动作。深炭色 default 是高强调 CTA;brand 紫色稀缺，只留给极少数时刻。',
  imports: 'import { Button } from \'@felinic/ui\'',
  controls: [
    {
      kind: 'enum',
      key: 'variant',
      label: 'Variant',
      options: buttonVariantKeys,
      default: 'default',
    },
    { kind: 'enum', key: 'size', label: 'Size', options: buttonSizeKeys, default: 'default' },
    { kind: 'string', key: 'label', label: 'Label', default: 'Save changes' },
    { kind: 'boolean', key: 'loading', label: 'Loading', default: false },
    {
      kind: 'enum',
      key: 'loadingMode',
      label: 'Loading mode',
      options: LOADING_MODES,
      default: 'overlay',
      when: state => state.loading === true,
    },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
    { kind: 'boolean', key: 'block', label: 'Block', default: false },
  ],
  // The canonical review grid: every variant in every size.
  matrix: { rows: 'variant', cols: 'size' },
  examples: [
    {
      name: 'With icons',
      nameZh: '带图标',
      note: 'An icon sharpens scanning and never replaces the label — except the icon-only button, which must carry an aria-label instead.',
      noteZh: '图标帮助扫读，但不替代文字——纯图标按钮例外，它必须带 aria-label。',
      render: () => [
        h(Button, () => [h(Plus), 'New']),
        h(Button, { variant: 'secondary' }, () => ['Continue', h(ArrowRight)]),
        h(Button, { variant: 'ghost', size: 'icon', 'aria-label': 'Refresh' }, () => h(RefreshCw)),
      ],
      code: () => `<Button>
  <Plus />
  New
</Button>
<Button variant="secondary">
  Continue
  <ArrowRight />
</Button>
<Button variant="ghost" size="icon" aria-label="Refresh">
  <RefreshCw />
</Button>`,
    },
    {
      name: 'Loading modes',
      nameZh: '加载模式',
      note: 'overlay covers the whole label so width never shifts; icon and leading place the spinner where the eye already is. loading blocks clicks — busy is not disabled.',
      noteZh: 'overlay 覆盖整个标签、宽度不抖动;icon 和 leading 把 spinner 放在视线已在的位置。loading 会屏蔽点击——忙 ≠ 禁用。',
      render: () => [
        h(Button, { loading: true }, () => 'Save changes'),
        h(Button, { variant: 'secondary', loading: true, loadingMode: 'icon' }, () => [h(RefreshCw), 'Sync']),
        h(Button, { loading: true, loadingMode: 'leading' }, () => 'Continue'),
      ],
      code: () => `<Button loading>Save changes</Button>
<Button variant="secondary" loading loading-mode="icon">
  <RefreshCw />
  Sync
</Button>
<Button loading loading-mode="leading">Continue</Button>`,
    },
    {
      name: 'Icon buttons',
      nameZh: '图标按钮',
      note: 'Three square sizes for toolbars and chrome. No visible label, so the aria-label is the contract.',
      noteZh: '三个方形尺寸，用于工具栏和界面铬件。没有可见文字，aria-label 就是契约。',
      render: () => [
        h(Button, { size: 'icon-lg', 'aria-label': 'Add' }, () => h(Plus)),
        h(Button, { size: 'icon', 'aria-label': 'Add' }, () => h(Plus)),
        h(Button, { size: 'icon-sm', 'aria-label': 'Add' }, () => h(Plus)),
      ],
      code: () => `<Button size="icon-lg" aria-label="Add"><Plus /></Button>
<Button size="icon" aria-label="Add"><Plus /></Button>
<Button size="icon-sm" aria-label="Add"><Plus /></Button>`,
    },
  ],
  render: state =>
    h(
      Button,
      {
        variant: state.variant as never,
        size: state.size as never,
        loading: Boolean(state.loading),
        loadingMode: state.loadingMode as never,
        disabled: Boolean(state.disabled),
        block: Boolean(state.block),
        ...linkAttrs(state.variant),
      },
      () => String(state.label),
    ),
  code: (state) => {
    const variant = String(state.variant)
    const link = isLink(variant) ? ' as="a" href="#"' : ''
    const attrs
      = strAttr('variant', variant, 'default')
      + strAttr('size', String(state.size), 'default')
      + link
      + boolAttr('loading', Boolean(state.loading))
      + (state.loading ? strAttr('loading-mode', String(state.loadingMode), 'overlay') : '')
      + boolAttr('disabled', Boolean(state.disabled))
      + boolAttr('block', Boolean(state.block))
    return `<Button${attrs}>${state.label}</Button>`
  },
  usage: `Reach for variant + size, never hand-written classes.

- default/primary is the charcoal high-emphasis CTA — one per surface.
- brand purple is scarce: rare moments like the chat Send button, never a default fill.
- destructive is a filled red CTA, not a ghost button with red text.
- "Clickable text with a hover chip" is TextButton (ghost @ size="text"), not a hand-rolled hover on a span.
- Icon-only buttons must carry an aria-label.
- loading holds full color and blocks clicks; disabled fades to opacity-40. Busy ≠ disabled.`,
  usageZh: `用 variant + size 表达意图,永远别手写 class。

- default/primary 是深炭色高强调 CTA——一个界面最多一个。
- brand 紫是稀缺色:只留给聊天发送键这类极少数时刻,绝不做默认填充。
- destructive 是实心红 CTA,不是红字 ghost。
- "可点击、带 hover 衬底的文字"是 TextButton(ghost @ size="text"),不是给 span 手写 hover。
- 纯图标按钮必须带 aria-label。
- loading 保持全色并屏蔽点击;disabled 降到 opacity-40。忙 ≠ 禁用。`,
}
