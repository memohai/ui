<script setup lang="ts">
import type { ComponentSpec, ExampleSpec, SpecState } from '../lib/spec'
import { computed, h, reactive, ref } from 'vue'
import { Check, Copy, SlidersHorizontal } from 'lucide-vue-next'
import { defaultState, exampleAnchor } from '../lib/spec'
import { shellState } from '../shell'
import { copyText } from '../lib/clipboard'
import { tt } from '../lib/i18n'
import CanvasStage from '../components/CanvasStage.vue'
import ChromeIconButton from '../components/ChromeIconButton.vue'
import ControlsPanel from '../components/ControlsPanel.vue'
import ViewCode from '../components/ViewCode.vue'

// The component page is a DOC SPINE, not a mode-switched workbench: one
// vertical scroll — header → Playground → one section per example → All
// variants → Usage. The fusion this page is built around: the document's
// vertical flow shows many live instances at once (what a single stage never
// could), while the controls rail stays put on the right and keeps driving
// the Playground no matter how far you scroll.
const props = defineProps<{ spec: ComponentSpec }>()

// App keys this page by spec.id, so all state here resets on page change.
const state = reactive<SpecState>(defaultState(props.spec))
const viewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const docEl = ref<HTMLElement>()

function set(key: string, value: string | number | boolean) {
  state[key] = value
}

// Load a state-only preset into the Playground and scroll back to it. Only
// offered on examples WITHOUT a render override: an override composition
// (InputGroup adornments, Dialog content) can't be expressed by the controls,
// so "tweak in Playground" there would silently show a different component.
function openInPlayground(ex: ExampleSpec) {
  Object.assign(state, defaultState(props.spec), ex.state)
  docEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function jumpTo(anchor: string) {
  docEl.value?.querySelector(`#${anchor}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const rendered = computed(() => props.spec.render(state))
const code = computed(() => props.spec.code(state))
const usageText = computed(() => tt(props.spec.usage ?? '', props.spec.usageZh))

// An overlay spec (interactive: true) renders uncontrolled — a closed, live
// trigger you click to open. It opts out of the light/dark split: two open
// overlays can't coexist under reka's document-level DismissableLayer
// singleton (see CanvasStage).
const isOverlay = computed(() => props.spec.interactive === true)

// <component :is> renders a single VNode but NOT an array — specs whose
// render returns [trigger, overlay] (dialog, sonner) would blank the canvas.
// Normalize through a display:contents wrapper (layout-transparent, and h()
// accepts it without the Fragment typing gymnastics).
const playgroundBody = computed(() => h('div', { class: 'contents' }, [rendered.value]))

// Each example becomes one doc section: title + optional note + its instances
// frozen at the preset state + its own snippet. ALL sections render at once
// down the scroll — safe for overlay specs because their renders are closed,
// uncontrolled triggers (the pinning dead-lock came from controlled `open`,
// not from having many triggers on the page).
const exampleSections = computed(() =>
  (props.spec.examples ?? []).map((ex, i) => {
    const exState = Object.assign(defaultState(props.spec), ex.state)
    return {
      ex,
      anchor: exampleAnchor(i),
      tunable: !ex.render,
      // Children wrapped in an array: a bare VNodeChild can be null, which
      // h()'s RawChildren rejects; VNodeArrayChildren allows it.
      body: h('div', { class: 'flex flex-wrap items-center gap-3' }, [
        (ex.render ?? props.spec.render)(exState),
      ]),
      code: (ex.code ?? props.spec.code)(exState),
    }
  }),
)

// "All variants" — the static review wall, non-overlay specs only (an
// uncontrolled trigger can't be frozen open per cell, so interactive specs
// never declare a matrix).
const allVariantsBody = computed(() => {
  const m = props.spec.matrix!
  const rowVals = axisValues(m.rows)
  const colVals = axisValues(m.cols)
  return h('div', {
    class: 'inline-grid items-center gap-x-6 gap-y-4',
    style: { gridTemplateColumns: `repeat(${colVals.length + 1}, auto)` },
  }, [
    h('span'),
    ...colVals.map(c => h('span', { class: 'text-center text-body font-medium text-muted-foreground' }, String(c))),
    ...rowVals.flatMap(r => [
      h('span', { class: 'text-body font-medium text-muted-foreground' }, String(r)),
      ...colVals.map(c => h('span', { class: 'flex items-center justify-center' }, [
        props.spec.render(Object.assign(defaultState(props.spec), { [m.rows]: r, [m.cols]: c })),
      ])),
    ]),
  ])
})

function axisValues(key: string): Array<string | boolean> {
  const c = props.spec.controls.find(c => c.key === key)
  if (c?.kind === 'enum') return [...c.options]
  if (c?.kind === 'boolean') return [false, true]
  return []
}

const importCopied = ref(false)
let importTimer: number | undefined
async function copyImports() {
  if (!props.spec.imports || !await copyText(props.spec.imports)) return
  importCopied.value = true
  clearTimeout(importTimer)
  importTimer = window.setTimeout(() => (importCopied.value = false), 1500)
}
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1">
    <!-- The doc column owns the page scroll; the rail beside it never moves,
         so Playground controls stay at hand anywhere down the spine. -->
    <div
      ref="docEl"
      class="min-w-0 flex-1 overflow-y-auto"
    >
      <div class="mx-auto flex max-w-3xl flex-col gap-12 px-8 py-10">
        <header>
          <h1 class="text-heading font-semibold text-foreground">
            {{ spec.name }}
          </h1>
          <p class="mt-2 text-body text-muted-foreground">
            {{ tt(spec.description, spec.descriptionZh) }}
          </p>
          <div
            v-if="spec.imports"
            class="mt-3 flex items-center gap-1"
          >
            <code class="font-mono text-body text-muted-foreground">{{ spec.imports }}</code>
            <ChromeIconButton
              :label="tt('Copy import', '复制 import')"
              @click="copyImports"
            >
              <Check
                v-if="importCopied"
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
        </header>

        <section id="playground">
          <h2 class="mb-3 text-title font-semibold text-foreground">
            {{ tt('Playground', '试一试') }}
          </h2>
          <!-- Fixed-height frame: CanvasStage is built for flex-1 fill, so the
               wrapper gives the doc-flow section a concrete height and the
               stage's columns scroll inside it. -->
          <div class="flex h-80 flex-col overflow-hidden rounded-lg border border-border-soft">
            <CanvasStage
              v-model="viewport"
              :can-split="!isOverlay"
            >
              <component :is="playgroundBody" />
            </CanvasStage>
          </div>
          <ViewCode
            class="mt-3"
            :code="code"
            default-open
          />
        </section>

        <section
          v-for="s in exampleSections"
          :id="s.anchor"
          :key="s.ex.name"
          class="scroll-mt-6"
        >
          <div class="mb-1 flex items-center">
            <h2 class="text-title font-semibold text-foreground">
              {{ tt(s.ex.name, s.ex.nameZh) }}
            </h2>
            <ChromeIconButton
              v-if="s.tunable"
              class="ml-auto"
              :label="tt('Tweak in Playground', '在 Playground 中调整')"
              @click="openInPlayground(s.ex)"
            >
              <SlidersHorizontal
                :stroke-width="1.75"
                class="size-4"
              />
            </ChromeIconButton>
          </div>
          <p
            v-if="s.ex.note"
            class="mb-3 text-body text-muted-foreground"
          >
            {{ tt(s.ex.note, s.ex.noteZh) }}
          </p>
          <component :is="s.body" />
          <ViewCode
            class="mt-3"
            :code="s.code"
          />
        </section>

        <section
          v-if="spec.matrix"
          id="all-variants"
          class="scroll-mt-6"
        >
          <h2 class="mb-3 text-title font-semibold text-foreground">
            {{ tt('All variants', '全部变体') }}
          </h2>
          <component :is="allVariantsBody" />
        </section>

        <section
          v-if="spec.usage"
          id="usage"
          class="scroll-mt-6"
        >
          <h2 class="mb-3 text-title font-semibold text-foreground">
            {{ tt('Usage', '用法') }}
          </h2>
          <p class="text-body whitespace-pre-wrap text-muted-foreground">
            {{ usageText }}
          </p>
        </section>
      </div>
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
        @set="set"
        @jump-example="jumpTo"
      />
    </aside>
  </div>
</template>
