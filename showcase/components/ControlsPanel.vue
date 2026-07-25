<script setup lang="ts">
import type { ComponentSpec, ControlSpec, EnumControl } from '../lib/spec'
import { Input } from '#/components/input'
import { NumberField } from '#/components/number-field'
import { SegmentedControl } from '#/components/segmented'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '#/components/select'
import { SettingsRow, SettingsSection } from '#/components/settings'
import { Switch } from '#/components/switch'

// The Playground's control board — sits on the page directly above the canvas
// (the page spine is: intro → controls → playground → example sections). It
// COMPOSES the settings owner vocabulary (SettingsSection + SettingsRow) —
// the same components the host's settings pages use, never a transcribed
// lookalike. Widgets sit in the row's trailing slot at DEFAULT sizes (sm
// reads as cramped chrome — this board is content, not chrome). Short enums
// (≤5 options) render as the library SegmentedControl; longer lists use the
// Select. A spec can force either via the control's `display` option.
const props = defineProps<{
  spec: ComponentSpec
  state: Record<string, string | number | boolean>
}>()

const emit = defineEmits<{
  set: [key: string, value: string | number | boolean]
}>()

// Inapplicable controls render disabled-in-place (opacity-40, the contract's
// disabled treatment) rather than unmounting — the row order stays stable
// while toggling a prerequisite like "Loading".
function enabled(c: ControlSpec): boolean {
  return !c.when || c.when(props.state)
}

function enumDisplay(c: EnumControl): 'segmented' | 'select' {
  return c.display ?? (c.options.length <= 5 ? 'segmented' : 'select')
}
</script>

<template>
  <SettingsSection>
    <SettingsRow
      v-for="c in spec.controls"
      :key="c.key"
      :label="c.label"
      :class="{ 'pointer-events-none opacity-40': !enabled(c) }"
    >
      <SegmentedControl
        v-if="c.kind === 'enum' && enumDisplay(c) === 'segmented'"
        :model-value="String(state[c.key])"
        :items="c.options.map(o => ({ value: o, label: o }))"
        :aria-label="c.label"
        @update:model-value="emit('set', c.key, String($event))"
      />
      <Select
        v-else-if="c.kind === 'enum'"
        :model-value="String(state[c.key])"
        @update:model-value="emit('set', c.key, String($event))"
      >
        <SelectTrigger class="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="opt in c.options"
            :key="opt"
            :value="opt"
          >
            <SelectItemText>{{ opt }}</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
      <Switch
        v-else-if="c.kind === 'boolean'"
        :model-value="Boolean(state[c.key])"
        @update:model-value="emit('set', c.key, $event)"
      />
      <NumberField
        v-else-if="c.kind === 'number'"
        class="w-56"
        :min="c.min"
        :max="c.max"
        :model-value="Number(state[c.key])"
        @update:model-value="emit('set', c.key, $event)"
      />
      <Input
        v-else
        class="w-56"
        :model-value="String(state[c.key])"
        :placeholder="c.placeholder"
        @update:model-value="emit('set', c.key, String($event))"
      />
    </SettingsRow>
  </SettingsSection>
</template>
