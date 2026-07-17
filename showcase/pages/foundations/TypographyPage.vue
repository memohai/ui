<script setup lang="ts">
import { FONT_STACKS, TYPE_SCALE, WEIGHT_ROLES } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'

const SPECIMEN = 'Design the conversation, not just the chat.'
const SPECIMEN_ZH = '设计的不是聊天，而是对话本身。'
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Type scale', '字阶') }}
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="t in TYPE_SCALE"
          :key="t.cls"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-3 last:border-b-0"
        >
          <span
            :class="t.cls"
            class="min-w-0 truncate text-foreground"
          >{{ tt(SPECIMEN, SPECIMEN_ZH) }}</span>
          <span class="shrink-0 font-mono text-caption text-muted-foreground">
            {{ t.cls }} · {{ t.px }}px · lh {{ t.lh }} · {{ tt(t.role, t.roleZh) }}
          </span>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Weight roles', '字重角色') }}
      </h2>
      <p class="mb-3 text-body text-muted-foreground">
        {{ tt(
          'Weight is role-mapped, never free-styled — Inter runs heavy, so the numeric values sit a half-step below the Tailwind defaults.',
          '字重按角色映射，绝不随手写——Inter 同数值偏重，所以数值比 Tailwind 默认值下调半档。',
        ) }}
      </p>
      <div class="border-y border-border-soft">
        <div
          v-for="w in WEIGHT_ROLES"
          :key="w.cls"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-3 last:border-b-0"
        >
          <span
            :class="[w.cls]"
            class="text-title text-foreground"
          >{{ tt(SPECIMEN, SPECIMEN_ZH) }}</span>
          <span class="shrink-0 font-mono text-caption text-muted-foreground">
            {{ w.cls }} · {{ w.value }} · {{ tt(w.role, w.roleZh) }}
          </span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Font family', '字体族') }}
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="f in FONT_STACKS"
          :key="f.token"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-3 last:border-b-0"
        >
          <span class="shrink-0 font-mono text-body text-foreground">{{ f.token }}</span>
          <span class="text-right font-mono text-caption text-muted-foreground">{{ f.value }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
