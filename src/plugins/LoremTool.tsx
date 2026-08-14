import { useState } from 'react'

export function LoremTool() {
  const [output, setOutput] = useState('Generated output will appear here')
  
  const generate = () => {
    setOutput('Generated: ' + new Date().toISOString())
  }
  
  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Lorem Ipsum Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate placeholder text for designs</p>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={generate}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Generate
          </button>
          <button
            onClick={copy}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Copy
          </button>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap break-words">{output}</pre>
        </div>
      </div>
    </div>
  )
}
