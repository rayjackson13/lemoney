type ExtendedNavigator = Navigator & {
  userAgentData: {
    platform: string
  }
}

export function getOS() {
  const { userAgentData } = navigator as ExtendedNavigator

  if (userAgentData) {
    const platform = userAgentData.platform || ''
    return platform.toLowerCase().includes('mac') ? 'mac' : 'windows'
  }

  // Fallback for older browsers
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'mac'
  if (ua.includes('win')) return 'windows'
  return 'other'
}

export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
