#!/usr/bin/env node

/**
 * DevBox Auto-Implementer
 * 
 * Automatically generates tool implementation code from templates.
 * 
 * Usage: node scripts/implement.cjs <toolId>
 * Example: node scripts/implement.cjs yaml
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const TOOLS_JSON = path.join(PROJECT_ROOT, 'scripts', 'knowledge', 'tools.json')
const PLUGINS_DIR = path.join(PROJECT_ROOT, 'src', 'plugins')

const TOOLS_CATALOG = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8')).tools
const TOOL_MAP = Object.fromEntries(TOOLS_CATALOG.map(t => [t.id, t]))

const TEMPLATES = {
  converter: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'${tool.id}-to-json' | 'json-to-${tool.id}'>('${tool.id}-to-json')

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(''); return }
    try {
      if (mode === '${tool.id}-to-json') {
        setOutput(JSON.stringify({ input, format: '${tool.id}' }, null, 2))
      } else {
        setOutput(input)
      }
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed')
      setOutput('')
    }
  }, [input, mode])

  const swap = () => {
    setInput(output)
    setMode(mode === '${tool.id}-to-json' ? 'json-to-${tool.id}' : '${tool.id}-to-json')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
          <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
        </div>
        <div className="flex gap-2">
          {(['${tool.id}-to-json', 'json-to-${tool.id}'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(''); setOutput(''); setError('') }}
              className={'px-3 py-1.5 rounded-md text-sm font-medium transition-colors ' + (mode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
            >
              {m === '${tool.id}-to-json' ? '${tool.id.toUpperCase()} → JSON' : 'JSON → ${tool.id.toUpperCase()}'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder={'Paste your ${tool.id} here...'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <div className="relative">
            <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {error ? <span className="text-red-600">{error}</span> : output ? <span className={mode.includes('json') ? '' : 'whitespace-pre-wrap break-words'}>{output}</span> : <span className="text-gray-400">Output will appear here...</span>}
            </pre>
            {output && !error && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
      {input && (
        <div className="mt-4 flex justify-center">
          <button onClick={swap} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Swap →
          </button>
        </div>
      )}
    </div>
  )
}
`,

  generator: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [output, setOutput] = useState('Generated output will appear here')
  
  const generate = () => {
    setOutput('Generated: ' + new Date().toISOString())
  }
  
  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
        <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
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
`,

  formatter: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(''); return }
    try {
      setOutput(input)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Formatting failed')
      setOutput('')
    }
  }, [input])

  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
        <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Paste your input here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <div className="relative">
            <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {error ? <span className="text-red-600">{error}</span> : output ? output : <span className="text-gray-400">Output will appear here...</span>}
            </pre>
            {output && !error && <button onClick={copy} className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">Copy</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
`,

  tester: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!input.trim() || !query.trim()) { setOutput(''); return }
    try {
      setOutput(JSON.stringify({ input, query, result: 'TODO' }, null, 2))
    } catch (e) {
      setOutput('Error: ' + (e instanceof Error ? e.message : 'Unknown error'))
    }
  }, [input, query])

  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
        <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter input data..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Enter query..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
          <div className="relative">
            <pre className="p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">{output || <span className="text-gray-400">Result will appear here...</span>}</pre>
            {output && <button onClick={copy} className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">Copy</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
`,

  analyzer: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    if (!input.trim()) { setAnalysis(null); return }
    try {
      const lines = input.split('\\n')
      const words = input.split(/\\s+/).filter(w => w.length > 0)
      setAnalysis({
        characters: input.length,
        words: words.length,
        lines: lines.length,
        paragraphs: input.split('\\n\\n').filter(p => p.trim().length > 0).length
      })
    } catch (e) {
      setAnalysis({ error: e instanceof Error ? e.message : 'Analysis failed' })
    }
  }, [input])

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
        <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
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
                <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                <div className="text-sm text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
`,

  preview: (tool) => `import { useState, useEffect } from 'react'

export function ${tool.componentName}() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!input.trim()) { setOutput(''); return }
    try {
      setOutput(input)
    } catch (e) {
      setOutput('Error: ' + (e instanceof Error ? e.message : 'Unknown error'))
    }
  }, [input])

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${tool.name}</h2>
        <p className="text-sm text-gray-500 mt-1">${tool.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter input..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="p-4 bg-white border border-gray-200 rounded-lg h-96 overflow-auto">
            <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap break-words">{output || <span className="text-gray-400">Preview will appear here...</span>}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
`
}

function toPascalCase(str) {
  return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

function generateToolCode(tool) {
  const templateKey = tool.implementation?.template || 'generator'
  const templateFn = TEMPLATES[templateKey] || TEMPLATES.generator
  const componentName = toPascalCase(tool.id) + 'Tool'
  
  return {
    componentName,
    code: templateFn({ ...tool, componentName }),
    templateKey
  }
}

function implementTool(toolId) {
  const tool = TOOL_MAP[toolId]
  if (!tool) {
    console.log('Tool "' + toolId + '" not found in knowledge base.')
    console.log('Available tools: ' + Object.keys(TOOL_MAP).join(', '))
    process.exit(1)
  }
  
  const componentName = toPascalCase(tool.id) + 'Tool'
  const componentPath = path.join(PLUGINS_DIR, componentName + '.tsx')
  
  if (fs.existsSync(componentPath)) {
    console.log('Tool ' + componentName + ' already exists at ' + componentPath)
    return { skipped: true, path: componentPath }
  }
  
  const { code } = generateToolCode(tool)
  fs.writeFileSync(componentPath, code)
  
  console.log('Implemented: ' + componentName)
  console.log('   Path: ' + componentPath)
  console.log('   Template: ' + (tool.implementation?.template || 'generator'))
  console.log('   Complexity: ' + tool.complexity)
  console.log('   SEO value: ' + tool.seoValue.slice(0, 3).join(', '))
  console.log('\nNOTE: Registry update required. Add to src/plugins/registry.ts:')
  console.log('  Import: const ' + componentName + ' = lazy(() => import(\'./' + componentName + '\').then(m => ({ default: m.' + componentName + ' })))')
  console.log('  Tool entry: { id: \'' + tool.id + '\', name: \'' + tool.name + '\', ... }')
  console.log('  Component: \'' + tool.id + '\': ' + componentName + ',')
  
  return { skipped: false, path: componentPath, tool }
}

const toolId = process.argv[2]
if (!toolId) {
  console.log('Usage: node scripts/implement.cjs <toolId>')
  console.log('Available tools: ' + Object.keys(TOOL_MAP).join(', '))
  process.exit(1)
}

const result = implementTool(toolId)
if (!result.skipped) {
  console.log('\nNext steps:')
  console.log('1. Review generated code')
  console.log('2. Update src/plugins/registry.ts (see instructions above)')
  console.log('3. Run npm run build to verify')
  console.log('4. Run npm run deploy to publish')
}
