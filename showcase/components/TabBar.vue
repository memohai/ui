<script setup lang="ts">
import { ChevronLeft, ChevronRight, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { tt } from '../lib/i18n'
import { canBack, canForward, goBack, goForward } from '../router'
import { shellState } from '../shell'
import ChromeIconButton from './ChromeIconButton.vue'

// The content-area tab bar: page title on the left, chrome controls on the
// right. It spans only the right section — the sidebar is a separate panel
// with its own header — so the two panels read as independent. The left
// sidebar's reopen affordance lives here when it is collapsed; the controls
// toggle only exists on component pages (foundations pages have no rail).
defineProps<{ title: string, titleZh?: string, controls?: boolean }>()
</script>

<template>
  <header class="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3">
    <ChromeIconButton
      v-if="!shellState.navOpen"
      :label="tt('Show sidebar', '展开侧栏')"
      @click="shellState.navOpen = true"
    >
      <PanelLeftOpen
        :stroke-width="1.75"
        class="size-4"
      />
    </ChromeIconButton>
    <h1 class="text-control font-semibold">
      {{ tt(title, titleZh) }}
    </h1>
    <div class="ml-auto flex items-center gap-0.5">
      <ChromeIconButton
        :label="tt('Back', '后退')"
        :disabled="!canBack"
        @click="goBack"
      >
        <ChevronLeft
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
      <ChromeIconButton
        :label="tt('Forward', '前进')"
        :disabled="!canForward"
        @click="goForward"
      >
        <ChevronRight
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
      <ChromeIconButton
        v-if="controls"
        :label="shellState.controlsOpen ? tt('Hide controls', '收起控件面板') : tt('Show controls', '展开控件面板')"
        :pressed="shellState.controlsOpen"
        @click="shellState.controlsOpen = !shellState.controlsOpen"
      >
        <PanelRightClose
          v-if="shellState.controlsOpen"
          :stroke-width="1.75"
          class="size-4"
        />
        <PanelRightOpen
          v-else
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
    </div>
  </header>
</template>
