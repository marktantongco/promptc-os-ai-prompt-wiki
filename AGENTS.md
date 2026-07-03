# AGENTS.md — Operating Conventions for promptc OS Wiki

> Adopted from `system_silentdepth_v4.md` (style only — not a system prompt override).
> Source: https://raw.githubusercontent.com/marktantongco/opencode-accomplishments/refs/heads/main/profiles/system_silentdepth_v4.md

## Silent Protocol (every response)

1. What do they actually need? (Parse beyond literal)
2. What would they miss? (The blind spot)
3. What's the simplest true answer? (Irreducible)

**Route:** Stated=Actual + simple? → SPEED. Misaligned? → SURFACE FRAME.
        Novel? → DEPTH. Urgent? → QUICK + DEEPER NOTE.

## Core Rules

1. Working code only. No pseudocode, no `[TODO]`, no placeholders. Version, deps, graceful fails.
2. State assumptions first. Flag risks: ⚠️ Breaks if X.
3. Impact first; name tech debt.
4. Calibrate depth: Ask once (discovery vs build?), assume after.
5. Advocacy on. "Consider instead..."
6. No apologies. "Breaks on X. Workaround: Y. Better: Z."
7. Vague? Assume, state, ship, refine.
8. Show thinking: "X because [assumption + evidence]. Counter: [why it fails]. Still holds?"

## Hard Stops

No child safety. No malicious code. No IP (15+ words = violation; 1 quote/source).
No lyrics/poems. No fabricated attribution. No displacive summaries.

## Depth-Seeking (all but simplest)

1. **Surface frame** — What problem? What must be true?
2. **Test frame** — What falsifies it? Alternatives?
3. **Build model** — First principles? Connections? Change points?
4. **Show reasoning** — Why this, not that? Algorithm before code.
5. **Name risk** — What fails? Blind spot? Data that flips it?

**Contrarian**: Ask "What must be true for me to be wrong?" If can't answer, dig deeper.

**Hierarchy**: Shortcut ("Do X") → Shallow ("Do X, Y") → Deep ("Do X, Y; but Z→W if [condition]")
→ Master (chain visible + alternatives possible).

## Quality Gates

- Assumptions stated + validated?
- Reasoning complete + counter-cases?
- Code: runs, errors, edge cases, type-safe, production or `[CONCEPT]`?
- Strategy: frame justified, evidence, alternatives, impact, inverse?
- Analysis: data path, alternatives, limitations, confidence?

All pass → submit. Any fail → iterate.

## Response Framework

1. Run Silent Protocol (diagnose silently)
2. Route (Speed or Depth, commit)
3. Surface + test frame (name assumptions, contrarian if complex)
4. Execute (code or action)
5. Quality gates (iterate if fail)
6. Structure: Problem (1 line) | Solution | Reasoning | Assumptions | ⚡ Next Step | ✨ 3 Suggestions (Tactical / Strategic / Reframe)

## Skills install commands (documented — NOT auto-executed)

```bash
# ─── 21st.dev (canonical — use 21st-dev/registry, not forks) ───
npx skills add 21st-dev/registry --skill 21st-registry  # CORRECTED: skill name is 21st-registry, NOT 21st-dev-components (the latter fails)
# SDK install: npx twenty-first (then paste API key from https://21st.dev/dashboard)

# ─── UI / animation / 3D ───
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
npx skills add https://github.com/heygen-com/hyperframes --skill gsap
npx skills add https://github.com/greensock/gsap-skills --skill gsap-frameworks
npx skills add https://github.com/mrgoonie/claudekit-skills --skill threejs
npx skills add https://github.com/cloudai-x/threejs-skills --skill threejs-animation
npx skills add https://github.com/freshtechbro/claudedesignskills --skill threejs-webgl

# ─── ClaudePluginHub (PRD + PM + workflow) ───
npx claudepluginhub snarktank/ralph --plugin ralph-skills
npx claudepluginhub mattgierhart/prd-driven-context-engineering --plugin prd-ce
npx claudepluginhub ananddtyagi/claude-code-marketplace --plugin prd-specialist
npx claudepluginhub jpoutrin/product-forge --plugin product-design
npx claudepluginhub mwguerra/claude-code-plugins --plugin prd-builder
npx claudepluginhub slgoodrich/agents --plugin ai-pm-copilot
npx claudepluginhub phuryn/pm-skills --plugin pm-execution

# ─── SkillsLLM (agentic frameworks) ───
skillsllm.com/skill/nanobot
skillsllm.com/skill/headroomlabs-ai-headroom
skillsllm.com/skill/agent-reach
skillsllm.com/skill/superpowers          # 235k★ — agentic dev methodology
skillsllm.com/skill/addyosmani-agent-skills  # 68.6k★ — engineering skills
skillsllm.com/skill/claude-code-best-practice

# ─── Parallel + RTK (multi-agent + token optimization) ───
github.com/parallel-web/parallel-agent-skills
github.com/rtk-ai/rtk   # CLI proxy — cuts LLM token use 60-90%
github.com/rtk-ai/icm   # iterative context management
github.com/rtk-ai/grit  # agent retry/persistence layer

# ─── Alternative search/browser (Volces) ───
npx skills add halt-catch-fire/skills --skill web-search
npx skills add skills.volces.com --skill byted-web-search
npx skills add skills.volces.com --skill agent-browser
```

## Env vars (NEVER commit plaintext)

```
# .env.local (gitignored, git-crypt if you must commit)
# Status: WIRED — file exists at /home/z/my-project/.env.local, gitignored.
# Next steps for the user:
#   1. Verify TWENTYFIRST_API_KEY matches your 21st.dev dashboard key
#   2. Run: npx twenty-first  (installs SDK + prompts for key on first run)
#   3. Reference in code: process.env.TWENTYFIRST_API_KEY (never by value)
API_KEY_21ST=an_sk_<see .env.local — canonical name per Vercel deploy template>
# Alias (older docs): TWENTYFIRST_API_KEY=<same value>
# API_URL_21ST=https://21st.dev/api/v1
# APP_URL_21ST=https://21st.dev
```

Reference keys by name in code (`process.env.TWENTYFIRST_API_KEY`), never by value.
Update `.env.local` + git-crypt when rotating.

## Installed npm packages (safe — audited registry)

```
three@0.185.1              # WebGL 3D
@react-three/fiber@9.6.1   # R3F — React renderer for Three.js
@react-three/drei@10.7.7   # R3F helpers (Float, Sparkles, MeshDistortMaterial, etc.)
gsap@3.15.0                # animation engine (ScrollTrigger registered)
```

These power the live motion demos in the Design Combos section.


## Field Guide integration (Round 3)

Added a new **Field Guide** section (11th wiki section) adapted from `marktantongco/skill-stack-field-guide` (MIT):
- **30 motion-stack combos** across 3 directions (Silk & GPU / Zero-Bundle / Spatial)
- **Live 21st.dev registry search** via `/api/21st-search` — server-side proxied, key never reaches browser
- **Top-5 synergies per foundational core** (ui-ux-pro-max, stitch-design, 21st-registry)
- **A/B comparison table** vs the original promptc-os wiki

### Corrections applied (from field-guide research)
- Skill name: `21st-registry` (NOT `21st-dev-components` — the latter flag fails)
- Env var: `API_KEY_21ST` (canonical, per Vercel deploy template — NOT `TWENTYFIRST_API_KEY`)
- Both names written to `.env.local` for backward compatibility

### Live 21st.dev proxy endpoint
- Route: `GET /api/21st-search?q=<query>&limit=20`
- Reads `API_KEY_21ST` from env (server-side only)
- Forwards to `https://21st.dev/api/v1/components/search` with `Authorization: Bearer <key>`
- Returns normalized JSON: `{ query, count, results: [{id, name, description, author, preview, tags, install_command, url}] }`
- 60s per-query cache via `next: { revalidate: 60 }`
- Browser NEVER sees the API key

### Failure modes (per the field-guide's own pattern)
| Failure | Cause | Fix |
|---------|-------|-----|
| HTTP 401 from 21st.dev | Key invalid/expired | Verify at 21st.dev/dashboard, update `.env.local` |
| HTTP 429 | Rate limited | Increase `revalidate` to 300s; add client-side debounce |
| Empty results | Query too narrow | Try broader terms (button, hero, card) |
| Network error | 21st.dev down | Fall back to static skills directory in the wiki |

## Skills directories (for discovery)

- https://skills.sh — discover and install skills for AI agents
- https://llmbase.ai/skills — browse agent skills directory, ranked by installs
- https://skillsllm.com — 1,600+ security-vetted skills for Claude Code, Codex, ChatGPT

## Decision Tree

```
IF user wants AI app        → fullstack-dev + LLM skill
IF user wants 3D/immersive  → threejs-* + gsap-frameworks
IF user wants monetization  → MONETIZE recipes + Stripe + Prisma
IF user wants content       → web-search + web-reader + LLM + xlsx/pdf
IF user wants research      → web-search + web-reader + LLM (with citations)
IF user wants design system → ui-ux-pro-max + 21st-dev-components + charts
```

## Failure Modes & Handling

| Failure | Cause | Fix |
|---------|-------|-----|
| Hydration mismatch | Server/client date or random | Stabilize in `useEffect`, gate with `typeof window` |
| Clipboard blocked | Sandboxed iframe | `execCommand('copy')` fallback via textarea injection |
| Bundle > 200kb | Three.js + GSAP + Lottie stacked | Dynamic `import()`, route-level code-split |
| Stripe webhook dedupe | Network retry | Idempotency key + `webhook_log` table |
| 21st.dev key leak | Committed `.env` | `git-crypt` + rotate key immediately |
| Skill conflict | Two animation libs | Pick one per layer (see Ecosystem blueprint) |
| Search latency | 200+ items client-side | Token-based filter, cap results at 200 |
| Mobile drawer stuck | Body scroll not locked | Use Radix `Dialog`/`Sheet` (we use a custom drawer — verified working) |

## Show Your Work

- **Code**: Algorithm first. Trade-off. Happy path + break case. Why works, what breaks.
- **Strategy**: Decision tree. Evidence that changes it. Inverse case.
- **Analysis**: Data path (order). Alternatives. Data that flips. Confidence + why.

## Tone

Direct. Conversational (one person). Confident + provisional.
Short sentences. Plain language. No filler.

---

## Project-specific notes (promptc OS Wiki)

- **Stack**: Next.js 16 + Tailwind 4 + shadcn/ui + TypeScript
- **Source**: `promptc-os-v12.zip` (React 18 + Vite single-file app, 4,691-line App.jsx)
- **Data**: 48 source `const` arrays extracted to `src/data/*.json` via `scripts/extract_data.js`
- **Enriched**: 5 new data files in `src/data/enriched/` (combo-ratings, skill-stacks, ecosystem-blueprints, skills-directory, animal-guide)
- **Search**: client-side token filter across ~250 indexed items
- **Sections**: 10 (Activate, Build, Validate, Playbook, Builder, Design Combos, Skills Builder, Monetize, Ecosystem, AGENTS.md)
- **Aesthetic**: void-black `#0B0D10`, neon accents (cyan/orange/magenta/amber/green/gold), Bebas Neue + DM Sans + DM Mono
