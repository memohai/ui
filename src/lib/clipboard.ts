const focusTrapContainerSelector = '[role="dialog"], [role="alertdialog"]'

function resolveFallbackContainer(documentRef: Document): HTMLElement {
  const activeElement = documentRef.activeElement
  if (activeElement instanceof HTMLElement) {
    return activeElement.closest<HTMLElement>(focusTrapContainerSelector) ?? documentRef.body
  }
  return documentRef.body
}

function copyWithExecCommand(documentRef: Document, text: string): boolean {
  if (typeof documentRef.execCommand !== 'function') return false

  const previousFocus = documentRef.activeElement instanceof HTMLElement
    ? documentRef.activeElement
    : null
  const textArea = documentRef.createElement('textarea')
  textArea.value = text
  textArea.readOnly = true
  textArea.tabIndex = -1
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '0'
  resolveFallbackContainer(documentRef).appendChild(textArea)

  try {
    textArea.focus()
    textArea.select()
    return documentRef.execCommand('copy')
  } catch {
    return false
  } finally {
    textArea.remove()
    previousFocus?.focus()
  }
}

// SSR/touch-safe clipboard access. The legacy fallback stays inside an active
// dialog so focus traps cannot steal its temporary textarea selection.
export function useClipboard() {
  const hasNavigatorClipboard = typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText
  const hasExecCommandFallback = typeof document !== 'undefined' && typeof document.execCommand === 'function'
  const isSupported = hasNavigatorClipboard || hasExecCommandFallback

  async function copyText(text: string): Promise<boolean> {
    if (!isSupported) return false

    if (hasNavigatorClipboard && typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(text)
        return true
      }
      catch {
        return false
      }
    }

    if (!hasExecCommandFallback || typeof document === 'undefined') return false
    return copyWithExecCommand(document, text)
  }

  return {
    isSupported,
    copyText,
  }
}
