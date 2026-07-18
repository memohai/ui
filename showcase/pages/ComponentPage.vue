<script setup lang="ts">
import type { ComponentSpec, SpecState } from '../lib/spec'
import { computed, reactive, ref } from 'vue'
import { PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { Button } from '#/components/button'
import { defaultState } from '../lib/spec'
import { shellState } from '../shell'
import { tt } from '../lib/i18n'
import CanvasStage from '../components/CanvasStage.vue'
import CodePanel from '../components/CodePanel.vue'
import ControlsPanel from '../components/ControlsPanel.vue'

const props = defineProps<{ spec: ComponentSpec }>()

// App keys this page by spec.id, so all state here resets on page change.
const state = reactive<SpecState>(defaultState(props.spec))
const example = ref<string>()
const viewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

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
        :code="code"
        :usage="spec.usage"
        :usage-zh="spec.usageZh"
      />
    </div>
    <!-- Right rail: the controls panel plus its own toggle. Collapsed it is a
         bare icon-width strip (w-10); the width animates on the system's
         standard curve. v-show keeps panel state alive across toggles. -->
    <aside
      class="flex shrink-0 flex-col overflow-hidden border-l border-border transition-[width] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="shellState.controlsOpen ? 'w-72' : 'w-10'"
    >
      <div
        class="flex h-11 shrink-0 items-center"
        :class="shellState.controlsOpen ? 'justify-end px-2' : 'justify-center'"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-label="shellState.controlsOpen ? tt('Hide controls', '收起控件面板') : tt('Show controls', '展开控件面板')"
          @click="shellState.controlsOpen = !shellState.controlsOpen"
        >
          <PanelRightClose v-if="shellState.controlsOpen" />
          <PanelRightOpen v-else />
        </Button>
      </div>
      <ControlsPanel
        v-show="shellState.controlsOpen"
        :spec="spec"
        :state="state"
        :example="example"
        @set="set"
        @select-example="selectExample"
      />
    </aside>
  </div>
</template>
