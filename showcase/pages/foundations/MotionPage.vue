<script setup lang="ts">
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Duration palette', '时长调色板') }}
      </h2>
      <p class="mb-3 text-body text-muted-foreground">
        {{ tt(
          'Durations aren\'t tokenized — the palette is law by convention (AGENTS.md § Motion). Hover a row to feel it.',
          '时长没有令牌化——这份调色板是约定之法(AGENTS.md § Motion)。hover 任意一行感受它。',
        ) }}
      </p>
      <div class="border-y border-border-soft">
        <div
          v-for="d in MOTION_DURATIONS"
          :key="d.ms"
          class="group flex items-center justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="text-body text-muted-foreground group-hover:text-foreground">{{ tt(d.what, d.whatZh) }}</span>
          <span class="flex items-center gap-3">
            <span
              class="inline-block h-2 w-8 rounded-sm transition-[width] ease-out group-hover:w-24"
              :style="{ background: 'var(--accent-blue)', transitionDuration: `${d.ms}ms` }"
            />
            <span class="w-14 text-right font-mono text-body text-foreground">{{ d.ms }}ms</span>
          </span>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Easings', '缓动') }}
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="e in MOTION_EASINGS"
          :key="e.name"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="text-body text-foreground">{{ e.name }}</span>
          <span class="text-right font-mono text-caption text-muted-foreground">{{ e.value }} · {{ tt(e.what, e.whatZh) }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Tailwind v4 gotcha', 'Tailwind v4 陷阱') }}
      </h2>
      <p class="text-body text-muted-foreground">
        {{ tt(
          'v4 maps translate-x/y, scale, and rotate to the standalone CSS properties — NOT transform. A transition: transform won\'t animate them (it snaps). Transition the actual property: transition: translate.',
          'v4 把 translate-x/y、scale、rotate 映射到独立的 CSS 属性——不是 transform。对 transform 做过渡不会生效(会瞬跳)。要对真实属性做过渡:transition: translate。',
        ) }}
      </p>
    </section>
  </div>
</template>
