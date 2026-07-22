<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '#/components/tabs'
import { tt } from '../lib/i18n'
import ChromeIconButton from './ChromeIconButton.vue'
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
      <ChromeIconButton
        class="ml-auto"
        :label="tt('Copy code', '复制代码')"
        @click="copy"
      >
        <Check
          v-if="copied"
          :stroke-width="1.75"
          class="size-4 text-(--accent-green)"
        />
        <Copy
          v-else
          :stroke-width="1.75"
          class="size-4"
        />
      </ChromeIconButton>
    </div>
    <!-- Both tabs share one frame: bare content on the page background reads
         as stray prose, not panel content. muted-soft lifts it one rung. -->
    <div class="px-3 pt-1 pb-3">
      <div class="max-h-96 overflow-auto rounded-lg border border-border-soft bg-(--muted-soft) px-3 py-2.5">
        <CodeBlock
          v-if="tab === 'code'"
          :code="code"
        />
        <p
          v-else
          class="text-body whitespace-pre-wrap text-muted-foreground"
        >
          {{ usageText }}
        </p>
      </div>
    </div>
  </div>
</template>
