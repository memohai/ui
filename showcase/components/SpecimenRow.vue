<script setup lang="ts">
// SpecimenRow — one row inside a SpecimenTable: flex justify-between with the
// inset hairline that disappears on the last row. `align` and `pad` are the
// only two axes the foundations pages ever used; anything else goes through
// the default slot / class fallthrough (e.g. Motion's `group` hover row).
withDefaults(defineProps<{
  align?: 'baseline' | 'center'
  pad?: 'sm' | 'md'
}>(), {
  align: 'baseline',
  pad: 'sm',
})
</script>

<template>
  <div
    class="flex justify-between gap-6 border-b border-border-soft last:border-b-0"
    :class="[align === 'center' ? 'items-center' : 'items-baseline', pad === 'md' ? 'py-3' : 'py-2']"
  >
    <slot />
  </div>
</template>
