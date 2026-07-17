<script setup lang="ts">
import { Monitor, Smartphone, Tablet } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import { Button } from '#/components/button'
import { tt } from '../lib/i18n'

// Viewport constrains the stage's max-width, not the browser window — desktop
// is full width; tablet/mobile center a fixed-rem column (rem so it tracks the
// UI font-size contract, never px).
const viewport = defineModel<'desktop' | 'tablet' | 'mobile'>({ default: 'desktop' })

const VIEWPORTS: { value: 'desktop' | 'tablet' | 'mobile', icon: FunctionalComponent, label: string, labelZh: string }[] = [
  { value: 'desktop', icon: Monitor, label: 'Desktop width', labelZh: '桌面宽度' },
  { value: 'tablet', icon: Tablet, label: 'Tablet width (48rem)', labelZh: '平板宽度 (48rem)' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile width (24rem)', labelZh: '手机宽度 (24rem)' },
]
const WIDTHS = { desktop: 'none', tablet: '48rem', mobile: '24rem' } as const
</script>

<template>
  <div class="relative min-h-0 flex-1">
    <div class="h-full overflow-auto">
      <!-- m-auto centering (not grid place-items-center): with content taller
           than the stage, grid centering clips the top edge instead of
           scrolling to it. -->
      <div class="flex min-h-full p-8">
        <div
          class="m-auto w-full transition-[max-width] duration-200"
          :style="{ maxWidth: WIDTHS[viewport] }"
        >
          <slot />
        </div>
      </div>
    </div>
    <div class="absolute bottom-3 right-3 flex items-center gap-0.5">
      <Button
        v-for="v in VIEWPORTS"
        :key="v.value"
        variant="ghost"
        size="icon-sm"
        :aria-label="tt(v.label, v.labelZh)"
        :class="viewport === v.value ? 'text-foreground' : 'text-muted-foreground'"
        @click="viewport = v.value"
      >
        <component :is="v.icon" />
      </Button>
    </div>
  </div>
</template>
