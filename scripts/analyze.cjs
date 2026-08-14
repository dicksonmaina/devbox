#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')

const checks = {
  dependencies: () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    const outdated = []
    for (const [name, current] of Object.entries(deps)) {
      const semver = current.replace(/^[\^~]/, '')
      outdated.push({ name, current, semver })
    }
    return { type: 'dependencies', data: outdated, priority: 'medium' }
  },

  tools: () => {
    const registry = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts'), 'utf8')
    const matches = registry.match(/id: '([^']+)'/g) || []
    const tools = matches.map(m => m.replace(/id: '([^']+)'/, '$1'))
    return { type: 'tools', data: { count: tools.length, tools }, priority: 'low' }
  },

  security: () => {
    const viteConfig = fs.readFileSync(path.join(PROJECT_ROOT, 'vite.config.ts'), 'utf8')
    const hasPWA = viteConfig.includes('VitePWA')
    const hasCSP = viteConfig.includes('Content-Security-Policy')
    const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8')
    const hasMeta = indexHtml.includes('meta name="description"')
    const hasCanonical = indexHtml.includes('rel="canonical"')
    
    return {
      type: 'security',
      data: { pwa: hasPWA, csp: hasCSP, meta: hasMeta, canonical: hasCanonical },
      priority: 'high'
    }
  },

  performance: () => {
    const distExists = fs.existsSync(path.join(PROJECT_ROOT, 'dist'))
    return {
      type: 'performance',
      data: { built: distExists },
      priority: 'medium'
    }
  }
}

function runAnalysis() {
  const results = Object.values(checks).map(fn => fn())
  const issues = results.filter(r => {
    if (r.type === 'security') {
      return !r.data.pwa || !r.data.csp || !r.data.meta || !r.data.canonical
    }
    return false
  })

  const report = {
    timestamp: new Date().toISOString(),
    totalChecks: results.length,
    issues: issues.length,
    details: results
  }

  const reportPath = path.join(PROJECT_ROOT, 'reports', 'analysis.json')
  if (!fs.existsSync(path.join(PROJECT_ROOT, 'reports'))) {
    fs.mkdirSync(path.join(PROJECT_ROOT, 'reports'), { recursive: true })
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  console.log('Analysis complete:', JSON.stringify(report, null, 2))
  return report
}

runAnalysis()
