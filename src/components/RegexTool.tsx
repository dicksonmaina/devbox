import { useState, useMemo, useEffect } from 'react'

export default function RegexTool() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  const [text, setText] = useState('Contact us at support@devbox.io or sales@example.com for more info.')
  const [flags, setFlags] = useState('g')
  const [error, setError] = useState('')

  const matches = useMemo(() => {
    if (!pattern || error) return []
    try {
      const regex = new RegExp(pattern, flags)
      const results: { match: string; index: number }[] = []
      let match
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          results.push({ match: match[0], index: match.index })
          if (match.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        match = regex.exec(text)
        if (match) results.push({ match: match[0], index: match.index })
      }
      return results
    } catch {
      return []
    }
  }, [pattern, text, flags, error])

  useEffect(() => {
    try {
      new RegExp(pattern, flags)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex')
    }
  }, [pattern, flags])

  const highlightedText = useMemo(() => {
    if (!pattern || error || matches.length === 0) return text
    let result = ''
    let lastIndex = 0
    for (const match of matches) {
      result += text.slice(lastIndex, match.index)
      result += `<mark class="bg-yellow-200 text-gray-900 rounded px-0.5">${match.match}</mark>`
      lastIndex = match.index + match.match.length
    }
    result += text.slice(lastIndex)
    return result
  }, [text, matches, error, pattern])

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Regex Tester</h2>
        <p className="text-sm text-gray-500 mt-1">Test regex patterns with live matching</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Expression
          </label>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 font-mono text-sm">
              /
            </span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={`flex-1 px-4 py-2 font-mono text-sm bg-white border rounded-r-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter regex pattern..."
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flags
          </label>
          <div className="flex gap-4">
            {['g', 'i', 'm'].map((flag) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags(flags.includes(flag) ? flags : flags + flag)
                    } else {
                      setFlags(flags.replace(flag, ''))
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700 font-mono">{flag}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            g = global, i = case-insensitive, m = multiline
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test String
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter text to test against..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results ({matches.length} {matches.length === 1 ? 'match' : 'matches'})
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div
              className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: highlightedText || '<span class="text-gray-400">No matches</span>' }}
            />
          </div>
        </div>

        {matches.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Details
            </label>
            <div className="space-y-1">
              {matches.map((match, i) => (
                <div key={i} className="flex items-center gap-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm">
                  <span className="font-mono text-gray-900">{match.match}</span>
                  <span className="text-gray-400">at index {match.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
