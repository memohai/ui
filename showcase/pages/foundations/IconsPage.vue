<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRight,
  Bold,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  Italic,
  Loader2,
  Minus,
  MoreHorizontal,
  PanelLeft,
  Plus,
  RefreshCw,
  Search,
  Strikethrough,
  TriangleAlert,
  Underline,
  X,
} from 'lucide-vue-next'
import { copyText } from '../../lib/clipboard'
import { tt } from '../../lib/i18n'
import { ICON_SIZE_LADDER } from '../../lib/foundations-data'

// Every lucide icon the library itself renders (grep: src/ → lucide-vue-next),
// canonicalized (the *Icon import aliases collapse to one entry). Click copies
// the component name. Brand/provider glyphs are a different package:
// @memohai/icon in the host — not part of this library.
const ICONS = [
  ['ArrowRight', ArrowRight],
  ['Bold', Bold],
  ['CalendarDays', CalendarDays],
  ['Check', Check],
  ['ChevronDown', ChevronDown],
  ['ChevronLeft', ChevronLeft],
  ['ChevronRight', ChevronRight],
  ['ChevronsLeft', ChevronsLeft],
  ['ChevronsRight', ChevronsRight],
  ['ChevronUp', ChevronUp],
  ['Circle', Circle],
  ['CircleAlert', CircleAlert],
  ['CircleCheck', CircleCheck],
  ['CircleX', CircleX],
  ['Info', Info],
  ['Italic', Italic],
  ['Loader2', Loader2],
  ['Minus', Minus],
  ['MoreHorizontal', MoreHorizontal],
  ['PanelLeft', PanelLeft],
  ['Plus', Plus],
  ['RefreshCw', RefreshCw],
  ['Search', Search],
  ['Strikethrough', Strikethrough],
  ['TriangleAlert', TriangleAlert],
  ['Underline', Underline],
  ['X', X],
] as const

const copied = ref('')
let timer: number | undefined
async function copy(name: string) {
  if (await copyText(name)) {
    copied.value = name
    clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = ''), 1200)
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <section class="mb-10">
      <h2 class="mb-3 text-title font-semibold text-foreground">
        {{ tt('Used by the library', '库内使用的图标') }}
      </h2>
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="[name, comp] in ICONS"
          :key="name"
          type="button"
          class="flex cursor-pointer flex-col items-center gap-1.5 rounded-md py-3 hover:bg-(--ui-hover)"
          :title="`${tt('Copy', '复制')} ${name}`"
          @click="copy(name)"
        >
          <component
            :is="comp"
            class="size-4 text-foreground"
          />
          <span class="font-mono text-caption text-muted-foreground">
            {{ copied === name ? tt('Copied', '已复制') : name }}
          </span>
        </button>
      </div>
      <p class="mt-3 text-body text-muted-foreground">
        {{ tt(
          'Icons are always lucide-vue-next components, never typed text glyphs — a glyph can\'t receive the sizing ladder or the 2px stroke. Brand and provider icons come from the host\'s @memohai/icon package.',
          '图标永远是 lucide-vue-next 组件,绝不是手打的文字符号——符号字符吃不到尺寸阶梯和 2px 描边。品牌/服务商图标来自宿主仓的 @memohai/icon 包。',
        ) }}
      </p>
    </section>

    <section>
      <h2 class="mb-3 text-title font-semibold text-foreground">
        {{ tt('Size ladder', '尺寸阶梯') }}
      </h2>
      <div class="border-y border-border-soft">
        <div
          v-for="s in ICON_SIZE_LADDER"
          :key="s.px"
          class="flex items-center justify-between gap-6 border-b border-border-soft py-2 last:border-b-0"
        >
          <span class="flex items-center gap-3 text-body text-foreground">
            <Search :style="{ width: `${s.px}px`, height: `${s.px}px` }" />
            {{ s.px }}px
          </span>
          <span class="text-right text-body text-muted-foreground">{{ tt(s.role, s.roleZh) }}</span>
        </div>
      </div>
      <p class="mt-3 text-body text-muted-foreground">
        {{ tt(
          'Pick the rung — never a free-set size. Containers pin it with [&_svg]:size-4 (16px), size-3.5 (14px), or size-3 (12px).',
          '按档位选——绝不随手写尺寸。容器用 [&_svg]:size-4(16px)、size-3.5(14px)或 size-3(12px)统一固定。',
        ) }}
      </p>
    </section>
  </div>
</template>
