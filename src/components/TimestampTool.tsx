import { useState, useEffect } from 'react'

export default function TimestampTool() {
  const [unix, setUnix] = useState<string>(Math.floor(Date.now() / 1000).toString())
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [mode, setMode] = useState<'unix-to-date' | 'date-to-unix'>('unix-to-date')

  useEffect(() => {
    if (mode === 'unix-to-date') {
      const ts = parseInt(unix)
      if (!isNaN(ts)) {
        setDate(new Date(ts * 1000).toISOString())
      }
    }
  }, [unix, mode])

  const handleDateChange = (value: string) => {
    setDate(value)
    const d = new Date(value)
    if (!isNaN(d.getTime())) {
      setUnix(Math.floor(d.getTime() / 1000).toString())
    }
  }

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000)
    setUnix(now.toString())
    setDate(new Date().toISOString())
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Timestamp Converter</h2>
          <p className="text-sm text-gray-500 mt-1">Convert Unix timestamps to dates and vice versa</p>
        </div>
        <div className="flex gap-2">
          {(['unix-to-date', 'date-to-unix'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'unix-to-date' ? 'Unix → Date' : 'Date → Unix'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'unix-to-date' ? 'Unix Timestamp (seconds)' : 'Date & Time'}
          </label>
          {mode === 'unix-to-date' ? (
            <div className="space-y-3">
              <input
                type="text"
                value={unix}
                onChange={(e) => setUnix(e.target.value)}
                className="w-full px-4 py-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter Unix timestamp..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setUnix((Math.floor(Date.now() / 1000) - 3600).toString())}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                >
                  -1h
                </button>
                <button
                  onClick={() => setUnix((Math.floor(Date.now() / 1000) - 86400).toString())}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                >
                  -1d
                </button>
                <button
                  onClick={setNow}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded hover:bg-gray-800"
                >
                  Now
                </button>
              </div>
            </div>
          ) : (
            <input
              type="datetime-local"
              value={date.slice(0, 16)}
              onChange={(e) => handleDateChange(new Date(e.target.value).toISOString())}
              className="w-full px-4 py-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'unix-to-date' ? 'ISO 8601 Date' : 'Unix Timestamp (seconds)'}
          </label>
          {mode === 'unix-to-date' ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-mono text-sm text-gray-900 break-all">{date}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(date).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-mono text-sm text-gray-900">{unix}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(parseInt(unix) * 1000).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
