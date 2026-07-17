<script setup lang="ts">
import { RADIUS_SCALE } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Scale', '阶梯') }}
      </h2>
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
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Role map', '角色映射') }}
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="r in RADIUS_SCALE.filter(r => r.role)"
          :key="r.token"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="font-mono text-body text-foreground">{{ r.token }} · {{ r.px }}px</span>
          <span class="text-right text-body text-muted-foreground">{{ tt(r.role, r.roleZh) }}</span>
        </div>
      </div>
      <p class="mt-3 text-body text-muted-foreground">
        {{ tt(
          'Off-scale radius is a dirty-pattern red line. The one sanctioned arbitrary value is the in-field small-control calc(var(--radius) - 5px) (5px), so a 24px box doesn\'t read as a pill.',
          '阶梯外圆角是 dirty pattern 红线。唯一特许的任意值是框内小控件的 calc(var(--radius) - 5px)(5px)——24px 的小盒子才不会圆成药丸。',
        ) }}
      </p>
    </section>
  </div>
</template>
