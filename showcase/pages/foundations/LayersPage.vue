<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { Z_LADDER } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
import SpecimenTable from '../../components/SpecimenTable.vue'
import SpecimenRow from '../../components/SpecimenRow.vue'
</script>

<template>
  <PageShell
    width="md"
    :title="tt('Layers', '层级')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        bare
        :title="tt('Five tiers', '五档')"
        :description="tt(
          'Consume as z-(--z-overlay) or var(--z-overlay). There is no in-between tier — wanting one is a design question, not a number to invent. The one exception is toast: raw 9999, deliberately uncapped so it beats the --z-top lightbox too.',
          '消费方式是 z-(--z-overlay) 或 var(--z-overlay)。没有中间档——想要中间值是设计问题,不是随手造个数字。唯一的例外是 toast:裸 9999,刻意不设上限,确保连 --z-top 灯箱也压得住。',
        )"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="z in Z_LADDER"
            :key="z.token"
          >
            <span class="font-mono text-body text-foreground">{{ z.token }} · {{ z.value }}</span>
            <span class="text-right text-body text-muted-foreground">{{ tt(z.role, z.roleZh) }}</span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>

      <SectionGroup
        heading
        :title="tt('The stack, visually', '可视化堆叠')"
      >
        <!-- One-off demo figure, page-unique: absolutely-positioned cards
             stepped across a fixed-height stage so the z tiers read as a
             physical stack — a demonstration stage, not a general layout
             vocabulary. -->
        <div class="relative h-48">
          <div
            v-for="(z, i) in Z_LADDER"
            :key="z.token"
            class="absolute flex h-24 w-40 items-center justify-center rounded-md border border-border bg-card font-mono text-caption text-foreground"
            :style="{ left: `${i * 5.5}rem`, top: `${i * 1.25}rem`, zIndex: `var(${z.token})`, boxShadow: 'var(--shadow-dropdown)' }"
          >
            {{ z.token }}
          </div>
        </div>
      </SectionGroup>
    </div>
  </PageShell>
</template>
