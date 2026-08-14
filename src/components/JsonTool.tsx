import { useState, useEffect } from 'react'

export default function JsonTool() {
  const [input, setInput] = useState('{\n  "name": "DevBox",\n  "version": "1.0.0"\n}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format')

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      if (mode === 'minify') {
        setOutput(JSON.stringify(parsed))
      } else if (mode === 'validate') {
        setOutput('✓ Valid JSON')
      } else {
        setOutput(JSON.stringify(parsed, null, 2))
      }
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input, mode])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">JSON Formatter</h2>
          <p className="text-sm text-gray-500 mt-1">Format, validate, or minify JSON</p>
        </div>
        <div className="flex gap-2">
          {(['format', 'minify', 'validate'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <div className="relative">
            <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {error ? (
                <span className="text-red-600">{error}</span>
              ) : output ? (
                <span className={mode === 'validate' ? 'text-green-600 font-semibold' : ''}>{output}</span>
              ) : (
                <span className="text-gray-400">Output will appear here...</span>
              )}
            </pre>
            {output && !error && mode !== 'validate' && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
