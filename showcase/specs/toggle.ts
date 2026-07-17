import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Bold } from 'lucide-vue-next'
import { Toggle, toggleSizeKeys, toggleVariantKeys } from '#/components/toggle'
import { boolAttr, strAttr } from '../lib/codegen'

export const toggleSpec: ComponentSpec = {
  id: 'toggle',
  name: 'Toggle',
  description:
    'A pressed/unpressed button for toolbar-style flags (bold, pin, mute). It is its own persistent choice — no indicator slot.',
  controls: [
    { kind: 'enum', key: 'variant', label: 'Variant', options: toggleVariantKeys, default: 'default', display: 'radio-list' },
    { kind: 'enum', key: 'size', label: 'Size', options: toggleSizeKeys, default: 'default' },
    { kind: 'boolean', key: 'pressed', label: 'Pressed', default: true },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  render: state =>
    h(
      Toggle,
      {
        variant: state.variant as never,
        size: state.size as never,
        disabled: Boolean(state.disabled),
        'aria-label': 'Bold',
        modelValue: Boolean(state.pressed),
        'onUpdate:modelValue': (v: boolean) => (state.pressed = v),
      },
      () => h(Bold),
    ),
  code: (state) => {
    const attrs
      = strAttr('variant', String(state.variant), 'default')
      + strAttr('size', String(state.size), 'default')
      + (state.pressed ? ' model-value="true"' : '')
      + boolAttr('disabled', Boolean(state.disabled))
    return `<Toggle${attrs} aria-label="Bold">
  <Bold />
</Toggle>`
  },
  usage: `Toggle's ON state is the "selected state" (§ Selected state in AGENTS.md): durable chrome on the control itself.

- tint uses brand purple — rationed; the default neutral on-state covers almost every toolbar flag.
- Always an aria-label when the content is an icon.
- For switching PANELS use Tabs; for picking ONE value from a row of options use SegmentedControl. Toggle is one independent flag.`,
}
