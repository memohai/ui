<script setup lang="ts">
import { Moon, PanelLeftClose, Sun } from 'lucide-vue-next'
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
import { NavItem } from '#/components/settings'
import { SidebarGroupLabel } from '#/components/sidebar'
import { navGroups } from '../registry'
import { navigate, route } from '../router'
import { shellState } from '../shell'
import { tt, setLocale, localeState } from '../lib/i18n'
import type { Scheme } from '../theme'
import { SCHEMES, setScheme, setTheme, themeState } from '../theme'
import ChromeIconButton from './ChromeIconButton.vue'
</script>

<template>
  <!-- Collapses to zero width (animated, same curve as the right rail); the
       reopen affordance then lives in the tab bar. Inner content stays w-60
       so it clips instead of reflowing during the transition.
       The panel's whole geometry is the host settings sidebar's recipe
       (settings-sidebar/index.vue): 240px panel, px-4 (16px) list inset,
       compact SidebarGroupLabel, gap-1 row seams, NavItem rows — the only
       deliberate difference is that these rows carry no icons. -->
  <aside
    class="shrink-0 overflow-hidden border-border transition-[width] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
    :class="shellState.navOpen ? 'w-60 border-r' : 'w-0'"
  >
    <div class="flex h-full w-60 flex-col">
      <!-- The wordmark is the home link; combined with the selected row below
           it this IS the breadcrumb. The header matches the tab bar's h-11 +
           bottom hairline exactly, so the seam runs unbroken across both
           panels and the two titles share one baseline. -->
      <div class="flex h-11 shrink-0 items-center justify-between border-b border-border pr-2 pl-4">
        <!-- Wordmark text lands at 30px from the panel edge — the same edge
             the nav rows' text sits on (px-4 list inset + pl-3.5 row inset),
             the trick the host uses to align its compact label with its rows. -->
        <TextButton
          class="h-8 justify-start px-3.5 font-semibold"
          @click="navigate('overview')"
        >
          Felinic UI
        </TextButton>
        <ChromeIconButton
          :label="tt('Hide sidebar', '收起侧栏')"
          @click="shellState.navOpen = false"
        >
          <PanelLeftClose
            :stroke-width="1.75"
            class="size-4"
          />
        </ChromeIconButton>
      </div>
      <ScrollArea class="min-h-0 flex-1">
        <div class="px-4 pt-2 pb-2">
          <div
            v-for="(group, gi) in navGroups"
            :key="group.id"
            :class="gi > 0 ? 'pt-4' : ''"
          >
            <!-- Group label: the settings sidebar's compact tier, same
                 component the host uses — never a hand-rolled label. -->
            <SidebarGroupLabel size="compact">
              {{ tt(group.label, group.labelZh) }}
            </SidebarGroupLabel>
            <!-- The nav rows are the library's NavItem — the SAME settings-nav
               row the host's settings/bot-detail sidebars use (lifted owner,
               not a lookalike). gap-1 seams are the settings sidebar's menu
               rhythm. -->
            <div class="flex flex-col gap-1">
              <NavItem
                v-for="page in group.pages"
                :key="page.id"
                :active="route.id === page.id"
                @click="navigate(page.id)"
              >
                {{ tt(page.title, page.titleZh) }}
              </NavItem>
            </div>
          </div>
        </div>
      </ScrollArea>
      <!-- Theme + locale + scheme live at the sidebar foot. The scheme picker is
         the library's own Select — the showcase chrome dogfoods the styled
         menu, never the OS-native popup. The gradient strip fuses the foot
         with the list: rows fade out as they scroll under it instead of being
         clipped mid-glyph by the scroll edge. -->
      <div class="relative flex items-center justify-between gap-1 px-4 py-2">
        <div
          class="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-linear-to-t from-background to-transparent"
          aria-hidden="true"
        />
        <ChromeIconButton
          :label="themeState.theme === 'dark' ? tt('Switch to light theme', '切换到亮色主题') : tt('Switch to dark theme', '切换到暗色主题')"
          @click="setTheme(themeState.theme === 'dark' ? 'light' : 'dark')"
        >
          <Sun
            v-if="themeState.theme === 'dark'"
            :stroke-width="1.75"
            class="size-4"
          />
          <Moon
            v-else
            :stroke-width="1.75"
            class="size-4"
          />
        </ChromeIconButton>
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
    </div>
  </aside>
</template>
