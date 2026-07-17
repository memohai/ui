<script setup lang="ts">
// The ONE "selectable list row" shape — sidebar nav pages and the Controls
// panel's radio-list options. Active is carried by [data-ui-selected], whose
// --selected-bg fill comes from the standalone rule in style.css
// ([data-ui-selected]:not([data-button)]) — no per-call-site selected class.
// Hover is deliberately suppressed on the active row: --selected-bg sits one
// ladder rung above --ui-hover precisely so a selected row never reads lighter
// than a merely-hovered one (AGENTS.md § Selected state).
defineProps<{ active?: boolean, disabled?: boolean }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-control text-foreground disabled:pointer-events-none disabled:opacity-40"
    :class="active ? '' : 'hover:bg-(--ui-hover)'"
    :data-ui-selected="active ? '' : undefined"
    :disabled="disabled"
    @click="$emit('select')"
  >
    <slot />
  </button>
</template>
