import { useState, useMemo } from 'react'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNumber?: number
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: DiffLine[] = []

  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]

    if (oldLine === undefined && newLine !== undefined) {
      result.push({ type: 'added', content: newLine, lineNumber: i + 1 })
    } else if (oldLine !== undefined && newLine === undefined) {
      result.push({ type: 'removed', content: oldLine, lineNumber: i + 1 })
    } else if (oldLine !== newLine) {
      if (oldLine !== undefined) result.push({ type: 'removed', content: oldLine, lineNumber: i + 1 })
      if (newLine !== undefined) result.push({ type: 'added', content: newLine, lineNumber: i + 1 })
    } else {
      result.push({ type: 'unchanged', content: oldLine || '', lineNumber: i + 1 })
    }
  }
  return result
}

export function DiffTool() {
  const [oldText, setOldText] = useState('const greeting = "hello"\nconsole.log(greeting)')
  const [newText, setNewText] = useState('const greeting = "world"\nconsole.log(greeting)\nconsole.log("new line")')
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  const diff = useMemo(() => computeDiff(oldText, newText), [oldText, newText])
  const stats = useMemo(() => ({
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length,
  }), [diff])

  const swap = () => {
    const temp = oldText
    setOldText(newText)
    setNewText(temp)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Text Diff</h2>
          <p className="text-sm text-gray-500 mt-1">Compare two texts side by side</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            <span className="text-green-600 font-medium">+{stats.added}</span>
            <span className="mx-1">/</span>
            <span className="text-red-600 font-medium">-{stats.removed}</span>
          </div>
          <div className="flex gap-2">
            {(['split', 'unified'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m === 'split' ? 'Split' : 'Unified'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original</label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Original text..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modified</label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Modified text..."
          />
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button onClick={swap} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Swap texts
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Diff Result</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="bg-gray-50">
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Original</div>
                <div className="p-4 font-mono text-sm max-h-96 overflow-auto">
                  {diff.map((line, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        line.type === 'removed' ? 'bg-red-50 text-red-900' :
                        line.type === 'unchanged' ? 'text-gray-700' : 'opacity-30'
                      }`}
                    >
                      <span className="w-8 text-right pr-3 text-gray-400 select-none">{line.lineNumber}</span>
                      <span className="flex-1 whitespace-pre-wrap break-words">{line.content || ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50">
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</div>
                <div className="p-4 font-mono text-sm max-h-96 overflow-auto">
                  {diff.map((line, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        line.type === 'added' ? 'bg-green-50 text-green-900' :
                        line.type === 'unchanged' ? 'text-gray-700' : 'opacity-30'
                      }`}
                    >
                      <span className="w-8 text-right pr-3 text-gray-400 select-none">{line.lineNumber}</span>
                      <span className="flex-1 whitespace-pre-wrap break-words">{line.content || ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50">
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Unified Diff</div>
              <div className="p-4 font-mono text-sm max-h-96 overflow-auto">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      line.type === 'added' ? 'bg-green-50 text-green-900' :
                      line.type === 'removed' ? 'bg-red-50 text-red-900' :
                      'text-gray-700'
                    }`}
                  >
                    <span className="w-16 text-gray-400 select-none text-xs">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-words">{line.content || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
