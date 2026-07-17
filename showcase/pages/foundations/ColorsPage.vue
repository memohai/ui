<script setup lang="ts">
import { COLOR_SECTIONS } from '../../lib/color-catalog'
import { tt } from '../../lib/i18n'
import ColorStack from '../../components/ColorStack.vue'

// Every bar reads its value live from the cascade, so the page follows the
// sidebar's theme/scheme pickers for free — there is deliberately no static
// Light/Dark split: the pickers ARE the comparison tool.
</script>

<template>
  <div class="mx-auto max-w-5xl p-8">
    <p class="mb-8 max-w-xl text-body text-muted-foreground">
      {{ tt(
        'Every bar reads its token live from the cascade — switch theme or scheme in the sidebar and the page follows. Hover for the resolved value; click to copy the token name.',
        '每个色条都实时读取级联中的 token——在侧栏切换主题或配色,整页跟随。悬停查看解析值,点击复制 token 名。',
      ) }}
    </p>
    <section
      v-for="section in COLOR_SECTIONS"
      :key="section.title"
      class="mb-10 last:mb-0"
    >
      <h2 class="mb-4 text-label font-medium text-foreground">
        {{ tt(section.title, section.titleZh) }}
      </h2>
      <div
        class="grid gap-5"
        :class="section.families.length > 1 ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2'"
      >
        <div
          v-for="(family, i) in section.families"
          :key="family.label ?? i"
        >
          <div
            v-if="family.label"
            class="mb-1.5 text-caption text-muted-foreground"
          >
            {{ tt(family.label, family.labelZh) }}
          </div>
          <ColorStack :rows="family.rows" />
        </div>
      </div>
    </section>
  </div>
</template>
