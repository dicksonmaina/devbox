# Master Autonomy Plan — All Projects

**Date:** 2026-08-14  
**Goal:** Apply the DevBox autonomy pattern to every project in the workspace  
**Philosophy:** Self-upgrading, self-managing, zero-human-presence-required systems

---

## Projects Inventory & Priority

| # | Project | Path | Stack | Priority | Strategy |
|---|---------|------|-------|----------|----------|
| 1 | **devbox** | `C:\Users\user\devbox` | React/TS/Vite | ✅ DONE | Expand existing autonomy |
| 2 | **whatsapp-bridge** | `C:\Users\user\projects\whatsapp-bridge` | Node.js/Python | 🔴 HIGH | Full autonomy setup |
| 3 | **payments-crm** | `C:\Users\user\workspace\projects\payments-crm` | Node.js/Express | 🔴 HIGH | Full autonomy setup |
| 4 | **commerce-starter** | `C:\Users\user\commerce-starter` | Node.js/Express | 🔴 HIGH | Full autonomy setup |
| 5 | **ecc** | `C:\Users\user\skills\ecc` | Node.js/TS | 🟡 MEDIUM | Expand existing CI |
| 6 | **rag** | `C:\Users\user\knowledge\rag` | Python/FastAPI | 🟡 MEDIUM | Service autonomy |
| 7 | **termagent** | `C:\Users\user\termagent` | Python | 🟡 MEDIUM | PyPI auto-publish |
| 8 | **claude-business** | `C:\Users\user\skills\claude-business` | Node.js | 🟡 MEDIUM | npm auto-publish |
| 9 | **ecc2** | `C:\Users\user\skills\ecc\ecc2` | Rust | 🟢 LOW | Cargo automation |

---

## Universal Autonomy Template

Every project gets these components:

### 1. Agent Entry Point (`scripts/agent.cjs`)
```javascript
// Universal commands:
node scripts/agent.cjs status     // Project health
node scripts/agent.cjs analyze    // Deep analysis
node scripts/agent.cjs build      // Build/compile
node scripts/agent.cjs deploy     // Deploy
node scripts/agent.cjs improve    // Suggestions
node scripts/agent.cjs auto       // Full autonomy
```

### 2. Knowledge Base (`scripts/knowledge/`)
- `tools.json` — Available features/improvements
- `patterns.json` — Best practices for the stack
- `dependencies.json` — Dependency metadata

### 3. CI/CD Pipeline (`.github/workflows/`)
- `ci.yml` — Build + test on every push
- `deps.yml` — Weekly dependency updates
- `auto-upgrade.yml` — Autonomous improvements

### 4. Management Docs
- `MANAGEMENT.md` — Project constitution
- `CONTRIBUTING.md` — How to add features
- `AUTONOMY.md` — How the auto-system works

---

## Per-Project Strategy

### 1. whatsapp-bridge (HIGH PRIORITY)
**Current:** Active service, no git, no CI/CD  
**Goal:** Self-healing, auto-updating bot service

**Actions:**
1. Initialize git repo
2. Add `.gitignore` for node_modules, .env, logs
3. Create `scripts/agent.cjs` with status/analyze/restart commands
4. Add `MANAGEMENT.md` with service constitution
5. Create `.github/workflows/ci.yml` for lint + test
6. Add auto-restart on failure (Windows service or PM2)
7. Add dependency update checker
8. Push to GitHub

**Autonomy features:**
- Auto-restart on crash
- Dependency updates weekly
- Health check endpoint monitoring
- Log rotation automation

### 2. payments-crm (HIGH PRIORITY)
**Current:** Working API, no git, no CI/CD  
**Goal:** Auto-deploying API with test coverage

**Actions:**
1. Initialize git repo
2. Add `.gitignore`
3. Create `scripts/agent.cjs`
4. Add `MANAGEMENT.md`
5. Create `.github/workflows/ci.yml` (test + lint)
6. Add `.github/workflows/deploy.yml` (auto-deploy to Railway/Render)
7. Add Stripe webhook testing in CI
8. Push to GitHub

**Autonomy features:**
- Auto-deploy on push to main
- Dependency updates with Dependabot
- Database migration automation
- Stripe webhook health checks

### 3. commerce-starter (HIGH PRIORITY)
**Current:** Similar to payments-crm, likely a template  
**Goal:** Same as payments-crm, or consolidate

**Actions:**
1. Determine if it's a duplicate of payments-crm
2. If unique: same setup as payments-crm
3. If duplicate: archive or link as template

### 4. ecc (MEDIUM PRIORITY)
**Current:** Large framework, has CI/CD  
**Goal:** Supply-chain security + release automation

**Actions:**
1. Add `scripts/agent.cjs` for skill validation
2. Add `scripts/knowledge/skills.json` with skill metadata
3. Enhance CI with:
   - Automated npm publish on release
   - Supply-chain security scanning
   - Skill linting/validation
4. Add `AUTONOMY.md` documenting the system

**Autonomy features:**
- Auto-publish to npm on tag
- Skill validation pipeline
- Dependency vulnerability alerts
- Release notes automation

### 5. rag (MEDIUM PRIORITY)
**Current:** Local RAG server, no git, no CI/CD  
**Goal:** Self-maintaining knowledge base

**Actions:**
1. Initialize git repo
2. Add `.gitignore` for chroma_db, .env
3. Create `scripts/agent.cjs` with ingest/update commands
4. Add `MANAGEMENT.md`
5. Create `.github/workflows/ci.yml`
6. Add Dockerfile for containerization
7. Add auto-restart policy

**Autonomy features:**
- Auto-document ingestion from folders
- Model update checks
- Vector DB maintenance
- Health check endpoint

### 6. termagent (MEDIUM PRIORITY)
**Current:** Python CLI, no CI/CD  
**Goal:** Auto-publish to PyPI

**Actions:**
1. Initialize git repo (if not already)
2. Add `.gitignore`
3. Create `scripts/agent.cjs`
4. Add `.github/workflows/publish.yml` for PyPI auto-publish
5. Add `.github/workflows/test.yml` for pytest
6. Add `MANAGEMENT.md`

**Autonomy features:**
- Auto-publish to PyPI on tag
- Dependency updates
- Test automation
- Changelog generation

### 7. claude-business (MEDIUM PRIORITY)
**Current:** npm package, has some CI  
**Goal:** Full npm publish automation

**Actions:**
1. Audit existing CI
2. Add `scripts/agent.cjs`
3. Enhance CI for auto-publish
4. Add `MANAGEMENT.md`

### 8. ecc2 (LOW PRIORITY)
**Current:** Rust alpha, inherited CI  
**Goal:** Cargo automation

**Actions:**
1. Add `scripts/agent.cjs`
2. Add cargo audit to CI
3. Add `MANAGEMENT.md`

---

## Implementation Order

### Phase 1: Core Infrastructure (Week 1)
1. ✅ **devbox** — Already done, just debug added
2. **whatsapp-bridge** — Highest value, active service
3. **payments-crm** — High value, revenue-impacting

### Phase 2: Expansion (Week 2-3)
4. **commerce-starter** — Related to payments-crm
5. **rag** — Knowledge base automation
6. **termagent** — CLI tool automation

### Phase 3: Polish (Week 4+)
7. **ecc** — Framework-level improvements
8. **claude-business** — Package automation
9. **ecc2** — Rust tooling

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Projects with autonomy | 9/9 |
| Auto-deploy frequency | 2x per week per project |
| Dependency update lag | < 7 days |
| Build failure rate | < 5% |
| Human intervention required | < 1x per month per project |

---

## Approval Required

**Please confirm:**

1. ✅ Proceed with Phase 1 (whatsapp-bridge, payments-crm, commerce-starter)?
2. ✅ Apply debug infrastructure to all future projects?
3. ✅ Use the same autonomy pattern across all projects?
4. ✅ Prioritize revenue-impacting projects (payments-crm) first?

**Once confirmed, I will execute Phase 1 immediately.**
