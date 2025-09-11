import type { Position } from '$types/global'

type Params = {
  rect?: DOMRect | null
  position?: Position | null
}

function createContainer(): HTMLDivElement {
  const container = document.createElement('div')
  container.role = 'presentation'
  container.className = 'Teleport-container'
  document.body.appendChild(container)

  return container
}

export function teleport(node: Node, { rect, position }: Params) {
  if (!rect && !position) return

  const container = createContainer()

  if (position) {
    container.style.left = `${position.x}px`
    container.style.top = `${position.y}px`
    container.style.minWidth = '200px'
  }

  if (rect) {
    container.style.left = `${rect.left}px`
    container.style.top = `${rect.bottom}px`
    container.style.minWidth = `${rect.width}px`
  }

  container.appendChild(node)

  return {
    destroy() {
      document.body.removeChild(container)
    },
  }
}
