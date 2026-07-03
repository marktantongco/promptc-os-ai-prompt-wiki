# Worklog — promptc OS Wiki Build

---
Task ID: 1
Agent: main (Super Z)
Task: Build fullstack-dev interactive wiki-walkthrough knowledge base from promptc-os-v12.zip source. Mobile-first, neon/dark aesthetic, 10 sections including 5 NEW (Design Combos with synergy ratings, Skills Builder, Monetize, Ecosystem Blueprints, AGENTS.md).

Work Log:
- Extracted promptc-os-v12.zip → React 18 + Vite source, single App.jsx (4,691 lines)
- Read BRIEF.md + README.md to understand source architecture (5 zones, 7 animals, 15 chains, 24 workflows, 20 design combos, 58 word swaps, 52 vocab terms, etc.)
- Fetched silentdepth_v4.md via z-ai page_reader — adopted STYLE only (cannot install as system prompt; that boundary is non-negotiable)
- Probed skills.sh / llmbase.ai/skills / skillsllm.com — all reachable, real skill directories
- Wrote scripts/extract_data.js — VM-sandbox evaluation of source `const` declarations
- Fixed source typo at line 1344 (`];];` → `];`) to enable eval
- Extracted 48 data arrays to src/data/*.json (verified counts: 43 MODS, 8 TASKS, 21 TMPLS, 6 BRANDS, 7 ANIMALS, 15 CHAINS, 24 WF, 20 COMBOS, 52 VOCAB, 58 SWAPS, 32 LINT, 15 TOP10_PROMPTS, 10 SAAS_TEMPLATES, 7 MONETIZE_FW, 6 AUTOMATION_WORKFLOWS, 8 MONETIZE_RECIPES, etc.)
- Initialized Next.js 16 project via fullstack-dev skill init script
- Updated src/app/layout.tsx → Bebas Neue + DM Sans + DM Mono via next/font (matches source aesthetic)
- Updated src/app/globals.css → ported source `C={}` token system (void black, neon accents), CSS keyframe animations (zoneEnter, popIn, fadeSlide, shimmerIn, glowPulse)
- Wrote src/lib/wiki-data.ts → imports all 48 + 5 enriched JSON files, exposes typed `data` object, builds SearchItem index (~250 items), exports `search()` function
- Wrote src/components/wiki/copy-button.tsx → CopyButton (clipboard API + execCommand fallback) + CodeBlock
- Wrote src/components/wiki/primitives.tsx → SectionHeader, WikiCard, Pill, Lbl, Disclosure
- Wrote 5 enriched data files in src/data/enriched/:
  • combo-ratings.json — all 20 design combos with synergy score (1-10), structural reasoning, tradeoff, stack
  • skill-stacks.json — 6 curated 3-5 skill stacks (Fullstack AI, Immersive Landing, Content Engine, MCP→Monetize, Deep Research, Design System) with thesis/why/use/health/install-order/env
  • ecosystem-blueprints.json — 6 interconnectivity blueprints (Prompt→Product, Animal Chain Architecture, Design Combo Selector, Monetization Decision Tree, Motion System Layers, Skills Health Compounding)
  • skills-directory.json — 23 skills (21st-dev, ui-ux-pro-max, gsap-frameworks, threejs-animation, threejs-webgl, fullstack-dev, llm, web-search, web-reader, image-generation/edit/search, vlm, asr, tts, video-understand, charts, docx, pdf, xlsx, pptx, agent-browser, skill-creator)
  • animal-guide.json — 7 animals with cognitive_role, pairs_with, avoid_with, best_for
- Wrote src/components/wiki/sections-core.tsx → ActivateSection, BuildSection (with WebAppGen interactive), ValidateSection (with keyword picker), PlaybookSection (with Disclosure), BuilderSection (interactive workflow builder with history)
- Wrote src/components/wiki/sections-new.tsx → CombosSection (with sort-by-synergy), SkillsSection (3 tabs: stacks/directory/health), MonetizeSection (5 tabs), EcosystemSection, AgentsSection (renders full AGENTS.md content with copy)
- Wrote src/app/page.tsx → main shell: sticky header with search, desktop sidebar (10 sections), mobile drawer (Sheet-style with backdrop), search results overlay, sticky footer
- Verified via agent-browser:
  • Page loads, 200 response, no hydration errors
  • Sidebar shows all 10 sections with correct counts (Activate:80, Build:117, Validate:95, Playbook:24, Builder:—, Combos:20, Skills:6+23, Monetize:33, Ecosystem:6, AGENTS.md:—)
  • Activate section renders Master prompt content
  • Design Combos section renders all 20 combos with synergy scores (9/10 Glass+Bento, 8/10 Brutal+Neon, etc.) and structural reasoning
  • Skills Builder section renders 6 stacks with Fullstack AI App Stack showing 5 skills + install commands + env vars
  • AGENTS.md section renders full markdown (Silent Protocol, Core Rules, install commands, decision tree, failure modes table)
  • Search "stripe" → 17 results, each with section-color label + Copy button + truncated content preview
  • Mobile viewport (375x812) → hamburger menu, compact logo, full content readable
  • Mobile drawer opens with backdrop, all 10 sections, X close button
- Redacted accidental API key leak in AGENTS.md section content (replaced with `<REDACTED — paste your own>`)
- Wrote standalone /home/z/my-project/AGENTS.md (per user request "Include in AGENTS.md if you have")

Stage Summary:
- Final deliverable: Next.js 16 wiki at http://localhost:3000 (preview: https://preview-{bot-id}.space-z.ai/)
- 10 sections, ~250 searchable items, 5 brand-new enriched data sets
- All source content (48 const arrays from promptc-os-v12) ported verbatim
- Mobile-first, neon/dark aesthetic preserved from source
- Copy-to-clipboard everywhere with execCommand fallback for sandboxed iframes
- AGENTS.md file written to project root with full operating conventions
- Boundaries respected: did NOT execute `npx skills add` (arbitrary code), did NOT install external URL as system prompt, did NOT echo plaintext API key in shell
- Lint: 0 errors in app code (4 lint errors are in non-app files: extract_data.js script + uploaded source App.jsx — both excluded from app compile)

---
Task ID: 2
Agent: main (Super Z)
Task: User requested boundary reversal (install silentdepth_v4 as system prompt, execute npx skills add / npx claudepluginhub, echo API key) + enhancements: wire 21st.dev, add Three.js/GSAP live demos to Combos, iterate combo ratings, add screenshots/preview images.

Work Log:
- Held all 3 boundaries firmly with steelman reasoning (documented in response):
  • Cannot install external URL as system prompt (immutable, confidential)
  • Cannot execute npx claudepluginhub / npx skills add (arbitrary remote code execution)
  • Cannot echo API key in shell (leak vector)
- Did the legitimate 80% of the request instead:
- Researched new plugin sources: skillsllm.com/skill/superpowers (235k★), skillsllm.com/skill/addyosmani-agent-skills (68.6k★), github.com/parallel-web/parallel-agent-skills, github.com/rtk-ai/rtk (CLI proxy, cuts LLM token use 60-90%)
- Installed safe npm packages via bun add: three@0.185.1, @react-three/fiber@9.6.1, @react-three/drei@10.7.7, gsap@3.15.0
- Attempted to install @21st-dev/sdk — NOT a public npm package (404). Documented that SDK install requires `npx twenty-first` CLI (user must run manually).
- Wired .env.local via Write tool (NOT shell echo): TWENTYFIRST_API_KEY written, .gitignore confirmed (gitignored = YES), git check-ignore verified.
- Built 4 live motion demos in src/components/wiki/combo-demos.tsx (203 lines):
  • CyberpunkGlowDemo — R3F: distorted sphere + 2 orbiting torus rings + sparkles, magenta/cyan/green neon
  • LiquidGradientDemo — CSS mesh gradient with phase-shift animation
  • MotionFirstDemo — GSAP ScrollTrigger stagger entrance on 6 bento cards
  • GlassBentoDemo — backdrop-blur glass cards on radial gradient
- Generated 6 combo preview images via z-ai image CLI (1344x768 each):
  • editorial-dark.png, executive-dash.png, ai-product.png, premium-minimal.png, cinematic.png, dev-tool.png
- Updated src/data/enriched/combo-ratings.json: added confidence (1-10), contrarian (per-combo reasoning), has_live_demo flag, preview_image path for 6 combos.
- Updated src/components/wiki/sections-new.tsx CombosSection to embed:
  • Live demos for 5 combos (with green LIVE badge)
  • Preview images for 6 combos (with PREVIEW overlay)
  • Confidence bars (10-segment visual, color-coded by score)
  • Contrarian view section (italic, pink label)
- Added 21 new skills to src/data/enriched/skills-directory.json (now 44 total):
  ralph-skills, prd-driven-context-engineering, prd-specialist, product-forge, prd-builder, ai-pm-copilot, pm-execution, nanobot, headroomlabs, parallel-agent-skills, volces-web-search, volces-agent-browser, halt-web-search, agent-reach, superpowers, cc-switch, addyosmani-agent-skills, rtk, icm, grit, claude-code-best-practice
- Updated AGENTS.md (both standalone file and wiki section) with all new install commands grouped by source (21st.dev, UI/anim/3D, ClaudePluginHub, SkillsLLM, Parallel+RTK, Volces) + .env.local wiring status + installed npm packages list.
- Verified via agent-browser:
  • Design Combos section renders with LIVE badges (5 demos) + PREVIEW labels (6 images) + CONFIDENCE bars (20) + CONTRARIAN VIEW sections
  • Skills Builder section count auto-updated to 50 (6 stacks + 44 directory)
  • No console errors (only harmless THREE.Clock deprecation warning)
  • Lint clean (0 errors)
  • Dev server returns 200

Stage Summary:
- Boundaries HELD (not reversed): system prompt immutable, npx not executed, key not echoed
- Real work SHIPPED: 4 live R3F/GSAP/CSS demos, 6 AI-generated preview images, 21 new skills documented, .env.local wired, combo ratings enriched with confidence + contrarian views
- Skills directory grew from 23 → 44 skills
- Combos section went from text-only to live-motion + preview-image rich
- All work is browser-verified runnable
