<script setup lang="ts">
import type { ComponentSpec, SpecState } from '../lib/spec'
import { computed, h, reactive, ref } from 'vue'
import { defaultState, exampleAnchor } from '../lib/spec'
import { tt } from '../lib/i18n'
import CanvasStage from '../components/CanvasStage.vue'
import ControlsPanel from '../components/ControlsPanel.vue'

// The component page is a DOC SPINE, not a mode-switched workbench: one
// vertical scroll — intro (name + description) → controls → Playground →
// one section per example → All variants → Usage. The fusion this page is
// built around: the document's vertical flow shows many live instances at
// once (what a single stage never could), while tweaking stays one scroll
// away at the top.
const props = defineProps<{ spec: ComponentSpec }>()

// App keys this page by spec.id, so all state here resets on page change.
const state = reactive<SpecState>(defaultState(props.spec))
const viewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

function set(key: string, value: string | number | boolean) {
  state[key] = value
}

const rendered = computed(() => props.spec.render(state))
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
// frozen at the preset state. ALL sections render at once down the scroll —
// safe for overlay specs because their renders are closed, uncontrolled
// triggers (the pinning dead-lock came from controlled `open`, not from
// having many triggers on the page).
const exampleSections = computed(() =>
  (props.spec.examples ?? []).map((ex, i) => {
    const exState = Object.assign(defaultState(props.spec), ex.state)
    return {
      ex,
      anchor: exampleAnchor(i),
      // Children wrapped in an array: a bare VNodeChild can be null, which
      // h()'s RawChildren rejects; VNodeArrayChildren allows it.
      body: h('div', { class: 'flex flex-wrap items-center gap-3' }, [
        (ex.render ?? props.spec.render)(exState),
      ]),
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
    ...colVals.map(c => h('span', { class: 'text-center text-body font-medium whitespace-nowrap text-muted-foreground' }, String(c))),
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
</script>

<template>
  <!-- The doc column owns the page scroll. Section rhythm uses the contract's
       spacing rungs: gap-6 between page-level sections (the host's page
       rhythm), gap-3 inside a section (title → note → body). -->
  <div class="min-w-0 flex-1 overflow-y-auto">
    <div class="mx-auto flex max-w-3xl flex-col gap-6 px-8 py-10">
      <header class="flex flex-col gap-2">
        <h1 class="text-heading font-semibold text-foreground">
          {{ spec.name }}
        </h1>
        <p class="text-body text-muted-foreground">
          {{ tt(spec.description, spec.descriptionZh) }}
        </p>
      </header>

      <section
        id="playground"
        class="flex flex-col gap-3"
      >
        <h2 class="text-title font-semibold text-foreground">
          {{ tt('Playground', '试一试') }}
        </h2>
        <ControlsPanel
          :spec="spec"
          :state="state"
          @set="set"
        />
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
      </section>

      <section
        v-for="s in exampleSections"
        :id="s.anchor"
        :key="s.ex.name"
        class="flex scroll-mt-6 flex-col gap-3"
      >
        <h2 class="text-title font-semibold text-foreground">
          {{ tt(s.ex.name, s.ex.nameZh) }}
        </h2>
        <p
          v-if="s.ex.note"
          class="text-body text-muted-foreground"
        >
          {{ tt(s.ex.note, s.ex.noteZh) }}
        </p>
        <component :is="s.body" />
      </section>

      <section
        v-if="spec.matrix"
        id="all-variants"
        class="flex scroll-mt-6 flex-col gap-3"
      >
        <h2 class="text-title font-semibold text-foreground">
          {{ tt('All variants', '全部变体') }}
        </h2>
        <!-- Wide grids (Button: variant × 7 sizes) outgrow the measure;
               scroll sideways rather than clip. -->
        <div class="overflow-x-auto pb-2">
          <component :is="allVariantsBody" />
        </div>
      </section>

      <section
        v-if="spec.usage"
        id="usage"
        class="flex scroll-mt-6 flex-col gap-3"
      >
        <h2 class="text-title font-semibold text-foreground">
          {{ tt('Usage', '用法') }}
        </h2>
        <p class="text-body whitespace-pre-wrap text-muted-foreground">
          {{ usageText }}
        </p>
      </section>
    </div>
  </div>
</template>
