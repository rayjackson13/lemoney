import { readable } from 'svelte/store'

const queryMap = {
  xs: '(width < 40rem)',
  sm: '(width >= 40rem)',
  md: '(width >= 48rem)',
  lg: '(width >= 64rem)',
  xl: '(width >= 80rem)',
  '2xl': '(width >= 96rem)',
} as const

export function useMediaQuery(breakpoint: keyof typeof queryMap) {
  return readable(false, (set) => {
    if (typeof window === 'undefined') return

    const query = queryMap[breakpoint] ?? queryMap['xs']
    const mediaQueryList = window.matchMedia(query)
    set(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => {
      set(event.matches)
    }

    mediaQueryList.addEventListener('change', listener)

    return () => {
      mediaQueryList.removeEventListener('change', listener)
    }
  })
}
