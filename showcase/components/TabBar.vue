<script setup lang="ts">
import { ArrowLeft, ArrowRight, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { tt } from '../lib/i18n'
import { canBack, canForward, goBack, goForward } from '../router'
import { shellState } from '../shell'

// The content-area tab bar: page title on the left, chrome controls on the
// right. It spans only the right section — the sidebar is a separate panel
// with its own header — so the two panels read as independent. The left
// sidebar's reopen affordance lives here when it is collapsed; the controls
// toggle only exists on component pages (foundations pages have no rail).
defineProps<{ title: string, titleZh?: string, controls?: boolean }>()
</script>

<template>
  <header class="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3">
    <Button
      v-if="!shellState.navOpen"
      variant="ghost"
      size="icon-sm"
      :aria-label="tt('Show sidebar', '展开侧栏')"
      @click="shellState.navOpen = true"
    >
      <PanelLeftOpen />
    </Button>
    <h1 class="text-control font-semibold">
      {{ tt(title, titleZh) }}
    </h1>
    <div class="ml-auto flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="!canBack"
        :aria-label="tt('Back', '后退')"
        @click="goBack"
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="!canForward"
        :aria-label="tt('Forward', '前进')"
        @click="goForward"
      >
        <ArrowRight />
      </Button>
      <Button
        v-if="controls"
        variant="ghost"
        size="icon-sm"
        :aria-label="shellState.controlsOpen ? tt('Hide controls', '收起控件面板') : tt('Show controls', '展开控件面板')"
        @click="shellState.controlsOpen = !shellState.controlsOpen"
      >
        <PanelRightClose v-if="shellState.controlsOpen" />
        <PanelRightOpen v-else />
      </Button>
    </div>
  </header>
</template>
