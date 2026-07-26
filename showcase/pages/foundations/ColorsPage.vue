<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { COLOR_SECTIONS } from '../../lib/color-catalog'
import { tt } from '../../lib/i18n'
import ColorStack from '../../components/ColorStack.vue'

// Every bar reads its value live from the cascade, so the page follows the
// sidebar's theme/scheme pickers for free — there is deliberately no static
// Light/Dark split: the pickers ARE the comparison tool.
// Layout: single-family sections share the two-column page grid side by side;
// multi-family sections (Status / Accent / Domain) span the full row with
// their own inner family grid.
</script>

<template>
  <PageShell
    width="xl"
    :title="tt('Colors', '颜色')"
    :description="tt(
      'Every bar reads its token live from the cascade — switch theme or scheme in the sidebar and the page follows. Hover for the resolved value; click to copy the token name.',
      '每个色条都实时读取级联中的 token——在侧栏切换主题或配色,整页跟随。悬停查看解析值,点击复制 token 名。',
    )"
  >
    <!-- Section rhythm (gap-y-8) between grid cells; the horizontal gutter is
         the specimen-card relationship below. -->
    <div class="grid gap-x-5 gap-y-8 sm:grid-cols-2">
      <SectionGroup
        v-for="section in COLOR_SECTIONS"
        :key="section.title"
        heading
        :title="tt(section.title, section.titleZh)"
        :class="{ 'sm:col-span-2': section.families.length > 1 }"
      >
        <!-- Sibling specimen CARDS keep gap-5 — a tighter relationship than
             the gap-8 section rhythm: the cards carry their own borders, so
             20px keeps one family reading as a unit. -->
        <div
          class="grid gap-5"
          :class="section.families.length > 1 ? 'sm:grid-cols-2 xl:grid-cols-3' : ''"
        >
          <div
            v-for="(family, i) in section.families"
            :key="family.label ?? i"
          >
            <!-- The family label is the same relationship as a matrix axis
                 label (text-body medium muted), hugging its stack. -->
            <div
              v-if="family.label"
              class="mb-1.5 text-body font-medium text-muted-foreground"
            >
              {{ tt(family.label, family.labelZh) }}
            </div>
            <ColorStack :rows="family.rows" />
          </div>
        </div>
      </SectionGroup>
    </div>
  </PageShell>
</template>
