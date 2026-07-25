<script setup lang="ts">
import { computed } from 'vue'

// SectionGroup — a titled content group: a section label (+ optional hint)
// with an optional trailing action, heading a BARE body. Deliberately NOT
// SettingsSection: that wraps its body in a bordered card (the settings-row
// tier). This is the page-content tier — the body already carries its own
// borders, so the group adds no card of its own and there is no card-in-card.
// The header edges match PageShell's: title inset px-2, actions flush right
// against the body. Use ONLY on pages that stack SEVERAL such groups — a
// single-group page lets PageShell own the title/hint/action directly with
// no group layer. Lifted from the host app (apps/web/components/
// section-group, now a re-export shim).
//
// tone: 'foreground' (default, the host's provider-grid pages) vs 'muted'
// (the SettingsSection title's tier — same level as Interface/Typography on
// a settings page). Same-level sections on one page must share one tone;
// picking the tone by eye instead of by tier is the recurring drift this
// prop exists to prevent.
//
// heading: the doc-page section tier — the title/hint pair mirrors the page
// intro's pattern (a strong foreground title at text-title semibold, a muted
// hint at text-control), not the settings label. Wins over `tone`. Use for
// documentation-style spines (the showcase's component pages) where each
// section reads as a chapter, not a settings row group.
//
// bare: the body carries NO bordered surface of its own (plain text, a row
// of buttons, a matrix). The px-2 title inset exists to offset a title from
// the CARD beneath it — with no card there is nothing to offset, so title,
// hint, and body share one flush edge, and the title→body gap grows (4 over
// the card rhythm's 2.5) to give the bare section the air the card would
// have provided.
const props = withDefaults(defineProps<{
  title?: string
  // An optional muted one-line hint under the section label (e.g. what this
  // group is for). Sits directly under the title.
  description?: string
  tone?: 'foreground' | 'muted'
  heading?: boolean
  bare?: boolean
}>(), {
  title: '',
  description: '',
  tone: 'foreground',
  heading: false,
  bare: false,
})

const titleClass = computed(() =>
  props.heading
    ? 'text-title font-semibold text-foreground'
    : `text-label font-medium ${props.tone === 'muted' ? 'text-muted-foreground' : 'text-foreground'}`,
)
const hintClass = computed(() =>
  props.heading ? 'text-control' : 'text-body',
)
</script>

<template>
  <section :class="bare ? 'space-y-4' : 'space-y-2.5'">
    <div
      v-if="title || description || $slots.actions"
      class="flex items-center justify-between gap-4"
    >
      <div
        v-if="title || description"
        class="min-w-0"
        :class="bare ? '' : 'px-2'"
      >
        <h2
          v-if="title"
          :class="titleClass"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="text-muted-foreground"
          :class="hintClass"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.actions"
        class="flex shrink-0 items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </section>
</template>
