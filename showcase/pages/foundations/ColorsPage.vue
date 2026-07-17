<script setup lang="ts">
import { COLOR_SECTIONS } from '../../lib/color-catalog'
import ColorSectionColumn from '../../components/ColorSectionColumn.vue'

// Every swatch reads its value live from the cascade, so this page follows the
// global theme/scheme pickers for free. The Dark column is a `.dark`-wrapped
// subtree (@custom-variant dark is scoped: `&:is(.dark *)`) — dark tokens
// resolve inside it without touching the page theme.
</script>

<template>
  <div class="mx-auto max-w-6xl p-8">
    <section
      v-for="section in COLOR_SECTIONS"
      :key="section.title"
      class="mb-10 last:mb-0"
    >
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ section.title }}
      </h2>
      <div class="grid grid-cols-2 gap-6">
        <div class="p-3">
          <div class="mb-2 text-caption text-muted-foreground">
            Light
          </div>
          <ColorSectionColumn :section="section" />
        </div>
        <div class="dark rounded-lg bg-background p-3">
          <div class="mb-2 text-caption text-muted-foreground">
            Dark
          </div>
          <ColorSectionColumn :section="section" />
        </div>
      </div>
    </section>
  </div>
</template>
