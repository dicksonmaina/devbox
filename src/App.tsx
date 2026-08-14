import { useState, useEffect, lazy } from 'react'
import { registerAllTools } from './plugins/registry'
import { getAllTools, getTool, type ToolId } from './plugins'
import { ToolSuspense } from './plugins/ToolSuspense'
import { Analytics } from './analytics'

registerAllTools()

const allTools = getAllTools().sort((a: any, b: any) => (a.featured ? -1 : 1) - (b.featured ? -1 : 1))
const categories = Array.from(new Set(allTools.map((t: any) => t.category)))

function ToolIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    braces: <><path d="M8 3H5a2 2 0 00-2 2v3.5a2.5 2.5 0 00.5 2A2.5 2.5 0 015 13h3a2.5 2.5 0 001.5-2A2.5 2.5 0 0113 8.5V6a2 2 0 00-2-2h-3" /><path d="M16 3h3a2 2 0 012 2v3.5a2.5 2.5 0 01-.5 2 2.5 2.5 0 01-2.5 2.5h-3a2.5 2.5 0 00-1.5 2A2.5 2.5 0 0011 15.5V18a2 2 0 01-2 2h-3" /></>,
    hash: <><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></>,
    regex: <><path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z" /></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
    fingerprint: <><path d="M12 2a10 10 0 00-6.88 17.23 10 10 0 002.34-2.34A10 10 0 0012 22a10 10 0 006.88-17.23A10 10 0 0012 2z" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></>,
    palette: <><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12a10 10 0 009.7 9.95" /></>,
    'git-compare': <><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 009 9" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
    'shield-check': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>,
  }
  return (
    <svg className={className || 'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      {icons[icon] || null}
    </svg>
  )
}

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType<unknown>>> = {
  json: lazy(() => import('./plugins/JsonTool').then(m => ({ default: m.JsonTool }))),
  base64: lazy(() => import('./plugins/Base64Tool').then(m => ({ default: m.Base64Tool }))),
  regex: lazy(() => import('./plugins/RegexTool').then(m => ({ default: m.RegexTool }))),
  jwt: lazy(() => import('./plugins/JwtTool').then(m => ({ default: m.JwtTool }))),
  uuid: lazy(() => import('./plugins/UuidTool').then(m => ({ default: m.UuidTool }))),
  timestamp: lazy(() => import('./plugins/TimestampTool').then(m => ({ default: m.TimestampTool }))),
  url: lazy(() => import('./plugins/UrlTool').then(m => ({ default: m.UrlTool }))),
  color: lazy(() => import('./plugins/ColorTool').then(m => ({ default: m.ColorTool }))),
  diff: lazy(() => import('./plugins/DiffTool').then(m => ({ default: m.DiffTool }))),
  password: lazy(() => import('./plugins/PasswordTool').then(m => ({ default: m.PasswordTool }))),
  hash: lazy(() => import('./plugins/HashTool').then(m => ({ default: m.HashTool }))),
}

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('json')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTools = allTools.filter((tool: any) => {
    const matchesSearch = !searchQuery || tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.tags.some((t: string) => t.includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTools = filteredTools.filter((t: any) => t.featured)
  const showWelcome = !activeTool || !getTool(activeTool)

  const ActiveComponent = activeTool ? toolComponents[activeTool] : null

  useEffect(() => {
    const tool = getTool(activeTool)
    document.title = tool ? `${tool.name} - DevBox` : 'DevBox - Free Developer Tools'
  }, [activeTool])

  return (
    <div className="min-h-screen bg-gray-50">
      <Analytics />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">DevBox</h1>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Search tools..."
                />
              </div>
            </div>
            <a href="https://github.com/dicksonmaina/devbox" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => { setSelectedCategory(null); setSearchQuery('') }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${!selectedCategory ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            All Tools
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        {showWelcome ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to DevBox</h2>
              <p className="text-gray-500 mb-6">Free, open-source developer tools that run entirely in your browser.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredTools.map((tool) => (
                  <button key={tool.id} onClick={() => setActiveTool(tool.id as ToolId)} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <ToolIcon icon={tool.icon} className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900 text-sm">{tool.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <ToolSuspense>{ActiveComponent && <ActiveComponent />}</ToolSuspense>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>DevBox is free, open-source, and runs entirely in your browser.</p>
        <p className="mt-1">No data leaves your device. No account required.</p>
      </footer>
    </div>
  )
}

export default App
