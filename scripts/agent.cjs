#!/usr/bin/env node

/**
 * DevBox Agent Entry Point
 * 
 * Run this script to manage the DevBox project.
 * Any agent can use this to understand the project state and take action.
 * 
 * Usage:
 *   node scripts/agent.js status     - Show project status
 *   node scripts/agent.js analyze    - Run full analysis
 *   node scripts/agent.js build      - Build the project
 *   node scripts/agent.js deploy     - Deploy to GitHub Pages
 *   node scripts/agent.js improve    - Propose improvements
 *   node scripts/agent.js tool add <name> - Add a new tool template
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const COMMANDS = {
  status: () => {
    console.log('=== DevBox Status ===\n')
    
    const gitStatus = execSync('git status --short', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim()
    const lastCommit = execSync('git log -1 --oneline', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim()
    const branch = execSync('git branch --show-current', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim()
    
    console.log(`Branch: ${branch}`)
    console.log(`Last commit: ${lastCommit}`)
    console.log(`Changes: ${gitStatus ? gitStatus.split('\n').length : 0} files`)
    
    const registry = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts'), 'utf8')
    const toolCount = (registry.match(/id: '/g) || []).length
    console.log(`Tools registered: ${toolCount}`)
    
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'))
    console.log(`Version: ${pkg.version}`)
  },
  
  analyze: () => {
    execSync('node scripts/manage.js', { cwd: PROJECT_ROOT, stdio: 'inherit' })
  },
  
  build: () => {
    console.log('Building DevBox...')
    execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' })
    console.log('Build complete!')
  },
  
  deploy: () => {
    console.log('Deploying to GitHub Pages...')
    execSync('npm run deploy', { cwd: PROJECT_ROOT, stdio: 'inherit' })
    console.log('Deployment complete!')
  },
  
  improve: () => {
    console.log('=== Improvement Suggestions ===\n')
    
    const suggestions = []
    
    const registry = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts'), 'utf8')
    const toolCount = (registry.match(/id: '/g) || []).length
    
    if (toolCount < 15) {
      suggestions.push({
        priority: 'high',
        action: 'Add more tools',
        reason: `${toolCount} tools registered. Target: 15+ for better SEO.`,
        examples: ['YAML ↔ JSON converter', 'CSV ↔ JSON converter', 'Cron expression generator', 'HTML entity encoder', 'Lorem ipsum generator']
      })
    }
    
    const indexPath = path.join(PROJECT_ROOT, 'index.html')
    const indexContent = fs.readFileSync(indexPath, 'utf8')
    
    if (!indexContent.includes('manifest')) {
      suggestions.push({
        priority: 'medium',
        action: 'Add PWA manifest link',
        reason: 'Improve mobile installability'
      })
    }
    
    const readme = fs.readFileSync(path.join(PROJECT_ROOT, 'README.md'), 'utf8')
    if (!readme.includes('## Contributing')) {
      suggestions.push({
        priority: 'low',
        action: 'Add contributing guidelines',
        reason: 'Make it easier for others to contribute'
      })
    }
    
    suggestions.forEach((s, i) => {
      console.log(`${i + 1}. [${s.priority.toUpperCase()}] ${s.action}`)
      console.log(`   Reason: ${s.reason}`)
      if (s.examples) {
        console.log('   Examples:')
        s.examples.forEach(ex => console.log(`   - ${ex}`))
      }
      console.log('')
    })
    
    console.log('Total suggestions:', suggestions.length)
  },
  
  tool: (args) => {
    const toolName = args[0]
    if (!toolName) {
      console.log('Usage: node scripts/agent.js tool add <ToolName>')
      return
    }
    
    const componentName = `${toolName}Tool`
    const componentPath = path.join(PROJECT_ROOT, 'src', 'plugins', `${componentName}.tsx`)
    
    if (fs.existsSync(componentPath)) {
      console.log(`Tool ${componentName} already exists!`)
      return
    }
    
    const template = `import { useState, useEffect } from 'react'

export function ${componentName}() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    // TODO: Implement tool logic here
    setOutput(input.toUpperCase())
  }, [input])

  const copy = () => { if (output) navigator.clipboard.writeText(output) }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">${toolName}</h2>
        <p className="text-sm text-gray-500 mt-1">TODO: Add description</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Enter input..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <div className="relative">
            <pre className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {output || <span className="text-gray-400">Output will appear here...</span>}
            </pre>
            {output && <button onClick={copy} className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">Copy</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
`
    
    fs.writeFileSync(componentPath, template)
    console.log(`Created tool template: ${componentPath}`)
    console.log('\nNext steps:')
    console.log('1. Implement the tool logic in the useEffect hook')
    console.log('2. Add the tool to src/plugins/registry.ts')
    console.log('3. Run npm run build to verify')
    
    const registryPath = path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts')
    let registry = fs.readFileSync(registryPath, 'utf8')
    
    const importMatch = registry.match(/const \w+Tool = lazy\(\(\) => import\('\.\/(\w+)'\)/)
    const lastImport = registry.lastIndexOf('const ')
    const insertPoint = registry.indexOf('\n\nimport { registerTool', lastImport)
    
    const newImport = `const ${componentName} = lazy(() => import('./${componentName}').then(m => ({ default: m.${componentName} })))\n`
    registry = registry.slice(0, insertPoint) + newImport + registry.slice(insertPoint)
    
    const toolsArrayMatch = registry.match(/const tools: Omit<ToolPlugin, 'component'>\[\] = \[([\s\S]*?)\]\n/)
    if (toolsArrayMatch) {
      const newToolEntry = `    { id: '${toolName.toLowerCase()}', name: '${toolName}', description: 'TODO: Add description', icon: 'braces', category: 'tools', tags: ['${toolName.toLowerCase()}'] },\n`
      const insertIdx = registry.indexOf(toolsArrayMatch[0]) + toolsArrayMatch[0].indexOf(']')
      registry = registry.slice(0, insertIdx) + newToolEntry + registry.slice(insertIdx)
    }
    
    const componentsMatch = registry.match(/const components: Record<string, React\.LazyExoticComponent<React\.ComponentType<unknown>>> = \{([\s\S]*?)\}\n/)
    if (componentsMatch) {
      const newComponentEntry = `    ${toolName.toLowerCase()}: ${componentName},\n`
      const insertIdx = registry.indexOf(componentsMatch[0]) + componentsMatch[0].indexOf('}')
      registry = registry.slice(0, insertIdx) + newComponentEntry + registry.slice(insertIdx)
    }
    
    fs.writeFileSync(registryPath, registry)
    console.log(`\nRegistered ${toolName} in registry.ts`)
    console.log('\nTODO: Manually add icon and update registry entries with correct metadata')
  }
}

const command = process.argv[2]
const args = process.argv.slice(3)

if (COMMANDS[command]) {
  if (command === 'tool') {
    COMMANDS.tool(args)
  } else {
    COMMANDS[command]()
  }
} else {
  console.log(`
DevBox Agent
============

Usage: node scripts/agent.js <command> [args]

Commands:
  status     - Show project status
  analyze    - Run full analysis
  build      - Build the project
  deploy     - Deploy to GitHub Pages
  improve    - Show improvement suggestions
  tool add <name> - Create a new tool template

Examples:
  node scripts/agent.js status
  node scripts/agent.js tool add CsvConverter
  node scripts/agent.js improve
  `)
  process.exit(1)
}
