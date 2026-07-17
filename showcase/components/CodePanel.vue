<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { SegmentedControl } from '#/components/segmented'
import type { SegmentedItem } from '#/components/segmented'
import { tt } from '../lib/i18n'
import CodeBlock from './CodeBlock.vue'

const props = defineProps<{ code: string, usage?: string, usageZh?: string }>()
const expanded = defineModel<boolean>('expanded', { default: false })

const tab = ref<'code' | 'usage'>('code')
// Usage stays visible-but-disabled when a spec has none — the tab row keeps a
// stable shape across pages instead of appearing/disappearing per component.
const tabs = computed<SegmentedItem<'code' | 'usage'>[]>(() => [
  { value: 'code', label: tt('Code', '代码') },
  { value: 'usage', label: tt('Usage', '用法'), disabled: !props.usage },
])

const usageText = computed(() => tt(props.usage ?? '', props.usageZh))

const copied = ref(false)
let timer: number | undefined
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = false), 1500)
  }
  catch {
    // Clipboard blocked (permissions / non-secure context). A dev tool doesn't
    // toast for this — the icon simply doesn't flip.
  }
}

const firstLine = computed(() => props.code.split('\n')[0] ?? '')
</script>

<template>
  <div class="shrink-0 border-t border-border">
    <div class="flex h-11 items-center gap-2 px-3">
      <SegmentedControl
        v-model="tab"
        :items="tabs"
        :aria-label="tt('Code panel tab', '代码面板标签')"
      />
      <div class="ml-auto flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-label="tt('Copy code', '复制代码')"
          @click="copy"
        >
          <Check
            v-if="copied"
            class="text-(--accent-green)"
          />
          <Copy v-else />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-label="expanded ? tt('Collapse code', '收起代码') : tt('Expand code', '展开代码')"
          @click="expanded = !expanded"
        >
          <ChevronDown v-if="expanded" />
          <ChevronUp v-else />
        </Button>
      </div>
    </div>
    <div
      v-if="tab === 'code'"
      class="px-3 pb-3"
      :class="expanded ? 'max-h-96 overflow-auto' : 'max-h-8 overflow-hidden'"
    >
      <CodeBlock :code="expanded ? code : firstLine" />
    </div>
    <div
      v-else
      class="max-h-96 overflow-auto px-3 pb-3"
    >
      <p class="text-body whitespace-pre-wrap text-muted-foreground">
        {{ usageText }}
      </p>
    </div>
  </div>
</template>
