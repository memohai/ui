<script setup lang="ts">
import { componentSpecs } from '../specs'
import { navigate } from '../router'
import { tt } from '../lib/i18n'
import RowButton from '../components/RowButton.vue'

// Status groups from AGENTS.md § Reference status — the source of truth for
// "which components are safe to pattern-match off". This board makes the
// contract visible instead of buried in prose.
const IN_PROGRESS = ['Slider', 'RadioGroup', 'Select menu surface', 'Combobox', 'PinInput', 'InputOTP', 'TagsInput']
const LEGACY = ['Badge (semantic fills)', 'Alert (semantic fills)', 'components/sidebar/ (23 files, unmigrated shadcn-vue import)']
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <section class="mb-10">
      <p class="max-w-xl text-control text-foreground">
        {{ tt(
          'The living reference for @felinic/ui — every page renders the real component, and every control drives the code snippet live.',
          '@felinic/ui 的活文档——每一页渲染的都是真实组件,每个控件都实时驱动代码片段。',
        ) }}
      </p>
      <p class="mt-2 max-w-xl text-body text-muted-foreground">
        {{ tt(
          'Theme and color scheme switch at the bottom of the sidebar; the controls panel and code panel frame every component page.',
          '主题与配色方案在侧栏底部切换;控件面板和代码面板框定每一个组件页。',
        ) }}
      </p>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Reference — copy these', '标杆——照抄这些') }}
      </h2>
      <div class="grid grid-cols-2 gap-x-6">
        <RowButton
          v-for="spec in componentSpecs"
          :key="spec.id"
          @select="navigate(`components/${spec.id}`)"
        >
          {{ spec.name }}
        </RowButton>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('In progress — check before use', '进行中——用前先确认') }}
      </h2>
      <p class="text-body text-muted-foreground">
        {{ IN_PROGRESS.join(' · ') }}
      </p>
    </section>

    <section>
      <h2 class="mb-3 text-label font-medium text-foreground">
        {{ tt('Legacy — do not pattern-match', '遗留——不要照抄') }}
      </h2>
      <p class="text-body text-muted-foreground">
        {{ LEGACY.join(' · ') }}
      </p>
    </section>
  </div>
</template>
