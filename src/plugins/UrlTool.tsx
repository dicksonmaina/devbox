import { useState, useEffect } from 'react'

export function UrlTool() {
  const [input, setInput] = useState('https://example.com/search?q=hello world&lang=en')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid URL encoding')
      setOutput('')
    }
  }, [input, mode])

  const swap = () => {
    setInput(output)
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">URL Encoder / Decoder</h2>
          <p className="text-sm text-gray-500 mt-1">Encode and decode URL components safely</p>
        </div>
        <div className="flex gap-2">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(''); setOutput(''); setError('') }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? 'Raw URL / Text' : 'Encoded URL'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter encoded URL to decode...'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
          </label>
          <div className="relative">
            <pre className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto whitespace-pre-wrap break-words">
              {error ? <span className="text-red-600">{error}</span> : output || <span className="text-gray-400">Output will appear here...</span>}
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
