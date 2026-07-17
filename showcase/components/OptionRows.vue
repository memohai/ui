<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { menuItemClass } from '#/lib/menu'

// Radio-style option lists (the Controls panel's examples + short enums) use
// the menu row language verbatim: menuItemClass is the single source for row
// geometry + hover highlight, and selection shows as a check indicator, never
// a row background (AGENTS.md § Selected state). Two deliberate deltas from
// menuItemClass's defaults: cursor-pointer (menus use cursor-default because
// highlight follows the pointer; these rows are plain buttons) and
// disabled: variants (menuItemClass keys off reka's data-[disabled], which a
// plain <button disabled> never gets).
// Sidebar nav rows are the OTHER vocabulary (RowButton + [data-ui-selected])
// — do not mix the two.
export interface OptionRow {
  value: string
  label: string
  disabled?: boolean
}

defineProps<{ options: OptionRow[], modelValue?: string }>()
const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <div
    role="radiogroup"
    class="flex flex-col gap-0.5"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === opt.value"
      :class="[menuItemClass, 'cursor-pointer hover:bg-(--ui-selected) disabled:pointer-events-none disabled:opacity-40']"
      :disabled="opt.disabled"
      @click="emit('select', opt.value)"
    >
      <span class="flex-1 truncate">{{ opt.label }}</span>
      <Check
        v-if="modelValue === opt.value"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
