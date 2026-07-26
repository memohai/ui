import type { PopoverContentProps } from 'reka-ui'
import type PopoverContentComponent from './PopoverContent.vue'

export { default as Popover } from './Popover.vue'
export { default as PopoverAnchor } from './PopoverAnchor.vue'
export { default as PopoverContent } from './PopoverContent.vue'
export { default as PopoverTrigger } from './PopoverTrigger.vue'

// Single source of truth for the side/align/motion axes. PopoverContent is
// hand-composed (no cva), so the axes are mirrored here next to the component
// and checked against the prop types (keep them in sync). Consumed by the
// showcase specs so the controls panel never hand-maintains its own list.
export const popoverSideKeys = [
  'top',
  'right',
  'bottom',
  'left',
] as const satisfies readonly NonNullable<PopoverContentProps['side']>[]

export const popoverAlignKeys = [
  'start',
  'center',
  'end',
] as const satisfies readonly NonNullable<PopoverContentProps['align']>[]

type PopoverContentOwnProps = InstanceType<typeof PopoverContentComponent>['$props']

export const popoverMotionKeys = [
  'menu',
  'zoom',
] as const satisfies readonly NonNullable<PopoverContentOwnProps['motion']>[]
