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
  // The measure (content column width). 'md' is the reading column every host
  // page uses (max-w-3xl). 'lg'/'xl' exist for board-style pages whose content
  // is a grid of specimens, not prose (the showcase's foundations/Overview
  // pages). Never hand-set max-w on a page — if none of the three fits, that
  // is a new tier to legislate here, not a class to write at the call site.
  width?: 'md' | 'lg' | 'xl'
}>(), {
  title: '',
  description: '',
  variant: 'page',
  width: 'md',
})

const MAX_W = { md: 'max-w-3xl', lg: 'max-w-4xl', xl: 'max-w-5xl' } as const

const rootClass = computed(() =>
  props.variant === 'tab'
    ? `mx-auto ${MAX_W[props.width]} pt-6 pb-8`
    : `mx-auto ${MAX_W[props.width]} px-6 pt-10 pb-12`,
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
