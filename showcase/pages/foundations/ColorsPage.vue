<script setup lang="ts">
import { COLOR_SECTIONS } from '../../lib/color-catalog'
import { tt } from '../../lib/i18n'
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
        {{ tt(section.title, section.titleZh) }}
      </h2>
      <div class="grid grid-cols-2 gap-6">
        <div class="p-3">
          <div class="mb-2 text-caption text-muted-foreground">
            {{ tt('Light', '亮色') }}
          </div>
          <ColorSectionColumn :section="section" />
        </div>
        <div class="dark rounded-lg bg-background p-3">
          <div class="mb-2 text-caption text-muted-foreground">
            {{ tt('Dark', '暗色') }}
          </div>
          <ColorSectionColumn :section="section" />
        </div>
      </div>
    </section>
  </div>
</template>
