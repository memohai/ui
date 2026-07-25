<script setup lang="ts">
import { PageShell, SectionGroup } from '#/components/settings'
import { ELEVATION_SCALE } from '../../lib/foundations-data'
import { tt } from '../../lib/i18n'

// Elevation is a scarce, tokenized ladder — flat by default (Tailwind's
// shadow-sm is deliberately zeroed in style.css), shadows only here.
</script>

<template>
  <PageShell
    width="lg"
    :title="tt('Elevation', '阴影')"
  >
    <div class="flex flex-col gap-8">
      <SectionGroup
        heading
        :title="tt('The ladder', '阶梯')"
      >
        <!-- One-off demo figure, page-unique: a two-column grid pairing the
             same shadow swatch in light and (scoped `.dark`) dark side by
             side — the shadow is only legible against its own surface, so
             this comparison layout is a demo stage, not a general vocabulary. -->
        <div class="grid grid-cols-2 gap-6">
          <template
            v-for="e in ELEVATION_SCALE"
            :key="e.token"
          >
            <div class="p-3">
              <div
                class="mb-3 flex h-20 items-center justify-center rounded-lg bg-card"
                :style="{ boxShadow: `var(${e.token})` }"
              >
                <span class="font-mono text-body text-foreground">{{ e.token }}</span>
              </div>
              <p class="text-body text-muted-foreground">
                {{ tt(e.role, e.roleZh) }}
              </p>
            </div>
            <div class="dark rounded-lg bg-background p-3">
              <div
                class="mb-3 flex h-20 items-center justify-center rounded-lg bg-card"
                :style="{ boxShadow: `var(${e.token})` }"
              >
                <span class="font-mono text-body text-foreground">{{ e.token }}</span>
              </div>
              <p class="text-body text-muted-foreground">
                {{ tt(e.role, e.roleZh) }}
              </p>
            </div>
          </template>
        </div>
      </SectionGroup>

      <SectionGroup
        heading
        bare
        :title="tt('Rules', '规则')"
      >
        <div class="space-y-2 text-control text-muted-foreground">
          <p>
            {{ tt(
              'Flat controls and Cards carry no shadow. An invented shadow-xs/md/lg — or a shadow-none fighting an inherited one — is the dirty tell.',
              '扁平控件和卡片一律无阴影。凭空写的 shadow-xs/md/lg——或者用 shadow-none 去对抗继承来的阴影——就是 dirty 的信号。',
            ) }}
          </p>
          <p>
            {{ tt(
              'Modal surfaces over the scrim use --border-menu-elevated: transparent in light (panel + scrim + shadow already separate), a white hairline in dark.',
              'scrim 之上的模态表面用 --border-menu-elevated:亮色下透明(面板 + scrim + 阴影已经足够分层),暗色下是一道白色发丝线。',
            ) }}
          </p>
        </div>
      </SectionGroup>
    </div>
  </PageShell>
</template>
