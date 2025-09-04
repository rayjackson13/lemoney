export function isEqual(a: unknown, b: unknown): boolean {
  const visited = new WeakMap<object, object>()

  function compare(o1: unknown, o2: unknown): boolean {
    if (o1 === o2) return true

    if (typeof o1 !== typeof o2 || (typeof o1 === 'function' && typeof o2 === 'function'))
      return false

    if (o1 === null || o2 === null) return o1 === o2

    if (Array.isArray(o1) && Array.isArray(o2)) {
      if (o1.length !== o2.length) return false
      return o1.every((item, i) => compare(item, o2[i]))
    }

    if (o1 instanceof Date && o2 instanceof Date) {
      return o1.getTime() === o2.getTime()
    }

    if (typeof o1 === 'object' && typeof o2 === 'object') {
      if (visited.has(o1)) {
        return visited.get(o1) === o2
      }
      visited.set(o1, o2)

      const keys1 = Object.keys(o1 as object)
      const keys2 = Object.keys(o2 as object)
      if (keys1.length !== keys2.length) return false

      for (const key of keys1) {
        if (
          !keys2.includes(key) ||
          !compare((o1 as Record<string, unknown>)[key], (o2 as Record<string, unknown>)[key])
        )
          return false
      }
      return true
    }

    return false
  }

  return compare(a, b)
}
