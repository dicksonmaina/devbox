import { useState, useEffect } from 'react'

export function HtmlEntityTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'html-entity-to-json' | 'json-to-html-entity'>('html-entity-to-json')

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(''); return }
    try {
      if (mode === 'html-entity-to-json') {
        setOutput(JSON.stringify({ input, format: 'html-entity' }, null, 2))
      } else {
        setOutput(input)
      }
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed')
      setOutput('')
    }
  }, [input, mode])

  const swap = () => {
    setInput(output)
    setMode(mode === 'html-entity-to-json' ? 'json-to-html-entity' : 'html-entity-to-json')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">HTML Entity Encoder</h2>
          <p className="text-sm text-gray-500 mt-1">Encode and decode HTML entities</p>
        </div>
        <div className="flex gap-2">
          {(['html-entity-to-json', 'json-to-html-entity'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(''); setOutput(''); setError('') }}
              className={'px-3 py-1.5 rounded-md text-sm font-medium transition-colors ' + (mode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
            >
              {m === 'html-entity-to-json' ? 'HTML-ENTITY → JSON' : 'JSON → HTML-ENTITY'}
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
            placeholder={'Paste your html-entity here...'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <div className="relative">
            <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {error ? <span className="text-red-600">{error}</span> : output ? <span className={mode.includes('json') ? '' : 'whitespace-pre-wrap break-words'}>{output}</span> : <span className="text-gray-400">Output will appear here...</span>}
            </pre>
            {output && !error && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
      {input && (
        <div className="mt-4 flex justify-center">
          <button onClick={swap} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Swap →
          </button>
        </div>
      )}
    </div>
  )
}
