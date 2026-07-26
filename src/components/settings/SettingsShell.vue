<template>
  <div
    class="mx-auto w-full px-4 pt-2 pb-10 md:px-6 md:pt-4 md:pb-12"
    :class="widthClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// Lifted from the host app (apps/web/components/settings-shell/index.vue, now
// a re-export shim) so the settings page width shell has exactly one
// implementation. The width ladder is the shared settingsWidthClass
// (./width.ts) — single source for this shell and DetailPane.
import { computed } from 'vue'
import { settingsWidthClass, type SettingsWidth } from './width'

const props = withDefaults(defineProps<{
  width?: SettingsWidth
}>(), {
  width: 'standard',
})

const widthClass = computed(() => settingsWidthClass(props.width))
</script>
