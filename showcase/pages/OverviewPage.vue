<script setup lang="ts">
import { componentSpecs } from '../specs'
import { navigate } from '../router'
import RowButton from '../components/RowButton.vue'

// Status groups from AGENTS.md § Reference status — the source of truth for
// "which components are safe to pattern-match off". This board makes the
// contract visible instead of buried in prose.
const IN_PROGRESS = ['Slider', 'RadioGroup', 'Select menu surface', 'Combobox', 'PinInput', 'InputOTP', 'TagsInput']
const LEGACY = ['Badge (semantic fills)', 'Alert (semantic fills)', 'components/sidebar/ (23 files, unmigrated shadcn-vue import)']
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <p class="max-w-xl text-control text-foreground">
        The living reference for <span class="font-mono">@felinic/ui</span> —
        every page renders the real component, and every control drives the
        code snippet live.
      </p>
      <p class="mt-2 max-w-xl text-body text-muted-foreground">
        Theme and color scheme switch at the bottom of the sidebar; the
        controls panel and code panel frame every component page.
      </p>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        Reference — copy these
      </h2>
      <div class="grid grid-cols-2 gap-x-6">
        <RowButton
          v-for="spec in componentSpecs"
          :key="spec.id"
          @select="navigate(`components/${spec.id}`)"
        >
          {{ spec.name }}
        </RowButton>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        In progress — check before use
      </h2>
      <p class="text-body text-muted-foreground">
        {{ IN_PROGRESS.join(' · ') }}
      </p>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        Legacy — do not pattern-match
      </h2>
      <p class="text-body text-muted-foreground">
        {{ LEGACY.join(' · ') }}
      </p>
    </section>
  </div>
</template>
