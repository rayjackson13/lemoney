export const onOutsideClick = (node: HTMLElement, cb: () => void) => {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      cb()
    }
  }

  document.addEventListener('click', handleClick, true)

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    },
  }
}
