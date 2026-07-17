import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Label } from '#/components/label'
import { Switch } from '#/components/switch'
import { boolAttr, strAttr } from '../lib/codegen'

const SIZES = ['default', 'sm'] as const

export const switchSpec: ComponentSpec = {
  id: 'switch',
  name: 'Switch',
  description:
    'Binary on/off control. The checked state is the one selection blue — a solid fill, not a border.',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default', display: 'radio-list' },
    { kind: 'boolean', key: 'checked', label: 'Checked', default: true },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
    { kind: 'string', key: 'label', label: 'Label', default: 'Enable heartbeat' },
  ],
  render: state =>
    h('div', { class: 'flex items-center gap-2' }, [
      h(Switch, {
        id: 'showcase-switch',
        size: state.size as never,
        disabled: Boolean(state.disabled),
        // Two-way: the canvas switch and the Checked control drive each other.
        modelValue: Boolean(state.checked),
        'onUpdate:modelValue': (v: boolean) => (state.checked = v),
      }),
      h(Label, { for: 'showcase-switch' }, () => String(state.label)),
    ]),
  code: (state) => {
    const attrs
      = strAttr('size', String(state.size), 'default')
      + (state.checked ? ' model-value="true"' : '')
      + boolAttr('disabled', Boolean(state.disabled))
    return `<Switch${attrs} />`
  },
  usage: `On = --accent-blue-fill, applied as a solid fill. Never restyle the checked state per call site.

- Always pair with a Label (or an aria-label) — a bare switch announces nothing.
- Settings rows put the switch in the row's control column; the row label is the switch's label.
- Disabled fades the whole control to opacity-40 — no muddy gray track.`,
}
