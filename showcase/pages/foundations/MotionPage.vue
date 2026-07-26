<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
import SpecimenTable from '../../components/SpecimenTable.vue'
import SpecimenRow from '../../components/SpecimenRow.vue'
</script>

<template>
  <PageShell
    width="md"
    :title="tt('Motion', '动效')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        bare
        :title="tt('Duration palette', '时长调色板')"
        :description="tt(
          'Durations aren\'t tokenized — the palette is law by convention (AGENTS.md § Motion). Hover a row to feel it.',
          '时长没有令牌化——这份调色板是约定之法(AGENTS.md § Motion)。hover 任意一行感受它。',
        )"
      >
        <SpecimenTable>
          <!-- `group` rides through class fallthrough: the row is the hover
               target that animates the bar and relights the label. -->
          <SpecimenRow
            v-for="d in MOTION_DURATIONS"
            :key="d.ms"
            align="center"
            class="group"
          >
            <span class="text-body text-muted-foreground group-hover:text-foreground">{{ tt(d.what, d.whatZh) }}</span>
            <span class="flex items-center gap-3">
              <span
                class="inline-block h-2 w-8 rounded-sm transition-[width] ease-out group-hover:w-24"
                :style="{ background: 'var(--accent-blue)', transitionDuration: `${d.ms}ms` }"
              />
              <span class="w-14 text-right font-mono text-body text-foreground">{{ d.ms }}ms</span>
            </span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Easings', '缓动')"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="e in MOTION_EASINGS"
            :key="e.name"
          >
            <span class="text-body text-foreground">{{ e.name }}</span>
            <span class="text-right font-mono text-caption text-muted-foreground">{{ e.value }} · {{ tt(e.what, e.whatZh) }}</span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Tailwind v4 gotcha', 'Tailwind v4 陷阱')"
      >
        <p class="text-control text-muted-foreground">
          {{ tt(
            'v4 maps translate-x/y, scale, and rotate to the standalone CSS properties — NOT transform. A transition: transform won\'t animate them (it snaps). Transition the actual property: transition: translate.',
            'v4 把 translate-x/y、scale、rotate 映射到独立的 CSS 属性——不是 transform。对 transform 做过渡不会生效(会瞬跳)。要对真实属性做过渡:transition: translate。',
          ) }}
        </p>
      </SectionGroup>
    </div>
  </PageShell>
</template>
