import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { SegmentedControl } from '#/components/segmented'
import type { SegmentedItem } from '#/components/segmented'

const BASIC_ITEMS: SegmentedItem<string>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const FOUR_ITEMS: SegmentedItem<string>[] = [...BASIC_ITEMS, { value: 'year', label: 'Year' }]

const DISABLED_ITEMS: SegmentedItem<string>[] = [
  ...BASIC_ITEMS,
  { value: 'year', label: 'Year', disabled: true },
]

function itemsCode(items: SegmentedItem<string>[]): string {
  return items
    .map(i => `  { value: '${i.value}', label: '${i.label}'${i.disabled ? ', disabled: true' : ''} },`)
    .join('\n')
}

export const segmentedSpec: ComponentSpec = {
  id: 'segmented',
  name: 'SegmentedControl',
  description:
    'One value picked from a short row, with the elevated sliding thumb. A mode/filter selector — it owns no panels.',
  descriptionZh:
    '从短行中选一个值，滑块拇指带浮起感。它是模式/筛选选择器——不拥有面板。',
  controls: [
    { kind: 'enum', key: 'value', label: 'Value', options: BASIC_ITEMS.map(i => i.value), default: 'week', display: 'radio-list' },
  ],
  examples: [
    {
      name: 'Four items',
      nameZh: '四个选项',
      state: { value: 'month' },
      render: state =>
        h(SegmentedControl, {
          items: FOUR_ITEMS,
          ariaLabel: 'Time range',
          modelValue: String(state.value),
          'onUpdate:modelValue': (v: unknown) => (state.value = String(v)),
        }),
      code: () => `<SegmentedControl
  v-model="range"
  :items="[
${itemsCode(FOUR_ITEMS)}
  ]"
  aria-label="Time range"
/>`,
    },
    {
      name: 'With a disabled item',
      nameZh: '含禁用项',
      state: { value: 'week' },
      render: state =>
        h(SegmentedControl, {
          items: DISABLED_ITEMS,
          ariaLabel: 'Time range',
          modelValue: String(state.value),
          'onUpdate:modelValue': (v: unknown) => (state.value = String(v)),
        }),
      code: () => `<SegmentedControl
  v-model="range"
  :items="[
${itemsCode(DISABLED_ITEMS)}
  ]"
  aria-label="Time range"
/>`,
    },
  ],
  render: state =>
    h(SegmentedControl, {
      items: BASIC_ITEMS,
      ariaLabel: 'Time range',
      modelValue: String(state.value),
      'onUpdate:modelValue': (v: unknown) => (state.value = String(v)),
    }),
  code: () => `<SegmentedControl
  v-model="range"
  :items="[
${itemsCode(BASIC_ITEMS)}
  ]"
  aria-label="Time range"
/>`,
  usage: `SegmentedControl ≠ Tabs. Segmented returns ONE value (role="radiogroup") and owns no content; Tabs switch panels and carry the tab a11y contract.

- Day/Week/Month, List/Board, view toggles → SegmentedControl.
- Switching panels of content → Tabs (underline style, never re-skinned as a pill).
- The thumb is measured from the active item — widths just work, don't force equal widths.`,
  usageZh: `SegmentedControl ≠ Tabs。Segmented 返回一个值(role="radiogroup"),不拥有内容;Tabs 切换面板并携带 tab 无障碍契约。

- 日/周/月、列表/看板、视图切换 → SegmentedControl。
- 切换内容面板 → Tabs(下划线样式,永远不要重画成药丸)。
- 滑块拇指从激活项实测定位——宽度自然对齐,不要强行等宽。`,
}
