<script setup lang="ts">
import { computed, ref } from 'vue'
import { copyText } from '../lib/clipboard'
import type { RampSpec } from '../lib/color-catalog'

// A color-ramp bar: one family (accent hue / status / domain palette) rendered
// as contiguous segments, one per role. Click a segment to copy its token;
// hover shows the full token name via the title attr. Segment roles are read
// from the same cascade as everything else — the `.dark` column just works.
const props = defineProps<{ spec: RampSpec }>()

const segments = computed(() =>
  props.spec.roles.map(role => ({
    role,
    label: role || 'base',
    token: role ? `${props.spec.prefix}-${role}` : props.spec.prefix,
  })),
)

const copiedToken = ref('')
let timer: number | undefined
async function copy(token: string) {
  if (await copyText(token)) {
    copiedToken.value = token
    clearTimeout(timer)
    timer = window.setTimeout(() => (copiedToken.value = ''), 1200)
  }
}
</script>

<template>
  <div class="mb-4 last:mb-0">
    <div class="mb-1 font-mono text-caption text-muted-foreground">
      {{ spec.label }}
    </div>
    <div class="flex overflow-hidden rounded-sm border border-border">
      <button
        v-for="seg in segments"
        :key="seg.token"
        type="button"
        class="h-7 flex-1 cursor-pointer transition-opacity"
        :class="copiedToken === seg.token ? 'opacity-50' : ''"
        :style="{ background: `var(${seg.token})` }"
        :title="`Copy ${seg.token}`"
        :aria-label="`Copy ${seg.token}`"
        @click="copy(seg.token)"
      />
    </div>
    <div class="mt-0.5 flex">
      <span
        v-for="seg in segments"
        :key="seg.token"
        class="flex-1 truncate text-center font-mono text-caption text-muted-foreground"
      >{{ seg.label }}</span>
    </div>
  </div>
</template>
