<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '#/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '#/components/select'
import { TextButton } from '#/components/text-button'
import { ScrollArea } from '#/components/scroll-area'
import { navGroups } from '../registry'
import { navigate, route } from '../router'
import { tt, setLocale, localeState } from '../lib/i18n'
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
            {{ tt(group.label, group.labelZh) }}
          </div>
          <RowButton
            v-for="page in group.pages"
            :key="page.id"
            :active="route.id === page.id"
            @select="navigate(page.id)"
          >
            {{ tt(page.title, page.titleZh) }}
          </RowButton>
        </div>
      </div>
    </ScrollArea>
    <!-- Theme + locale + scheme live at the sidebar foot (the Aaru moon slot).
         The scheme picker is the library's own Select — the showcase chrome
         dogfoods the styled menu, never the OS-native popup. -->
    <div class="flex items-center justify-between gap-1 p-2">
      <Button
        variant="ghost"
        size="icon-sm"
        :aria-label="themeState.theme === 'dark' ? tt('Switch to light theme', '切换到亮色主题') : tt('Switch to dark theme', '切换到暗色主题')"
        @click="setTheme(themeState.theme === 'dark' ? 'light' : 'dark')"
      >
        <Sun v-if="themeState.theme === 'dark'" />
        <Moon v-else />
      </Button>
      <TextButton
        :aria-label="tt('Switch language', '切换语言')"
        @click="setLocale(localeState.locale === 'zh' ? 'en' : 'zh')"
      >
        {{ localeState.locale === 'zh' ? 'EN' : '中文' }}
      </TextButton>
      <Select
        :model-value="themeState.scheme"
        @update:model-value="setScheme(String($event) as Scheme)"
      >
        <SelectTrigger
          size="sm"
          class="w-28"
          :aria-label="tt('Color scheme', '配色方案')"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent size="sm">
          <SelectItem
            v-for="s in SCHEMES"
            :key="s"
            :value="s"
          >
            <SelectItemText>{{ s }}</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </aside>
</template>
