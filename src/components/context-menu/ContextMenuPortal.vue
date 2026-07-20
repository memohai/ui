<script setup lang="ts">
import type { ContextMenuPortalProps } from 'reka-ui'
import { ContextMenuPortal } from 'reka-ui'
import { usePortalTarget } from '#/lib/portal'

const props = defineProps<ContextMenuPortalProps>()
const portalTo = usePortalTarget()
</script>

<template>
  <!-- An explicit caller `to` always wins; the injected scope target is only the
       fallback (and undefined falls through to reka's <body> default). -->
  <ContextMenuPortal
    data-slot="context-menu-portal"
    v-bind="props"
    :to="props.to ?? portalTo"
  >
    <slot />
  </ContextMenuPortal>
</template>
