<script setup lang="ts">
import { Z_LADDER } from '../../lib/foundations-data'
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Five tiers
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="z in Z_LADDER"
          :key="z.token"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="font-mono text-body text-foreground">{{ z.token }} · {{ z.value }}</span>
          <span class="text-right text-body text-muted-foreground">{{ z.role }}</span>
        </div>
      </div>
      <p class="mt-3 text-body text-muted-foreground">
        Consume as <span class="font-mono text-foreground">z-(--z-overlay)</span>
        or <span class="font-mono text-foreground">var(--z-overlay)</span>.
        There is no in-between tier — wanting one is a design question, not a
        number to invent. The one exception is toast: raw 9999, deliberately
        uncapped so it beats the --z-top lightbox too.
      </p>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        The stack, visually
      </h2>
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
    </section>
  </div>
</template>
