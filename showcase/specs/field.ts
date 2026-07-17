import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/components/field'
import { Input } from '#/components/input'
import { boolAttr, strAttr } from '../lib/codegen'

const DESCRIPTION = 'Shown in the bot list and search.'
const ERROR = 'That name is already taken.'

export const fieldSpec: ComponentSpec = {
  id: 'field',
  name: 'Field',
  description:
    'Label + control + description + error on one rhythm, with for/aria wiring provided automatically by the wrapper.',
  controls: [
    { kind: 'string', key: 'label', label: 'Label', default: 'Bot name' },
    { kind: 'boolean', key: 'required', label: 'Required', default: false },
    { kind: 'boolean', key: 'description', label: 'Description', default: true },
    { kind: 'boolean', key: 'invalid', label: 'Invalid', default: false },
    { kind: 'string', key: 'placeholder', label: 'Placeholder', default: 'e.g. Research assistant' },
  ],
  render: state =>
    h(Field, { invalid: Boolean(state.invalid), class: 'w-80' }, () => [
      h(FieldLabel, { required: Boolean(state.required) }, () => String(state.label)),
      h(FieldControl, null, () => h(Input, { placeholder: String(state.placeholder) })),
      state.description ? h(FieldDescription, null, () => DESCRIPTION) : undefined,
      state.invalid ? h(FieldError, null, () => ERROR) : undefined,
    ]),
  code: (state) => {
    const lines = [
      `<Field${boolAttr('invalid', Boolean(state.invalid))}>`,
      `  <FieldLabel${boolAttr('required', Boolean(state.required))}>${state.label}</FieldLabel>`,
      '  <FieldControl>',
      `    <Input${strAttr('placeholder', String(state.placeholder), '')} />`,
      '  </FieldControl>',
    ]
    if (state.description) lines.push(`  <FieldDescription>${DESCRIPTION}</FieldDescription>`)
    if (state.invalid) lines.push(`  <FieldError>${ERROR}</FieldError>`)
    lines.push('</Field>')
    return lines.join('\n')
  },
  usage: `Always wrap form controls in Field — the label's for, the description/error aria-describedby, and the invalid styling all come from its context.

- FieldError only renders when there IS an error; its presence alone flips the field to invalid (no separate invalid prop needed for that path).
- Required marks are i18n-agnostic: pass requiredText/optionalText or slot the affordance.
- horizontal orientation is for compact settings rows; vertical is the default form stack.`,
}
