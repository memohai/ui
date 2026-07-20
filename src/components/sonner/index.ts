export { default as Toaster } from './Toaster.vue'
export type { ToasterPosition, ToasterProps } from './Toaster.vue'
export {
  dismiss,
  pauseAll,
  resumeAll,
  toast,
  toasts,
} from './toast'
export type {
  ToastAction,
  ToastApi,
  ToastOptions,
  ToastRecord,
  ToastVariant,
} from './toast'

import type { ToastVariant as Variant } from './toast'

// Single source of truth for the variant axis, mirrored from the ToastVariant
// union in ./toast.ts (keep in sync). Consumed by the showcase spec so the
// controls panel never hand-maintains its own list.
export const toastVariantKeys = [
  'message',
  'success',
  'error',
  'info',
  'warning',
] as const satisfies readonly Variant[]
