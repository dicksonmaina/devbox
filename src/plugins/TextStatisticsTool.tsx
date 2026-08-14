import { useState, useEffect } from 'react'

interface Analysis {
  characters: number
  words: number
  lines: number
  paragraphs: number
  error?: string
}

export function TextStatisticsTool() {
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    if (!input.trim()) { setAnalysis(null); return }
    try {
      const lines = input.split('\n')
      const words = input.split(/\s+/).filter(w => w.length > 0)
      setAnalysis({
        characters: input.length,
        words: words.length,
        lines: lines.length,
        paragraphs: input.split('\n\n').filter(p => p.trim().length > 0).length
      })
    } catch (e) {
      setAnalysis({ characters: 0, words: 0, lines: 0, paragraphs: 0, error: e instanceof Error ? e.message : 'Analysis failed' })
    }
  }, [input])

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Text Statistics</h2>
        <p className="text-sm text-gray-500 mt-1">Count words, characters, sentences, and readability</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter text to analyze..."
          />
        </div>
        {analysis && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(analysis).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : String(value)}</div>
                <div className="text-sm text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
