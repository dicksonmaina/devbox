#!/usr/bin/env node

/**
 * DevBox Autonomous Pipeline
 * 
 * Full automation pipeline that:
 * 1. Discovers new tools
 * 2. Generates strategy
 * 3. Implements top-priority tools
 * 4. Runs tests
 * 5. Commits and deploys
 * 
 * Usage: node scripts/pipeline.cjs [--auto] [--limit N]
 *   --auto: Automatically implement top tools without prompting
 *   --limit N: Maximum number of tools to implement (default: 1)
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const autoMode = args.includes('--auto')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 1

function runCommand(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe', ...opts }).trim()
  } catch (e) {
    return null
  }
}

function runDiscovery() {
  console.log('\n[1/5] Discovering new tools...')
  return runCommand('node scripts/discover.cjs')
}

function runStrategy() {
  console.log('\n[2/5] Generating strategy...')
  return runCommand('node scripts/strategy.cjs')
}

function loadDiscoveryReport() {
  const reportPath = path.join(PROJECT_ROOT, 'reports', 'discovery.json')
  if (!fs.existsSync(reportPath)) return null
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'))
}

function loadStrategyReport() {
  const reportPath = path.join(PROJECT_ROOT, 'reports', 'strategy.json')
  if (!fs.existsSync(reportPath)) return null
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'))
}

function implementTools(tools) {
  console.log(`\n[3/5] Implementing ${tools.length} tool(s)...`)
  
  const results = []
  for (const tool of tools) {
    console.log(`\n  Implementing: ${tool.name}`)
    const output = runCommand(`node scripts/implement.cjs ${tool.id}`)
    if (output) {
      console.log(`  Output: ${output.split('\n')[0]}`)
      results.push({ tool, success: true })
    } else {
      console.log(`  Failed to implement ${tool.name}`)
      results.push({ tool, success: false })
    }
  }
  
  return results
}

function runBuild() {
  console.log('\n[4/5] Building project...')
  const result = runCommand('npm run build')
  if (result === null) {
    console.log('  Build FAILED')
    return false
  }
  console.log('  Build passed')
  return true
}

function commitAndDeploy(tools) {
  console.log('\n[5/5] Committing and deploying...')
  
  const toolNames = tools.map(t => t.name).join(', ')
  const commitMsg = `feat: auto-add ${toolNames} via autonomous pipeline`
  
  runCommand('git add .')
  const status = runCommand('git status --short')
  if (!status) {
    console.log('  No changes to commit')
    return false
  }
  
  runCommand(`git commit -m "${commitMsg}"`)
  runCommand('git push origin master')
  
  console.log('  Deployed to GitHub Pages')
  return true
}

function runPipeline() {
  console.log('=== DevBox Autonomous Pipeline ===\n')
  console.log(`Mode: ${autoMode ? 'AUTO' : 'MANUAL'}`)
  console.log(`Limit: ${limit} tool(s)\n`)
  
  const discovery = runDiscovery()
  const strategy = runStrategy()
  
  const discoveryReport = loadDiscoveryReport()
  const strategyReport = loadStrategyReport()
  
  if (!discoveryReport || !strategyReport) {
    console.log('Error: Could not load reports')
    process.exit(1)
  }
  
  const nextTools = strategyReport.gaps.slice(0, limit)
  
  if (nextTools.length === 0) {
    console.log('\nNo new tools to implement. Project is up to date!')
    return
  }
  
  console.log('\n=== Tools to Implement ===\n')
  nextTools.forEach((tool, i) => {
    console.log(`${i + 1}. ${tool.name} (${tool.id})`)
    console.log(`   ROI: ${tool.roi.toFixed(1)} | Complexity: ${tool.complexity}`)
    console.log(`   SEO: ${tool.seoValue.slice(0, 2).join(', ')}`)
  })
  
  if (!autoMode) {
    const readline = require('readline')
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    
    rl.question('\nProceed with implementation? (y/n): ', (answer) => {
      rl.close()
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Aborted.')
        process.exit(0)
      }
      
      runPipelineSteps(nextTools)
    })
  } else {
    runPipelineSteps(nextTools)
  }
}

function runPipelineSteps(nextTools) {
  const results = implementTools(nextTools)
  const successful = results.filter(r => r.success).map(r => r.tool)
  
  if (successful.length === 0) {
    console.log('\nNo tools were successfully implemented.')
    process.exit(1)
  }
  
  const buildPassed = runBuild()
  if (!buildPassed) {
    console.log('\nBuild failed. Fix errors before deploying.')
    process.exit(1)
  }
  
  commitAndDeploy(successful)
  
  console.log('\n=== Pipeline Complete ===\n')
  console.log(`Implemented: ${successful.length} tool(s)`)
  console.log(`Deployed: https://dicksonmaina.github.io/devbox/`)
  console.log(`\nNext run: node scripts/pipeline.cjs --auto --limit 1`)
}

runPipeline()
