import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storage = {
      get: (key: string) => {
        try { return JSON.parse(localStorage.getItem(`devbox_${key}`) || 'null') } catch { return null }
      },
      set: (key: string, value: unknown) => {
        try { localStorage.setItem(`devbox_${key}`, JSON.stringify(value)) } catch { /* quota exceeded */ }
      },
    }

    const track = (event: string, data?: Record<string, unknown>) => {
      const today = new Date().toISOString().split('T')[0]
      const stats = storage.get('usage') || { sessions: 0, tools: {}, dates: {} }
      stats.sessions = (stats.sessions || 0) + 1
      stats.tools = stats.tools || {}
      stats.tools[event] = (stats.tools[event] || 0) + 1
      stats.dates = stats.dates || {}
      stats.dates[today] = (stats.dates[today] || 0) + 1
      storage.set('usage', stats)
      if (data) storage.set(`last_${event}`, data)
    }

    track('page_view')

    return () => {
      const stats = storage.get('usage') as { sessions: number; tools: Record<string, number>; dates: Record<string, number> } | null
      if (stats?.sessions && stats.sessions > 1) {
        console.log('[DevBox] Local analytics:', stats)
      }
    }
  }, [])

  return null
}
