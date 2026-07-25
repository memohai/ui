<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { RADIUS_SCALE } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
import SpecimenTable from '../../components/SpecimenTable.vue'
import SpecimenRow from '../../components/SpecimenRow.vue'
</script>

<template>
  <PageShell
    width="lg"
    :title="tt('Radius', '圆角')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        :title="tt('Scale', '阶梯')"
      >
        <!-- One-off demo figure, page-unique: fixed-size swatch boxes aligned
             to their bottom edge so the radius reads against a shared
             baseline — a specimen arrangement this page alone needs, not a
             general vocabulary. -->
        <div class="flex flex-wrap items-end gap-6">
          <div
            v-for="r in RADIUS_SCALE"
            :key="r.token"
            class="flex flex-col items-start gap-2"
          >
            <div
              class="h-16 w-24 border border-border bg-card"
              :style="{ borderRadius: `var(${r.token})` }"
            />
            <div class="font-mono text-caption text-muted-foreground">
              {{ r.token }} · {{ r.px }}px
            </div>
          </div>
          <div class="flex flex-col items-start gap-2">
            <div class="h-16 w-24 rounded-full border border-border bg-card" />
            <div class="font-mono text-caption text-muted-foreground">
              rounded-full · Avatar
            </div>
          </div>
        </div>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Role map', '角色映射')"
        :description="tt(
          'Off-scale radius is a dirty-pattern red line. The one sanctioned arbitrary value is the in-field small-control calc(var(--radius) - 5px) (5px), so a 24px box doesn\'t read as a pill.',
          '阶梯外圆角是 dirty pattern 红线。唯一特许的任意值是框内小控件的 calc(var(--radius) - 5px)(5px)——24px 的小盒子才不会圆成药丸。',
        )"
      >
        <SpecimenTable>
          <SpecimenRow
            v-for="r in RADIUS_SCALE.filter(r => r.role)"
            :key="r.token"
          >
            <span class="font-mono text-body text-foreground">{{ r.token }} · {{ r.px }}px</span>
            <span class="text-right text-body text-muted-foreground">{{ tt(r.role, r.roleZh) }}</span>
          </SpecimenRow>
        </SpecimenTable>
      </SectionGroup>
    </div>
  </PageShell>
</template>
