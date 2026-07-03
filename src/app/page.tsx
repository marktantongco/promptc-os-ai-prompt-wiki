'use client';

import { useMemo, useState } from "react";
import { Menu, X, Search, Zap } from "lucide-react";
import { SECTIONS, search, type SearchItem } from "@/lib/wiki-data";
import { cn } from "@/lib/utils";
import { ActivateSection, BuildSection, ValidateSection, PlaybookSection, BuilderSection } from "@/components/wiki/sections-core";
import { CombosSection, SkillsSection, MonetizeSection, EcosystemSection, AgentsSection } from "@/components/wiki/sections-new";
import { FieldGuideSection } from "@/components/wiki/section-field-guide";
import { CopyButton } from "@/components/wiki/copy-button";
import { usePins, PinBadge, PinListPanel } from "@/components/wiki/pin-list";

const SECTION_COMPONENTS: Record<string, () => JSX.Element> = {
  activate: ActivateSection,
  build: BuildSection,
  validate: ValidateSection,
  playbook: PlaybookSection,
  builder: BuilderSection,
  combos: CombosSection,
  skills: SkillsSection,
  monetize: MonetizeSection,
  ecosystem: EcosystemSection,
  "field-guide": FieldGuideSection,
  agents: AgentsSection,
};

export default function Home() {
  const [active, setActive] = useState('activate');
  const [q, setQ] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinPanelOpen, setPinPanelOpen] = useState(false);
  const { pins, removePin } = usePins();

  const results = useMemo(() => q.trim() ? search(q) : [], [q]);
  const ActiveSection = SECTION_COMPONENTS[active] ?? ActivateSection;

  const go = (id: string) => {
    setActive(id);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="wiki-shell bg-[#0B0D10] text-white">
      {/* Top bar (mobile + desktop) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0D10]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0D10]/80">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); go('activate'); }} className="flex items-center gap-2 lg:hidden">
            <Zap className="h-5 w-5 text-cyan-400" />
            <span className="wiki-display text-xl">promptc OS</span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search 200+ prompts, animals, combos, recipes…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/50"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10">
                <X className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Pin button */}
          <PinBadge count={pins.length} onClick={() => setPinPanelOpen(true)} />

          <a
            href="https://github.com/marktantongco/promptc"
            target="_blank" rel="noopener"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            source ↗
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto p-3">
          <SidebarContent active={active} go={go} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
            <aside className="relative w-72 max-w-[80vw] bg-[#0B0D10] border-r border-white/10 overflow-y-auto p-3 anim-slide">
              <div className="flex items-center justify-between mb-3">
                <span className="mono-label text-zinc-500">NAVIGATION</span>
                <button onClick={() => setDrawerOpen(false)} className="p-1 rounded hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent active={active} go={go} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
          {q.trim() ? (
            <SearchResults results={results} query={q} go={go} />
          ) : (
            <ActiveSection />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0D10] px-4 py-5 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span className="wiki-display text-sm text-zinc-400">promptc OS · WIKI</span>
            <span className="text-zinc-600">·</span>
            <span>mobile-first knowledge base</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://skills.sh" target="_blank" rel="noopener" className="hover:text-zinc-300">skills.sh</a>
            <a href="https://llmbase.ai/skills" target="_blank" rel="noopener" className="hover:text-zinc-300">llmbase.ai</a>
            <a href="https://skillsllm.com" target="_blank" rel="noopener" className="hover:text-zinc-300">skillsllm.com</a>
            <span className="text-zinc-700">·</span>
            <span>source: @markytanky</span>
          </div>
        </div>
      </footer>

      {/* Pin List Panel */}
      {pinPanelOpen && (
        <PinListPanel
          pins={pins}
          removePin={removePin}
          onClose={() => setPinPanelOpen(false)}
          onNavigate={go}
        />
      )}
    </div>
  );
}

function SidebarContent({ active, go }: { active: string; go: (id: string) => void }) {
  return (
    <>
      <a href="#" onClick={(e) => { e.preventDefault(); go('activate'); }} className="hidden lg:flex items-center gap-2 mb-4 px-2">
        <Zap className="h-5 w-5 text-cyan-400" />
        <div>
          <div className="wiki-display text-xl">promptc OS</div>
          <div className="text-[10px] text-zinc-500 -mt-1 font-mono">AI SECRET SAUCE WIKI</div>
        </div>
      </a>

      <nav className="space-y-0.5">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={cn(
              "w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all",
              active === s.id ? "bg-white/5" : "hover:bg-white/5"
            )}
            style={active === s.id ? { boxShadow: `inset 2px 0 0 ${s.color}` } : undefined}
          >
            <span className="text-base mt-0.5">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium truncate"
                style={{ color: active === s.id ? s.color : undefined }}
              >
                {s.label}
                {s.count !== undefined && (
                  <span className="ml-1.5 text-[10px] font-mono text-zinc-600">{s.count}</span>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 line-clamp-2 leading-tight mt-0.5">{s.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="mono-label text-zinc-600 mb-1.5 px-2">SOURCE</div>
        <a
          href="https://github.com/marktantongco/promptc"
          target="_blank" rel="noopener"
          className="block text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1"
        >
          github.com/marktantongco/promptc ↗
        </a>
        <a
          href="https://raw.githubusercontent.com/marktantongco/opencode-accomplishments/refs/heads/main/profiles/system_silentdepth_v4.md"
          target="_blank" rel="noopener"
          className="block text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1"
        >
          silentdepth v4 profile ↗
        </a>
      </div>
    </>
  );
}

function SearchResults({ results, query, go }: { results: SearchItem[]; query: string; go: (id: string) => void }) {
  return (
    <div className="anim-zone">
      <div className="mb-4">
        <div className="mono-label text-cyan-400 mb-1">SEARCH</div>
        <h1 className="wiki-display text-3xl mb-1">
          {results.length} result{results.length !== 1 ? 's' : ''}
          <span className="text-base text-zinc-500 ml-2 font-sans">for "{query}"</span>
        </h1>
        <p className="text-xs text-zinc-500">Click any result to jump to its section.</p>
      </div>

      {results.length === 0 ? (
        <div className="p-8 rounded-xl border border-white/10 bg-[#14161A] text-center">
          <p className="text-sm text-zinc-400">No matches. Try broader terms — search covers labels, descriptions, full prompt text, and tags.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => go(r.section)}
              className="block w-full text-left p-3 rounded-lg border border-white/10 bg-[#14161A] hover:bg-[#1a1d22] hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="mono-label" style={{ color: r.sectionColor }}>{r.sectionLabel}</span>
                <span className="text-sm font-semibold text-white truncate flex-1">{r.label}</span>
                <CopyButton text={r.content} />
              </div>
              {r.desc && <p className="text-xs text-zinc-500 line-clamp-1 mb-1">{r.desc}</p>}
              <p className="text-xs text-zinc-400 line-clamp-2 font-mono leading-relaxed">{r.content.slice(0, 200)}{r.content.length > 200 ? '…' : ''}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
