<script setup lang="ts">
import type { ComponentSpec, SpecState } from '../lib/spec'
import { computed, reactive, ref } from 'vue'
import { defaultState } from '../lib/spec'
import { shellState } from '../shell'
import CanvasStage from '../components/CanvasStage.vue'
import CodePanel from '../components/CodePanel.vue'
import ControlsPanel from '../components/ControlsPanel.vue'

const props = defineProps<{ spec: ComponentSpec }>()

// App keys this page by spec.id, so all state here resets on page change.
const state = reactive<SpecState>(defaultState(props.spec))
const example = ref<string>()
const viewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const expanded = ref(false)

const activeExample = computed(() => props.spec.examples?.find(e => e.name === example.value))

function set(key: string, value: string | number | boolean) {
  state[key] = value
  // A manual tweak diverges from the preset — drop the example highlight so it
  // never claims a state it no longer represents.
  if (activeExample.value) example.value = undefined
}

function selectExample(name: string) {
  const ex = props.spec.examples?.find(e => e.name === name)
  if (!ex) return
  example.value = name
  // Reset to spec defaults before applying the preset: keys left over from a
  // previous example (or manual play) never leak into the new one.
  Object.assign(state, defaultState(props.spec), ex.state)
}

const rendered = computed(() => (activeExample.value?.render ?? props.spec.render)(state))
const code = computed(() => (activeExample.value?.code ?? props.spec.code)(state))
</script>

<template>
  <div class="flex min-w-0 flex-1">
    <div class="flex min-w-0 flex-1 flex-col">
      <CanvasStage v-model="viewport">
        <component :is="rendered" />
      </CanvasStage>
      <CodePanel
        v-model:expanded="expanded"
        :code="code"
        :usage="spec.usage"
        :usage-zh="spec.usageZh"
      />
    </div>
    <ControlsPanel
      v-if="shellState.controlsOpen"
      :spec="spec"
      :state="state"
      :example="example"
      @set="set"
      @select-example="selectExample"
    />
  </div>
</template>
