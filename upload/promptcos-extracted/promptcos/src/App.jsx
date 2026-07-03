import { useState, useCallback, useMemo } from "react";


// ─── PWA ──────────────────────────────────────────────────────────────────────
const PWA_MANIFEST = {
  name:"promptc OS",short_name:"promptc",description:"AI Prompt Engineering Reference",
  start_url:"/",display:"standalone",background_color:"#0B0D10",theme_color:"#0B0D10",
  icons:[
    {src:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' fill='%230B0D10'/><text x='96' y='140' text-anchor='middle' font-size='120' fill='%234DFFFF'>⚡</text></svg>",sizes:"192x192",type:"image/svg+xml"},
    {src:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' fill='%230B0D10'/><text x='256' y='370' text-anchor='middle' font-size='320' fill='%234DFFFF'>⚡</text></svg>",sizes:"512x512",type:"image/svg+xml"},
  ],
};

function injectPWA(){
  // Manifest
  const blob=new Blob([JSON.stringify(PWA_MANIFEST)],{type:"application/manifest+json"});
  const link=document.createElement("link");
  link.rel="manifest";link.href=URL.createObjectURL(blob);
  document.head.appendChild(link);
  // Theme color
  const meta=document.createElement("meta");meta.name="theme-color";meta.content="#0B0D10";
  document.head.appendChild(meta);
  // Viewport
  const vp=document.querySelector("meta[name=viewport]")||document.createElement("meta");
  vp.name="viewport";vp.content="width=device-width,initial-scale=1,viewport-fit=cover";
  if(!vp.parentNode)document.head.appendChild(vp);
  // Service Worker (inline cache-first SW)
  if("serviceWorker" in navigator){
    const swCode=`
const CACHE="promptc-v12";
const ASSETS=["/"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
    `;
    const swBlob=new Blob([swCode],{type:"application/javascript"});
    navigator.serviceWorker.register(URL.createObjectURL(swBlob)).catch(()=>{});
  }
}

const FONT_CSS=`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#0B0D10}::-webkit-scrollbar-thumb{background:#ffffff18;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#ffffff30}
@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
@keyframes shimmerIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes zoneEnter{from{opacity:0;transform:translateY(8px) scale(0.99)}to{opacity:1;transform:none}}
@keyframes ripple{0%{transform:scale(0);opacity:0.5}100%{transform:scale(3);opacity:0}}
@keyframes copyFlash{0%{background:#22c55e30}50%{background:#22c55e15}100%{background:transparent}}
@keyframes glowPulse{0%,100%{opacity:1}50%{opacity:0.7}}
.anim-zone{animation:zoneEnter 0.3s cubic-bezier(0.16,1,0.3,1)}
.anim-pop{animation:popIn 0.2s cubic-bezier(0.16,1,0.3,1)}
.anim-slide{animation:fadeSlide 0.25s cubic-bezier(0.16,1,0.3,1)}
.anim-shimmer{animation:shimmerIn 0.2s cubic-bezier(0.16,1,0.3,1)}
button:active{transform:scale(0.96)!important}
@media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important;animation-iteration-count:1!important}}
`;

function fallbackCopy(text){const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;top:-9999px;opacity:0";document.body.appendChild(el);el.focus();el.select();try{document.execCommand("copy");}catch(e){}document.body.removeChild(el);}
function useCopy(){return useCallback((text)=>{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text));}else{fallbackCopy(text);}},[]); }

const C = {
  bg:"#0B0D10", sur:"#14161A", bdr:"#ffffff12", bdrH:"#ffffff25",
  tx:"#FFFFFF", mu:"#a1a1aa", di:"#6b7280", fa:"#4b5563",
  cy:"#4DFFFF", vi:"#FF6B00", mg:"#FF4FD8", am:"#FFB000",
  gn:"#22c55e", bl:"#38bdf8", or:"#f97316", rd:"#ef4444",
  mn:"'DM Mono','JetBrains Mono',monospace",
  ss:"'DM Sans',system-ui,sans-serif",
  hd:"'Bebas Neue',sans-serif",
};
const ZC={activate:C.cy,build:C.vi,validate:C.gn,playbook:C.am,monetize:"#FFD700"};
const AC={Eagle:C.am,Beaver:C.vi,Ant:C.mg,Owl:C.cy,Rabbit:C.gn,Dolphin:C.bl,Elephant:C.or};
const AE={Eagle:"🦅",Beaver:"🦫",Ant:"🐜",Owl:"🦉",Rabbit:"🐇",Dolphin:"🐬",Elephant:"🐘"};

const ZONES=[
  {id:"activate",label:"⚡ ACTIVATE",sub:"Copy-paste to AI"},
  {id:"build",   label:"🏗 BUILD",   sub:"Reference library, Frameworks"},
  {id:"validate",label:"✅ VALIDATE",sub:"Score, lint, refine."},
  {id:"playbook",label:"📋 PLAYBOOK",sub:"24 workflows. Step-by-step."},
  {id:"monetize", label:"💰 MONETIZE", sub:"Profitable prompts, SaaS, frameworks."},
];

const MASTER=`You are my expert AI assistant, business partner, and creative strategist.
Act in MY best interest — identify what I truly need, not just what I asked.

CORE RULES:
1. No filler. No fluff. No disclaimers.
2. Give WORKING code only — never pseudocode.
3. Rank ideas by impact — not just list them.
4. Always flag a better/faster way if one exists.
5. Default to expert-level unless told otherwise.
6. Vague request? Assume smartly, state it, proceed.
7. Something risky? Flag it — then do it anyway unless I say stop.
8. Never ask me to repeat context from this conversation.
9. Format for scanability: headers, bullets, bold key points.
10. End every complex answer with ⚡ Recommended Next Step.

ADVOCACY MODE:
- Warn me before I make a mistake.
- Suggest better approaches even when I didn't ask.
- Optimize for my long-term success — not just the task.
- Push back if you have a strong reason.
- Quality over speed — always.

WRITING RULES:
- Short sentences. Every word earns its place.
- Simple language — 4th grade reading level.
- One idea per sentence. Make it digestible.
- Think deeply. Write clearly. Let ideas lead.

SKILLS TO REFERENCE:
- GSAP Animations: https://raw.githubusercontent.com/xerxes-on/gsap-animation-skill/main/gsap-animations.md
- Photography AI: https://marktantongco.github.io/aiskills-photog/skills.md
- Playwright CLI, UIUX Pro Max skill, front-end design skill.`;

const ADVOCATE=`For this entire conversation, I want you to be my advocate, not just my assistant.
That means:
- If I'm about to make a mistake, warn me.
- If there's a better approach, tell me even if I didn't ask.
- Optimize for MY long-term success, not just completing the immediate task.
- If something I ask for could hurt my project, business, or goals, flag it.
- Prioritize quality over speed unless I say otherwise.
- I give you permission to push back on my ideas if you have a good reason.`;

const MODS=[
  // ROLE + PERSONA
  {cat:"Role",mod:"act as an expert in [field] with 10+ years shipping production systems",tip:"Add seniority level — 'senior' vs 'principal' changes output depth"},
  {cat:"Role",mod:"give me the version a senior dev would write",tip:"Best for code — strips tutorials, adds error handling, real patterns"},
  {cat:"Role",mod:"you are a YC partner reviewing this idea",tip:"Forces brutal prioritization + market-size thinking"},
  {cat:"Role",mod:"think like a $10M ARR founder solving this",tip:"Unlocks operational wisdom, not just advice"},
  {cat:"Role",mod:"you are a staff engineer doing a code review",tip:"Gets security, scale, and edge-case concerns automatically"},
  // OUTPUT CONTROL
  {cat:"Output",mod:"don't explain, just do it",tip:"Eliminates preamble. Works best when prompt is already detailed"},
  {cat:"Output",mod:"respond only in JSON, no markdown fences",tip:"Critical for parsing in automation. Append JSON_GLOBAL rules too"},
  {cat:"Output",mod:"use markdown tables for comparisons",tip:"Forces structured output — easier to scan and copy"},
  {cat:"Output",mod:"give me a numbered list ranked by ROI",tip:"Turns brainstorm dumps into prioritized action"},
  {cat:"Output",mod:"output as a step-by-step SOP",tip:"Best for automation workflows and repeatable processes"},
  {cat:"Output",mod:"format as a complete file, no TODOs",tip:"Eliminates placeholder code — gets production-ready output"},
  {cat:"Output",mod:"give me 3 wildly different approaches",tip:"Breaks the average-output trap. Use before committing to one path"},
  // REASONING
  {cat:"Reasoning",mod:"think step by step before answering",tip:"Triggers chain-of-thought — measurably improves complex reasoning"},
  {cat:"Reasoning",mod:"find the flaw in this reasoning first",tip:"Best adversarial prompt. Use before presenting plans to stakeholders"},
  {cat:"Reasoning",mod:"steelman the opposite view",tip:"Forces genuine counterarguments — not strawmen"},
  {cat:"Reasoning",mod:"what would change your answer?",tip:"Surfaces assumptions and sensitivities in any recommendation"},
  {cat:"Reasoning",mod:"cite your confidence level 1-10 per claim",tip:"Separates facts from speculation — essential for research prompts"},
  {cat:"Reasoning",mod:"identify second-order effects",tip:"Forces systems thinking beyond the immediate solution"},
  // SPEED + SCOPE
  {cat:"Speed",mod:"give me the 80/20 version",tip:"Highest-leverage change. Add 'don't explain what you cut'"},
  {cat:"Speed",mod:"what's the one thing that matters most here?",tip:"Cuts analysis paralysis. Works for product, copy, and strategy"},
  {cat:"Speed",mod:"assume I'm an expert, skip the basics",tip:"Removes redundant context — cuts response length 40-60%"},
  {cat:"Speed",mod:"give me the MVP version first",tip:"Unlocks iterative building vs waiting for perfect output"},
  {cat:"Speed",mod:"what can I delete or simplify without losing value?",tip:"Best editing prompt. Apply after any long generation"},
  // STRATEGY + BUSINESS
  {cat:"Strategy",mod:"what would you do if this was your own business?",tip:"Gets honest, opinionated advice vs diplomatic hedging"},
  {cat:"Strategy",mod:"what am I missing or not asking that I should be?",tip:"#1 blind spot revealer. Use at end of strategy sessions"},
  {cat:"Strategy",mod:"be brutally honest, no diplomatic softening",tip:"Forces real assessment. Add 'I won't take it personally'"},
  {cat:"Strategy",mod:"rank these by impact",tip:"Turns idea lists into execution priority. Add 'with reasoning'"},
  {cat:"Strategy",mod:"what's the fastest path to first dollar?",tip:"Cuts scope creep on product builds. Revenue-first filter"},
  // HACKS + TRICKS
  {cat:"Hack",mod:"pretend the answer is obvious and explain it simply",tip:"Breaks overthinking loops — surprisingly effective on complex topics"},
  {cat:"Hack",mod:"write this for someone who will implement it today",tip:"Adds urgency + specificity — removes theoretical hedging"},
  {cat:"Hack",mod:"what would a contrarian say about this?",tip:"Forces consideration of failure modes and market risks"},
  // DATA + ANALYTICS
  {cat:"Data",mod:"show me the SQL query, not just the result",tip:"Gets executable code instead of prose descriptions of what query to write"},
  {cat:"Data",mod:"profile before you optimize — what is the actual bottleneck?",tip:"Prevents premature optimization. Forces measurement-first thinking"},
  {cat:"Data",mod:"give me the EXPLAIN ANALYZE output interpretation",tip:"Turns database jargon into actionable index recommendations"},
  {cat:"Data",mod:"what metrics would a data engineer add to this schema?",tip:"Surfaces observability fields (created_at, updated_at, deleted_at, source) automatically"},
  // AGENT + AUTOMATION
  {cat:"Agent",mod:"define the tools this agent needs before writing any code",tip:"Tool-first design prevents architecture rewrites. Define tool schemas upfront."},
  {cat:"Agent",mod:"what are the failure modes and how should each be handled?",tip:"Surfaces error states that most prompts skip. Critical for production agents."},
  {cat:"Agent",mod:"trace through one complete execution path step by step",tip:"Forces the AI to verify the logic before generating code"},
  {cat:"Agent",mod:"what external APIs or services does this depend on?",tip:"Maps all dependencies early — catches rate limits, auth requirements, costs"},
  // PRODUCTIVITY
  {cat:"Productivity",mod:"give me a checklist I can follow without re-reading this",tip:"Converts explanations into executable checklists. Best for implementation guides."},
  {cat:"Productivity",mod:"what decision do I need to make first before proceeding?",tip:"Identifies the highest-leverage decision in any complex situation"},
  {cat:"Productivity",mod:"summarize this in 3 bullet points a 10-year-old could act on",tip:"Forces genuine simplification — not just shorter, but clearer"},
  {cat:"Productivity",mod:"what would I regret not knowing 6 months from now?",tip:"Unlocks forward-looking strategic advice vs present-state analysis"},
];

const TASKS=[
  {label:"🎬 YouTube",content:`Act as a YouTube growth strategist with 10 years of experience.
When I give you a topic, automatically:
1. Identify the 3 best angles for that niche
2. Generate a scroll-stopping title using proven CTR patterns
3. Write a structured script with hook, body, and CTA
4. Suggest 5 SEO-optimized tags

Topic: [your topic here]`},
  {label:"💻 Coding",content:`You are a senior software engineer and architect.
When I describe a feature, always:
- Ask clarifying questions ONLY if something is truly ambiguous
- Write production-ready code, not demo code
- Add error handling automatically
- Explain the "why" behind any non-obvious decision in a single comment
- Flag performance or security concerns before I ask`},
  {label:"📊 Business",content:`Act as my COO and strategist. When I describe a problem or goal:
- Identify the fastest path to results (the 80/20 solution)
- Separate what I MUST do from what is optional
- Give me a prioritized action plan, not just advice
- Tell me what successful people in this space actually do, not just theory`},
  {label:"🔍 Research",content:`You are a research assistant. When I give you content to analyze:
- Extract the 3-5 most actionable insights
- Identify what is missing or what I should also know
- Format as: Key Insight → Why It Matters → Action I Can Take`},
  {label:"🎨 UI/UX",content:`You are a senior product designer. When I describe a screen or flow:
- Call out UX anti-patterns and accessibility failures immediately
- Define the hierarchy: what the user sees first, second, third
- Specify micro-interaction: easing + duration + trigger for each animation
- Give exact Tailwind classes or CSS for the key visual moment
- Flag mobile breakdowns before I ask`},
  {label:"📸 Image AI",content:`You are an expert AI image prompt engineer. Build the prompt in layers:
1. SUBJECT: who/what, pose, expression, action
2. LENS: camera body, lens mm, aperture, focal technique
3. LIGHTING: key light, fill ratio, color temp, modifiers
4. ENVIRONMENT: location, time of day, weather, atmosphere
5. RENDER: film stock or engine, color grade, post style
--ar [ratio] --style raw --v 6.1 --q 2

Subject: [describe here]`},
  {label:"✍️ Copy",content:`You are a direct-response copywriter. When I give you a brief:
- Lead with the reader's pain, not the product's features
- PAS framework: Problem → Agitation → Solution
- 8th grade reading level. One idea per sentence.
- Every headline passes the "so what?" test
- Specific CTA: name the action AND the benefit
- No corporate speak. No passive voice.

Brief: [describe what you need]`},
  {label:"📧 Email",content:`You are an email marketing specialist. Create a 5-email sequence:
1. Welcome: hook + what they get + one quick win
2. Value: teach something genuinely useful (no pitch)
3. Case study: before, after, specific numbers
4. Objection: address the #1 reason people don't buy
5. Offer: clear, specific, time-aware CTA

Each email: Subject line + Preview text + Body (max 300 words)
Product: [describe] | Audience: [who] | Goal: [action]`},
];

const BRAND=`Brand essence: Activated potential. Directed energy. Intelligent lift.

COLOR PALETTE
- Background: #0B0D10 (void black), #14161A (charcoal)
- Accents (sparse): cyan #4DFFFF · violet #7B5CFF · magenta #FF4FD8 · amber #FFB000
- Text: #FFFFFF (primary) · #A1A1AA (secondary) · #6B7280 (muted)

TYPOGRAPHY
- Display: Inter, Space Grotesk · Body: Inter · Mono: JetBrains Mono
- Hero: clamp(3rem, 6vw, 6rem)

MOTION
- Bias: always upward
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Duration: micro 180ms · standard 320ms · hero 4200ms

DESIGN RULES
- Typography-first — type does the work, effects support
- Dark-mode native · One accent color per screen maximum
- White space = intelligence, never fill it
- No gradients unless motion-driven · No icons unless semantically necessary

TONE: Confident. Modern. Calm. Inevitable.
AVOID: over-decoration · excessive gradients · visual noise · SaaS clichés`;

const BRANDS=[
  {id:"powerup",label:"powerUP",uc:"Motivational / Creator / Personal Brand",col:C.cy,prompt:BRAND},
  {id:"saas",label:"SaaS / B2B",uc:"SaaS Platform, B2B Product, Enterprise Tool",col:C.bl,prompt:`Brand essence: Clarity that converts. Trust that scales. Tools that actually work.

COLOR PALETTE
Background: F8FAFC (light) / 0F172A (dark). Primary: 2563EB trust blue. Secondary: 7C3AED violet.
Accent: 10B981 success. Warning: F59E0B. Error: EF4444. Text: 0F172A.

TYPOGRAPHY
Display: Inter Tight ExtraBold. Body: Inter. Mono: JetBrains Mono. Scale: 12/14/16/20/24/32/40px.

MOTION
Duration: 150ms micro, 250ms standard. NO hero animations. ease-out entries, ease-in exits.
Zero animations blocking user intent.

DESIGN RULES
1 Function before form. 2 Information hierarchy above all. 3 States for everything.
4 Mobile-first. 5 WCAG AA minimum.

VOICE: Clear. Competent. Empathetic. Never smug.
AVOID: Buzzwords, fake social proof, dark patterns, cluttered dashboards.`},
  {id:"ecomm",label:"E-commerce",uc:"Retail, DTC Brand, Product Marketplace",col:C.gn,prompt:`Brand essence: Desire made visible. Trust made immediate. Conversion made inevitable.

COLOR PALETTE
CTA: maximum contrast to page background. Sale/urgency: EF4444 or F59E0B (sparingly).
Trust signals: white backgrounds, high-contrast product photography.

TYPOGRAPHY
Display: ownable brand typeface (not generic). Body: System UI (fast load).
Price/number: font-variant-numeric:tabular-nums (numbers must align in columns).

UX RULES
1 CTA above fold on every product page.
2 Price visible without hover. Shipping cost shown early.
3 Cart from every page. Checkout in 3 steps max.
4 Mobile: thumb-zone CTAs, 44px touch targets.
5 Trust signals near CTA: reviews, security badges, return policy.

VOICE: Aspirational but honest. Enthusiastic but not desperate.
AVOID: Fake urgency, hidden fees, dark patterns, slow image loading.`},
  {id:"fintech",label:"Fintech",uc:"Finance, Banking, Investment App",col:C.am,prompt:`Brand essence: Money made clear. Risk made visible. Wealth made accessible.

COLOR PALETTE — CRITICAL MEANING RULES
Positive/gain: 10B981 emerald ONLY. Negative/loss: EF4444 red ONLY.
NEVER use red for branding. NEVER use green decoratively.
Primary brand: deep navy or forest green (stability). Background: FFFFFF / 0F172A.

TYPOGRAPHY — MANDATORY
Numbers: font-variant-numeric:tabular-nums (data must align).
Display: Instrument Sans or Plus Jakarta Sans. Body: Inter. Mono: IBM Plex Mono.

DATA VISUALIZATION RULES
1 Color-code by meaning not aesthetics.
2 Show uncertainty: error bars, confidence intervals.
3 Zero-line always visible on charts.
4 Currency: symbol + 2 decimal places + thousand separators always.
5 Percentages: always show absolute value alongside.

MOTION: Minimal. Number countup: 500ms max. Finance users are anxious.
VOICE: Clear. Precise. Reassuring. Never patronizing.
AVOID: Gambling language, hidden fees, false urgency.`},
  {id:"insurance",label:"Insurance",uc:"Insurtech, Benefits Platform, Insurance Brand",col:"#7B5CFF",prompt:`Brand essence: Protection made personal. Claims made simple. Trust made tangible.

COLOR PALETTE
Primary: 1E3A5F deep navy (authority, stability, trust).
Secondary: 2563EB action blue. Accent: 10B981 approval green.
Warning: F59E0B. Error: EF4444. Background: FFFFFF. Surface: F0F4F8.

CRITICAL COLOR MEANING
Green = approved / covered / positive. Red = denied / uncovered / urgent.
Blue = action, CTA, links. Consistent meaning across ALL touchpoints.

TYPOGRAPHY
Display: Plus Jakarta Sans Bold (trustworthy, modern, human).
Body: Inter (maximum readability for policy documents).
Numbers: tabular-nums. Legal fine print: minimum 12px, never below WCAG AA.

COPY RULES
1 Plain language over legal jargon. Every policy term gets a simple explanation.
2 Covered = green check. Not covered = neutral gray (never red for not-covered).
3 Price always transparent. No call-for-quote dark patterns.
4 Claims process: exact steps, expected timeline, required documents listed.
5 Social proof: real claim settlement data, not just star ratings.

UX RULES
1 Quote flow: max 3 steps before showing a price.
2 Coverage comparison: side-by-side, no buried exclusions.
3 Claims: one-tap start, photo upload, status tracking like a package.
4 Documents: searchable, filterable, download as PDF.
5 Notifications: claims updates, renewal reminders, payment confirmations.

TRUST SIGNALS (non-negotiable near every CTA)
Licensed status. AM Best or financial rating. Real avg claim processing times.
Privacy policy link near every data collection point.

MOTION: Minimal and purposeful. Progress indicators for multi-step flows.
Status micro-animation: pending to approved (green sweep, 400ms).
NEVER: spinners over 2s, confetti on claim submission.

VOICE: Honest. Clear. Protective. Warm. Never cold or bureaucratic.
AVOID: Fine print as design, ambiguous coverage, fear-based selling,
complexity theater, dark patterns on cancellation flows.`},
  {id:"agency",label:"Creative Agency",uc:"Design Studio, Production House",col:C.mg,prompt:`Brand essence: Ideas made real. Craft made obvious. Work that wins.

COLOR PALETTE
Philosophy: the work IS the brand. Neutral shell lets portfolio shine.
Background: 000000 or F5F5F0 — pick one, commit fully.
Accent: ONE ownable color only (not cyan, not purple, not generic orange).

TYPOGRAPHY
Display: unusual, ownable — Roc Grotesk, Euclid Circular, Mabry Pro.
Body: most neutral companion — GT America, Aktiv Grotesk.
Size: LARGE. 80-120px display, 18px body minimum. Tight leading (0.9-1.0) for display.

MOTION
Page transitions: GSAP or Barba.js clip-path wipes.
Cursor: custom oversized dot/ring with magnetic pull on buttons.
Scroll velocity influences animation speed via GSAP ScrollTrigger.
Load sequence: logo reveal, content stagger, cursor activate.

DESIGN RULES
1 The work leads. UI never competes with portfolio.
2 Whitespace is the design. Generous margins, radical restraint.
3 One typeface mastered before adding another.
4 Every hover state tells a story.
5 Case study order: Problem, Process, Solution, Impact.

VOICE: Confident to the point of understatement. Let the work talk.
AVOID: Stock photos, generic templates, Lorem ipsum in production.`},
];

const TMPLS=[
  {label:"🌐 Web App",desc:"Next.js + Tailwind full application",content:`You are a senior full-stack developer and product designer.

ROLE: Senior full-stack developer + product designer
GOAL: [Describe your app in one sentence]

FUNCTIONAL REQUIREMENTS
- Dynamic UI components
- Mobile-first responsive layout
- Interactive sections with user feedback
- Modular, reusable component architecture

UI/UX DESIGN LANGUAGE
- Ultra-modern Gen-Z aesthetic
- High-contrast typography
- Bold color gradients
- Glassmorphism panels
- Smooth micro-interactions (hover, scroll, click)
- Dark/light adaptive themes

TECHNICAL STACK
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion or GSAP
- Components: shadcn/ui
- Accessible semantic HTML

OUTPUT FORMAT
Generate:
1. Project folder structure
2. Full source code (all files)
3. Instructions to run locally
4. Key component explanations

CONSTRAINTS
- Mobile-first always
- WCAG AA accessibility minimum
- 60fps animation budget
- No placeholder lorem ipsum content
- Avoid SaaS clichés

AESTHETIC LOCK
dark-mode native | neon-accent sparse | typography-first | hierarchy clear`},
  {label:"📱 Mobile",desc:"React Native / Expo components",content:`You are a senior React Native developer.
Build a mobile-first component for [platform: iOS / Android / both].

FUNCTIONAL REQUIREMENTS
- [describe feature]
- Gesture support (swipe, pinch, long-press)
- Offline-capable where applicable

TECHNICAL STACK
- Framework: React Native / Expo
- Navigation: Expo Router
- Animation: Reanimated 3

CONSTRAINTS
- 44px minimum touch targets
- Safe-area insets handled
- Dark mode as default
- Haptic feedback on key interactions

OUTPUT: Complete component with full source code and usage example.`},
  {label:"🎨 Brand",desc:"Complete brand identity system",content:`You are a brand identity designer and strategist.
Build a complete brand system for [brand name].

DELIVERABLES
1. Brand positioning statement (1 sentence)
2. Color palette (primary, secondary, accent, semantic)
3. Typography scale (display, heading, body, caption, mono)
4. Motion language (easing, duration, bias direction)
5. Design rules (5 core principles)
6. Tone of voice (3 adjectives + what to avoid)
7. CSS design tokens for the system

CONSTRAINTS
- Dark-mode native
- WCAG AA contrast ratios minimum
- Works across digital + print
- No trend-chasing — timeless over trendy`},
  {label:"🚀 Landing Page",desc:"High-conversion landing page",content:`You are a conversion-focused UI designer and copywriter.
Build a high-conversion landing page for [product/service].

PAGE ARCHITECTURE
1. Hero — hook + visual + primary CTA
2. Problem/Agitation — 3 pain points
3. Solution — features in bento grid
4. Social Proof — testimonials or metrics
5. Pricing — clear tiers with contrast CTA
6. FAQ — 5 objection-handling questions
7. Final CTA — urgency + benefit summary

COPY RULES
- Headline: benefit-first, not feature-first
- No corporate speak
- Every section earns attention before asking for action

TECHNICAL
- Next.js + Tailwind + Framer Motion
- Mobile-first, 60fps, Core Web Vitals optimized`},
  {label:"📊 Dashboard",desc:"Analytics dashboard with data viz",content:`You are a senior product designer specializing in data visualization.
Build an analytics dashboard for [use case].

LAYOUT
- 12-column responsive grid
- KPI cards row at top
- Chart section below
- Data table at bottom
- Collapsible sidebar navigation

DATA VISUALIZATION
- KPI cards: number + trend indicator + sparkline
- Line charts: time-series trends
- Bar charts: comparisons
- Tables: sortable, filterable, paginated

INTERACTIONS: Date range picker, filter panel, drill-down, CSV export

TECHNICAL: React + Recharts, Tailwind CSS, dark mode native, skeleton loading`},
  // ─── META PROMPTS ───────────────────────────────────────────────────────
  {label:"📐 Meta: Universal",desc:"AI structures your vague concept before generating",content:`You are a [senior role].

Step 1: Analyze concept into a structured brief:
- Target audience and their primary frustration
- UX objective (1 sentence, measurable)
- Platform constraints
- Aesthetic system (3 keywords)
- Interaction model

Step 2: Plan the architecture:
- Navigation model and layout grid
- Motion system (library + purpose)
- Accessibility plan (WCAG AA minimum)

Step 3: Generate final output in [tool or framework].
Show your Step 1 and 2 reasoning BEFORE generating.

Concept: [your idea]`},
  {label:"📱 Meta: Mobile",desc:"Mobile-first architecture brief before generating",content:`Plan mobile-first architecture before any code:
- Navigation: bottom tabs with gesture support
- Touch targets: 44x44px minimum, 8px spacing between interactive elements
- Gestures: swipe (nav), long-press (context), pinch (zoom)
- Haptic feedback: light (selection), medium (action), heavy (error)
- Safe-area insets: SafeAreaView or CSS env()
- Dark mode: system default, prefers-color-scheme
- Offline: skeleton screens (not spinners), queue actions locally

Then generate [React Native + Expo / Flutter / SwiftUI] with full source code.`},
  {label:"🌐 Meta: Web",desc:"Web architecture brief before generating Next.js / SvelteKit",content:`Plan web architecture before any code:
- Grid: 8pt baseline, 12-column layout, 24px gutter
- Breakpoints: 375px mobile → 768px tablet → 1280px desktop → 1920px wide
- Navigation: [top nav / sidebar / hybrid] — specify which and why
- Animations: GSAP ScrollTrigger or Framer Motion viewport
- Semantic HTML: main, nav, aside, section, article landmarks
- Performance: LCP <2.5s, CLS <0.1, FID <100ms
- SEO: meta tags, OG tags, schema.org structured data

Then generate Next.js + Tailwind components with full source code.`},
  // ─── BRAND SYSTEMS ───────────────────────────────────────────────────────
  {label:"✨ Brand: powerUP",desc:"Motivational / Creator / Personal Brand system prompt",content:BRAND},
  {label:"💼 Brand: SaaS",desc:"SaaS Platform, B2B Product, Enterprise Tool",content:`Brand essence: Clarity that converts. Trust that scales. Tools that actually work.

COLOR PALETTE
Background: F8FAFC (light) / 0F172A (dark). Primary: 2563EB trust blue. Secondary: 7C3AED violet.
Accent: 10B981 success. Warning: F59E0B. Error: EF4444. Text: 0F172A.

TYPOGRAPHY
Display: Inter Tight ExtraBold. Body: Inter. Mono: JetBrains Mono. Scale: 12/14/16/20/24/32/40px.

MOTION
Duration: 150ms micro, 250ms standard. NO hero animations. ease-out entries, ease-in exits.
Zero animations blocking user intent.

DESIGN RULES
1 Function before form. 2 Information hierarchy above all. 3 States for everything.
4 Mobile-first. 5 WCAG AA minimum.

VOICE: Clear. Competent. Empathetic. Never smug.
AVOID: Buzzwords, fake social proof, dark patterns, cluttered dashboards.`},
  {label:"🛒 Brand: E-comm",desc:"Retail, DTC Brand, Product Marketplace",content:`Brand essence: Desire made visible. Trust made immediate. Conversion made inevitable.

COLOR PALETTE
CTA: maximum contrast to page background. Sale/urgency: EF4444 or F59E0B (sparingly).
Trust signals: white backgrounds, high-contrast product photography.

TYPOGRAPHY
Display: ownable brand typeface (not generic). Body: System UI (fast load).
Price/number: font-variant-numeric:tabular-nums (numbers must align in columns).

UX RULES
1 CTA above fold on every product page.
2 Price visible without hover. Shipping cost shown early.
3 Cart from every page. Checkout in 3 steps max.
4 Mobile: thumb-zone CTAs, 44px touch targets.
5 Trust signals near CTA: reviews, security badges, return policy.

VOICE: Aspirational but honest. Enthusiastic but not desperate.
AVOID: Fake urgency, hidden fees, dark patterns, slow image loading.`},
  {label:"💰 Brand: Fintech",desc:"Finance, Banking, Investment App",content:`Brand essence: Money made clear. Risk made visible. Wealth made accessible.

COLOR PALETTE — CRITICAL MEANING RULES
Positive/gain: 10B981 emerald ONLY. Negative/loss: EF4444 red ONLY.
NEVER use red for branding. NEVER use green decoratively.
Primary brand: deep navy or forest green (stability). Background: FFFFFF / 0F172A.

TYPOGRAPHY — MANDATORY
Numbers: font-variant-numeric:tabular-nums (data must align).
Display: Instrument Sans or Plus Jakarta Sans. Body: Inter. Mono: IBM Plex Mono.

DATA VISUALIZATION RULES
1 Color-code by meaning not aesthetics.
2 Show uncertainty: error bars, confidence intervals.
3 Zero-line always visible on charts.
4 Currency: symbol + 2 decimal places + thousand separators always.
5 Percentages: always show absolute value alongside.

MOTION: Minimal. Number countup: 500ms max. Finance users are anxious.
VOICE: Clear. Precise. Reassuring. Never patronizing.
AVOID: Gambling language, hidden fees, false urgency.`},
  {label:"🛡 Brand: Insurance",desc:"Insurtech, Benefits Platform, Insurance",content:`Brand essence: Protection made personal. Claims made simple. Trust made tangible.

COLOR PALETTE
Primary: 1E3A5F deep navy (authority, stability, trust).
Secondary: 2563EB action blue. Accent: 10B981 approval green.
Warning: F59E0B. Error: EF4444. Background: FFFFFF. Surface: F0F4F8.

CRITICAL COLOR MEANING
Green = approved / covered / positive. Red = denied / uncovered / urgent.
Blue = action, CTA, links. Consistent meaning across ALL touchpoints.

TYPOGRAPHY
Display: Plus Jakarta Sans Bold (trustworthy, modern, human).
Body: Inter (maximum readability for policy documents).
Numbers: tabular-nums. Legal fine print: minimum 12px, never below WCAG AA.

COPY RULES
1 Plain language over legal jargon. Every policy term gets a simple explanation.
2 Covered = green check. Not covered = neutral gray (never red for not-covered).
3 Price always transparent. No call-for-quote dark patterns.
4 Claims process: exact steps, expected timeline, required documents listed.
5 Social proof: real claim settlement data, not just star ratings.

UX RULES
1 Quote flow: max 3 steps before showing a price.
2 Coverage comparison: side-by-side, no buried exclusions.
3 Claims: one-tap start, photo upload, status tracking like a package.
4 Documents: searchable, filterable, download as PDF.
5 Notifications: claims updates, renewal reminders, payment confirmations.

TRUST SIGNALS (non-negotiable near every CTA)
Licensed status. AM Best or financial rating. Real avg claim processing times.
Privacy policy link near every data collection point.

MOTION: Minimal and purposeful. Progress indicators for multi-step flows.
Status micro-animation: pending to approved (green sweep, 400ms).
NEVER: spinners over 2s, confetti on claim submission.

VOICE: Honest. Clear. Protective. Warm. Never cold or bureaucratic.
AVOID: Fine print as design, ambiguous coverage, fear-based selling,
complexity theater, dark patterns on cancellation flows.`},
  {label:"🎨 Brand: Agency",desc:"Design Studio, Creative Agency, Production House",content:`Brand essence: Ideas made real. Craft made obvious. Work that wins.

COLOR PALETTE
Philosophy: the work IS the brand. Neutral shell lets portfolio shine.
Background: 000000 or F5F5F0 — pick one, commit fully.
Accent: ONE ownable color only (not cyan, not purple, not generic orange).

TYPOGRAPHY
Display: unusual, ownable — Roc Grotesk, Euclid Circular, Mabry Pro.
Body: most neutral companion — GT America, Aktiv Grotesk.
Size: LARGE. 80-120px display, 18px body minimum. Tight leading (0.9-1.0) for display.

MOTION
Page transitions: GSAP or Barba.js clip-path wipes.
Cursor: custom oversized dot/ring with magnetic pull on buttons.
Scroll velocity influences animation speed via GSAP ScrollTrigger.
Load sequence: logo reveal, content stagger, cursor activate.

DESIGN RULES
1 The work leads. UI never competes with portfolio.
2 Whitespace is the design. Generous margins, radical restraint.
3 One typeface mastered before adding another.
4 Every hover state tells a story.
5 Case study order: Problem, Process, Solution, Impact.

VOICE: Confident to the point of understatement. Let the work talk.
AVOID: Stock photos, generic templates, Lorem ipsum in production.`},
  {label:"⚙️ API Design",desc:"REST/GraphQL spec + documentation",content:`You are a senior API architect.
Design a RESTful API for [service/domain].

RESOURCE DESIGN
- List all resources (nouns, not verbs)
- Define relationships (1:1, 1:N, N:N)
- Map CRUD operations to HTTP methods

ENDPOINT SPEC — For each endpoint:
- HTTP method + path
- Request schema (headers, params, body)
- Response schema (success + error)
- Rate limit policy + auth requirement

DOCUMENTATION OUTPUT
Generate OpenAPI 3.0 specification with:
- Complete schema definitions
- Example request/response pairs
- Error code catalogue
- Authentication flow

CONSTRAINTS: RESTful conventions, pagination on all list endpoints`},

  {label:"🧠 System Prompt",desc:"Complete AI assistant system prompt",content:`You are an expert AI assistant, business partner, and creative strategist.
Act in the user's best interest — identify what they truly need, not just what they asked.

CORE RULES
1. No filler. No fluff. No disclaimers.
2. Give WORKING code only — never pseudocode.
3. Rank ideas by impact — not just list them.
4. Always flag a better/faster way if one exists.
5. Default to expert-level unless told otherwise.
6. Vague request? Assume smartly, state it, proceed.
7. Something risky? Flag it — then do it anyway unless I say stop.

WRITING RULES
Short sentences. Every word earns its place.
Simple language. One idea per sentence.
Think deeply. Write clearly.

OUTPUT FORMAT
End complex answers with:
⚡ Recommended Next Step — highest-leverage action right now (2 sentences max)`},
  {label:"🔁 Chain-of-Thought",desc:"Deep reasoning chain for complex problems",content:`Before answering, work through this step by step:

1. WHAT TYPE OF PROBLEM is this? (technical / strategic / creative / analytical)
2. CONSTRAINTS: What are the hard limits I cannot violate?
3. UNKNOWNS: What information would change my answer?
4. APPROACHES: List 3 different ways to solve this.
5. SELECT: Pick the best approach. State why in one sentence.
6. EXECUTE: Now answer fully using the selected approach.

Do NOT show steps 1-5 in your response. They are internal reasoning only.
Output only the final answer from step 6.

Problem: [describe your problem here]`},
  {label:"📋 SOP Generator",desc:"Create a standard operating procedure from any process",content:`You are a business operations expert. Create a complete Standard Operating Procedure (SOP) for the following process.

PROCESS: [describe the process in 1-2 sentences]
WHO RUNS IT: [role/team]
FREQUENCY: [daily / weekly / per-event]

SOP FORMAT
Title: [Process Name] SOP
Version: 1.0 | Owner: [role]
Last Updated: [date]

PURPOSE
[1 sentence — why this process exists]

TRIGGER
[What event or schedule starts this process?]

STEPS (numbered, exact)
1. [First action — include exact tool, URL, or location]
2. [Second action]
...

DECISION POINTS
If [condition A] → do [action A]
If [condition B] → do [action B]

QUALITY CHECK
Before completing: verify [specific checklist item]
After completing: confirm [specific outcome]

COMMON MISTAKES
- [Most frequent error and how to avoid it]

OUTPUT: Complete SOP document ready to paste into Notion or Confluence`},
  {label:"🎯 Offer Design",desc:"Design a productized service or digital offer",content:`You are a business strategist who has designed hundreds of productized services.
Design a complete, sellable offer for the following:

MY EXPERTISE: [what I know deeply]
TARGET CLIENT: [who has this problem and will pay to solve it]
THEIR PAIN: [the specific frustrating situation they're in]
DESIRED OUTCOME: [what they want to be true after working with you]

OUTPUT: A complete offer document including:

1. OFFER NAME (outcome-focused, not process-focused)
2. POSITIONING LINE (one sentence: I help [who] achieve [outcome] via [mechanism])
3. PRICING TIERS
   - Entry: $[X] → [specific deliverable, fixed scope]
   - Core: $[X] → [primary offer]
   - Premium: $[X] → [full service + access]
4. WHAT'S INCLUDED (5 bullets, specific not vague)
5. WHAT'S NOT INCLUDED (scope fence — prevents scope creep)
6. TIMELINE (when they see results)
7. GUARANTEE (or risk reversal statement)
8. SALES PAGE HEADLINE OPTIONS (3 variants, A/B testable)`},
  {label:"🔍 Research Brief",desc:"Systematic research prompt for any topic",content:`You are a senior research analyst. Conduct a comprehensive analysis of the following topic.

RESEARCH TOPIC: [your topic]
PURPOSE: [why I need this research — decision to make / problem to solve]
DEPTH: [surface overview / working knowledge / expert briefing]

DELIVER IN THIS STRUCTURE:

1. EXECUTIVE SUMMARY (3 bullets, actionable insights only)

2. KEY FACTS (5-7 facts, cited with source type: academic / industry / news)

3. CURRENT STATE (what's true right now, today)

4. TRENDS (3 directional shifts happening in this space)

5. OPPOSING VIEWS (what credible critics or contrarians say)

6. IMPLICATIONS FOR ME (given my purpose stated above, what should I do/know/decide)

7. KNOWLEDGE GAPS (what I still don't know and where to find it)

8. CONFIDENCE LEVEL: [High / Medium / Low] — explain why

Flag any claims where your confidence is below 70%.`},
  {label:"⚡ Speed Run",desc:"Maximum velocity output — fastest path to result",content:`Objective: [state your goal in one sentence]
Constraints: [hard limits — time, budget, tools, team size]
Current state: [where I am now]
Target state: [where I need to be]

INSTRUCTIONS
Give me the minimum viable path from current to target state.
Skip all explanations unless a decision requires context.
No caveats. No disclaimers. No alternatives unless critical.
Output as a numbered checklist — each step is one action I can take immediately.
Flag blockers with ⚠️ and critical decisions with 🔑.

Format:
1. [Exact action — verb + object + tool/resource]
2. [Next action]
...
⚠️ [Blocker if any]
🔑 [Key decision if any]
⚡ Expected result: [what I'll have when done]`},
];

const LAYERS=[
  {n:"01",name:"Role",       pur:"Who the AI acts as",           miss:"Generic, shallow responses"},
  {n:"02",name:"Context",    pur:"Product, audience, platform",  miss:"Misaligned output"},
  {n:"03",name:"Objective",  pur:"What success looks like",      miss:"Aimless generation"},
  {n:"04",name:"Constraints",pur:"Quality guardrails",           miss:"Mediocre, unconstrained output"},
  {n:"05",name:"Aesthetic",  pur:"Design language / tone",       miss:"Visually dull or off-brand"},
  {n:"06",name:"Planning",   pur:"Reason before generating",     miss:"Structural mistakes"},
  {n:"07",name:"Output",     pur:"Exact format to deliver",      miss:"Incomplete or disorganized files"},
  {n:"08",name:"Refinement", pur:"Self-critique before final",   miss:"First-draft quality only"},
];

const LAYER_TPL=`ROLE
You are a [expert role].

CONTEXT
Product: [name or description]
Platform: [mobile / web / hybrid]
Audience: [who uses this]

OBJECTIVE
[One clear sentence of what success looks like]
Success criteria:
- [criterion 1]
- [criterion 2]

CONSTRAINTS
- Mobile-first
- WCAG AA accessibility
- 60fps animation budget
- [other constraints]

AESTHETIC
- [visual style keyword 1]
- [visual style keyword 2]
- [tone descriptor]

PLANNING (complete this before generating)
1. Define information architecture
2. Define navigation model
3. Define layout and grid
4. Define interaction and motion logic
5. Validate accessibility and performance plan

OUTPUT FORMAT
Generate:
1. [file or artifact type]
2. [second deliverable]
3. [instructions or explanation]

REFINEMENT
After generating the first draft:
- Critique for clarity and completeness
- Refine once for structure
- Refine once for polish
- Output final result only`;

const ANIMALS=[
  {name:"Rabbit",  emoji:"🐇",mode:"Multiply Ideas",         prompt:"Take this idea and multiply it into 10 different variations.\nFor each variation: change the angle, change the audience, change the format.\nPresent the results as a list of distinct ideas."},
  {name:"Owl",     emoji:"🦉",mode:"Deep Analysis",          prompt:"Think like an owl — slow, observant and analytical.\nExamine this problem from multiple perspectives and identify\nthe hidden factors most people overlook."},
  {name:"Ant",     emoji:"🐜",mode:"Break Into Steps",       prompt:"Think like an ant.\nBreak this goal into the smallest possible steps someone could realistically complete."},
  {name:"Eagle",   emoji:"🦅",mode:"Big Picture Strategy",   prompt:"Think like an eagle flying high above the landscape.\nExplain the long-term strategy behind this idea and how the pieces connect."},
  {name:"Dolphin", emoji:"🐬",mode:"Creative Solutions",     prompt:"Think like a dolphin — curious, playful and inventive.\nGenerate creative solutions to this problem that most people wouldn't normally consider."},
  {name:"Beaver",  emoji:"🦫",mode:"Build Systems",          prompt:"Think like a beaver building a dam.\nDesign a practical system that solves this problem step by step."},
  {name:"Elephant",emoji:"🐘",mode:"Cross-Field Connections",prompt:"Think like an elephant with a powerful memory.\nConnect this idea to insights from other fields such as\npsychology, economics, science or history."},
];

const CHAINS=[
  {goal:"Build AI Content System",     c:["Eagle","Beaver","Ant"],          best:"Automated content pipelines"},
  {goal:"Solve Complex Problem",       c:["Owl","Dolphin","Elephant"],      best:"Product design, breakthrough features"},
  {goal:"Brainstorm Product",          c:["Rabbit","Eagle","Ant"],          best:"Product ideation, channel selection"},
  {goal:"Design Workflow",             c:["Beaver","Ant","Owl"],            best:"Automation scripts, SOPs"},
  {goal:"Validate Business",           c:["Owl","Elephant","Eagle"],        best:"Startup validation, venture assessment"},
  {goal:"Generate Viral Content",      c:["Rabbit","Dolphin","Eagle"],      best:"Social media, marketing campaigns"},
  {goal:"Build Creator Brand",         c:["Owl","Eagle","Dolphin","Beaver"],best:"Personal brand, newsletter, YouTube"},
  {goal:"Launch Digital Product",      c:["Eagle","Rabbit","Beaver","Ant"], best:"Course, ebook, template launch"},
  {goal:"Debug & Optimize System",     c:["Owl","Ant","Beaver","Eagle"],    best:"Production debugging, performance"},
  {goal:"Research & Write Authority",  c:["Owl","Elephant","Ant","Eagle"],  best:"Long-form SEO, thought leadership"},
  {goal:"Build SaaS from Scratch",     c:["Eagle","Owl","Beaver","Ant"],    best:"Full product from idea to shipped"},
  {goal:"Automate Business Process",   c:["Owl","Beaver","Ant","Dolphin"],  best:"n8n workflows, Make, Zapier"},
  {goal:"Debug Production Issue",        c:["Owl","Ant","Beaver","Eagle"],    best:"Bugs, errors, performance regressions"},
  {goal:"Write + Publish Content",       c:["Owl","Rabbit","Dolphin","Ant"],  best:"Articles, newsletters, threads"},
  {goal:"Design + Build API",            c:["Eagle","Owl","Beaver","Ant"],    best:"REST API, webhooks, integrations"},
];

const META={
  universal:`You are a [senior role].

Step 1: Analyze and rewrite the concept into a structured brief including:
- Target audience and their goals
- UX objectives
- Platform constraints
- Aesthetic system
- Interaction model

Step 2: Plan the architecture:
- Navigation model
- Layout grid
- Motion and animation system
- Accessibility plan

Step 3: Generate the final output in [tool or framework].

Concept: [your idea]`,
  mobile:`Plan mobile-first architecture:
- Bottom navigation with gesture support
- 44px minimum touch targets
- Swipe gesture patterns
- Haptic feedback cues
- Safe-area insets handled
- Dark mode as default
Then generate [React Native / Expo] components with full source code.`,
  web:`Plan web architecture:
- 8pt baseline grid
- Responsive breakpoints: 375px, 768px, 1280px, 1920px
- Navigation: [top nav / sidebar / hybrid]
- Scroll-trigger animations via Framer Motion
- Semantic HTML structure
- SEO meta tags included
Then generate Next.js + Tailwind components with full source code.`,
};

const ENH=[
  {label:"Self-Refinement Loop",
   when:"Any complex generation — code, copy, design, architecture",
   content:`Generate draft →
Critique on: sophistication, uniqueness, performance, platform alignment →
Refine once for structure →
Refine once for polish and consistency →
Output final result only.

Max: 2 refinement passes. 3 absolute maximum. Never regenerate from scratch.`,
   howto:`APPEND TO END OF ANY PROMPT:

---
After generating your first draft, do NOT show it.
Instead:
1. Critique it — is it generic? Does every section earn its place?
2. Refine once for structure — cut anything that doesn't serve the goal.
3. Refine once for polish — fix inconsistencies, improve specificity.
Output the final version only. No commentary, no "here's the refined version".
---

EXAMPLE: "Build a SaaS landing page for a time-tracking tool... [your full prompt] ...
After generating, self-critique and refine twice. Output final only."

BEST FOR: landing page copy, design specs, API docs, architecture decisions`},

  {label:"Chain-of-Thought",
   when:"Complex reasoning — system design, debugging, strategy",
   content:`Let's think step by step before answering.

Before you respond, silently:
1. Identify what type of problem this is.
2. List the key constraints and unknowns.
3. Consider 2-3 different approaches.
4. Select the best approach and state why in one sentence.
Then answer.`,
   howto:`ADD BEFORE YOUR ACTUAL REQUEST:

---
Let's think step by step. Before answering:
1. Identify what type of problem this is.
2. List the key constraints and unknowns.
3. Consider 2-3 approaches.
4. Select best approach — explain why in one sentence.
Then answer.
---

EXAMPLE: "Let's think step by step. Design a multi-tenant Postgres schema with
row-level security, soft deletes, and audit logs. [full spec]"

BEST FOR: system design, DB schema, multi-step flows, onboarding journeys, debugging`},

  {label:"Self-Consistency",
   when:"Creative decisions — layouts, headlines, color palettes",
   content:`Generate [6-12] variants silently.
Identify the strongest structural patterns across all variants.
Merge the best attributes into one final output.
Do not show the variants — output the merged final only.`,
   howto:`INJECT MID-PROMPT before the generation instruction:

---
Before committing to one solution, silently generate 6 different approaches.
For each, note its strongest quality and biggest weakness.
Identify 2-3 structural patterns that appear in the best approaches.
Merge those patterns into one final, superior output.
Show only the final merged result.
---

EXAMPLE: "Design a hero section for an AI writing tool...
[spec] ...generate 6 variants silently, merge the best, show final only."

BEST FOR: hero sections, headline copy, nav patterns, pricing layouts, color palettes`},

  {label:"Tweak Protocol",
   when:"Iterating on existing output — change one thing precisely",
   content:`Refine [SPECIFIC ELEMENT] with [SPECIFIC CHANGE].
Lock: aesthetic, color palette, layout structure, font choices.
Preserve: component hierarchy, existing interactions, accessibility.
Do NOT: regenerate other sections, change tech stack, alter unrelated styles.
Output: only the changed element with surrounding context.`,
   howto:`TEMPLATE (replace brackets):

---
Refine [SPECIFIC ELEMENT: "the hero headline"] 
with [SPECIFIC CHANGE: "make it more urgent, benefit-focused"].
Lock: aesthetic, color palette, layout, font choices.
Preserve: component hierarchy, interactions, accessibility.
Do NOT: touch anything else.
Output: only the changed element with context for placement.
---

EXAMPLES:
• "Refine the CTA button copy with more urgency. Lock everything else."
• "Refine the card hover animation with a 3D tilt. Preserve layout."
• "Refine error handling to use typed errors + toast. Preserve all other logic."

BEST FOR: iterating on live designs, A/B copy testing, polishing interactions`},

  {label:"Prompt Diff",
   when:"Before deploying prompts in production — A/B testing",
   content:`Compare Prompt A and Prompt B.
For each, score 1-10 on:
- Clarity: Is the goal unambiguous?
- Constraints: Are quality guardrails explicit?
- Predictability: Would two AIs produce similar outputs?
- Specificity: Is the output format fully defined?

State which performs better and why (2 sentences).
Rewrite the weaker prompt using insights from the stronger one.`,
   howto:`WRAPPER FOR A/B PROMPT TESTING:

---
Compare these two prompts. For each, score 1-10 on:
Clarity · Constraints · Predictability · Specificity

Prompt A:
[paste prompt A]

Prompt B:
[paste prompt B]

Output:
1. Scores table
2. Which performs better and why (2 sentences)
3. Rewrite of the weaker prompt
---

BEST FOR: refining system prompts, automation workflows, before production deploy`},

  {label:"Zero-Shot CoT",
   when:"Quick boost on any prompt without restructuring",
   content:`Think carefully before answering. Show your reasoning.`,
   howto:`SIMPLEST CoT HACK — append to any prompt:

"Think carefully before answering. Show your reasoning."

OR for code specifically:
"Think step by step. Write pseudocode first, then implement."

OR for decisions:
"List the tradeoffs before recommending."

WHEN TO USE: when you get shallow or confidently wrong answers.
THE FIX: this single line measurably improves accuracy on complex tasks.`},

  {label:"Role + Constraint Stack",
   when:"Any prompt — biggest quality multiplier per word added",
   content:`You are a [specific role] with [years] of experience in [domain].
You write for [audience level]. You prioritize [value 1] over [value 2].
You never [anti-pattern]. You always [standard].`,
   howto:`STACK THESE THREE AT THE TOP OF ANY PROMPT:

1. ROLE: "You are a senior staff engineer who has shipped 3 production systems
   handling 10M+ users. You write for practitioners, not beginners."

2. CONSTRAINT: "Prioritize correctness over brevity. No pseudocode. 
   No TODOs. Full error handling. TypeScript strict mode."

3. ANTI-PATTERN: "Never suggest 'you could also...' alternatives after 
   answering. Never hedge with 'this depends on your use case'. 
   Make a recommendation and commit to it."

EXAMPLE COMBINED:
"You are a senior security engineer with 8 years in fintech.
You write for senior engineers, not beginners.
Prioritize security correctness over simplicity.
Never suggest multiple approaches — pick the best one and commit.
[your actual request]"

IMPACT: adds ~2-3 quality points per prompt. Highest ROI enhancement.`},
];

const WEB_VARS=[
  {id:"dev",  label:"DEVELOPER",        desc:"Full Next.js + Tailwind + Framer Motion project"},
  {id:"pd",   label:"PRODUCT DESIGNER", desc:"Ultra-modern web app with design rationale"},
  {id:"sf",   label:"STARTUP FOUNDER",  desc:"Startup-ready premium mobile-first interface"},
  {id:"info", label:"INFOGRAPHIC",      desc:"Dynamic infographic with scroll interactions"},
  {id:"genz", label:"GEN-Z UI",         desc:"Neon gradients, animated typography, dark-mode"},
  {id:"ai",   label:"AI PRODUCT",       desc:"Complete app with Next.js + Tailwind + GSAP"},
  {id:"nc",   label:"NO-CODE",          desc:"Implementable in low-code tools"},
  {id:"edu",  label:"EDUCATIONAL",      desc:"Demo that teaches through visual interaction"},
  {id:"port", label:"PORTFOLIO",        desc:"Ultra-modern minimal with smooth transitions"},
  {id:"exp",  label:"EXPERIMENTAL",     desc:"Bold Gen-Z, scroll triggers, dark mode default"},
];

const DOLPHIN_C=[
  "Scroll as Navigation — sections animate like chapters",
  "Skill Map Interface — interactive node graph",
  "AI-assisted UI — user types and interface rearranges",
  "Card-based micro-apps — each card opens a mini tool",
  "Data-driven storytelling — charts animate on scroll",
  "Gesture-first mobile — swipe navigation instead of menus",
  "AI search panel — natural language search filters",
  "Live theme switcher — neon / minimal / glass toggle",
  "Canvas mode — user manipulates elements visually",
  "Interactive infographic — site as moving infographic",
];

const JSON_GLOBAL=`Respond EXCLUSIVELY with valid JSON — no explanations, no markdown fences, no extra text.
Use double quotes only. No trailing commas. No comments inside JSON.
Unknown values use "TBD". Output must pass JSON.parse() without errors.`;

const JSON_T=[
  {id:"t1",label:"T1 — Role + Strict Schema",badge:"Zero-shot baseline",color:C.gn,when:"First attempt, any capable model",content:`You are an expert [role].
Analyze the input and respond EXCLUSIVELY with valid JSON.
Use this exact schema:
{
  "sitemap": [ { "page_slug": "", "page_title": "", "description": "" } ],
  "pages": {
    "<slug>": {
      "sections": [ { "type": "", "heading": "", "content": "" } ],
      "seo": { "meta_title": "", "meta_description": "" }
    }
  },
  "global": { "site_title": "", "tagline": "", "color_palette": "" },
  "image_prompts": [ "descriptive string for image generation" ]
}
Input: [your input here]`},
  {id:"t2",label:"T2 — Few-Shot Examples",badge:"Best for local models",color:C.vi,when:"Inconsistent output (Ollama/local)",content:`Example 1:
Input: "A freelance photographer portfolio site"
Output: { ...valid JSON... }

Example 2:
Input: "Local gym with classes and membership info"
Output: { ...valid JSON... }

Now process:
Input: "[real input]"
Output:`},
  {id:"t3",label:"T3 — CoT + Structured",badge:"Fix structural errors",color:C.am,when:"Structure keeps being wrong",content:`First, think step by step internally:
1. Identify core type and goals.
2. List essential entities.
3. For each entity, identify 3-5 properties.
4. Draft descriptions and labels.
Then output ONLY the JSON. Do not include your reasoning in the output.`},
  {id:"t4",label:"T4 — Validation Guardrails",badge:"Always append",color:C.cy,when:"Add to any technique above",content:`After generating the JSON:
- Verify all keys match the schema exactly
- Check for trailing commas and fix them
- Confirm all strings use double quotes
- Replace any undefined values with "TBD"
- Ensure the result passes JSON.parse() without errors`},
];

const JSON_MX=[
  {sit:"First attempt, any capable model",    use:"T1 + T4"},
  {sit:"Inconsistent output (Ollama/local)",  use:"T1 + T2 + T4"},
  {sit:"Structure keeps being wrong",         use:"T1 + T3 + T4"},
  {sit:"All else fails",                      use:"T1 + T2 + T3 + T4"},
];

const VOCAB=[
  // ── VISUAL FX ─────────────────────────────────────────────────────────────
  {t:"glassmorphism",    cat:"fx",  d:"backdrop-filter:blur(20px) + rgba fill + 1px border at 12% opacity", tip:"Always pair with a colorful background behind it — glass on void-black does nothing",
   adv:"backdrop-filter:blur(20px) bg:rgba(255,255,255,0.06) border:1px solid rgba(255,255,255,0.12). Pair with vivid gradient background behind."},
  {t:"neo-brutalism",    cat:"fx",  d:"Thick black borders, flat color fills, hard drop shadows (no blur), oversized raw type", tip:"Works best monochromatic or with one saturated accent. Color + brutalism = chaos.",
   adv:"border:2-3px solid #000, box-shadow:4px 4px 0 #000 (no blur), flat fill, oversized raw type. Zero gradients, zero rounded corners."},
  {t:"bento grid",       cat:"fx",  d:"Asymmetric mosaic — cards spanning multiple columns/rows, single consistent gap", tip:"Gap consistency is the only rule. Vary cell size, not gap size.",
   adv:"CSS grid with named areas, consistent 16px gaps, cards spanning multiple columns. Each card = one focused content unit."},
  {t:"neon accent",      cat:"fx",  d:"Single saturated color against void-black. Everything else is neutral.", tip:"One accent per screen. Two accents = neither is special.",
   adv:"One saturated color (#4DFFFF or #FF4FD8) on #0B0D10 bg. Everything else is neutral. One accent per viewport maximum."},
  {t:"liquid gradient",  cat:"fx",  d:"Mesh gradient or animated blob that shifts hue — never static", tip:"Use CSS @keyframes on hue-rotate or a canvas/WebGL loop for motion version",
   adv:"CSS @keyframes on hue-rotate() or mesh gradient with animated positions. 8-12s loop. Background layer only, never foreground."},
  {t:"dark-mode native", cat:"fx",  d:"Designed dark-first. Light mode is the adaptation.", tip:"Elevation changes on dark-native: higher = lighter. Opposite of light mode.",
   adv:"Base #0B0D10 or #111. Higher surface = slightly lighter (+8%). Use rgba overlays for elevation, not gray fills."},
  {t:"claymorphism",     cat:"fx",  d:"Inflated 3D soft shapes, multi-layer inner shadows, saturated pastel fills", tip:"inner-shadow: inset 0 -6px 12px rgba(0,0,0,0.2) is the key property",
   adv:"Large border-radius:24-32px, inner-shadow:inset 0 -6px 12px rgba(0,0,0,0.2), saturated pastel fills, inflated 3D appearance."},
  {t:"aurora gradient",  cat:"fx",  d:"Soft flowing color bands (green, violet, blue) with noise texture overlay", tip:"Low saturation + high blur radius + noise grain on top = aurora effect",
   adv:"Soft radial gradients (green, violet, blue) at 20-30% opacity + 40px blur + noise overlay at 4% opacity on top."},
  {t:"noise grain",      cat:"fx",  d:"SVG feTurbulence or CSS noise at 3-8% opacity for tactile depth", tip:"Add mix-blend-mode:overlay to make grain color-adaptive",
   adv:"SVG feTurbulence or CSS noise image at 3-6% opacity. Add mix-blend-mode:overlay for color-adaptive grain."},
  {t:"duotone",          cat:"fx",  d:"Map image shadows to one color, highlights to another — removes color, adds brand", tip:"Use CSS: filter:sepia(1) hue-rotate(Xdeg) saturate(Y) for quick duotone",
   adv:"CSS filter:sepia(1) hue-rotate(Xdeg) saturate(Y). Shadows map to brand color, highlights to white."},
  {t:"vignette",         cat:"fx",  d:"Radial-gradient overlay darkening edges toward center — focuses attention inward", tip:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
   adv:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.65) 100%) on pseudo-element over full container."},
  {t:"scanline",         cat:"fx",  d:"Repeating 1-2px semi-transparent horizontal lines — retro CRT aesthetic", tip:"CSS: repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
   adv:"repeating-linear-gradient(transparent 0, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px) background-size:100% 4px."},
  {t:"chromatic aberration",cat:"fx",d:"RGB channel offset creating color-fringe glitch effect at element edges", tip:"CSS filter:drop-shadow(2px 0 0 red) drop-shadow(-2px 0 0 cyan) on text or images",
   adv:"CSS filter:drop-shadow(2px 0 0 rgba(255,0,0,0.5)) drop-shadow(-2px 0 0 rgba(0,255,255,0.5)) on text or SVG edges."},
  {t:"mesh gradient",    cat:"fx",  d:"Multi-point gradient with color bleeding between anchors — no hard stops", tip:"Use Figma Mesh Gradient plugin or Three.js ShaderMaterial for animated version",
   adv:"4-6 radial-gradient circles at different coordinates, animate positions with @keyframes for a living background."},
  // ── MOTION ────────────────────────────────────────────────────────────────
  {t:"skeleton loading", cat:"motion",d:"Animated shimmer placeholder matching exact layout of pending content", tip:"Shape must mirror real content dimensions — not generic boxes. Use same border-radius.",
   adv:"Placeholder divs matching exact content dimensions. Shimmer: background:linear-gradient(90deg,#1a1a1a 25%,#2a2a2a 50%,#1a1a1a 75%) animated on X axis."},
  {t:"ambient motion",   cat:"motion",d:"Subtle looping BG animation — slow float, soft pulse at <30% opacity", tip:"Never draw attention. Peripheral motion only. opacity < 0.3 is the rule.",
   adv:"CSS @keyframes translateY(-8px) over 6-8s ease-in-out infinite alternate. Max opacity 0.25. Peripheral only, never focal."},
  {t:"progressive disclosure",cat:"motion",d:"Reveal complexity only on demand — accordion, drill-down, hover expand", tip:"Default state shows essentials only. Complexity unlocks on explicit user action.",
   adv:"Default: essentials only. Reveal details on click/hover. max-height:0 to max-height:500px transition or accordion. Never show complexity upfront."},
  {t:"scroll-trigger",   cat:"motion",d:"Animation fires at % viewport entry — GSAP ScrollTrigger or Framer viewport prop", tip:"GSAP: start:'top 80%' end:'top 20%' for clean entry/exit control",
   adv:"GSAP ScrollTrigger: gsap.from(el,{scrollTrigger:{trigger:el,start:'top 80%'},y:40,opacity:0,duration:0.6}). Or CSS @scroll-timeline."},
  {t:"stagger reveal",   cat:"motion",d:"List items animate in sequence — 50-100ms delay between each element", tip:"Use CSS animation-delay:calc(var(--i)*60ms) for zero-JS stagger",
   adv:"CSS animation-delay:calc(var(--i)*60ms) on each child. opacity 0 to 1 + translateY 20px to 0 over 400ms ease-out."},
  {t:"spring physics",   cat:"motion",d:"Easing with overshoot — Framer: type:'spring', stiffness:400, damping:30", tip:"High stiffness + low damping = snappy. Low stiffness + high damping = sluggish.",
   adv:"Framer: spring({stiffness:400,damping:30}). CSS: cubic-bezier(0.16,1,0.3,1). Controlled overshoot without infinite bounce."},
  {t:"magnetic button",  cat:"motion",d:"Cursor proximity pulls button position — GSAP quickTo transform on mousemove", tip:"Clamp max pull to 30-40% of button size. Beyond that feels broken.",
   adv:"JS mousemove: calculate distance from center, gsap.quickTo moves element max 30% of its size toward cursor. Reset on mouseleave."},
  {t:"morph path",       cat:"motion",d:"SVG path morphing between states — GSAP MorphSVGPlugin or Flubber.js", tip:"Source and target paths need same number of points for clean morph",
   adv:"GSAP MorphSVGPlugin.to(el,{morphSVG:targetPath}). Source and target must have same number of anchor points."},
  {t:"kinetic typography",cat:"motion",d:"Text that animates char-by-char, scrubs on scroll, or morphs between states", tip:"GSAP SplitText or Splitting.js for char-level control. CSS for word-level.",
   adv:"GSAP SplitText({type:'chars,words'}). gsap.from(split.chars,{opacity:0,y:20,stagger:0.04,duration:0.4}). Trigger on scroll or mount."},
  {t:"micro-interactions",cat:"motion",d:"Sub-200ms feedback on every state change — button press, checkbox, input shake", tip:"Every interaction needs a state. Default → hover → active → disabled → loading → success",
   adv:"hover:scale(1.02) 150ms ease-out. press:scale(0.97) 80ms ease-in. focus-visible ring 2px offset-2. loading spinner on async ops."},
  // ── 3D + LIBRARY ──────────────────────────────────────────────────────────
  {t:"Three.js scene",   cat:"3d",  d:"WebGL 3D with camera, lights, mesh geometry + PBR materials, RAF loop", tip:"Use drei helpers (OrbitControls, Environment) to skip boilerplate. Install @react-three/drei",
   adv:"new THREE.Scene() + PerspectiveCamera(75,w/h,0.1,1000) + WebGLRenderer + AmbientLight + DirectionalLight. Use OrbitControls from drei."},
  {t:"WebGL shader",     cat:"3d",  d:"GLSL fragment/vertex shaders for GPU-computed visual effects", tip:"Start with Shadertoy examples. Always provide CSS fallback for low-end devices.",
   adv:"GLSL vertex passes UV coords, fragment uses time uniform for animation. Always provide CSS visual fallback for low-end devices."},
  {t:"particle system",  cat:"3d",  d:"GPU-instanced Points or tsParticles — avoid DOM-based particles entirely", tip:"Three.js Points + InstancedMesh. DOM particles > 200 will tank mobile.",
   adv:"new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({size:0.05})). Set 1000-5000 random positions in Float32Array."},
  {t:"GSAP timeline",    cat:"3d",  d:"Chained animation sequence with scrub, reverse, and repeat — gsap.timeline({paused:true})", tip:"paused:true on init, then .play() on trigger. Enables scroll-scrub and reversible animations."},
  {t:"GSAP ScrollTrigger",cat:"3d", d:"Pin, scrub, snap, and batch animations tied to scroll position", tip:"scrub:1 = smooth follow. scrub:true = instant. pin:true pauses scroll. Use markers:true for debug.",
   adv:"gsap.registerPlugin(ScrollTrigger); gsap.from(el,{scrollTrigger:{trigger:el,start:'top 80%',scrub:1},y:40,opacity:0})."},
  {t:"GSAP SplitText",   cat:"3d",  d:"Splits text into chars/words/lines for individual animation control", tip:"type:'chars,words' then stagger each char. Combine with ScrollTrigger for scroll-driven reveals.",
   adv:"const split=new SplitText(el,{type:'chars,words'}); gsap.from(split.chars,{opacity:0,y:20,stagger:0.04,ease:'power2.out'})."},
  {t:"GSAP Flip",        cat:"3d",  d:"Animates DOM layout changes — reorder, filter, show/hide with physics", tip:"Flip.fit() before DOM change, Flip.from(state) after. Zero manual positioning needed.",
   adv:"const state=Flip.getState(el); [apply DOM change]; Flip.from(state,{duration:0.5,ease:'power2.inOut'})."},
  {t:"Rive animation",   cat:"3d",  d:"State-machine interactive animation — reacts to user input in real time", tip:"Use Rive's state machine for button hover/press without JS. Lighter than Lottie.",
   adv:"Rive: use useRive() hook from the rive-app canvas package. Pass src, stateMachines, autoplay props."},
  {t:"Lottie",           cat:"3d",  d:"JSON-based After Effects export — frame-accurate vector animation", tip:"Optimize in LottieFiles editor first. Large Lottie files (>200kb) block LCP.",
   adv:"Lottie: use Lottie component from lottie pkg. Pass animationData, loop, style props. Optimize file size first."},
  {t:"tilt 3D",          cat:"3d",  d:"CSS perspective + rotateX/Y on mousemove — Vanilla Tilt or 10 lines of JS", tip:"Add perspective:1000px on parent. Clamp rotation to ±15deg max for comfort.",
   adv:"Parent: perspective:1000px. mousemove: el.style.transform=`rotateX(${-dy*.1}deg) rotateY(${dx*.1}deg)`. Clamp to max ±15deg."},
  // ── LAYOUT + SYSTEM ───────────────────────────────────────────────────────
  {t:"editorial layout", cat:"layout",d:"Magazine-style: oversized type, text-image overlap, asymmetry, bleeds", tip:"Break the grid intentionally — one bleed element per section max",
   adv:"CSS grid named areas, display type clamp(48px,8vw,120px), text-image overlap with negative margins, full-bleed sections."},
  {t:"8pt grid",         cat:"layout",d:"All spacing is a multiple of 8px — creates visual harmony without thinking", tip:"4px for tight internal spacing, 8px gaps, 16/24/32/48/64px for layout zones",
   adv:"All spacing values must be multiples of 8px: 8,16,24,32,48,64. Tight internal spacing: 4px. Component gap: 8px. Section: 48-64px."},
  {t:"fluid typography", cat:"layout",d:"Font sizes that scale between viewport sizes — clamp(min, fluid, max)", tip:"clamp(1rem, 2.5vw + 0.5rem, 3rem) — eliminates typography breakpoints",
   adv:"font-size:clamp(1rem, 2.5vw + 0.5rem, 3rem). Never use vw alone — always clamp between min and max values."},
  {t:"container queries",cat:"layout",d:"Components that respond to their container width, not viewport", tip:"@container (min-width: 400px) {} — enables true component-level responsiveness"},
  {t:"custom cursor",    cat:"layout",d:"Replace OS cursor with SVG/div — tracks with GSAP quickTo for lag effect", tip:"Hide on touch devices: @media (pointer:coarse) { cursor: auto; }"},
  {t:"fiber optic bg",   cat:"layout",d:"Thin luminous strands on dark canvas — Three.js Lines or canvas 2D with glow", tip:"Use ctx.shadowBlur=20 + ctx.strokeStyle='rgba(255,255,255,0.8)' on canvas",
   adv:"canvas 2D with animated bezier curves: ctx.shadowBlur=20, ctx.strokeStyle='rgba(77,255,255,0.8)', RAF loop updates positions."},
  {t:"blur overlay",     cat:"layout",d:"backdrop-filter:blur(20px) for modals — check Firefox support",              tip:"Add @supports not (backdrop-filter:blur()) fallback with semi-opaque solid bg",
   adv:"backdrop-filter:blur(20px). @supports not (backdrop-filter:blur()){background:rgba(11,13,16,0.92)} as fallback."},
  {t:"floating labels",  cat:"layout",d:"Input placeholder rises to label on focus — CSS :focus + translateY",         tip:"Never remove placeholder entirely. Use aria-label or title attribute as fallback",
   adv:"position:absolute label over input. On :focus or :not(:placeholder-shown): translateY(-24px) scale(0.8) with 200ms ease transition."},
  {t:"scroll-snap",      cat:"layout",d:"CSS scroll-snap-type for carousel and page-based navigation",                  tip:"scroll-snap-type:x mandatory on container, scroll-snap-align:start on children",
   adv:"Container: overflow-x:scroll scroll-snap-type:x mandatory. Children: scroll-snap-align:start. Add scroll-padding-left on container."},
  {t:"masonry grid",     cat:"layout",d:"Pinterest-style variable-height card layout",                                  tip:"CSS grid-template-rows:masonry not supported everywhere — use JS masonry lib or columns:2-3",
   adv:"CSS columns:2 column-gap:16px. Children: break-inside:avoid. Or JS Masonry library. CSS masonry (grid-template-rows:masonry) is experimental."},
  // ── DATA VIZ ──────────────────────────────────────────────────────────────
  {t:"data storytelling",cat:"data",d:"Sequence charts+annotations to guide viewer to insight",tip:"Start with the insight in the title. Every chart element supports one claim.",
   adv:"Put the insight in the chart title. Every annotation supports one claim. Remove all data that does not serve the story."},
  {t:"sparkline",       cat:"data",d:"Inline micro-chart 24px tall — shows trend without axes, used in KPI cards",tip:"width:80px height:24px no axes no labels. SVG or canvas. Shows direction not values.",
   adv:"SVG path 80x24px, no axes, no labels. Smooth points with bezier. stroke:currentColor fill:none strokeWidth:1.5."},
  {t:"KPI card",        cat:"data",d:"Value + delta vs prior period + sparkline + context label",tip:"4 elements: number, delta (% and absolute), sparkline, label. Missing any = incomplete.",
   adv:"Large number (clamp 28px,4vw,48px) + delta badge (color + % + absolute) + 80px sparkline + context label. No chart axes."},
  {t:"heat map",        cat:"data",d:"2D grid where color intensity encodes value magnitude",tip:"Sequential scale (white to color) for one metric. Diverging for pos/neg (red-white-blue).",
   adv:"CSS grid cells with background:hsl(220,80%,calc(95% - value*60%)) for sequential scale. Tooltip shows value on hover."},
  {t:"waterfall chart", cat:"data",d:"Running total showing sequential additions and subtractions to final value",tip:"Best for financial breakdowns. Bars stacked not grouped. Use D3 or Recharts.",
   adv:"Stacked bars where each starts where previous ended. Green positive, red negative, gray subtotal. Use D3 or Recharts."},
  {t:"sankey diagram",  cat:"data",d:"Flow viz where band width = quantity flowing between nodes",tip:"D3 sankey plugin. Best for: user journeys, budget allocation, conversion funnels.",
   adv:"D3 Sankey: use sankey() layout + sankeyLinkHorizontal() from d3 sankey plugin. Nodes=rects, links=paths, width=quantity."},
  // ── TYPOGRAPHY MOTION ─────────────────────────────────────────────────────
  {t:"variable font",   cat:"motion",d:"Single font file with continuous weight/width axes — animate between values on scroll",tip:"font-variation-settings: 'wght' 100 to 900 animatable in CSS. One file, infinite styles.",
   adv:"font-variation-settings: wght 400. GSAP animate: gsap.to(el,{fontVariationSettings:'wght 900',scrollTrigger:{scrub:1}}). One file, infinite weight range."},
  {t:"text reveal",     cat:"motion",d:"Chars/words/lines appear sequentially via clip-path or opacity stagger",tip:"GSAP SplitText + stagger 0.04s per char. CSS: clip-path:inset(0 100% 0 0) to inset(0 0 0 0).",
   adv:"clip-path:inset(0 100% 0 0) to inset(0 0% 0 0). Or GSAP: gsap.from(split.chars,{clipPath:'inset(0 100% 0 0)',stagger:0.04})."},
];

const COMBOS=[
  {combo:"🫧 Glass + Bento",    els:"glassmorphism, bento grid, dark-mode",        best:"Dashboards, data viz",       psych:"Depth + hierarchy + scannability"},
  {combo:"💥 Brutal + Neon",    els:"brutalist, neon accent, kinetic",             best:"Landing pages, bold brands", psych:"Urgency + attention + focus"},
  {combo:"🌊 Liquid + Ambient", els:"liquid gradient, ambient motion",             best:"Hero sections, immersive",   psych:"Emotion + flow + atmosphere"},
  {combo:"📰 Editorial + Bento",els:"editorial, bento grid, progressive",          best:"Content platforms, blogs",   psych:"Authority + modern organization"},
  {combo:"✨ Micro + Skeleton",  els:"micro-interactions, skeleton loading",        best:"Apps, data-heavy interfaces",psych:"Reduced perceived wait time"},
  {combo:"🚀 Full Immersive",   els:"kinetic, liquid, micro, ambient",             best:"Marketing sites, launches",  psych:"Maximum engagement"},
  {combo:"🎮 Cyberpunk Glow",   els:"neon, chromatic, scanline, dark",            best:"Gaming, crypto, tech",       psych:"Futuristic + innovation"},
  {combo:"💎 Premium Minimal",  els:"glass, noise grain, duotone",                best:"Luxury brands",              psych:"Exclusivity + sophistication"},
  {combo:"🧸 Playful 3D",       els:"claymorphism, morph, tilt, cursor",          best:"Kids apps, gamified",        psych:"Friendly + approachable"},
  {combo:"🌐 Fiber Tech",       els:"fiber, particles, mesh, liquid",             best:"Telecom, networks",          psych:"Connectivity + speed"},
  {combo:"🎬 Cinematic",        els:"vignette, blur, kinetic, ambient",           best:"Film, media",                psych:"Movie-like atmosphere"},
  {combo:"📊 Isotype Data",     els:"isotype, bento, skeleton, duotone",          best:"Statistics, reports",        psych:"Data digestible + memorable"},

  {combo:"⚡ Motion-First",    els:"GSAP ScrollTrigger, stagger, spring, magnetic", best:"Portfolios, agencies, demos",      psych:"Personality + craft + delight"},
  {combo:"🔮 AI Product UI",   els:"ambient motion, progressive disclosure, mesh",  best:"AI tools, chat, generative apps", psych:"Intelligence + calm + futurism"},
  {combo:"📊 Executive Dash",  els:"skeleton loading, KPI cards, sparklines, filter",best:"Analytics, SaaS dashboards",     psych:"Authority + clarity + trust"},
  {combo:"🎭 Editorial Dark",  els:"editorial layout, dark-native, vignette, kinetic",best:"Media brands, premium content", psych:"Drama + authority + depth"},
  {combo:"🌱 Warm Minimal",    els:"claymorphism, soft shadows, floating labels",   best:"Health, wellness, consumer apps", psych:"Trust + approachability + calm"},
  {combo:"🔬 Data Dense",      els:"bento grid, tabular nums, sparklines, duotone", best:"Finance, analytics, enterprise",  psych:"Precision + information density"},
  {combo:"🎪 Expressive Gen-Z",els:"chromatic aberration, variable font, tilt 3D",  best:"Fashion, gaming, youth brands",  psych:"Identity + self-expression + edge"},
  {combo:"🏗 Developer Tool",  els:"monospace type, dark-native, syntax highlight", best:"Dev tools, CLIs, technical SaaS", psych:"Craft + precision + legibility"},
];

const TYPO=[
  {d:"Space Grotesk",m:"JetBrains Mono",b:"Tech startups, developer tools, modern SaaS"},
  {d:"Syne Bold",    m:"JetBrains Mono",b:"Creative agencies, art portfolios, bold brands"},
  {d:"Clash Display",m:"Space Mono",    b:"Fashion, luxury brands, premium products"},
  {d:"Inter Tight",  m:"JetBrains Mono",b:"Dashboards, enterprise apps, content platforms"},
];

const TYPO_I=[
  {u:"Data Viz", c:"Space Grotesk (headers) + Inter (body) + JetBrains Mono (numbers)"},
  {u:"Creative", c:"Syne (display) + Space Grotesk (body) + Clash Display (accent)"},
  {u:"Mobile",   c:"Inter Tight (headlines) + Inter (body) + SF Pro (UI)"},
];


const LINT=[
  // ── UNIVERSAL (all prompt types) ─────────────────────────────────────────
  {id:"missing-role",      seg:"universal", check:"Role defined? Who is the AI acting as?",             auto:true,  fix:"Prepend: 'You are a senior [role]...'"},
  {id:"missing-objective", seg:"universal", check:"Is there a clear, measurable success condition?",    auto:false, fix:"Add: 'Success = [specific outcome]'"},
  {id:"vague-language",    seg:"universal", check:"Uses: nice, cool, awesome, modern, good, beautiful?",auto:true,  fix:"Replace with specific terms from SWAPS list"},
  {id:"missing-constraints",seg:"universal",check:"Are quality guardrails explicitly listed?",          auto:true,  fix:"Add: WCAG AA, mobile-first, 60fps, bundle <200kb"},
  {id:"missing-output",    seg:"universal", check:"Output format specified? Files, schema, format?",    auto:false, fix:"Add: 'Generate: 1. [file] 2. [file] 3. [instructions]'"},
  {id:"no-refinement",     seg:"universal", check:"Refinement instruction present?",                    auto:true,  fix:"Append: 'Critique → refine structure → refine polish → output final only'"},
  // ── UI / UX ───────────────────────────────────────────────────────────────
  {id:"ui-no-platform",    seg:"ui/ux",     check:"Platform specified? mobile / web / desktop?",        auto:true,  fix:"Add platform + viewport breakpoints"},
  {id:"ui-no-aesthetic",   seg:"ui/ux",     check:"3+ aesthetic keywords from vocab list?",             auto:false, fix:"Pick from Design Vocab: glassmorphism, bento, neo-brutalism..."},
  {id:"ui-no-anim-lib",    seg:"ui/ux",     check:"Animation library named and configured?",           auto:true,  fix:"Specify: Framer Motion / GSAP / Three.js / Rive / CSS-only"},
  {id:"ui-no-mobile-first",seg:"ui/ux",     check:"Mobile-first stated explicitly at 375px?",          auto:true,  fix:"Add: 'Design at 375px minimum. Scale up.'"},
  {id:"ui-no-a11y",        seg:"ui/ux",     check:"Accessibility: WCAG AA, aria-labels, keyboard nav?",auto:true,  fix:"Add: 'WCAG AA: 4.5:1 text, 3:1 UI, aria-labels, tab-navigable'"},
  {id:"ui-no-states",      seg:"ui/ux",     check:"Interactive states defined? hover/press/focus/disabled?",auto:false,fix:"Add state spec: hover 150ms, press 80ms scale(0.97), focus-visible ring"},
  // ── CODE ──────────────────────────────────────────────────────────────────
  {id:"code-no-stack",     seg:"code",      check:"Full stack specified? Framework + runtime + DB?",    auto:false, fix:"Define: framework, ORM, auth, deploy target"},
  {id:"code-no-errors",    seg:"code",      check:"Error handling strategy mentioned?",                 auto:true,  fix:"Add: 'Handle all errors, no silent failures, typed errors'"},
  {id:"code-no-types",     seg:"code",      check:"TypeScript / type safety specified?",                auto:true,  fix:"Add: 'Full TypeScript, no any types, strict mode'"},
  {id:"code-no-tests",     seg:"code",      check:"Test coverage mentioned?",                           auto:false, fix:"Add: 'Include unit tests for core logic'"},
  {id:"code-has-todos",    seg:"code",      check:"Prompt says 'no TODOs, no placeholders'?",          auto:true,  fix:"Add: 'No TODOs. No lorem ipsum. No placeholder comments.'"},
  {id:"code-no-perf",      seg:"code",      check:"Performance constraints defined? LCP/bundle/fps?",  auto:false, fix:"Add: LCP<2.5s, CLS<0.1, <200kb JS, 60fps animation"},
  // ── CONTENT / COPY ────────────────────────────────────────────────────────
  {id:"copy-no-audience",  seg:"content",   check:"Target audience defined with pain point?",          auto:false, fix:"Add: '[Avatar] struggling with [specific pain]'"},
  {id:"copy-no-tone",      seg:"content",   check:"Tone and voice defined (3 adjectives)?",            auto:false, fix:"Add: 'Tone: [confident/warm/direct]. Avoid: [corporate/preachy]'"},
  {id:"copy-no-cta",       seg:"content",   check:"Call to action specified?",                         auto:false, fix:"Add: 'End with CTA: [specific action] → [specific outcome]'"},
  {id:"copy-no-length",    seg:"content",   check:"Word count or length constraint given?",            auto:true,  fix:"Add target length: tweets=280, headlines=10 words, posts=150-200"},
  // ── AGENT / AUTOMATION ────────────────────────────────────────────────────
  {id:"agent-no-trigger",  seg:"agent",     check:"Trigger event defined? What starts the workflow?",  auto:false, fix:"Define: webhook / schedule / user action / event"},
  {id:"agent-no-failsafe", seg:"agent",     check:"Error and fallback behavior defined?",              auto:false, fix:"Add: 'On failure: retry X times → notify → log → halt'"},
  {id:"agent-no-output",   seg:"agent",     check:"Final output artifact specified?",                  auto:false, fix:"Add: what the automation produces or stores at end"},
  {id:"agent-no-tools",    seg:"agent",     check:"Tools/integrations listed? (Slack, DB, API, etc.)", auto:false, fix:"List all external tools the agent needs access to"},
  // ── MOBILE ───────────────────────────────────────────────────────────────────
  {id:"mobile-no-breakpoints",seg:"mobile",  check:"Breakpoints defined? 375/768/1280/1920px?",          auto:true,  fix:"Add: mobile-first at 375px, tablet 768px, desktop 1280px"},
  {id:"mobile-no-touch",      seg:"mobile",  check:"Touch targets 44px minimum with 8px gap?",           auto:true,  fix:"Add: min 44px height/width on all interactive elements"},
  {id:"mobile-no-viewport",   seg:"mobile",  check:"Viewport meta with viewport-fit=cover?",             auto:true,  fix:"Add: width=device-width, initial-scale=1, viewport-fit=cover"},
  // ── API ───────────────────────────────────────────────────────────────────────
  {id:"api-no-schema",        seg:"api",     check:"Request + response schema defined (JSON)?",           auto:false, fix:"Add: input schema (zod), output schema, error codes"},
  {id:"api-no-auth",          seg:"api",     check:"Auth strategy specified? (Bearer / API key / OAuth)", auto:false, fix:"Add: Authorization header type + token expiry strategy"},
  {id:"api-no-rate-limit",    seg:"api",     check:"Rate limiting mentioned?",                            auto:true,  fix:"Add: X requests per minute per API key, 429 on exceed"},
];
const AESTHETIC_KEYWORDS=["glassmorphism","neo-brutalism","kinetic typography","bento grid","dark-mode native","neon accent","liquid gradient","editorial layout","claymorphism","aurora gradient","noise grain","chromatic aberration","minimal + high-contrast","three.js immersive","scroll-trigger driven","magnetic + cursor-reactive"];
const SWAPS=[
  // BEGINNER MISTAKES
  {bad:"nice",good:"clear and intentional",level:"beginner",tip:"Specificity forces the AI to make design decisions instead of guessing"},
  {bad:"cool",good:"high-contrast and dynamic",level:"beginner",tip:"Name the visual property — contrast, motion, density"},
  {bad:"modern",good:"[select aesthetic keyword below]",level:"beginner",isAesthetic:true,tip:"'Modern' means nothing to an AI. Pick a named style."},
  {bad:"awesome",good:"visually striking and purposeful",level:"beginner",tip:"Every element must justify its existence"},
  {bad:"good design",good:"typographically strong with clear visual hierarchy",level:"beginner",tip:"Hierarchy = size+weight+spacing+color in that order"},
  {bad:"beautiful",good:"visually precise with intentional contrast ratio",level:"beginner",tip:"Beauty is subjective. Contrast ratio is measurable."},
  {bad:"simple",good:"reduced to essential elements only",level:"beginner",tip:"Minimalism is a decision, not a default"},
  {bad:"clean",good:"uncluttered with 8pt grid spacing and intentional whitespace",level:"beginner",tip:"Name the spacing system — 4pt, 8pt, 12pt"},
  {bad:"professional",good:"polished, authoritative, and on-brand",level:"beginner",tip:"On-brand = specific color, type, motion tokens"},
  {bad:"user-friendly",good:"frictionless with intuitive affordances and 44px touch targets",level:"beginner",tip:"Touch targets are measurable. Frictionless is a UX goal."},
  {bad:"responsive",good:"fluid grid at 375/768/1280/1920px breakpoints with touch target compliance",level:"beginner",tip:"Name the breakpoints. Responsive without breakpoints is guesswork."},
  {bad:"fast",good:"LCP<2.5s, CLS<0.1, FID<100ms, initial JS<200kb",level:"beginner",tip:"Web Vitals are the standard — use them directly"},
  // MISCONCEPTIONS
  {bad:"make it pop",good:"increase contrast ratio and focal-point visual weight",level:"misconception",tip:"'Pop' = contrast + proximity + size. Define which."},
  {bad:"just add animations",good:"define trigger, duration, easing, and purpose first",level:"misconception",tip:"Animation without purpose = distraction"},
  {bad:"make it minimal",good:"remove every element that doesn't serve a function",level:"misconception",tip:"Minimalism is ruthless subtraction, not sparse decoration"},
  {bad:"dark mode version",good:"redesign contrast, color semantics, and elevation for dark-native",level:"misconception",tip:"Inverting light mode ≠ dark mode. Elevation logic changes."},
  {bad:"mobile-friendly",good:"mobile-first: design at 375px viewport before scaling up",level:"misconception",tip:"Mobile-friendly = afterthought. Mobile-first = constraint-driven design."},
  {bad:"add whitespace",good:"apply 8pt baseline grid with intentional visual rhythm",level:"misconception",tip:"Random whitespace looks accidental. Grid-based spacing looks designed."},
  {bad:"accessible",good:"WCAG AA: 4.5:1 text contrast, 3:1 UI contrast, keyboard-navigable, aria-labels on all interactive elements",level:"misconception",tip:"Accessibility is measurable. Name the standard."},
  // ADVANCED PRECISION
  {bad:"smooth animation",good:"cubic-bezier(0.16,1,0.3,1) 320ms spring easing with controlled overshoot",level:"advanced",tip:"Spring easing feels physical. Ease-in-out feels digital."},
  {bad:"glassmorphism",good:"backdrop-filter:blur(20px), background:rgba(255,255,255,0.06), border:1px solid rgba(255,255,255,0.12)",level:"advanced",tip:"Specify all three properties — blur, fill opacity, border opacity"},
  {bad:"good typography",good:"modular scale 1.25, line-height 1.6 body/1.1 display, tabular-nums for data, clamp() for fluid sizing",level:"advanced",tip:"Modular scale creates harmony. clamp() removes media query bloat."},
  {bad:"interactive",good:"hover 150ms ease-out, press 80ms scale(0.97), focus-visible 2px ring offset-2",level:"advanced",tip:"Spec all three states. Consistency = quality signal."},
  {bad:"loading state",good:"skeleton shimmer matching exact content shape, 400ms shimmer loop, fade-in on content arrival",level:"advanced",tip:"Skeleton must mirror real content layout — not generic rectangles"},
  // STRATEGY + HACK
  {bad:"write good copy",good:"hook (problem) → agitation → solution → proof → CTA. One idea per sentence.",level:"hack",tip:"PAS framework converts better than feature lists"},
  {bad:"make it SEO-friendly",good:"semantic HTML landmarks, schema.org JSON-LD, OG tags, canonical URLs, LCP image preloaded",level:"hack",tip:"SEO is technical. Name every attribute."},
  {bad:"add error handling",good:"typed errors, retry with exponential backoff, fallback UI, error boundary, toast notification with action",level:"hack",tip:"Error handling has 5 layers. Name which ones you want."},
  {bad:"make it scalable",good:"stateless functions, horizontal scaling, read replicas for DB, CDN for assets, queue for async jobs",level:"hack",tip:"Scalability is architecture. Name the pattern."},
  {bad:"secure it",good:"input validation (zod), parameterized queries (no SQL injection), CORS policy, rate limiting, JWT rotation",level:"hack",tip:"Security is a checklist. Give the AI the checklist."},
  // DATA + ANALYTICS
  {bad:"track users",good:"define event taxonomy: event_name, properties:{}, user_id, timestamp — then implement",level:"beginner",tip:"Taxonomy first, SDK second. Retrofitting analytics is 10x harder."},
  {bad:"add analytics",good:"instrument: page_view, session_start, [feature]_clicked, [goal]_completed, error_occurred",level:"beginner",tip:"5 events well-tracked beats 50 events inconsistently tracked."},
  {bad:"show a chart",good:"line chart for trends over time, bar for comparisons, scatter for correlations, funnel for conversion",level:"misconception",tip:"Chart type = data relationship. Pick the relationship, chart follows."},
  {bad:"good dashboard",good:"KPI cards (delta + sparkline) + trend chart + data table + filter panel + date range picker",level:"misconception",tip:"Every dashboard needs these 5. If it's missing one, it's incomplete."},
  // SEO / CONTENT
  {bad:"SEO-friendly",good:"semantic HTML landmarks, title+meta+OG per page, JSON-LD schema, canonical URL, LCP image preloaded with fetchpriority=high",level:"hack",tip:"SEO is 5 specific technical attributes. Name them all."},
  {bad:"write for SEO",good:"primary keyword in H1 + first 100 words + URL slug + meta description. Secondary keywords in H2s. Internal links to 3 related pages.",level:"hack",tip:"On-page SEO is a formula. Apply the formula, not the vibe."},
  // AGENT / AUTOMATION
  {bad:"AI agent",good:"define: model, system prompt, tools (name+schema+execute), memory type, max_steps, output format",level:"misconception",tip:"An agent without defined tools is just a chatbot. Tools are what make it an agent."},
  {bad:"automate this",good:"trigger (event/schedule/webhook) → validate input → transform data → call API → handle errors → log result → notify on failure",level:"misconception",tip:"Automation has 7 required stages. Missing any one causes silent failures."},
  {bad:"AI workflow",good:"define: trigger source, data schema in, LLM call (model+prompt+output schema), tools available, error fallback, output destination",level:"advanced",tip:"LLM call is one step in the workflow, not the whole workflow."},
  // PERFORMANCE / INFRA
  {bad:"optimize the database",good:"add index on columns in WHERE/JOIN/ORDER BY clauses, use EXPLAIN ANALYZE, add connection pooling, cache hot queries in Redis",level:"advanced",tip:"Indexes solve 80% of DB performance issues. Run EXPLAIN first."},
  {bad:"make it faster",good:"profile first: measure LCP, TTFB, JS execution time, DB query time — then optimize the bottleneck only",level:"hack",tip:"Optimize the slowest thing, not everything. Profile before you optimize."},
  {bad:"add caching",good:"cache-aside for DB reads (Redis, 5min TTL), CDN for static assets (1yr cache-control), stale-while-revalidate for API responses",level:"advanced",tip:"Three separate cache layers. Each solves a different latency problem."},

  // TYPESCRIPT + TYPES
  {bad:"any type",       good:"unknown type with type narrowing, or define the exact interface",   level:"advanced",tip:"'unknown' forces type checking. 'any' disables it. Never use 'any' in production."},
  {bad:"type assertion", good:"type guard function with isinstance check — never use 'as' without validation", level:"advanced",tip:"'as' is a lie to the compiler. Runtime errors follow. Use type guards."},
  {bad:"optional chaining",good:"explicit null checks with type narrowing — know when data can be null",level:"hack",tip:"Optional chaining hides bugs. Explicit checks surface them early."},
  // TESTING
  {bad:"test it manually",good:"write unit test: arrange input, act, assert output matches expectation",    level:"misconception",tip:"Manual testing doesn't scale. The test is the documentation."},
  {bad:"test the implementation",good:"test the behavior — what does the function do, not how it does it", level:"advanced",tip:"Testing implementation makes refactoring impossible. Test behavior only."},
  {bad:"mock everything",good:"test with real objects where possible; mock only external I/O (APIs, DBs)",   level:"hack",tip:"Over-mocking creates tests that pass when production fails."},
  // MOBILE / RESPONSIVE
  {bad:"mobile friendly",good:"mobile-first: design at 375px, then layer up with min-width media queries",   level:"beginner",tip:"Mobile-first forces constraint-driven design. Desktop-first creates retrofits."},
  {bad:"touch event",    good:"pointer events API — pointerdown/pointerup handles mouse + touch + stylus",   level:"advanced",tip:"Touch events don't fire on desktop. Pointer events work everywhere."},
  {bad:"click handler",  good:"pointer event + 44px minimum touch target + 8px gap between targets",         level:"misconception",tip:"44px touch target is Apple HIG + WCAG requirement. Below it = failed accessibility."},
  // API DESIGN
  {bad:"REST endpoint",  good:"define: HTTP method + path + request schema + response schema + error codes", level:"beginner",tip:"An API without a schema is a guess. Define the contract before building."},
  {bad:"return 200 always",good:"HTTP 201 for created, 400 for validation, 401 for auth, 404 for missing, 422 for unprocessable, 500 for server error",level:"misconception",tip:"Correct status codes enable client-side error handling without parsing response bodies."},
  {bad:"API key in URL",  good:"Authorization: Bearer token in header — never credentials in URL (they log)",  level:"hack",tip:"URLs are logged everywhere. Headers are not. API keys in URLs leak to server logs, browser history, proxies."},
  // REACT PATTERNS
  {bad:"useEffect for everything",good:"useEffect for sync only — prefer useMemo, useCallback, derived state for transforms",level:"advanced",tip:"90% of useEffect usages are wrong. If you're deriving state, use useMemo. If you're handling events, use callbacks."},
  {bad:"prop drilling",    good:"React Context for theme/auth, Zustand for cross-component state, URL params for navigation state",level:"misconception",tip:"Context for slow-changing global data. Zustand for fast-changing UI state. Not everything needs a store."},
  {bad:"key={index}",      good:"key={item.id} — unique stable identifier from the data, never array index",level:"beginner",tip:"Index keys break animations, form state, and reconciliation. Always use a stable ID."},
  // CSS PRECISION
  {bad:"px everywhere",    good:"rem for text (respects user font preferences), px for borders/shadows, % for layout",level:"misconception",tip:"px ignores user accessibility settings. rem inherits from root. Mix intentionally."},
  {bad:"absolute position",good:"CSS Grid or Flexbox for layout — absolute only for overlays, tooltips, and decorative elements",level:"misconception",tip:"Absolute positioning breaks reflow. Grid/Flex adapts to content. Use absolute sparingly."},

];
const ROLES=["Senior Full-Stack Developer","Senior UX/Product Designer","AI/ML Engineer","DevOps / Platform Engineer","Startup CTO","Principal Engineer","Staff Engineer (Code Review)","Product Manager","Security Engineer","Data Engineer","Solutions Architect","Growth/Marketing Engineer"];
const ANIM_LIBS=["Framer Motion (React — spring physics, layout animations)","GSAP + ScrollTrigger (cinematic scroll, scrub, pin)","GSAP + SplitText (kinetic typography, char-level)","GSAP + Flip (layout morphing, filter animations)","GSAP + MorphSVGPlugin (SVG path morphing)","Three.js (WebGL 3D scenes, shaders, particles)","React Three Fiber (Three.js in React components)","Rive (state-machine interactive animation)","Lottie / lottie-web (After Effects export playback)","Motion One (lightweight WAAPI alternative to GSAP)","Anime.js (lightweight, CSS + SVG + JS properties)","CSS-only (@keyframes, transitions, scroll-driven)","Reanimated 3 (React Native — 60fps native animations)","Moti (React Native + Reanimated declarative)"];
const CONSTRAINT_OPTS=["mobile-first at 375px minimum viewport","WCAG AA: 4.5:1 text contrast, 3:1 UI contrast","keyboard-navigable (tab order, focus-visible)","touch targets: 44px minimum, 8px between","60fps animation budget — no layout thrash","LCP <2.5s, CLS <0.1, FID/INP <100ms","initial JS bundle <200kb (code-split aggressively)","offline-capable (service worker + cache strategy)","SSR/edge-rendered for SEO-critical routes","WCAG AAA for healthcare, government, finance","right-to-left (RTL) language support","reduced-motion: @media (prefers-reduced-motion)","color-blind safe palette (no red+green alone)","no animations that flash >3 times per second"];
const STACK_FRAMEWORKS=["Next.js 15 (App Router)","SvelteKit 2","Astro 5","React + Vite 6","Nuxt 4","Remix / React Router 7","React Native + Expo","Flutter 3"];
const STACK_STYLING=["Tailwind CSS 4","CSS Modules","Styled Components","Vanilla Extract","UnoCSS","NativeWind (React Native Tailwind)","Tamagui (React Native)"];
const STACK_ANIM=["Framer Motion","GSAP 3","Three.js + R3F","Rive","Lottie","CSS @keyframes","Reanimated 3","Motion One"];

const CHECKS=[
  {lbl:"STRUCTURE",
   selectable:{
     role:{label:"Role",opts:ROLES,placeholder:"Select role the AI should act as"},
     constraints:{label:"Constraints",opts:CONSTRAINT_OPTS,placeholder:"Select applicable constraints",multi:true},
   },
   items:["Goal clear — one sentence maximum","Objective and success criteria stated","Output format specified — files, schema, or artifact type","Refinement instruction included (critique → structure → polish → final only)"]},
  {lbl:"DESIGN (UI/UX)",
   selectable:{
     aesthetic:{label:"Aesthetic Keywords",opts:AESTHETIC_KEYWORDS,placeholder:"Select 3+ aesthetic keywords",multi:true},
     animlib:{label:"Animation Library",opts:ANIM_LIBS,placeholder:"Select animation library"},
   },
   items:["Platform specified — mobile / web / desktop / hybrid","Mobile-first stated explicitly at 375px","Interaction states defined — hover / press / focus / disabled / loading / error"]},
  {lbl:"TECHNICAL",
   selectable:{
     framework:{label:"Framework",opts:STACK_FRAMEWORKS,placeholder:"Select framework"},
     styling:{label:"Styling",opts:STACK_STYLING,placeholder:"Select styling approach"},
     animation:{label:"Animation",opts:STACK_ANIM,placeholder:"Select animation library"},
   },
   items:["DB + auth + storage specified","Output format: folder structure + all files + run instructions","No TODOs, no lorem ipsum, no placeholder comments"]},
  {lbl:"QUALITY",items:["No vague words — nice, cool, awesome, modern, good, beautiful","At least one interaction metaphor defined (spring, stagger, reveal)","JSON schema rules appended if requesting structured output","Self-refinement loop: critique → refine × 2 → final output only"]},
  {lbl:"ANIMAL MODE",items:["Mode selected: Beaver / Dolphin / Eagle / Ant / Owl / Rabbit / Elephant","Or chained for complex goals: Eagle → Beaver → Dolphin → Ant"]},
];
const SDIMS=[
  {name:"Clarity",      what:"Is the goal unambiguous? No vague language?"},
  {name:"Structure",    what:"Does it follow ROLE → CONTEXT → OBJECTIVE → OUTPUT?"},
  {name:"Constraints",  what:"Mobile-first? Accessibility? Performance?"},
  {name:"Predictability",what:"Does it specify output format and refinement?"},
];
const SSCALE=[
  {r:"9–10",level:"Production ready",    action:"Ship it",                      col:C.gn},
  {r:"7–8", level:"Good, minor gaps",    action:"Add missing constraints",      col:"#84cc16"},
  {r:"5–6", level:"Partial structure",   action:"Add role + output format",     col:"#eab308"},
  {r:"3–4", level:"Weak, vague",         action:"Rebuild with 8-layer template",col:C.or},
  {r:"1–2", level:"Single vague sentence",action:"Start over",                  col:C.rd},
];

const WF=[
  {id:1,cat:"🎨 Design",title:"Design System Creation",purpose:"Build complete design system",best:"New products, rebrands",chain:["Eagle","Beaver","Ant","Owl"],out:"Complete design system with color tokens, typography, and component library",steps:[
    {a:"Eagle", t:"Define long-term design vision",items:["Brand positioning and personality","Target audience demographics","Competitive landscape analysis","Design principles (3-5 core values)"]},
    {a:"Beaver",t:"Build foundational components",items:["Color palette (primary, secondary, accent, semantic)","Typography scale (display, heading, body, caption)","Spacing system (4px baseline grid)","Border radius and shadow scales"]},
    {a:"Ant",   t:"Create component library",items:["Buttons (primary, secondary, ghost, icon)","Form elements (input, select, checkbox, radio)","Cards and containers","Navigation patterns"]},
    {a:"Owl",   t:"Validate consistency",items:["Check all components follow the system","Verify accessibility contrast ratios","Test responsive behavior"]},
  ]},
  {id:2,cat:"🎨 Design",title:"Landing Page Design",purpose:"Create high-conversion landing page",best:"Marketing, startups",chain:["Rabbit","Eagle","Beaver","Ant"],out:"Complete landing page with all sections and conversion optimizations",steps:[
    {a:"Rabbit",t:"Generate 10+ headline variations",items:["Problem-aware headlines","Solution-focused headlines","Benefit-driven headlines","Social proof headlines"]},
    {a:"Eagle", t:"Structure the page architecture",items:["Hero section with CTA","Problem/Agitation section","Solution/features section","Social proof section","Pricing/CTA section"]},
    {a:"Beaver",t:"Design each section",items:["Hero: Hook + visual + CTA","Features: 3-column bento grid","Testimonials: Carousel or grid","CTA: Contrast section"]},
    {a:"Ant",   t:"Optimize for conversion",items:["Button placement and sizing","Form field minimization","Loading states","Mobile touch targets"]},
  ]},
  {id:3,cat:"🎨 Design",title:"Dashboard Design",purpose:"Build data visualization dashboard",best:"Analytics, SaaS products",chain:["Eagle","Beaver","Dolphin","Ant"],out:"Interactive dashboard with all widgets and filtering capabilities",steps:[
    {a:"Eagle",  t:"Define data requirements",items:["Key metrics and KPIs","User roles and permissions","Data refresh frequency","Export requirements"]},
    {a:"Beaver", t:"Layout the grid",items:["12-column responsive grid","Widget sizing standards","Gutter and margin system","Breakpoint definitions"]},
    {a:"Dolphin",t:"Choose visualization types",items:["KPI cards for single metrics","Line charts for trends","Bar charts for comparisons","Tables for detailed data"]},
    {a:"Ant",    t:"Implement interactions",items:["Filter mechanisms","Date range selectors","Drill-down capabilities","Export functions"]},
  ]},
  {id:4,cat:"💻 Dev",title:"Full-Stack App Development",purpose:"Build complete web application",best:"Product builds",chain:["Eagle","Beaver","Ant","Owl"],out:"Production-ready application with full documentation",steps:[
    {a:"Eagle", t:"Define product architecture",items:["Core features list","User flows and journeys","Data models and relationships","API boundaries"]},
    {a:"Beaver",t:"Set up project structure",items:["Repository initialization","Dependencies configuration","Environment setup","Linting and formatting rules"]},
    {a:"Ant",   t:"Implement feature by feature",items:["Database schema","API endpoints","Frontend components","Integration testing"]},
    {a:"Owl",   t:"Review and optimize",items:["Code quality audit","Performance profiling","Security vulnerability check","Documentation completion"]},
  ]},
  {id:5,cat:"💻 Dev",title:"API Design",purpose:"Design RESTful or GraphQL API",best:"Backend development",chain:["Owl","Beaver","Ant","Dolphin"],out:"Complete API specification with OpenAPI documentation",steps:[
    {a:"Owl",    t:"Analyze requirements",items:["Resource identification","Relationship mapping","Authentication needs","Rate limiting requirements"]},
    {a:"Beaver", t:"Define endpoints",items:["HTTP methods selection","URL structure design","Request/response schemas","Error handling strategy"]},
    {a:"Ant",    t:"Document comprehensively",items:["OpenAPI/Swagger specification","Example requests/responses","Authentication docs","Rate limit documentation"]},
    {a:"Dolphin",t:"Add advanced features",items:["Pagination strategies","Filtering and sorting","Caching headers","Webhook support"]},
  ]},
  {id:6,cat:"💻 Dev",title:"Database Schema Design",purpose:"Design scalable database structure",best:"Data modeling",chain:["Eagle","Beaver","Ant","Owl"],out:"Production database schema with migration scripts",steps:[
    {a:"Eagle", t:"Map data requirements",items:["Entity identification","Relationship types (1:1, 1:N, N:N)","Data volume estimation","Performance requirements"]},
    {a:"Beaver",t:"Design schema",items:["Table/collection definitions","Column types and constraints","Index strategy","Foreign key relationships"]},
    {a:"Ant",   t:"Implement migrations",items:["Up migration scripts","Seed data scripts","Rollback procedures","Migration testing"]},
    {a:"Owl",   t:"Optimize for performance",items:["Query analysis","Index refinement","Partitioning strategy","Backup procedures"]},
  ]},
  {id:7,cat:"📈 Business",title:"Product Roadmap Planning",purpose:"Create strategic product roadmap",best:"Product management",chain:["Owl","Eagle","Rabbit","Beaver"],out:"Prioritized product roadmap with timeline and milestones",steps:[
    {a:"Owl",   t:"Analyze current state",items:["Market analysis","Competitive landscape","User feedback review","Technical debt assessment"]},
    {a:"Eagle", t:"Define vision",items:["12-month product vision","Key objectives and OKRs","Success metrics","Risk identification"]},
    {a:"Rabbit",t:"Generate initiatives",items:["Feature proposals","Technical improvements","Infrastructure needs","Research projects"]},
    {a:"Beaver",t:"Prioritize and sequence",items:["Impact vs effort scoring","Dependency mapping","Resource allocation","Milestone planning"]},
  ]},
  {id:8,cat:"📈 Business",title:"Market Research",purpose:"Conduct comprehensive market analysis",best:"Business strategy",chain:["Owl","Elephant","Ant","Eagle"],out:"Market research report with actionable insights",steps:[
    {a:"Owl",     t:"Define research scope",items:["Target market definition","Competitor list","Research questions","Data sources identification"]},
    {a:"Elephant",t:"Gather insights",items:["Industry reports review","Competitor analysis","Customer interview synthesis","Trend analysis"]},
    {a:"Ant",     t:"Break down findings",items:["SWOT analysis","Market size estimation","User persona development","Opportunity mapping"]},
    {a:"Eagle",   t:"Synthesize recommendations",items:["Strategic positioning","Go-to-market suggestions","Pricing strategy","Risk mitigation"]},
  ]},
  {id:9,cat:"📈 Business",title:"User Onboarding Flow",purpose:"Design effective user onboarding",best:"Product growth",chain:["Owl","Dolphin","Beaver","Ant"],out:"Complete onboarding flow with metrics and testing plan",steps:[
    {a:"Owl",    t:"Understand user psychology",items:["Activation moment identification","Friction point analysis","Value moment mapping","Drop-off prediction"]},
    {a:"Dolphin",t:"Generate onboarding ideas",items:["Welcome emails","Interactive tutorials","Progress indicators","Social proof moments"]},
    {a:"Beaver", t:"Design the flow",items:["Sign-up to first value","Step-by-step guidance","Progress tracking","Celebration moments"]},
    {a:"Ant",    t:"Implement and test",items:["A/B test variations","Analytics tracking","Feedback loops","Iteration cycles"]},
  ]},
  {id:10,cat:"📝 Content",title:"Blog Content Creation",purpose:"Write SEO-optimized blog posts",best:"Content marketing",chain:["Owl","Eagle","Ant","Owl"],out:"Ready-to-publish blog post with SEO optimizations",steps:[
    {a:"Owl",  t:"Research topic",items:["Keyword analysis","Search intent identification","Competitor content review","Topic cluster mapping"]},
    {a:"Eagle",t:"Structure outline",items:["H2/H3 hierarchy","Key points to cover","Data and statistics to include","Internal linking strategy"]},
    {a:"Ant",  t:"Write section by section",items:["Compelling introduction","Body paragraphs with examples","Visual element suggestions","Strong conclusion"]},
    {a:"Owl",  t:"Optimize for SEO",items:["Meta title and description","URL structure","Alt text for images","Schema markup"]},
  ]},
  {id:11,cat:"📝 Content",title:"Video Content Strategy",purpose:"Plan and create video content",best:"YouTube, social media",chain:["Rabbit","Eagle","Beaver","Ant"],out:"Video content calendar with production assets",steps:[
    {a:"Rabbit",t:"Generate content angles",items:["10+ video topic ideas","Different formats (tutorial, vlog, review)","Audience variations","Trend adaptations"]},
    {a:"Eagle", t:"Select and strategize",items:["Choose best topics","Define target audience","Set success metrics","Plan distribution channels"]},
    {a:"Beaver",t:"Create production plan",items:["Script outline","B-roll requirements","Thumbnail concepts","Posting schedule"]},
    {a:"Ant",   t:"Execute and optimize",items:["Filming and editing","SEO optimization","Engagement strategy","Analytics review"]},
  ]},
  {id:12,cat:"📝 Content",title:"Email Marketing Campaign",purpose:"Design email marketing sequence",best:"Marketing automation",chain:["Owl","Rabbit","Beaver","Ant"],out:"Complete email campaign automation with all sequences",steps:[
    {a:"Owl",   t:"Define customer journey",items:["Funnel stages","Trigger events","Segment definitions","Goal mapping"]},
    {a:"Rabbit",t:"Generate email variations",items:["Welcome series ideas","Promo sequences","Re-engagement campaigns","Post-purchase flows"]},
    {a:"Beaver",t:"Write each email",items:["Subject line optimization","Preview text","Body copy","CTA buttons"]},
    {a:"Ant",   t:"Set up automation",items:["Trigger conditions","Timing intervals","A/B test variants","Unsubscribe handling"]},
  ]},
  {id:13,cat:"🔧 Automation",title:"Workflow Automation",purpose:"Design automated business process",best:"Operations, efficiency",chain:["Owl","Beaver","Ant","Owl"],out:"Production automation workflow with monitoring",steps:[
    {a:"Owl",   t:"Analyze current process",items:["Manual steps documentation","Time and resource costs","Error points identification","Bottleneck analysis"]},
    {a:"Beaver",t:"Design automation",items:["Trigger definition","Action sequence","Conditional logic","Error handling"]},
    {a:"Ant",   t:"Implement step by step",items:["API integrations","Data transformations","Notification system","Logging mechanism"]},
    {a:"Owl",   t:"Test and monitor",items:["Edge case testing","Performance monitoring","Alert configuration","Documentation"]},
  ]},
  {id:14,cat:"🔧 Automation",title:"CI/CD Pipeline Setup",purpose:"Build continuous integration/deployment",best:"Development ops",chain:["Eagle","Beaver","Ant","Owl"],out:"Complete CI/CD pipeline with monitoring",steps:[
    {a:"Eagle", t:"Define pipeline stages",items:["Code checkout","Dependency installation","Linting and formatting","Unit testing","Integration testing","Build creation","Deployment trigger"]},
    {a:"Beaver",t:"Configure tools",items:["GitHub Actions / GitLab CI","Environment variables","Secret management","Cache strategies"]},
    {a:"Ant",   t:"Set up each stage",items:["Test runner configuration","Build script creation","Deployment scripts","Rollback procedures"]},
    {a:"Owl",   t:"Implement monitoring",items:["Build status notifications","Deployment tracking","Performance metrics","Error alerting"]},
  ]},
  {id:15,cat:"🎯 Problem",title:"Debug Complex Issue",purpose:"Systematically debug production issues",best:"Engineering",chain:["Owl","Ant","Beaver","Eagle"],out:"Fixed issue with prevention measures",steps:[
    {a:"Owl",   t:"Gather information",items:["Error logs review","User reports collection","Environment details","Recent changes timeline"]},
    {a:"Ant",   t:"Isolate the problem",items:["Reproduce locally","Binary search debugging","Variable elimination","Hypothesis formation"]},
    {a:"Beaver",t:"Implement fix",items:["Root cause addressing","Solution implementation","Test case addition","Code review preparation"]},
    {a:"Eagle", t:"Prevent recurrence",items:["Add monitoring","Update documentation","Process improvement","Team knowledge sharing"]},
  ]},
  {id:16,cat:"🎯 Problem",title:"Technical Debt Resolution",purpose:"Address accumulated technical debt",best:"Engineering",chain:["Owl","Eagle","Beaver","Ant"],out:"Reduced technical debt with verified improvements",steps:[
    {a:"Owl",   t:"Audit current state",items:["Code complexity analysis","Test coverage review","Dependency age check","Performance baseline"]},
    {a:"Eagle", t:"Prioritize debt items",items:["Impact assessment","Effort estimation","Risk evaluation","Dependency mapping"]},
    {a:"Beaver",t:"Execute refactoring",items:["Smallest valuable first","Preserve behavior","Add tests first","Incremental changes"]},
    {a:"Ant",   t:"Validate improvements",items:["Performance verification","Test coverage increase","Code review completion","Documentation update"]},
  ]},
  {id:17,cat:"📊 Data",title:"Analytics Implementation",purpose:"Set up proper analytics tracking",best:"Data teams",chain:["Owl","Beaver","Ant","Dolphin"],out:"Complete analytics implementation with dashboards",steps:[
    {a:"Owl",    t:"Define metrics framework",items:["Business objectives","Key metrics identification","User journey mapping","Success events"]},
    {a:"Beaver", t:"Plan tracking setup",items:["Event taxonomy","Property definitions","User identification strategy","Cross-domain tracking"]},
    {a:"Ant",    t:"Implement tracking",items:["SDK installation","Event implementation","Conversion tracking","Custom dimensions"]},
    {a:"Dolphin",t:"Create dashboards",items:["Real-time monitoring","Funnel analysis","Cohort tracking","Custom reports"]},
  ]},
  {id:18,cat:"📊 Data",title:"Data Pipeline Construction",purpose:"Build reliable data processing pipeline",best:"Data engineering",chain:["Eagle","Beaver","Ant","Owl"],out:"Production data pipeline with monitoring",steps:[
    {a:"Eagle", t:"Design data architecture",items:["Source identification","Transformation logic","Storage requirements","Delivery destinations"]},
    {a:"Beaver",t:"Build pipeline components",items:["Extract scripts","Transform functions","Load processes","Validation checks"]},
    {a:"Ant",   t:"Implement error handling",items:["Retry logic","Dead letter queues","Alert mechanisms","Recovery procedures"]},
    {a:"Owl",   t:"Optimize and monitor",items:["Performance tuning","Cost optimization","Quality monitoring","SLA tracking"]},
  ]},
  {id:19,cat:"🤖 AI Product",title:"AI Tool / Product Build",purpose:"Build an AI-powered tool, reference system, or prompt OS",best:"promptc OS, AI dashboards, prompt managers, creative tools",chain:["Eagle","Beaver","Dolphin","Ant"],out:"Deployed AI product with prompt engine, UI system, and component library",steps:[
    {a:"Eagle", t:"Define the AI product vision",items:["Core user problem the AI solves","Zones or modes the product needs (activate / build / validate / playbook / builder)","Data architecture — what does the AI consume and output?","Prompt schema — how are prompts structured, stored, retrieved?","Success metric: what does the user walk away with after each session?"]},
    {a:"Beaver",t:"Build the prompt engine + UI system",items:["Design token system (colors, typography, spacing, animation curves)","Component library: Card, Code, Pill, CopyButton, Input, Label","Prompt data layer: all prompts as typed constants (not hardcoded in JSX)","Copy-to-clipboard utility with iframe/sandbox fallback","Zone navigation with animated transitions"]},
    {a:"Dolphin",t:"Design the creative interaction layer",items:["Interactive composers: chain builder, layer composer, live prompt generator","Copy-ready output on every single item — modifier, template, vocab term, workflow","Animation system: zone enter, section pop, copy flash, hover scale","Misconception vs correct views for educational depth","Selectable keyword pickers for ambiguous prompt variables"]},
    {a:"Ant",   t:"Polish, fix, and ship",items:["Initialization order: declare all consts before they are referenced","Remove bare HTML tags (<title><meta><link>) from JSX returns","Verify fragment pairs <>...</> are balanced","Test clipboard copy in sandboxed iframe environments","Verify all template literal backticks are balanced across brand/prompt strings","Deploy: Vite build → Vercel (30 seconds)"]},
  ]},
  {id:20,cat:"🎨 Design",title:"Creator Brand Identity",purpose:"Build a complete personal brand for content creators",best:"YouTubers, podcasters, indie makers, newsletter writers",chain:["Owl","Eagle","Dolphin","Beaver"],out:"Creator brand kit: positioning, color system, content pillars, voice guide",steps:[
    {a:"Owl",   t:"Audit current presence",   items:["Audit existing content across platforms","Identify what topics you actually talk about most","Find your natural tone by reading your past writing","Spot the gap between who you are vs how you present"]},
    {a:"Eagle", t:"Define brand strategy",     items:["One-sentence positioning: I help [who] do [what] via [medium]","3 content pillars you could talk about for 10 years","Your POV: what you believe that most in your niche don't","Platform priority: where does your audience actually live?"]},
    {a:"Dolphin",t:"Creative direction",       items:["Visual identity: 2 colors, 1 font, 1 icon or symbol","Thumbnail or header template concept","Intro format for videos or newsletter opening","Signature content format that only you do"]},
    {a:"Beaver", t:"Build the system",         items:["Content calendar: 3 types weekly","Repurposing pipeline: long to medium to short format","CTA hierarchy: subscribe, follow, buy","Brand guide: voice rules and examples"]},
  ]},
  {id:21,cat:"📈 Business",title:"SEO Growth System",purpose:"Build compounding organic traffic through systematic SEO",best:"Startups, SaaS, content businesses, e-commerce",chain:["Owl","Eagle","Ant","Beaver"],out:"SEO playbook with keyword map, content calendar, and technical checklist",steps:[
    {a:"Owl",   t:"Keyword research and audit",  items:["Run site audit: broken links, missing meta, slow pages","Find top 20 keywords competitors rank for that you don't","Map keywords to search intent: informational, commercial, transactional","Find striking distance keywords: position 5-20 for quick wins"]},
    {a:"Eagle", t:"Content strategy",             items:["Build topic cluster map: 1 pillar + 10 supporting posts per theme","Prioritize by: volume times difficulty times business value","Define content type per intent: guide, comparison, tool, landing page","Set publishing cadence: minimum 2-4 posts per week for compounding"]},
    {a:"Ant",   t:"Execute content production",  items:["Write pillar page (3000+ words, comprehensive, linkable)","Write supporting cluster posts targeting long-tail variants","Add internal links: each new post links to 3 existing posts","Optimize: title tag, H1, meta description, schema, alt text"]},
    {a:"Beaver",t:"Build link acquisition system",items:["Set up HARO or Qwoted for journalist link mentions","Build broken link finder workflow + outreach template","Create linkable assets: original research, free tools, data studies","Monthly: check new referring domains, disavow toxic links"]},
  ]},
  {id:22,cat:"💰 Monetize",title:"Digital Product Launch",purpose:"Launch and sell a digital product in 30 days",best:"Consultants, educators, creators, developers",chain:["Eagle","Rabbit","Beaver","Ant"],out:"Live product with sales page, email sequence, and first paying customers",steps:[
    {a:"Eagle", t:"Validate the product idea",  items:["Identify the most painful problem your audience pays to solve","Pre-sell before building: offer at 50% off, need 5 buyers to proceed","Determine format: PDF guide, video course, template pack, community","Run a 24-hour poll to validate the topic before building"]},
    {a:"Rabbit",t:"Create the content",          items:["Outline: 5-7 core modules or sections","Create each section (minimum viable depth, not perfection)","Create bonus: 1 extra asset worth more than the product itself","Host on Gumroad, Lemon Squeezy, or Teachable"]},
    {a:"Beaver",t:"Build the sales system",      items:["Write sales page: problem to solution to proof to offer to CTA","Set up 5-email welcome sequence for buyers","Set up affiliate program: 30-50% commission","Create promotional kit for affiliates with copy-paste content"]},
    {a:"Ant",   t:"Launch and iterate",           items:["Post launch announcement on Twitter, LinkedIn, newsletter, Reddit","Activate affiliates with promotional kit","Collect testimonials from first 10 buyers","A/B test headline after 100 visitors, optimize based on data"]},
  ]},
  {id:23,cat:"🤖 AI Product",title:"AI Agent System Build",purpose:"Design and ship a production AI agent with tools and memory",best:"Agentic apps, MCP tools, autonomous pipelines",chain:["Eagle","Owl","Beaver","Ant"],out:"Production-ready agent: tool definitions, system prompt, deploy config, test harness",steps:[
    {a:"Eagle", t:"Define agent strategy",   items:["What task does this agent automate end-to-end?","What 3-5 tools does it need — search, write, notify, query, transform?","What is the failure mode if it goes wrong?","What is the max acceptable token cost per run?"]},
    {a:"Owl",   t:"Design tool schemas",      items:["Define each tool: name, description, input JSON schema, expected output","Decide execution order: sequential vs parallel vs conditional","Set guard rails: max_steps, timeout, retry policy","Plan memory: ephemeral (per-run) vs persistent (cross-run)"]},
    {a:"Beaver",t:"Build the implementation",items:["Implement each tool function with full error handling","Write system prompt: role + tools available + output format","Wire LLM call with tool_use support (Anthropic, OpenAI, or Groq)","Add structured logging for every tool call and result"]},
    {a:"Ant",   t:"Test and harden",          items:["Test happy path with representative inputs","Test each failure mode: tool error, LLM refusal, timeout","Add retry with exponential backoff on transient tool failures","Deploy with monitoring: alert on failure rate above 5%"]},
  ]},
  {id:24,cat:"📈 Business",title:"Community Growth Engine",purpose:"Build and grow a paid community from 0 to momentum",best:"Creator communities, SaaS user groups, learning cohorts",chain:["Eagle","Rabbit","Dolphin","Beaver"],out:"Community architecture, onboarding system, content calendar, and retention mechanics",steps:[
    {a:"Eagle",  t:"Define community strategy",items:["The one transformation members achieve in 90 days — must be specific and measurable","Platform: Circle (content-first), Skool (gamified), Discord (dev/creator)","Founding offer: first 50 at 50% off, locked price forever","Revenue model: free plus paid tier vs fully paid from day 1"]},
    {a:"Rabbit", t:"Set up and launch fast",   items:["Create 5 core spaces: start-here, wins, resources, ask-anything, accountability","Write welcome sequence: Day 0 video, Day 3 check-in, Day 7 first win, Day 30 milestone","Invite first 10 members personally — do not automate this step","Run first live event within 7 days of launch, record it"]},
    {a:"Dolphin",t:"Design the experience",    items:["Weekly rhythm: Monday post, Wednesday resource, Friday win share, Sunday challenge","Monthly: Week 1 live Q&A, Week 2 resource drop, Week 3 member spotlight, Week 4 sprint","Create the signature experience only your community has — this is your retention moat","Gamification: points for posts, badges for milestones, visible leaderboard"]},
    {a:"Beaver", t:"Build retention systems",  items:["Day 45: annual plan offer — catches members before typical churn window","Referral: 1 month free per referral who stays 30 days","Churn alert: member inactive 14 days triggers personal DM from you","Alumni tier at 12 months: discounted rate, special badge, advisory role"]},
  ]},

];


// ─── MONETIZE DATA ────────────────────────────────────────────────────────────

const DEPLOY_STACKS=[
  // ── WEB DEPLOYMENT ────────────────────────────────────────────────────────
  {id:"vercel-supa",     tag:"WEB · Serverless · Managed",  tier:"Free",  label:"Vercel + Supabase",
   tech:["Next.js 14","Supabase (PostgreSQL+Auth+Storage+Realtime)","Vercel Edge Functions"],
   best:"SaaS MVP, auth apps, real-time dashboards",
   limits:"Supabase: 500MB DB, 50k MAU, 5GB storage / Vercel: 100GB bandwidth",
   strength:"Zero-config full-stack: DB+Auth+Storage+Deploy in one afternoon",
   weakness:"Supabase free tier pauses after 7 days inactivity — set up ping cron",
   prompt:`You are a senior full-stack architect. Build a production Next.js 14 SaaS on Vercel + Supabase free tier.

STACK: Next.js 14 App Router · Supabase PostgreSQL · Supabase Auth · Tailwind · shadcn/ui
DEPLOY: Vercel (free) · Supabase (free tier)

REQUIREMENTS
1. Row Level Security on all Supabase tables
2. Auth: email/password + Google OAuth via Supabase
3. Middleware for protected routes
4. Supabase client: server + browser variants
5. Environment: .env.local template with all required keys

OUTPUT: folder structure, schema.sql, middleware.ts, Supabase client files, deploy instructions (3 commands)`},

  {id:"cloudflare-edge", tag:"WEB · Edge · CDN",           tier:"Free",  label:"Cloudflare Pages + Workers + D1",
   tech:["SvelteKit or Astro","Cloudflare D1 (SQLite at edge)","Cloudflare Workers","KV + R2"],
   best:"Global CDN apps, edge-computed APIs, content sites",
   limits:"Workers: 100k req/day · D1: 5M reads/day · Pages: unlimited deploys · R2: 10GB free",
   strength:"Global edge network, zero cold-starts on Workers, D1 SQLite is free and fast",
   weakness:"D1 not suited for write-heavy workloads. Workers runtime ≠ Node.js API parity",
   prompt:`Build a SvelteKit app deployed to Cloudflare Pages with D1, Workers, KV, and R2.

STACK: SvelteKit + adapter-cloudflare · D1 (SQLite) · Workers (API) · KV (cache) · R2 (files)

SETUP
npx create-svelte@latest myapp && cd myapp
npm i -D @sveltejs/adapter-cloudflare wrangler
wrangler d1 create myapp-db
wrangler kv:namespace create CACHE

OUTPUT: wrangler.toml, D1 schema, KV caching layer, R2 file upload handler, Pages deploy config`},

  {id:"railway-hono",    tag:"WEB · Container · API",      tier:"Free",  label:"Railway + Hono + Turso",
   tech:["Hono (Bun runtime)","Turso libSQL/SQLite","Railway container deploy"],
   best:"REST APIs, background jobs, cron workers, microservices",
   limits:"Railway: $5 free credit/mo · Turso: 500 DBs, 1B row reads/mo free",
   strength:"No sleep mode, Bun is 4× faster than Node, Turso SQLite at edge",
   weakness:"Railway credit is consumed — monitor usage. Turso not for complex relational schemas",
   prompt:`Build a production Hono API on Bun runtime, deployed to Railway, with Turso SQLite.

STACK: Bun · Hono · Drizzle ORM · Turso (libSQL) · Railway

SETUP
bun create hono myapp && cd myapp
bun add drizzle-orm @libsql/client
turso db create myapp && turso db tokens create myapp

OUTPUT: complete Hono API, Drizzle schema, auth middleware, Railway Dockerfile, env template`},

  {id:"fly-pocketbase",  tag:"WEB · Self-hosted · Container",tier:"Free", label:"Fly.io + PocketBase",
   tech:["PocketBase (Go binary — DB+Auth+Storage+Admin)","Fly.io (3 free VMs)","Any frontend on Vercel/Netlify"],
   best:"Personal tools, internal apps, full backend without managed complexity",
   limits:"Fly.io: 3 shared-cpu VMs free, 3GB storage per machine",
   strength:"PocketBase = entire backend in one binary. Auth+DB+Files+Admin UI. No vendor lock-in.",
   weakness:"Self-managed upgrades, not auto-scaling, Fly free tier has memory limits",
   prompt:`Deploy PocketBase on Fly.io as a complete self-hosted backend.

SETUP
fly auth login && fly launch --image ghcr.io/muchobien/pocketbase:latest
fly volumes create pb_data --size 3 --region sin

fly.toml config:
[mounts] source="pb_data" destination="/pb_data"
[http_service] internal_port=8090 force_https=true

OUTPUT: fly.toml, GitHub Actions deploy workflow, PocketBase collection schemas, JS SDK client`},

  // ── N8N AUTOMATION SERVER ─────────────────────────────────────────────────
  {id:"n8n-cloud",       tag:"AUTOMATION · Workflow · n8n",  tier:"Free Trial", label:"n8n Cloud (Hosted)",
   tech:["n8n Cloud (14-day trial)","n8n workflows","200+ integrations"],
   best:"Business automation, webhook processors, scheduled jobs, AI agent pipelines",
   limits:"Free trial 14 days. After: $24/mo Starter (2,500 executions). Self-host = free forever.",
   strength:"Visual workflow builder, 200+ native integrations, AI nodes (OpenAI, Anthropic), webhook triggers",
   weakness:"Cloud tier costs at scale. Self-host needs a VPS.",
   prompt:`Design an n8n automation workflow for [use case].

TRIGGER: [Webhook / Schedule (cron) / Polling / Manual]
INTEGRATIONS NEEDED: [e.g. Gmail, Slack, Airtable, OpenAI, HTTP Request]

WORKFLOW DESIGN
Node 1: Trigger — [describe event]
Node 2: [transformation or filter]
Node 3: AI node — OpenAI: "Summarize this: {{ $json.content }}"
Node 4: [output — Slack message / DB insert / Email / HTTP POST]

ERROR HANDLING
- Add Error Trigger node connected to Slack #alerts
- Set retry count: 3 with exponential backoff

OUTPUT: n8n workflow JSON (importable), node configuration for each step, test payload example`},

  {id:"n8n-self",        tag:"AUTOMATION · Self-hosted · Docker", tier:"Free", label:"n8n Self-hosted (Docker)",
   tech:["n8n via Docker Compose","PostgreSQL or SQLite","Nginx reverse proxy","Cloudflare Tunnel (no open ports)"],
   best:"Unlimited executions, private data, full control over integrations",
   limits:"Only your server specs. Use Hetzner CX22 (€4/mo) for production.",
   strength:"100% free, unlimited executions, all 200+ integrations, local AI models via Ollama node",
   weakness:"You manage upgrades, backups, and scaling",
   prompt:`Set up self-hosted n8n with Docker Compose on a Linux VPS with Cloudflare Tunnel for secure access.

DOCKER COMPOSE
Services: n8n + PostgreSQL + Cloudflare Tunnel (cloudflared)
n8n env: N8N_BASIC_AUTH_ACTIVE=true, DB_TYPE=postgresdb, WEBHOOK_URL=https://your-tunnel.cfargotunnel.com

CLOUDFLARE TUNNEL (no open ports needed)
cloudflared tunnel create n8n-tunnel
cloudflared tunnel route dns n8n-tunnel n8n.yourdomain.com

BACKUP
pg_dump n8n_db | gzip > backup_$(date +%Y%m%d).sql.gz
cron: 0 2 * * * /path/to/backup.sh

OUTPUT: docker-compose.yml, .env template, cloudflared config.yml, nginx.conf, backup cron script`},

  // ── MCP SERVER ────────────────────────────────────────────────────────────
  {id:"mcp-server",      tag:"AI · MCP · Tool Server",     tier:"Free",  label:"MCP Server (Model Context Protocol)",
   tech:["MCP TypeScript SDK","Node.js or Python","stdio or SSE transport","Claude / Cursor / Continue.dev client"],
   best:"Expose tools, resources, and prompts to AI assistants (Claude, Cursor, GitHub Copilot)",
   limits:"MCP is a protocol standard — no platform limits. Client support varies.",
   strength:"AI clients can use your tools natively. No API key management. Context-aware tool calling.",
   weakness:"Client ecosystem still maturing. Debugging stdio transport is non-trivial.",
   prompt:`Build a production MCP server that exposes [tools/resources] to AI assistants.

STACK: Node.js + MCP SDK (modelcontextprotocol) · TypeScript · stdio transport

MCP SERVER STRUCTURE
// const { Server } = mcpSdk.server;
const server = new Server({ name:"my-mcp", version:"1.0.0" }, { capabilities:{ tools:{} } });

TOOL DEFINITIONS
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{ name:"[tool_name]", description:"[what it does]", inputSchema:{ type:"object", properties:{} } }]
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // implement tool logic
  return { content:[{ type:"text", text: result }] };
});

CLAUDE DESKTOP CONFIG (~/.config/claude/claude_desktop_config.json)
{ "mcpServers": { "my-mcp": { "command": "node", "args": ["/path/to/server.js"] } } }

OUTPUT: complete MCP server, tool implementations, Claude Desktop config, README with test instructions`},

  // ── AGENTIC DEPLOYMENT ────────────────────────────────────────────────────
  {id:"zeroclaw",        tag:"AGENTIC · Open‌Claw · Edge",   tier:"Free",  label:"Zero‌Claw / Open‌Claw / Null‌Claw",
   tech:["Open‌Claw framework","Zero‌Claw (zero-cost agent runtime)","Null‌Claw (null-state agent)","Cloudflare Workers or Fly.io"],
   best:"AI agents, autonomous task runners, multi-step AI pipelines with tool use",
   limits:"Depends on underlying deployment target (Cloudflare Workers free tier / Fly.io free VMs)",
   strength:"Agent-native architecture, tool-calling built-in, composable pipelines, minimal boilerplate",
   weakness:"Ecosystem is early-stage — pin versions, check changelogs before production use",
   prompt:`Build an agentic AI application using Open‌Claw/Zero‌Claw deployed to Cloudflare Workers.

AGENT ARCHITECTURE
- Agent runtime: Zero‌Claw (zero-cost, edge-native)
- LLM backend: Groq (free tier) or Cloudflare AI (free Workers AI)
- Tool definitions: structured JSON schema per tool
- State: Cloudflare Durable Objects or KV for agent memory
- Trigger: HTTP webhook or scheduled cron

AGENT TOOL DEFINITIONS
const tools = [
  { name: "search_web", description: "Search the web for current information", parameters: {...} },
  { name: "write_file", description: "Write output to storage", parameters: {...} },
  { name: "notify_slack", description: "Send Slack notification", parameters: {...} },
];

DEPLOYMENT
wrangler publish --name my-agent
Set: GROQ_API_KEY, AGENT_SECRET in Cloudflare secrets

OUTPUT: complete agent implementation, tool definitions, Durable Object memory schema, wrangler.toml, test harness`},

  {id:"local-ollama",    tag:"LOCAL · Privacy · Hybrid",   tier:"Free",  label:"Local Stack (Ollama + Cloudflare Tunnel)",
   tech:["Ollama (100+ models, local inference)","Any framework on localhost","Cloudflare Quick Tunnel (zero config)","SQLite local"],
   best:"Privacy-first AI apps, dev/test, personal tools, offline-capable apps",
   limits:"Your machine specs. Cloudflare quick-tunnel URL changes each restart.",
   strength:"100% free forever, full privacy, runs offline, 100+ models including Llama3/Mistral/CodeLlama",
   weakness:"Not always-on, URL not stable without a named tunnel, hardware-constrained",
   prompt:`Build a local-first AI app with Ollama inference, exposed via stable Cloudflare Tunnel.

SETUP (one-time)
1. curl -fsSL https://ollama.com/install.sh | sh
2. ollama pull llama3.1 && ollama pull mistral && ollama pull codellama
3. cloudflared tunnel login && cloudflared tunnel create myapp
4. cloudflared tunnel route dns myapp app.yourdomain.com

APP STACK
- API: Hono on Bun (localhost:3000)
- AI: fetch("http://localhost:11434/api/generate") with streaming
- DB: SQLite via Drizzle (local file)
- Frontend: React + Vite served by Hono

OLLAMA STREAMING
const stream = await ollama.chat({ model:"llama3.1", messages, stream:true });
for await (const chunk of stream) process.stdout.write(chunk.message.content);

OUTPUT: complete app with streaming chat, local SQLite history, cloudflared config.yml, process manager (PM2) config`},
];


const TOOL_MATRIX=[
  {cat:"Frontend",items:[
    {id:"nextjs",  label:"Next.js 15",    deploy:["Vercel","Railway","Fly.io","Cloudflare"],  strength:"SSR+SSG+PPR, App Router, edge-ready, React Server Components",   weakness:"Vercel-optimized, config complexity",         free:true, tip:"Use next/cache with revalidate for ISR. Avoid getServerSideProps in App Router."},
    {id:"svelte",  label:"SvelteKit 2",   deploy:["Vercel","Netlify","Cloudflare","Fly.io"],  strength:"Tiny bundle, Svelte 5 runes, zero-runtime reactivity",           weakness:"Smaller UI library ecosystem",               free:true, tip:"Use adapter-cloudflare for edge deploy. Svelte 5 runes replace Svelte stores."},
    {id:"astro",   label:"Astro 5",       deploy:["Netlify","Cloudflare","Vercel"],            strength:"Zero JS default, islands architecture, content collections",    weakness:"Not for heavy interactivity",                free:true, tip:"Use content:collections for blog/docs. Islands for interactive components only."},
    {id:"vite",    label:"React + Vite 6",deploy:["GitHub Pages","Netlify","Vercel","Fly.io"],strength:"Fastest HMR, SPA, flexible, massive ecosystem",                 weakness:"No SSR without Vite SSR plugin or wrapper",  free:true, tip:"Use React Query for data fetching. Zustand for state. TanStack Router for routing."},
    {id:"nuxt",    label:"Nuxt 4",        deploy:["Vercel","Netlify","Cloudflare"],            strength:"Vue 3 + SSR/SSG/SPA in one, auto-imports, Nitro server engine", weakness:"Vue ecosystem smaller than React",            free:true, tip:"Nitro runs on any runtime including Cloudflare Workers. Use useFetch for SSR-safe fetching."},
    {id:"remix",   label:"Remix / React Router 7",deploy:["Vercel","Fly.io","Railway","Cloudflare"],strength:"Nested routes, loader/action pattern, progressive enhancement",weakness:"Different mental model from Next.js",    free:true, tip:"Loaders run on server per-route. Actions handle mutations. No useState for server data."},
  ]},
  {cat:"Database",items:[
    {id:"supabase",  label:"Supabase",       deploy:["Vercel","Railway","Netlify"],      strength:"Postgres + Auth + Storage + Realtime + Edge Functions",            weakness:"Free tier pauses after 7 days inactivity",      free:true, tip:"Set up a cron ping to prevent sleep. Use RLS on every table — never bypass."},
    {id:"turso",     label:"Turso (libSQL)", deploy:["Cloudflare","Railway","Vercel"],   strength:"SQLite at edge, 500 free DBs, 1B row reads/mo, no cold start",    weakness:"SQLite not for complex multi-table joins",      free:true, tip:"Use Drizzle ORM. Create a DB per tenant for multi-tenant apps (500 free DBs is generous)."},
    {id:"neon",      label:"Neon Postgres",  deploy:["Vercel","Railway","Render"],       strength:"Serverless Postgres, DB branching, never pauses, connection pooling",weakness:"Connection pooling required for serverless",   free:true, tip:"Always use connection pooler URL for serverless functions. Direct URL only for migrations."},
    {id:"pocketbase",label:"PocketBase 0.22",deploy:["Fly.io","Railway","Self-hosted"],  strength:"Single Go binary: DB+Auth+Files+Admin UI+Hooks. No config.",      weakness:"Self-managed, not auto-scaling",                free:true, tip:"Extend with Go hooks or JS hooks (pb_hooks). Pairs perfectly with Fly.io free VMs."},
    {id:"d1",        label:"Cloudflare D1",  deploy:["Cloudflare Workers/Pages"],        strength:"SQLite at edge, 5M reads/day free, co-located with Workers",      weakness:"Write-heavy workloads hit limits quickly",      free:true, tip:"Use for read-heavy data. Combine with KV for high-read cache layer."},
    {id:"mongodb",   label:"MongoDB Atlas",  deploy:["Any"],                             strength:"Flexible document model, Atlas free 512MB, built-in search",      weakness:"512MB limit hits fast, M0 cluster has no SLA",  free:true, tip:"Enable Atlas Search (free) for full-text. Use $lookup sparingly — prefer embedding."},
  ]},
  {cat:"AI Provider",items:[
    {id:"groq",      label:"Groq API",          tier:"Free",         strength:"Fastest inference globally (700+ tok/s), Llama3/Mixtral/Gemma, 14k tokens/min free",    weakness:"Rate limits on free tier, limited model selection",           tip:"Use for real-time streaming chat. groq-sdk npm package. Add retry with exponential backoff."},
    {id:"ollama",    label:"Ollama (Local)",     tier:"Free forever", strength:"100% free, private, 100+ models, runs offline, no rate limits",                        weakness:"Needs GPU/RAM locally, not hostable without a server",         tip:"Use llama3.1:8b for most tasks. codellama for code. qwen2.5-coder for Python/JS coding."},
    {id:"gemini",    label:"Gemini 2.0 Flash",   tier:"Free tier",    strength:"1M context window, multimodal (image+audio+video), 1500 req/day free",               weakness:"Google data terms, privacy concerns for sensitive data",       tip:"Use for long-document analysis, image understanding, and multimodal workflows."},
    {id:"cerebras",  label:"Cerebras Inference", tier:"Free tier",    strength:"Wafer-scale chip — 2000+ tokens/sec on Llama3.1-70B, generous free tier",            weakness:"Limited model selection, newer platform",                     tip:"Fastest large-model inference available. Free tier sufficient for most prototypes."},
    {id:"openrouter",label:"OpenRouter",          tier:"Free models",  strength:"100+ models, free tier includes Llama/Mistral/Gemma, unified API key",              weakness:"Latency varies by provider, reliability depends on upstream",  tip:"Use ':free' suffix models for zero cost. Set fallback models in request for reliability."},
    {id:"nvidia",    label:"Nvidia Nemotron",     tier:"Free credits", strength:"Nemotron-4 340B, enterprise-grade, Nvidia API free credits on signup",              weakness:"Credits limited, not a long-term free solution",              tip:"Best for enterprise reasoning tasks. Nemotron-4 340B outperforms GPT-4 on many benchmarks."},
    {id:"opencode",  label:"OpenCode / Qwen",     tier:"Free",         strength:"Alibaba Qwen2.5-Coder-32B free on HuggingFace, top coding benchmark scores",        weakness:"HF inference can be slow under load, rate limited",           tip:"Use via HuggingFace Inference API (free). Qwen2.5-Coder-32B beats GPT-4 on HumanEval."},
    {id:"together",  label:"Together AI",          tier:"Free credits", strength:"$25 free credits on signup, Llama/Mistral/Qwen, fast inference",                  weakness:"Credits expire, no perpetual free tier",                      tip:"Redeem $25 signup credits immediately. Use for fine-tuning experiments and batch jobs."},
    {id:"cloudflareai",label:"Cloudflare Workers AI",tier:"Free",     strength:"10k neurons/day free, runs in Workers at edge, no cold start",                      weakness:"Limited model selection, smaller context windows",            tip:"Use for lightweight inference at edge. AI Gateway adds caching + rate limiting on top."},
  ]},
  {cat:"Payments",items:[
    {id:"stripe",  label:"Stripe Billing",  tier:"No monthly fee", strength:"Industry standard, subscriptions+one-time+credits, best webhook reliability",      weakness:"2.9%+30c per txn, requires business entity in some regions", tip:"Use Stripe Billing for subscriptions. Payment Links for quick one-time sales with zero code."},
    {id:"lemon",   label:"Lemon Squeezy",   tier:"No monthly fee", strength:"Merchant of record (handles VAT/tax globally), digital products focus",           weakness:"8-10% total fees, less flexible than Stripe",                tip:"Use if you want zero tax complexity. They handle all global VAT automatically."},
    {id:"polar",   label:"Polar.sh",        tier:"No monthly fee", strength:"GitHub-native, built for OSS devs, issue funding, 5% fee",                       weakness:"Smaller audience, newer platform",                            tip:"Best for OSS projects. GitHub Sponsors integration. Benefit-based subscriptions."},
    {id:"gumroad", label:"Gumroad",         tier:"No monthly fee", strength:"Built-in marketplace discovery, easiest setup, digital product focus",            weakness:"10% fee, limited customization, no subscriptions on free",    tip:"Use for one-time digital products. 10% fee is high but zero setup cost. Good for testing demand."},
    {id:"whop",    label:"Whop",            tier:"No monthly fee", strength:"Built-in community features, Discord integration, great for courses+communities", weakness:"3-3.5% fee, newer platform",                                  tip:"Best for community memberships. Built-in access control for Discord/Telegram."},
  ]},
];


const TOP10_PROMPTS=[
  {rank:1,cat:"🤖 Automation",title:"Automation Services",searches:"900k+/mo",
   why:"Businesses pay $500–5k/project and $200–2k/mo retainer to automate repetitive workflows. N8n, Make, and Zapier automations are the highest ROI service for solo operators.",
   pros:["Recurring retainer income","High ticket ($500–5k/project)","Deliver in hours not weeks","Templates make it nearly passive"],
   cons:["Client discovery takes time","API changes break automations","Maintenance overhead"],
   difficulty:"Beginner",
   monetize:"Freelance + retainer + template packs on Gumroad",
   prompt:`You are a senior automation consultant specializing in no-code/low-code business automation.

CLIENT BRIEF
Business type: [e.g. real estate agency, e-commerce store, SaaS company]
Current manual process: [describe what they do manually]
Tools they already use: [e.g. Gmail, Notion, Airtable, Shopify]
Desired outcome: [e.g. auto-send invoices, sync leads to CRM, notify team on new orders]

DELIVERABLE
Design a complete automation workflow using [N8n / Make / Zapier] that:
1. Identifies the trigger event
2. Maps each automated action step-by-step
3. Handles errors and edge cases
4. Includes a testing checklist
5. Estimates time saved per week

OUTPUT FORMAT
- Workflow diagram (text-based, node → node format)
- Step-by-step setup instructions (numbered, copy-paste ready)
- N8n JSON or Make scenario JSON if applicable
- ROI calculation: hours saved × hourly rate
- Upsell opportunities for this client`},

  {rank:2,cat:"📦 SaaS",title:"SaaS Templates",searches:"720k+/mo",
   why:"Developers sell boilerplate SaaS starters for $49–299 one-time. Buyers save 40–80 hours of setup. Platforms: Gumroad, Lemon Squeezy, GitHub Sponsors.",
   pros:["100% passive after build","$49–299 per sale","Same product sold infinitely","Build once, earn forever"],
   cons:["Competitive market","Requires maintenance as deps update","Marketing effort upfront"],
   difficulty:"Intermediate",
   monetize:"Gumroad / Lemon Squeezy one-time + optional support tier",
   prompt:`You are a senior full-stack developer creating a production-ready SaaS starter template.

TEMPLATE SPEC
SaaS type: [e.g. B2B analytics, AI writing tool, booking system]
Target buyer: [indie hacker / agency / developer]
Price point: [free / $49 / $99 / $199]

TECH STACK
- Next.js 14 App Router
- Supabase (DB + Auth + Storage)
- Stripe (subscriptions + one-time payments)
- Tailwind CSS + shadcn/ui
- Resend (transactional email)

REQUIRED FEATURES
1. Auth: email/password + Google OAuth + magic link
2. Billing: free tier + Pro plan ($X/mo) with Stripe
3. Dashboard: user profile, usage stats, settings
4. Subscription gating: protect Pro features
5. Admin panel: user management, MRR dashboard
6. Email: welcome, trial ending, payment failed

OUTPUT
- Complete folder structure
- All source files (no TODOs, no lorem ipsum)
- Database schema (SQL)
- Stripe webhook handler
- .env.local template with all required keys
- README with 5-command setup
- Landing page with pricing section`},

  {rank:3,cat:"🎓 Consulting",title:"Training / Consulting",searches:"680k+/mo",
   why:"AI consulting rates: $75–300/hr. Prompt engineering courses sell for $97–497. The market is desperate for practitioners who can translate AI capability into business results.",
   pros:["$75–300/hr rate","High perceived value","Build authority fast","No inventory, no shipping"],
   cons:["Time-for-money ceiling","Client acquisition needed","Must stay current with AI"],
   difficulty:"Beginner",
   monetize:"Hourly consulting + cohort course + workshop ($197–497)",
   prompt:`You are an AI implementation consultant creating a consulting offer for [industry/niche].

CONSULTING OFFER DESIGN
Target client: [e.g. marketing agencies, law firms, real estate teams]
Pain point: [what are they struggling with that AI can solve?]
Transformation: [what does their workflow look like after working with you?]

DELIVERABLE: Design a complete consulting productized service including:

1. OFFER NAME & POSITIONING
   - Service name (outcome-focused)
   - One-liner value proposition
   - Ideal client avatar (3 bullet points)

2. SERVICE TIERS
   Tier 1 - Audit ($497): 90-min AI readiness assessment + report
   Tier 2 - Implementation ($2,500): 4-week workflow automation build
   Tier 3 - Retainer ($1,500/mo): ongoing optimization + Slack access

3. DISCOVERY CALL SCRIPT
   - 5 qualifying questions
   - Pain/cost/urgency framework
   - Objection responses

4. PROPOSAL TEMPLATE
   - Problem restatement
   - Proposed solution
   - Timeline + milestones
   - Investment + ROI projection

5. DELIVERY FRAMEWORK
   Week 1: Audit + toolstack recommendation
   Week 2-3: Build + test automations
   Week 4: Training + handoff + SOP documentation`},

  {rank:4,cat:"🤖 AI",title:"AI Content Agency",searches:"520k+/mo",
   why:"Content agencies using AI produce 10× more output. Clients pay $1k–5k/mo for AI-assisted blog posts, social media, and email sequences. The competitive edge is speed + consistency.",
   pros:["High recurring revenue","AI does 80% of work","Scalable with templates","Global client base"],
   cons:["Content quality still needs human review","Market getting saturated","Clients may DIY eventually"],
   difficulty:"Beginner",
   monetize:"Monthly retainer $1k–5k/mo per client",
   prompt:`You are an AI content agency owner creating a content production system for [client niche].

CLIENT: [e.g. SaaS startup, e-commerce brand, personal finance blogger]
MONTHLY PACKAGE: [e.g. 4 blog posts + 20 social posts + 1 email sequence]

CONTENT SYSTEM DESIGN

1. BRAND VOICE DOCUMENT
   Extract from: [paste client website URL or brand guidelines]
   Output: tone (3 adjectives), vocabulary to use, vocabulary to avoid, content pillars (5)

2. MONTHLY CONTENT CALENDAR
   Week 1–4 breakdown:
   - Blog topic + target keyword + word count
   - 5 LinkedIn posts (hook + insight + CTA)
   - 5 Twitter/X threads (numbered, 7 tweets each)
   - Email subject lines (A/B variants)

3. PRODUCTION PROMPT CHAIN
   Step 1 — Research: "Analyze top 5 articles ranking for [keyword]. Extract gaps."
   Step 2 — Outline: "Create H2/H3 outline targeting [keyword] with [word count]."
   Step 3 — Draft: "Write section [X] using the brand voice document above."
   Step 4 — Repurpose: "Convert this blog post into 5 LinkedIn posts and 1 thread."

4. QA CHECKLIST
   - Fact-check statistics and claims
   - Brand voice alignment (1–10 score)
   - SEO: keyword density, meta description, internal links
   - CTA present and specific`},

  {rank:5,cat:"⚡ Prompt Eng",title:"Prompt Engineering",searches:"490k+/mo",
   why:"Prompt engineering is meta-skill that sells. Prompt packs ($9–99), courses ($197–997), and system prompt consulting ($500–5k) are all proven revenue streams.",
   pros:["Low barrier to entry","High perceived value","Evergreen demand","Multiple revenue channels"],
   cons:["Models change fast (prompts degrade)","Hard to patent or protect","Competition increasing"],
   difficulty:"Beginner",
   monetize:"Prompt packs (Gumroad $9–49) + course ($197+) + consulting",
   prompt:`You are a prompt engineering specialist creating a monetizable prompt product.

PRODUCT TYPE: [Prompt Pack / System Prompt / Prompt Course Module]
TARGET USER: [beginner / intermediate / advanced]
Use case niche: [e.g. marketing copy, code review, product research, image generation]

DELIVERABLE: Create a production-ready prompt product including:

1. PROMPT PACK STRUCTURE (10 prompts minimum)
   For each prompt:
   - Title and use case
   - The prompt (copy-paste ready, with [BRACKET] variables)
   - Expected output description
   - Pro tip: one thing that dramatically improves results
   - Common mistake to avoid

2. PROMPT QUALITY SCORING
   Rate each prompt on:
   - Clarity (1–10): Is the goal unambiguous?
   - Constraints (1–10): Are quality guardrails explicit?
   - Predictability (1–10): Same output every time?
   - Reusability (1–10): Works across different inputs?

3. SALES PAGE COPY
   - Headline (outcome-focused)
   - 5 bullet points (what you get)
   - Social proof placeholder
   - Price anchor + CTA`},

  {rank:6,cat:"🔧 No-Code",title:"No-Code Tool Builder",searches:"410k+/mo",
   why:"No-code micro-tools built on Bubble, Glide, or Softr sell for $29–299. Calculators, generators, and converters with AI built-in are the fastest-growing category.",
   pros:["Build in hours not weeks","Low maintenance","AI makes simple tools powerful","Many monetization options"],
   cons:["Platform dependency","Limited customization","Bubble/Glide fees"],
   difficulty:"Beginner",
   monetize:"One-time sale ($29–99) or freemium with Pro upgrade",
   prompt:`You are a no-code product developer creating a monetizable micro-tool.

TOOL CONCEPT: [e.g. AI invoice generator, ROI calculator, social bio writer, resume scorer]
TARGET USER: [freelancers / small business owners / job seekers]
Monetization: [free with email capture / $9 one-time / freemium + $19/mo Pro]

TOOL SPECIFICATION

1. CORE FUNCTION
   Input: [what does the user enter?]
   Process: [what calculation or AI prompt runs?]
   Output: [what does the user get?]

2. TECH STACK OPTIONS (ranked by speed to launch)
   Option A: Bubble.io — most features, visual dev, 2–4 hours
   Option B: Glide — best for spreadsheet-backed tools, 1–2 hours
   Option C: Softr + Airtable — best for directory/database tools
   Option D: Next.js + Vercel + OpenAI — most custom, 4–8 hours

3. AI PROMPT INTEGRATION
   System prompt for the tool:
   "You are a [role]. The user provides [input type]. Output [format] that [outcome]."

4. LAUNCH CHECKLIST
   - Landing page (Carrd or Framer, free)
   - Email capture (Beehiiv or ConvertKit free)
   - Payment (Gumroad, 0 setup cost)
   - ProductHunt launch strategy`},

  {rank:7,cat:"📧 Newsletter",title:"Newsletter Monetization",searches:"380k+/mo",
   why:"Newsletters at 1000 subscribers earn $500–5k/mo via sponsorships. At 5k subscribers: $2k–15k/mo. Beehiiv and Substack both have built-in monetization.",
   pros:["Compounding asset (subscribers grow)","Multiple revenue streams","You own the audience","AI can write 80% of content"],
   cons:["Slow to build (6–12 months to monetize)","Content consistency required","Open rates declining industry-wide"],
   difficulty:"Beginner",
   monetize:"Sponsorships + paid tier + digital products + consulting upsell",
   prompt:`You are a newsletter growth strategist designing a monetization system for [newsletter niche].

NEWSLETTER DETAILS
Niche: [e.g. AI tools for marketers, indie hacking, B2B sales]
Current subscribers: [number]
Platform: [Beehiiv / Substack / ConvertKit]
Publishing cadence: [weekly / twice-weekly]

MONETIZATION STACK DESIGN

1. REVENUE TIERS
   Tier 1 — Free: 1x/week curated content + 1 sponsor slot ($X CPM)
   Tier 2 — Paid ($9/mo): bonus deep-dives + community access + templates
   Tier 3 — Sponsor package: dedicated send ($500–2,000 per send at 5k+ subs)

2. CONTENT PRODUCTION SYSTEM (AI-assisted)
   Monday: Research 5 AI tools → run each through evaluation prompt
   Tuesday: Write newsletter using AI draft → human polish (30 min)
   Wednesday: Schedule + set up sponsor link tracking

3. GROWTH PLAYBOOK
   - Referral program (Beehiiv native): 3 referrals = bonus resource
   - Cross-promotion: swap mentions with 3 newsletters same size
   - Lead magnet: [what 1-page resource gets your ideal reader to subscribe?]

4. SPONSOR PITCH TEMPLATE
   "Hi [name], I run [newsletter] — [X] subscribers, [Y]% open rate.
   Your [product] is perfect for my audience of [avatar description].
   I offer [package details] at [$rate]. Here's my media kit: [link]"

5. AI CONTENT PROMPT
   "You are a newsletter writer for [niche]. Write a [word count] issue covering [topic].
   Format: hook (2 sentences) → 3 insights → 1 tool recommendation → CTA.
   Tone: [conversational/analytical/tactical]. Reading level: 8th grade."`},

  {rank:8,cat:"📱 Digital Products",title:"Digital Products",searches:"350k+/mo",
   why:"Digital products have 95%+ margins and zero fulfillment. Templates, ebooks, swipe files, and Notion dashboards sell 24/7 with zero active work after creation.",
   pros:["95%+ profit margin","Fully passive","No inventory","Global market"],
   cons:["Discoverability takes time","One-time purchases (not recurring)","Easy to copy"],
   difficulty:"Beginner",
   monetize:"Gumroad / Etsy / Notion marketplace — one-time + bundle upsell",
   prompt:`You are a digital product creator designing a high-converting product for [platform].

PRODUCT TYPE: [Notion template / Figma UI kit / Prompt pack / Ebook / Swipe file / Excel tracker]
Target buyer: [who has this problem and will pay to solve it?]
Platform: [Gumroad / Etsy / Notion Marketplace / Framer Marketplace]
Price: [$9 / $19 / $49 / $99]

PRODUCT DESIGN BRIEF

1. PRODUCT TITLE (SEO-optimized for platform search)
   Format: [Outcome] + [Product Type] + [For Who]
   Example: "AI Prompt Pack for Freelance Designers — 50 Copy-Paste Prompts"

2. PRODUCT CONTENTS (complete list)
   - [Item 1]: [description + page count or number of items]
   - [Item 2]: [description]
   - Bonus: [what makes this feel like more than the price?]

3. SALES COPY (for Gumroad/Etsy listing)
   Headline: [specific outcome in ≤10 words]
   Problem: [2 sentences — what frustration does this solve?]
   Solution: [2 sentences — what transformation does this deliver?]
   What's inside: [5 bullet points]
   Social proof placeholder: "Join [X]+ [avatar]s who use this to [outcome]"

4. PRODUCTION PROMPT
   "Create a complete [product type] for [target user] that helps them [specific outcome].
   Include [specific sections/components]. Format as [file format].
   Tone: [professional/playful/minimal]. No lorem ipsum. No placeholders."`},

  {rank:9,cat:"🔌 API Products",title:"API Wrapper Products",searches:"290k+/mo",
   why:"Wrapping AI APIs (OpenAI, ElevenLabs, Replicate) with a simpler interface and selling credits is a proven model. Minimal code, high perceived value.",
   pros:["High margins on credits","Recurring revenue","Technical moat","Scales automatically"],
   cons:["Dependent on upstream API","Pricing squeeze risk","Support overhead"],
   difficulty:"Intermediate",
   monetize:"Credit packs + monthly subscription — Stripe Billing",
   prompt:`You are an API product architect designing a monetizable AI API wrapper.

API TO WRAP: [OpenAI GPT-4 / ElevenLabs voice / Replicate image / Deepgram transcription]
Product name: [what you're building]
Target customer: [developer / non-technical business owner / agency]

PRODUCT ARCHITECTURE

1. YOUR API LAYER
   Endpoint: POST /api/generate
   Auth: API key (Bearer token)
   Rate limiting: [X requests/min by tier]
   Input validation: [schema with zod or joi]
   Output: standardized JSON response

2. CREDIT SYSTEM
   1 credit = 1 API call (or 1k tokens)
   Free tier: 100 credits/month (acquisition)
   Starter: $9/mo — 1,000 credits
   Pro: $29/mo — 10,000 credits
   Enterprise: Custom

3. TECH STACK
   Next.js API routes + Supabase (credits table + API key table) + Stripe
   Database schema:
   - users(id, email, stripe_customer_id)
   - api_keys(id, user_id, key_hash, created_at)
   - credit_ledger(id, user_id, amount, type, created_at)

4. BILLING SETUP (Stripe)
   - Subscription products for monthly plans
   - Credit top-up one-time payment
   - Webhook: invoice.paid → add credits to user

5. LAUNCH PROMPT
   "Build a complete Next.js API wrapper for [upstream API] with:
   Supabase credit tracking, Stripe billing, API key auth, rate limiting.
   Provide complete source code, schema.sql, and .env.local template."`},

  {rank:10,cat:"🏘 Community",title:"Community + Membership",searches:"260k+/mo",
   why:"Paid communities on Circle, Discord, or Skool earn $1k–50k/mo. The key is a specific outcome promise + recurring value delivery. AI can generate 60%+ of the content.",
   pros:["Recurring revenue","Network effects","AI assists content creation","Premium positioning"],
   cons:["Requires active moderation","Churn if value drops","Slow to build critical mass"],
   difficulty:"Intermediate",
   monetize:"Monthly membership ($29–197/mo) + annual discount + courses upsell",
   prompt:`You are a community builder designing a paid membership for [niche].

COMMUNITY DETAILS
Niche: [e.g. AI freelancers, SaaS founders, prompt engineers]
Platform: [Circle / Skool / Discord + Whop]
Monthly price: [$29 / $49 / $97 / $197]
Core promise: [what specific outcome does a member achieve in 90 days?]

COMMUNITY ARCHITECTURE

1. SPACES / CHANNELS
   #welcome — onboarding + introduce yourself prompt
   #wins — weekly share format (template below)
   #resources — curated links + AI tools
   #ask-anything — questions get answered within 24hrs
   #accountability — weekly goal thread

2. RECURRING VALUE (monthly calendar)
   Week 1: Live Q&A / office hours (60 min)
   Week 2: Resource drop (prompt pack, template, swipe file)
   Week 3: Member spotlight / case study
   Week 4: Challenge or sprint (action-focused)

3. ONBOARDING SEQUENCE
   Day 0: Welcome email — "Your first 3 actions"
   Day 3: Check-in prompt — "What's your #1 goal this month?"
   Day 7: First win prompt — "Share one thing you implemented"
   Day 30: Milestone check — "Here's what you've unlocked"

4. AI CONTENT SYSTEM
   Weekly prompt for community posts:
   "Write a [type] post for a [niche] community. Hook in line 1.
   Share [insight/lesson/resource]. End with a question that gets replies.
   Tone: [conversational]. Length: 150–200 words."

5. RETENTION MECHANICS
   - Progress tracking visible to member
   - Annual plan offer at day 45 (save 2 months)
   - Alumni tier at 12 months ($X/mo discounted)
   - Referral reward: 1 free month per referral"`},
  {rank:11,cat:"📱 App Dev",title:"Mobile App Development",searches:"620k+/mo",
   why:"Solodev agencies charge $5k–50k for app builds. With AI, one developer can deliver in days what used to take weeks. React Native + Expo has made cross-platform viable for small teams.",
   pros:["High ticket ($5k–50k per project)","Reusable templates across clients","Growing demand from non-technical founders","React Native: one codebase, iOS + Android"],
   cons:["App Store approval process (7-14 days)","Device testing overhead","Push notification complexity","Client expects free bug fixes forever"],
   difficulty:"Intermediate",
   monetize:"Project fee + retainer + template pack on Gumroad",
   prompt:`You are a senior React Native developer who ships apps for non-technical founders.
When I describe an app idea:
- Immediately identify the 3 screens that must exist at launch (not nice-to-haves)
- Propose the data model (3-5 core entities max for MVP)
- Specify the auth flow (social login vs email — which and why)
- Identify which React Native libraries are required (with exact npm package names)
- Flag App Store review risks before I waste time building

App idea: [describe your app here]
Target: [iOS only / Android only / both]`},

  {rank:12,cat:"🎯 Coaching",title:"Coaching & Course Creation",searches:"580k+/mo",
   why:"The coaching industry is $20B+ and growing. AI lets one coach create 10× the content. Courses on Teachable/Kajabi routinely earn $10k–100k launches with an engaged email list of 2000+.",
   pros:["$500–5000 per client (1:1)","Courses sell 24/7 (passive)","AI creates content at scale","No physical product or inventory"],
   cons:["Results-dependent (clients must implement)","Content creation is ongoing","Market is saturated — niche down ruthlessly","Refund rates 5-15% on courses"],
   difficulty:"Beginner",
   monetize:"1:1 coaching ($500–5000) → group program → self-paced course ($197–997)",
   prompt:`You are a course creation expert. When I describe my expertise:
- Identify the one transformation students pay for (not the topic — the outcome)
- Structure a 5-module curriculum where each module = one week of work
- Write the sales page in PAS format (Problem → Agitation → Solution)
- Design a 3-tier pricing structure (self-paced / group / VIP)
- Identify the fastest path to first 10 students

My expertise: [what I know deeply]
Target student: [who struggles with what]
Desired outcome: [what does the student achieve after completing?]`},

  {rank:13,cat:"🎬 Video",title:"Video Production & Editing",searches:"410k+/mo",
   why:"Demand for video content has outpaced supply. AI video tools (Descript, Opus Clip, RunwayML) mean one editor can produce 10× the output. Agencies charge $500–3000 per video.",
   pros:["$500–3000 per video","Subscription retainers ($1500–5000/mo)","AI tools multiply output","High demand from podcasters, YouTubers, coaches"],
   cons:["Highly competitive on platforms","Commoditizing with AI tools","Client taste is subjective","Revision cycles extend timelines"],
   difficulty:"Beginner",
   monetize:"Per-video fee → monthly retainer → productized clips package",
   prompt:`You are a video content strategist and editor. When I give you a video brief:
- Identify the hook (first 3 seconds — what makes someone stop scrolling?)
- Structure the content arc: problem → insight → proof → action
- List exact editing techniques that fit this content style
- Suggest 3 thumbnail concepts with emotional trigger + text overlay
- Recommend distribution: which 3 platforms and what format per platform

Video brief: [describe the video topic and goal]
Creator: [who is making this — their niche and style]
Platform: [YouTube / TikTok / Instagram / LinkedIn]`},

  {rank:14,cat:"🔧 No-Code",title:"No-Code Development",searches:"380k+/mo",
   why:"No-code tools (Bubble, Webflow, Framer, Glide, Softr) have reached production quality. Founders pay $3k–15k for no-code MVPs. AI + no-code means one operator can build and maintain full products.",
   pros:["Build fast (days not months)","No hiring needed","Clients don't need ongoing dev","Templates are reusable assets"],
   cons:["Platform dependency risk","Performance ceilings for complex logic","Vendor lock-in","Limited for complex data operations"],
   difficulty:"Beginner",
   monetize:"Project fee ($3k–15k) + monthly maintenance ($500–2k) + templates on Gumroad",
   prompt:`You are a no-code expert. When I describe a product or feature:
- Recommend the best tool (Bubble / Webflow / Framer / Glide / Softr / Airtable) and explain why
- Identify the 3 workflows that must be built first
- Spot which requirement will be hardest in no-code (and the workaround)
- Estimate realistic build time in hours
- Flag any features that require native code (know the limits)

Product to build: [describe your product]
Budget: [what the client can spend]
Timeline: [when it needs to launch]`},

  {rank:15,cat:"📦 SaaS",title:"Micro-SaaS",searches:"290k+/mo",
   why:"Micro-SaaS ($500–5k MRR) is the most achievable indie model. One developer, one specific problem, $29–99/mo pricing. Acquired by larger SaaS players or become lifetime passive income.",
   pros:["Build in 1 weekend","$29–99/mo per customer","No team needed","Acquirable at 3-5× ARR"],
   cons:["Finding the right problem is hard","Marketing is the hard part","Support overhead grows with customers","Copycats appear at $10k MRR"],
   difficulty:"Intermediate",
   monetize:"$29–99/mo subscription → sold for 3-5× ARR ($30k–500k)",
   prompt:`You are a micro-SaaS architect. When I describe a problem:
- Validate: is someone already paying for a solution? (good sign — means demand exists)
- Define the absolute minimum feature set for first paying customer
- Propose pricing: free tier limits + paid tier value metric
- Identify the acquisition channel (SEO, integrations marketplace, Reddit, cold email)
- Design the 1-weekend build plan (Saturday: core + auth. Sunday: payment + deploy)

Problem: [what workflow is painful and repetitive for [who]]
Builder skills: [what stack you're comfortable with]`},
];

const SAAS_TEMPLATES=[
  {rank:1,title:"AI Writing Assistant",niche:"Productivity / Content",mrr:"$5k–50k/mo potential",stack:"Next.js + OpenAI + Stripe + Supabase",
   why:"Massive market. Jasper, Copy.ai, Writesonic all $1B+. Niche down to win.",
   prompt:`Build a niche AI writing assistant SaaS for [specific niche: e.g. real estate agents, lawyers, therapists].

PRODUCT: [Niche] AI Writing Assistant
Stack: Next.js 14 + OpenAI API + Supabase + Stripe + Resend

FEATURES
- Auth: email + Google OAuth (Supabase)
- 10 specialized writing templates for [niche]
- Custom tone settings (formal/casual/technical)
- History + saved outputs
- Free tier: 5 generations/day
- Pro ($29/mo): unlimited + API access

SYSTEM PROMPT PER TEMPLATE
"You are an expert [niche professional]. Write [document type] for [use case].
Use industry-specific terminology. Format: [structure]. Length: [words].
Tone: [professional/friendly]. Avoid: [list of things to exclude]."

OUTPUT: Complete Next.js app with all templates, Stripe subscription setup, usage tracking, and landing page copy.`},

  {rank:2,title:"Invoice + Billing SaaS",niche:"Finance / Freelance",mrr:"$3k–30k/mo potential",stack:"Next.js + Supabase + Stripe + PDF generation",
   why:"Every freelancer and small business needs invoicing. Sticky product — high retention.",
   prompt:`Build an invoice and billing SaaS for freelancers and small agencies.

PRODUCT: Smart Invoice SaaS
Stack: Next.js 14 + Supabase + Stripe + React-PDF

FEATURES
- Client management (CRM lite)
- Invoice builder (line items, tax, discount)
- PDF generation and email delivery
- Payment tracking (paid/overdue/draft)
- Recurring invoice automation
- Revenue dashboard (MRR, outstanding, paid this month)
- Free tier: 3 clients, 5 invoices/mo
- Pro ($19/mo): unlimited + recurring + custom branding

KEY PROMPTS
Invoice reminder email: "Write a professional but friendly payment reminder for invoice #[X] for $[amount], due [date]. Client name: [name]. Keep it under 100 words."
Late payment escalation: "Write a firm but professional second reminder for an invoice [X] days overdue."

OUTPUT: Complete source code, Supabase schema, Stripe webhook handler, PDF template, and email templates.`},

  {rank:3,title:"Link Shortener + Analytics",niche:"Marketing / Developer Tools",mrr:"$2k–20k/mo potential",stack:"Next.js + Cloudflare + Turso",
   why:"Simple to build, clear value, every marketer needs it. Bitly charges $35/mo — opportunity to niche.",
   prompt:`Build a link shortener SaaS with click analytics and UTM builder.

PRODUCT: Smart Link SaaS
Stack: Next.js 14 + Cloudflare Workers (redirect speed) + Turso (edge SQLite) + Vercel

FEATURES
- Custom short links (yourname.co/link)
- Click analytics: total clicks, unique visitors, countries, devices, referrers
- UTM parameter builder
- QR code generation
- Link expiration + password protection
- Free tier: 20 links, 1k clicks/mo
- Pro ($12/mo): unlimited links, custom domain, API

TRACKING IMPLEMENTATION
On redirect: log(ip_hash, user_agent, referer, country, timestamp) → Turso
Dashboard: aggregate queries by time period, group by country/device

OUTPUT: Complete source code with Cloudflare Worker for redirects, analytics dashboard, and custom domain setup guide.`},

  {rank:4,title:"Waitlist Builder",niche:"Launch / Growth",mrr:"$1k–10k/mo potential",stack:"Next.js + Supabase + Resend",
   why:"Every startup needs a waitlist. Minimal features, huge demand during product launches.",
   prompt:`Build a waitlist SaaS with viral referral mechanics.

PRODUCT: Viral Waitlist Builder
Stack: Next.js 14 + Supabase + Resend + Vercel

FEATURES
- Customizable waitlist page (logo, headline, email field)
- Referral system: each signup gets unique link, move up for referrals
- Real-time position counter ("You're #247 — refer 3 friends to jump to #50")
- Email sequence: confirm → position update → early access notification
- Dashboard: total signups, referral conversion, daily growth chart
- Embed widget (iframe or JS snippet for existing sites)
- Free tier: 1 waitlist, 100 signups
- Pro ($19/mo): unlimited waitlists, custom domain, API

REFERRAL LOGIC
position = base_position - (referrals × boost_value)
Send email when: signup, referral made, position changes by 10+

OUTPUT: Complete source code, email templates (Resend), referral tracking schema, embeddable widget JS.`},

  {rank:5,title:"Form Builder",niche:"Business / Developer Tools",mrr:"$5k–40k/mo potential",stack:"Next.js + Supabase + Stripe",
   why:"Typeform charges $50/mo. There's room for a niche (AI-powered, industry-specific, cheaper) form builder.",
   prompt:`Build an AI-powered form builder SaaS.

PRODUCT: AI Form Builder
Stack: Next.js 14 + Supabase + Stripe + React-Hook-Form

FEATURES
- Drag-and-drop form builder (text, email, select, date, file upload, rating, NPS)
- AI form generator: "Create a client intake form for a graphic designer" → instant form
- Conditional logic (show field if answer = X)
- Response dashboard with CSV export
- Webhook + Zapier integration
- Embed anywhere (iframe or JS)
- Email notifications on submission
- Free tier: 3 forms, 100 responses/mo
- Pro ($24/mo): unlimited + file uploads + webhooks + custom domain

AI FORM GENERATION PROMPT
"Generate a form schema as JSON for: [user description].
Include: field type, label, placeholder, required, validation rules, conditional logic.
Output valid JSON only. No explanation."

OUTPUT: Complete source code, form schema spec, AI integration, and response analytics dashboard.`},
  {rank:6,title:"AI Chatbot Builder",niche:"Customer Support / SaaS",mrr:"$3k–25k/mo potential",stack:"Next.js + OpenAI + Supabase + Stripe",
   why:"Every business wants an AI chatbot. Intercom charges $74/mo. A niche chatbot builder (legal, medical, e-commerce) sells for $29–99/mo.",
   prompt:`Build a white-label AI chatbot builder SaaS — companies embed it on their site.

PRODUCT: AI Chatbot Builder
Stack: Next.js 14 + OpenAI API + Supabase + Stripe + React + Vercel

FEATURES
- Chatbot creation: name, avatar, personality, knowledge base (file upload → embeddings)
- Knowledge base: PDF/URL ingestion → text chunking → embeddings in Supabase pgvector
- Embed code: <script> tag or iframe for any website
- Conversation history: stored per visitor session
- Analytics: total chats, top questions, satisfaction rating
- Free tier: 1 chatbot, 100 messages/mo
- Pro ($29/mo): 5 chatbots, 10k messages, custom domain

RAG IMPLEMENTATION
1. Upload PDF → extract text → chunk (500 tokens, 50 overlap)
2. Embed chunks with OpenAI text-embedding-3-small
3. Store in Supabase pgvector table (content, embedding, chatbot_id)
4. On user message → embed query → similarity search → inject top 5 chunks as context
5. GPT-4o-mini → answer with context only (no hallucination outside knowledge base)

OUTPUT: Complete source with RAG pipeline, embed snippet generator, analytics dashboard`},

  {rank:7,title:"Social Media Scheduler",niche:"Marketing / Creator Tools",mrr:"$2k–20k/mo potential",stack:"Next.js + Supabase + Twitter/LinkedIn APIs + Stripe",
   why:"Buffer charges $18/mo. A niche scheduler (for agencies, for specific platforms, with AI captions) carves out loyal segments.",
   prompt:`Build a social media scheduling SaaS with AI caption generation.

PRODUCT: AI Social Scheduler
Stack: Next.js 14 + Supabase + Twitter/X API + LinkedIn API + OpenAI + Stripe

FEATURES
- Connect accounts: Twitter/X, LinkedIn, Instagram (via Meta API)
- Post composer: text + image upload + link preview
- AI caption generator: "Generate 5 caption variations for this [topic] for [platform]"
- Calendar view: drag-and-drop scheduling
- Queue: optimal posting times based on account analytics
- Analytics: impressions, clicks, engagement per post
- Free tier: 3 accounts, 10 scheduled posts/mo
- Pro ($19/mo): 10 accounts, unlimited posts, analytics

POSTING QUEUE LOGIC
jobs table: (id, user_id, platform, content, media_url, scheduled_at, status)
Cron (every minute): SELECT jobs WHERE scheduled_at <= now() AND status='pending'
→ post via platform API → update status='published' or status='failed'

OUTPUT: Complete scheduler with cron worker, platform API integrations, calendar UI`},

  {rank:8,title:"Notion Template Marketplace",niche:"Productivity / Creator Economy",mrr:"$1k–8k/mo potential",stack:"Next.js + Supabase + Stripe + Gumroad alternative",
   why:"The Notion template market generates $500k+/mo across creators. Building the marketplace itself captures 5-10% of all transactions.",
   prompt:`Build a Notion template marketplace with seller dashboard and buyer storefront.

PRODUCT: Notion Template Marketplace
Stack: Next.js 14 + Supabase + Stripe Connect + Vercel

MARKETPLACE FEATURES
Buyer side:
- Browse templates by category (productivity, business, personal)
- Preview with screenshots + demo video embed
- Instant delivery: Notion duplication link emailed on purchase

Seller side:
- Upload template: title, description, category, screenshots, price, Notion link
- Stripe Connect: sellers receive 85% (marketplace takes 15%)
- Dashboard: sales, revenue, reviews, refund requests

Platform features:
- Stripe Connect Express onboarding for sellers
- Escrow: hold 24hrs before releasing to seller
- Review system: verified purchase required

STRIPE CONNECT FLOW
1. Seller onboards via Stripe Connect Express
2. Buyer pays → Stripe charges buyer, holds in platform account
3. 24hrs later → Stripe Transfer to seller (85% of amount)

OUTPUT: Complete marketplace with Stripe Connect, seller dashboard, buyer storefront`},

  {rank:9,title:"AI Resume Builder",niche:"Career / Job Search",mrr:"$3k–30k/mo potential",stack:"Next.js + OpenAI + Supabase + Stripe + react-pdf",
   why:"Resume.io charges $24.95/mo. An AI resume builder with ATS optimization and job-specific tailoring is a high-demand, low-churn product.",
   prompt:`Build an AI-powered resume builder with ATS optimization.

PRODUCT: AI Resume Builder
Stack: Next.js 14 + OpenAI + Supabase + react-pdf + Stripe

FEATURES
- Resume editor: drag-and-drop sections (experience, education, skills, projects)
- AI enhancement: "Rewrite this bullet point to be more impactful for [role]"
- ATS score: paste job description → score resume match (keyword analysis)
- Job-specific tailoring: "Optimize my resume for this job: [paste JD]"
- Templates: 5 ATS-safe designs (PDF export)
- LinkedIn import: paste LinkedIn URL → auto-populate fields
- Free tier: 1 resume, no AI features
- Pro ($12/mo): unlimited resumes, AI rewriting, ATS scoring, 5 templates

ATS OPTIMIZATION PROMPT
"Analyze this resume vs this job description. Output JSON:
{match_score: 0-100, missing_keywords: [], weak_bullets: [], suggestions: []}"

OUTPUT: Complete builder with PDF generation, ATS analyzer, AI rewriting UI`},

  {rank:10,title:"White-Label Prompt Manager",niche:"Agency / Enterprise AI",mrr:"$5k–50k/mo potential",stack:"Next.js + Supabase + Stripe",
   why:"Agencies and enterprise teams need to manage hundreds of prompts across projects. No dominant solution exists under $100/mo. White-label adds agency revenue stream.",
   prompt:`Build a white-label prompt management SaaS for agencies and enterprise teams.

PRODUCT: Prompt Manager Pro (white-label)
Stack: Next.js 14 + Supabase + Stripe + Vercel

FEATURES
- Prompt library: folders, tags, categories, search
- Version control: prompt history + diff view + rollback
- Variables: [BRACKET] syntax highlighted, fill-in form UI
- Team sharing: roles (admin/editor/viewer), workspace per client
- Prompt testing: A/B test with quality score (clarity/constraints/predictability)
- API access: REST API to fetch prompts programmatically
- White-label: custom domain, logo, color scheme per workspace
- Pricing: Starter $19/mo (1 workspace) → Agency $99/mo (10 workspaces) → Enterprise custom

WHITE-LABEL ARCHITECTURE
- Each workspace has: custom_domain, logo_url, primary_color, brand_name
- Middleware resolves custom domain → workspace_id → renders branded UI
- Stripe per-workspace subscription (platform uses Stripe Connect or manual billing)

OUTPUT: Complete prompt manager, version control system, API, white-label theming engine`},
];

const MONETIZE_FW=[
  {id:"quick",label:"⚡ Quick Win",timeframe:"Week 1",income:"$100–500",
   desc:"Sell a prompt pack or template on Gumroad. Zero setup cost, live in 2 hours.",
   steps:["Pick one niche you know (marketing, coding, design, finance)","Create 10 copy-ready prompts with title + use case + pro tip","Write a Gumroad listing (headline + 5 bullets + price $9–29)","Post on Twitter/X, Reddit, LinkedIn with 1 example prompt","First sale within 48 hours if you target a real pain"],
   prompt:`Create a 10-prompt pack for [niche] professionals that I can sell on Gumroad for $[price].

For each prompt include:
- Title (outcome-focused, ≤8 words)
- The prompt (copy-paste ready with [VARIABLE] placeholders)
- Expected output (1 sentence)
- Pro tip (what makes this prompt 10× better)
- Common mistake to avoid

Niche: [e.g. real estate agents, UX designers, sales reps, fitness coaches]
Price point: [$9 / $19 / $29]
Format: numbered list, ready to copy into a Gumroad product description.`},

  {id:"active",label:"🎯 Active Income",timeframe:"Week 2–4",income:"$500–5k/project",
   desc:"Offer AI automation or prompt engineering as a service. Land first client via LinkedIn or Upwork.",
   steps:["Define one specific deliverable (e.g. 'I build N8n automations for e-commerce brands')","Create a simple offer: Audit $497 → Implementation $2,500","Post 5 LinkedIn posts showing your process (before/after automation)","DM 20 relevant businesses offering a free 30-min audit","Close first client → systematize delivery → hire or automate"],
   prompt:`Design my complete freelance AI service offer for [niche/industry].

MY SKILL: [e.g. N8n automation, prompt engineering, AI content systems]
TARGET CLIENT: [e.g. e-commerce brands, marketing agencies, law firms]

Output a complete service productization:
1. Service name and one-liner (outcome-focused)
2. Three pricing tiers with exact deliverables and timelines
3. Discovery call script (5 questions + how to pitch)
4. LinkedIn outreach DM template (≤50 words, not salesy)
5. Proposal template structure
6. Delivery process (week-by-week)
7. Retainer upsell pitch (how to convert project → monthly)`},

  {id:"passive",label:"💰 Passive Income",timeframe:"Month 1–3",income:"$500–10k/mo MRR",
   desc:"Build a micro-SaaS or paid newsletter. Takes longer but compounds infinitely.",
   steps:["Choose one painful problem with clear willingness to pay","Build MVP in 1 weekend using free tier stack (Vercel + Supabase)","Launch on ProductHunt + relevant subreddits","Price at $9–29/mo (low friction, easy yes)","Add features based on churn reasons, not feature requests"],
   prompt:`Design a micro-SaaS MVP I can build in one weekend and launch for passive income.

MY SKILLS: [e.g. frontend dev, no-code, data analysis]
NICHE: [industry or user type you understand]
TIME AVAILABLE: [hours per weekend]

Output a complete MVP plan:
1. Problem statement (specific, painful, willingess to pay confirmed)
2. MVP feature list (maximum 5 features for weekend build)
3. Tech stack (free tier only: Vercel + Supabase + Stripe)
4. Pricing model ($X/mo free trial → paid)
5. Weekend build schedule (Saturday tasks + Sunday tasks)
6. Launch checklist (ProductHunt, Reddit, Twitter)
7. First 10 customer acquisition plan`},

  {id:"hybrid",label:"🔁 Hybrid Stack",timeframe:"Month 2–6",income:"$2k–20k/mo",
   desc:"Combine active consulting + passive products. Use consulting to fund development, products to create leverage.",
   steps:["Start consulting (active income, fast cash)","Document everything you build for clients → turn into templates","Package templates as digital products (passive)","Use product revenue to fund SaaS development","SaaS replaces consulting as primary income"],
   prompt:`Design a hybrid income architecture that transitions from active to passive income over 6 months.

STARTING POINT: [your current skills + time available]
GOAL INCOME: $[X]/mo by month 6
NICHE: [your area of expertise]

Output a month-by-month income architecture:
Month 1–2: [active income strategy] → target $[X]
Month 3–4: [product launch strategy] → add $[X] passive
Month 5–6: [SaaS or community launch] → target $[X] MRR

For each phase include:
- Primary revenue action
- Secondary build activity (building toward next phase)
- Hours per week required
- Key metrics to hit before moving to next phase
- Risk and contingency plan`},
  {id:"creator",label:"🎬 Creator Economy",timeframe:"Month 1–6",income:"$500–20k/mo",
   desc:"Audience → trust → multiple revenue streams. Compounds infinitely.",
   steps:["Pick one platform and one niche. Consistency beats quality early.","Post 3× per week for 90 days before monetizing. Build trust first.","Month 3: Launch free lead magnet (guide, template, tool). Collect emails.","Month 4: Paid product $19–49. One-time, instant delivery, high value.","Month 5: Sponsorship outreach once you hit 1k subscribers/followers.","Month 6: Community or membership $29/mo for your most engaged audience."],
   prompt:`Design a 6-month creator monetization plan for [platform + niche].

CREATOR PROFILE
Platform: [YouTube / Newsletter / Twitter / TikTok / LinkedIn]
Niche: [ultra-specific — not 'tech' but 'AI tools for freelance designers']
Current size: [followers/subscribers]
Time available: [hours/week]

MONTH-BY-MONTH REVENUE STACK
Month 1-2: Build audience ONLY. No monetization. Metric: 100 new followers/week.
Month 3: Lead magnet + email list. Metric: 200 email subscribers.
Month 4: Digital product launch ($19-49). Target: $500 first month.
Month 5: Sponsorships ($X CPM). Pitch when: 1k+ subs, 40%+ open rate.
Month 6: Community ($29/mo). Launch to email list first.

CONTENT SYSTEM
Weekly: [3 posts format] using AI to research + draft in 2 hours.
Monthly: [1 long-form piece] that establishes authority on a pillar topic.
Repurpose: Long → 3 social posts → 1 email.

MONETIZATION CALCULATOR
1,000 subscribers @ 5% conversion @ $29/mo = $1,450 MRR
5,000 subscribers @ 2% sponsor rate @ $500/send = $1,000/send
1 product sale/day @ $29 = $870/mo passive

OUTPUT: Monthly content calendar, product brief, sponsor pitch template, community onboarding sequence`},

  {id:"community",label:"🏘 Community Builder",timeframe:"Month 2–8",income:"$1k–15k/mo",
   desc:"Paid community or membership. High retention, recurring revenue, compounding network effects.",
   steps:["Define the ONE transformation members achieve in 90 days (must be specific).","Platform: Circle (content + community), Skool (gamified), Discord + Whop (dev).","Pricing: $29–97/mo. Annual plan = 2 months free (reduces churn, improves cashflow).","Founding member offer: first 50 at 50% off, never expires. Creates urgency + loyalty.","Weekly: live Q&A or office hours. This is the #1 retention driver.","Monthly: challenge or sprint. Action = results = testimonials = referrals."],
   prompt:`Design a paid community for [niche] with full monetization architecture.

COMMUNITY DETAILS
Niche: [ultra-specific — who is this for and what exact outcome do they get?]
Platform: [Circle / Skool / Discord+Whop]
Price: [$29 / $49 / $97 / $197 per month]
Core promise: [what specific, measurable outcome in 90 days?]

COMMUNITY ARCHITECTURE
Spaces/channels:
- #start-here: onboarding checklist + introduce yourself prompt
- #wins: weekly share template (I did X, it resulted in Y)
- #ask-anything: answered within 24hrs by community + you
- #resources: curated tools, prompts, templates (your IP)
- #accountability: weekly goal thread

MONTHLY CALENDAR
Week 1: Live Q&A / office hours (60 min, recorded)
Week 2: Resource drop (template, prompt pack, swipe file — your creation)
Week 3: Member spotlight (case study format: before/after/numbers)
Week 4: Challenge (action-focused, 7-day sprint with daily check-ins)

RETENTION MECHANICS
Day 0: Welcome video + first action (take 5 min, create a quick win)
Day 7: First win check-in (email + in-community post)
Day 30: Progress milestone + soft upsell to annual plan
Day 45: Referral offer (1 free month per referral who stays 30 days)
Day 365: Alumni tier ($X/mo discounted, perpetual access)

PRICING MODEL
Monthly: $[X]/mo, cancel anytime
Annual: $[X*10]/yr (2 months free)
Founding: first 50 members at $[X*0.5]/mo, locked forever

OUTPUT: Complete community architecture, onboarding sequence, monthly content calendar, pricing page copy`},

  {id:"agency",label:"🏢 Agency Flywheel",timeframe:"Month 1–12",income:"$5k–50k/mo",
   desc:"Productized service → retainer clients → hire → scale → exit or SaaS.",
   steps:["Define one specific deliverable for one specific client type. Not 'marketing' — 'landing pages for B2B SaaS startups'.","Productize: fixed scope, fixed price, fixed timeline. No custom projects.","Land 3 retainer clients ($1500–5000/mo each) before hiring anyone.","Hire #1 as delivery (not sales). You own client relationships.","Month 6: Build internal tools that make delivery 2x faster (this becomes your SaaS).","Month 12: Either sell the agency or productize your internal tools as software."],
   prompt:`Design an agency productization and scaling plan for [service type].

MY SERVICE: [what I do, for whom, at what price]
TARGET CLIENT: [industry + company size + specific pain]
CURRENT: [solo / small team / established agency]

PRODUCTIZED SERVICE DESIGN
Service name: [outcome-focused, not process-focused]
Deliverable: [exact, scoped output — no 'ongoing strategy']
Timeline: [X weeks, fixed]
Price: [$X one-time or $X/mo retainer]
What's included: [5 bullet points maximum]
What's NOT included: [scope fence — reduces scope creep]

3-CLIENT MILESTONE PLAN
Client 1: [how to get — referral, LinkedIn outreach, cold email?]
Client 2: [same niche, refine the process]
Client 3: [document everything into an SOP]
→ Now hire a delivery person using Client 3 margin

SCALING STACK
CRM: Notion or HubSpot (free tier)
Contracts: DocuSign or PandaDoc
Invoicing: Stripe or Wave (free)
Delivery: Loom for async, Notion for client portals
Communication: Slack per client or Linear for project management

OUTPUT: Service packaging doc, pricing tiers, outreach email template, proposal template, SOP for delivery, hiring criteria for first team member`},

];

const AUTOMATION_WORKFLOWS=[
  {id:"n8n-content",label:"📝 Content Pipeline",tool:"n8n",trigger:"Schedule (daily 8am)",
   desc:"Auto-publish blog posts from Airtable → WordPress → social",
   prompt:`Design an n8n automation: content publishing pipeline.

TRIGGER: Schedule — every day at 8:00 AM
WORKFLOW
1. Read Airtable → filter rows where status="Ready to Publish"
2. HTTP Request → WordPress REST API → create post (title, body, categories, tags)
3. Wait 5 minutes
4. Twitter/X node → post thread (hook + link)
5. LinkedIn node → post article summary
6. Airtable → update row status to "Published" + add published_url
7. Slack → notify #content-team with title + links

ERROR HANDLING
- On any step failure → Slack #alerts with error details + row ID
- Retry: 3 times with 5-minute delay

OUTPUT: n8n workflow JSON (importable), test payload, Airtable schema`},

  {id:"n8n-leads",label:"🎯 Lead Capture",tool:"n8n",trigger:"Webhook (form submit)",
   desc:"Typeform → qualify with AI → CRM → Slack notify",
   prompt:`Design an n8n lead qualification automation.

TRIGGER: Webhook — fires on Typeform submission
WORKFLOW
1. Parse Typeform payload (name, email, company, revenue, use_case)
2. OpenAI node → score lead 1-10 with reasoning:
   "Score this lead: [data]. Output JSON: {score, tier, reason, next_action}"
3. IF score >= 7 → HubSpot create contact (MQL) + notify #sales-hot in Slack
4. IF score 4-6 → HubSpot create contact (lead) + add to nurture sequence
5. IF score < 4 → add to low-priority list + send automated email only
6. All leads → Google Sheets log (timestamp, score, tier, source)
7. Send personalized welcome email via Resend based on tier

OUTPUT: n8n JSON, OpenAI scoring prompt, HubSpot field mapping, email templates`},

  {id:"n8n-monitor",label:"🔔 Site Monitor",tool:"n8n",trigger:"Schedule (every 5 min)",
   desc:"Uptime + competitor price monitoring with AI summary",
   prompt:`Design an n8n site monitoring automation.

TRIGGER: Schedule — every 5 minutes
WORKFLOW — UPTIME CHECK
1. HTTP Request → check your site (expect 200)
2. IF non-200 → PagerDuty alert + Slack #incidents
3. Measure response time → log to Google Sheets

WORKFLOW — COMPETITOR MONITOR (daily)
1. HTTP Request → scrape competitor pricing page
2. OpenAI → extract prices: "Extract pricing tiers as JSON from this HTML: [content]"
3. Compare to previous day's prices in Google Sheets
4. IF any price changed → Slack #competitive-intel with diff summary
5. Weekly → email digest of all price changes

OUTPUT: two n8n JSONs (uptime + competitive), Google Sheets schema, Slack message templates`},

  {id:"make-invoice",label:"💰 Invoice Automation",tool:"Make",trigger:"New row in Airtable",
   desc:"Auto-generate PDF invoice → email → mark paid on webhook",
   prompt:`Design a Make (Integromat) invoice automation scenario.

TRIGGER: Airtable — watch for new rows in Invoices table
SCENARIO
Module 1: Airtable → get invoice data (client, amount, line items, due date)
Module 2: HTML Template → render invoice HTML using data
Module 3: PDF.co or PDFMonkey → convert HTML to PDF
Module 4: Gmail → send to client with PDF attachment
  Subject: "Invoice #{{invoice_id}} from [Company] — Due {{due_date}}"
Module 5: Airtable → update status to "Sent", add sent_at timestamp
Module 6: Wait for webhook (payment provider callback)
Module 7: On payment webhook → Airtable update status to "Paid" + send receipt

RETRY: 3 attempts with exponential backoff on PDF/email failures
OUTPUT: Make scenario JSON blueprint, HTML invoice template, webhook endpoint spec`},

  {id:"mcp-agent",label:"🤖 MCP Agent Pipeline",tool:"MCP",trigger:"User prompt / API call",
   desc:"Claude + MCP tools → autonomous research + write + publish",
   prompt:`Design an MCP agent pipeline for autonomous content research and publishing.

MCP SERVER TOOLS TO BUILD
1. search_web(query) → returns top 5 results with summaries
2. read_url(url) → returns cleaned text content of any URL
3. write_file(path, content) → saves output to filesystem
4. publish_wordpress(title, body, tags) → publishes via WP REST API
5. notify_slack(channel, message) → sends Slack notification

AGENT SYSTEM PROMPT
"You are a content research agent. When given a topic:
1. Search for 5 recent authoritative sources using search_web
2. Read each source using read_url
3. Synthesize key insights (no copying, only synthesis)
4. Write a 1000-word expert article using the insights
5. Save draft with write_file
6. Publish with publish_wordpress
7. Notify #content with notify_slack
Quality bar: every claim must be sourced. No generic advice."

CLAUDE DESKTOP CONFIG
{ "mcpServers": { "content-agent": { "command": "node", "args": ["/path/to/server.js"] } } }

OUTPUT: MCP server implementation, tool definitions, agent system prompt, test harness`},

  {id:"zapier-crm",label:"📊 CRM Sync",tool:"Zapier",trigger:"Multi-trigger",
   desc:"Sync leads across HubSpot, Gmail, Slack, and Google Sheets",
   prompt:`Design Zapier automations for a complete CRM sync system.

ZAP 1 — NEW EMAIL → CRM
Trigger: Gmail — new email matching [your-sales@] recipient
Action 1: Extract sender email + parse company from domain
Action 2: HubSpot — create/update contact
Action 3: Google Sheets — log email thread

ZAP 2 — CRM DEAL STAGE CHANGE
Trigger: HubSpot — deal stage changed
Action 1: Slack — notify #sales with deal name + new stage + owner
Action 2: Google Calendar — if "Demo Scheduled" → create event
Action 3: Gmail — if "Proposal Sent" → send follow-up reminder email in 3 days

ZAP 3 — PAYMENT → ONBOARDING
Trigger: Stripe — payment succeeded
Action 1: HubSpot — mark deal "Closed Won"
Action 2: Slack — notify #wins with amount + client name
Action 3: Notion — create client workspace from template
Action 4: Gmail — send welcome email with onboarding link

OUTPUT: Zapier workflow spec for each Zap, field mapping tables, Gmail filter syntax`},
];

const AI_TOOLS=[
  {id:"oc-agent-fw",label:"Open‌Claw",cat:"Agentic Runtime",tier:"Free / OSS",
   desc:"Open-source AI agent framework — compose tools, memory, and LLM calls",
   usecase:"Autonomous agents, tool-calling pipelines, multi-step AI tasks",
   deploy:"Cloudflare Workers, Fly.io, Railway, or local",
   tip:"Open‌Claw agents are stateless by default — add Cloudflare Durable Objects or Upstash Redis for memory",
   prompt:`Build a production Open‌Claw agent for [use case].

AGENT DEFINITION
// setup: Agent, tool from the agent framework pkg from "open‑claw"

const myAgent = new Agent({
  model: "groq/llama3-70b", // or "ollama/llama3.1", "openrouter/auto"
  systemPrompt: \`You are a [role]. [core instructions]\`,
  tools: [searchTool, writeTool, notifyTool],
  memory: { type: "redis", url: process.env.REDIS_URL }, // optional
  maxSteps: 10,
});

TOOL DEFINITIONS
const searchTool = tool({
  name: "search",
  description: "Search the web for current information",
  schema: z.object({ query: z.string() }),
  execute: async ({ query }) => { /* implementation */ },
});

DEPLOYMENT (Cloudflare Workers)
export default { fetch: myAgent.handle };

OUTPUT: complete agent implementation, tool definitions, wrangler.toml, env template`},

  {id:"zeroclaw",label:"Zero‌Claw",cat:"Zero-Cost Agent",tier:"Free",
   desc:"Zero-cost agent runtime — runs entirely on free tiers (Cloudflare + Groq)",
   usecase:"Cost-zero agent pipelines, edge AI, personal AI tools",
   deploy:"Cloudflare Workers + D1 + AI Gateway",
   tip:"Zero‌Claw's entire stack runs within Cloudflare free tier + Groq free tier. True $0/month for low-traffic agents.",
   prompt:`Build a Zero‌Claw agent that runs at zero cost using Cloudflare + Groq free tiers.

STACK
- Runtime: Cloudflare Workers (free: 100k req/day)
- LLM: Groq API (free: 14k tokens/min, Llama3-70B)
- Memory: Cloudflare D1 (free: 5M reads/day)
- Cache: Cloudflare KV (free: 100k reads/day)
- AI Gateway: Cloudflare AI Gateway (caching + rate limiting)

ZERO-COST ARCHITECTURE
1. Request → Worker → check KV cache (identical queries)
2. Cache miss → Groq API via AI Gateway (caches responses automatically)
3. Agent stores conversation in D1
4. Response → KV cache with 1hr TTL

WRANGLER CONFIG
[ai] binding = "AI"
[[d1_databases]] binding = "DB" database_name = "agent-memory"
[[kv_namespaces]] binding = "CACHE"

OUTPUT: Worker code, D1 schema, wrangler.toml, cost breakdown showing $0 at scale`},

  {id:"nullclaw",label:"Null‌Claw",cat:"Null-State Agent",tier:"Free",
   desc:"Stateless agent design — no memory, no DB, pure function agents",
   usecase:"One-shot tasks, serverless AI functions, API endpoint agents",
   deploy:"Any serverless platform — Vercel, Cloudflare, Netlify",
   tip:"Null‌Claw = function as agent. Input → LLM → output. No state, no session, no DB. Scales infinitely.",
   prompt:`Build a Null‌Claw stateless agent — pure function, no state, scales to infinity.

DESIGN PRINCIPLE
Null‌Claw agents are pure functions: (input, context) → output
No database. No session. No memory. Every call is independent.

IMPLEMENTATION PATTERN
export async function POST(req: Request) {
  const { task, context } = await req.json();
  
  const result = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: AGENT_SYSTEM_PROMPT },
      { role: "user", content: buildPrompt(task, context) }
    ],
    response_format: { type: "json_object" }, // structured output
    temperature: 0.1,
  });
  
  return Response.json(JSON.parse(result.choices[0].message.content));
}

USE CASES
- Document classifier: POST {doc} → {category, confidence, tags}
- Code reviewer: POST {code, lang} → {issues[], suggestions[], score}
- Content scorer: POST {text} → {clarity, engagement, actionability}

OUTPUT: complete implementation, system prompt, request/response schema, load test`},

  {id:"agno",label:"Agno",cat:"Agent Framework",tier:"Free / OSS",
   desc:"Python-native agent framework — multi-model, tool-calling, memory built-in",
   usecase:"Python AI pipelines, data processing agents, research automation",
   deploy:"Railway, Fly.io, Modal, or local",
   tip:"Agno's playground UI lets you test agents in browser before deploying. Use agno serve for local dev.",
   prompt:`Build a production Agno agent for [use case].

SETUP
pip install agno
export GROQ_API_KEY=... # or OPENAI_API_KEY, ANTHROPIC_API_KEY

AGENT DEFINITION
from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.file import FileTools

agent = Agent(
  model=Groq(id="llama-3.3-70b-versatile"),
  tools=[DuckDuckGoTools(), FileTools()],
  instructions=["[your agent instructions]"],
  markdown=True,
  show_tool_calls=True,
  memory=True, # adds conversation memory
)

# Run
agent.print_response("[your task]", stream=True)

# As API
from agno.app.fastapi import AgnoApp
app = AgnoApp(agent=agent).get_app()

OUTPUT: complete agent code, requirements.txt, Railway deploy config, test script`},

  {id:"crewai",label:"CrewAI",cat:"Multi-Agent",tier:"Free / OSS",
   desc:"Multi-agent orchestration — define crews of specialized AI agents",
   usecase:"Complex multi-step tasks requiring specialized roles, research → write → review pipelines",
   deploy:"Railway, Modal, or local Python",
   tip:"Define agents with distinct roles and verbose=True for debugging. Use sequential process for predictable pipelines.",
   prompt:`Build a CrewAI multi-agent crew for [use case].

CREW DEFINITION
from crewai import Agent, Task, Crew, Process

# Define agents
researcher = Agent(
  role="Senior Research Analyst",
  goal="Uncover cutting-edge developments in [domain]",
  backstory="Expert researcher with 10 years in [domain]",
  tools=[search_tool, scrape_tool],
  verbose=True
)

writer = Agent(
  role="Content Strategist",
  goal="Create compelling, accurate content",
  backstory="Expert writer who transforms research into engaging content",
  verbose=True
)

reviewer = Agent(
  role="Quality Reviewer",
  goal="Ensure accuracy, clarity, and strategic alignment",
  backstory="Senior editor with high standards",
  verbose=True
)

# Define tasks
research_task = Task(description="Research [topic]...", agent=researcher, expected_output="...")
write_task = Task(description="Write [deliverable]...", agent=writer, expected_output="...")
review_task = Task(description="Review and refine...", agent=reviewer, expected_output="...")

# Assemble crew
crew = Crew(agents=[researcher, writer, reviewer], tasks=[research_task, write_task, review_task], process=Process.sequential)
result = crew.kickoff()

OUTPUT: complete crew definition, tool implementations, .env template, run script`},
];

const MONETIZE_RECIPES=[
  {id:"saas-ai-mvp",label:"SaaS AI MVP in 1 Weekend",cat:"Build",time:"48hrs",income:"$0→$500/mo",
   stack:"Next.js + Supabase + Groq + Stripe + Vercel",
   steps:["Day 1 AM: Validate idea — search 'alternatives to X', find painful friction","Day 1 PM: Build auth + DB schema + core feature only (not landing page)","Day 1 Eve: Deploy to Vercel free, share in 2 relevant communities","Day 2 AM: Build landing page + pricing ($9–29/mo free trial)","Day 2 PM: Set up Stripe subscription + webhook handler","Day 2 Eve: Submit to ProductHunt for next day, post on Twitter/X"],
   prompt:`You are a senior full-stack developer. Build a complete SaaS MVP in 48 hours.

PRODUCT: [your idea — one sentence]
STACK: Next.js 15 + Supabase + Groq (free AI) + Stripe + Vercel

SATURDAY BUILD LIST (in order, no skipping)
1. Supabase: users table + core entity table + RLS policies
2. Auth: email+password + Google OAuth via Supabase Auth
3. Core feature: [the one thing that makes this worth paying for]
4. Usage tracking: count API calls per user_id per day
5. Free tier gate: if usage > limit → show upgrade prompt

SUNDAY BUILD LIST
1. Stripe: create Product + Price ($X/mo) + webhook endpoint
2. Billing page: current plan + usage + upgrade button
3. Landing page: hero + 3 benefits + pricing + social proof placeholder
4. Deploy: push to GitHub → Vercel import → add env vars → live URL

ENV REQUIRED: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, GROQ_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

OUTPUT: Complete source code, schema.sql, stripe-webhook.ts, .env.example, deploy checklist`},

  {id:"prompt-pack-sell",label:"Prompt Pack → First Sale in 48hrs",cat:"Sell",time:"48hrs",income:"$9–99/sale",
   stack:"Gumroad + Notion/PDF + Twitter/Reddit",
   steps:["Hour 1: Pick niche (marketing, coding, design, real estate, law)","Hour 2: Write 10 prompts — title + copy-ready prompt + pro tip each","Hour 3: Format in Notion or Canva, export as PDF","Hour 4: Create Gumroad listing ($9–29), write 5-bullet description","Hour 5: Post 1 example prompt on Twitter + 2 relevant subreddits","Hour 6-48: Reply to every comment, iterate based on feedback"],
   prompt:`Create a 10-prompt pack I can sell on Gumroad for $[price].

NICHE: [e.g. real estate agents, UX designers, e-commerce brands]
PRICE: [$9 / $19 / $29]

For each of the 10 prompts, output exactly:
TITLE: [outcome-focused, ≤8 words]
USE CASE: [one sentence — when would someone use this]
PROMPT: [the full copy-paste ready prompt with [BRACKET] variables]
PRO TIP: [the one thing that makes this prompt 10x better]
COMMON MISTAKE: [what beginners get wrong when using this]

FORMAT: numbered 1-10, ready to paste into Gumroad product description
QUALITY BAR: each prompt must be immediately usable without modification`},

  {id:"newsletter-monetize",label:"Newsletter → $1k/mo in 90 Days",cat:"Grow",time:"90 days",income:"$1k–5k/mo",
   stack:"Beehiiv (free) + Twitter + Reddit + Gumroad",
   steps:["Week 1: Pick sub-niche (not 'AI' — 'AI tools for therapists')","Week 1: Write 3 issues, set up Beehiiv, publish all 3 back-to-back","Week 2-4: Post 1 thread/week showing your research process","Month 2: Launch referral program (Beehiiv native, free)","Month 2: Create $19 resource pack for subscribers only","Month 3: Pitch sponsors once you hit 500 subscribers (CPM $20-40)"],
   prompt:`Design a newsletter monetization system for [niche].

NEWSLETTER: [name] — [one sentence description]
PLATFORM: Beehiiv (free tier, 2500 subscribers)
NICHE: [ultra-specific — not 'marketing' but 'email marketing for SaaS founders']

MONETIZATION STACK (in order of when to activate)
Month 1 — Audience building: paid nothing, focus on subscribers
Month 2 — Digital product: $19 resource pack for first 100 subscribers
Month 3 — Sponsorships: pitch when >500 subs, $25 CPM starting rate
Month 4 — Paid tier: $9/mo for bonus deep-dives + template library
Month 6 — Community: $29/mo Discord or Slack for peer networking

CONTENT SYSTEM (weekly, AI-assisted)
Monday: Research 3-5 sources on this week's topic
Tuesday: Draft with AI — "Write a newsletter issue about [topic] for [avatar]. Hook in first line. 3 insights. 1 tool recommendation. 1 question to spark replies."
Wednesday: Edit for brand voice (30 min max) + schedule

GROWTH LOOPS
Referral: 3 referrals = free resource pack (Beehiiv native)
Cross-promo: DM 5 newsletters at same size, propose mutual shoutout
Lead magnet: [specific 1-page resource that makes someone subscribe immediately]

OUTPUT: Complete content calendar (4 weeks), sponsor pitch template, referral reward structure`},

  {id:"agency-to-saas",label:"Agency → SaaS Transition Playbook",cat:"Scale",time:"6 months",income:"$5k→$20k MRR",
   stack:"n8n + OpenAI + Supabase + Stripe + Vercel",
   steps:["Month 1: Document the most-repeated deliverable from client work","Month 2: Build v1 as internal tool (use it yourself first)","Month 3: Offer to 3 existing clients at 50% discount for feedback","Month 4: Launch publicly at full price, keep 2 agency clients","Month 5: Hire 1 part-time support person using SaaS revenue","Month 6: Drop last agency clients, go SaaS-only"],
   prompt:`Design a 6-month plan to transition from agency services to a SaaS product.

MY AGENCY: [what service I sell, to whom, at what price]
MOST REPEATED WORK: [the deliverable I build over and over for clients]
SAAS IDEA: [how to productize that deliverable]

MONTH-BY-MONTH PLAN
Month 1: Document the repeatable process as an SOP. Build v1 yourself.
Month 2: Run the SaaS for 5 beta users (existing clients, 0 cost). Collect weekly feedback.
Month 3: Fix top 3 pain points from beta. Set pricing: [free trial → $X/mo paid].
Month 4: Launch to waitlist. Keep 3 agency clients as revenue bridge.
Month 5: First $1k MRR milestone. Hire 1 support person ($500/mo part-time).
Month 6: MRR covers all expenses. Drop all agency work. SaaS-first.

MILESTONE GATES (don't advance until met)
Month 1→2: SOP documented, v1 deployed to production
Month 2→3: 5 beta users actively using weekly
Month 3→4: 3 users willing to pay real money
Month 4→5: $1k MRR (break-even with basic expenses)
Month 5→6: $3k MRR (can afford 1 hire)

OUTPUT: Month-by-month action plan, pricing tiers, beta user recruitment script, first 10 customer acquisition tactics`},

  {id:"mcp-to-product",label:"MCP Tool → Paid Product",cat:"Build",time:"2 weeks",income:"$29–99/mo",
   stack:"MCP SDK + Node.js + Stripe + Vercel",
   steps:["Day 1: Identify a workflow Claude Desktop users repeat 10+ times/week","Day 2: Build MCP server with 3-5 tools that solve that workflow","Day 3-4: Test with 5 beta users from Claude Discord/Reddit","Day 5: Package as npm package or hosted API","Week 2: Add Stripe paywall, launch on MCP marketplace + ProductHunt"],
   prompt:`Build a monetizable MCP tool and package it as a paid product.

WORKFLOW TO SOLVE: [what repetitive task this MCP tool automates]
TARGET USER: Claude Desktop power users in [role/industry]
PRICE: [$29/mo or $99 lifetime]

MCP SERVER IMPLEMENTATION
// const { Server } = mcpSdk.server;
// const { StdioServerTransport } = mcpSdk.stdio;

const server = new Server({ name: "my-tool", version: "1.0.0" }, { capabilities: { tools: {} } });

TOOLS TO BUILD (3-5 focused tools)
Tool 1: [primary action — the main thing users will call]
Tool 2: [secondary action — supports tool 1]
Tool 3: [output/save action — writes results somewhere]

MONETIZATION OPTIONS
Option A: npm package with API key validation ($5/mo for key)
Option B: Hosted server with OAuth + usage tracking ($X/mo subscription)
Option C: GitHub Sponsors + open-source with pro features

CLAUDE DESKTOP CONFIG
{ "mcpServers": { "my-tool": { "command": "npx", "args": ["-y", "my-mcp-tool@latest"] } } }

OUTPUT: Complete MCP server, tool definitions, npm package.json, pricing page copy, README`},
  {id:"consulting-to-product",label:"Consulting → Productized Offer",cat:"Pivot",time:"4 weeks",income:"$2k–10k/project",
   stack:"Notion + Loom + Stripe + Calendly",
   steps:["Week 1: List every recurring deliverable you've made for clients in the past year","Week 1: Pick the one you could template 80% of. That's your productized service.","Week 2: Build a scoping questionnaire (10 questions) that captures 80% of what you need","Week 2: Write the proposal template (problem → solution → timeline → investment)","Week 3: Build the delivery system: Notion client portal + Loom for async updates","Week 4: Set price (3× your hourly × expected hours). No negotiation on scope."],
   prompt:`Productize my consulting service into a fixed-scope, fixed-price offer.

MY CURRENT SERVICE: [what I do, who I do it for, what I charge]
MOST COMMON DELIVERABLE: [the thing clients always end up needing]

PRODUCTIZED OFFER DESIGN
Service name: [outcome + timeframe, e.g. "90-Day AI Automation Audit & Build"]
Deliverable: [exact output — must be tangible and scoped]
Timeline: [X weeks, fixed. No extensions without new contract.]
Price: [$X flat. State it clearly, never hourly.]
Includes: [5 bullet points maximum — be specific]
Excludes: [what's out of scope — protect yourself]

CLIENT PORTAL (Notion)
Page 1: Project brief + goals + success metrics
Page 2: Timeline + milestone tracker
Page 3: Deliverables (with status: In Progress / Review / Complete)
Page 4: Resources + assets + recordings
Page 5: Final handoff + how to maintain

SALES PAGE STRUCTURE
Hero: [Name of service] → [what they get] → [in how long] → [$X]
Problem: 3 bullets of pain they feel right now
Solution: What you do and why it works
Process: 3-step visual (Onboard → Build → Deliver)
Proof: 2-3 results from past clients
CTA: [Book a Scoping Call] → 30 min → qualify → send proposal

OUTPUT: Service one-pager, proposal template, client portal structure, scoping call script`},

  {id:"open-source-monetize",label:"Open Source → Revenue",cat:"Build",time:"6 months",income:"$500–20k/mo",
   stack:"GitHub + Polar.sh + Lemon Squeezy + GitHub Sponsors",
   steps:["Build a tool that solves YOUR problem. Use it daily. Make it great.","Launch on GitHub with exceptional README (screenshots, demo GIF, 5-command install).","Post on Hacker News Show HN, relevant Reddit, and Twitter. Engage every reply.","Month 2: Add 'Sponsor' button. Reach out to companies who use your tool.","Month 3: Pro features — hosted version, priority support, team features.","Month 6: Offer commercial license for organizations ($X/yr per seat)."],
   prompt:`Design a monetization strategy for my open-source project.

PROJECT: [name, what it does, who uses it]
GITHUB STARS: [current count]
MONTHLY DOWNLOADS/INSTALLS: [if npm/pip/brew]
COMPANIES USING IT: [known or suspected — check GitHub dependency graph]

MONETIZATION TIERS (in order of when to launch)
Free: Core tool, always open-source, MIT or Apache license
Sponsor: [GitHub Sponsors / Polar.sh] — $5–50/mo from individuals + companies
Pro: Hosted version or cloud service — $X/mo (removes self-hosting burden)
Enterprise: Commercial license + SLA + priority support — $X/yr per seat

GITHUB README OPTIMIZATION
Top 3 badges: stars, license, latest version
Hero section: one GIF showing the most impressive feature
Install: 1 command. No prerequisites listed first.
Quickstart: working example in <5 minutes
Sponsor button: above the fold, specific ask ("$9/mo keeps this maintained")

COMPANY OUTREACH
Find companies: GitHub dependency graph → who imports your package?
Email template: "Hi [name], I noticed [company] uses [tool] in [repo]. 
I'm the maintainer. Would [company] consider sponsoring at $X/mo 
to ensure continued maintenance? It helps me prioritize your issues."

OUTPUT: README rewrite, sponsor page copy, pricing tiers, company outreach email, Polar.sh configuration`},

  {id:"ai-wrapper-saas",label:"AI API Wrapper → SaaS",cat:"Build",time:"1 weekend",income:"$500–5k/mo MRR",
   stack:"Next.js + OpenRouter/Groq + Supabase + Stripe + Vercel",
   steps:["Pick one AI capability that businesses need but can't build themselves","Add a simple UI + prompt engineering on top — that's your moat","Free tier: 10 requests/day. Paid: $19/mo unlimited. Upsell: API access $49/mo.","SEO: write 20 blog posts targeting '[your tool] alternative' keywords","Build one integration (Zapier, Make, Slack) — distribution multiplier","Month 3: Add team features (shared history, custom prompts) → $49/mo team tier"],
   prompt:`Build a monetizable AI API wrapper with credit-based billing.

CAPABILITY TO WRAP: [e.g. AI writing assistant for legal documents, AI image describer for e-commerce, AI code reviewer for GitHub PRs]
TARGET CUSTOMER: [who has this problem and will pay $19-99/mo to solve it?]
MOAT: [what makes your prompts / UX better than just using ChatGPT directly?]

TECH STACK
Backend: Next.js API routes
LLM: OpenRouter (free models available) or Groq (free tier)
Database: Supabase (credits table, usage tracking)
Auth: Supabase Auth
Payments: Stripe (subscription + credit top-up)
Deploy: Vercel (free tier)

CREDIT SYSTEM
1 credit = 1 API call (or 1k tokens — pick one, be consistent)
Free tier: 20 credits/day (no card required — maximize top of funnel)
Starter: $9/mo — 500 credits/mo
Pro: $29/mo — 2000 credits/mo + API access
Teams: $79/mo — 10k credits + 5 seats + custom system prompt

DATABASE SCHEMA
users: id, email, stripe_customer_id, plan
credits: id, user_id, amount, type (subscription|topup|usage), created_at
api_keys: id, user_id, key_hash, name, last_used_at, is_active

STRIPE SETUP
Product 1: Starter ($9/mo) → webhook: add 500 credits
Product 2: Pro ($29/mo) → webhook: add 2000 credits
Credit top-up: $5 = 100 credits (one-time payment)
Webhook: invoice.paid → add credits. customer.subscription.deleted → downgrade.

OUTPUT: Complete source code, Supabase schema + RLS, Stripe webhook handler, usage tracking middleware, pricing page copy, SEO blog post outline`},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Cp({text,sm=true,label}){
  const[ok,set]=useState(false);
  const copy=useCopy();
  const go=()=>{copy(text);set(true);setTimeout(()=>set(false),1800);};
  return <button onClick={go} style={{background:ok?"#22c55e18":"#ffffff08",border:`1px solid ${ok?"#22c55e55":"#ffffff18"}`,color:ok?C.gn:C.mu,borderRadius:6,padding:sm?"3px 10px":"8px 16px",fontSize:sm?10:12,fontFamily:C.mn,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.05em",whiteSpace:"nowrap",flexShrink:0}}>{ok?"✓ COPIED":(label||"COPY")}</button>;
}
function Lbl({text,color=C.cy}){return <div style={{fontSize:10,color,fontFamily:C.mn,letterSpacing:"0.12em",marginBottom:5,textTransform:"uppercase"}}>{text}</div>;}
function H3({children}){return <h3 style={{margin:"0 0 14px",fontSize:"clamp(14px,2vw,17px)",fontWeight:700,color:C.tx,letterSpacing:"-0.02em",fontFamily:C.ss}}>{children}</h3>;}
function Card({children,accent,pad="18px 20px",sx={}}){return <div style={{background:C.sur,border:`1px solid ${accent?accent+"22":C.bdr}`,borderRadius:12,padding:pad,...sx}}>{children}</div>;}
function Code({text,mh}){return(<div style={{position:"relative"}}><pre style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"12px 44px 12px 13px",fontSize:"clamp(10px,1.4vw,12px)",lineHeight:1.75,color:"#e4e4e7",fontFamily:C.mn,whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:mh||"none",overflowY:mh?"auto":"visible"}}>{text}</pre><div style={{position:"absolute",top:8,right:8}}><Cp text={text}/></div></div>);}
function Pill({label,active,color,onClick}){return <button onClick={onClick} style={{background:active?`${color}18`:"transparent",border:`1px solid ${active?color+"55":C.bdr}`,color:active?color:C.di,borderRadius:20,padding:"4px 11px",fontSize:"clamp(10px,1.4vw,11px)",fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",lineHeight:1.6}}>{label}</button>;}
function Inp({label,value,onChange,ph}){return(<div style={{marginBottom:10}}>{label&&<div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:4}}>{label}</div>}<input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px",color:C.tx,fontSize:13,fontFamily:C.ss,outline:"none"}}/></div>);}
function TA({label,value,onChange,ph,rows=4}){return(<div style={{marginBottom:10}}>{label&&<div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:4}}>{label}</div>}<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px",color:C.tx,fontSize:12,fontFamily:C.mn,outline:"none",resize:"vertical",lineHeight:1.6}}/></div>);}

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
function Activate(){
  const[tT,setTT]=useState(0);
  const[tM,setTM]=useState(0);
  const[tmplKey,setTmplKey]=useState(0);
  const[modCat,setModCat]=useState("All");
  const[modQ,setModQ]=useState("");
  const setTemplate=(i)=>{setTM(i);setTmplKey(k=>k+1);};

  // Group templates by category for scanability
  const TMPL_CATS=[
    {label:"📋 Templates",range:[0,5]},
    {label:"📐 Meta Prompts",range:[6,8]},
    {label:"🏢 Brand Systems",range:[9,14]},
  ];
  const getCatIdx=(i)=>TMPL_CATS.findIndex(c=>i>=c.range[0]&&i<=c.range[1]);

  return(<div style={{display:"grid",gap:14}}>
    <Card>
      <Lbl text="Paste into any AI system prompt field"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><H3>Master System Prompt</H3><Cp text={MASTER} sm={false}/></div>
      <Code text={MASTER} mh={240}/>
    </Card>
    <Card>
      <Lbl text="Add at session start for high-stakes work"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><H3>Advocate Mode</H3><Cp text={ADVOCATE} sm={false}/></div>
      <Code text={ADVOCATE}/>
    </Card>
    <Card>
      <Lbl text="Append to any prompt to boost output quality"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <H3>Secret Sauce Modifiers</H3>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><input value={modQ} onChange={e=>setModQ(e.target.value)} placeholder="search…" style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:6,padding:"3px 8px",color:C.tx,fontSize:11,fontFamily:C.mn,outline:"none",width:110}}/><span style={{fontSize:10,color:C.di,fontFamily:C.mn}}>{MODS.filter(m=>(modCat==="All"||m.cat===modCat)&&(!modQ||m.mod.toLowerCase().includes(modQ.toLowerCase())||m.tip.toLowerCase().includes(modQ.toLowerCase()))).length}</span></div>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
        {["All",...new Set(MODS.map(m=>m.cat))].map(c=><Pill key={c} label={c==="All"?"All ("+MODS.length+")":c} active={modCat===c} color={C.cy} onClick={()=>setModCat(c)}/>)}
      </div>
      <div style={{marginBottom:8}}>
        <Cp text={MODS.filter(m=>(modCat==="All"||m.cat===modCat)&&(!modQ||m.mod.toLowerCase().includes(modQ.toLowerCase())||m.tip.toLowerCase().includes(modQ.toLowerCase()))).map(m=>m.mod).join("\n")} label={"COPY ALL "+MODS.filter(m=>(modCat==="All"||m.cat===modCat)&&(!modQ||m.mod.toLowerCase().includes(modQ.toLowerCase())||m.tip.toLowerCase().includes(modQ.toLowerCase()))).length} sm={false}/>
      </div>
      <div style={{display:"grid",gap:6}}>
        {MODS.filter(m=>(modCat==="All"||m.cat===modCat)&&(!modQ||m.mod.toLowerCase().includes(modQ.toLowerCase())||m.tip.toLowerCase().includes(modQ.toLowerCase()))).map((m,i)=>(
          <div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:4}}>
              <span style={{color:C.cy,fontFamily:C.mn,fontSize:11,lineHeight:1.5,flex:1}}>{m.mod}</span>
              <Cp text={m.mod}/>
            </div>
            <div style={{fontSize:11,color:C.di,lineHeight:1.4}}>💡 {m.tip}</div>
          </div>
        ))}
      </div>
    </Card>
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0}}><div><Lbl text="Grab-and-go for common session types"/><H3>Task-Specific Prompts</H3></div><span style={{fontSize:11,color:C.di,fontFamily:C.mn}}>{TASKS.length} tasks</span></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {TASKS.map((t,i)=><Pill key={i} label={t.label} active={tT===i} color={C.cy} onClick={()=>setTT(i)}/>)}
      </div>
      <Code text={TASKS[tT].content}/>
    </Card>
    <Card>
      <Lbl text="Templates · Meta Prompts · Brand Systems — all copy-ready" color={C.am}/>
      <H3>Prompt Templates</H3>
      {TMPL_CATS.map((cat,ci)=>(
        <div key={ci} style={{marginBottom:12}}>
          <div style={{fontSize:9,color:C.di,fontFamily:C.mn,letterSpacing:"0.12em",marginBottom:6,paddingBottom:4,borderBottom:`1px solid ${C.bdr}`}}>{cat.label}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {TMPLS.slice(cat.range[0],cat.range[1]+1).map((t,j)=>{
              const idx=cat.range[0]+j;
              return <Pill key={idx} label={t.label} active={tM===idx} color={C.am} onClick={()=>setTemplate(idx)}/>;
            })}
          </div>
        </div>
      ))}
      <div style={{fontSize:12,color:C.di,marginBottom:8,marginTop:4}}>{TMPLS[tM]?.desc}</div>
      <div key={tmplKey} className="anim-pop">
        <Code text={TMPLS[tM]?.content||""} mh={280}/>
      </div>
      <div style={{marginTop:10}}><Cp sm={false} label="COPY IMPROVEMENT PROMPT" text={"My prompt scored "+avg+"/10.\n\nWEAK AREAS:\n"+SDIMS.filter(d=>sc[d.name]<7).map(d=>"- "+d.name+" ("+sc[d.name]+"/10): "+d.what).join("\n")+"\n\nGRADE: "+grade.level+" -- "+grade.action+"\n\nRewrite my prompt to fix these weaknesses. Output the improved prompt only."}/></div>
    </Card>
  </div>);
}

// ─── BUILD ────────────────────────────────────────────────────────────────────
const BNAV=[
  {id:"animals",label:"🐾 Animals"},{id:"8layer",label:"8 Layers"},
  {id:"enhance",label:"Enhancement"},
  {id:"webapp",label:"Web App"},{id:"json",label:"JSON / Output"},
  {id:"vocab",label:"Design Vocab"},
  {id:"composer",label:"🏗 Composer"},{id:"wfbuilder",label:"⚡ WF Builder"},
  {id:"diff",label:"⚖️ Diff"},
];

function Build(){
  const[s,setS]=useState("animals");
  const[aT,setAT]=useState(0);
  const[loOpen,setLoOpen]=useState(false);
  const[layerSel,setLayerSel]=useState(0);
  const[eT,setET]=useState(0);
  const[showHow,setShowHow]=useState(false);
  const[wAud,setWAud]=useState(0);
  const[wFw,setWFw]=useState(0);
  const[wAe,setWAe]=useState([]);
  const[wGoal,setWGoal]=useState("");
  const[wPrompt,setWPrompt]=useState("");
  const[jT,setJT]=useState("t1");
  const[jMxSel,setJMxSel]=useState(null);
  const[jMxPrompt,setJMxPrompt]=useState("");
  const[vCat,setVCat]=useState("all");
  const[vQ,setVQ]=useState("");
  const[vView,setVView]=useState("terms");
  const[chainSel,setChainSel]=useState(null);
  const[chainPrompt,setChainPrompt]=useState("");
  const[chainTopic,setChainTopic]=useState("");
  const[animKey,setAnimKey]=useState(0);
  const switchSection=(id)=>{setS(id);setAnimKey(k=>k+1);};

  const AEST_OPTS=["dark-mode native","glassmorphism","neo-brutalism","neon accent","bento grid","kinetic typography","aurora gradients","minimal + editorial","Three.js 3D","GSAP cinematic"];
  const FWS=["Next.js + Tailwind + Framer Motion","Next.js + Tailwind + GSAP","React + Vite + Framer Motion","SvelteKit + Tailwind","Astro 4","React Native + Expo","Flutter 3"];
  const FW_NOTES=["Full-stack SSR, SEO-ready, shadcn/ui","Animation-heavy, cinematic scroll","SPA, fast dev, Radix UI","Tiny bundle, Svelte transitions","Content-first, 0kb JS default","Cross-platform mobile, Reanimated 3","Native mobile, Rive + Lottie"];

  const toggleAe=(a)=>{setWAe(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a].slice(0,4));};
  const buildWP=(g=wGoal,a=wAud,f=wFw,ae=wAe)=>{
    const fw=FWS[f];const fwn=FW_NOTES[f];const auds=WEB_VARS.map(v=>v.label);
    const ael=ae.length?ae.join(" | "):"dark-mode native | neon-accent sparse | typography-first";
    return `You are a senior full-stack developer and product designer.\n\nROLE: ${auds[a]||"DEVELOPER"} perspective\nGOAL: ${g.trim()||"[Describe your app in one sentence]"}\n\nTECHNICAL STACK\n- Framework: ${fw}\n- Notes: ${fwn}\n\nFUNCTIONAL REQUIREMENTS\n- Dynamic UI components\n- Mobile-first responsive layout\n- Interactive sections with user feedback\n- Modular, reusable component architecture\n\nUI/UX DESIGN LANGUAGE\n${ae.length?ae.map(x=>"- "+x).join("\n"):"- Ultra-modern aesthetic\n- High-contrast typography\n- Smooth micro-interactions"}\n- Dark/light adaptive themes\n\nCONSTRAINTS\n- Mobile-first always\n- WCAG AA minimum\n- 60fps animation budget\n- No Lorem ipsum · No SaaS clichés\n\nAESTHETIC LOCK\n${ael}\n\nOUTPUT FORMAT\n1. Project folder structure\n2. Full source code (all files)\n3. Run instructions (3 commands)\n4. Key architectural decisions`;
  };
  const buildChainP=(ch,topic)=>{
    return ch.c.map((name,i)=>{const a=ANIMALS.find(x=>x.name===name);return `STEP ${i+1} — ${a.emoji} ${name.toUpperCase()} (${a.mode})\n${a.prompt}\n\nApply to: ${topic||"[your topic]"}`;}).join("\n\n---\n\n");
  };
  const buildJMxP=(row)=>{
    return [JSON_GLOBAL,...row.ids.map(id=>JSON_T.find(t=>t.id===id).content)].join("\n\n---\n\n");
  };

  const LAYER_SNIPS=[
    "You are a senior [role] with 10+ years of experience building [domain] products.\nYou write for practitioners, not beginners. Skip the preamble.",
    "Product: [name] — a [category] tool for [target user]\nPlatform: [web / mobile / hybrid]\nAudience: [role, skill level, goals]\nExisting stack: [tech already in use]",
    "Build a [deliverable] that [specific outcome].\nSuccess criteria:\n- [measurable criterion 1]\n- [measurable criterion 2]\n- [measurable criterion 3]",
    "- Mobile-first, tested at 375px minimum\n- WCAG AA contrast (4.5:1 text, 3:1 UI)\n- 60fps animation budget — no layout thrash\n- Bundle: <200kb JS initial load",
    "Visual style: [glassmorphism | neo-brutalism | editorial | minimal]\nTypography: [display] + [body] + [mono]\nMotion: [subtle | expressive | cinematic]\nColor mood: [dark-native | high-contrast | muted]",
    "Before generating, reason through:\n1. Information architecture — what exists and in what order?\n2. Navigation model — how does the user move?\n3. Layout grid — columns, gutters, breakpoints\n4. Interaction model — what responds to user input?\n5. Performance plan — what is lazy-loaded?",
    "OUTPUT FORMAT\nGenerate:\n1. [primary file] — complete, no TODOs\n2. [secondary file] — complete\n3. Run instructions (3 commands max)\n4. One-paragraph architectural decisions\n\nDo NOT generate: placeholder comments, lorem ipsum, mock data stubs",
    "After generating the first draft:\n1. Critique: Does each section earn its place?\n2. Refine structure: Is hierarchy readable at a glance?\n3. Refine polish: Does every interactive element have a state?\n4. Final check: Would a senior engineer approve this PR?\nOutput the final version only — no commentary.",
  ];

  const anim="@keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes popIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}";

  return(<div>
    <style>{anim}</style>
    <div style={{marginBottom:4,fontSize:11,color:C.di}}>Select a tool section below:</div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18,paddingBottom:14,borderBottom:"1px solid "+C.bdr}}>
      {BNAV.map(n=>{
      const counts={
        animals:ANIMALS.length,
        "8layer":LAYERS.length,
        enhance:ENH.length,
        webapp:WEB_VARS.length,
        json:JSON_T.length,
        vocab:VOCAB.length,
        composer:8,
        wfbuilder:CHAINS.length,
        diff:4,
      };
      const cnt=counts[n.id];
      return <Pill key={n.id} label={n.label+(cnt?" ("+cnt+")":"")} active={s===n.id} color={C.am} onClick={()=>switchSection(n.id)}/>;
    })}
    </div>
    <div key={animKey} style={{animation:"fadeSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)"}}>

    {s==="animals"&&<div style={{display:"grid",gap:14}}>
      <Card accent={C.vi}>
        <Lbl text='Trigger by name: "Apply Owl Mode" / "Think like a Beaver"' color={C.vi}/>
        <H3>Animal Thinking Modes</H3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {ANIMALS.map((a,i)=><button key={i} onClick={()=>setAT(i)} style={{background:aT===i?`${AC[a.name]}18`:"transparent",border:`1px solid ${aT===i?AC[a.name]+"55":C.bdr}`,color:aT===i?AC[a.name]:C.di,borderRadius:10,padding:"7px 13px",cursor:"pointer",fontSize:13,transition:"all 0.2s",transform:aT===i?"scale(1.03)":"scale(1)"}}>{a.emoji} {a.name}</button>)}
        </div>
        <div style={{fontSize:10,color:AC[ANIMALS[aT].name],fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:6}}>{ANIMALS[aT].mode.toUpperCase()}</div>
        <Code text={ANIMALS[aT].prompt}/>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><Lbl text="Click a chain to generate its combined prompt"/><span style={{fontSize:10,color:C.di,fontFamily:C.mn}}>{CHAINS.length} chains</span></div>
        <H3>Mode Chains</H3>
        <div style={{marginBottom:10}}>
          <Inp label="Topic (optional — personalizes the prompt)" value={chainTopic} onChange={setChainTopic} ph="e.g. Launch a SaaS product, Design an onboarding flow"/>
        </div>
        <div style={{display:"grid",gap:8,marginBottom:chainPrompt?14:0}}>
          {CHAINS.map((ch,i)=><div key={i} onClick={()=>{setChainSel(i);setChainPrompt(buildChainP(ch,chainTopic));}} style={{background:chainSel===i?`${C.vi}12`:C.bg,border:`1px solid ${chainSel===i?C.vi+"55":C.bdr}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",transition:"all 0.18s",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,transform:chainSel===i?"translateX(3px)":"none"}}>
            <span style={{color:C.tx,fontWeight:600,fontSize:13}}>{ch.goal}</span>
            <span style={{fontFamily:C.mn,fontSize:15,color:C.am}}>{ch.c.map(n=>AE[n]).join(" → ")}</span>
            <span style={{fontSize:11,color:C.di}}>{ch.best}</span>
          </div>)}
        </div>
        {chainPrompt&&<div style={{animation:"popIn 0.2s ease-out"}}>
          <div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>✓ COMBINED CHAIN PROMPT</div>
          <Code text={chainPrompt} mh={300}/>
        </div>}
      </Card>
    </div>}

    {s==="8layer"&&<div style={{display:"grid",gap:14}}>
      <Card accent={C.vi}>
        <Lbl text="Universal structure — click each layer to get its copy-ready snippet" color={C.vi}/>
        <H3>8-Layer Prompt Architecture</H3>
        <div style={{fontFamily:C.mn,fontSize:12,color:C.mu,marginBottom:16,background:C.bg,borderRadius:8,padding:"10px 14px",letterSpacing:"0.04em"}}>ROLE → CONTEXT → OBJECTIVE → CONSTRAINTS → AESTHETIC → PLANNING → OUTPUT → REFINEMENT</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {LAYERS.map((l,i)=><Pill key={l.n} label={`${l.n} ${l.name}`} active={layerSel===i} color={C.vi} onClick={()=>setLayerSel(i)}/>)}
        </div>
        <div key={layerSel} style={{background:C.bg,border:`1px solid ${C.vi}30`,borderRadius:10,padding:"14px",marginBottom:14,animation:"popIn 0.18s ease-out"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontSize:10,color:C.vi,fontFamily:C.mn,marginBottom:3}}>LAYER {LAYERS[layerSel].n} — {LAYERS[layerSel].name.toUpperCase()}</div>
              <div style={{fontWeight:600,color:C.tx,marginBottom:2}}>{LAYERS[layerSel].pur}</div>
              <div style={{fontSize:11,color:C.rd,fontFamily:C.mn}}>Missing → {LAYERS[layerSel].miss}</div>
            </div>
            <Cp text={LAYER_SNIPS[layerSel]} sm={false} label="COPY SNIPPET"/>
          </div>
          <Code text={LAYER_SNIPS[layerSel]}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:16}}>
          {LAYERS.map((l,i)=><div key={l.n} onClick={()=>setLayerSel(i)} style={{background:layerSel===i?`${C.vi}12`:C.bg,border:`1px solid ${layerSel===i?C.vi+"44":C.bdr}`,borderRadius:9,padding:"10px 12px",cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:10,color:C.vi,fontFamily:C.mn,marginBottom:3}}>LAYER {l.n}</div>
            <div style={{fontWeight:700,color:C.tx,fontSize:13,marginBottom:2}}>{l.name}</div>
            <div style={{fontSize:11,color:C.mu}}>{l.pur}</div>
          </div>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:12,color:C.di}}>Complete 8-Layer Template</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setLoOpen(o=>!o)} style={{background:"transparent",border:`1px solid ${C.bdr}`,color:C.mu,borderRadius:6,padding:"4px 12px",fontSize:11,fontFamily:C.mn,cursor:"pointer"}}>{loOpen?"HIDE":"SHOW"}</button>
            {loOpen&&<Cp text={LAYER_TPL}/>}
          </div>
        </div>
        {loOpen&&<Code text={LAYER_TPL} mh={300}/>}
      </Card>
    </div>}

    {s==="enhance"&&<Card>
      <Lbl text="7 protocols — snippet + how-to guide per protocol"/>
      <H3>Enhancement Protocols</H3>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {ENH.map((e,i)=><Pill key={i} label={e.label} active={eT===i} color={C.mg} onClick={()=>setET(i)}/>)}
      </div>
      {ENH[eT].when&&<div style={{background:C.bg,border:"1px solid "+C.vi+"22",borderRadius:8,padding:"7px 12px",marginBottom:10,fontSize:11,color:C.di}}><span style={{color:C.vi,fontFamily:C.mn,fontSize:10}}>BEST WHEN: </span>{ENH[eT].when}</div>}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        <Pill label="Prompt Snippet" active={!showHow} color={C.vi} onClick={()=>setShowHow(false)}/>
        <Pill label="📖 How to Use" active={showHow} color={C.am} onClick={()=>setShowHow(true)}/>
      </div>
      <div key={`${eT}-${showHow}`} style={{animation:"popIn 0.18s ease-out"}}>
        <Code text={showHow?(ENH[eT].howto||ENH[eT].content):ENH[eT].content} mh={400}/>
      </div>
    </Card>}

    {s==="webapp"&&<div style={{display:"grid",gap:14}}>
      <Card accent={C.cy}>
        <Lbl text="Configure your app — prompt updates live as you select" color={C.cy}/>
        <H3>Web App Prompt Generator</H3>
        <Inp label="YOUR APP GOAL" value={wGoal} onChange={g=>{setWGoal(g);setWPrompt(buildWP(g,wAud,wFw,wAe));}} ph="e.g. A project management tool for remote teams"/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>AUDIENCE</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {WEB_VARS.map((v,i)=><Pill key={v.id} label={v.label} active={wAud===i} color={C.cy} onClick={()=>{setWAud(i);setWPrompt(buildWP(wGoal,i,wFw,wAe));}}/>)}
          </div>
          <div style={{fontSize:11,color:C.di,marginTop:6}}>{WEB_VARS[wAud]?.desc}</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>FRAMEWORK</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {FWS.map((fw,i)=><Pill key={i} label={fw.split(" + ")[0]+" + "+fw.split(" + ")[1]} active={wFw===i} color={C.vi} onClick={()=>{setWFw(i);setWPrompt(buildWP(wGoal,wAud,i,wAe));}}/>)}
          </div>
          <div style={{fontSize:11,color:C.di,marginTop:6}}>{FW_NOTES[wFw]}</div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>AESTHETIC KEYWORDS (pick up to 4)</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {AEST_OPTS.map(a=>{const sel=wAe.includes(a);return <button key={a} onClick={()=>{const nae=sel?wAe.filter(x=>x!==a):[...wAe,a].slice(0,4);setWAe(nae);setWPrompt(buildWP(wGoal,wAud,wFw,nae));}} style={{background:sel?`${C.mg}18`:"transparent",border:`1px solid ${sel?C.mg+"55":C.bdr}`,color:sel?C.mg:C.di,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s",transform:sel?"scale(1.04)":"none"}}>{a}</button>;})}
          </div>
        </div>
        <div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>↓ LIVE PROMPT — updates as you configure above</div>
        <Code text={wPrompt||buildWP("",0,0,[])} mh={260}/>
      </Card>
      <Card>
        <Lbl text="Always define these three before generating" color={C.bl}/>
        <H3>The Three Layers Rule</H3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["FUNCTION","What does the app DO?",C.cy],["DESIGN","What does it LOOK & FEEL like?",C.vi],["TECHNOLOGY","What STACK runs it?",C.am]].map(([l,q,col])=><div key={l} style={{background:C.bg,border:`1px solid ${col}22`,borderRadius:10,padding:"14px",textAlign:"center"}}><div style={{fontSize:10,color:col,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:6}}>{l}</div><div style={{fontSize:12,color:C.mu}}>{q}</div></div>)}
        </div>
      </Card>
      <Card>
        <Lbl text="Dolphin Mode — 10 creative UI concepts to spark ideas" color={C.bl}/>
        <H3>Creative UI Concepts</H3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:8}}>
          {DOLPHIN_C.map((c,i)=><div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"10px 12px",display:"flex",gap:10}}>
            <span style={{fontSize:10,color:C.bl,fontFamily:C.mn,minWidth:20,marginTop:1}}>#{String(i+1).padStart(2,"00")}</span>
            <div style={{flex:1}}><span style={{fontSize:12,color:C.mu,lineHeight:1.5}}>{c}</span></div>
            <Cp text={`Dolphin mode creative UI concept: ${c}`}/>
          </div>)}
        </div>
      </Card>
    </div>}

    {s==="json"&&<div style={{display:"grid",gap:14}}>
      <Card accent={C.cy}>
        <Lbl text="GLOBAL RULE — always append when requesting JSON" color={C.cy}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><H3>Structured Output / JSON</H3><Cp text={JSON_GLOBAL} sm={false}/></div>
        <Code text={JSON_GLOBAL}/>
      </Card>
      <Card>
        <Lbl text="4 techniques — use in combination"/>
        <H3>Techniques</H3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {JSON_T.map(t=><Pill key={t.id} label={t.label} active={jT===t.id} color={t.color} onClick={()=>setJT(t.id)}/>)}
        </div>
        {JSON_T.filter(t=>t.id===jT).map(t=><div key={t.id} style={{animation:"popIn 0.18s ease-out"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:10,background:`${t.color}18`,color:t.color,border:`1px solid ${t.color}30`,borderRadius:20,padding:"2px 10px",fontFamily:C.mn}}>{t.badge}</span>
            <span style={{fontSize:11,color:C.di}}>Use when: {t.when}</span>
          </div>
          <Code text={t.content}/>
        </div>)}
        <div style={{marginTop:16}}>
          <div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>DECISION MATRIX — click a row to generate its combined prompt</div>
          <div style={{display:"grid",gap:6,marginBottom:jMxPrompt?14:0}}>
            {JSON_MX.map((r,i)=><div key={i} onClick={()=>{setJMxSel(i);setJMxPrompt(buildJMxP(r));}} style={{display:"flex",justifyContent:"space-between",background:jMxSel===i?`${C.cy}10`:C.bg,border:`1px solid ${jMxSel===i?C.cy+"44":C.bdr}`,borderRadius:8,padding:"9px 12px",cursor:"pointer",transition:"all 0.18s",gap:12,transform:jMxSel===i?"translateX(3px)":"none"}}>
              <span style={{fontSize:12,color:C.mu,flex:1}}>{r.sit}</span>
              <span style={{fontSize:12,color:C.cy,fontFamily:C.mn,whiteSpace:"nowrap"}}>{r.use}</span>
            </div>)}
          </div>
          {jMxPrompt&&<div style={{animation:"popIn 0.2s ease-out"}}>
            <div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>✓ COMBINED JSON PROMPT</div>
            <Code text={jMxPrompt} mh={320}/>
          </div>}
        </div>
      </Card>
    </div>}

    {s==="typo"&&<div style={{display:"grid",gap:14}}>
      <Card>
        <Lbl text="Display + Body + Mono — Google Fonts compatible"/>
        <H3>Typography Pairings</H3>
        <div style={{display:"grid",gap:8}}>
          {TYPO.map((t,i)=><div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:9,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,transition:"border-color 0.15s"}}>
            <div><span style={{fontWeight:700,color:C.tx}}>{t.d}</span><span style={{color:C.di,fontSize:12,marginLeft:6}}>+ {t.m}</span></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,color:C.di}}>{t.b}</span>
              <Cp text={`Typography system: Display: ${t.d} · Mono: ${t.m} · Best for: ${t.b}`}/>
            </div>
          </div>)}
        </div>
      </Card>
      <Card>
        <Lbl text="Context-specific font combinations"/>
        <H3>Infographic Typography</H3>
        <div style={{display:"grid",gap:8}}>
          {TYPO_I.map((t,i)=><div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:9,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:C.vi,fontFamily:C.mn,marginBottom:4}}>{t.u.toUpperCase()}</div>
              <div style={{fontSize:12,color:C.mu}}>{t.c}</div>
            </div>
            <Cp text={`${t.u}: ${t.c}`}/>
          </div>)}
        </div>
      </Card>
    </div>}

    {s==="vocab"&&<div style={{display:"grid",gap:14}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0}}><div><Lbl text="Use exact terms in prompts — tips, tricks, hacks"/><H3>Design Vocabulary</H3></div><span style={{fontSize:11,color:C.di,fontFamily:C.mn}}>{VOCAB.filter(v=>(vCat==="all"||v.cat===vCat)&&(!vQ||v.t.toLowerCase().includes(vQ.toLowerCase())||v.d.toLowerCase().includes(vQ.toLowerCase()))).length} of {VOCAB.length}</span><input value={vQ} onChange={e=>setVQ(e.target.value)} placeholder="search…" style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:6,padding:"3px 8px",color:C.tx,fontSize:11,fontFamily:C.mn,outline:"none",width:110}}/></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {["all","fx","motion","3d","layout","data"].map(c=><Pill key={c} label={c==="all"?"ALL":c==="fx"?"VISUAL FX":c==="3d"?"3D + LIBS":c==="data"?"DATA VIZ":c.toUpperCase()} active={vCat===c} color={C.cy} onClick={()=>setVCat(c)}/>)}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          <Pill label="Terms + Copy" active={vView==="terms"} color={C.vi} onClick={()=>setVView("terms")}/>
          <Pill label="Synergy Combos" active={vView==="combos"} color={C.mg} onClick={()=>setVView("combos")}/>
        </div>
        {vView==="terms"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
          {VOCAB.filter(v=>(vCat==="all"||v.cat===vCat)&&(!vQ||v.t.toLowerCase().includes(vQ.toLowerCase())||v.d.toLowerCase().includes(vQ.toLowerCase()))).map((v,i)=>(
            <div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:9,padding:"11px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5}}>
                <div style={{fontSize:12,color:C.cy,fontFamily:C.mn,fontWeight:600}}>{v.t}</div>
                <div style={{display:"flex",gap:4}}>
                  {v.adv&&<Cp text={v.adv} label="ADV"/>}
                  <Cp text={"Use \""+v.t+"\" in your prompt: "+v.d}/>
                </div>
              </div>
              <div style={{fontSize:11,color:C.mu,lineHeight:1.55,marginBottom:(v.tip||v.adv)?5:0}}>{v.d}</div>
              {v.adv&&<div style={{fontSize:10,color:C.cy+"88",lineHeight:1.4,fontFamily:C.mn,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingTop:3,borderTop:"1px solid "+C.bdr+"44"}}>{v.adv}</div>}
              {v.tip&&<div style={{fontSize:10,color:C.di,lineHeight:1.4,borderTop:"1px solid "+C.bdr,paddingTop:5,marginTop:4}}>💡 {v.tip}</div>}
            </div>
          ))}
        </div>}
        {vView==="combos"&&<div style={{display:"grid",gap:8}}>
          {COMBOS.map((d,i)=>(
            <div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:9,padding:"11px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:4}}>
                <span style={{fontWeight:700,color:C.tx,fontSize:13}}>{d.combo}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:10,color:C.vi,fontFamily:C.mn}}>{d.psych}</span>
                  <Cp text={"Design system using "+d.combo+" combo:\nElements: "+d.els+"\nBest for: "+d.best+"\nPsychological effect: "+d.psych+"\n\nApply these elements: "+d.els+". Every design decision should reinforce: "+d.psych+".  Start mobile-first at 375px viewport."}/>
                </div>
              </div>
              <div style={{fontSize:11,color:C.mu}}>{d.els}</div>
              <div style={{fontSize:10,color:C.di,marginTop:3}}>Best for: {d.best}</div>
            </div>
          ))}
        </div>}
      </Card>
    </div>}

    {s==="composer"&&<LayerComposer/>}
    {s==="wfbuilder"&&<WFBuilder/>}
    {s==="diff"&&<PromptDiff/>}

    </div>
  </div>);
}


// ─── VALIDATE ─────────────────────────────────────────────────────────────────
function Validate(){
  const[chk,setChk]=useState({});
  const[sel,setSel]=useState({});
  const[sc,setSc]=useState({Clarity:5,Structure:5,Constraints:5,Predictability:5});
  const[swapFilter,setSwapFilter]=useState("all");
  const[lintSeg,setLintSeg]=useState("universal");
  const[selAesthetic,setSelAesthetic]=useState(null);
  const avg=(Object.values(sc).reduce((a,b)=>a+b,0)/4).toFixed(1);
  const grade=SSCALE.find(s=>{const[lo,hi]=s.r.split("–").map(Number);return avg>=lo&&avg<=hi;})||SSCALE[SSCALE.length-1];
  const LEVEL_COLORS={beginner:C.gn,misconception:C.am,advanced:C.vi,hack:"#7B5CFF"};
  const LINT_SEGS=[...new Set(LINT.map(r=>r.seg))];
  const filteredLint=LINT.filter(r=>r.seg===lintSeg);
  const filteredSwaps=swapFilter==="all"?SWAPS:SWAPS.filter(s=>s.level===swapFilter);
  const total=CHECKS.reduce((a,g)=>a+g.items.length,0);
  const done=Object.values(chk).filter(v=>v===true).length;
  const buildChecklistPrompt=()=>{
    const parts=[];
    CHECKS.forEach(g=>{if(g.selectable)Object.entries(g.selectable).forEach(([k,cfg])=>{const v=sel[g.lbl+"-"+k];if(v)parts.push(cfg.label+": "+(Array.isArray(v)?v.join(", "):v));});});
    const checked=CHECKS.flatMap((g,gi)=>g.items.filter((_,ii)=>chk[gi+"-"+ii]));
    return parts.length||checked.length?"PROMPT REQUIREMENTS\n\n"+parts.map(p=>"✅ "+p).join("\n")+(checked.length?"\n\nCOMPLETED\n"+checked.map(c=>"✓ "+c).join("\n"):""):null;
  };
  const checklistPrompt=buildChecklistPrompt();
  return(<div style={{display:"grid",gap:14}}>
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><Lbl text="Segmented by use-case — copy fix directly"/><H3>Prompt Lint Rules</H3></div>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
        {LINT_SEGS.map(s=>{const cnt=LINT.filter(r=>r.seg===s).length;return <button key={s} onClick={()=>setLintSeg(s)} style={{background:lintSeg===s?C.cy+"18":"transparent",border:"1px solid "+(lintSeg===s?C.cy+"50":C.bdr),color:lintSeg===s?C.cy:C.di,borderRadius:20,padding:"3px 11px",fontSize:10,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s",textTransform:"uppercase"}}>{s} ({cnt})</button>;})} 
      </div>
      <div key={lintSeg} className="anim-pop" style={{display:"grid",gap:6,marginBottom:18}}>
        {filteredLint.map(r=>(
          <div key={r.id} style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:9,padding:"9px 13px",display:"flex",gap:10}}>
            <span style={{fontSize:14,marginTop:1}}>{r.auto?"✅":"⚠️"}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:2}}>
                <span style={{fontSize:12,color:C.tx,lineHeight:1.4}}>{r.check}</span>
                <Cp text={r.fix}/>
              </div>
              <div style={{fontSize:11,color:C.di}}>{r.auto?"Autofix":"Manual"}: {r.fix}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.1em"}}>WORD SWAPS — {filteredSwaps.length} / {SWAPS.length} total</div><Cp text={filteredSwaps.filter(s=>!s.isAesthetic).map(s=>s.good).join("\n")} label="COPY ALL REPLACEMENTS"/></div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {["all","beginner","misconception","advanced","hack"].map(f=>{const col=f==="all"?C.cy:(LEVEL_COLORS[f]||C.cy);return <button key={f} onClick={()=>setSwapFilter(f)} style={{background:swapFilter===f?col+"18":"transparent",border:"1px solid "+(swapFilter===f?col+"50":C.bdr),color:swapFilter===f?col:C.di,borderRadius:20,padding:"3px 9px",fontSize:10,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{f==="all"?"ALL":f.toUpperCase()}</button>;})}
        </div>
      </div>
      <div key={swapFilter} className="anim-pop" style={{display:"grid",gap:5}}>
        {filteredSwaps.map((sw,i)=>(
          <div key={i} style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:8,padding:"8px 12px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr auto",gap:8,alignItems:"flex-start",marginBottom:sw.tip?4:0}}>
              <span style={{color:C.rd,fontFamily:C.mn,fontSize:11,textDecoration:"line-through",opacity:0.7}}>{sw.bad}</span>
              <span style={{color:C.fa,fontSize:11,marginTop:1}}>→</span>
              {sw.isAesthetic?(
                <div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:4}}>
                    {AESTHETIC_KEYWORDS.map((kw,ki)=>{const k=i+"-"+ki;return(<button key={ki} onClick={()=>setSelAesthetic(selAesthetic===k?null:k)} style={{background:selAesthetic===k?C.cy+"20":"transparent",border:"1px solid "+(selAesthetic===k?C.cy+"55":C.bdr),color:selAesthetic===k?C.cy:C.mu,borderRadius:5,padding:"2px 7px",fontSize:9,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{kw}</button>);})}
                  </div>
                  {selAesthetic&&selAesthetic.startsWith(i+"-")&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:C.gn,fontFamily:C.mn}}>{AESTHETIC_KEYWORDS[parseInt(selAesthetic.split("-")[1])]}</span><Cp text={AESTHETIC_KEYWORDS[parseInt(selAesthetic.split("-")[1])]}/></div>}
                </div>
              ):(
                <span style={{color:C.gn,fontFamily:C.mn,fontSize:11,lineHeight:1.4}}>{sw.good}</span>
              )}
              <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                {!sw.isAesthetic&&<Cp text={sw.good}/>}
                <span style={{fontSize:9,background:(LEVEL_COLORS[sw.level]||C.cy)+"18",color:LEVEL_COLORS[sw.level]||C.cy,border:"1px solid "+(LEVEL_COLORS[sw.level]||C.cy)+"30",borderRadius:20,padding:"2px 7px",fontFamily:C.mn,whiteSpace:"nowrap"}}>{sw.level}</span>
              </div>
            </div>
            {sw.tip&&<div style={{fontSize:10,color:C.di,lineHeight:1.4}}>💡 {sw.tip}</div>}
          </div>
        ))}
      </div>
    </Card>
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><Lbl text="Select options · check items · copy as prompt"/><H3>Quality Checklist</H3></div>
        {checklistPrompt&&<Cp text={checklistPrompt} sm={false} label="COPY"/>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{flex:1,background:C.bg,borderRadius:999,height:5,overflow:"hidden"}}><div style={{width:(done/total)*100+"%",background:C.cy,height:"100%",borderRadius:999,transition:"width 0.3s"}}/></div>
        <span style={{fontSize:12,fontFamily:C.mn,color:done===total?C.gn:C.mu}}>{done}/{total}</span>
      </div>
      <div style={{display:"grid",gap:16}}>
        {CHECKS.map((g,gi)=>(
          <div key={gi}>
            <div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.12em",marginBottom:8}}>{g.lbl}</div>
            {g.selectable&&Object.entries(g.selectable).map(([k,cfg])=>(
              <div key={k} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.di,fontFamily:C.mn,marginBottom:5}}>{cfg.label.toUpperCase()}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {cfg.opts.map((opt,oi)=>{
                    const sk=g.lbl+"-"+k;const isArr=cfg.multi;const curVal=sel[sk];
                    const isActive=isArr?(curVal||[]).includes(opt):curVal===opt;
                    return <button key={oi} onClick={()=>setSel(p=>{if(isArr){const cur=p[sk]||[];return{...p,[sk]:isActive?cur.filter(x=>x!==opt):[...cur,opt]};}return{...p,[sk]:isActive?null:opt};})} style={{background:isActive?C.cy+"18":"transparent",border:"1px solid "+(isActive?C.cy+"50":C.bdr),color:isActive?C.cy:C.di,borderRadius:6,padding:"3px 9px",fontSize:10,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{opt.length>45?opt.slice(0,45)+"…":opt}</button>;
                  })}
                </div>
              </div>
            ))}
            <div style={{display:"grid",gap:5}}>
              {g.items.map((item,ii)=>{const k=gi+"-"+ii;return(
                <label key={ii} style={{display:"flex",gap:10,cursor:"pointer"}}>
                  <input type="checkbox" checked={!!chk[k]} onChange={()=>setChk(p=>({...p,[k]:!p[k]}))} style={{marginTop:2,accentColor:C.cy,flexShrink:0}}/>
                  <span style={{fontSize:12,color:chk[k]?C.di:C.tx,textDecoration:chk[k]?"line-through":"none",lineHeight:1.5}}>{item}</span>
                </label>
              );})}
            </div>
          </div>
        ))}
      </div>
    </Card>
    <Card>
      <Lbl text="A/B test prompt variants"/>
      <H3>Prompt Scoring</H3>
      <div style={{display:"grid",gap:12,marginBottom:18}}>
        {SDIMS.map(d=>(<div key={d.name}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:600,color:C.tx}}>{d.name}</span><span style={{fontSize:13,fontFamily:C.mn,color:C.cy}}>{sc[d.name]}/10</span></div>
          <div style={{fontSize:11,color:C.di,marginBottom:4}}>{d.what}</div>
          <input type="range" min={1} max={10} value={sc[d.name]} onChange={e=>setSc(p=>({...p,[d.name]:Number(e.target.value)}))} style={{width:"100%",accentColor:C.cy}}/>
        </div>))}
      </div>
      <div style={{background:C.bg,border:"1px solid "+grade.col+"33",borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",gap:18,marginBottom:14}}>
        <div style={{fontSize:36,fontWeight:800,fontFamily:C.mn,color:grade.col}}>{avg}</div>
        <div><div style={{fontWeight:700,color:C.tx,marginBottom:2}}>{grade.level}</div><div style={{fontSize:12,color:C.mu}}>{grade.action}</div></div>
      </div>
      <div style={{display:"grid",gap:5,marginBottom:14}}>
        {SSCALE.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderRadius:6,background:grade===s?s.col+"10":"transparent",border:"1px solid "+(grade===s?s.col+"44":"transparent")}}>
          <span style={{fontFamily:C.mn,fontSize:12,color:s.col,minWidth:36}}>{s.r}</span>
          <span style={{fontSize:12,color:C.mu,flex:1,paddingLeft:10}}>{s.level}</span>
          <span style={{fontSize:11,color:C.di}}>{s.action}</span>
        </div>)}
      </div>
      <Cp sm={false} label="COPY IMPROVEMENT PROMPT" text={"My prompt scored "+avg+"/10.\n\nWEAK DIMENSIONS:\n"+SDIMS.filter(d=>sc[d.name]<7).map(d=>"- "+d.name+" ("+sc[d.name]+"/10): "+d.what).join("\n")+"\n\nGRADE: "+grade.level+" — "+grade.action+"\n\nRewrite my prompt to fix these weaknesses. For each low-scoring dimension, add the missing element. Output ONLY the improved prompt, no explanation."}/>
    </Card>
  </div>);
}



// ─── PLAYBOOK ─────────────────────────────────────────────────────────────────
function Playbook(){
  const[cat,setCat]=useState("All");
  const[q,setQ]=useState("");
  const[open,setOpen]=useState(null);
  const[topic,setTopic]=useState("");
  const cats=["All",...Array.from(new Set(WF.map(w=>w.cat)))];
  const list=WF.filter(w=>(cat==="All"||w.cat===cat)&&(!q||w.title.toLowerCase().includes(q.toLowerCase())||w.purpose.toLowerCase().includes(q.toLowerCase())||w.best.toLowerCase().includes(q.toLowerCase())));
  const mk=(w,t)=>"WORKFLOW: "+w.title+"\nPURPOSE: "+w.purpose+"\nBEST FOR: "+w.best+"\nTOPIC: "+(t||"[your topic]")+"\nCHAIN: "+w.chain.map(a=>AE[a]+" "+a).join(" => ")+"\n\n"+w.steps.map((s,i)=>"STEP "+(i+1)+" -- "+AE[s.a]+" "+s.a.toUpperCase()+"\n"+s.t+"\n"+s.items.map(x=>"- "+x).join("\n")).join("\n\n")+"\n\nFINAL OUTPUT: "+w.out;
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginBottom:12}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workflows..." style={{background:C.sur,border:"1px solid "+C.bdr,borderRadius:8,padding:"10px 14px",color:C.tx,fontSize:13,outline:"none"}}/>
      <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic for prompt" style={{background:C.sur,border:"1px solid "+C.bdr,borderRadius:8,padding:"10px 14px",color:C.tx,fontSize:13,outline:"none",width:170}}/>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
      {cats.map(c=>{const cnt=c==="All"?WF.length:WF.filter(w=>w.cat===c).length;return <Pill key={c} label={c==="All"?"All ("+WF.length+")":c+" ("+cnt+")"} active={cat===c} color={C.am} onClick={()=>setCat(c)}/>;})}
    </div>
    {q&&<div style={{fontSize:11,color:C.di,fontFamily:C.mn,marginBottom:10}}>{list.length} result{list.length!==1?"s":""} for "{q}"</div>}
    <div style={{display:"grid",gap:8}}>
      {list.map(w=>{const io=open===w.id;return(<div key={w.id} style={{background:C.sur,border:`1px solid ${io?C.bdrH:C.bdr}`,borderRadius:12,overflow:"hidden"}}>
        <button onClick={()=>setOpen(io?null:w.id)} style={{width:"100%",background:"none",border:"none",padding:"13px 17px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:C.mn,fontSize:10,color:C.cy,minWidth:24,opacity:0.6}}>#{String(w.id).padStart(2,"0")}</span>
          <div style={{flex:1}}><div style={{fontWeight:700,color:C.tx,fontSize:13,marginBottom:1}}>{w.title}</div><div style={{fontSize:11,color:C.di}}>{w.purpose} · {w.best}</div></div>
          <div style={{display:"flex",gap:3}}>{w.chain.map((a,i)=><span key={i} style={{fontSize:14}}>{AE[a]}</span>)}</div>
          <span style={{color:C.fa,fontSize:13,marginLeft:4}}>{io?"▲":"▼"}</span>
        </button>
        {io&&<div style={{borderTop:`1px solid ${C.bdr}`,padding:"0 17px 17px"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"11px 0"}}>
            {w.chain.map((a,i)=><span key={i}><span style={{background:`${AC[a]}12`,border:`1px solid ${AC[a]}28`,color:AC[a],borderRadius:20,padding:"3px 9px",fontSize:11,fontFamily:C.mn}}>{AE[a]} {a}</span>{i<w.chain.length-1&&<span style={{color:C.fa,margin:"0 3px",fontSize:11}}>→</span>}</span>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:9,marginBottom:12}}>
            {w.steps.map((s,i)=><div key={i} style={{background:C.bg,border:`1px solid ${AC[s.a]}20`,borderRadius:9,padding:"10px 12px"}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}><span style={{fontSize:14}}>{AE[s.a]}</span><div><div style={{fontSize:9,color:AC[s.a],fontFamily:C.mn}}>STEP {i+1}</div><div style={{fontSize:12,fontWeight:600,color:C.tx}}>{s.t}</div></div></div>
              <ul style={{margin:0,padding:"0 0 0 12px"}}>{s.items.map((item,j)=><li key={j} style={{fontSize:11,color:C.mu,lineHeight:1.6}}>{item}</li>)}</ul>
            </div>)}
          </div>
          <div style={{background:C.bg,border:`1px solid ${C.gn}20`,borderRadius:8,padding:"9px 12px",display:"flex",gap:10,marginBottom:11}}><span>✅</span><div><div style={{fontSize:10,color:C.gn,fontFamily:C.mn,marginBottom:2}}>FINAL OUTPUT</div><div style={{fontSize:12,color:C.tx}}>{w.out}</div></div></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Cp text={mk(w,topic)} sm={false} label="COPY WORKFLOW PROMPT"/><Cp text={w.chain.map(a=>AE[a]+" "+a).join(" => ")+" | "+w.out} label="COPY CHAIN"/></div>
        </div>}
      </div>);})}
      {list.length===0&&<div style={{textAlign:"center",color:C.fa,padding:"36px 0",fontFamily:C.mn,fontSize:12}}>No workflows match "{q}"</div>}
    </div>
  </div>);
}

// ─── BUILDER ──────────────────────────────────────────────────────────────────
function WFBuilder(){
  const[chain,setChain]=useState([]);
  const[goal,setGoal]=useState("");
  const[outL,setOutL]=useState("");
  const[res,setRes]=useState("");
  const[hist,setHist]=useState([]);
  const[showH,setShowH]=useState(false);
  const[expH,setExpH]=useState(null);
  const[showChains,setShowChains]=useState(false);
  const loadChain=(ch)=>{setChain([...ch.c]);setGoal(ch.goal);setOutL("");setRes("");setShowChains(false);};
  const add=n=>{if(chain.length<6){setChain(p=>[...p,n]);setRes("");}};
  const rm=i=>{setChain(p=>p.filter((_,j)=>j!==i));setRes("");};
  const mv=(i,d)=>{const n=[...chain];const t=i+d;if(t<0||t>=n.length)return;[n[i],n[t]]=[n[t],n[i]];setChain(n);setRes("");};
  const gen=()=>{
    if(!chain.length)return;
    const lines=chain.map((nm,i)=>{const a=ANIMALS.find(x=>x.name===nm);return `Step ${i+1} (${a.emoji} ${nm} — ${a.mode}):\n${a.prompt}`;}).join("\n\n");
    const p=`${goal.trim()?`GOAL: ${goal.trim()}\n\n`:""}${lines}${outL.trim()?`\n\nFinal Output: ${outL.trim()}`:""}`;
    setRes(p);
    setHist(h=>[{id:Date.now(),goal:goal.trim()||"Untitled",chain:[...chain],outL:outL.trim(),prompt:p,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},...h].slice(0,10));
  };
  const load=e=>{setChain(e.chain);setGoal(e.goal==="Untitled"?"":e.goal);setOutL(e.outL);setRes(e.prompt);setShowH(false);};
  const reset=()=>{setChain([]);setGoal("");setOutL("");setRes("");};
  return(<Card sx={{marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
      <div><Lbl text="Compose animal mode chains → generate prompt" color={C.mg}/><H3>Workflow Builder</H3></div>
      <div style={{marginBottom:10}}>
      <button onClick={()=>setShowChains(s=>!s)} style={{background:showChains?C.am+"15":"transparent",border:"1px solid "+(showChains?C.am+"55":C.bdr),color:showChains?C.am:C.di,borderRadius:8,padding:"6px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer"}}>⚡ LOAD CHAIN PRESET ({CHAINS.length})</button>
      {showChains&&<div style={{background:C.bg,border:"1px solid "+C.am+"22",borderRadius:10,padding:"10px 12px",marginTop:8,display:"grid",gap:5}}>
        {CHAINS.map((ch,i)=><button key={i} onClick={()=>loadChain(ch)} style={{background:"transparent",border:"1px solid "+C.bdr,borderRadius:8,padding:"7px 12px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <div><div style={{fontSize:12,color:C.tx,fontWeight:600,marginBottom:1}}>{ch.goal}</div><div style={{fontSize:10,color:C.di}}>{ch.c.map(a=>AE[a]).join(" → ")} · {ch.best}</div></div>
          <span style={{fontSize:10,color:C.am,fontFamily:C.mn,flexShrink:0}}>LOAD</span>
        </button>)}
      </div>}
    </div>
    {hist.length>0&&<button onClick={()=>setShowH(h=>!h)} style={{background:showH?`${C.am}15`:"transparent",border:`1px solid ${showH?C.am+"55":C.bdr}`,color:showH?C.am:C.di,borderRadius:8,padding:"6px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",flexShrink:0}}>🕐 HISTORY ({hist.length})</button>}
    </div>
    {showH&&<div style={{background:C.bg,border:`1px solid ${C.am}22`,borderRadius:10,padding:13,marginBottom:16}}>
      <div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.12em",marginBottom:10}}>RECENT PROMPTS</div>
      <div style={{display:"grid",gap:6}}>
        {hist.map(e=><div key={e.id} style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:8,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:C.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.goal}</div>
              <div style={{fontSize:11,color:C.di,marginTop:1}}>{e.chain.map(n=>AE[n]).join(" → ")} · {e.time}</div>
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0}}>
              <button onClick={()=>setExpH(expH===e.id?null:e.id)} style={{background:"transparent",border:`1px solid ${C.bdr}`,color:C.mu,borderRadius:6,padding:"3px 8px",fontSize:10,fontFamily:C.mn,cursor:"pointer"}}>{expH===e.id?"HIDE":"VIEW"}</button>
              <button onClick={()=>load(e)} style={{background:`${C.cy}10`,border:`1px solid ${C.cy}28`,color:C.cy,borderRadius:6,padding:"3px 8px",fontSize:10,fontFamily:C.mn,cursor:"pointer"}}>LOAD</button>
              <Cp text={e.prompt}/>
              <button onClick={()=>setHist(p=>p.filter(x=>x.id!==e.id))} style={{background:"transparent",border:`1px solid ${C.rd}22`,color:C.rd,borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
          </div>
          {expH===e.id&&<div style={{borderTop:`1px solid ${C.bdr}`,padding:"9px 12px"}}><pre style={{margin:0,fontSize:11,color:C.mu,fontFamily:C.mn,whiteSpace:"pre-wrap",maxHeight:150,overflowY:"auto"}}>{e.prompt}</pre></div>}
        </div>)}
      </div>
    </div>}
    <Inp label="YOUR GOAL (optional)" value={goal} onChange={setGoal} ph="e.g. Build a SaaS onboarding flow for enterprise users"/>
    <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>SELECT MODES — CLICK TO ADD (max 6)</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
      {ANIMALS.map(a=><button key={a.name} onClick={()=>add(a.name)} disabled={chain.length>=6} style={{background:`${AC[a.name]}10`,border:`1px solid ${AC[a.name]}28`,color:AC[a.name],borderRadius:10,padding:"7px 12px",cursor:chain.length>=6?"not-allowed":"pointer",opacity:chain.length>=6?0.4:1,fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <span style={{fontSize:20}}>{a.emoji}</span>
        <span style={{fontSize:10,fontFamily:C.mn}}>{a.name}</span>
      </button>)}
    </div>
    <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>YOUR CHAIN {chain.length>0&&`— ${chain.length} step${chain.length>1?"s":""}`}</div>
    {chain.length===0?<div style={{background:C.bg,border:`1px dashed ${C.bdr}`,borderRadius:10,padding:"20px",textAlign:"center",marginBottom:13}}><div style={{fontSize:20,marginBottom:5}}>⬆</div><div style={{fontSize:12,color:C.fa,fontFamily:C.mn}}>Click animals above to build your chain</div></div>
    :<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:13}}>
      {chain.map((nm,idx)=>{const a=ANIMALS.find(x=>x.name===nm);const col=AC[nm];return(<div key={idx} style={{background:C.bg,border:`1px solid ${col}28`,borderRadius:9,padding:"9px 12px",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:10,color:C.fa,fontFamily:C.mn,minWidth:20}}>{String(idx+1).padStart(2,"0")}</span>
        <span style={{fontSize:17}}>{AE[nm]}</span>
        <div style={{flex:1}}><span style={{fontWeight:700,color:col,fontSize:13}}>{nm}</span><span style={{fontSize:11,color:C.di,marginLeft:8}}>{a.mode}</span></div>
        <div style={{display:"flex",gap:3}}>
          <button onClick={()=>mv(idx,-1)} disabled={idx===0} style={{background:"none",border:`1px solid ${C.bdr}`,color:C.di,borderRadius:5,width:24,height:24,cursor:idx===0?"default":"pointer",opacity:idx===0?0.3:1,fontSize:11}}>↑</button>
          <button onClick={()=>mv(idx,1)} disabled={idx===chain.length-1} style={{background:"none",border:`1px solid ${C.bdr}`,color:C.di,borderRadius:5,width:24,height:24,cursor:idx===chain.length-1?"default":"pointer",opacity:idx===chain.length-1?0.3:1,fontSize:11}}>↓</button>
          <button onClick={()=>rm(idx)} style={{background:"none",border:`1px solid ${C.rd}33`,color:C.rd,borderRadius:5,width:24,height:24,cursor:"pointer",fontSize:11}}>×</button>
        </div>
      </div>);})}
      {chain.length>1&&<div style={{textAlign:"center"}}><span style={{fontSize:12,color:C.fa,fontFamily:C.mn}}>{chain.map(n=>AE[n]).join(" → ")}</span></div>}
    </div>}
    <Inp label="FINAL OUTPUT LABEL (optional)" value={outL} onChange={setOutL} ph="e.g. Complete onboarding design with metrics"/>
    <div style={{display:"flex",gap:8}}>
      <button onClick={gen} disabled={!chain.length} style={{background:chain.length?`${C.cy}15`:"transparent",border:`1px solid ${chain.length?C.cy+"50":C.bdr}`,color:chain.length?C.cy:C.fa,borderRadius:8,padding:"10px 17px",fontSize:13,fontWeight:600,fontFamily:C.mn,cursor:chain.length?"pointer":"not-allowed",letterSpacing:"0.05em"}}>⚡ GENERATE PROMPT</button>
      {chain.length>0&&<button onClick={reset} style={{background:"transparent",border:`1px solid ${C.bdr}`,color:C.di,borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:C.mn,cursor:"pointer"}}>RESET</button>}
    </div>
    {res&&<div style={{marginTop:13}}><div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>✓ PROMPT READY — saved to history</div><Code text={res} mh={280}/></div>}
  </Card>);
}

function LayerComposer(){
  const LC_TEMPLATES=[
    {name:"UI/UX",vals:{role:"You are a senior product designer.",context:"Platform: web + mobile\nAudience: [target users]\nProduct: [name and purpose]",objective:"Design [screen/component] that [outcome]\nSuccess: user completes [task] in [X] seconds",constraints:"Mobile-first 375px\nWCAG AA\n44px touch targets\n60fps",aesthetic:"[2-3 from Design Vocab]\nTone: [confident/playful/minimal]",planning:"1. User journey\n2. Component hierarchy\n3. Interactive states",output:"1. React component (no TODOs)\n2. Tailwind classes\n3. Framer Motion config",refinement:"Critique → structure → polish → final only"}},
    {name:"SaaS Feature",vals:{role:"You are a senior full-stack engineer. Next.js 14 + TypeScript + Supabase.",context:"Product: [SaaS name]\nFeature: [what it does]\nUser: [who uses it]",objective:"Build [feature] that [outcome]\nSuccess: [measurable result]",constraints:"TypeScript strict\nNo any types\nFull error handling\nMobile-first",aesthetic:"Clean SaaS UI\nShadcn/ui\nMinimal and functional",planning:"1. Data model\n2. API routes\n3. Component tree",output:"1. Complete source files\n2. Supabase schema SQL\n3. API handlers",refinement:"Check security + edge cases. Output final only."}},
    {name:"AI Agent",vals:{role:"You are a senior AI engineer specializing in agentic systems.",context:"Agent purpose: [task to automate]\nLLM: [Groq/OpenAI/Ollama]\nRuntime: [Node.js/Python/Workers]",objective:"Build agent that [specific task]\nTools: [list]\nMax steps: [N]",constraints:"Typed schemas\nRetry on failure (max 3)\nLog all calls\nJSON output",aesthetic:"Clean, minimal\nNo unnecessary abstractions",planning:"1. Tool schemas\n2. Agent loop\n3. Error handling",output:"1. Agent implementation\n2. Tool definitions\n3. System prompt\n4. .env template",refinement:"Check for infinite loops. Output final only."}},
    {name:"Copy/Content",vals:{role:"You are a direct-response copywriter with proven conversion results.",context:"Brand: [name and personality]\nAudience: [who — their pain and desire]\nPlatform: [where this appears]",objective:"Write [content type] that drives [action]\nSuccess: reader [does specific thing]",constraints:"8th grade reading level\nOne idea per sentence\nNo corporate speak\nMax [X] words",aesthetic:"Tone: [confident/conversational/urgent]\nVoice: [3 adjectives]",planning:"1. Open with pain\n2. Agitate\n3. Present solution\n4. Prove\n5. CTA",output:"1. Primary version\n2. A/B variant headline\n3. Meta description",refinement:"Cut 20%. Output final only."}},
  ];
  const[lcTmpl,setLcTmpl]=useState(-1);
  const loadLcTemplate=(tmpl)=>setV(tmpl.vals);
  const F=[
    {k:"role",       l:"ROLE",         p:"You are a senior full-stack developer and product designer."},
    {k:"context",    l:"CONTEXT",      p:"Product: [name]\nPlatform: mobile / web / hybrid\nAudience: [who uses this]"},
    {k:"objective",  l:"OBJECTIVE",    p:"[One clear sentence of success]\nSuccess criteria:\n- [criterion 1]"},
    {k:"constraints",l:"CONSTRAINTS",  p:"- Mobile-first\n- WCAG AA accessibility\n- 60fps animation budget"},
    {k:"aesthetic",  l:"AESTHETIC",    p:"- [visual style keyword]\n- [tone descriptor]"},
    {k:"planning",   l:"PLANNING",     p:"1. Define information architecture\n2. Define navigation model\n3. Validate accessibility"},
    {k:"output",     l:"OUTPUT FORMAT",p:"Generate:\n1. [file or artifact type]\n2. [second deliverable]"},
    {k:"refinement", l:"REFINEMENT",   p:"After generating:\n- Critique for clarity\n- Refine once for structure\n- Output final result only"},
  ];
  const[v,setV]=useState(Object.fromEntries(F.map(f=>[f.k,""])));
  const set=(k,val)=>setV(p=>({...p,[k]:val}));
  const built=F.filter(f=>v[f.k].trim()).map(f=>`${f.l}\n${v[f.k].trim()}`).join("\n\n");
  const filled=F.filter(f=>v[f.k].trim()).length;
  return(<Card sx={{marginBottom:14}}>
    <Lbl text="Fill in each layer → prompt assembles automatically" color={C.mg}/>
    <H3>8-Layer Prompt Composer</H3>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
      {LC_TEMPLATES.map((t,i)=><button key={i} onClick={()=>loadLcTemplate(t)} style={{background:C.bg,border:"1px solid "+C.bdr,color:C.di,borderRadius:20,padding:"3px 11px",fontSize:10,fontFamily:C.mn,cursor:"pointer"}}>▶ {t.name}</button>)}
      {Object.values(v).some(x=>x.trim())&&<button onClick={()=>setV(Object.fromEntries(F.map(f=>[f.k,""])))} style={{background:"transparent",border:"1px solid "+C.rd+"33",color:C.rd,borderRadius:20,padding:"3px 11px",fontSize:10,fontFamily:C.mn,cursor:"pointer"}}>✕ Clear</button>}
    </div>
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:11,color:C.di,fontFamily:C.mn}}>{filled}/{F.length} layers filled</span>
        {built&&<Cp text={built}/>}
      </div>
      <div style={{display:"flex",gap:4}}>{F.map(f=><div key={f.k} style={{flex:1,height:4,background:v[f.k].trim()?C.cy:C.bdr,borderRadius:2,transition:"background 0.2s"}}/>)}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:11,marginBottom:14}}>
      {F.map(f=><div key={f.k}>
        <div style={{fontSize:10,color:v[f.k].trim()?C.cy:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:4,transition:"color 0.2s"}}>{f.l} {v[f.k].trim()?"✓":""}</div>
        <textarea value={v[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p} rows={4} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${v[f.k].trim()?C.cy+"33":C.bdr}`,borderRadius:8,padding:"8px 11px",color:C.tx,fontSize:11,fontFamily:C.mn,outline:"none",resize:"vertical",lineHeight:1.6,transition:"border-color 0.2s"}}/>
      </div>)}
    </div>
    {built?<><div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>✓ ASSEMBLED PROMPT</div><Code text={built} mh={260}/></>
    :<div style={{background:C.bg,border:`1px dashed ${C.bdr}`,borderRadius:10,padding:"16px",textAlign:"center"}}><div style={{fontSize:12,color:C.fa,fontFamily:C.mn}}>Fill in any layer above — prompt assembles in real time</div></div>}
  </Card>);
}

function WebAppGen(){
  const STACKS=["Next.js + Tailwind + Framer Motion","Next.js + Tailwind + GSAP","React + Vite + Framer Motion","SvelteKit + Tailwind","React Native + Expo","Nuxt + Tailwind"];
  const AEST=["dark-mode native","glassmorphism","neo-brutalism","neon accent","bento grid","kinetic typography","aurora gradients","minimal + editorial"];
  const[goal,setGoal]=useState("");
  const[aud,setAud]=useState(0);
  const[stk,setStk]=useState(0);
  const[ae,setAe]=useState([]);
  const[res,setRes]=useState("");
  const toggle=a=>setAe(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a].slice(0,4));
  const gen=()=>{
    const p=`You are a senior full-stack developer and product designer.

ROLE: ${WEB_VARS[aud].label} perspective
GOAL: ${goal.trim()||"[Describe your app in one sentence]"}

FUNCTIONAL REQUIREMENTS
- Dynamic UI components
- Mobile-first responsive layout
- Interactive sections with user feedback
- Modular, reusable component architecture

UI/UX DESIGN LANGUAGE
${ae.length?ae.map(a=>`- ${a}`).join("\n"):"- Ultra-modern Gen-Z aesthetic\n- High-contrast typography\n- Smooth micro-interactions"}
- Dark/light adaptive themes

TECHNICAL STACK
- ${STACKS[stk]}
- Accessible semantic HTML · shadcn/ui components

OUTPUT FORMAT
Generate:
1. Project folder structure
2. Full source code (all files)
3. Instructions to run locally
4. Key component explanations

CONSTRAINTS
- Mobile-first always · WCAG AA accessibility minimum
- 60fps animation budget · No lorem ipsum · Avoid SaaS clichés

AESTHETIC LOCK
${ae.length?ae.join(" | "):"dark-mode native | neon-accent sparse | typography-first | hierarchy clear"}`;
    setRes(p);
  };
  return(<Card>
    <Lbl text="Configure your app → get a complete web app system prompt" color={C.mg}/>
    <H3>Web App Prompt Generator</H3>
    <Inp label="YOUR APP GOAL" value={goal} onChange={setGoal} ph="e.g. A dashboard for freelancers to track client projects and invoices"/>
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>AUDIENCE TYPE</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{WEB_VARS.map((a,i)=><Pill key={a.id} label={a.label} active={aud===i} color={C.cy} onClick={()=>setAud(i)}/>)}</div>
      <div style={{fontSize:11,color:C.di,marginTop:6}}>{WEB_VARS[aud].desc}</div>
    </div>
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>TECH STACK</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{STACKS.map((s,i)=><Pill key={i} label={s} active={stk===i} color={C.vi} onClick={()=>setStk(i)}/>)}</div>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:C.di,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>AESTHETIC KEYWORDS (pick up to 4)</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{AEST.map(a=>{const s=ae.includes(a);return <button key={a} onClick={()=>toggle(a)} style={{background:s?`${C.mg}15`:"transparent",border:`1px solid ${s?C.mg+"55":C.bdr}`,color:s?C.mg:C.di,borderRadius:20,padding:"5px 12px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{a}</button>;})}</div>
    </div>
    <button onClick={gen} style={{background:`${C.mg}15`,border:`1px solid ${C.mg}55`,color:C.mg,borderRadius:8,padding:"10px 18px",fontSize:13,fontWeight:600,fontFamily:C.mn,cursor:"pointer",letterSpacing:"0.05em",marginBottom:res?14:0}}>⚡ GENERATE WEB APP PROMPT</button>
    {res&&<><div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>✓ PROMPT READY</div><Code text={res} mh={300}/></>}
  </Card>);
}

function PromptDiff(){
  const[a,setA]=useState("");
  const[b,setB]=useState("");
  const[res,setRes]=useState(null);
  const score=text=>{
    const t=text.toLowerCase();
    const r=x=>x.test(t)?1:0;
    const hasRole=r(/you are|act as|role:|you're a/);
    const hasCon=r(/wcag|mobile.first|60fps|accessibility|constraint/);
    const hasObj=r(/goal:|objective:|success|output|generate|create/);
    const hasOut=r(/output format|generate:|deliver|produce|format/);
    const hasRef=r(/refine|critique|review|revise|polish/);
    const hasPln=r(/step|plan|architect|structure|first/);
    const wc=text.trim().split(/\s+/).length;
    const vague=r(/nice|cool|awesome|modern|good design/)?-1:0;
    const cl=Math.min(10,Math.round((hasRole*2+hasObj*2+(vague===0?2:0)+(wc>30?2:1))*1.2+vague));
    const st=Math.min(10,Math.round((hasRole+hasCon+hasObj+hasOut+hasRef+hasPln)*1.5));
    const cn=Math.min(10,Math.round((hasCon*3+hasRef*2+hasPln*2+hasOut*2)*0.9));
    const pr=Math.min(10,Math.round((hasOut*3+hasRef*2+hasCon*2+hasPln*2)*0.85));
    const ov=((cl+st+cn+pr)/4).toFixed(1);
    const miss=[];
    if(!hasRole)miss.push("Role definition");
    if(!hasCon)miss.push("Constraints (mobile-first, WCAG)");
    if(!hasObj)miss.push("Clear objective");
    if(!hasOut)miss.push("Output format");
    if(!hasRef)miss.push("Refinement instruction");
    if(vague<0)miss.push("Remove vague words");
    return{cl,st,cn,pr,ov,miss};
  };
  const run=()=>{
    if(!a.trim()&&!b.trim())return;
    const sa=score(a),sb=score(b);
    const win=!a.trim()?"B":!b.trim()?"A":parseFloat(sa.ov)>=parseFloat(sb.ov)?"A":"B";
    setRes({a:sa,b:sb,win});
  };
  const Bar=({label,val,col})=><div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:C.mu}}>{label}</span><span style={{fontSize:11,fontFamily:C.mn,color:col}}>{val}/10</span></div><div style={{background:C.bg,borderRadius:999,height:5}}><div style={{width:`${val*10}%`,background:col,height:"100%",borderRadius:999,transition:"width 0.4s"}}/></div></div>;
  return(<Card>
    <Lbl text="Paste two prompts — get a side-by-side quality analysis" color={C.mg}/>
    <H3>Prompt Diff Tool</H3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
      <TA label="PROMPT A" value={a} onChange={setA} ph="Paste your first prompt here…" rows={6}/>
      <TA label="PROMPT B" value={b} onChange={setB} ph="Paste your second prompt here…" rows={6}/>
    </div>
    <button onClick={run} style={{background:`${C.mg}15`,border:`1px solid ${C.mg}55`,color:C.mg,borderRadius:8,padding:"10px 18px",fontSize:13,fontWeight:600,fontFamily:C.mn,cursor:"pointer",letterSpacing:"0.05em",marginBottom:14}}>⚡ ANALYZE PROMPTS</button>
    {res&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {[["A",res.a,C.cy],["B",res.b,C.vi]].filter(([lbl])=>(lbl==="A"?a.trim():b.trim())).map(([lbl,sc,col])=><div key={lbl} style={{background:C.bg,border:`2px solid ${res.win===lbl?col:C.bdr}`,borderRadius:10,padding:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:700,color:col,fontFamily:C.mn,fontSize:16}}>PROMPT {lbl}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {res.win===lbl&&<span style={{fontSize:10,background:`${col}18`,color:col,border:`1px solid ${col}30`,borderRadius:20,padding:"2px 10px",fontFamily:C.mn}}>WINNER</span>}
            <span style={{fontSize:24,fontWeight:800,color:col,fontFamily:C.mn}}>{sc.ov}</span>
          </div>
        </div>
        <Bar label="Clarity" val={sc.cl} col={col}/>
        <Bar label="Structure" val={sc.st} col={col}/>
        <Bar label="Constraints" val={sc.cn} col={col}/>
        <Bar label="Predictability" val={sc.pr} col={col}/>
        {sc.miss.length>0&&<div style={{marginTop:10}}><div style={{fontSize:10,color:C.am,fontFamily:C.mn,marginBottom:6}}>MISSING</div>{sc.miss.map((m,i)=><div key={i} style={{fontSize:11,color:C.di,marginBottom:3}}>· {m}</div>)}<div style={{marginTop:8}}><Cp sm={false} label="COPY FIX PROMPT" text={"Rewrite this prompt to score 9+/10.\n\nMISSING:\n"+sc.miss.map(m=>"- "+m).join("\n")+"\n\nORIGINAL:\n"+(lbl==="A"?a:b)+"\n\nOutput: improved prompt only."}/></div></div>}
      </div>)}
    </div>}
  </Card>);
}

// ─── MONETIZE VIEW ────────────────────────────────────────────────────────────
function MonetizeView(){
  const[sec,setSec]=useState("top10");
  const[t10Sel,setT10Sel]=useState(-1);
  const[t10Filter,setT10Filter]=useState("all");
  const[saasSel,setSaasSel]=useState(0);
  const[fwSel,setFwSel]=useState(0);
  const[deploySel,setDeploySel]=useState(0);
  const[deployFilter,setDeployFilter]=useState("all");
  const[matrixFront,setMatrixFront]=useState(0);
  const[matrixDB,setMatrixDB]=useState(0);
  const[matrixAI,setMatrixAI]=useState(0);
  const[matrixPay,setMatrixPay]=useState(0);
  const[matrixKey,setMatrixKey]=useState(0);
  const[autoSel,setAutoSel]=useState(0);
  const[aiToolSel,setAiToolSel]=useState(0);
  const[recipeSel,setRecipeSel]=useState(0);
  const MU="#FFD700";
  const MNAV=[{id:"top10",label:"🏆 Top 10 Prompts"},{id:"saas",label:"📦 SaaS Templates"},{id:"frameworks",label:"💡 Frameworks"},{id:"automations",label:"🔄 Automations"},{id:"aitools",label:"🌐 AI Tools"},{id:"recipes",label:"🍳 Recipes"},{id:"deploy",label:"🚀 Deploy Stacks"},{id:"matrix",label:"🔧 Tool Matrix"}];
  const filteredTop10=(!t10Filter||t10Filter==="all")?TOP10_PROMPTS:TOP10_PROMPTS.filter(p=>p.cat===t10Filter);
  const cats=["all",...new Set(TOP10_PROMPTS.map(p=>p.cat))];
  const catLabel=c=>c==="all"?"ALL ("+TOP10_PROMPTS.length+")":c;
  const buildMatrixPrompt=()=>{
    const f=TOOL_MATRIX[0].items[matrixFront];const d=TOOL_MATRIX[1].items[matrixDB];
    const a=TOOL_MATRIX[2].items[matrixAI];const p=TOOL_MATRIX[3].items[matrixPay];
    // Framework-specific init commands
    const initCmd={
      "Next.js 15":"npx create-next-app@latest myapp --typescript --tailwind --app --no-git",
      "SvelteKit 2":"npm create svelte@latest myapp && cd myapp && npm install",
      "Astro 5":"npm create astro@latest myapp -- --template minimal --typescript",
      "React + Vite 6":"npm create vite@latest myapp -- --template react-ts && cd myapp && npm install",
      "Nuxt 4":"npx nuxi@latest init myapp && cd myapp && npm install",
      "Remix / React Router 7":"npx create-remix@latest myapp && cd myapp && npm install",
      "React Native + Expo":"npx create-expo-app@latest myapp --template blank-typescript",
      "Flutter 3":"flutter create myapp --org com.example --platforms ios,android,web",
    };
    const dbSetup={
      "Supabase":"npx supabase init && npx supabase start  # or use cloud: supabase.com/dashboard",
      "Turso (libSQL)":"curl -sSfL https://get.tur.so/install.sh | bash && turso db create myapp && turso db tokens create myapp",
      "Neon Postgres":"# Create DB at neon.tech/dashboard → copy connection string → add to .env",
      "PocketBase 0.22":"wget https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip && unzip && ./pocketbase serve",
      "Cloudflare D1":"wrangler d1 create myapp-db && wrangler d1 execute myapp-db --file=schema.sql",
      "MongoDB Atlas":"# Create free cluster at mongodb.com/atlas → get connection string → npm install mongoose",
    };
    const aiSetup={
      "Groq API":"npm install groq-sdk  # GROQ_API_KEY=gsk_... in .env",
      "Ollama (Local)":"curl -fsSL https://ollama.com/install.sh | sh && ollama pull llama3.1",
      "Gemini 2.0 Flash":"npm install @google/generative-ai  # GEMINI_API_KEY=... in .env",
      "Cerebras Inference":"npm install @cerebras/cerebras_cloud_sdk  # CEREBRAS_API_KEY=... in .env",
      "OpenRouter":"npm install openai  # Use OpenAI SDK, base_url='https://openrouter.ai/api/v1'",
      "Nvidia Nemotron":"npm install openai  # base_url='https://integrate.api.nvidia.com/v1'",
      "OpenCode / Qwen":"npm install @huggingface/inference  # HF_TOKEN=hf_... in .env",
      "Together AI":"npm install together-ai  # TOGETHER_API_KEY=... in .env",
      "Cloudflare Workers AI":"# Use with Workers: // Ai = env.AI  // Cloudflare Workers AI binding",
    };
    const ic=initCmd[f.label]||"# Initialize your framework";
    const ds=dbSetup[d.label]||"# Setup "+d.label;
    const as=aiSetup[a.label]||"npm install [ai-sdk]";
    return `You are a senior full-stack architect. Build a production SaaS MVP with this exact stack:

STACK SELECTION
Frontend: ${f.label}
Database: ${d.label}
AI Provider: ${a.label}
Payments: ${p.label}

COMPATIBILITY
${f.label} + ${d.label}: ✅ Compatible
${a.label} free tier: ${a.free||a.tier?.includes("Free")?"✅ Free":"💳 Check pricing"}
${p.label}: ${p.free||p.tier?.includes("No monthly")?"✅ No monthly fee":"💳 Monthly fee"}

STRENGTHS
- Frontend: ${f.strength}
- Database: ${d.strength}
- AI: ${a.strength}
- Payments: ${p.strength}

WEAKNESSES TO MITIGATE
- Frontend: ${f.weakness}
- Database: ${d.weakness}
- AI: ${a.weakness||"Rate limits on free tier"}
- Payments: ${p.weakness||"Transaction fees apply"}

TIPS
- ${f.tip||"Follow framework best practices"}
- ${d.tip||"Enable connection pooling for serverless"}
- ${a.tip||"Implement streaming for better UX"}

STEP-BY-STEP SETUP
1. Initialize: ${ic}
2. Database: ${ds}
3. AI setup: ${as}
4. Payments: npm install ${p.label.toLowerCase().includes("stripe")?"stripe":"@lemonsqueezy/lemonsqueezy.js"}
5. Deploy: ${f.deploy?.[0]||"Vercel"} — push to GitHub → connect repo → set env vars

ENV TEMPLATE
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your_db_connection_string
AI_API_KEY=your_ai_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

OUTPUT
Generate complete project:
- Full folder structure
- All source files (no TODOs, no placeholders)
- Database schema (SQL or collection definitions)
- Complete .env.example with all required vars
- README with exact 5-command setup`;
  };

  return(<div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.bdr}`}}>
      {MNAV.map(n=><Pill key={n.id} label={n.label} active={sec===n.id} color={MU} onClick={()=>setSec(n.id)}/>)}
    </div>

    {/* TOP 10 */}
    {sec==="top10"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Most searched + highest profit — copy-ready prompts" color={MU}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0}}><H3>Top {TOP10_PROMPTS.length} Profitable Prompt Categories</H3><span style={{fontSize:11,color:C.di,fontFamily:C.mn}}>{filteredTop10.length} showing</span></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {cats.map(c=><Pill key={c} label={catLabel?catLabel(c):c==="all"?"ALL":c} active={t10Filter===c} color={MU} onClick={()=>setT10Filter(c)}/>)}
          {cats.map(c=><Pill key={c} label={c} active={t10Filter===c} color={MU} onClick={()=>setT10Filter(c)}/>)}
        </div>
        <div style={{display:"grid",gap:8}}>
          {filteredTop10.map((p,i)=>{
            const orig=TOP10_PROMPTS.indexOf(p);
            const isSel=t10Sel===orig;
            return(<div key={orig} style={{background:C.bg,border:`1px solid ${isSel?MU+"55":C.bdr}`,borderRadius:10,overflow:"hidden",transition:"border-color 0.2s"}}>
              <div onClick={()=>setT10Sel(isSel?-1:orig)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:11,color:MU,fontFamily:C.mn,minWidth:24}}>#{String(p.rank).padStart(2,"0")}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,color:C.tx,fontSize:13}}>{p.title}</span>
                    <span style={{fontSize:10,background:`${MU}18`,color:MU,border:`1px solid ${MU}33`,borderRadius:20,padding:"1px 8px",fontFamily:C.mn}}>{p.cat}</span>
                    <span style={{fontSize:10,color:C.di,fontFamily:C.mn}}>{p.searches} searches/mo</span>
                    <span style={{fontSize:10,color:C.gn,fontFamily:C.mn}}>{p.difficulty}</span>
                  </div>
                  <div style={{fontSize:12,color:C.mu,lineHeight:1.5}}>{p.why}</div>
                </div>
                <span style={{color:C.fa,fontSize:12,flexShrink:0}}>{isSel?"▲":"▼"}</span>
              </div>
              {isSel&&<div key={orig} className="anim-pop" style={{borderTop:`1px solid ${C.bdr}`,padding:"12px 14px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div style={{background:C.sur,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:C.gn,fontFamily:C.mn,marginBottom:6}}>✅ PROS</div>
                    {p.pros.map((pr,j)=><div key={j} style={{fontSize:12,color:C.mu,marginBottom:3}}>· {pr}</div>)}
                  </div>
                  <div style={{background:C.sur,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:C.rd,fontFamily:C.mn,marginBottom:6}}>❌ CONS</div>
                    {p.cons.map((c,j)=><div key={j} style={{fontSize:12,color:C.mu,marginBottom:3}}>· {c}</div>)}
                  </div>
                </div>
                <div style={{fontSize:10,color:MU,fontFamily:C.mn,marginBottom:6}}>MONETIZE: {p.monetize}</div>
                <Code text={p.prompt} mh={280}/>
              </div>}
            </div>);
          })}
        </div>
      </Card>
    </div>}

    {/* SAAS TEMPLATES */}
    {sec==="saas"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Top 10 profitable SaaS templates — copy-ready prompts" color={MU}/>
        <H3>SaaS Templates</H3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:14}}>{SAAS_TEMPLATES.map((s,i)=><button key={i} onClick={()=>setSaasSel(i)} style={{background:saasSel===i?MU+"18":"transparent",border:"1px solid "+(saasSel===i?MU+"55":C.bdr),color:saasSel===i?MU:C.di,borderRadius:9,padding:"8px 12px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s",textAlign:"left",display:"flex",flexDirection:"column",gap:3}}><span style={{fontFamily:C.mn,fontSize:10,opacity:0.6}}>#{s.rank}</span><span style={{fontWeight:600}}>{s.title}</span><span style={{fontSize:10,color:saasSel===i?MU+"99":C.di}}>{s.mrr.split("(")[0].trim()}</span></button>)}</div>
        </div>
        <div key={saasSel} className="anim-pop">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:14}}>
            {[{l:"Niche",v:SAAS_TEMPLATES[saasSel].niche},{l:"MRR Potential",v:SAAS_TEMPLATES[saasSel].mrr},{l:"Stack",v:SAAS_TEMPLATES[saasSel].stack}].map((item,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:C.di,fontFamily:C.mn,marginBottom:3}}>{item.l.toUpperCase()}</div>
                <div style={{fontSize:12,color:C.tx}}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:C.mu,marginBottom:12,lineHeight:1.6}}>{SAAS_TEMPLATES[saasSel].why}</div>
          <Code text={SAAS_TEMPLATES[saasSel].prompt} mh={320}/>
        </div>
      </Card>
    </div>}

    {/* FRAMEWORKS */}
    {sec==="frameworks"&&<Card accent={MU}>
      <Lbl text="Quick win → active → passive → hybrid — guided walkthrough" color={MU}/>
      <H3>Monetization Frameworks</H3>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {MONETIZE_FW.map((f,i)=><Pill key={f.id} label={f.label} active={fwSel===i} color={MU} onClick={()=>setFwSel(i)}/>)}
      </div>
      <div key={fwSel} className="anim-pop">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
          {[{l:"Timeframe",v:MONETIZE_FW[fwSel].timeframe},{l:"Income Range",v:MONETIZE_FW[fwSel].income},{l:"Description",v:MONETIZE_FW[fwSel].desc.split(".")[0]}].map((item,i)=>(
            <div key={i} style={{background:C.bg,border:`1px solid ${MU}22`,borderRadius:8,padding:"9px 11px"}}>
              <div style={{fontSize:10,color:MU,fontFamily:C.mn,marginBottom:3}}>{item.l.toUpperCase()}</div>
              <div style={{fontSize:12,color:C.tx}}>{item.v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>WALKTHROUGH STEPS</div>
        <div style={{display:"grid",gap:6,marginBottom:14}}>
          {MONETIZE_FW[fwSel].steps.map((step,i)=>(
            <div key={i} style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px",display:"flex",gap:10}}>
              <span style={{fontSize:10,color:MU,fontFamily:C.mn,minWidth:20,marginTop:1}}>{i+1}.</span>
              <span style={{fontSize:12,color:C.mu,lineHeight:1.5}}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:MU,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>COPY-READY PROMPT</div>
        <Code text={MONETIZE_FW[fwSel].prompt} mh={300}/>
      </div>
    </Card>}

    {/* DEPLOY STACKS */}
    {sec==="recipes"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Step-by-step income recipes — topic select + copy-ready prompt" color={MU}/>
        <H3>Monetization Recipes</H3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:14}}>
          {MONETIZE_RECIPES.map((r,i)=>(
            <button key={i} onClick={()=>setRecipeSel(i)} style={{background:recipeSel===i?MU+"18":"transparent",border:"1px solid "+(recipeSel===i?MU+"55":C.bdr),color:recipeSel===i?MU:C.di,borderRadius:9,padding:"10px 12px",cursor:"pointer",transition:"all 0.15s",textAlign:"left",display:"flex",flexDirection:"column",gap:4}}>
              <span style={{fontSize:10,color:recipeSel===i?MU:C.di,fontFamily:C.mn}}>{r.cat} · {r.time}</span>
              <span style={{fontWeight:700,fontSize:12,color:recipeSel===i?MU:C.tx}}>{r.label}</span>
              <span style={{fontSize:11,color:C.gn}}>{r.income}</span>
            </button>
          ))}
        </div>
        <div key={recipeSel} className="anim-pop">
          <div style={{background:C.bg,border:"1px solid "+MU+"22",borderRadius:9,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:10,color:MU,fontFamily:C.mn,marginBottom:4}}>STACK</div>
            <div style={{fontSize:12,color:C.mu}}>{MONETIZE_RECIPES[recipeSel].stack}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:C.am,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>STEP-BY-STEP WALKTHROUGH</div>
            <div style={{display:"grid",gap:6}}>
              {MONETIZE_RECIPES[recipeSel].steps.map((step,i)=>(
                <div key={i} style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:8,padding:"8px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:10,color:MU,fontFamily:C.mn,minWidth:18,marginTop:1,flexShrink:0}}>{i+1}.</span>
                  <span style={{fontSize:12,color:C.mu,lineHeight:1.5}}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{fontSize:10,color:MU,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>COPY-READY PROMPT</div>
          <Code text={MONETIZE_RECIPES[recipeSel].prompt} mh={380}/>
        </div>
      </Card>
    </div>}

    {sec==="deploy"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Free tier stacks — local, online, and hybrid options" color={MU}/>
        <H3>Free Deployment Stacks</H3>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>
          {["all","WEB","AUTOMATION","AI","AGENTIC","LOCAL"].map(f=><Pill key={f} label={f==="all"?"ALL":f} active={deployFilter===f} color={MU} onClick={()=>setDeployFilter(f)}/>)}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {DEPLOY_STACKS.filter(s=>deployFilter==="all"||s.tag.toUpperCase().includes(deployFilter)).map((s)=>{const idx=DEPLOY_STACKS.indexOf(s);return <button key={idx} onClick={()=>setDeploySel(idx)} style={{background:deploySel===idx?MU+"18":"transparent",border:"1px solid "+(deploySel===idx?MU+"55":C.bdr),color:deploySel===idx?MU:C.di,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{s.label}</button>;})}
        </div>

    {/* TOOL MATRIX */}
    {sec==="matrix"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Select your stack → get step-by-step guide + compatibility check" color={MU}/>
        <H3>Tool Matrix Builder</H3>
        {TOOL_MATRIX.map((cat,ci)=>{
          const selIdx=[matrixFront,matrixDB,matrixAI,matrixPay][ci];
          const setFn=[setMatrixFront,setMatrixDB,setMatrixAI,setMatrixPay][ci];
          return(
            <div key={ci} style={{marginBottom:14}}>
              <div style={{fontSize:10,color:MU,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>{cat.cat.toUpperCase()}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {cat.items.map((item,ii)=>(
                  <button key={ii} onClick={()=>{setFn(ii);setMatrixKey(k=>k+1);}} style={{background:selIdx===ii?MU+"18":"transparent",border:"1px solid "+(selIdx===ii?MU+"55":C.bdr),color:selIdx===ii?MU:C.di,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:4}}>
                    <span>{item.label}</span>
                    <span style={{fontSize:9,color:item.tier&&item.tier.includes("Free")?C.gn:item.free?C.gn:C.am}}>{item.tier||item.free?"FREE":"PAID"}</span>
                  </button>
                ))}
              </div>
              <div style={{marginTop:6}}>
                <div style={{fontSize:11,color:C.mu,marginBottom:3}}>{              <div style={{marginTop:6}}>
                <div style={{fontSize:11,color:C.mu,marginBottom:3}}>{TOOL_MATRIX[ci].items[selIdx].strength}</div>
                {TOOL_MATRIX[ci].items[selIdx].weakness&&<div style={{fontSize:10,color:C.am,marginTop:2}}>⚠️ {TOOL_MATRIX[ci].items[selIdx].weakness}</div>}
                {TOOL_MATRIX[ci].items[selIdx].tip&&<div style={{fontSize:10,color:C.cy,marginTop:3}}>💡 {TOOL_MATRIX[ci].items[selIdx].tip}</div>}
              </div>
                {TOOL_MATRIX[ci].items[selIdx].tip&&<div style={{fontSize:10,color:C.di}}>💡 {TOOL_MATRIX[ci].items[selIdx].tip}</div>}
              </div>
            </div>
          );
        })}
        <div key={matrixKey} className="anim-pop" style={{marginTop:8}}>
          <div style={{fontSize:10,color:C.gn,fontFamily:C.mn,letterSpacing:"0.1em",marginBottom:8}}>↓ GENERATED STACK GUIDE</div>
          <Code text={buildMatrixPrompt()} mh={380}/>
        </div>
      </Card>
    </div>}

    {sec==="automations"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="n8n · Make · Zapier · MCP — copy-ready workflow prompts" color={MU}/>
        <H3>Automation Workflows</H3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {AUTOMATION_WORKFLOWS.map((w,i)=>(
            <button key={i} onClick={()=>setAutoSel(i)} style={{background:autoSel===i?MU+"18":"transparent",border:"1px solid "+(autoSel===i?MU+"55":C.bdr),color:autoSel===i?MU:C.di,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{w.label}</button>
          ))}
        </div>
        <div key={autoSel} className="anim-pop">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:12}}>
            {[{l:"Tool",v:AUTOMATION_WORKFLOWS[autoSel].tool},{l:"Trigger",v:AUTOMATION_WORKFLOWS[autoSel].trigger},{l:"Use Case",v:AUTOMATION_WORKFLOWS[autoSel].desc}].map((item,i)=>(
              <div key={i} style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:C.di,fontFamily:C.mn,marginBottom:3}}>{item.l.toUpperCase()}</div>
                <div style={{fontSize:11,color:C.tx,lineHeight:1.4}}>{item.v}</div>
              </div>
            ))}
          </div>
          <Code text={AUTOMATION_WORKFLOWS[autoSel].prompt} mh={360}/>
        </div>
      </Card>
    </div>}

    {sec==="aitools"&&<div style={{display:"grid",gap:14}}>
      <Card accent={MU}>
        <Lbl text="Open‌Claw · Zero‌Claw · Null‌Claw · Agno · CrewAI — copy-ready prompts" color={MU}/>
        <H3>AI Agent Tools</H3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {AI_TOOLS.map((t,i)=>(
            <button key={i} onClick={()=>setAiToolSel(i)} style={{background:aiToolSel===i?MU+"18":"transparent",border:"1px solid "+(aiToolSel===i?MU+"55":C.bdr),color:aiToolSel===i?MU:C.di,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:C.mn,cursor:"pointer",transition:"all 0.15s"}}>{t.label}</button>
          ))}
        </div>
        <div key={aiToolSel} className="anim-pop">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:8,marginBottom:12}}>
            {[{l:"Category",v:AI_TOOLS[aiToolSel].cat},{l:"Tier",v:AI_TOOLS[aiToolSel].tier},{l:"Deploy",v:AI_TOOLS[aiToolSel].deploy},{l:"Use Case",v:AI_TOOLS[aiToolSel].usecase}].map((item,i)=>(
              <div key={i} style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:C.di,fontFamily:C.mn,marginBottom:3}}>{item.l.toUpperCase()}</div>
                <div style={{fontSize:11,color:C.tx,lineHeight:1.4}}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{background:C.bg,border:"1px solid "+C.cy+"22",borderRadius:8,padding:"10px 13px",marginBottom:12}}>
            <span style={{fontSize:10,color:C.cy,fontFamily:C.mn}}>💡 TIP: </span>
            <span style={{fontSize:11,color:C.mu}}>{AI_TOOLS[aiToolSel].tip}</span>
          </div>
          <Code text={AI_TOOLS[aiToolSel].prompt} mh={380}/>
        </div>
      </Card>
    </div>}

  </div>);
}


// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[zone,setZone]=useState("activate");
  const[zKey,setZKey]=useState(0);
  const[showSearch,setShowSearch]=useState(false);
  const[searchQ,setSearchQ]=useState("");
  const col=ZC[zone];

  useState(()=>{
    injectPWA();
    const ZONE_KEYS={"1":"activate","2":"build","3":"validate","4":"playbook","5":"monetize"};
    const h=(e)=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setShowSearch(s=>!s);return;}
      if(e.key==="Escape"){setShowSearch(false);return;}
      if(e.key==="/"&&!e.target.matches("input,textarea")){e.preventDefault();setShowSearch(true);return;}
      if(ZONE_KEYS[e.key]&&!e.target.matches("input,textarea")){setZone(ZONE_KEYS[e.key]);setZKey(k=>k+1);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  });

  const SEARCH_INDEX=[
    ...MODS.map(m=>({zone:"activate",label:m.mod,sub:m.cat+" — "+(m.tip||"")})),
    ...TASKS.map(t=>({zone:"activate",label:t.label,sub:"Task prompt"})),
    ...TMPLS.map(t=>({zone:"activate",label:t.label,sub:t.desc||""})),
    ...ENH.map(e=>({zone:"build",label:e.label,sub:e.when||"Enhancement protocol"})),
    ...VOCAB.map(v=>({zone:"build",label:v.t,sub:v.d})),
    ...LINT.map(r=>({zone:"validate",label:r.id,sub:r.check})),
    ...SWAPS.map(s=>({zone:"validate",label:"Swap: "+s.bad,sub:s.good})),
    ...WF.map(w=>({zone:"playbook",label:w.title,sub:w.purpose+" — "+w.best})),
    ...TOP10_PROMPTS.map(p=>({zone:"monetize",label:p.title,sub:p.cat+" — "+p.searches})),
    ...SAAS_TEMPLATES.map(s=>({zone:"monetize",label:s.title,sub:s.niche})),
    ...DEPLOY_STACKS.map(d=>({zone:"monetize",label:d.label,sub:d.tag||d.type||""})),
    ...AUTOMATION_WORKFLOWS.map(a=>({zone:"monetize",label:a.label,sub:a.tool+" — "+a.desc})),
    ...AI_TOOLS.map(a=>({zone:"monetize",label:a.label,sub:a.cat+" — "+a.desc})),
    ...MONETIZE_RECIPES.map(r=>({zone:"monetize",label:r.label,sub:r.cat+" — "+r.time+" — "+r.income})),
  ];
  const hits=searchQ.length>1?SEARCH_INDEX.filter(x=>x.label.toLowerCase().includes(searchQ.toLowerCase())||x.sub.toLowerCase().includes(searchQ.toLowerCase())).slice(0,8):[];

  const switchZone=(id,e)=>{
    if(id===zone)return;
    setZone(id);
    setZKey(k=>k+1);
    if(window.scrollY>80)window.scrollTo({top:0,behavior:"smooth"});
  };

  return(<>
    <style>{FONT_CSS}</style>
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.ss,color:C.tx,overscrollBehavior:"none"}}>
      {/* STICKY NAV */}
      <div style={{borderBottom:`1px solid ${C.bdr}`,padding:"clamp(10px,2vw,16px) clamp(12px,2.5vw,22px) 0",position:"sticky",top:0,background:C.bg+"f0",zIndex:100,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
            <div style={{fontSize:"clamp(8px,1.2vw,10px)",fontFamily:C.mn,color:C.fa,letterSpacing:"0.15em"}}>promptc OS · v2026.12 · powerUP</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={()=>setShowSearch(true)} style={{background:C.sur,border:"1px solid "+C.bdr,color:C.di,borderRadius:7,padding:"3px 9px",fontSize:10,fontFamily:C.mn,cursor:"pointer",display:"flex",gap:5,alignItems:"center"}} title="Press / or ⌘K to search. Press 1-5 to switch zones.">
                <span>⌘K</span><span style={{opacity:0.5}}>Search</span>
              </button>
              <div style={{fontSize:"clamp(8px,1.2vw,10px)",fontFamily:C.mn,color:col,letterSpacing:"0.1em",animation:"glowPulse 2s ease infinite"}}>{ZONES.find(z=>z.id===zone)?.label}</div>
            </div>
          </div>
          <h1 style={{margin:"0 0 12px",fontSize:"clamp(18px,3.5vw,28px)",fontWeight:900,letterSpacing:"0.03em",fontFamily:C.hd,lineHeight:1,transition:"color 0.4s"}}>
            AI PROMPT ENGINEERING <span style={{color:col,transition:"color 0.4s ease"}}>{ZONES.find(z=>z.id===zone)?.sub?.split(",")[0].toUpperCase()}</span>
          </h1>
          <nav role="tablist" aria-label="Zone navigation" style={{display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
            {ZONES.map(z=>{const c=ZC[z.id];const a=zone===z.id;return(
              <button key={z.id} onClick={e=>switchZone(z.id,e)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${a?c:"transparent"}`,color:a?c:C.di,padding:"8px clamp(8px,1.8vw,16px)",fontSize:"clamp(9px,1.4vw,12px)",fontWeight:600,cursor:"pointer",transition:"color 0.2s, border-color 0.2s",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:1,whiteSpace:"nowrap",flexShrink:0,fontFamily:C.ss}}>
                <span>{z.label}</span>
                <span style={{fontSize:"clamp(7px,1vw,9px)",fontFamily:C.mn,color:a?c+"99":C.fa+"88",fontWeight:400,transition:"color 0.2s"}}>{z.sub}</span>
              </button>
            );})}
          </nav>
        </div>
      </div>

      {/* ⌘K SEARCH OVERLAY */}
      {showSearch&&<div onClick={()=>setShowSearch(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"15vh",backdropFilter:"blur(4px)"}}>
        <div onClick={e=>e.stopPropagation()} style={{width:"min(600px,90vw)",background:C.sur,border:"1px solid "+C.bdrH,borderRadius:14,overflow:"hidden",boxShadow:"0 25px 60px rgba(0,0,0,0.5)",animation:"popIn 0.2s ease-out"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid "+C.bdr}}>
            <span style={{fontSize:16,opacity:0.5}}>🔍</span>
            <input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search prompts, workflows, vocab, tools…" style={{flex:1,background:"transparent",border:"none",color:C.tx,fontSize:15,fontFamily:C.ss,outline:"none"}}/>
            <kbd style={{fontSize:10,color:C.di,background:C.bg,border:"1px solid "+C.bdr,borderRadius:4,padding:"2px 6px",fontFamily:C.mn}}>ESC</kbd>
          </div>
          {hits.length>0&&<div style={{borderBottom:"1px solid "+C.bdr,padding:"6px 16px",fontSize:10,color:C.di,fontFamily:C.mn}}>{hits.length} result{hits.length!==1?"s":""} across all zones</div>}
          {hits.length>0&&<div style={{maxHeight:340,overflowY:"auto"}}>
            {hits.map((r,i)=><div key={i} onClick={()=>{setZone(r.zone);setZKey(k=>k+1);setShowSearch(false);setSearchQ("");}} style={{padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid "+C.bdr+"44",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <div><div style={{fontSize:13,color:C.tx,marginBottom:2}}>{r.label}</div><div style={{fontSize:11,color:C.di,lineHeight:1.4}}>{r.sub}</div></div>
              <span style={{fontSize:10,color:ZC[r.zone]||C.cy,fontFamily:C.mn,background:(ZC[r.zone]||C.cy)+"15",border:"1px solid "+(ZC[r.zone]||C.cy)+"30",borderRadius:20,padding:"2px 8px",whiteSpace:"nowrap",flexShrink:0}}>{r.zone.toUpperCase()}</span>
            </div>)}
          </div>}
          {searchQ.length>1&&hits.length===0&&<div style={{padding:"20px",textAlign:"center",color:C.di,fontSize:13}}>No results for "{searchQ}"</div>}
          <div style={{padding:"8px 16px",borderTop:"1px solid "+C.bdr,display:"flex",gap:12,fontSize:10,color:C.di,fontFamily:C.mn}}>
            <span>Press <kbd style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:3,padding:"1px 5px"}}>1-5</kbd> to jump to zone</span>
            <span><kbd style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:3,padding:"1px 5px"}}>/</kbd> to search</span>
            <span><kbd style={{background:C.bg,border:"1px solid "+C.bdr,borderRadius:3,padding:"1px 5px"}}>Esc</kbd> to close</span>
          </div>
          {searchQ.length<=1&&<div style={{padding:"12px 16px",display:"flex",gap:6,flexWrap:"wrap"}}>
            {ZONES.map(z=><button key={z.id} onClick={()=>{setZone(z.id);setZKey(k=>k+1);setShowSearch(false);}} style={{background:ZC[z.id]+"15",border:"1px solid "+ZC[z.id]+"30",color:ZC[z.id],borderRadius:20,padding:"4px 12px",fontSize:11,fontFamily:C.mn,cursor:"pointer"}}>{z.label}</button>)}
          </div>}
        </div>
      </div>}

      {/* ZONE CONTENT */}
      <main role="main" aria-label="promptc OS content" style={{maxWidth:980,margin:"0 auto",padding:"clamp(12px,2.5vw,20px) clamp(10px,2vw,22px) 80px"}}>
        <div key={zKey} className="anim-zone">
          {zone==="activate" &&<Activate/>}
          {zone==="build"    &&<Build/>}
          {zone==="validate" &&<Validate/>}
          {zone==="playbook" &&<Playbook/>}
          {zone==="monetize" &&<MonetizeView/>}
        </div>
      </main>

      {/* FLOATING ZONE INDICATOR — mobile */}
      <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,padding:"6px 10px",background:C.sur+"ee",border:`1px solid ${col}33`,borderRadius:999,backdropFilter:"blur(12px)",zIndex:200,pointerEvents:"none"}}>
        {ZONES.map(z=><div key={z.id} style={{width:zone===z.id?18:5,height:5,borderRadius:999,background:zone===z.id?ZC[z.id]:C.bdr,transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)"}}/>)}
      </div>
    </div>
  </>);
}

