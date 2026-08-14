export function createScrollHover() {
  let pointer: { x: number, y: number } | undefined
  let hovered: HTMLElement | undefined
  let frame: number | undefined

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

  function scheduleSync(scope: HTMLElement): void {
    if (frame !== undefined)
      return
    frame = requestAnimationFrame(() => {
      frame = undefined
      sync(scope)
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

  function scroll(event: Event): void {
    scheduleSync(event.currentTarget as HTMLElement)
  }

  function dispose(): void {
    if (frame !== undefined)
      cancelAnimationFrame(frame)
    frame = undefined
    setHovered(undefined)
  }

  return { pointerMove, pointerLeave, scroll, dispose }
}
