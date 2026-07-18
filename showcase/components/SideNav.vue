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
    <!-- The wordmark is the home link; combined with the selected row below it
         this IS the breadcrumb (there is no top bar). -->
    <div class="px-2 pt-2">
      <TextButton
        class="h-8 w-full justify-start px-2.5 font-semibold"
        @click="navigate('overview')"
      >
        Felinic UI
      </TextButton>
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <div class="p-2">
        <div
          v-for="group in navGroups"
          :key="group.id"
          class="mb-4 last:mb-0"
        >
          <!-- Group label mirrors menuLabelClass's vocabulary (text-body,
               medium, muted) and its optical trick: pl-2 (not the rows'
               px-2.5) so the smaller text lines up with the row labels. -->
          <div class="pt-3 pr-2.5 pb-1 pl-2 text-body font-medium text-muted-foreground first:pt-1">
            {{ tt(group.label, group.labelZh) }}
          </div>
          <!-- The 2px seam between rows is the chat sidebar's row rhythm:
               adjacent selected/hover fills never fuse into one block. -->
          <div class="flex flex-col gap-0.5">
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
      </div>
    </ScrollArea>
    <!-- Theme + locale + scheme live at the sidebar foot. The scheme picker is
         the library's own Select — the showcase chrome dogfoods the styled
         menu, never the OS-native popup. The gradient strip fuses the foot
         with the list: rows fade out as they scroll under it instead of being
         clipped mid-glyph by the scroll edge. -->
    <div class="relative flex items-center justify-between gap-1 p-2">
      <div
        class="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-linear-to-t from-background to-transparent"
        aria-hidden="true"
      />
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
