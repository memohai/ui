<script setup lang="ts">
import { computed } from 'vue'

// PageHeader — the ONE title + subtitle pair: a strong foreground title with
// a muted line directly under it (the host PageShell's title block: text-lg
// semibold / text-sm muted / mt-0.5 — here in library rungs). The page intro
// and every doc-spine section heading compose this SAME component, so a
// section header can never drift from the page header it mirrors — "looks
// alike" is not reuse.
const props = withDefaults(defineProps<{
  title: string
  description?: string
  // Semantic level only — visuals are identical. 1 for the page intro, 2 for
  // section headings.
  level?: 1 | 2
}>(), {
  description: '',
  level: 2,
})

const tag = computed(() => `h${props.level}` as 'h1' | 'h2')
</script>

<template>
  <div class="min-w-0">
    <component
      :is="tag"
      class="text-heading font-semibold text-foreground"
    >
      {{ title }}
    </component>
    <p
      v-if="description"
      class="mt-0.5 text-control text-muted-foreground"
    >
      {{ description }}
    </p>
  </div>
</template>
