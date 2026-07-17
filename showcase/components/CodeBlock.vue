<script setup lang="ts">
import { computed } from 'vue'
import { highlightToHtml } from '../lib/highlight'

const props = defineProps<{ code: string }>()

const html = computed(() => highlightToHtml(props.code))
</script>

<template>
  <!-- whitespace-pre-wrap: composite snippets (Select, InputGroup) wrap to the
       panel's width instead of demanding a horizontal scroll. -->
  <!-- eslint-disable-next-line vue/no-v-html — spec-authored, escaped by highlightToHtml -->
  <pre class="font-mono text-body whitespace-pre-wrap"><code v-html="html" /></pre>
</template>
