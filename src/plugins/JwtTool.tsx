import { useState } from 'react'

export function JwtTool() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<{ header: Record<string, unknown>; payload: Record<string, unknown> } | null>(null)
  const [error, setError] = useState('')

  const decodeToken = (t: string) => {
    try {
      const parts = t.split('.')
      if (parts.length !== 3) throw new Error('Invalid JWT format: expected 3 parts')
      const decodePart = (part: string) => JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
      setDecoded({ header: decodePart(parts[0]), payload: decodePart(parts[1]) })
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JWT token')
      setDecoded(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">JWT Decoder</h2>
        <p className="text-sm text-gray-500 mt-1">Decode and inspect JSON Web Tokens</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JWT Token</label>
          <textarea value={token} onChange={(e) => { setToken(e.target.value); if (e.target.value.trim()) decodeToken(e.target.value); else { setDecoded(null); setError('') } }} className="w-full h-24 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none" placeholder="Paste your JWT token here..." />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
        {decoded && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
              <pre className="p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payload</label>
              <pre className="p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
