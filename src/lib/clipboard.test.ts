/// <reference types="node" />

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { useClipboard } from './clipboard'

const originalGlobals = new Map(
  ['document', 'navigator', 'HTMLElement'].map((name) => [
    name,
    Object.getOwnPropertyDescriptor(globalThis, name),
  ]),
)

afterEach(() => {
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor)
    }
    else {
      Reflect.deleteProperty(globalThis, name)
    }
  }
})

class FakeHTMLElement {
  readonly children: FakeHTMLElement[] = []
  parentElement: FakeHTMLElement | null = null
  role: string | null = null
  value = ''
  readOnly = false
  tabIndex = 0
  readonly style: Record<string, string> = {}
  selectCalls = 0

  constructor(readonly documentRef: FakeDocument) {}

  appendChild<T extends FakeHTMLElement>(child: T): T {
    child.parentElement = this
    this.children.push(child)
    this.documentRef.appendTargets.push(this)
    return child
  }

  closest<T extends FakeHTMLElement>(): T | null {
    if (this.role === 'dialog' || this.role === 'alertdialog') {
      return this as unknown as T
    }
    return this.parentElement?.closest<T>() ?? null
  }

  focus() {
    this.documentRef.activeElement = this
  }

  select() {
    this.selectCalls += 1
  }

  remove() {
    if (!this.parentElement) return
    const index = this.parentElement.children.indexOf(this)
    if (index >= 0) this.parentElement.children.splice(index, 1)
    this.parentElement = null
  }
}

class FakeDocument {
  readonly body = new FakeHTMLElement(this)
  readonly appendTargets: FakeHTMLElement[] = []
  activeElement: FakeHTMLElement | null = this.body
  execCommandCalls = 0
  execCommandResult = true
  execCommandError: Error | null = null
  lastExecCommandActiveElement: FakeHTMLElement | null = null

  createElement() {
    return new FakeHTMLElement(this)
  }

  execCommand(command: string) {
    assert.equal(command, 'copy')
    this.execCommandCalls += 1
    this.lastExecCommandActiveElement = this.activeElement
    if (this.execCommandError) throw this.execCommandError
    return this.execCommandResult
  }
}

function installBrowserGlobals(
  documentRef: FakeDocument,
  navigatorRef: { clipboard?: { writeText: (text: string) => Promise<void> } } = {},
) {
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: documentRef,
  })
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: navigatorRef,
  })
  Object.defineProperty(globalThis, 'HTMLElement', {
    configurable: true,
    value: FakeHTMLElement,
  })
}

test('uses the Clipboard API when it succeeds', async () => {
  const documentRef = new FakeDocument()
  const writes: string[] = []
  installBrowserGlobals(documentRef, {
    clipboard: {
      async writeText(text) {
        writes.push(text)
      },
    },
  })

  const { copyText } = useClipboard()

  assert.equal(await copyText('hello'), true)
  assert.deepEqual(writes, ['hello'])
  assert.equal(documentRef.execCommandCalls, 0)
})

test('falls back inside the active dialog and restores focus', async () => {
  const documentRef = new FakeDocument()
  const dialog = new FakeHTMLElement(documentRef)
  dialog.role = 'dialog'
  const button = new FakeHTMLElement(documentRef)
  dialog.appendChild(button)
  button.focus()
  documentRef.appendTargets.length = 0
  installBrowserGlobals(documentRef)

  const { copyText } = useClipboard()

  assert.equal(await copyText('hello'), true)
  assert.equal(documentRef.appendTargets[documentRef.appendTargets.length - 1], dialog)
  assert.equal(documentRef.lastExecCommandActiveElement?.value, 'hello')
  assert.equal(documentRef.lastExecCommandActiveElement?.selectCalls, 1)
  assert.deepEqual(dialog.children, [button])
  assert.equal(documentRef.activeElement, button)
})

test('falls back when the Clipboard API rejects the write', async () => {
  const documentRef = new FakeDocument()
  installBrowserGlobals(documentRef, {
    clipboard: {
      async writeText() {
        throw new Error('denied')
      },
    },
  })

  const { copyText } = useClipboard()

  assert.equal(await copyText('hello'), true)
  assert.equal(documentRef.execCommandCalls, 1)
})

test('uses the document body when no dialog is active', async () => {
  const documentRef = new FakeDocument()
  const button = new FakeHTMLElement(documentRef)
  documentRef.body.appendChild(button)
  button.focus()
  documentRef.appendTargets.length = 0
  installBrowserGlobals(documentRef)

  const { copyText } = useClipboard()

  assert.equal(await copyText('hello'), true)
  assert.equal(documentRef.appendTargets[documentRef.appendTargets.length - 1], documentRef.body)
  assert.deepEqual(documentRef.body.children, [button])
  assert.equal(documentRef.activeElement, button)
})

test('cleans up and reports failure when execCommand throws', async () => {
  const documentRef = new FakeDocument()
  const button = new FakeHTMLElement(documentRef)
  documentRef.body.appendChild(button)
  button.focus()
  documentRef.execCommandError = new Error('copy failed')
  installBrowserGlobals(documentRef)

  const { copyText } = useClipboard()

  assert.equal(await copyText('hello'), false)
  assert.deepEqual(documentRef.body.children, [button])
  assert.equal(documentRef.activeElement, button)
})
