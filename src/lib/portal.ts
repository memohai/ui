import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, inject } from 'vue'

// Portal-target redirection for overlay primitives (Select, Dialog, Tooltip, …).
//
// Why this exists: reka portals default to <body>, which is correct for the app
// but breaks any host that scopes a theme BELOW the root — e.g. a side-by-side
// light/dark stage where the dark column is a nested `.dark` subtree. An overlay
// teleported to <body> escapes that subtree and keeps the page (light) theme.
//
// The host provides a Ref to an alternative container element under this key
// (null = not yet mounted / no override); every overlay wrapper resolves it via
// usePortalTarget() and passes it as the portal's `to`. When nothing is provided
// the composable yields undefined and reka falls back to <body> — zero behavior
// change for existing consumers.
//
// The container is typically a plain <div class="dark"> appended to <body> (NOT
// inside the scoped column itself): it must sit outside overflow/transform
// ancestors so floating-ui positioning and fixed overlays keep working, while
// still inheriting the scoped theme variables.
export type PortalTargetRef = Readonly<Ref<HTMLElement | null>>
export const portalTargetKey: InjectionKey<PortalTargetRef | null> = Symbol('felinic-portal-target')

export function usePortalTarget(): ComputedRef<HTMLElement | undefined> {
  const target = inject(portalTargetKey, null)
  return computed(() => target?.value ?? undefined)
}
