<script setup lang="ts">
import { SPACING_STEPS } from '../../lib/foundations-data'

// No custom spacing tokens exist — the system rides the Tailwind spacing
// ladder (0.25rem base). What the contract legislates is rem-vs-px: anything
// touching text uses the rem ladder so the whole UI scales with
// --memoh-ui-font-size; px is reserved for non-text decoration (hairlines,
// icon sizes, blur).
function rem(n: number): string {
  return `${n * 0.25}rem`
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        The rem ladder
      </h2>
      <div class="space-y-2">
        <div
          v-for="n in SPACING_STEPS"
          :key="n"
          class="flex items-center gap-4"
        >
          <span class="w-14 shrink-0 font-mono text-body text-muted-foreground">{{ n }}</span>
          <span
            class="h-2.5 rounded-sm"
            :style="{ width: rem(n), background: 'var(--accent-blue)' }"
          />
          <span class="font-mono text-caption text-muted-foreground">{{ rem(n) }} · {{ n * 4 }}px</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        rem, not px
      </h2>
      <div class="space-y-2 text-body text-muted-foreground">
        <p>
          The root font size is <span class="font-mono text-foreground">var(--memoh-ui-font-size, 1rem)</span> —
          the UI font-size control and browser zoom resize the whole UI through
          rem. A hardcoded px on a text-coupled property (font size, control
          height, padding, gaps) stops growing while the text around it grows.
        </p>
        <p>
          px is only for non-text decoration: 1–4px hairlines, icon sizes,
          border/ring/translate offsets, and blur. JS layout (virtualizer
          estimates, scroll offsets) must derive from the root font size too.
        </p>
      </div>
    </section>
  </div>
</template>
