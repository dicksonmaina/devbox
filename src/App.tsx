import { useState } from 'react'
import JsonTool from './components/JsonTool'
import Base64Tool from './components/Base64Tool'
import RegexTool from './components/RegexTool'
import JwtTool from './components/JwtTool'
import UuidTool from './components/UuidTool'
import TimestampTool from './components/TimestampTool'

type Tool = 'json' | 'base64' | 'regex' | 'jwt' | 'uuid' | 'timestamp'

const tools: { id: Tool; label: string; description: string }[] = [
  { id: 'json', label: 'JSON Formatter', description: 'Format, validate & minify JSON' },
  { id: 'base64', label: 'Base64', description: 'Encode & decode Base64 strings' },
  { id: 'regex', label: 'Regex Tester', description: 'Test patterns with live matching' },
  { id: 'jwt', label: 'JWT Decoder', description: 'Decode & inspect JSON Web Tokens' },
  { id: 'uuid', label: 'UUID Generator', description: 'Generate v4 UUIDs instantly' },
  { id: 'timestamp', label: 'Timestamp', description: 'Convert Unix timestamps to dates' },
]

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('json')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DevBox</h1>
              <p className="text-sm text-gray-500 mt-1">Free developer tools that just work</p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex flex-wrap gap-2 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTool === tool.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {activeTool === 'json' && <JsonTool />}
          {activeTool === 'base64' && <Base64Tool />}
          {activeTool === 'regex' && <RegexTool />}
          {activeTool === 'jwt' && <JwtTool />}
          {activeTool === 'uuid' && <UuidTool />}
          {activeTool === 'timestamp' && <TimestampTool />}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>DevBox is free, open-source, and runs entirely in your browser.</p>
        <p className="mt-1">No data leaves your device. No account required.</p>
      </footer>
    </div>
  )
}

export default App
