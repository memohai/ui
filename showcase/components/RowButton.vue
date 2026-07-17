<script setup lang="ts">
// The ONE "selectable list row" shape — sidebar nav pages, the Overview board,
// and the Controls panel's example/option lists. Active is carried by
// [data-ui-selected], whose --selected-bg fill comes from the standalone rule
// in style.css ([data-ui-selected]:not([data-button)]) — the same row pattern
// the app's session list uses. Geometry mirrors that list: a fixed 2rem row
// (h-8), and the PARENT owns a 2px seam between rows (gap-0.5) so adjacent
// selected/hover fills never fuse into one block.
// Hover is deliberately suppressed on the active row: --selected-bg sits one
// ladder rung above --ui-hover precisely so a selected row never reads lighter
// than a merely-hovered one (AGENTS.md § Selected state).
defineProps<{ active?: boolean, disabled?: boolean }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex h-8 w-full cursor-pointer items-center rounded-md px-2.5 text-left text-control text-foreground disabled:pointer-events-none disabled:opacity-40"
    :class="active ? '' : 'hover:bg-(--ui-hover)'"
    :data-ui-selected="active ? '' : undefined"
    :disabled="disabled"
    @click="$emit('select')"
  >
    <slot />
  </button>
</template>
