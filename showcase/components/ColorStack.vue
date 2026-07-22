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
// every token re-resolves on theme/scheme flip.
//
// Ink choice (dark vs light label) CANNOT look at the token's raw color: the
// overlay/border tokens are translucent (rgba(0,0,0,0.04) reads as near-white
// on the card, rgba(255,255,255,0.06) as near-black). Judging the raw channel
// values puts white text on a white bar. So every bar's color is composited
// over the card's own computed background first, and the EFFECTIVE lightness
// picks the ink.
const props = defineProps<{ rows: ColorRow[] }>()

const cardEl = ref<HTMLElement>()
const barEls: HTMLElement[] = []
const resolved = ref<string[]>([])
const lightInk = ref<boolean[]>([])

function setBar(el: unknown, i: number) {
  if (el)
    barEls[i] = el as HTMLElement
}

interface ParsedColor {
  // Perceptual lightness in the oklch-L domain (0–1). rgb() inputs pass
  // through relative luminance → cube root, which approximates CIE L*/100.
  l: number
  a: number
}

function parseAlpha(s: string | undefined): number {
  if (!s)
    return 1
  return s.endsWith('%') ? Number(s.slice(0, -1)) / 100 : Number(s)
}

function parseColor(css: string): ParsedColor | null {
  let m = css.match(/oklch\(\s*([\d.]+)\s*(%?)[^/)]*(?:\/\s*([\d.]+%?))?\s*\)/)
  if (m) {
    const l = m[2] === '%' ? Number(m[1]) / 100 : Number(m[1])
    return { l, a: parseAlpha(m[3]) }
  }
  m = css.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/)
  if (m) {
    return { l: srgbLightness(Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255), a: parseAlpha(m[4]) }
  }
  m = css.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/)
  if (m) {
    return { l: srgbLightness(Number(m[1]), Number(m[2]), Number(m[3])), a: parseAlpha(m[4]) }
  }
  return null
}

function srgbLightness(r: number, g: number, b: number): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return Math.cbrt(0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b))
}

// Composite over the backdrop: effective = α·color + (1−α)·backdrop.
function effectiveLightness(css: string, backdrop: number): number {
  const c = parseColor(css)
  if (!c)
    return backdrop
  return c.a * c.l + (1 - c.a) * backdrop
}

function measure() {
  const bg = cardEl.value ? parseColor(getComputedStyle(cardEl.value).backgroundColor) : null
  const backdrop = bg ? bg.a * bg.l + (1 - bg.a) * 1 : 1
  resolved.value = props.rows.map((_, i) => (barEls[i] ? getComputedStyle(barEls[i]).backgroundColor : ''))
  // 0.66 in the L domain: mid-chroma fills (accent blue, status bases) take
  // light ink, soft tints and composited overlays take dark ink.
  lightInk.value = resolved.value.map(css => effectiveLightness(css, backdrop) > 0.66)
}

onMounted(() => nextTick(measure))
watch(
  () => [themeState.theme, themeState.scheme],
  () => nextTick(measure),
)

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
  <div
    ref="cardEl"
    class="flex flex-col gap-1 rounded-lg border border-border-soft bg-background p-1.5"
  >
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
