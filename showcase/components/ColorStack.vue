<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { ColorRow } from '../lib/color-catalog'
import { copyText } from '../lib/clipboard'
import { tt } from '../lib/i18n'
import { themeState } from '../theme'

// One token family as a vertical stack of full-width bars: the swatch is the
// hero, the short name rides inside the bar, and the resolved value only
// surfaces on hover (token · oklch/rgb). Values are measured off each bar's
// OWN computed background — no static value/contrast table can exist because
// every token re-resolves on theme/scheme flip, which is also why the label
// ink (dark vs light) is derived from the measured color rather than a
// hand-maintained list.
const props = defineProps<{ rows: ColorRow[] }>()

const barEls: HTMLElement[] = []
const resolved = ref<string[]>([])
const lightInk = ref<boolean[]>([])

function setBar(el: unknown, i: number) {
  if (el)
    barEls[i] = el as HTMLElement
}

function measure() {
  resolved.value = props.rows.map((_, i) => (barEls[i] ? getComputedStyle(barEls[i]).backgroundColor : ''))
  lightInk.value = resolved.value.map(isLightColor)
}

onMounted(() => nextTick(measure))
watch(
  () => [themeState.theme, themeState.scheme],
  () => nextTick(measure),
)

// Relative-luminance threshold tuned so mid-chroma fills (accent blue, status
// bases) take light ink while soft tints take dark ink.
function isLightColor(css: string): boolean {
  let m = css.match(/oklch\(\s*([\d.]+)\s*(%?)/)
  if (m) {
    const l = m[2] === '%' ? Number(m[1]) / 100 : Number(m[1])
    return l > 0.66
  }
  m = css.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/)
  if (m)
    return srgbLuminance(Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255) > 0.35
  m = css.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (m)
    return srgbLuminance(Number(m[1]), Number(m[2]), Number(m[3])) > 0.35
  return true
}

function srgbLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

const copied = ref('')
let timer: number | undefined
async function copy(token: string) {
  if (await copyText(token)) {
    copied.value = token
    clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = ''), 1200)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1 rounded-lg border border-border-soft bg-background p-1.5">
    <button
      v-for="(row, i) in rows"
      :key="row.token"
      :ref="(el) => setBar(el, i)"
      type="button"
      class="group relative flex h-8 cursor-pointer items-center rounded-md px-3"
      :style="{
        background: `var(${row.token})`,
        color: lightInk[i] ? 'rgb(0 0 0 / 0.72)' : 'rgb(255 255 255 / 0.88)',
      }"
      @click="copy(row.token)"
    >
      <span class="font-mono text-caption">
        {{ copied === row.token ? tt('Copied', '已复制') : row.short }}
      </span>
      <!-- Hover tooltip: full token + live resolved value. Pointer-events-none
           so it never traps the cursor between bars. -->
      <span
        class="pointer-events-none absolute -top-7 left-1/2 z-(--z-overlay) -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-0.5 font-mono text-caption whitespace-nowrap text-popover-foreground opacity-0 shadow-(--shadow-dropdown) transition-opacity duration-100 group-hover:opacity-100"
      >{{ row.token }} · {{ resolved[i] || '—' }}</span>
    </button>
  </div>
</template>
