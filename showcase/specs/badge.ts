import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Check } from 'lucide-vue-next'
import { Badge, badgeFontKeys, badgeSizeKeys, badgeVariantKeys } from '#/components/badge'
import { strAttr } from '../lib/codegen'

export const badgeSpec: ComponentSpec = {
  id: 'badge',
  name: 'Badge',
  description:
    'A calm status chip: flat soft-tint fill, no border, same-hue deep text. Status hues come from the accent palette and auto-adapt to dark mode.',
  descriptionZh:
    '安静的状态徽章:柔和浅色填充、无描边、同色系深色文字。状态色取自 accent 色板,暗色模式自动适配。',
  controls: [
    { kind: 'enum', key: 'variant', label: 'Variant', options: badgeVariantKeys, default: 'default' },
    { kind: 'enum', key: 'size', label: 'Size', options: badgeSizeKeys, default: 'default', display: 'radio-list' },
    { kind: 'enum', key: 'font', label: 'Font', options: badgeFontKeys, default: 'sans', display: 'radio-list' },
    { kind: 'string', key: 'label', label: 'Label', default: 'Beta' },
  ],
  matrix: { rows: 'variant', cols: 'size' },
  examples: [
    {
      name: 'With icon',
      nameZh: '带图标',
      render: () => [
        h(Badge, { variant: 'success' }, () => [h(Check), 'Deployed']),
        h(Badge, { variant: 'warning' }, () => [h(Check), 'Pending']),
        h(Badge, { variant: 'destructive' }, () => [h(Check), 'Failed']),
      ],
      code: () => `<Badge variant="success">
  <Check />
  Deployed
</Badge>`,
    },
    {
      name: 'Technical values',
      nameZh: '技术值',
      state: { font: 'mono', label: '0 4 * * *' },
      code: () => '<Badge font="mono">0 4 * * *</Badge>',
    },
  ],
  render: state =>
    h(
      Badge,
      {
        variant: state.variant as never,
        size: state.size as never,
        font: state.font as never,
      },
      () => String(state.label),
    ),
  code: (state) => {
    const attrs
      = strAttr('variant', String(state.variant), 'default')
      + strAttr('size', String(state.size), 'default')
      + strAttr('font', String(state.font), 'sans')
    return `<Badge${attrs}>${state.label}</Badge>`
  },
  usage: `A Badge is a READ-ONLY status chip — never a button, never a filter pick. If it needs a click, it is a Button or a Toggle.

- Status hues carry meaning (success / warning / destructive); default and secondary are neutral. Do not invent new hues per page.
- font="mono" is for technical values only: cron patterns, match scores, provider keys.
- The chip sizes itself to content (w-fit) — do not stretch it.`,
  usageZh: `Badge 是只读状态徽章——绝不是按钮,也不是筛选器。需要点击就用 Button 或 Toggle。

- 状态色承载语义(success / warning / destructive);default 和 secondary 是中性的。不要按页面自造新色。
- font="mono" 只给技术值:cron 表达式、匹配分、provider key。
- 徽章按内容自适应宽度(w-fit)——不要拉伸。`,
}
