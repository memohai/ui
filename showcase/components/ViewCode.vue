<script setup lang="ts">
import { ref } from 'vue'
import { Check, ChevronDown, Code, Copy } from 'lucide-vue-next'
import { TextButton } from '#/components/text-button'
import { copyText } from '../lib/clipboard'
import { tt } from '../lib/i18n'
import ChromeIconButton from './ChromeIconButton.vue'
import CodeBlock from './CodeBlock.vue'

// Collapsible code snippet for one doc section (shadcn's "View Code" pattern):
// a low-emphasis text trigger keeps the page dense — the reader scans live
// instances first and expands only the snippet they want. Always starts
// collapsed, Playground included.
const props = defineProps<{ code: string }>()

const open = ref(false)

const copied = ref(false)
let timer: number | undefined
async function copy() {
  if (!await copyText(props.code)) return
  copied.value = true
  clearTimeout(timer)
  timer = window.setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div>
    <TextButton
      :aria-expanded="open"
      @click="open = !open"
    >
      <Code
        :stroke-width="1.75"
        class="size-4"
      />
      {{ tt('Code', '代码') }}
      <ChevronDown
        :stroke-width="1.75"
        class="size-3.5 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </TextButton>
    <!-- Same frame the retired bottom CodePanel used: bare code on the page
         background reads as stray prose; muted-soft lifts it one rung. -->
    <div
      v-if="open"
      class="relative mt-2 max-h-96 overflow-auto rounded-lg border border-border-soft bg-(--muted-soft) px-3 py-2.5"
    >
      <ChromeIconButton
        class="absolute top-2 right-2"
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
      <CodeBlock :code="code" />
    </div>
  </div>
</template>
