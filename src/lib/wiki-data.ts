// Central data loader for the promptc OS wiki.
// All 48 source data arrays are imported as typed objects and exposed
// through a single module. A unified search index is built for client-side search.

import C from "@/data/C.json";
import ZC from "@/data/ZC.json";
import AC from "@/data/AC.json";
import AE from "@/data/AE.json";
import ZONES from "@/data/ZONES.json";
import MASTER from "@/data/MASTER.json";
import ADVOCATE from "@/data/ADVOCATE.json";
import MODS from "@/data/MODS.json";
import TASKS from "@/data/TASKS.json";
import BRAND from "@/data/BRAND.json";
import BRANDS from "@/data/BRANDS.json";
import TMPLS from "@/data/TMPLS.json";
import LAYERS from "@/data/LAYERS.json";
import LAYER_TPL from "@/data/LAYER_TPL.json";
import ANIMALS from "@/data/ANIMALS.json";
import CHAINS from "@/data/CHAINS.json";
import META from "@/data/META.json";
import ENH from "@/data/ENH.json";
import WEB_VARS from "@/data/WEB_VARS.json";
import DOLPHIN_C from "@/data/DOLPHIN_C.json";
import JSON_GLOBAL from "@/data/JSON_GLOBAL.json";
import JSON_T from "@/data/JSON_T.json";
import JSON_MX from "@/data/JSON_MX.json";
import VOCAB from "@/data/VOCAB.json";
import COMBOS from "@/data/COMBOS.json";
import TYPO from "@/data/TYPO.json";
import TYPO_I from "@/data/TYPO_I.json";
import LINT from "@/data/LINT.json";
import AESTHETIC_KEYWORDS from "@/data/AESTHETIC_KEYWORDS.json";
import SWAPS from "@/data/SWAPS.json";
import ROLES from "@/data/ROLES.json";
import ANIM_LIBS from "@/data/ANIM_LIBS.json";
import CONSTRAINT_OPTS from "@/data/CONSTRAINT_OPTS.json";
import STACK_FRAMEWORKS from "@/data/STACK_FRAMEWORKS.json";
import STACK_STYLING from "@/data/STACK_STYLING.json";
import STACK_ANIM from "@/data/STACK_ANIM.json";
import CHECKS from "@/data/CHECKS.json";
import SDIMS from "@/data/SDIMS.json";
import SSCALE from "@/data/SSCALE.json";
import WF from "@/data/WF.json";
import DEPLOY_STACKS from "@/data/DEPLOY_STACKS.json";
import TOOL_MATRIX from "@/data/TOOL_MATRIX.json";
import TOP10_PROMPTS from "@/data/TOP10_PROMPTS.json";
import SAAS_TEMPLATES from "@/data/SAAS_TEMPLATES.json";
import MONETIZE_FW from "@/data/MONETIZE_FW.json";
import AUTOMATION_WORKFLOWS from "@/data/AUTOMATION_WORKFLOWS.json";
import AI_TOOLS from "@/data/AI_TOOLS.json";
import MONETIZE_RECIPES from "@/data/MONETIZE_RECIPES.json";

// Enriched / new data (authored for this wiki)
import COMBO_RATINGS from "@/data/enriched/combo-ratings.json";
import SKILL_STACKS from "@/data/enriched/skill-stacks.json";
import ECOSYSTEM_BLUEPRINTS from "@/data/enriched/ecosystem-blueprints.json";
import SKILLS_DIRECTORY from "@/data/enriched/skills-directory.json";
import ANIMAL_GUIDE from "@/data/enriched/animal-guide.json";
import MOTION_STACK_COMBOS from "@/data/enriched/motion-stack-combos.json";
import FOUNDATIONAL_CORES from "@/data/enriched/foundational-cores.json";
import COMPONENT_SWAP_GUIDE from "@/data/enriched/component-swap-guide.json";
import SKILLS_LEADERBOARD from "@/data/enriched/skills-leaderboard-data.json";

// ── Types (loose — the source data is dynamic) ──────────────────────────────
type AnyRecord = Record<string, any>;

export const data = {
  C: C as AnyRecord,
  ZC: ZC as AnyRecord,
  AC: AC as AnyRecord,
  AE: AE as AnyRecord,
  ZONES: ZONES as AnyRecord[],
  MASTER: MASTER as string,
  ADVOCATE: ADVOCATE as string,
  MODS: MODS as AnyRecord[],
  TASKS: TASKS as AnyRecord[],
  BRAND: BRAND as string,
  BRANDS: BRANDS as AnyRecord[],
  TMPLS: TMPLS as AnyRecord[],
  LAYERS: LAYERS as AnyRecord[],
  LAYER_TPL: LAYER_TPL as string,
  ANIMALS: ANIMALS as AnyRecord[],
  CHAINS: CHAINS as AnyRecord[],
  META: META as AnyRecord,
  ENH: ENH as AnyRecord[],
  WEB_VARS: WEB_VARS as AnyRecord[],
  DOLPHIN_C: DOLPHIN_C as AnyRecord[],
  JSON_GLOBAL: JSON_GLOBAL as string,
  JSON_T: JSON_T as AnyRecord[],
  JSON_MX: JSON_MX as AnyRecord[],
  VOCAB: VOCAB as AnyRecord[],
  COMBOS: COMBOS as AnyRecord[],
  TYPO: TYPO as AnyRecord[],
  TYPO_I: TYPO_I as AnyRecord[],
  LINT: LINT as AnyRecord[],
  AESTHETIC_KEYWORDS: AESTHETIC_KEYWORDS as string[],
  SWAPS: SWAPS as AnyRecord[],
  ROLES: ROLES as string[],
  ANIM_LIBS: ANIM_LIBS as string[],
  CONSTRAINT_OPTS: CONSTRAINT_OPTS as string[],
  STACK_FRAMEWORKS: STACK_FRAMEWORKS as string[],
  STACK_STYLING: STACK_STYLING as string[],
  STACK_ANIM: STACK_ANIM as string[],
  CHECKS: CHECKS as AnyRecord[],
  SDIMS: SDIMS as AnyRecord[],
  SSCALE: SSCALE as AnyRecord[],
  WF: WF as AnyRecord[],
  DEPLOY_STACKS: DEPLOY_STACKS as AnyRecord[],
  TOOL_MATRIX: TOOL_MATRIX as AnyRecord[],
  TOP10_PROMPTS: TOP10_PROMPTS as AnyRecord[],
  SAAS_TEMPLATES: SAAS_TEMPLATES as AnyRecord[],
  MONETIZE_FW: MONETIZE_FW as AnyRecord[],
  AUTOMATION_WORKFLOWS: AUTOMATION_WORKFLOWS as AnyRecord[],
  AI_TOOLS: AI_TOOLS as AnyRecord[],
  MONETIZE_RECIPES: MONETIZE_RECIPES as AnyRecord[],
  COMBO_RATINGS: COMBO_RATINGS as AnyRecord[],
  SKILL_STACKS: SKILL_STACKS as AnyRecord[],
  ECOSYSTEM_BLUEPRINTS: ECOSYSTEM_BLUEPRINTS as AnyRecord[],
  SKILLS_DIRECTORY: SKILLS_DIRECTORY as AnyRecord[],
  ANIMAL_GUIDE: ANIMAL_GUIDE as AnyRecord[],
  MOTION_STACK_COMBOS: MOTION_STACK_COMBOS as AnyRecord[],
  FOUNDATIONAL_CORES: FOUNDATIONAL_CORES as AnyRecord[],
  COMPONENT_SWAP_GUIDE: COMPONENT_SWAP_GUIDE as AnyRecord[],
  SKILLS_LEADERBOARD: SKILLS_LEADERBOARD as AnyRecord[],
};

// ── Sidebar section catalog ─────────────────────────────────────────────────
export interface WikiSection {
  id: string;
  label: string;
  short: string;
  color: string; // hex
  emoji: string;
  desc: string;
  count?: number;
}

export const SECTIONS: WikiSection[] = [
  { id: "activate",  label: "Activate",  short: "ACT",  color: "#4DFFFF", emoji: "⚡", desc: "Master prompts, advocate mode, secret-sauce modifiers, task prompts, templates, brand systems.", count: data.MODS.length + data.TASKS.length + data.TMPLS.length + data.BRANDS.length + 2 },
  { id: "build",     label: "Build",     short: "BLD",  color: "#FF6B00", emoji: "🏗", desc: "Animals & chains, 8-layer composer, enhancements, web-app generator, JSON matrix, typography, design vocabulary.", count: data.ANIMALS.length + data.CHAINS.length + data.VOCAB.length + data.TYPO.length + data.LINT.length + data.ENH.length },
  { id: "validate",  label: "Validate",  short: "VAL",  color: "#22c55e", emoji: "✅", desc: "Lint rules, word swaps + aesthetic keyword picker, quality checklist, prompt scoring.", count: data.SWAPS.length + data.LINT.length + data.CHECKS.length },
  { id: "playbook",  label: "Playbook",  short: "PB",   color: "#FFB000", emoji: "📋", desc: "24 step-by-step workflows across 7 categories with copy-ready chain prompts.", count: data.WF.length },
  { id: "builder",   label: "Builder",   short: "BLDR", color: "#FF4FD8", emoji: "🔨", desc: "Interactive workflow builder, 8-layer composer, prompt diff tool.", },
  { id: "combos",    label: "Design Combos", short: "CMB", color: "#38bdf8", emoji: "🎨", desc: "20 synergy-rated design combos with structural reasoning and use cases.", count: data.COMBOS.length },
  { id: "skills",    label: "Skills Builder", short: "SKL", color: "#FFD700", emoji: "🧱", desc: "Curated 3-5 skill stacks, principles, health compounding, install commands.", count: data.SKILL_STACKS.length },
  { id: "monetize",  label: "Monetize",  short: "$",    color: "#FFD700", emoji: "💸", desc: "Top 20 monetization prompts, SaaS templates, frameworks, recipes, automation workflows.", count: data.TOP10_PROMPTS.length + data.SAAS_TEMPLATES.length + data.MONETIZE_RECIPES.length },
  { id: "ecosystem", label: "Ecosystem", short: "ECO",  color: "#22c55e", emoji: "🌐", desc: "Interconnectivity blueprints, motion patterns, infographic patterns, MCP integrations.", count: data.ECOSYSTEM_BLUEPRINTS.length },
  { id: "field-guide", label: "Field Guide", short: "FG", color: "#4DFFFF", emoji: "🧭", desc: "30 motion-stack combos across 3 directions + live 21st.dev registry search (server-side proxied) + top-5 synergies per foundational core. Adapted from marktantongco/skill-stack-field-guide.", count: 33 },
  { id: "agents",    label: "AGENTS.md", short: "AG",   color: "#a1a1aa", emoji: "📜", desc: "Operating conventions (silentdepth v4 style), install commands, decision trees, failure modes.", },
];

// ── Search index ────────────────────────────────────────────────────────────
// Each search item: { section, label, desc, content, tags }
export interface SearchItem {
  section: string;
  sectionLabel: string;
  sectionColor: string;
  id: string;
  label: string;
  desc: string;
  content: string; // the prompt text or body
  tags: string[];
}

function push(arr: SearchItem[], section: string, items: AnyRecord[], fieldMap: { id?: string; label: string[]; desc?: string[]; content: string[]; tags?: string[] }) {
  const sec = SECTIONS.find(s => s.id === section)!;
  for (const it of items) {
    const label = fieldMap.label.map(f => it[f] ?? "").filter(Boolean).filter(Boolean).join(" · ");
    const desc = (fieldMap.desc ?? []).map(f => it[f] ?? "").filter(Boolean).join(" ");
    const content = fieldMap.content.map(f => it[f] ?? "").filter(Boolean).join("\n\n");
    const tags = (fieldMap.tags ?? []).flatMap(f => Array.isArray(it[f]) ? it[f] : (it[f] ? [it[f]] : []));
    if (label || content) {
      arr.push({
        section, sectionLabel: sec.label, sectionColor: sec.color,
        id: String(it[fieldMap.id ?? "id"] ?? label.slice(0, 32)),
        label, desc, content, tags,
      });
    }
  }
}

function buildSearchIndex(): SearchItem[] {
  const idx: SearchItem[] = [];
  push(idx, "activate", data.MODS, { label: ["mod"], desc: ["tip"], content: ["mod"], tags: ["cat"] });
  push(idx, "activate", data.TASKS, { label: ["mod"], desc: ["tip"], content: ["mod"], tags: ["cat"] });
  push(idx, "activate", data.TMPLS, { label: ["label"], desc: ["desc"], content: ["content"], tags: ["cat", "group"] });
  push(idx, "activate", data.BRANDS, { label: ["label", "id"], desc: ["uc"], content: ["prompt"], tags: ["id"] });
  push(idx, "activate", [{ id: "master", label: "Master System Prompt", content: data.MASTER }], { label: ["label"], content: ["content"] });
  push(idx, "activate", [{ id: "advocate", label: "Advocate Mode", content: data.ADVOCATE }], { label: ["label"], content: ["content"] });

  push(idx, "build", data.ANIMALS, { label: ["name"], desc: ["mode"], content: ["prompt"], tags: ["name"] });
  push(idx, "build", data.CHAINS, { label: ["goal"], desc: ["best"], content: ["c"] });
  push(idx, "build", data.VOCAB, { label: ["t"], desc: ["d"], content: ["adv"], tags: ["cat"] });
  push(idx, "build", data.COMBOS, { label: ["combo"], desc: ["best"], content: ["els", "psych"] });
  push(idx, "build", data.TYPO, { label: ["d"], desc: ["b"], content: ["m"] });
  push(idx, "build", data.ENH, { label: ["label"], desc: ["when"], content: ["content"], tags: ["cat"] });

  push(idx, "validate", data.SWAPS, { label: ["bad"], desc: ["good"], content: ["good", "tip"], tags: ["level"] });
  push(idx, "validate", data.LINT, { label: ["check"], desc: ["fix"], content: ["fix"], tags: ["seg"] });

  push(idx, "playbook", data.WF, { label: ["title"], desc: ["purpose"], content: ["out"], tags: ["cat", "best"] });

  push(idx, "monetize", data.TOP10_PROMPTS, { label: ["title"], desc: ["why"], content: ["prompt"], tags: ["cat"] });
  push(idx, "monetize", data.SAAS_TEMPLATES, { label: ["title"], desc: ["niche"], content: ["stack", "why"], tags: ["cat"] });
  push(idx, "monetize", data.MONETIZE_RECIPES, { label: ["label"], desc: ["stack"], content: ["prompt"], tags: ["cat"] });
  push(idx, "monetize", data.MONETIZE_FW, { label: ["label"], desc: ["desc"], content: ["prompt"], tags: ["cat"] });
  push(idx, "monetize", data.AUTOMATION_WORKFLOWS, { label: ["label"], desc: ["trigger"], content: ["prompt"], tags: ["tool"] });

  push(idx, "skills", data.SKILL_STACKS, { label: ["name"], desc: ["thesis"], content: ["why", "use"], tags: ["stack"] });
  push(idx, "ecosystem", data.ECOSYSTEM_BLUEPRINTS, { label: ["name"], desc: ["desc"], content: ["blueprint"], tags: ["layer"] });

  return idx;
}

export const SEARCH_INDEX = buildSearchIndex();

export function search(q: string): SearchItem[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const tokens = term.split(/\s+/);
  return SEARCH_INDEX.filter(item => {
    const hay = `${item.label} ${item.desc} ${item.content} ${item.tags.join(" ")}`.toLowerCase();
    return tokens.every(t => hay.includes(t));
  }).slice(0, 200);
}
