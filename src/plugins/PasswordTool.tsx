import { useState, useEffect } from 'react'

type CharPool = 'letters' | 'numbers' | 'symbols' | 'all'

const CHAR_POOLS: Record<CharPool, { chars: string; label: string }> = {
  letters: { chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', label: 'Letters' },
  numbers: { chars: '0123456789', label: 'Numbers' },
  symbols: { chars: '!@#$%^&*()_+-=[]{}|;:,.<>?', label: 'Symbols' },
  all: { chars: '', label: 'All' },
}

export function PasswordTool() {
  const [length, setLength] = useState(16)
  const [pools, setPools] = useState<CharPool[]>(['letters', 'numbers', 'symbols'])
  const [password, setPassword] = useState('')
  const [excludeSimilar, setExcludeSimilar] = useState(true)

  useEffect(() => {
    let chars = ''
    if (pools.includes('letters')) chars += CHAR_POOLS.letters.chars
    if (pools.includes('numbers')) chars += CHAR_POOLS.numbers.chars
    if (pools.includes('symbols')) chars += CHAR_POOLS.symbols.chars
    if (pools.includes('all')) chars = CHAR_POOLS.letters.chars + CHAR_POOLS.numbers.chars + CHAR_POOLS.symbols.chars

    if (excludeSimilar) {
      chars = chars.replace(/[l1I0O]/g, '')
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
  }, [length, pools, excludeSimilar])

  const togglePool = (pool: CharPool) => {
    setPools(prev => prev.includes(pool) ? prev.filter(p => p !== pool) : [...prev, pool])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
  }

  const regenerate = () => {
    let chars = ''
    if (pools.includes('letters')) chars += CHAR_POOLS.letters.chars
    if (pools.includes('numbers')) chars += CHAR_POOLS.numbers.chars
    if (pools.includes('symbols')) chars += CHAR_POOLS.symbols.chars
    if (pools.includes('all')) chars = CHAR_POOLS.letters.chars + CHAR_POOLS.numbers.chars + CHAR_POOLS.symbols.chars
    if (excludeSimilar) chars = chars.replace(/[l1I0O]/g, '')
    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
  }

  const strength = password.length >= 20 ? 'Very Strong' : password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'
  const strengthColor = password.length >= 20 ? 'text-green-600' : password.length >= 12 ? 'text-green-600' : password.length >= 8 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Password Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate cryptographically secure passwords</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <code className="text-xl font-mono text-gray-900 tracking-wider break-all">{password}</code>
            <div className="flex gap-2 ml-4">
              <button
                onClick={regenerate}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Regenerate"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
          </div>
          <p className={`text-sm font-medium ${strengthColor}`}>Strength: {strength}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Length: {length}</label>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Character Sets</label>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(CHAR_POOLS) as CharPool[]).map((pool) => (
              <label key={pool} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pools.includes(pool)}
                  onChange={() => togglePool(pool)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">{CHAR_POOLS[pool].label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">Exclude similar characters (l, 1, I, 0, O)</span>
        </label>
      </div>
    </div>
  )
}
