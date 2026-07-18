<script setup lang="ts">
import { computed } from 'vue'
import { highlightToHtml } from '../lib/highlight'

const props = defineProps<{ code: string }>()

const html = computed(() => highlightToHtml(props.code))
</script>

<template>
  <!-- The frame matters: bare mono text on the page background reads as
       stray prose, not code. muted-soft lifts the block off the page one
       rung; whitespace-pre-wrap lets composite snippets (Select, InputGroup)
       wrap to the frame's width instead of demanding a horizontal scroll. -->
  <!-- eslint-disable-next-line vue/no-v-html — spec-authored, escaped by highlightToHtml -->
  <pre class="rounded-lg border border-border-soft bg-(--muted-soft) px-3 py-2.5 font-mono text-body whitespace-pre-wrap"><code v-html="html" /></pre>
</template>
