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


## Round 4 audit — 21st.dev proxy + SDK install SOP

### Audit findings
- ✅ Live 21st.dev proxy at `/api/21st-search` now returns REAL results (was returning 401 last round due to invalidated key)
- ✅ Fresh key wired to `.env.local` (file-write only, gitignored)
- ✅ API contract corrected: `?q=` (not `?query=`), `&scope=public` (defaults to "team" which returns empty)
- ✅ Response schema mapped: name, slug, description, author, install_ref, preview_url, bundle_html_url, tags, url
- ⚠️ Key was shared in plaintext chat — ROTATE at 21st.dev/dashboard after this session
- ✅ Browser never sees the key (server-side proxy only)

### SDK install SOP (for the user — NOT auto-executed by the agent)

```bash
# 1. Install the 21st.dev SDK (one-time, prompts for key on first run)
npx twenty-first

# 2. The SDK reads API_KEY_21ST from .env.local automatically.
#    If it doesn't, paste the key when prompted (NEVER commit plaintext).

# 3. Install a component (e.g. the Color Depth button)
npx twenty-first add @arlanoska/color-depth

# 4. The component lands in components/21st/color-depth/ (or similar)

# 5. Swap the shadcn import in your code:
#    - Before: import { Button } from '@/components/ui/button'
#    - After:  import { Button } from '@/components/21st/color-depth'

# 6. Test on dark surface first — 21st.dev components may need theme overrides.

# 7. If it clashes with the neon aesthetic, revert:
#    rm -rf components/21st/color-depth/
#    # restore the shadcn import
```

### Component Swap Guide (8 curated swaps)

| shadcn primitive | 21st.dev replacement | install_ref | wiki use case |
|---|---|---|---|
| Button | The Art of Color Depth | `@arlanoska/color-depth` | All copy buttons + tab pills |
| Card | Animated Sparkline | `@larsen66/animated-sparkline` | Monetize + Ecosystem data cards |
| Dialog | BeUI Morphing Modal | `@starc007/be-ui-morphing-modal` | Mobile drawer, combo details |
| Input | Gradient Chat Input | `@ruixen.ui/gradient-chat-input` | Builder goal input |
| Tabs | BeUI Expandable Tabs | `@starc007/be-ui-expandable-tabs` | All section sub-nav (mobile) |
| Accordion | BeUI Bouncy Accordion | `@starc007/be-ui-bouncy-accordion` | Playbook workflows |
| Tooltip | BeUI Tooltip | `@starc007/beui-tooltip` | Combo scores, confidence bars |
| Sidebar | Dashboard Sidebar | `@arunjdass/dashboard-sidebar` | Desktop sidebar + mobile drawer |

See the in-app **Field Guide → Swap Guide** tab for full why/risk/SOP per swap.

### Failure modes (21st.dev integration)

| Failure | Cause | Fix |
|---|---|---|
| HTTP 401 from 21st.dev | Key invalid/expired | Rotate at 21st.dev/dashboard, update .env.local |
| HTTP 400 `missing_query` | Wrong param name | Use `?q=` not `?query=` (fixed in route.ts) |
| Empty results, 200 OK | Default scope=team | Add `&scope=public` (fixed in route.ts) |
| HTTP 429 | Rate limited | Increase `revalidate` to 300s; add client debounce |
| Component clashes with neon theme | 21st.dev default is light | Override CSS variables; test on dark surface |
| `npx twenty-first` not found | SDK not installed | Run `npm install -g twenty-first` or use `npx` |
| Component install fails | Wrong install_ref format | Use `@author/slug` from the API response, not the URL |


## Round 5 — 21st.dev CLI installed + Pin List feature

### 21st.dev CLI installation (DONE)

```bash
# 1. Install CLI globally (audited npm package)
npm i -g @21st-dev/cli

# 2. Login by writing key to config file (NOT shell echo)
#    Config location: ~/.config/21st/auth.json
#    Format: {"token": "21st_sk_...", "apiKey": "21st_sk_..."}
mkdir -p ~/.config/21st
# Write auth.json via file-write (Python/Node script), NOT shell echo

# 3. Verify login
21st whoami    # → "Logged in as ..."
21st usage     # → "Tier: free, X/Y retrievals remaining today"

# 4. Search for components
21st search "button" --limit 5 --json

# 5. Install a component (NOTE: this puts the key in the URL — 21st.dev's design)
21st add <author>/<slug>
# Internally runs: npx shadcn@latest add "https://21st.dev/r/<author>/<slug>?api_key=***"
# The CLI redacts the key in console output (api_key=***), but it IS in the HTTP request
```

### ⚠️ 21st.dev CLI security note

The `21st add` command puts the API key in the URL query string (`?api_key=...`).
This is 21st.dev's own design — unavoidable if you use their CLI.
The key appears in: the HTTP request to 21st.dev, npm/shadcn cache logs, and potentially upstream proxy logs.
**Mitigation**: only use `21st add` with keys you're willing to rotate. The CLI redacts the key in terminal output.

### Pin List feature (NEW)

Added a **Pin List** feature inspired by `skyleen77/pin-list` on 21st.dev:
- **Pin button** on every Design Combo card (and extensible to other sections)
- **Pin badge** in the header (shows count, click to open panel)
- **Pin panel** — right-side drawer with:
  - Filter/search pins
  - Click pin to navigate back to its section
  - Remove pin (X button on hover)
  - localStorage persistence (no backend)
- Built with `useSyncExternalStore` (React 19 correct pattern for SSR-safe localStorage)

### Why I built Pin List instead of importing the 21st.dev component

1. The `marktantongco/pin-list` you referenced doesn't exist in the public registry (only `skyleen77/pin-list` does)
2. The 21st.dev bundle is a compiled Vite app (388KB) — not a drop-in React component
3. A wiki-specific Pin List (pin prompts/combos/skills, not generic items) is more useful than a fixed component
4. Built with the wiki's design tokens (neon/dark, Bebas/DM Sans/DM Mono) — no theme clash

### Failure modes (Pin List)

| Failure | Cause | Fix |
|---|---|---|
| Pins disappear on refresh | localStorage disabled (private mode) | Fall back to in-memory state; warn user |
| Pin button doesn't toggle | useSyncExternalStore not re-rendering | Verify writePins() calls all listeners |
| Hydration mismatch | Server renders 0 pins, client loads N | useSyncExternalStore with `() => []` server snapshot |
| Pin panel won't open | Header z-index conflict | Panel uses z-50, header z-40 — verified |
| Pin count badge wrong | Stale closure | useSyncExternalStore auto-tracks; no closure issue |

### Component install SOP (for the user)

```bash
# TO INSTALL A 21ST.DEV COMPONENT:
1. 21st search "<query>" --json    # find the component
2. 21st add <author>/<slug>         # install (key goes in URL — 21st.dev's design)
3. Component lands in components/21st/<slug>/
4. Import in your code: import { X } from '@/components/21st/<slug>'
5. Test on dark surface — 21st.dev components may need theme overrides
6. If it clashes, delete the file and revert the import
```

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
