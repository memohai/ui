<script setup lang="ts">
import { computed } from 'vue'

// PageHeader — the ONE title + subtitle pair: a strong foreground title with
// a muted line directly under it (the host PageShell's title block: text-lg
// semibold / text-sm muted / mt-0.5 / pl-2 — here in library rungs). Both
// PageShell (the page frame) and SectionGroup's heading mode (doc-spine
// section headings) compose this same component, so a section header can
// never drift from the page header it mirrors — "looks alike" is not reuse.
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  // Semantic level only — visuals are identical. 1 for the page title, 2 for
  // section headings.
  level?: 1 | 2
  // framed: the page-level furniture — a min-h-9 title row (the action-button
  // height, so the title's vertical position is identical with or without
  // actions and never jumps when switching tabs) and an mb-6 header→body
  // gap. The description stays a sibling BELOW the row so a subtitle grows
  // the header downward without nudging the title off its shared baseline.
  // Section headings leave it off.
  framed?: boolean
  // inset: pl-2 on the title/subtitle — the text-column offset relative to a
  // flush surface below. Off for bare sections (no surface to offset from).
  inset?: boolean
}>(), {
  title: '',
  description: '',
  level: 2,
  framed: false,
  inset: true,
})

const tag = computed(() => `h${props.level}` as 'h1' | 'h2')
</script>

<template>
  <div :class="framed ? 'mb-6' : ''">
    <div :class="[framed || $slots.actions ? 'flex items-center justify-between gap-4' : '', framed ? 'min-h-9' : '']">
      <component
        :is="tag"
        class="min-w-0 truncate text-heading font-semibold text-foreground"
        :class="inset ? 'pl-2' : ''"
      >
        {{ title }}
      </component>
      <div
        v-if="$slots.actions"
        class="flex shrink-0 items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>
    <p
      v-if="description"
      class="mt-0.5 text-control text-muted-foreground"
      :class="inset ? 'pl-2' : ''"
    >
      {{ description }}
    </p>
  </div>
</template>
