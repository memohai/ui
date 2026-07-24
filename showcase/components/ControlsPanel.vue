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
import { Switch } from '#/components/switch'

// The Playground's control board — sits on the page directly above the canvas
// (the page spine is: intro → controls → playground → example sections). The
// board MIRRORS the host app's settings vocabulary (the showcase may not
// import the host's SettingsSection/SettingsRow, so the geometry is
// transcribed, not composed): a rounded-[--radius-menu-shell] bg-card shell,
// rows at mx-4 min-h-[3.75rem] py-3 with an inset border-b hairline
// (last:border-b-0), label in text-control font-medium, trailing control at
// ml-4 shrink-0, widgets at DEFAULT sizes (sm reads as cramped chrome — this
// board is content, not chrome). Short enums (≤5 options) render as the
// library SegmentedControl; longer lists use the Select. A spec can force
// either via the control's `display` option.
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
  <div class="overflow-hidden rounded-[var(--radius-menu-shell)] border border-border bg-card">
    <div
      v-for="c in spec.controls"
      :key="c.key"
      class="mx-4 flex min-h-[3.75rem] items-center border-b border-border py-3 last:border-b-0"
      :class="{ 'pointer-events-none opacity-40': !enabled(c) }"
    >
      <div class="min-w-0 flex-1">
        <label
          class="truncate text-control font-medium"
          :class="enabled(c) ? 'text-foreground' : 'text-muted-foreground'"
        >{{ c.label }}</label>
      </div>
      <div class="ml-4 shrink-0">
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
      </div>
    </div>
  </div>
</template>
