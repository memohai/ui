<script setup lang="ts">
import { Contrast, Monitor, Smartphone, Tablet } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import { ref, watch } from 'vue'
import { tt } from '../lib/i18n'
import ChromeIconButton from './ChromeIconButton.vue'

// Viewport constrains the stage's max-width, not the browser window — desktop
// is full width; tablet/mobile center a fixed-rem column (rem so it tracks the
// UI font-size contract, never px).
const viewport = defineModel<'desktop' | 'tablet' | 'mobile'>({ default: 'desktop' })

// canSplit gates the light/dark compare toggle. OVERLAY components (Select,
// Dialog, Dropdown, Tooltip, Popover — anything with a controlled `open`) opt
// OUT: reka's DismissableLayer is a document-level singleton, so two open
// overlays can't coexist — the body inert layer kills pointer-events on
// whichever opened first, so its menu can't be hovered. Rather than fight the
// primitive with hacks, overlay pages simply don't offer side-by-side; to see
// an overlay in dark, flip the whole page theme (bottom-left toggle in the
// shell). Non-overlay components (Button, Input, Card, …) split freely.
const props = withDefaults(defineProps<{ canSplit?: boolean }>(), { canSplit: true })

const VIEWPORTS: { value: 'desktop' | 'tablet' | 'mobile', icon: FunctionalComponent, label: string, labelZh: string }[] = [
  { value: 'desktop', icon: Monitor, label: 'Desktop width', labelZh: '桌面宽度' },
  { value: 'tablet', icon: Tablet, label: 'Tablet width (48rem)', labelZh: '平板宽度 (48rem)' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile width (24rem)', labelZh: '手机宽度 (24rem)' },
]
const WIDTHS = { desktop: 'none', tablet: '48rem', mobile: '24rem' } as const

// Light/dark side-by-side: the right column is a `.dark` subtree (the custom
// variant is scoped, `&:is(.dark *)`), so dark tokens resolve inside it without
// touching the page theme. The default slot renders TWICE — each column gets an
// independent instance over the same live state, which is fine for non-overlay
// components (no shared controlled `open` to arbitrate). The column MUST carry
// text-foreground + color-scheme:dark itself: `color` is inherited with its
// computed value locked at <body> (light), so without the explicit restart a
// component relying on inheritance renders dark text on the dark column.
const split = ref(false)

// If the page turns out to be overlay-only, make sure a stale split can't
// linger when navigating between component pages.
watch(() => props.canSplit, (can) => {
  if (!can) split.value = false
})
</script>

<template>
  <div class="relative min-h-0 flex-1">
    <div class="flex h-full">
      <div class="min-w-0 flex-1 overflow-auto">
        <!-- m-auto centering (not grid place-items-center): with content taller
             than the stage, grid centering clips the top edge instead of
             scrolling to it. pt-14/pb-16 reserve clearance for the floating
             chrome (mode switcher top-left, viewport buttons bottom-right) so
             tall walls never slide under it. -->
        <div class="flex min-h-full px-8 pt-14 pb-16">
          <div
            class="m-auto w-full transition-[max-width] duration-200"
            :style="{ maxWidth: WIDTHS[viewport] }"
          >
            <slot />
          </div>
        </div>
      </div>
      <div
        v-if="split && canSplit"
        class="dark min-w-0 flex-1 overflow-auto border-l border-border bg-background text-foreground [color-scheme:dark]"
      >
        <div class="flex min-h-full px-8 pt-14 pb-16">
          <div
            class="m-auto w-full transition-[max-width] duration-200"
            :style="{ maxWidth: WIDTHS[viewport] }"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
    <!-- Floating chrome stays over the LIGHT column: anchored right, the split
         toggle would sit on the dark column in light theme and go unreadable.
         The viewport row lives bottom-left for the same reason. -->
    <div class="absolute top-3 left-3 flex items-center gap-2">
      <slot name="modes" />
      <ChromeIconButton
        v-if="canSplit"
        :label="tt('Compare dark theme side by side', '亮/暗同屏对照')"
        :pressed="split"
        @click="split = !split"
      >
        <Contrast
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
    </div>
    <div class="absolute bottom-3 left-3 flex items-center gap-0.5">
      <ChromeIconButton
        v-for="v in VIEWPORTS"
        :key="v.value"
        :label="tt(v.label, v.labelZh)"
        :pressed="viewport === v.value"
        @click="viewport = v.value"
      >
        <component
          :is="v.icon"
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
    </div>
  </div>
</template>
