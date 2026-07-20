<script setup lang="ts">
import { computed, provide } from 'vue'
import { portalTargetKey } from '#/lib/portal'

// Per-column portal scope for the split stage: the light column gets `null`
// (overlays keep teleporting to <body> in the page theme), the dark column gets
// the body-level `.dark` container so its overlays render under dark tokens too.
// provide() is tree-scoped, so each column must wrap its slot in its OWN scope.
// The prop is the raw element (templates auto-unwrap refs); the computed keeps
// the provided value live across the container's mount.
const props = defineProps<{
  target: HTMLElement | null
}>()

provide(portalTargetKey, computed(() => props.target))
</script>

<template>
  <slot />
</template>
