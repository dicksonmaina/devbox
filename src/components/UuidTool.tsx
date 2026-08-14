import { useState, useEffect } from 'react'

export default function UuidTool() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)

  const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  useEffect(() => {
    setUuids(Array.from({ length: count }, generateUuid))
  }, [count])

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
  }

  const copyOne = (uuid: string) => {
    navigator.clipboard.writeText(uuid)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">UUID Generator</h2>
          <p className="text-sm text-gray-500 mt-1">Generate v4 UUIDs instantly</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {[1, 2, 3, 5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg group"
          >
            <code className="flex-1 font-mono text-sm text-gray-900">{uuid}</code>
            <button
              onClick={() => copyOne(uuid)}
              className="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-opacity"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      {uuids.length > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={copyAll}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Copy All
          </button>
        </div>
      )}
    </div>
  )
}
