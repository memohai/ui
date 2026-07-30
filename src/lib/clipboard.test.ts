/// <reference types="node" />

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { useClipboard } from './clipboard'

const savedGlobals = new Map(
  ['document', 'navigator', 'HTMLElement'].map((name) => [
    name,
    Object.getOwnPropertyDescriptor(globalThis, name),
  ]),
)

afterEach(() => {
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else Reflect.deleteProperty(globalThis, name)
  }
})

class FakeHTMLElement {
  closestResult: FakeHTMLElement | null = null
  parent: FakeHTMLElement | null = null
  appended: FakeHTMLElement | null = null
  value = ''
  selectCalls = 0
  readonly style: Record<string, string> = {}

  constructor(private readonly documentRef: FakeDocument) {}

  appendChild<T extends FakeHTMLElement>(child: T): T {
    this.documentRef.appendTarget = this
    this.appended = child
    child.parent = this
    return child
  }

  closest<T extends FakeHTMLElement>(): T | null {
    return this.closestResult as T | null
  }

  focus() {
    this.documentRef.activeElement = this
  }

  select() {
    this.selectCalls += 1
  }

  remove() {
    if (this.parent?.appended === this) this.parent.appended = null
    this.parent = null
  }
}

class FakeDocument {
  readonly body = new FakeHTMLElement(this)
  activeElement: FakeHTMLElement = this.body
  appendTarget: FakeHTMLElement | null = null
  createdElement: FakeHTMLElement | null = null
  execCommandCalls = 0

  createElement() {
    this.createdElement = new FakeHTMLElement(this)
    return this.createdElement
  }

  execCommand(command: string) {
    assert.equal(command, 'copy')
    this.execCommandCalls += 1
    return true
  }
}

test('keeps the HTTP fallback inside the active dialog', async () => {
  const documentRef = new FakeDocument()
  const dialog = new FakeHTMLElement(documentRef)
  const button = new FakeHTMLElement(documentRef)
  button.closestResult = dialog
  documentRef.activeElement = button

  for (const [name, value] of [
    ['document', documentRef],
    ['navigator', {}],
    ['HTMLElement', FakeHTMLElement],
  ] as const) {
    Object.defineProperty(globalThis, name, { configurable: true, value })
  }

  assert.equal(await useClipboard().copyText('hello'), true)
  assert.equal(documentRef.execCommandCalls, 1)
  assert.equal(documentRef.appendTarget, dialog)
  assert.equal(documentRef.createdElement?.value, 'hello')
  assert.equal(documentRef.createdElement?.selectCalls, 1)
  assert.equal(dialog.appended, null)
  assert.equal(documentRef.activeElement, button)
})
