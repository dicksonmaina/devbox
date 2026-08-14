import { useState } from 'react'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorTool() {
  const [hex, setHex] = useState('#3b82f6')
  const [format, setFormat] = useState<ColorFormat>('hex')
  const [error, setError] = useState('')

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleHexChange = (value: string) => {
    if (!value.startsWith('#')) value = '#' + value
    setHex(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setError('')
    } else if (value.length === 7) {
      setError('Invalid hex color')
    }
  }

  const presets = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#000000', '#ffffff']

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Color Converter</h2>
          <p className="text-sm text-gray-500 mt-1">Convert between HEX, RGB, and HSL color formats</p>
        </div>
        <div className="flex gap-2">
          {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                format === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-24 h-24 rounded-xl border border-gray-200 shadow-sm"
              style={{ backgroundColor: error ? '#ffffff' : hex }}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">HEX Color</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className={`w-full px-4 py-2 font-mono text-sm bg-gray-50 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${error ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="#3b82f6"
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((color) => (
              <button
                key={color}
                onClick={() => { setHex(color); setError('') }}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {rgb && (
            <>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">RGB</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm text-gray-900">
                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                  </code>
                  <button
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {hsl && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">HSL</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm text-gray-900">
                      hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                    </code>
                    <button
                      onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                      className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
