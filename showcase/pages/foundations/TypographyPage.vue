<script setup lang="ts">
import { FONT_STACKS, TYPE_SCALE, WEIGHT_ROLES } from '../../lib/foundations-data'

const SPECIMEN = 'Design the conversation, not just the chat.'
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Type scale
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
          >{{ SPECIMEN }}</span>
          <span class="shrink-0 font-mono text-caption text-muted-foreground">
            {{ t.cls }} · {{ t.px }}px · lh {{ t.lh }} · {{ t.role }}
          </span>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Weight roles
      </h2>
      <p class="mb-3 text-body text-muted-foreground">
        Weight is role-mapped, never free-styled — Inter runs heavy, so the
        numeric values sit a half-step below the Tailwind defaults.
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
          >{{ SPECIMEN }}</span>
          <span class="shrink-0 font-mono text-caption text-muted-foreground">
            {{ w.cls }} · {{ w.value }} · {{ w.role }}
          </span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        Font family
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
