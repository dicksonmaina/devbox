#!/usr/bin/env node

/**
 * DevBox Auto-Discovery Engine
 * 
 * Discovers new tools to add by:
 * 1. Analyzing current tool gaps
 * 2. Checking trending dev tools online
 * 3. Scoring tools by SEO value, complexity, and user demand
 * 
 * Usage: node scripts/discover.cjs [--limit N]
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, 'scripts', 'knowledge')
const TOOLS_JSON = path.join(KNOWLEDGE_DIR, 'tools.json')

const TOOLS_CATALOG = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8')).tools

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'DevBox/1.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', () => resolve(''))
  })
}

async function discoverTrendingTools() {
  const trending = []
  
  try {
    const hnData = await fetchUrl('https://hnrss.org/show?points=100&count=20')
    const devToolMatches = hnData.match(/<title>([^<]*tool[^<]*)<\/title>/gi) || []
    trending.push(...devToolMatches.map(m => m.replace(/<[^>]+>/g, '')).slice(0, 5))
  } catch (e) {
    trending.push('JSON Formatter', 'Base64 Encoder', 'Regex Tester')
  }
  
  try {
    const redditData = await fetchUrl('https://www.reddit.com/r/webdev/.rss')
    const toolMentions = redditData.match(/<title>([^<]*tool[^<]*)<\/title>/gi) || []
    trending.push(...toolMentions.map(m => m.replace(/<[^>]+>/g, '')).slice(0, 5))
  } catch (e) {
    trending.push('UUID Generator', 'JWT Decoder', 'Timestamp Converter')
  }
  
  return trending
}

function analyzeCurrentTools() {
  const registryPath = path.join(PROJECT_ROOT, 'src', 'plugins', 'registry.ts')
  const registry = fs.readFileSync(registryPath, 'utf8')
  const matches = registry.match(/id: '([^']+)'/g) || []
  const currentTools = new Set(matches.map(m => m.replace(/id: '([^']+)'/, '$1')))
  
  const categories = new Set()
  registry.match(/category: '([^']+)'/g)?.forEach(m => {
    categories.add(m.replace(/category: '([^']+)'/, '$1'))
  })
  
  return {
    count: currentTools.size,
    ids: Array.from(currentTools),
    categories: Array.from(categories)
  }
}

function identifyGaps() {
  const current = analyzeCurrentTools()
  const gaps = []
  const seen = new Set()
  
  for (const tool of TOOLS_CATALOG) {
    if (!current.ids.includes(tool.id) && !seen.has(tool.id)) {
      seen.add(tool.id)
      gaps.push({
        ...tool,
        gapReason: 'not_implemented',
        estimatedEffort: tool.complexity === 'low' ? '1 hour' : tool.complexity === 'medium' ? '3 hours' : '1 day'
      })
    }
  }
  
  const categoryCount = {}
  for (const tool of TOOLS_CATALOG) {
    if (current.ids.includes(tool.id)) {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1
    }
  }
  
  const underrepresented = TOOLS_CATALOG.filter(t => {
    if (current.ids.includes(t.id) || seen.has(t.id)) return false
    const catCount = categoryCount[t.category] || 0
    return catCount < 2
  })
  
  for (const tool of underrepresented) {
    seen.add(tool.id)
    gaps.push({
      ...tool,
      gapReason: 'category_expansion',
      estimatedEffort: tool.complexity === 'low' ? '1 hour' : tool.complexity === 'medium' ? '3 hours' : '1 day'
    })
  }
  
  return gaps.sort((a, b) => b.priority - a.priority)
}

function scoreTools(tools, trending) {
  return tools.map(tool => {
    let score = tool.priority
    
    const trendingMatch = trending.some(t => 
      t.toLowerCase().includes(tool.name.toLowerCase()) ||
      t.toLowerCase().includes(tool.tags[0])
    )
    if (trendingMatch) score += 10
    
    if (tool.seoValue.length > 3) score += 5
    
    if (tool.complexity === 'low') score += 5
    
    if (tool.featured) score += 5
    
    const implementation = tool.implementation || {}
    if (implementation.libraries && implementation.libraries.length === 0) score += 3
    
    return { ...tool, score, trendingMatch }
  }).sort((a, b) => b.score - a.score)
}

async function runDiscovery() {
  console.log('=== DevBox Auto-Discovery ===\n')
  
  const trending = await discoverTrendingTools()
  console.log(`Trending topics found: ${trending.length}`)
  
  const current = analyzeCurrentTools()
  console.log(`Current tools: ${current.count}`)
  console.log(`Categories: ${current.categories.join(', ')}`)
  
  const gaps = identifyGaps()
  console.log(`Potential tools: ${gaps.length}`)
  
  const scored = scoreTools(gaps, trending)
  
  console.log('\n=== Top Recommendations ===\n')
  scored.slice(0, 5).forEach((tool, i) => {
    console.log(`${i + 1}. ${tool.name} (Score: ${tool.score})`)
    console.log(`   Category: ${tool.category}`)
    console.log(`   Complexity: ${tool.complexity}`)
    console.log(`   Gap: ${tool.gapReason}`)
    console.log(`   SEO: ${tool.seoValue.slice(0, 3).join(', ')}`)
    if (tool.trendingMatch) console.log(`   TRENDING MATCH`)
    console.log('')
  })
  
  const report = {
    timestamp: new Date().toISOString(),
    currentTools: current.count,
    trendingTopics: trending.length,
    recommendations: scored.slice(0, 10),
    nextTool: scored[0]
  }
  
  const reportsDir = path.join(PROJECT_ROOT, 'reports')
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
  fs.writeFileSync(path.join(reportsDir, 'discovery.json'), JSON.stringify(report, null, 2))
  
  console.log(`Report saved to reports/discovery.json`)
  return report
}

runDiscovery()
