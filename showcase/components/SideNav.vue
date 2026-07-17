<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { NativeSelect } from '#/components/native-select'
import { ScrollArea } from '#/components/scroll-area'
import { navGroups } from '../registry'
import { navigate, route } from '../router'
import type { Scheme } from '../theme'
import { SCHEMES, setScheme, setTheme, themeState } from '../theme'
import RowButton from './RowButton.vue'
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-r border-border">
    <ScrollArea class="min-h-0 flex-1">
      <div class="p-2">
        <div
          v-for="group in navGroups"
          :key="group.id"
          class="mb-3 last:mb-0"
        >
          <div class="px-2.5 pb-1 pt-2 text-caption text-muted-foreground first:pt-1">
            {{ group.label }}
          </div>
          <RowButton
            v-for="page in group.pages"
            :key="page.id"
            :active="route.id === page.id"
            @select="navigate(page.id)"
          >
            {{ page.title }}
          </RowButton>
        </div>
      </div>
    </ScrollArea>
    <!-- Theme + scheme live at the sidebar foot (the Aaru moon slot). Scheme
         has no icon — the whole canvas IS the preview. -->
    <div class="flex items-center justify-between gap-2 p-2">
      <Button
        variant="ghost"
        size="icon-sm"
        :aria-label="themeState.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="setTheme(themeState.theme === 'dark' ? 'light' : 'dark')"
      >
        <Sun v-if="themeState.theme === 'dark'" />
        <Moon v-else />
      </Button>
      <NativeSelect
        size="sm"
        aria-label="Color scheme"
        :model-value="themeState.scheme"
        @update:model-value="setScheme(String($event) as Scheme)"
      >
        <option
          v-for="s in SCHEMES"
          :key="s"
          :value="s"
        >
          {{ s }}
        </option>
      </NativeSelect>
    </div>
  </aside>
</template>
