<script setup lang="ts">
import { ref } from 'vue'
import { copyText } from '../lib/clipboard'
import { tt } from '../lib/i18n'
import { useTokenValue } from '../lib/tokens'

// One token row: swatch chip + mono name + live resolved value. Click copies
// the token name — the value shown is read from THIS row's own computed style,
// so a row inside a `.dark` column reports the dark resolution.
const props = defineProps<{ token: string }>()

const el = ref<HTMLElement>()
const value = useTokenValue(el, props.token)

const copied = ref(false)
let timer: number | undefined
async function copy() {
  if (await copyText(props.token)) {
    copied.value = true
    clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = false), 1200)
  }
}
</script>

<template>
  <button
    ref="el"
    type="button"
    class="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-(--ui-hover)"
    :title="`${tt('Copy', '复制')} ${token}`"
    @click="copy"
  >
    <span
      class="h-6 w-10 shrink-0 rounded-sm border border-border"
      :style="{ background: `var(${token})` }"
    />
    <span class="font-mono text-body text-foreground">{{ token }}</span>
    <span class="ml-auto font-mono text-caption text-muted-foreground">
      {{ copied ? tt('Copied', '已复制') : value }}
    </span>
  </button>
</template>
