import { useState, useEffect } from 'react'

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

async function hashText(text: string, algorithm: Algorithm): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function HashTool() {
  const [input, setInput] = useState('DevBox')
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({} as Record<Algorithm, string>)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!input) {
      setHashes({} as Record<Algorithm, string>)
      return
    }
    setLoading(true)
    const algorithms: Algorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
    Promise.all(algorithms.map(async (algo) => ({ algo, hash: await hashText(input, algo) })))
      .then(results => {
        const map = {} as Record<Algorithm, string>
        results.forEach(({ algo, hash }) => { map[algo] = hash })
        setHashes(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [input])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Hash Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate cryptographic hashes with Web Crypto API</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-24 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter text to hash..."
          />
        </div>

        <div className="space-y-2">
          {(Object.keys(hashes) as Algorithm[]).map((algo) => (
            <div key={algo} className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-600 w-20 shrink-0">{algo}</span>
              <code className="flex-1 font-mono text-sm text-gray-900 break-all">
                {loading ? 'Computing...' : (hashes[algo] || '—')}
              </code>
              {hashes[algo] && !loading && (
                <button
                  onClick={() => copyToClipboard(hashes[algo])}
                  className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 shrink-0"
                >
                  Copy
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
