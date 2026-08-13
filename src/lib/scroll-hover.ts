export function createScrollHover() {
  let pointer: { x: number, y: number } | undefined
  let hovered: HTMLElement | undefined
  let frame: number | undefined
  let scrolling = false
  let scope: HTMLElement | undefined

  function setHovered(next: HTMLElement | undefined): void {
    if (hovered === next)
      return
    hovered?.removeAttribute('data-pointer-hover')
    next?.setAttribute('data-pointer-hover', '')
    hovered = next
  }

  function sync(scope: HTMLElement): void {
    if (!pointer)
      return setHovered(undefined)
    const hit = scope.ownerDocument.elementFromPoint(pointer.x, pointer.y)
    const target = hit?.closest<HTMLElement>('[data-settings-nav-item]')
    setHovered(target && scope.contains(target) ? target : undefined)
  }

  function scheduleSync(): void {
    if (frame !== undefined)
      return
    frame = requestAnimationFrame(() => {
      frame = undefined
      if (scope)
        sync(scope)
      if (scrolling)
        scheduleSync()
    })
  }

  function pointerMove(event: PointerEvent): void {
    pointer = { x: event.clientX, y: event.clientY }
    sync(event.currentTarget as HTMLElement)
  }

  function pointerLeave(): void {
    pointer = undefined
    setHovered(undefined)
  }

  function start(event: Event): void {
    scope = event.currentTarget as HTMLElement
    if (!scrolling) {
      scrolling = true
    }
    scheduleSync()
  }

  function end(event: Event): void {
    scope = event.currentTarget as HTMLElement
    scrolling = false
    scheduleSync()
  }

  function dispose(): void {
    scrolling = false
    if (frame !== undefined)
      cancelAnimationFrame(frame)
    frame = undefined
    scope = undefined
    setHovered(undefined)
  }

  return { pointerMove, pointerLeave, start, end, dispose }
}
