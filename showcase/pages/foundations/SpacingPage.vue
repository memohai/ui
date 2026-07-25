<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { SPACING_STEPS } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'

// No custom spacing tokens exist — the system rides the Tailwind spacing
// ladder (0.25rem base). What the contract legislates is rem-vs-px: anything
// touching text uses the rem ladder so the whole UI scales with
// --memoh-ui-font-size; px is reserved for non-text decoration (hairlines,
// icon sizes, blur).
function rem(n: number): string {
  return `${n * 0.25}rem`
}
</script>

<template>
  <PageShell
    width="md"
    :title="tt('Spacing', '间距')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        bare
        :title="tt('The rem ladder', 'rem 阶梯')"
      >
        <!-- One-off demo figure, page-unique: each step is a number label, a
             proportional accent bar, and the resolved value — it demonstrates
             the ladder visually rather than staging a repeatable surface, so
             it is not a SpecimenTable row and not a general vocabulary. -->
        <div class="space-y-2">
          <div
            v-for="n in SPACING_STEPS"
            :key="n"
            class="flex items-center gap-4"
          >
            <span class="w-14 shrink-0 font-mono text-body text-muted-foreground">{{ n }}</span>
            <span
              class="h-2.5 rounded-sm"
              :style="{ width: rem(n), background: 'var(--accent-blue)' }"
            />
            <span class="font-mono text-caption text-muted-foreground">{{ rem(n) }} · {{ n * 4 }}px</span>
          </div>
        </div>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('rem, not px', '用 rem，不用 px')"
      >
        <div class="space-y-2 text-control text-muted-foreground">
          <p>
            {{ tt(
              'The root font size is var(--memoh-ui-font-size, 1rem) — the UI font-size control and browser zoom resize the whole UI through rem. A hardcoded px on a text-coupled property (font size, control height, padding, gaps) stops growing while the text around it grows.',
              '根字号是 var(--memoh-ui-font-size, 1rem)——界面字号设置和浏览器缩放都通过 rem 整体缩放 UI。写死 px 的文本相关属性(字号、控件高度、内距、间距)会在周围文字变大时停止跟随。',
            ) }}
          </p>
          <p>
            {{ tt(
              'px is only for non-text decoration: 1–4px hairlines, icon sizes, border/ring/translate offsets, and blur. JS layout (virtualizer estimates, scroll offsets) must derive from the root font size too.',
              'px 只用于非文本装饰:1–4px 发丝线、图标尺寸、border/ring/translate 偏移和模糊。JS 布局(虚拟列表行高、滚动偏移)同样要从根字号推导。',
            ) }}
          </p>
        </div>
      </SectionGroup>
    </div>
  </PageShell>
</template>
