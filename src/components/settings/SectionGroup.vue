<script setup lang="ts">
// SectionGroup — a titled content group: a foreground section label (+
// optional hint) with an optional trailing action, heading a BARE body.
// Deliberately NOT SettingsSection: that owns a MUTED label and wraps its
// body in a bordered card (the settings-row tier). This is the page-content
// tier — a stronger foreground label heading content that already carries
// its own borders, so the group adds no card of its own and there is no
// card-in-card. The header edges match PageShell's: title inset px-2,
// actions flush right against the body. Use ONLY on pages that stack
// SEVERAL such groups — a single-group page lets PageShell own the
// title/hint/action directly with no group layer. Lifted from the host app
// (apps/web/components/section-group, now a re-export shim).
defineProps<{
  title?: string
  // An optional muted one-line hint under the section label (e.g. what this
  // group is for). Sits directly under the title.
  description?: string
}>()
</script>

<template>
  <section class="space-y-2.5">
    <div
      v-if="title || description || $slots.actions"
      class="flex items-center justify-between gap-4"
    >
      <div
        v-if="title || description"
        class="min-w-0 px-2"
      >
        <h2
          v-if="title"
          class="text-label font-medium text-foreground"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="text-body text-muted-foreground"
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
