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

function setContainerPosition(container: HTMLDivElement, { rect, position }: Params) {
  if (position) {
    container.style.left = `${position.x}px`
    container.style.top = `${position.y}px`
    container.style.minWidth = '200px'
  }

  if (rect) {
    const direction = rect.bottom < window.innerHeight / 2 ? 1 : -1
    console.log(direction)
    container.style.left = `${rect.left}px`
    container.style.minWidth = `${rect.width}px`

    if (direction === 1) {
      container.style.top = `${rect.bottom}px`
      container.style.bottom = '8px'
      container.style.justifyContent = 'flex-start'
    } else {
      console.log('rect', rect)
      container.style.bottom = `${window.innerHeight - rect.top + 1}px`
      container.style.top = '8px'
      container.style.justifyContent = 'flex-end'
    }
  }
}

export function teleport(node: Node, params: Params) {
  if (!params.rect && !params.position) return

  const container = createContainer()
  setContainerPosition(container, params)
  container.appendChild(node)

  return {
    update(newParams: Params) {
      setContainerPosition(container, newParams)
    },
    destroy() {
      document.body.removeChild(container)
    },
  }
}
