<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, ArrowRight, PanelRight } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { neighbor } from '../registry'
import { navigate, route } from '../router'
import { shellState } from '../shell'

defineProps<{ title: string }>()

const prev = computed(() => neighbor(route.id, -1))
const next = computed(() => neighbor(route.id, 1))
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3">
    <span class="text-control font-medium">Felinic UI</span>
    <span class="mx-2 select-none text-muted-foreground">/</span>
    <span class="text-control text-muted-foreground">{{ title }}</span>
    <div class="ml-auto flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous page"
        :disabled="!prev"
        @click="prev && navigate(prev.id)"
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next page"
        :disabled="!next"
        @click="next && navigate(next.id)"
      >
        <ArrowRight />
      </Button>
      <!-- Panel-open state is an icon-weight shift (muted → foreground), the
           same quiet treatment as the canvas viewport toggle — ghost buttons
           have no selected chrome of their own. -->
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle controls panel"
        :class="shellState.controlsOpen ? 'text-foreground' : 'text-muted-foreground'"
        @click="shellState.controlsOpen = !shellState.controlsOpen"
      >
        <PanelRight />
      </Button>
    </div>
  </header>
</template>
