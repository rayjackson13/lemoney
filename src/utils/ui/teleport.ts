function createContainer(): HTMLDivElement {
  const container = document.createElement('div')
  container.role = 'presentation'
  container.className = 'Teleport-container'
  document.body.appendChild(container)

  return container
}

export function teleport(node: Node, rect: DOMRect | undefined) {
  if (!rect) return

  const container = createContainer()
  container.style.left = `${rect.left}px`
  container.style.top = `${rect.bottom}px`
  container.style.minWidth = `${rect.width}px`
  container.appendChild(node)

  return {
    destroy() {
      document.body.removeChild(container)
    },
  }
}
