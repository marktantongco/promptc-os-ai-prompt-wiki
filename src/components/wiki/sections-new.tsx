'use client';

import { useMemo, useState } from "react";
import { data } from "@/lib/wiki-data";
import { CopyButton, CodeBlock } from "./copy-button";
import { SectionHeader, WikiCard, Pill, Lbl, Disclosure, Badge } from "./primitives";
import { ComboDemo } from "./combo-demos";
import { PinButton, usePins } from "./pin-list";
import Image from "next/image";

// ── DESIGN COMBOS WITH SYNERGY RATINGS ─────────────────────────────────────
export function CombosSection() {
  const [sort, setSort] = useState<'score' | 'default'>('default');
  const { pins, togglePin } = usePins();
  const combos = data.COMBO_RATINGS.length ? data.COMBO_RATINGS : data.COMBOS;
  const sorted = useMemo(() => {
    if (sort === 'score') return [...combos].sort((a, b) => (b.score || 0) - (a.score || 0));
    return combos;
  }, [sort, combos]);

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🎨" label="DESIGN COMBOS" color="#38bdf8"
        title="Design Combos · Synergy Ratings"
        desc="20 design combos, each rated 1-10 for structural synergy. The synergy score is the degree to which the constituent elements solve complementary (vs competing) problems. Sorted by score to surface the highest-leverage pairings."
        count={combos.length}
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label="Default order" active={sort === 'default'} color="#38bdf8" onClick={() => setSort('default')} />
        <Pill label="Sort by synergy ↓" active={sort === 'score'} color="#38bdf8" onClick={() => setSort('score')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((c: any, i: number) => {
          const score = c.score || 0;
          const conf = c.confidence || 8;
          const scoreColor = score >= 9 ? '#22c55e' : score >= 7 ? '#FFB000' : score >= 5 ? '#FF6B00' : '#ef4444';
          const hasDemo = c.has_live_demo;
          const hasImage = !!c.preview_image;
          return (
            <WikiCard key={i} accent={scoreColor}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-semibold text-sm">{c.combo}</div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="score">{score}/10</Badge>
                  {hasDemo && <Badge variant="live">LIVE</Badge>}
                  {hasImage && !hasDemo && <Badge variant="cat">PREVIEW</Badge>}
                  <PinButton
                    item={{
                      id: `combos:${c.combo}`,
                      section: 'combos',
                      sectionLabel: 'Design Combos',
                      sectionColor: '#38bdf8',
                      label: c.combo,
                      content: `${c.els} — ${c.best}. ${c.psych}. Score: ${score}/10. ${c.structural || ''}`,
                      desc: c.best,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>

              {/* Live demo OR preview image OR nothing */}
              {hasDemo && (
                <div className="mb-3 -mx-1">
                  <ComboDemo combo={c.combo} />
                </div>
              )}
              {!hasDemo && hasImage && (
                <div className="mb-3 relative h-40 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={c.preview_image}
                    alt={`${c.combo} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 mono-label text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded">PREVIEW</div>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-2">
                {(c.els || '').split(',').map((el: string, j: number) => (
                  <span key={j} className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-black/30 text-zinc-400 font-mono">{el.trim()}</span>
                ))}
              </div>

              <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-400">Best for:</span> {c.best}</p>
              <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-400">Psych:</span> {c.psych}</p>

              {c.structural && (
                <div className="mb-2">
                  <div className="mono-label text-sky-400 mb-1">STRUCTURAL REASONING</div>
                  <p className="text-xs text-zinc-300">{c.structural}</p>
                </div>
              )}

              {c.tradeoff && (
                <div className="mb-2">
                  <div className="mono-label text-orange-400 mb-1">TRADEOFF / FAILURE MODE</div>
                  <p className="text-xs text-zinc-400">{c.tradeoff}</p>
                </div>
              )}

              {c.contrarian && (
                <div className="mb-2">
                  <div className="mono-label text-pink-400 mb-1">CONTRARIAN VIEW</div>
                  <p className="text-xs text-zinc-400 italic">{c.contrarian}</p>
                </div>
              )}

              {c.stack && (
                <div className="mb-2">
                  <div className="mono-label text-zinc-400 mb-1">STACK</div>
                  <div className="flex flex-wrap gap-1">
                    {c.stack.map((s: string, j: number) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10">
                <span className="mono-label text-zinc-400">CONFIDENCE</span>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, k) => (
                    <span key={k} className="w-1.5 h-3 rounded-sm" style={{
                      background: k < conf ? scoreColor : 'rgba(255,255,255,0.08)',
                    }} />
                  ))}
                  <span className="ml-1.5 text-[10px] font-mono" style={{ color: scoreColor }}>{conf}/10</span>
                </div>
              </div>
            </WikiCard>
          );
        })}
      </div>
    </div>
  );
}

// ── SKILLS BUILDER ─────────────────────────────────────────────────────────
export function SkillsSection() {
  const [tab, setTab] = useState<'stacks' | 'directory' | 'health' | 'leaderboard'>('stacks');
  const { pins, togglePin } = usePins();

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🧱" label="SKILLS BUILDER" color="#FFD700"
        title="Skills Builder"
        desc="Curated 3-5 skill stacks for shipping real products. Each stack is pre-vetted for compatibility, with install commands, use cases, and health compounding notes. Plus a directory of 23 individual skills and a skills-health rubric."
        count={data.SKILL_STACKS.length + data.SKILLS_DIRECTORY.length}
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label={`Stacks (${data.SKILL_STACKS.length})`} active={tab === 'stacks'} color="#FFD700" onClick={() => setTab('stacks')} />
        <Pill label={`Directory (${data.SKILLS_DIRECTORY.length})`} active={tab === 'directory'} color="#FFD700" onClick={() => setTab('directory')} />
        <Pill label="Health Rubric" active={tab === 'health'} color="#FFD700" onClick={() => setTab('health')} />
        <Pill label="🏆 Leaderboard" active={tab === 'leaderboard'} color="#FFD700" onClick={() => setTab('leaderboard')} />
      </div>

      {tab === 'stacks' && (
        <div className="space-y-3">
          {data.SKILL_STACKS.map((s: any) => (
            <WikiCard key={s.id} accent="#FFD700">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-semibold text-base">{s.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{s.thesis}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="mono-label text-gold-400" style={{ color: '#FFD700' }}>{s.stack.length} SKILLS</span>
                  <PinButton
                    item={{
                      id: `skills:stacks:${s.id}`,
                      section: 'skills',
                      sectionLabel: 'Skills',
                      sectionColor: '#FFD700',
                      label: s.name,
                      content: s.thesis,
                      desc: s.use,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {s.stack.map((skill: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs p-2 rounded border border-white/10 bg-black/30">
                    <span className="font-mono text-gold-400" style={{ color: '#FFD700' }}>{i+1}.</span>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-200">{skill.skill}</div>
                      <div className="text-zinc-400 mt-0.5">{skill.role}</div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1">{skill.source}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-2 mb-3">
                <div className="text-xs p-2 rounded bg-black/30 border border-white/10">
                  <div className="mono-label text-zinc-400 mb-1">WHY</div>
                  <p className="text-zinc-300">{s.why}</p>
                </div>
                <div className="text-xs p-2 rounded bg-black/30 border border-white/10">
                  <div className="mono-label text-zinc-400 mb-1">USE FOR</div>
                  <p className="text-zinc-300">{s.use}</p>
                </div>
                <div className="text-xs p-2 rounded bg-black/30 border border-white/10">
                  <div className="mono-label text-zinc-400 mb-1">HEALTH</div>
                  <p className="text-zinc-300">{s.health}</p>
                </div>
              </div>

              {s.env && s.env.length > 0 && (
                <div className="mb-2">
                  <Lbl text="Env vars (write to .env.local, never commit)" color="#FFD700" />
                  <div className="space-y-1">
                    {s.env.map((e: string, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-xs p-2 rounded bg-black/40 border border-white/10 font-mono">
                        <span className="text-amber-300 truncate">{e}</span>
                        <CopyButton text={e} label="COPY" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Lbl text="Install order" color="#FFD700" />
                <CodeBlock text={(s.install_order || []).map((n: string, i: number) => `${i+1}. ${n}`).join('\n')} maxHeight="160px" />
              </div>
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'directory' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.SKILLS_DIRECTORY.map((s: any) => (
            <WikiCard key={s.id} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">{s.category}</div>
                </div>
                <div className="flex items-center gap-1">
                  {s.canonical && <Badge variant="live">CANONICAL</Badge>}
                  <PinButton
                    item={{
                      id: `skills:directory:${s.id}`,
                      section: 'skills',
                      sectionLabel: 'Skills',
                      sectionColor: '#FFD700',
                      label: s.name,
                      content: s.install,
                      desc: s.notes,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-2">{s.notes}</p>
              {s.use_for && <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-400">USE FOR:</span> {s.use_for}</p>}
              <div className="flex items-center justify-between gap-2 p-2 rounded bg-black/40 border border-white/10">
                <code className="text-[10px] text-amber-300 truncate flex-1 font-mono">{s.install}</code>
                <CopyButton text={s.install} label="COPY" />
              </div>
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'health' && (
        <div className="space-y-4">
          <WikiCard accent="#FFD700">
            <Lbl text="Skills Health Formula" color="#FFD700" />
            <CodeBlock text="HEALTH = compatibility × maintenance × bundle_discipline\n\nA healthy stack gets FASTER to build with over time.\nAn unhealthy stack gets slower — each new feature fights the others." />
          </WikiCard>

          <div className="grid sm:grid-cols-3 gap-3">
            <WikiCard accent="#22c55e">
              <Lbl text="Compatibility" color="#22c55e" />
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>+1 both TS-native</li>
                <li>+1 no overlapping responsibilities</li>
                <li>-1 competing patterns (e.g. two state libs)</li>
                <li>-2 version conflicts (React 18 vs 19)</li>
              </ul>
            </WikiCard>
            <WikiCard accent="#FFB000">
              <Lbl text="Maintenance" color="#FFB000" />
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>+1 backed by a company</li>
                <li>+1 &gt; 1k GitHub stars</li>
                <li>-1 solo maintainer</li>
                <li>-2 last commit &gt; 6 months ago</li>
              </ul>
            </WikiCard>
            <WikiCard accent="#FF6B00">
              <Lbl text="Bundle Discipline" color="#FF6B00" />
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>+1 tree-shakeable</li>
                <li>-1 ships global CSS</li>
                <li>-2 &gt; 100kb gzipped</li>
              </ul>
            </WikiCard>
          </div>

          <WikiCard accent="#ef4444">
            <Lbl text="Common Failure Modes" color="#ef4444" />
            <ul className="text-xs text-zinc-300 space-y-1 list-disc ml-4">
              <li>Adding skills without health check → tech debt compounds invisibly</li>
              <li>Lock-in to a single skill author → bus-factor risk</li>
              <li>No bundle budget → LCP &gt; 2.5s, users bounce</li>
              <li>Skipping env-var rotation → key leak in git history</li>
              <li>Mixing two animation libraries (GSAP + Framer useScroll) → conflict, bloat</li>
            </ul>
          </WikiCard>
        </div>
      )}

      {tab === 'leaderboard' && <SkillsLeaderboard />}
    </div>
  );
}

// ── SKILLS LEADERBOARD (from skills.sh/trending) ───────────────────────────
function SkillsLeaderboard() {
  const sections = data.SKILLS_LEADERBOARD;
  const { pins, togglePin } = usePins();

  return (
    <div className="space-y-6">
      {sections.map((section: any, i: number) => (
        <div key={section.id}>
          <Lbl text={section.title} color="#FFD700" />
          <p className="text-xs text-zinc-300 mb-3 max-w-3xl">{section.description}</p>

          {section.skills && (
            <div className="space-y-1.5">
              {section.skills.map((s: any, j: number) => (
                <div key={j} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-[#14161A] hover:bg-[#1a1d22] transition-colors">
                  <Badge variant="rank">#{s.rank}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-amber-300 truncate">{s.name}</span>
                      <Badge variant="cat">{s.category}</Badge>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{s.source}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-sm text-green-400">{s.installs}</span>
                    <div className="hidden sm:block max-w-[200px]">
                      <p className="text-[10px] text-zinc-400 truncate">{s.use}</p>
                    </div>
                    <PinButton
                      item={{
                        id: `skills:leaderboard:${s.name}`,
                        section: 'skills',
                        sectionLabel: 'Skills',
                        sectionColor: '#FFD700',
                        label: `${s.name} (${s.installs})`,
                        content: `${s.source} — ${s.use}`,
                        desc: s.use,
                      }}
                      pins={pins}
                      togglePin={togglePin}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.combos && (
            <div className="grid gap-3 sm:grid-cols-2">
              {section.combos.map((c: any, j: number) => {
                const sc = c.score >= 9 ? '#22c55e' : c.score >= 7 ? '#FFB000' : '#FF6B00';
                return (
                  <WikiCard key={j} accent={sc}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-semibold text-sm">{c.name}</div>
                      <Badge variant="score">{c.score}/10</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {c.skills.map((sk: string, k: number) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">{sk}</span>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 mb-2">{c.rationale}</p>
                    <p className="text-[10px] text-zinc-400"><span className="text-zinc-500">USE:</span> {c.use_case}</p>
                  </WikiCard>
                );
              })}
            </div>
          )}

          {section.stacks && (
            <div className="space-y-3">
              {section.stacks.map((s: any, j: number) => {
                const sc = s.recommendation_score >= 9 ? '#22c55e' : s.recommendation_score >= 7 ? '#FFB000' : '#FF6B00';
                return (
                  <WikiCard key={j} accent={sc}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-semibold text-sm">{s.name}</div>
                      <Badge variant="score">{s.recommendation_score}/10</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {s.stack.map((sk: string, k: number) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">{sk}</span>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 mb-1">{s.why}</p>
                    <p className="text-[10px] text-amber-400"><span className="text-zinc-500">BEST FOR:</span> {s.best_for}</p>
                  </WikiCard>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="p-3 rounded-lg border border-white/10 bg-black/20 text-xs text-zinc-400">
        <span className="text-zinc-300">Source:</span>{" "}
        <a href="https://skills.sh/trending" target="_blank" rel="noopener" className="text-amber-400 hover:underline">
          skills.sh/trending ↗
        </a>{" · "}
        <span>Live data fetched {new Date().toISOString().slice(0,10)}</span>
      </div>
    </div>
  );
}
export function MonetizeSection() {
  const [tab, setTab] = useState<'top' | 'saas' | 'recipes' | 'frameworks' | 'automation'>('top');
  const { pins, togglePin } = usePins();
  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="💸" label="MONETIZE" color="#FFD700"
        title="Monetize"
        desc="Top 15 monetization prompts, 10 SaaS templates with deploy stacks, 7 frameworks, 8 done-in-a-weekend recipes, 6 automation workflows. Each item is copy-ready."
        count={data.TOP10_PROMPTS.length + data.SAAS_TEMPLATES.length + data.MONETIZE_RECIPES.length}
      />
      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label={`Top Prompts (${data.TOP10_PROMPTS.length})`} active={tab === 'top'} color="#FFD700" onClick={() => setTab('top')} />
        <Pill label={`SaaS Templates (${data.SAAS_TEMPLATES.length})`} active={tab === 'saas'} color="#FFD700" onClick={() => setTab('saas')} />
        <Pill label={`Recipes (${data.MONETIZE_RECIPES.length})`} active={tab === 'recipes'} color="#FFD700" onClick={() => setTab('recipes')} />
        <Pill label={`Frameworks (${data.MONETIZE_FW.length})`} active={tab === 'frameworks'} color="#FFD700" onClick={() => setTab('frameworks')} />
        <Pill label={`Automation (${data.AUTOMATION_WORKFLOWS.length})`} active={tab === 'automation'} color="#FFD700" onClick={() => setTab('automation')} />
      </div>

      {tab === 'top' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.TOP10_PROMPTS.map((p: any, i: number) => (
            <WikiCard key={i} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{p.title || p.name || p.label}</div>
                  {p.why && <div className="text-xs text-zinc-400 mt-0.5">{p.why}</div>}
                </div>
                <div className="flex items-center gap-1.5">
                  {p.cat && <Badge variant="hot">{p.cat}</Badge>}
                  <PinButton
                    item={{
                      id: `monetize:top:${i}`,
                      section: 'monetize',
                      sectionLabel: 'Monetize',
                      sectionColor: '#FFD700',
                      label: p.title || p.name || p.label,
                      content: p.prompt || '',
                      desc: p.when,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>
              {p.prompt && <CodeBlock text={p.prompt} maxHeight="320px" />}
              {p.monetize && <p className="text-xs text-amber-400 mt-2 font-mono">⚡ {p.monetize}</p>}
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'saas' && (
        <div className="space-y-3">
          {data.SAAS_TEMPLATES.map((s: any, i: number) => (
            <WikiCard key={i} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{s.name || s.title}</div>
                  {s.niche && <div className="text-xs text-zinc-400 mt-0.5">{s.niche}</div>}
                </div>
                {s.cat && <span className="mono-label text-zinc-400">{s.cat}</span>}
              </div>
              {s.stack && <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-400">STACK:</span> <span className="font-mono text-amber-300">{s.stack}</span></p>}
              {s.why && <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-400">DIFFERENTIATOR:</span> {s.why}</p>}
              {s.prompt && <CodeBlock text={s.prompt} maxHeight="300px" />}
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'recipes' && (
        <div className="space-y-3">
          {data.MONETIZE_RECIPES.map((r: any, i: number) => (
            <WikiCard key={i} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{r.label}</div>
                  {r.stack && <div className="text-xs text-zinc-400 mt-0.5 font-mono">{r.stack}</div>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {r.cat && <span className="mono-label text-zinc-400">{r.cat}</span>}
                  {r.time && <span className="text-[10px] text-amber-400 font-mono">{r.time}</span>}
                  {r.income && <span className="text-[10px] text-green-400 font-mono">{r.income}</span>}
                </div>
              </div>
              {r.steps && Array.isArray(r.steps) && (
                <div className="mb-3">
                  <Lbl text="Steps" color="#FFD700" />
                  <ol className="text-xs text-zinc-300 list-decimal ml-4 space-y-0.5">
                    {r.steps.map((s: string, j: number) => <li key={j}>{s}</li>)}
                  </ol>
                </div>
              )}
              {r.prompt && <CodeBlock text={r.prompt} maxHeight="320px" />}
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'frameworks' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.MONETIZE_FW.map((f: any, i: number) => (
            <WikiCard key={i} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-semibold text-sm">{f.name || f.label}</div>
                {f.cat && <span className="mono-label text-zinc-400">{f.cat}</span>}
              </div>
              {f.desc && <p className="text-xs text-zinc-400 mb-2">{f.desc}</p>}
              {f.prompt && <CodeBlock text={f.prompt} maxHeight="220px" />}
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'automation' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.AUTOMATION_WORKFLOWS.map((w: any, i: number) => (
            <WikiCard key={i} accent="#FFD700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{w.label}</div>
                  {w.trigger && <div className="text-xs text-zinc-400 mt-0.5">TRIGGER: {w.trigger}</div>}
                </div>
                {w.tool && <span className="mono-label text-zinc-400">{w.tool}</span>}
              </div>
              {w.flow && <CodeBlock text={w.prompt} maxHeight="200px" />}
            </WikiCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ECOSYSTEM BLUEPRINTS ───────────────────────────────────────────────────
export function EcosystemSection() {
  const { pins, togglePin } = usePins();
  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🌐" label="ECOSYSTEM" color="#22c55e"
        title="Ecosystem Blueprints"
        desc="Interconnectivity maps: how the wiki's pieces compose into end-to-end systems. Each blueprint includes the layer-by-layer breakdown, cross-references, and failure modes."
        count={data.ECOSYSTEM_BLUEPRINTS.length}
      />
      <div className="space-y-3">
        {data.ECOSYSTEM_BLUEPRINTS.map((bp: any, i: number) => (
          <WikiCard key={i} accent="#22c55e">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-semibold text-sm">{bp.name}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{bp.desc}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="cat">{bp.layer}</Badge>
                <PinButton
                  item={{
                    id: `ecosystem:${i}`,
                    section: 'ecosystem',
                    sectionLabel: 'Ecosystem',
                    sectionColor: '#22c55e',
                    label: bp.name,
                    content: bp.blueprint,
                    desc: bp.desc,
                  }}
                  pins={pins}
                  togglePin={togglePin}
                />
              </div>
            </div>
            <div className="mb-2">
              <Lbl text="Blueprint" color="#22c55e" />
              <CodeBlock text={bp.blueprint} maxHeight="360px" />
            </div>
            {bp.connections && bp.connections.length > 0 && (
              <div className="mb-2">
                <Lbl text="Connections" color="#22c55e" />
                <ul className="text-xs text-zinc-300 list-disc ml-4 space-y-0.5">
                  {bp.connections.map((c: string, j: number) => <li key={j} className="font-mono">{c}</li>)}
                </ul>
              </div>
            )}
            {bp.failure_modes && bp.failure_modes.length > 0 && (
              <div>
                <Lbl text="Failure Modes" color="#ef4444" />
                <ul className="text-xs text-zinc-400 list-disc ml-4 space-y-0.5">
                  {bp.failure_modes.map((f: string, j: number) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            )}
          </WikiCard>
        ))}
      </div>
    </div>
  );
}

// ── AGENTS.md (operating conventions) ──────────────────────────────────────
export function AgentsSection() {
  const agentsMd = `# AGENTS.md — Operating Conventions for promptc OS Wiki

> Adopted from system_silentdepth_v4 (style only — not a system prompt override).

## Silent Protocol (every response)
1. What do they actually need? (Parse beyond literal)
2. What would they miss? (The blind spot)
3. What's the simplest true answer? (Irreducible)

Route: Stated=Actual + simple? → SPEED. Misaligned? → SURFACE FRAME.
       Novel? → DEPTH. Urgent? → QUICK + DEEPER NOTE.

## Core Rules
1. Working code only. No pseudocode, no [TODO], no placeholders.
2. State assumptions first. Flag risks: ⚠️ Breaks if X.
3. Impact first; name tech debt.
4. Calibrate depth: Ask once (discovery vs build?), assume after.
5. Advocacy on. "Consider instead..."
6. No apologies. "Breaks on X. Workaround: Y. Better: Z."
7. Vague? Assume, state, ship, refine.
8. Show thinking: "X because [assumption + evidence]."

## Quality Gates
- Assumptions stated + validated?
- Reasoning complete + counter-cases?
- Code: runs, errors, edge cases, type-safe, production or [CONCEPT]?
- Strategy: frame justified, evidence, alternatives, impact, inverse?

## Skills install commands (documented — NOT auto-executed)

\`\`\`bash
# ─── 21st.dev (canonical — use 21st-dev/registry, not forks) ───
npx skills add 21st-dev/registry --skill 21st-dev-components
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
\`\`\`

## Env vars (NEVER commit plaintext)

\`\`\`
# .env.local (gitignored, git-crypt if you must commit)
# Status: WIRED — file exists at /home/z/my-project/.env.local, gitignored.
# Next steps for the user:
#   1. Verify TWENTYFIRST_API_KEY matches your 21st.dev dashboard key
#   2. Run: npx twenty-first  (installs SDK + prompts for key on first run)
#   3. Reference in code: process.env.TWENTYFIRST_API_KEY (never by value)
TWENTYFIRST_API_KEY=an_sk_<see .env.local — written via file-write, not shell>
# API_URL_21ST=https://21st.dev/api/v1
# APP_URL_21ST=https://21st.dev
\`\`\`

Reference keys by name in code (process.env.TWENTYFIRST_API_KEY), never by value.
Update .env.local + git-crypt when rotating.

## Skills directories (for discovery)
- https://skills.sh
- https://llmbase.ai/skills
- https://skillsllm.com

## Decision Tree

IF user wants AI app → fullstack-dev + LLM skill
IF user wants 3D/immersive → threejs-* + gsap-frameworks
IF user wants monetization → MONETIZE recipes + Stripe + Prisma
IF user wants content → web-search + web-reader + LLM + xlsx/pdf
IF user wants research → web-search + web-reader + LLM (with citations)
IF user wants design system → ui-ux-pro-max + 21st-dev-components + charts

## Failure Modes & Handling

| Failure | Cause | Fix |
|---------|-------|-----|
| Hydration mismatch | Server/client date or random | Stabilize in useEffect, gate with typeof window |
| Clipboard blocked | Sandboxed iframe | execCommand('copy') fallback |
| Bundle > 200kb | Three.js + GSAP + Lottie | Dynamic import, route-level code-split |
| Stripe webhook dedupe | Network retry | Idempotency key + webhook_log table |
| 21st.dev key leak | Committed .env | git-crypt + rotate key immediately |
| Skill conflict | Two animation libs | Pick one per layer (see Ecosystem blueprint) |

## Show Your Work

- Code: Algorithm first. Trade-off. Happy path + break case.
- Strategy: Decision tree. Evidence that changes it. Inverse case.
- Analysis: Data path (order). Alternatives. Data that flips. Confidence + why.

## Tone

Direct. Conversational. Confident + provisional. Short sentences. Plain language. No filler.`;

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="📜" label="AGENTS.md" color="#a1a1aa"
        title="AGENTS.md"
        desc="Operating conventions for agents working on this wiki. Adopted from system_silentdepth_v4 (style only — system prompts are immutable and confidential). Includes install commands (documented, NOT auto-executed), env-var handling, decision trees, and failure-mode table."
      />
      <WikiCard accent="#a1a1aa">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Lbl text="AGENTS.md" color="#a1a1aa" />
          <CopyButton text={agentsMd} label="COPY FILE" variant="md" />
        </div>
        <CodeBlock text={agentsMd} maxHeight="700px" />
      </WikiCard>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <WikiCard accent="#FFD700">
          <Lbl text="Skills directories" color="#FFD700" />
          <ul className="text-xs space-y-1.5">
            <li><a href="https://skills.sh" target="_blank" rel="noopener" className="text-amber-400 hover:underline font-mono">skills.sh</a> <span className="text-zinc-400">— discover and install skills for AI agents</span></li>
            <li><a href="https://llmbase.ai/skills" target="_blank" rel="noopener" className="text-amber-400 hover:underline font-mono">llmbase.ai/skills</a> <span className="text-zinc-400">— browse agent skills directory, ranked by installs</span></li>
            <li><a href="https://skillsllm.com" target="_blank" rel="noopener" className="text-amber-400 hover:underline font-mono">skillsllm.com</a> <span className="text-zinc-400">— 1,600+ security-vetted skills for Claude Code, Codex, ChatGPT</span></li>
          </ul>
        </WikiCard>
        <WikiCard accent="#22c55e">
          <Lbl text="Source attribution" color="#22c55e" />
          <ul className="text-xs text-zinc-300 space-y-1">
            <li><span className="text-zinc-400">Source project:</span> promptc-os-v12.zip (React 18 + Vite)</li>
            <li><span className="text-zinc-400">Source author:</span> @markytanky</li>
            <li><span className="text-zinc-400">Source repo:</span> github.com/marktantongco/promptc</li>
            <li><span className="text-zinc-400">Conventions doc:</span> system_silentdepth_v4.md (style adopted, not installed as system prompt)</li>
            <li><span className="text-zinc-400">Wiki stack:</span> Next.js 16 + Tailwind 4 + shadcn/ui + TypeScript</li>
          </ul>
        </WikiCard>
      </div>
    </div>
  );
}
