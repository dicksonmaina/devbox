#!/usr/bin/env node

/**
 * DevBox Strategy Engine
 * 
 * Determines the optimal next steps for the project based on:
 * - Current tool coverage
 * - Trending topics
 * - SEO gaps
 * - User demand signals
 * - Complexity/effort analysis
 * 
 * Usage: node scripts/strategy.cjs
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const TOOLS_JSON = path.join(PROJECT_ROOT, 'scripts', 'knowledge', 'tools.json')
const REGISTRY_PATH = path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts')

const TOOLS_CATALOG = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8')).tools
const TOOL_MAP = Object.fromEntries(TOOLS_CATALOG.map(t => [t.id, t]))

function analyzeCurrentState() {
  const registry = fs.readFileSync(REGISTRY_PATH, 'utf8')
  const currentTools = new Set((registry.match(/id: '([^']+)'/g) || []).map(m => m.replace(/id: '([^']+)'/, '$1')))
  const categories = new Set((registry.match(/category: '([^']+)'/g) || []).map(m => m.replace(/category: '([^']+)'/, '$1')))
  
  return {
    toolCount: currentTools.size,
    toolIds: Array.from(currentTools),
    categories: Array.from(categories),
    hasSearch: registry.includes('searchQuery'),
    hasCategories: registry.includes('selectedCategory'),
    hasPWA: fs.existsSync(path.join(PROJECT_ROOT, 'public', 'manifest.webmanifest')) || fs.readFileSync(path.join(PROJECT_ROOT, 'vite.config.ts'), 'utf8').includes('VitePWA')
  }
}

function analyzeGaps(state) {
  const gaps = []
  
  for (const tool of TOOLS_CATALOG) {
    if (!state.toolIds.includes(tool.id)) {
      const effort = tool.complexity === 'low' ? 1 : tool.complexity === 'medium' ? 3 : 8
      const value = tool.priority + (tool.featured ? 10 : 0) + (tool.seoValue.length * 2)
      const roi = value / effort
      
      gaps.push({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        complexity: tool.complexity,
        effort,
        value,
        roi,
        priority: tool.priority,
        featured: tool.featured,
        seoValue: tool.seoValue,
        implementation: tool.implementation
      })
    }
  }
  
  return gaps.sort((a, b) => b.roi - a.roi)
}

function analyzeCategoryCoverage(state) {
  const categoryCount = {}
  for (const tool of TOOLS_CATALOG) {
    if (state.toolIds.includes(tool.id)) {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1
    }
  }
  
  const allCategories = [...new Set(TOOLS_CATALOG.map(t => t.category))]
  const weakCategories = allCategories.filter(cat => (categoryCount[cat] || 0) < 2)
  
  return {
    coverage: categoryCount,
    weakCategories,
    allCategories
  }
}

function generateStrategy() {
  const state = analyzeCurrentState()
  const gaps = analyzeGaps(state)
  const categoryAnalysis = analyzeCategoryCoverage(state)
  
  const strategy = {
    timestamp: new Date().toISOString(),
    currentState: state,
    gaps: gaps.slice(0, 10),
    categoryAnalysis,
    recommendations: []
  }
  
  if (state.toolCount < 10) {
    strategy.recommendations.push({
      phase: 'immediate',
      priority: 'critical',
      action: 'Reach 10 tools minimum',
      reason: 'Below threshold for SEO impact',
      tools: gaps.filter(g => g.complexity === 'low' || g.complexity === 'medium').slice(0, 3).map(g => g.id)
    })
  }
  
  const highRoi = gaps.filter(g => g.roi > 20)
  if (highRoi.length > 0) {
    strategy.recommendations.push({
      phase: 'immediate',
      priority: 'high',
      action: 'Implement high-ROI tools',
      reason: `${highRoi.length} tools with ROI > 20`,
      tools: highRoi.slice(0, 3).map(g => g.id)
    })
  }
  
  const featuredMissing = gaps.filter(g => g.featured)
  if (featuredMissing.length > 0) {
    strategy.recommendations.push({
      phase: 'short-term',
      priority: 'high',
      action: 'Add featured tools',
      reason: `${featuredMissing.length} featured tools not yet implemented`,
      tools: featuredMissing.slice(0, 3).map(g => g.id)
    })
  }
  
  if (categoryAnalysis.weakCategories.length > 0) {
    strategy.recommendations.push({
      phase: 'medium-term',
      priority: 'medium',
      action: 'Expand weak categories',
      reason: `Categories with < 2 tools: ${categoryAnalysis.weakCategories.join(', ')}`,
      tools: categoryAnalysis.weakCategories.flatMap(cat => 
        gaps.filter(g => g.category === cat).slice(0, 2).map(g => g.id)
      )
    })
  }
  
  const lowComplexity = gaps.filter(g => g.complexity === 'low')
  if (lowComplexity.length > 0) {
    strategy.recommendations.push({
      phase: 'quick-wins',
      priority: 'medium',
      action: 'Quick win tools',
      reason: `${lowComplexity.length} low-complexity tools available`,
      tools: lowComplexity.slice(0, 5).map(g => g.id)
    })
  }
  
  strategy.recommendations.push({
    phase: 'ongoing',
    priority: 'low',
    action: 'SEO optimization',
    reason: 'Submit to directories and optimize meta tags',
    tools: []
  })
  
  strategy.recommendations.push({
    phase: 'ongoing',
    priority: 'low',
    action: 'User feedback integration',
    reason: 'Monitor GitHub issues for feature requests',
    tools: []
  })
  
  const reportsDir = path.join(PROJECT_ROOT, 'reports')
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
  fs.writeFileSync(path.join(reportsDir, 'strategy.json'), JSON.stringify(strategy, null, 2))
  
  return strategy
}

function printStrategy(strategy) {
  console.log('=== DevBox Strategy Engine ===\n')
  console.log(`Current tools: ${strategy.currentState.toolCount}`)
  console.log(`Categories: ${strategy.currentState.categories.length}`)
  console.log(`Potential tools: ${strategy.gaps.length}`)
  console.log(`Weak categories: ${strategy.categoryAnalysis.weakCategories.length}\n`)
  
  console.log('=== Recommendations ===\n')
  
  strategy.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`)
    console.log(`   Phase: ${rec.phase}`)
    console.log(`   Reason: ${rec.reason}`)
    if (rec.tools.length > 0) {
      console.log(`   Tools: ${rec.tools.join(', ')}`)
    }
    console.log('')
  })
  
  console.log('\n=== Next 3 Tools to Build ===\n')
  strategy.gaps.slice(0, 3).forEach((tool, i) => {
    console.log(`${i + 1}. ${tool.name}`)
    console.log(`   ROI: ${tool.roi.toFixed(1)} | Complexity: ${tool.complexity} | Priority: ${tool.priority}`)
    console.log(`   SEO: ${tool.seoValue.slice(0, 2).join(', ')}`)
    console.log('')
  })
  
  console.log(`Strategy saved to reports/strategy.json`)
}

const strategy = generateStrategy()
printStrategy(strategy)
