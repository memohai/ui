<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { componentSpecs } from '../specs'
import { defaultState } from '../lib/spec'
import { STAGE_FRAME_CLASS } from '../lib/frame'
import { navigate } from '../router'
import { tt } from '../lib/i18n'

// The landing page is a LIVE index, not a link list: every Reference component
// renders its default state inside its card. Previews are inert
// (pointer-events-none) — the whole card is the link to the component page,
// where the controls panel drives the live instance. State is created once
// per card; nothing here ever mutates it.
const cards = componentSpecs.map((spec) => {
  const state = defaultState(spec)
  // Overlay specs render UNCONTROLLED — the closed trigger IS the honest
  // thumbnail. The one exception is Tooltip, which seeds itself open via
  // defaultOpen for its own page; the __preview flag tells it (and any future
  // resting-open overlay) to stay closed in a thumbnail so the landing page
  // never sprouts a floating pill over an unrelated card.
  state.__preview = true
  return { spec, render: () => spec.render(state) }
})

// Status groups from AGENTS.md § Reference status — the source of truth for
// "which components are safe to pattern-match off". This board makes the
// contract visible instead of buried in prose.
const IN_PROGRESS = ['Slider', 'RadioGroup', 'Select menu surface', 'Combobox', 'PinInput', 'InputOTP', 'TagsInput']
const LEGACY = ['Badge (semantic fills)', 'Alert (semantic fills)', 'components/sidebar/ (23 files, unmigrated shadcn-vue import)']
</script>

<template>
  <PageShell
    width="xl"
    :title="tt('Overview', '概览')"
    :description="tt(
      'The living reference for @felinic/ui — every page renders the real component, live and tweakable.',
      '@felinic/ui 的活文档——每一页渲染的都是真实组件,活的、可调。',
    )"
  >
    <div class="flex flex-col gap-8">
      <!-- Second intro paragraph: usage guidance, the lead-in to the body
           below — deliberately bare prose, not a section with its own
           heading. -->
      <p class="max-w-xl text-control text-muted-foreground">
        {{ tt(
          'Theme and color scheme switch at the bottom of the sidebar; each component page pairs a control board with live examples down the scroll.',
          '主题与配色方案在侧栏底部切换;每个组件页上方是控制板,向下滚动是一节节活示例。',
        ) }}
      </p>

      <SectionGroup
        heading
        :title="tt('Reference — copy these', '标杆——照抄这些')"
      >
        <!-- Index-card grid gutter (gap-4): the landing board's one-off
             relationship — tighter than the section rhythm because every
             card already carries its own STAGE_FRAME border. -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <button
            v-for="{ spec, render } in cards"
            :key="spec.id"
            type="button"
            :class="[STAGE_FRAME_CLASS, 'flex cursor-pointer flex-col p-4 text-left transition-colors hover:bg-(--ui-hover)']"
            @click="navigate(`components/${spec.id}`)"
          >
            <!-- Card title rung (text-title semibold): one step BELOW the
                 section heading (text-heading) it lives under. -->
            <div class="mb-1 text-title font-semibold text-foreground">
              {{ spec.name }}
            </div>
            <p class="mb-4 line-clamp-2 text-control text-muted-foreground">
              {{ tt(spec.description, spec.descriptionZh) }}
            </p>
            <!-- Nested preview well: one radius step smaller (rounded-md)
                 than the STAGE_FRAME card around it. -->
            <div
              class="pointer-events-none mt-auto flex min-h-20 w-full items-center justify-center rounded-md border border-border-soft p-3"
              aria-hidden="true"
            >
              <component :is="render" />
            </div>
          </button>
        </div>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('In progress — check before use', '进行中——用前先确认')"
      >
        <p class="text-control text-muted-foreground">
          {{ IN_PROGRESS.join(' · ') }}
        </p>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Legacy — do not pattern-match', '遗留——不要照抄')"
      >
        <p class="text-control text-muted-foreground">
          {{ LEGACY.join(' · ') }}
        </p>
      </SectionGroup>
    </div>
  </PageShell>
</template>
