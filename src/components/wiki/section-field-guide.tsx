'use client';

import { useMemo, useState, useCallback } from "react";
import { data } from "@/lib/wiki-data";
import { CopyButton, CodeBlock } from "./copy-button";
import { SectionHeader, WikiCard, Pill, Lbl } from "./primitives";
import { Search, ExternalLink, AlertCircle } from "lucide-react";

// ── 21ST.DEV LIVE REGISTRY SEARCH ──────────────────────────────────────────
function TwentyFirstSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const run = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/21st-search?q=${encodeURIComponent(query)}&limit=20`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || `HTTP ${res.status}`);
        setResults([]);
      } else {
        setResults(json.results || []);
        if (json.error) setError(json.error);
      }
    } catch (e: any) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestions = ["button", "hero", "card", "navbar", "modal", "input", "tabs", "accordion", "tooltip", "sidebar"];

  return (
    <WikiCard accent="#4DFFFF">
      <Lbl text="Live 21st.dev Component Registry" color="#4DFFFF" />
      <p className="text-xs text-zinc-400 mb-3">
        Real-time search of the public 21st.dev component library via the official{" "}
        <code className="text-cyan-400 font-mono text-[10px]">/api/v1/components/search</code> endpoint.
        <span className="text-green-400"> Proxied server-side — your API key never reaches the browser.</span>
      </p>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && run(q)}
            placeholder="Search components: button, hero, card, navbar…"
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/50"
          />
        </div>
        <button
          onClick={() => run(q)}
          disabled={loading || !q.trim()}
          className="px-4 py-2 rounded-lg font-mono uppercase text-xs tracking-wider bg-cyan-500/15 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/25 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "…" : "SEARCH"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <span className="mono-label text-zinc-600 mr-1">TRY:</span>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setQ(s); run(s); }}
            className="text-[10px] px-2 py-0.5 rounded border border-white/15 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 font-mono"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-orange-500/30 bg-orange-500/5 mb-3">
          <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <div className="text-orange-400 font-semibold mb-0.5">{error}</div>
            {error.includes("not configured") && (
              <div className="text-zinc-400">
                Add <code className="text-orange-300">API_KEY_21ST=an_sk_…</code> to{" "}
                <code className="text-orange-300">.env.local</code> (already gitignored).
                Get a key at{" "}
                <a href="https://21st.dev/dashboard" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
                  21st.dev/dashboard ↗
                </a>
              </div>
            )}
            {error.includes("401") && (
              <div className="text-zinc-400">Key may be invalid or expired. Verify at 21st.dev/dashboard.</div>
            )}
          </div>
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="text-xs text-zinc-500 p-3 text-center">No components matched "{q}".</div>
      )}

      {results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
          {results.map((r: any, i: number) => (
            <div key={r.id || i} className="p-2 rounded-lg border border-white/10 bg-black/30">
              {r.preview && (
                <img
                  src={r.preview}
                  alt={r.name}
                  className="w-full h-24 object-cover rounded mb-2 bg-zinc-900"
                  loading="lazy"
                />
              )}
              <div className="font-semibold text-xs mb-0.5 truncate">{r.name}</div>
              {r.author && <div className="text-[10px] text-zinc-500 mb-1">@{r.author}</div>}
              {r.description && (
                <p className="text-[10px] text-zinc-400 line-clamp-2 mb-2">{r.description}</p>
              )}
              <div className="flex items-center gap-1">
                <CopyButton text={r.install_command} label="COPY INSTALL" />
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  className="text-[10px] px-2 py-1 rounded border border-white/15 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" /> OPEN
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </WikiCard>
  );
}

// ── 30 MOTION-STACK COMBOS ─────────────────────────────────────────────────
function MotionStackCombos() {
  const [direction, setDirection] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [sort, setSort] = useState<'default' | 'score'>('default');

  const combos = data.MOTION_STACK_COMBOS;
  const filtered = useMemo(() => {
    let r = direction === 'all' ? combos : combos.filter((c: any) => c.direction.startsWith(direction));
    if (sort === 'score') r = [...r].sort((a: any, b: any) => b.score - a.score);
    return r;
  }, [direction, sort, combos]);

  const dirColor = (d: string) => d.startsWith('A') ? '#FF4FD8' : d.startsWith('B') ? '#22c55e' : '#38bdf8';
  const scoreColor = (s: number) => s >= 9 ? '#22c55e' : s >= 7 ? '#FFB000' : s >= 5 ? '#FF6B00' : '#ef4444';
  const mobileColor = (m: string) => m === 'High' ? '#22c55e' : m === 'Medium' ? '#FFB000' : '#ef4444';

  return (
    <div>
      <Lbl text="30 Skill-Stack Combinations" color="#4DFFFF" />
      <p className="text-xs text-zinc-400 mb-3">
        Three deliberate directions, ten combinations each. A chases silk-smooth premium agency motion. B bets on zero-bundle native browser primitives. C goes spatial and immersive. Each combo has logic, constraint, mitigation, synergy score, and mobile rating.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Pill label={`All (${combos.length})`} active={direction === 'all'} color="#4DFFFF" onClick={() => setDirection('all')} />
        <Pill label="A · Silk & GPU" active={direction === 'A'} color="#FF4FD8" onClick={() => setDirection('A')} count={combos.filter((c:any)=>c.direction.startsWith('A')).length} />
        <Pill label="B · Zero-Bundle" active={direction === 'B'} color="#22c55e" onClick={() => setDirection('B')} count={combos.filter((c:any)=>c.direction.startsWith('B')).length} />
        <Pill label="C · Spatial" active={direction === 'C'} color="#38bdf8" onClick={() => setDirection('C')} count={combos.filter((c:any)=>c.direction.startsWith('C')).length} />
        <div className="ml-auto">
          <Pill label="Sort by score ↓" active={sort === 'score'} color="#FFB000" onClick={() => setSort(sort === 'score' ? 'default' : 'score')} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((c: any) => {
          const dc = dirColor(c.direction);
          const sc = scoreColor(c.score);
          const mc = mobileColor(c.mobile);
          return (
            <WikiCard key={c.num} accent={dc} pad="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="mono-label" style={{ color: dc }}>#{c.num} · {c.direction}</div>
                  <div className="font-semibold text-sm mt-0.5">{c.name}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-mono text-lg font-bold" style={{ color: sc }}>{c.score}/10</span>
                  <span className="text-[9px] font-mono" style={{ color: mc }}>{c.mobile} mobile</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 bg-black/30 text-zinc-400 font-mono">{c.stack}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 bg-black/30 text-zinc-500 font-mono">{c.framework}</span>
              </div>
              <div className="text-xs text-zinc-300 mb-1"><span className="text-zinc-600">Logic:</span> {c.logic}</div>
              <div className="text-xs text-orange-300 mb-1"><span className="text-zinc-600">Constraint:</span> {c.constraint}</div>
              <div className="text-xs text-green-300 mb-1"><span className="text-zinc-600">Mitigation:</span> {c.mitigation}</div>
              <div className="text-[10px] text-zinc-500 mt-1"><span className="text-zinc-700">USE:</span> {c.use_case}</div>
            </WikiCard>
          );
        })}
      </div>
    </div>
  );
}

// ── TOP-5 SYNERGIES PER FOUNDATIONAL CORE ──────────────────────────────────
function FoundationalCores() {
  const cores = data.FOUNDATIONAL_CORES;
  const [expanded, setExpanded] = useState<string | null>(cores[0]?.id || null);

  return (
    <div>
      <Lbl text="Three Foundational Cores" color="#4DFFFF" />
      <p className="text-xs text-zinc-400 mb-3">
        Every combination composes around at least one foundational core — a skill that either enforces quality, generates designs, or supplies the component vocabulary. Get these three right first; everything else is a multiplier on top.
      </p>

      <div className="space-y-2">
        {cores.map((core: any, i: number) => {
          const isOpen = expanded === core.id;
          return (
            <WikiCard key={core.id} accent="#4DFFFF" pad="p-3">
              <button
                onClick={() => setExpanded(isOpen ? null : core.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                <span className="font-mono text-2xl text-cyan-400/40">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-semibold text-cyan-400">{core.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{core.category}</div>
                </div>
                <span className="text-[10px] text-zinc-500">{isOpen ? '▼' : '▶'}</span>
              </button>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-zinc-300 mb-2">{core.role}</p>
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-black/40 border border-white/10 mb-3">
                    <code className="text-[10px] text-amber-300 truncate flex-1 font-mono">{core.install}</code>
                    <CopyButton text={core.install} label="COPY" />
                  </div>

                  <Lbl text={`Top-5 Synergies for ${core.name}`} color="#4DFFFF" />
                  <div className="space-y-1.5">
                    {core.top_5_synergies.map((s: any, j: number) => {
                      const sc = s.score >= 9 ? '#22c55e' : s.score >= 7 ? '#FFB000' : '#FF6B00';
                      return (
                        <div key={j} className="p-2 rounded border border-white/10 bg-black/20">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-xs text-pink-400">+ {s.with}</span>
                            <span className="font-mono text-sm font-bold" style={{ color: sc }}>{s.score}/10</span>
                          </div>
                          <p className="text-[11px] text-zinc-300 mb-1"><span className="text-zinc-600">WHY:</span> {s.why}</p>
                          <p className="text-[11px] text-orange-300"><span className="text-zinc-600">RISK:</span> {s.risk}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </WikiCard>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN SECTION ───────────────────────────────────────────────────────────
export function FieldGuideSection() {
  const [tab, setTab] = useState<'search' | 'combos' | 'cores' | 'compare'>('search');

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🧭" label="FIELD GUIDE" color="#4DFFFF"
        title="Skill-Stack Field Guide"
        desc="Adapted from marktantongco/skill-stack-field-guide (MIT). 30 motion-stack combinations across 3 directions (Silk & GPU / Zero-Bundle / Spatial), live 21st.dev component registry search (server-side proxied — key never reaches browser), and top-5 synergies per foundational core."
        count={data.MOTION_STACK_COMBOS.length + data.FOUNDATIONAL_CORES.length}
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label="🔍 Live 21st.dev" active={tab === 'search'} color="#4DFFFF" onClick={() => setTab('search')} />
        <Pill label={`30 Motion-Stacks`} active={tab === 'combos'} color="#4DFFFF" onClick={() => setTab('combos')} />
        <Pill label="Foundational Cores" active={tab === 'cores'} color="#4DFFFF" onClick={() => setTab('cores')} />
        <Pill label="A/B vs promptc-os" active={tab === 'compare'} color="#4DFFFF" onClick={() => setTab('compare')} />
      </div>

      {tab === 'search' && <TwentyFirstSearch />}
      {tab === 'combos' && <MotionStackCombos />}
      {tab === 'cores' && <FoundationalCores />}
      {tab === 'compare' && <ABComparison />}

      <div className="mt-6 p-3 rounded-lg border border-white/10 bg-black/20 text-xs text-zinc-500">
        <span className="text-zinc-400">Source:</span>{" "}
        <a href="https://github.com/marktantongco/skill-stack-field-guide" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
          github.com/marktantongco/skill-stack-field-guide ↗
        </a>{" · "}
        <a href="https://skill-stack-field-guide.vercel.app" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
          skill-stack-field-guide.vercel.app ↗
        </a>{" · "}
        <span className="text-zinc-400">License: MIT</span>
      </div>
    </div>
  );
}

function ABComparison() {
  const rows = [
    { dim: "Scope", a: "10 sections, ~250 items (prompts, animals, monetization, skills, ecosystem)", b: "5 sections (30 motion-stacks, 20-row matrix, live 21st search, registry, top-5 cores)", winner: "Tie", why: "Different scopes: breadth vs depth" },
    { dim: "Motion-stack depth", a: "20 design combos + 4 live R3F/GSAP demos", b: "30 motion-stacks with logic/constraint/mitigation/mobile/score across 3 directions", winner: "Field Guide", why: "Structured, mobile-rated, deeper" },
    { dim: "21st.dev integration", a: "Documented install commands only", b: "Live server-side proxied search — key never reaches browser", winner: "Field Guide", why: "Production-grade, key-safe" },
    { dim: "Foundational cores", a: "Flat skill list of 44", b: "3 cores + top-5 synergies per core", winner: "Field Guide", why: "Hierarchical mental model" },
    { dim: "Skill name correctness", a: "21st-dev-components (WRONG)", b: "21st-registry (CORRECT — verified)", winner: "Field Guide", why: "I had a bug; theirs is right" },
    { dim: "Env var name", a: "TWENTYFIRST_API_KEY", b: "API_KEY_21ST (canonical)", winner: "Field Guide", why: "Vercel deploy template confirms" },
    { dim: "Prompts/animals/monetization", a: "Rich (48 source arrays + enriched)", b: "None", winner: "promptc-os", why: "Completely unique to promptc-os" },
    { dim: "Aesthetic", a: "Void-black neon (Bebas/DM Sans/DM Mono)", b: "Same DNA (Next.js 16 + Tailwind 4 + GSAP)", winner: "Tie", why: "Same author" },
  ];

  return (
    <div>
      <Lbl text="A/B Comparison: promptc-os wiki vs skill-stack-field-guide" color="#4DFFFF" />
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-black/40">
            <tr>
              <th className="text-left p-2 border-b border-white/10 mono-label text-zinc-400">Dimension</th>
              <th className="text-left p-2 border-b border-white/10 mono-label text-cyan-400">promptc-os (A)</th>
              <th className="text-left p-2 border-b border-white/10 mono-label text-pink-400">Field Guide (B)</th>
              <th className="text-left p-2 border-b border-white/10 mono-label text-amber-400">Winner</th>
              <th className="text-left p-2 border-b border-white/10 mono-label text-zinc-500">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-2 font-semibold text-zinc-300 align-top">{r.dim}</td>
                <td className="p-2 text-zinc-400 align-top">{r.a}</td>
                <td className="p-2 text-zinc-400 align-top">{r.b}</td>
                <td className="p-2 align-top">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    r.winner === 'Field Guide' ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' :
                    r.winner === 'promptc-os' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                    'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                  }`}>{r.winner}</span>
                </td>
                <td className="p-2 text-zinc-500 align-top">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
        <Lbl text="Integration decision (80/20)" color="#22c55e" />
        <p className="text-xs text-zinc-300 mb-2">
          <strong className="text-green-400">TAKE:</strong> motion-stack depth (30 combos), live 21st.dev search (server-side proxied), foundational cores mental model, corrected skill names + env var.
        </p>
        <p className="text-xs text-zinc-300 mb-2">
          <strong className="text-orange-400">LEAVE:</strong> their 20-row synergy matrix (couldn't extract rows — client-rendered), their verified skills registry (mine has 44, theirs has 23).
        </p>
        <p className="text-xs text-zinc-400">
          <strong className="text-zinc-300">CROSS-LINK:</strong> both projects stay separate; promptc-os links out to skill-stack-field-guide.vercel.app for the full motion-stack experience.
        </p>
      </div>
    </div>
  );
}
