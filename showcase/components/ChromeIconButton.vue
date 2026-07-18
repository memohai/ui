<script setup lang="ts">
import { Button } from '#/components/button'

// The shell's ONE chrome icon button, mirroring the app topbar's recipe:
// ghost circle at size-7, ink muted → foreground on hover. Icons are passed
// in with :stroke-width="1.75" class="size-4" — the app's chrome stroke is
// 1.75, not lucide's default 2.
defineProps<{ label: string, disabled?: boolean, pressed?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    shape="circle"
    class="size-7 hover:text-foreground"
    :class="pressed ? 'text-foreground' : 'text-muted-foreground'"
    :aria-label="label"
    :aria-pressed="pressed"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </Button>
</template>
