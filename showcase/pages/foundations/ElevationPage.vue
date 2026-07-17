<script setup lang="ts">
import { ELEVATION_SCALE } from '../../lib/foundations-data'

// Elevation is a scarce, tokenized ladder — flat by default (Tailwind's
// shadow-sm is deliberately zeroed in style.css), shadows only here.
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        The ladder
      </h2>
      <div class="grid grid-cols-2 gap-6">
        <template
          v-for="e in ELEVATION_SCALE"
          :key="e.token"
        >
          <div class="p-3">
            <div
              class="mb-3 flex h-20 items-center justify-center rounded-lg bg-card"
              :style="{ boxShadow: `var(${e.token})` }"
            >
              <span class="font-mono text-body text-foreground">{{ e.token }}</span>
            </div>
            <p class="text-body text-muted-foreground">
              {{ e.role }}
            </p>
          </div>
          <div class="dark rounded-lg bg-background p-3">
            <div
              class="mb-3 flex h-20 items-center justify-center rounded-lg bg-card"
              :style="{ boxShadow: `var(${e.token})` }"
            >
              <span class="font-mono text-body text-foreground">{{ e.token }}</span>
            </div>
            <p class="text-body text-muted-foreground">
              {{ e.role }}
            </p>
          </div>
        </template>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        Rules
      </h2>
      <div class="space-y-2 text-body text-muted-foreground">
        <p>
          Flat controls and Cards carry no shadow. An invented
          <span class="font-mono text-foreground">shadow-xs/md/lg</span> — or a
          <span class="font-mono text-foreground">shadow-none</span> fighting an
          inherited one — is the dirty tell.
        </p>
        <p>
          Modal surfaces over the scrim use <span class="font-mono text-foreground">--border-menu-elevated</span>:
          transparent in light (panel + scrim + shadow already separate), a
          white hairline in dark.
        </p>
      </div>
    </section>
  </div>
</template>
