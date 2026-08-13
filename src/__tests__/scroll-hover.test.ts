import assert from 'node:assert/strict'
import test from 'node:test'
import type { FrameScheduler } from '../lib/scroll-hover'
import { createScrollHover } from '../lib/scroll-hover'

function createScheduler() {
  let nextHandle = 1
  const callbacks = new Map<number, FrameRequestCallback>()
  const scheduler: FrameScheduler = {
    request(callback) {
      const handle = nextHandle++
      callbacks.set(handle, callback)
      return handle
    },
    cancel(handle) {
      callbacks.delete(handle)
    },
  }
  return {
    scheduler,
    flush() {
      const pending = [...callbacks.values()]
      callbacks.clear()
      pending.forEach(callback => callback(0))
    },
    pending: () => callbacks.size,
  }
}

function createFixture() {
  function createItem() {
    const attributes = new Set<string>()
    const item = {
      closest: () => item,
      setAttribute: (name: string) => attributes.add(name),
      removeAttribute: (name: string) => attributes.delete(name),
    } as unknown as HTMLElement
    return { attributes, item }
  }

  const first = createItem()
  const second = createItem()
  let hit: Element | null = first.item
  const scope = {
    contains: (target: Element) => target === first.item || target === second.item,
    ownerDocument: {
      elementFromPoint: () => hit,
    },
  } as unknown as HTMLElement
  return {
    first,
    second,
    scope,
    setHit: (target: Element | null) => hit = target,
  }
}

test('moves hover to the element under the stationary pointer while scrolling', () => {
  const frame = createScheduler()
  const fixture = createFixture()
  const hover = createScrollHover(frame.scheduler)

  hover.pointerMove({ clientX: 20, clientY: 30, currentTarget: fixture.scope } as unknown as PointerEvent)
  assert.equal(fixture.first.attributes.has('data-pointer-hover'), true)

  fixture.setHit(fixture.second.item)
  hover.start({ currentTarget: fixture.scope } as unknown as Event)
  frame.flush()

  assert.equal(fixture.first.attributes.has('data-pointer-hover'), false)
  assert.equal(fixture.second.attributes.has('data-pointer-hover'), true)
  assert.equal(frame.pending(), 1)
})

test('keeps syncing frames until scrollend', () => {
  const frame = createScheduler()
  const fixture = createFixture()
  const hover = createScrollHover(frame.scheduler)

  hover.start({ currentTarget: fixture.scope } as unknown as Event)
  assert.equal(frame.pending(), 1)

  frame.flush()
  assert.equal(frame.pending(), 1)

  hover.end({ currentTarget: fixture.scope } as unknown as Event)
  frame.flush()
  assert.equal(frame.pending(), 0)
})

test('pointerleave and dispose clear managed hover state', () => {
  const frame = createScheduler()
  const fixture = createFixture()
  const hover = createScrollHover(frame.scheduler)

  hover.pointerMove({ clientX: 20, clientY: 30, currentTarget: fixture.scope } as unknown as PointerEvent)
  hover.pointerLeave()
  assert.equal(fixture.first.attributes.has('data-pointer-hover'), false)

  hover.pointerMove({ clientX: 20, clientY: 30, currentTarget: fixture.scope } as unknown as PointerEvent)
  hover.end({ currentTarget: fixture.scope } as unknown as Event)
  hover.dispose()

  assert.equal(fixture.first.attributes.has('data-pointer-hover'), false)
  assert.equal(frame.pending(), 0)
})
