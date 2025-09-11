type Params = {
  callback: () => unknown
  refs?: (HTMLElement | undefined)[]
}

export const onOutsideClick = (node: HTMLElement, { callback, refs = [] }: Params) => {
  function isRefsContainTarget(target: Node) {
    return refs.some((item) => !!item && item.contains(target))
  }

  function handleClick(event: MouseEvent) {
    const target = event.target as Node
    if (!node.contains(target) && !isRefsContainTarget(target)) {
      callback()
    }
  }

  function handleContextMenu(event: MouseEvent) {
    const target = event.target as Node
    if (!node.contains(target) && !isRefsContainTarget(target)) {
      callback()
    }
  }

  function handleFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node | null
    if (relatedTarget && !node.contains(relatedTarget) && !isRefsContainTarget(relatedTarget)) {
      callback()
    }
  }

  document.addEventListener('click', handleClick, true)
  document.addEventListener('contextmenu', handleContextMenu, true)
  node.addEventListener('focusout', handleFocusOut, true)

  return {
    update(newParams: Params) {
      refs = newParams.refs ?? []
    },
    destroy() {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('contextmenu', handleContextMenu, true)
      node.removeEventListener('focusout', handleFocusOut, true)
    },
  }
}
