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
  controls: [
    { kind: 'enum', key: 'value', label: 'Value', options: BASIC_ITEMS.map(i => i.value), default: 'week', display: 'radio-list' },
  ],
  examples: [
    {
      name: 'Four items',
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
}
