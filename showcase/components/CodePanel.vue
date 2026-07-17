<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { Tabs, TabsList, TabsTrigger } from '#/components/tabs'
import { tt } from '../lib/i18n'
import CodeBlock from './CodeBlock.vue'

const props = defineProps<{ code: string, usage?: string, usageZh?: string }>()

// Code/Usage is panel switching, so it uses the library's Tabs (pill variant —
// the enclosed segment chrome) rather than a value-picker: AGENTS.md reaches
// for Tabs when switching panels.
const tab = ref('code')

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
</script>

<template>
  <!-- No collapse toggle: a one-line "collapsed" preview carried no
       information and only added a state to manage. The snippet is always
       fully visible; long ones scroll inside a capped height. -->
  <div class="shrink-0 border-t border-border">
    <div class="flex h-11 items-center gap-2 px-3">
      <!-- Usage stays visible-but-disabled when a spec has none — the tab row
           keeps a stable shape across pages instead of appearing/disappearing
           per component. -->
      <Tabs v-model="tab">
        <TabsList
          variant="pill"
          :aria-label="tt('Code panel tab', '代码面板标签')"
        >
          <TabsTrigger value="code">
            {{ tt('Code', '代码') }}
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            :disabled="!usage"
          >
            {{ tt('Usage', '用法') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button
        variant="ghost"
        size="icon-sm"
        class="ml-auto"
        :aria-label="tt('Copy code', '复制代码')"
        @click="copy"
      >
        <Check
          v-if="copied"
          class="text-(--accent-green)"
        />
        <Copy v-else />
      </Button>
    </div>
    <div
      v-if="tab === 'code'"
      class="max-h-96 overflow-auto px-3 pt-1 pb-3"
    >
      <CodeBlock :code="code" />
    </div>
    <div
      v-else
      class="max-h-96 overflow-auto px-3 pt-1 pb-3"
    >
      <p class="text-body whitespace-pre-wrap text-muted-foreground">
        {{ usageText }}
      </p>
    </div>
  </div>
</template>
