const DEBUG_KEY = 'devbox_debug'

export function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.get('debug') === 'true') return true
  try {
    return localStorage.getItem(DEBUG_KEY) === 'true'
  } catch {
    return false
  }
}

export function enableDebugMode() {
  try {
    localStorage.setItem(DEBUG_KEY, 'true')
    console.log('[DevBox] Debug mode enabled')
  } catch {
    console.warn('[DevBox] Cannot enable debug mode')
  }
}

export function disableDebugMode() {
  try {
    localStorage.removeItem(DEBUG_KEY)
    console.log('[DevBox] Debug mode disabled')
  } catch {
    console.warn('[DevBox] Cannot disable debug mode')
  }
}

export function debugLog(...args: unknown[]) {
  if (isDebugMode()) {
    console.log('[DevBox Debug]', ...args)
  }
}

export function debugTime(label: string) {
  if (isDebugMode()) {
    console.time('[DevBox] ' + label)
  }
}

export function debugTimeEnd(label: string) {
  if (isDebugMode()) {
    console.timeEnd('[DevBox] ' + label)
  }
}

export function debugError(label: string, error: unknown) {
  if (isDebugMode()) {
    console.error('[DevBox Error] ' + label, error)
  }
}

export function debugToolAction(toolId: string, action: string, data?: unknown) {
  if (isDebugMode()) {
    console.log('[DevBox Tool]', { toolId, action, data, timestamp: new Date().toISOString() })
  }
}
