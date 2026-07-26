<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { ColorRow } from '../lib/color-catalog'
import { copyText } from '../lib/clipboard'
import { STAGE_FRAME_CLASS } from '../lib/frame'
import { tt } from '../lib/i18n'
import { themeState } from '../theme'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/tooltip'

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
  <!-- Hover hint = the library's own Tooltip (the showcase dogfoods its
       overlay, never a hand-rolled bubble). The bars live on a page that
       follows the global theme, so the portaled pill always matches. -->
  <TooltipProvider>
    <div
      ref="cardEl"
      :class="[STAGE_FRAME_CLASS, 'flex flex-col gap-1 bg-background p-1.5']"
    >
      <Tooltip
        v-for="(row, i) in rows"
        :key="row.token"
      >
        <TooltipTrigger as-child>
          <button
            :ref="(el) => setBar(el, i)"
            type="button"
            class="flex h-8 w-full cursor-pointer items-center rounded-md px-3"
            :style="{
              background: `var(${row.token})`,
              color: lightInk[i] ? 'rgb(0 0 0 / 0.72)' : 'rgb(255 255 255 / 0.88)',
            }"
            @click="copy(row.token)"
          >
            <span class="font-mono text-caption">
              {{ copied === row.token ? tt('Copied', '已复制') : row.short }}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent class="font-mono">
          {{ row.token }} · {{ resolved[i] || '—' }}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
