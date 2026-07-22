<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { flatPages, pageById } from './registry'
import { initRouter, route } from './router'
import { applyTheme, themeState } from './theme'
import ComponentPage from './pages/ComponentPage.vue'
import SideNav from './components/SideNav.vue'
import TabBar from './components/TabBar.vue'

initRouter('overview', id => !!pageById(id))

watchEffect(() => applyTheme(themeState.theme, themeState.scheme))

// flatPages always has at least Overview (registry guarantee), so the fallback
// can't be undefined in practice.
const current = computed(() => pageById(route.id) ?? flatPages[0]!)
const staticComponent = computed(() => (current.value.kind === 'static' ? current.value.component : null))
const currentSpec = computed(() => (current.value.kind === 'component' ? current.value.spec : null))
</script>

<template>
  <div class="flex h-dvh bg-background text-foreground">
    <SideNav />
    <!-- The right section is one panel: tab bar on top, content below. The
         controls toggle only exists when the page HAS a controls rail. -->
    <div class="flex min-w-0 flex-1 flex-col">
      <TabBar
        :title="current.title"
        :title-zh="current.titleZh"
        :controls="!!currentSpec"
      />
      <!-- Static pages own their scroll container; ComponentPage owns its
           canvas/controls/code chrome. -->
      <main
        v-if="staticComponent"
        class="min-h-0 min-w-0 flex-1 overflow-y-auto"
      >
        <component :is="staticComponent" />
      </main>
      <ComponentPage
        v-else-if="currentSpec"
        :key="currentSpec.id"
        :spec="currentSpec"
      />
    </div>
  </div>
</template>
