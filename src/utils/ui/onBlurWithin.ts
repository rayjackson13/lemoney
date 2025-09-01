export function onBlurWithin(node: HTMLElement, callback: () => void) {
  function handleFocusOut() {
    requestAnimationFrame(() => {
      if (!node.contains(document.activeElement)) {
        callback()
      }
    })
  }

  node.addEventListener('focusout', handleFocusOut)

  return {
    destroy() {
      node.removeEventListener('focusout', handleFocusOut)
    },
  }
}
