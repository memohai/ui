<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { flatPages, navGroups, pageById } from './registry'
import { initRouter, navigate, route } from './router'
import { applyTheme, themeState } from './theme'

// Boot-stage shell (Task 1): proves the vite entry + tokens + registry wiring.
// The full TopBar / SideNav / canvas-controls-code chrome lands in Task 2.
initRouter('overview', id => !!pageById(id))

watchEffect(() => applyTheme(themeState.theme, themeState.scheme))

const current = computed(() => pageById(route.id) ?? flatPages[0])
</script>

<template>
  <div class="flex h-dvh bg-background text-foreground">
    <nav class="w-64 shrink-0 overflow-y-auto border-r border-border p-2">
      <div
        v-for="group in navGroups"
        :key="group.id"
        class="mb-4"
      >
        <div class="px-2 py-1 text-caption text-muted-foreground">
          {{ group.label }}
        </div>
        <button
          v-for="page in group.pages"
          :key="page.id"
          class="block w-full rounded-md px-2 py-1 text-left text-control"
          @click="navigate(page.id)"
        >
          {{ page.title }}
        </button>
      </div>
    </nav>
    <main class="min-w-0 flex-1 overflow-y-auto">
      <component :is="current.component" v-if="current.kind === 'static'" />
      <div v-else class="p-8 text-body text-muted-foreground">
        {{ current.title }} — spec pending
      </div>
    </main>
  </div>
</template>
