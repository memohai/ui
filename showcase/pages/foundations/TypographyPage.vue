<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { FONT_STACKS, TYPE_SCALE, WEIGHT_ROLES } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
import SpecimenTable from '../../components/SpecimenTable.vue'
import SpecimenRow from '../../components/SpecimenRow.vue'

const SPECIMEN = 'Design the conversation, not just the chat.'
const SPECIMEN_ZH = '设计的不是聊天，而是对话本身。'
</script>

<template>
  <PageShell
    width="lg"
    :title="tt('Typography', '字体')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        bare
        :title="tt('Type scale', '字阶')"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="t in TYPE_SCALE"
            :key="t.cls"
            pad="md"
          >
            <span
              :class="t.cls"
              class="min-w-0 truncate text-foreground"
            >{{ tt(SPECIMEN, SPECIMEN_ZH) }}</span>
            <span class="shrink-0 font-mono text-caption text-muted-foreground">
              {{ t.cls }} · {{ t.px }}px · lh {{ t.lh }} · {{ tt(t.role, t.roleZh) }}
            </span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Weight roles', '字重角色')"
        :description="tt(
          'Weight is role-mapped, never free-styled — Inter runs heavy, so the numeric values sit a half-step below the Tailwind defaults.',
          '字重按角色映射，绝不随手写——Inter 同数值偏重，所以数值比 Tailwind 默认值下调半档。',
        )"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="w in WEIGHT_ROLES"
            :key="w.cls"
            pad="md"
          >
            <span
              :class="[w.cls]"
              class="text-title text-foreground"
            >{{ tt(SPECIMEN, SPECIMEN_ZH) }}</span>
            <span class="shrink-0 font-mono text-caption text-muted-foreground">
              {{ w.cls }} · {{ w.value }} · {{ tt(w.role, w.roleZh) }}
            </span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Font family', '字体族')"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="f in FONT_STACKS"
            :key="f.token"
            pad="md"
          >
            <span class="shrink-0 font-mono text-body text-foreground">{{ f.token }}</span>
            <span class="text-right font-mono text-caption text-muted-foreground">{{ f.value }}</span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>
    </div>
  </PageShell>
</template>
