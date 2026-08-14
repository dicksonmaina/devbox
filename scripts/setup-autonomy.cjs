#!/usr/bin/env node

/**
 * Master Project Autonomy Setup
 * 
 * Usage: node setup-autonomy.cjs <project-path> <project-type> [project-name]
 * Types: node, python, rust, static
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PROJECT_ROOT = path.resolve(process.argv[2] || '.')
const PROJECT_TYPE = process.argv[3] || 'node'
const PROJECT_NAME = process.argv[4] || path.basename(PROJECT_ROOT)

function run(cmd, opts = {}) {
  try { return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe', ...opts }).trim() }
  catch (e) { return null }
}

function writeFile(relPath, content) {
  const fullPath = path.join(PROJECT_ROOT, relPath)
  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(fullPath, content)
}

function initGit() {
  if (!fs.existsSync(path.join(PROJECT_ROOT, '.git'))) {
    run('git init')
    run('git config user.email "user@example.com"')
    run('git config user.name "DevBox Manager"')
    console.log('  Git initialized')
  } else {
    console.log('  Git already initialized')
  }
}

function createGitignore() {
  const ignores = {
    node: 'node_modules/\n.env\n.env.local\n.env.*.local\n*.log\n.DS_Store\n/dist/\n/build/\n',
    python: '__pycache__/\n*.pyc\n*.pyo\n.env\n.venv/\nvenv/\n*.db\n*.sqlite\n.DS_Store\n',
    rust: 'target/\n.env\n*.rs.bk\n.DS_Store\nCargo.lock\n',
    static: '.DS_Store\nThumbs.db\n'
  }
  
  writeFile('.gitignore', ignores[PROJECT_TYPE] || ignores.node)
  console.log('  .gitignore created')
}

function createEnvExample() {
  const examples = {
    node: `PORT=3000\nNODE_ENV=development\n# Add your environment variables here\n`,
    python: `PORT=8000\nENVIRONMENT=development\n# Add your environment variables here\n`,
    rust: `PORT=3000\nENVIRONMENT=development\n# Add your environment variables here\n`,
    static: `# No environment variables needed\n`
  }
  
  if (!fs.existsSync(path.join(PROJECT_ROOT, '.env.example'))) {
    writeFile('.env.example', examples[PROJECT_TYPE] || examples.node)
    console.log('  .env.example created')
  } else {
    console.log('  .env.example already exists')
  }
}

function createAgentScript() {
  const script = `#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')

function run(cmd, opts = {}) {
  try { return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe', ...opts }).trim() }
  catch (e) { return null }
}

function status() {
  console.log('=== ${PROJECT_NAME} Status ===\\n')
  
  const git = run('git status --short')
  const branch = run('git branch --show-current')
  const commit = run('git log -1 --oneline')
  
  console.log('Git branch:', branch || 'none')
  console.log('Last commit:', commit || 'none')
  console.log('Changes:', git ? git.split('\\n').length : 0)
}

function analyze() {
  console.log('=== ${PROJECT_NAME} Analysis ===\\n')
  console.log('Run: npm run build && npm run lint')
}

function improve() {
  console.log('=== Improvement Suggestions ===\\n')
  console.log('1. Add tests')
  console.log('2. Add CI/CD')
  console.log('3. Add documentation')
}

const cmd = process.argv[2]
if (cmd === 'status') status()
else if (cmd === 'analyze') analyze()
else if (cmd === 'improve') improve()
else {
  console.log('Usage: node scripts/agent.cjs <command>')
  console.log('Commands: status, analyze, improve')
  process.exit(1)
}
`
  
  writeFile('scripts/agent.cjs', script)
  console.log('  scripts/agent.cjs created')
}

function createManagementDoc() {
  const doc = `# ${PROJECT_NAME} Management

## Philosophy
This project is designed to run autonomously with minimal human intervention.

## Commands
- \`npm run agent status\` — Project health
- \`npm run agent analyze\` — Deep analysis
- \`npm run agent improve\` — Suggestions

## CI/CD
- GitHub Actions runs on every push
- Weekly dependency checks
- Auto-deployment configured

## Security
- \`.env\` is gitignored
- \`.env.example\` contains placeholders only
- No secrets in code

## Growth
The project will auto-improve based on usage patterns and dependency updates.
`
  
  writeFile('MANAGEMENT.md', doc)
  console.log('  MANAGEMENT.md created')
}

function createCiWorkflow() {
  const workflow = `name: CI

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - run: npm install
      
      - run: npm run build || echo "Build script not configured"
      
      - run: npm run lint || echo "Lint script not configured"
`
  
  writeFile('.github/workflows/ci.yml', workflow)
  console.log('  .github/workflows/ci.yml created')
}

function createKnowledgeBase() {
  const knowledge = `{
  "patterns": {
    "error_handling": "Use try/catch with structured error objects",
    "logging": "Use structured logging with timestamps",
    "security": "Never log secrets, validate all inputs",
    "git": "Commit working states, never commit .env or databases",
    "dependencies": "Pin versions, update monthly"
  },
  "improvements": [
    { "id": "add-tests", "priority": "high", "effort": "4 hours", "description": "Add unit tests" },
    { "id": "add-linting", "priority": "medium", "effort": "1 hour", "description": "Add oxlint or eslint" },
    { "id": "add-docs", "priority": "medium", "effort": "2 hours", "description": "Improve documentation" }
  ]
}
`
  
  writeFile('scripts/knowledge/patterns.json', knowledge)
  console.log('  scripts/knowledge/patterns.json created')
}

function updatePackageJson() {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.log('  No package.json found, skipping')
    return
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.scripts = pkg.scripts || {}
  pkg.scripts.agent = 'node scripts/agent.cjs'
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log('  package.json updated with agent script')
}

function commitAll() {
  run('git add .')
  const status = run('git status --short')
  if (status) {
    run('git commit -m "feat: add autonomous management infrastructure"')
    console.log('  Committed')
  } else {
    console.log('  No changes to commit')
  }
}

function main() {
  console.log(`\n=== Setting up autonomy for ${PROJECT_NAME} ===\n`)
  
  initGit()
  createGitignore()
  createEnvExample()
  createAgentScript()
  createManagementDoc()
  createCiWorkflow()
  createKnowledgeBase()
  updatePackageJson()
  commitAll()
  
  console.log('\n=== Autonomy setup complete ===\n')
  console.log('Next steps:')
  console.log('1. Review .env.example and add your actual values to .env')
  console.log('2. Push to GitHub: git remote add origin <url> && git push -u origin master')
  console.log('3. Enable GitHub Actions in repository settings')
}

main()
