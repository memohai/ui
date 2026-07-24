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

// The Playground's inline control grid — sits on the page directly above the
// canvas (the page spine is: intro → controls → playground → example
// sections). Every control is one grid cell: label on top, widget below.
// Short enums (≤5 options) render as the library SegmentedControl — one click,
// all options visible; longer lists use the Select. A spec can force either
// via the control's `display` option.
const props = defineProps<{
  spec: ComponentSpec
  state: Record<string, string | number | boolean>
}>()

const emit = defineEmits<{
  set: [key: string, value: string | number | boolean]
}>()

// Inapplicable controls render disabled-in-place (opacity-40, the contract's
// disabled treatment) rather than unmounting — the grid stays stable while
// toggling a prerequisite like "Loading".
function enabled(c: ControlSpec): boolean {
  return !c.when || c.when(props.state)
}

function enumDisplay(c: EnumControl): 'segmented' | 'select' {
  return c.display ?? (c.options.length <= 5 ? 'segmented' : 'select')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="c in spec.controls"
      :key="c.key"
      :class="{ 'pointer-events-none opacity-40': !enabled(c) }"
    >
      <div
        class="mb-1 text-body font-medium"
        :class="enabled(c) ? 'text-foreground' : 'text-muted-foreground'"
      >
        {{ c.label }}
      </div>
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
        <SelectTrigger
          size="sm"
          class="w-full"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent size="sm">
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
        size="sm"
        :model-value="Boolean(state[c.key])"
        @update:model-value="emit('set', c.key, $event)"
      />
      <NumberField
        v-else-if="c.kind === 'number'"
        size="sm"
        class="w-full"
        :min="c.min"
        :max="c.max"
        :model-value="Number(state[c.key])"
        @update:model-value="emit('set', c.key, $event)"
      />
      <Input
        v-else
        size="sm"
        class="w-full"
        :model-value="String(state[c.key])"
        :placeholder="c.placeholder"
        @update:model-value="emit('set', c.key, String($event))"
      />
    </div>
  </div>
</template>
