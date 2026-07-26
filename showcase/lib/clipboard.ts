// Tiny clipboard helper shared by the Code panel and the swatch components.
// Returns success so callers decide on feedback; failures are silent by design
// (a dev tool on localhost doesn't need error toasts for a blocked clipboard).
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    return false
  }
}
