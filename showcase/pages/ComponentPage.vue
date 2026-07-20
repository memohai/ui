<script setup lang="ts">
import type { ComponentSpec, SpecState } from '../lib/spec'
import { computed, h, reactive, ref } from 'vue'
import { SegmentedControl } from '#/components/segmented'
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
const stageMode = ref<'single' | 'examples' | 'matrix'>('single')

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

// ── Stage modes ─────────────────────────────────────────────────────────────
// 'single' is the live instance the controls drive. 'examples' tiles every
// preset with its label — frozen at each preset's state, deliberately NOT
// live: a preset wall answers "what states exist", the controls answer "what
// happens when I tweak". 'matrix' crosses two declared axes over defaults.
const modeItems = computed(() => [
  { value: 'single', label: tt('Single', '单个') },
  ...(props.spec.examples?.length ? [{ value: 'examples', label: tt('Examples', '示例') }] : []),
  ...(props.spec.matrix ? [{ value: 'matrix', label: tt('Matrix', '矩阵') }] : []),
])

function axisValues(key: string): Array<string | boolean> {
  const c = props.spec.controls.find(c => c.key === key)
  if (c?.kind === 'enum') return [...c.options]
  if (c?.kind === 'boolean') return [false, true]
  return []
}

const examplesBody = computed(() =>
  h('div', { class: 'flex w-full flex-col gap-8' },
    (props.spec.examples ?? []).map(ex =>
      h('div', {}, [
        h('div', { class: 'mb-2 text-body font-medium text-muted-foreground' }, tt(ex.name, ex.nameZh)),
        // Children wrapped in an array: a bare VNodeChild can be null, which
        // h()'s RawChildren rejects; VNodeArrayChildren allows it.
        h('div', { class: 'flex flex-wrap items-center gap-3' }, [
          (ex.render ?? props.spec.render)(Object.assign(defaultState(props.spec), ex.state)),
        ]),
      ]),
    ),
  ),
)

const matrixBody = computed(() => {
  const m = props.spec.matrix!
  const rowVals = axisValues(m.rows)
  const colVals = axisValues(m.cols)
  // A matrix is a review wall: overlay specs (open-pin control) render every
  // cell pinned open — a positioner grid of closed triggers reviews nothing.
  const pin = props.spec.controls.some(c => c.key === 'open') ? { open: true } : {}
  return h('div', {
    class: 'inline-grid items-center gap-x-6 gap-y-4',
    style: { gridTemplateColumns: `repeat(${colVals.length + 1}, auto)` },
  }, [
    h('span'),
    ...colVals.map(c => h('span', { class: 'text-center text-body font-medium text-muted-foreground' }, String(c))),
    ...rowVals.flatMap(r => [
      h('span', { class: 'text-body font-medium text-muted-foreground' }, String(r)),
      ...colVals.map(c => h('span', { class: 'flex items-center justify-center' }, [
        props.spec.render(Object.assign(defaultState(props.spec), { [m.rows]: r, [m.cols]: c }, pin)),
      ])),
    ]),
  ])
})

const body = computed(() => {
  if (stageMode.value === 'examples' && props.spec.examples?.length) return examplesBody.value
  if (stageMode.value === 'matrix' && props.spec.matrix) return matrixBody.value
  // <component :is> renders a single VNode but NOT an array — specs whose
  // render returns [trigger, overlay] (dialog, sonner) would blank the
  // canvas. Normalize through a display:contents wrapper (layout-transparent,
  // and h() accepts it without the Fragment typing gymnastics).
  return h('div', { class: 'contents' }, [rendered.value])
})
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1">
    <div class="flex min-w-0 flex-1 flex-col">
      <CanvasStage v-model="viewport">
        <component :is="body" />
        <template
          v-if="modeItems.length > 1"
          #modes
        >
          <SegmentedControl
            v-model="stageMode"
            :items="modeItems"
            :aria-label="tt('Stage view', '画布视图')"
          />
        </template>
      </CanvasStage>
      <CodePanel
        :code="code"
        :usage="spec.usage"
        :usage-zh="spec.usageZh"
      />
    </div>
    <!-- Right rail: collapses to zero width (animated, same curve as the left
         sidebar); its toggle lives in the tab bar. v-show keeps panel state
         alive across toggles. -->
    <aside
      class="shrink-0 overflow-hidden border-border transition-[width] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="shellState.controlsOpen ? 'w-72 border-l' : 'w-0'"
    >
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
