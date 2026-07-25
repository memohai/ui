<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from './PageHeader.vue'

// PageShell — the page frame: one owner for the title block, the right-side
// actions, and the body, so every surface lands on the same left and right
// edges. Lifted from the host app (apps/web/components/page-shell, now a
// re-export shim); the title block itself is the shared PageHeader.
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  // 'page' is a standalone surface that owns the full gutter. 'tab' lives
  // inside the bot-detail tab container (which already adds px-6 pt-4 pb-4),
  // so it only adds the remainder to reach the same pt-10/pb-12 vertical
  // rhythm.
  variant?: 'page' | 'tab'
}>(), {
  title: '',
  description: '',
  variant: 'page',
})

const rootClass = computed(() =>
  props.variant === 'tab'
    ? 'mx-auto max-w-3xl pt-6 pb-8'
    : 'mx-auto max-w-3xl px-6 pt-10 pb-12',
)
</script>

<template>
  <div :class="rootClass">
    <PageHeader
      :title="title"
      :description="description"
      :level="1"
      framed
    >
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
    </PageHeader>
    <slot />
  </div>
</template>
