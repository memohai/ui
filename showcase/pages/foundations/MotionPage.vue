<script setup lang="ts">
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../lib/foundations-data'
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Duration palette
      </h2>
      <p class="mb-3 text-body text-muted-foreground">
        Durations aren't tokenized — the palette is law by convention
        (AGENTS.md § Motion). Hover a row to feel it.
      </p>
      <div class="border-y border-border-soft">
        <div
          v-for="d in MOTION_DURATIONS"
          :key="d.ms"
          class="group flex items-center justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="text-body text-muted-foreground group-hover:text-foreground">{{ d.what }}</span>
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
        Easings
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="e in MOTION_EASINGS"
          :key="e.name"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="text-body text-foreground">{{ e.name }}</span>
          <span class="text-right font-mono text-caption text-muted-foreground">{{ e.value }} · {{ e.what }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        Tailwind v4 gotcha
      </h2>
      <p class="text-body text-muted-foreground">
        v4 maps <span class="font-mono text-foreground">translate-x/y</span>,
        <span class="font-mono text-foreground">scale</span>, and
        <span class="font-mono text-foreground">rotate</span> to the standalone
        CSS properties — NOT <span class="font-mono text-foreground">transform</span>.
        A <span class="font-mono text-foreground">transition: transform</span>
        won't animate them (it snaps). Transition the actual property:
        <span class="font-mono text-foreground">transition: translate</span>.
      </p>
    </section>
  </div>
</template>
