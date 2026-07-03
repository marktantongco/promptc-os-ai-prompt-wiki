# promptc OS — Project Brief
## Workflow #19: AI Tool / Product Build
**Chain:** 🦅 Eagle → 🦫 Beaver → 🐬 Dolphin → 🐜 Ant

---

## Step 1 (🦅 Eagle) — Vision

### Core user problem the AI solves
AI practitioners waste time searching for prompts across tabs, notes, and bookmarks.
They know what they want to build — they don't know how to prompt for it precisely.
promptc OS gives every prompt, framework, and workflow in one place. Copy. Paste. Ship.

### Zones / Modes
| Zone | Purpose | Color |
|---|---|---|
| ⚡ ACTIVATE | Copy-paste to AI. Start fast. | Cyan #4DFFFF |
| 🏗 BUILD | Reference library, Frameworks | Neon orange #FF6B00 |
| ✅ VALIDATE | Score, lint, refine | Green #22c55e |
| 📋 PLAYBOOK | 19 workflows. Step-by-step. | Amber #FFB000 |
| 🔨 BUILDER | Interactive prompt composers | Magenta #FF4FD8 |

### Data architecture
**Consumes:**
- Static prompt strings (MASTER, ADVOCATE, TASKS, TMPLS)
- Structured workflow objects (WF array — 19 items)
- Design vocabulary (VOCAB — 27 terms, 14 combos)
- Brand systems (BRANDS — 6 complete prompts)
- Validation rules (LINT, SWAPS — 23 items, CHECKS, SSCALE)

**Outputs:**
- Copy-ready prompt text (clipboard)
- Live-assembled prompts (Workflow Builder, 8-Layer Composer, Web App Generator)
- Scored prompt quality (Prompt Diff, Scoring sliders)
- Combined chain prompts (Animal chains, JSON matrix)

### Prompt schema
```
PROMPT_ITEM = {
  id:       string          // unique key
  label:    string          // display name + emoji
  desc:     string          // one-line use-case
  content:  string          // the actual prompt text (template literal)
  cat?:     string          // category for filtering
  level?:   string          // beginner | misconception | advanced
  isAesthetic?: boolean     // triggers keyword picker
}

WORKFLOW_ITEM = {
  id:     number
  cat:    string            // category emoji + name
  title:  string
  purpose:string
  best:   string
  chain:  string[]          // Animal names in order
  out:    string            // final output description
  steps:  { a, t, items }[] // animal, title, checklist items
}
```

### Success metric
User opens promptc OS → finds the right prompt in under 10 seconds → copies it → gets a better AI output than without it. Every session ends with a prompt in the clipboard.

---

## Step 2 (🦫 Beaver) — Engine

### Design token system
```js
C = {
  bg:     "#0B0D10"   // void black
  sur:    "#14161A"   // charcoal surface
  bdr:    "#ffffff12" // 7% white border
  cy:     "#4DFFFF"   // cyan — activate
  vi:     "#FF6B00"   // neon orange — build
  mg:     "#FF4FD8"   // magenta — builder
  am:     "#FFB000"   // amber — playbook / build pills
  gn:     "#22c55e"   // green — validate / success
  rd:     "#ef4444"   // red — errors / avoid
  mn:     "DM Mono"   // monospace — code, labels
  ss:     "DM Sans"   // sans — body, UI
  hd:     "Bebas Neue"// display — header
}

// Animation curves
cubic-bezier(0.16, 1, 0.3, 1)  // spring — all zone/section transitions
cubic-bezier(0.94, 0, 1, 0.94) // popIn — scale 0.94 → 1
// Durations: 180ms micro · 250ms standard · 300ms zone enter
```

### Component library
| Component | Purpose |
|---|---|
| `<Card>`  | Surface container with optional accent border |
| `<Code>`  | Syntax-highlighted pre block with copy button absolute-positioned |
| `<Pill>`  | Filter/tab toggle — active state with color fill |
| `<Cp>`    | Copy button — useCopy() + execCommand fallback for sandboxed iframes |
| `<Inp>`   | Labeled text input |
| `<TA>`    | Labeled textarea |
| `<Lbl>`   | Uppercase mono section label |
| `<H3>`    | Section heading with fluid clamp() sizing |

### Prompt data layer
All prompts are `const` declarations at the top of the file — zero hardcoded strings in JSX components. Order matters: `BRAND` and `BRANDS` must be declared before `TMPLS` which references them.

### Copy-to-clipboard utility
```js
function useCopy() {
  return useCallback((text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else { fallbackCopy(text); } // execCommand for sandboxed iframes
  }, []);
}
```

### Zone navigation
`switchZone(id)` → sets zone + increments `zKey` → `<div key={zKey} className="anim-zone">` triggers CSS keyframe re-mount. Smooth scrolls to top on mobile if `scrollY > 80`.

---

## Step 3 (🐬 Dolphin) — Interaction Layer

### Interactive composers
| Tool | Interaction |
|---|---|
| Workflow Builder | Click animals → reorder steps → type goal → ⚡ GENERATE → prompt + history |
| 8-Layer Composer | Fill any layer textarea → assembled prompt builds live in real time |
| Web App Generator | Select audience + framework + aesthetics → prompt updates live |
| Prompt Diff | Paste A + B → auto-score 4 dimensions → WINNER badge |

### Copy-ready everywhere
Every item has a `<Cp>` button:
- Each modifier in the MODS table
- Each template pill in ACTIVATE
- Each layer snippet in 8-Layer
- Each animal mode prompt
- Each chain → combined prompt
- Each JSON matrix row → combined prompt
- Each vocab term + combo
- Each typography pairing
- Each word swap "Replace With"
- Each workflow in PLAYBOOK

### Animation system
```css
@keyframes zoneEnter  { from { opacity:0; transform:translateY(8px) scale(0.99) } }
@keyframes popIn      { from { opacity:0; transform:scale(0.94) } }
@keyframes fadeSlide  { from { opacity:0; transform:translateY(10px) } }
@keyframes shimmerIn  { from { opacity:0; transform:translateX(-8px) } }
@keyframes glowPulse  { 50% { opacity:0.7 } }
button:active         { transform: scale(0.96) }
```

### Misconception vs correct views
Design Vocabulary has 3 views:
- **Terms + Copy** — what the term produces
- **vs Misconceptions** — ❌ wrong assumption / ✅ correct implementation
- **Synergy Combos** — high-synergy combinations with psychological effect

### Keyword picker
Word Swap `[specific aesthetic keyword]` row renders an interactive grid of 16 keywords (glassmorphism, neo-brutalism, kinetic typography…). Click one → highlight → copy. Solves the "I don't know what to put here" problem.

---

## Step 4 (🐜 Ant) — Ship Checklist

### Initialization order (critical)
```
BRAND           ← must be first (used by BRANDS + TMPLS)
BRANDS          ← must be before TMPLS
TMPLS           ← references BRAND and BRANDS inline
META / ENH / WF ← after TMPLS
```
Bug fixed: `Cannot access 'BRAND' before initialization` — caused by `const` temporal dead zone.

### JSX safety rules
- ❌ No `<title>`, `<meta>`, `<link>` directly in JSX returns — crashes the renderer
- ✅ SEO meta goes in `index.html`, font CSS goes in injected `<style>` tag
- ✅ Fragment pairs `<>...</>` must be balanced (verified: 3 open = 3 close)
- ✅ Builder function: animated wrapper div needs its own closing `</div>` before `</div>);`

### Clipboard in sandboxed iframes
Claude.ai artifacts run in sandboxed iframes where `navigator.clipboard` may be unavailable. Fix: `execCommand('copy')` fallback via textarea element injection.

### Template literal safety
Brand prompts in `BRANDS[]` contain multi-line strings. When referenced inside another template literal (TMPLS), backticks inside the string must be escaped as `${"` + "`" + `"}`. Alternatively: inline the string directly to avoid cross-reference issues.

### Deploy
```bash
npm install
npm run build    # Vite → dist/
vercel           # 30 seconds → live URL
```

---

## Final Output

**Deployed AI product with prompt engine, UI system, and component library.**

promptc OS v2026.4 — 1910 lines, single JSX file, zero external dependencies beyond React + Vite.

- 5 zones · 19 workflows · 27 design vocab terms · 23 word swaps · 6 brand systems
- 4 interactive builders · 10 animation keyframes · 1 clipboard utility
- Bebas Neue + DM Sans + DM Mono · neon orange BUILD · amber PLAYBOOK
- Deployed: `npm run build` → `vercel` → live in 30 seconds

---

_promptc OS · powerUP · @markytanky · Workflow #19_
