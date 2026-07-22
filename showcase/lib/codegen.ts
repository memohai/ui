// Attr serializers for the specs' hand-written code() templates. Each helper
// OMITS the attr when the value equals the component's own default, so the
// snippet only shows what the user actually changed — the collapsed one-line
// preview stays readable.

/** ` variant="secondary"` — omitted when value === def. */
export function strAttr(name: string, value: string, def?: string): string {
  return value === def ? '' : ` ${name}="${value}"`
}

/** ` disabled` when true, nothing when false. */
export function boolAttr(name: string, value: boolean): string {
  return value ? ` ${name}` : ''
}

/** ` :max="3"` — omitted when value === def. */
export function numAttr(name: string, value: number, def?: number): string {
  return value === def ? '' : ` :${name}="${value}"`
}
