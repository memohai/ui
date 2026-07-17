<script setup lang="ts">
import { RADIUS_SCALE } from '../../lib/foundations-data'
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Scale
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
        Role map
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="r in RADIUS_SCALE.filter(r => r.role)"
          :key="r.token"
          class="flex items-baseline justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="font-mono text-body text-foreground">{{ r.token }} · {{ r.px }}px</span>
          <span class="text-right text-body text-muted-foreground">{{ r.role }}</span>
        </div>
      </div>
      <p class="mt-3 text-body text-muted-foreground">
        Off-scale radius is a dirty-pattern red line. The one sanctioned
        arbitrary value is the in-field small-control
        <span class="font-mono text-foreground">calc(var(--radius) - 5px)</span>
        (5px), so a 24px box doesn't read as a pill.
      </p>
    </section>
  </div>
</template>
