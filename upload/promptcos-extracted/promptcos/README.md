# promptc OS · v2026.6

> The complete reusable AI prompt library for practitioners.

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Quick Start

```bash
# Clone + run locally
git clone https://github.com/marktantongco/promptc.git
cd promptc
npm install
npm run dev
# → http://localhost:5173
```

## Deploy to Vercel (30 seconds)

```bash
npm install -g vercel
vercel
```

Or: Push to GitHub → import at vercel.com/new → auto-detected as Vite → Deploy.

## Features

### ⚡ ACTIVATE
- Updated Master System Prompt (CORE RULES + ADVOCACY MODE + WRITING RULES + SKILLS)
- Advocate Mode
- 10 Secret Sauce Modifiers (each copy-ready)
- 6 Task-Specific Prompts (YouTube, Coding, Business, Research, UI/UX, Image)
- **Prompt Templates** in 3 groups:
  - 📋 Templates: Web App, Mobile, Brand, Landing Page, Dashboard, API
  - 📐 Meta Prompts: Universal, Mobile, Web (moved from BUILD)
  - 🏢 Brand Systems: powerUP, SaaS/B2B, E-commerce, Fintech, Insurance, Creative Agency (moved from BUILD)

### 🏗 BUILD (yellow-orange pills)
- 🐾 Animals — individual modes + chains → click chain → generates combined prompt
- 8 Layers — tab per layer → copy-ready snippet
- Enhancement — prompt snippet + How-to-Use toggle
- Web App — live prompt updates on framework/audience/aesthetic selection
- JSON / Output — techniques + decision matrix → click row → generates combined prompt
- Typography — pairings with copy button
- Design Vocab — Terms+Copy / vs Misconceptions / Synergy Combos views

### ✅ VALIDATE
- Prompt Lint Rules (6 checks)
- **Word Swaps** — 23 items, filter by Beginner / Misconception / Advanced
  - Copy button per "Replace With"
  - `[specific aesthetic keyword]` → interactive picker with 16 options
- Quality Checklist (progress bar)
- Prompt Scoring (live slider → score → grade)

### 📋 PLAYBOOK
- 18 searchable workflows across 7 categories
- Each expandable with step cards + copy prompt

### 🔨 BUILDER
- Workflow Builder + prompt history (last 10, load/view/copy/delete)
- 8-Layer Composer (fill layers → assembles live)
- Prompt Diff Tool (paste A vs B → scores 4 dimensions → WINNER)

## Stack

| Layer | Tool |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Styling | Inline styles (zero deps) |
| Fonts | Bebas Neue + DM Sans + DM Mono (Google Fonts) |
| Deploy | Vercel or GitHub Pages |

## v2026.6 Changelog

- Fix: `Cannot access 'BRAND' before initialization` — BRAND/BRANDS moved before TMPLS, brand prompts inlined
- Fix: Removed bare `<title>`/`<meta>` from JSX return
- Fix: Builder closing div structure
- New: Master System Prompt → CORE RULES + ADVOCACY MODE + WRITING RULES + SKILLS
- New: Meta Prompts moved to ACTIVATE templates (Universal, Mobile, Web)
- New: Brand Systems moved to ACTIVATE templates (6 brands)
- New: Word Swaps expanded 5→23 with Beginner/Misconception/Advanced filter
- New: Aesthetic keyword picker for the [specific aesthetic keyword] swap
- New: BUILD pill selection color → yellow-orange (#FFB000)
- Perf: Bebas Neue + DM Sans + DM Mono via Google Fonts preload
- Perf: CSS animations for all zone + section transitions

_promptc OS · powerUP · @markytanky · github.com/marktantongco_
