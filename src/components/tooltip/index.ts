import type { TooltipContentProps } from 'reka-ui'

export { default as Tooltip } from './Tooltip.vue'
export { default as TooltipContent } from './TooltipContent.vue'
export { default as TooltipProvider } from './TooltipProvider.vue'
export { default as TooltipTrigger } from './TooltipTrigger.vue'

// Single source of truth for the side/align axes. There is no cva here — the
// values come from reka's TooltipContentProps — so the keys are mirrored next
// to the re-export (keep them in sync). Consumed by the showcase spec so the
// controls panel never hand-maintains its own list.
export const tooltipSideKeys = [
  'top',
  'right',
  'bottom',
  'left',
] as const satisfies readonly NonNullable<TooltipContentProps['side']>[]

export const tooltipAlignKeys = [
  'start',
  'center',
  'end',
] as const satisfies readonly NonNullable<TooltipContentProps['align']>[]
