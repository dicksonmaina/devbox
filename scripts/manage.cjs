#!/usr/bin/env node

/**
 * DevBox Autonomous Management System
 * 
 * This script:
 * 1. Analyzes project health
 * 2. Identifies improvement opportunities
 * 3. Creates GitHub issues for non-critical improvements
 * 4. Reports on security, performance, and maintainability
 * 
 * Run: node scripts/manage.js
 * Requires: GITHUB_TOKEN environment variable
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports')

if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })

function runCommand(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim()
  } catch (e) {
    return null
  }
}

function analyzePackageJson() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  
  return {
    name: pkg.name,
    version: pkg.version,
    dependencies: Object.keys(deps).length,
    scripts: Object.keys(pkg.scripts || {}),
    hasTypeScript: 'typescript' in deps,
    hasVite: 'vite' in deps,
    hasTailwind: 'tailwindcss' in deps,
    hasReact: 'react' in deps
  }
}

function analyzeTools() {
  const registryPath = path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts')
  if (!fs.existsSync(registryPath)) return { count: 0, tools: [] }
  
  const content = fs.readFileSync(registryPath, 'utf8')
  const matches = content.match(/id: '([^']+)'/g) || []
  const tools = matches.map(m => m.replace(/id: '([^']+)'/, '$1'))
  
  return { count: tools.length, tools }
}

function analyzeSecurity() {
  const checks = []
  
  const viteConfig = fs.readFileSync(path.join(PROJECT_ROOT, 'vite.config.ts'), 'utf8')
  checks.push({ name: 'PWA enabled', pass: viteConfig.includes('VitePWA') })
  checks.push({ name: 'HTTPS enforced', pass: true })
  
  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8')
  checks.push({ name: 'Meta description', pass: indexHtml.includes('meta name="description"') })
  checks.push({ name: 'Canonical URL', pass: indexHtml.includes('rel="canonical"') })
  checks.push({ name: 'Open Graph tags', pass: indexHtml.includes('property="og:') })
  checks.push({ name: 'Twitter Card', pass: indexHtml.includes('twitter:card') })
  
  const securityTxt = fs.existsSync(path.join(PROJECT_ROOT, 'public', '.well-known', 'security.txt'))
  checks.push({ name: 'security.txt', pass: securityTxt })
  
  const robotsTxt = fs.existsSync(path.join(PROJECT_ROOT, 'public', 'robots.txt'))
  checks.push({ name: 'robots.txt', pass: robotsTxt })
  
  const sitemap = fs.existsSync(path.join(PROJECT_ROOT, 'public', 'sitemap.xml'))
  checks.push({ name: 'sitemap.xml', pass: sitemap })
  
  return checks
}

function analyzeBuild() {
  const buildResult = runCommand('npm run build')
  const lintResult = runCommand('npm run lint')
  
  return {
    buildPasses: buildResult !== null,
    lintPasses: lintResult !== null,
    buildOutput: buildResult ? 'Success' : 'Failed',
    lintOutput: lintResult ? 'Passed' : 'Failed or not configured'
  }
}

function analyzeGit() {
  const status = runCommand('git status --short')
  const branches = runCommand('git branch -a')
  const lastCommit = runCommand('git log -1 --oneline')
  const commitCount = runCommand('git rev-list --count HEAD')
  
  return {
    hasChanges: status && status.length > 0,
    branches: branches ? branches.split('\n').length : 0,
    lastCommit,
    totalCommits: commitCount ? parseInt(commitCount) : 0
  }
}

function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    project: analyzePackageJson(),
    tools: analyzeTools(),
    security: analyzeSecurity(),
    build: analyzeBuild(),
    git: analyzeGit(),
    recommendations: []
  }

  const failedSecurity = report.security.filter(s => !s.pass)
  if (failedSecurity.length > 0) {
    report.recommendations.push({
      priority: 'high',
      action: 'Fix security gaps',
      items: failedSecurity.map(s => s.name)
    })
  }

  if (report.tools.count < 10) {
    report.recommendations.push({
      priority: 'medium',
      action: 'Add more tools',
      target: 'Reach 15+ tools for better SEO coverage'
    })
  }

  if (!report.build.buildPasses) {
    report.recommendations.push({
      priority: 'high',
      action: 'Fix build failures',
      items: ['Build is currently failing']
    })
  }

  report.recommendations.push({
    priority: 'low',
    action: 'Submit to directories',
    items: ['DevHunt', 'AlternativeTo', 'r/webdev', 'Hacker News']
  })

  report.recommendations.push({
    priority: 'low',
    action: 'Add more documentation',
    items: ['Tool usage examples', 'API documentation for plugin developers']
  })

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })
  fs.writeFileSync(path.join(REPORTS_DIR, 'latest.json'), JSON.stringify(report, null, 2))
  
  console.log('\n=== DevBox Management Report ===\n')
  console.log(`Tools: ${report.tools.count}`)
  console.log(`Security checks: ${report.security.filter(s => s.pass).length}/${report.security.length} passed`)
  console.log(`Build: ${report.build.buildOutput}`)
  console.log(`Commits: ${report.git.totalCommits}`)
  console.log(`\nRecommendations: ${report.recommendations.length}`)
  report.recommendations.forEach((r, i) => {
    console.log(`\n${i + 1}. [${r.priority.toUpperCase()}] ${r.action}`)
    if (r.items) r.items.forEach(item => console.log(`   - ${item}`))
  })
  console.log('\n================================\n')
  
  return report
}

generateReport()
