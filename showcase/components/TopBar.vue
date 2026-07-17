<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, ArrowRight, PanelRight } from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/breadcrumb'
import { Button } from '#/components/button'
import { neighbor } from '../registry'
import { navigate, route } from '../router'
import { tt } from '../lib/i18n'
import { shellState } from '../shell'

const props = defineProps<{ title: string, titleZh?: string }>()

const prev = computed(() => neighbor(route.id, -1))
const next = computed(() => neighbor(route.id, 1))
const pageTitle = computed(() => tt(props.title, props.titleZh))
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3">
    <!-- The library's own Breadcrumb: home crumb is a TextButton back to
         Overview, current page is BreadcrumbPage. -->
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            as="button"
            @click="navigate('overview')"
          >
            Felinic UI
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ pageTitle }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="ml-auto flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        :aria-label="tt('Previous page', '上一页')"
        :disabled="!prev"
        @click="prev && navigate(prev.id)"
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        :aria-label="tt('Next page', '下一页')"
        :disabled="!next"
        @click="next && navigate(next.id)"
      >
        <ArrowRight />
      </Button>
      <!-- Panel-open state is an icon-weight shift (muted → foreground), the
           same quiet treatment as the canvas viewport toggle — ghost buttons
           have no selected chrome of their own. -->
      <Button
        variant="ghost"
        size="icon-sm"
        :aria-label="tt('Toggle controls panel', '切换控件面板')"
        :class="shellState.controlsOpen ? 'text-foreground' : 'text-muted-foreground'"
        @click="shellState.controlsOpen = !shellState.controlsOpen"
      >
        <PanelRight />
      </Button>
    </div>
  </header>
</template>
