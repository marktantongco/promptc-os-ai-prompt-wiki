'use client';

import { useMemo, useState } from "react";
import { data } from "@/lib/wiki-data";
import { CopyButton, CodeBlock } from "./copy-button";
import { SectionHeader, WikiCard, Pill, Lbl, Disclosure, Badge } from "./primitives";
import { PinButton, usePins } from "./pin-list";

export function ActivateSection() {
  const [tab, setTab] = useState<'master' | 'advocate' | 'mods' | 'tasks' | 'tmpls' | 'brands'>('master');
  const { pins, togglePin } = usePins();

  const tmplGroups = useMemo(() => {
    const groups: Record<string, typeof data.TMPLS> = {};
    for (const t of data.TMPLS) {
      const g = (t as any).group || 'Templates';
      (groups[g] = groups[g] || []).push(t);
    }
    return groups;
  }, []);

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="⚡" label="ACTIVATE" color="#4DFFFF"
        title="Activate"
        desc="Copy-paste to AI. Start fast. Master system prompt, advocate mode, 43 secret-sauce modifiers, 8 task-specific prompts, 21 templates across 3 groups, and 6 brand systems."
        count={data.MODS.length + data.TASKS.length + data.TMPLS.length + data.BRANDS.length + 2}
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label="Master" active={tab === 'master'} color="#4DFFFF" onClick={() => setTab('master')} />
        <Pill label="Advocate" active={tab === 'advocate'} color="#4DFFFF" onClick={() => setTab('advocate')} />
        <Pill label={`Modifiers (${data.MODS.length})`} active={tab === 'mods'} color="#4DFFFF" onClick={() => setTab('mods')} />
        <Pill label={`Tasks (${data.TASKS.length})`} active={tab === 'tasks'} color="#4DFFFF" onClick={() => setTab('tasks')} />
        <Pill label={`Templates (${data.TMPLS.length})`} active={tab === 'tmpls'} color="#4DFFFF" onClick={() => setTab('tmpls')} />
        <Pill label={`Brands (${data.BRANDS.length})`} active={tab === 'brands'} color="#4DFFFF" onClick={() => setTab('brands')} />
      </div>

      {tab === 'master' && (
        <WikiCard accent="#4DFFFF">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Lbl text="Master System Prompt" />
            <PinButton
              item={{
                id: 'activate:master',
                section: 'activate',
                sectionLabel: 'Activate',
                sectionColor: '#4DFFFF',
                label: 'Master System Prompt',
                content: data.MASTER.slice(0, 500) + '...',
                desc: 'The root system prompt',
              }}
              pins={pins}
              togglePin={togglePin}
            />
          </div>
          <p className="text-xs text-zinc-400 mb-3">The root system prompt. Drop into any AI as the first message. Activates advocacy mode, quality gates, and reasoning protocols.</p>
          <CodeBlock text={data.MASTER} maxHeight="600px" />
        </WikiCard>
      )}

      {tab === 'advocate' && (
        <WikiCard accent="#4DFFFF">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Lbl text="Advocate Mode" />
            <PinButton
              item={{
                id: 'activate:advocate',
                section: 'activate',
                sectionLabel: 'Activate',
                sectionColor: '#4DFFFF',
                label: 'Advocate Mode',
                content: data.ADVOCATE.slice(0, 500) + '...',
                desc: 'AI as your business partner',
              }}
              pins={pins}
              togglePin={togglePin}
            />
          </div>
          <p className="text-xs text-zinc-400 mb-3">Reframes the AI as your business partner, not just an assistant. Append to the master prompt for high-stakes decisions.</p>
          <CodeBlock text={data.ADVOCATE} maxHeight="500px" />
        </WikiCard>
      )}

      {tab === 'mods' && (
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {data.MODS.map((m: any, i: number) => (
            <WikiCard key={i} accent="#4DFFFF">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{m.label}</div>
                  {m.desc && <div className="text-xs text-zinc-400 mt-0.5">{m.desc}</div>}
                </div>
                <div className="flex items-center gap-1.5">
                  {m.cat && <Badge variant="cat">{m.cat}</Badge>}
                  <PinButton
                    item={{
                      id: `activate:mods:${i}`,
                      section: 'activate',
                      sectionLabel: 'Activate',
                      sectionColor: '#4DFFFF',
                      label: m.label,
                      content: m.content,
                      desc: m.desc,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>
              <CodeBlock text={m.content} maxHeight="280px" />
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {data.TASKS.map((t: any, i: number) => (
            <WikiCard key={i} accent="#4DFFFF">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{t.label}</div>
                  {t.desc && <div className="text-xs text-zinc-400 mt-0.5">{t.desc}</div>}
                </div>
                <div className="flex items-center gap-1.5">
                  {t.cat && <Badge variant="cat">{t.cat}</Badge>}
                  <PinButton
                    item={{
                      id: `activate:tasks:${i}`,
                      section: 'activate',
                      sectionLabel: 'Activate',
                      sectionColor: '#4DFFFF',
                      label: t.label,
                      content: t.content,
                      desc: t.desc,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>
              <CodeBlock text={t.content} maxHeight="320px" />
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'tmpls' && (
        <div className="space-y-5">
          {Object.entries(tmplGroups).map(([group, items]) => (
            <div key={group}>
              <Lbl text={group} color="#4DFFFF" />
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {items.map((t: any, i: number) => (
                  <WikiCard key={i} accent="#4DFFFF">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-semibold text-sm">{t.label}</div>
                      <div className="flex items-center gap-1.5">
                        {t.cat && <Badge variant="cat">{t.cat}</Badge>}
                        <PinButton
                          item={{
                            id: `activate:tmpls:${t.label}`,
                            section: 'activate',
                            sectionLabel: 'Activate',
                            sectionColor: '#4DFFFF',
                            label: t.label,
                            content: t.content,
                            desc: t.desc,
                          }}
                          pins={pins}
                          togglePin={togglePin}
                        />
                      </div>
                    </div>
                    {t.desc && <p className="text-xs text-zinc-400 mb-2">{t.desc}</p>}
                    <CodeBlock text={t.content} maxHeight="320px" />
                  </WikiCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'brands' && (
        <div className="space-y-3">
          {data.BRANDS.map((b: any, i: number) => (
            <WikiCard key={i} accent="#4DFFFF">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{b.name || b.id}</div>
                  {b.desc && <div className="text-xs text-zinc-400 mt-0.5">{b.desc}</div>}
                </div>
                <PinButton
                  item={{
                    id: `activate:brands:${b.id || b.name}`,
                    section: 'activate',
                    sectionLabel: 'Activate',
                    sectionColor: '#4DFFFF',
                    label: b.name || b.id,
                    content: b.prompt,
                    desc: b.desc,
                  }}
                  pins={pins}
                  togglePin={togglePin}
                />
              </div>
              <CodeBlock text={b.prompt} maxHeight="400px" />
            </WikiCard>
          ))}
        </div>
      )}
    </div>
  );
}

export function BuildSection() {
  const [tab, setTab] = useState<'animals' | 'chains' | 'layers' | 'enh' | 'webapp' | 'json' | 'typo' | 'vocab'>('animals');
  const { pins, togglePin } = usePins();

  const vocabCats = useMemo(() => {
    const cats: Record<string, any[]> = {};
    for (const v of data.VOCAB) {
      const c = (v as any).cat || 'General';
      (cats[c] = cats[c] || []).push(v);
    }
    return cats;
  }, []);

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🏗" label="BUILD" color="#FF6B00"
        title="Build"
        desc="Reference library and frameworks. 7 animal modes + 15 chains, 8-layer composer, 7 enhancements, web-app generator, JSON matrix, 4 typography pairings, 52 design vocabulary terms."
        count={data.ANIMALS.length + data.CHAINS.length + data.VOCAB.length + data.TYPO.length + data.ENH.length + data.LAYERS.length}
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        <Pill label={`Animals (${data.ANIMALS.length})`} active={tab === 'animals'} color="#FF6B00" onClick={() => setTab('animals')} />
        <Pill label={`Chains (${data.CHAINS.length})`} active={tab === 'chains'} color="#FF6B00" onClick={() => setTab('chains')} />
        <Pill label="8-Layer" active={tab === 'layers'} color="#FF6B00" onClick={() => setTab('layers')} />
        <Pill label={`Enhance (${data.ENH.length})`} active={tab === 'enh'} color="#FF6B00" onClick={() => setTab('enh')} />
        <Pill label="Web App Gen" active={tab === 'webapp'} color="#FF6B00" onClick={() => setTab('webapp')} />
        <Pill label="JSON Matrix" active={tab === 'json'} color="#FF6B00" onClick={() => setTab('json')} />
        <Pill label="Typography" active={tab === 'typo'} color="#FF6B00" onClick={() => setTab('typo')} />
        <Pill label={`Vocab (${data.VOCAB.length})`} active={tab === 'vocab'} color="#FF6B00" onClick={() => setTab('vocab')} />
      </div>

      {tab === 'animals' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.ANIMALS.map((a: any) => (
            <WikiCard key={a.name} accent="#FF6B00">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-xs text-zinc-400">{a.mode}</div>
                  </div>
                </div>
                <PinButton
                  item={{
                    id: `build:animals:${a.name}`,
                    section: 'build',
                    sectionLabel: 'Build',
                    sectionColor: '#FF6B00',
                    label: `${a.emoji} ${a.name} — ${a.mode}`,
                    content: a.prompt,
                    desc: a.mode,
                  }}
                  pins={pins}
                  togglePin={togglePin}
                />
              </div>
              <CodeBlock text={a.prompt} maxHeight="180px" />
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'chains' && (
        <div className="grid gap-3">
          {data.CHAINS.map((c: any, i: number) => (
            <WikiCard key={i} accent="#FF6B00">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="flex items-center gap-1.5">
                  <PinButton
                    item={{
                      id: `build:chains:${i}`,
                      section: 'build',
                      sectionLabel: 'Build',
                      sectionColor: '#FF6B00',
                      label: c.name,
                      content: c.combined || c.chain || '',
                      desc: c.desc,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                  <CopyButton text={c.combined || c.chain || ''} label="COPY CHAIN" />
                </div>
              </div>
              {c.desc && <p className="text-xs text-zinc-400 mb-2">{c.desc}</p>}
              {(c.combined || c.chain) && <CodeBlock text={c.combined || c.chain} maxHeight="240px" />}
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'layers' && (
        <WikiCard accent="#FF6B00">
          <Lbl text="8-Layer Prompt Template" color="#FF6B00" />
          <p className="text-xs text-zinc-400 mb-3">Fill any layer → the assembled prompt builds live in the Builder tab.</p>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            {data.LAYERS.map((l: any, i: number) => (
              <div key={i} className="text-xs p-2 rounded border border-white/10 bg-black/30">
                <span className="mono-label text-orange-400">{i+1}. {l.label || l.name || l}</span>
                {l.desc && <div className="text-zinc-400 mt-1">{l.desc}</div>}
              </div>
            ))}
          </div>
          <Lbl text="Layer Template" color="#FF6B00" />
          <CodeBlock text={data.LAYER_TPL} maxHeight="400px" />
        </WikiCard>
      )}

      {tab === 'enh' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.ENH.map((e: any, i: number) => (
            <WikiCard key={i} accent="#FF6B00">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{e.name}</div>
                  {e.when && <div className="text-xs text-zinc-400 mt-0.5">{e.when}</div>}
                </div>
                <div className="flex items-center gap-1.5">
                  {e.cat && <Badge variant="cat">{e.cat}</Badge>}
                  <PinButton
                    item={{
                      id: `build:enh:${i}`,
                      section: 'build',
                      sectionLabel: 'Build',
                      sectionColor: '#FF6B00',
                      label: e.name,
                      content: e.snippet,
                      desc: e.when,
                    }}
                    pins={pins}
                    togglePin={togglePin}
                  />
                </div>
              </div>
              <CodeBlock text={e.snippet} maxHeight="220px" />
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'webapp' && (
        <WebAppGen />
      )}

      {tab === 'json' && (
        <div className="space-y-4">
          <WikiCard accent="#FF6B00">
            <Lbl text="JSON Global Rule" color="#FF6B00" />
            <CodeBlock text={data.JSON_GLOBAL} maxHeight="200px" />
          </WikiCard>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.JSON_T.map((t: any, i: number) => (
              <WikiCard key={i} accent="#FF6B00">
                <div className="font-semibold text-sm mb-2">{t.name || t.label || t.id}</div>
                {t.desc && <p className="text-xs text-zinc-400 mb-2">{t.desc}</p>}
                {t.prompt && <CodeBlock text={t.prompt} maxHeight="200px" />}
              </WikiCard>
            ))}
          </div>
          <Lbl text="Decision Matrix" color="#FF6B00" />
          <div className="grid gap-2">
            {data.JSON_MX.map((m: any, i: number) => (
              <WikiCard key={i} accent="#FF6B00" pad="p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm">{m.name || m.label || m.id}</div>
                  <CopyButton text={m.prompt || m.combined || ''} />
                </div>
                {m.use && <p className="text-xs text-zinc-400 mb-2">{m.use}</p>}
                {(m.prompt || m.combined) && <CodeBlock text={m.prompt || m.combined} maxHeight="180px" />}
              </WikiCard>
            ))}
          </div>
        </div>
      )}

      {tab === 'typo' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.TYPO.map((t: any, i: number) => (
            <WikiCard key={i} accent="#FF6B00">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-semibold text-sm">{t.d}</div>
                <PinButton
                  item={{
                    id: `build:typo:${t.d}`,
                    section: 'build',
                    sectionLabel: 'Build',
                    sectionColor: '#FF6B00',
                    label: `${t.d} / ${t.m}`,
                    content: `Display: ${t.d} | Mono: ${t.m} | Use: ${t.b}`,
                    desc: t.b,
                  }}
                  pins={pins}
                  togglePin={togglePin}
                />
              </div>
              <div className="text-xs text-zinc-400 mb-2">Mono: {t.m}</div>
              <p className="text-xs text-zinc-400 mb-3">{t.b}</p>
              <div className="flex items-baseline gap-3 p-3 rounded border border-white/10 bg-black/30">
                <span style={{ fontFamily: 'var(--font-display)' }} className="text-3xl">{t.d}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }} className="text-sm text-zinc-400">1234567890</span>
              </div>
              <div className="mt-2">
                <CopyButton text={`${t.d} / ${t.m} — ${t.b}`} label="COPY PAIRING" />
              </div>
            </WikiCard>
          ))}
        </div>
      )}

      {tab === 'vocab' && (
        <div className="space-y-5">
          {Object.entries(vocabCats).map(([cat, items]) => (
            <div key={cat}>
              <Lbl text={cat} color="#FF6B00" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((v: any, i: number) => (
                  <WikiCard key={i} accent="#FF6B00" pad="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm">{v.term}</div>
                      <PinButton
                        item={{
                          id: `build:vocab:${v.term}`,
                          section: 'build',
                          sectionLabel: 'Build',
                          sectionColor: '#FF6B00',
                          label: v.term,
                          content: v.copy || v.def || '',
                          desc: v.def,
                        }}
                        pins={pins}
                        togglePin={togglePin}
                      />
                    </div>
                    {v.def && <p className="text-xs text-zinc-400 mb-2">{v.def}</p>}
                    {v.copy && (
                      <div className="mt-2">
                        <div className="mono-label text-zinc-400 mb-1">USE</div>
                        <div className="flex items-center justify-between gap-2 text-xs p-2 rounded bg-black/40 border border-white/10">
                          <span className="font-mono text-orange-300 truncate">{v.copy}</span>
                          <CopyButton text={v.copy} />
                        </div>
                      </div>
                    )}
                  </WikiCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WebAppGen() {
  const [audience, setAudience] = useState('');
  const [framework, setFramework] = useState('Next.js');
  const [aesthetic, setAesthetic] = useState('');

  const prompt = `Build a ${aesthetic || '[specific aesthetic]'} web app for ${audience || '[target audience]'}.

FRAMEWORK: ${framework}
AESTHETIC: ${aesthetic || '[specific aesthetic keyword]'}
AUDIENCE: ${audience || '[target audience]'}

REQUIREMENTS:
- Mobile-first responsive layout (375px minimum)
- WCAG AA accessibility (4.5:1 text contrast)
- 60fps animation budget
- LCP < 2.5s, CLS < 0.1
- Initial JS bundle < 200kb

OUTPUT:
1. Component tree (named, with prop types)
2. Data flow (state + props)
3. Animation plan (which elements animate, with what library)
4. Deploy target + env vars checklist`;

  return (
    <WikiCard accent="#FF6B00">
      <Lbl text="Web App Generator" color="#FF6B00" />
      <p className="text-xs text-zinc-400 mb-3">Live prompt updates as you select. Copy when ready.</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <div>
          <div className="mono-label text-zinc-400 mb-1">Audience</div>
          <input
            value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. indie hackers"
            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <div className="mono-label text-zinc-400 mb-1">Framework</div>
          <select
            value={framework} onChange={e => setFramework(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-orange-400"
          >
            {data.STACK_FRAMEWORKS.map((f: string) => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
          </select>
        </div>
        <div>
          <div className="mono-label text-zinc-400 mb-1">Aesthetic</div>
          <select
            value={aesthetic} onChange={e => setAesthetic(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-orange-400"
          >
            <option value="" className="bg-zinc-900">— pick —</option>
            {data.AESTHETIC_KEYWORDS.map((k: string) => <option key={k} value={k} className="bg-zinc-900">{k}</option>)}
          </select>
        </div>
      </div>
      <CodeBlock text={prompt} maxHeight="400px" />
    </WikiCard>
  );
}

export function ValidateSection() {
  const [swapLevel, setSwapLevel] = useState<'all' | 'beginner' | 'misconception' | 'advanced'>('all');
  const [keywordPicker, setKeywordPicker] = useState<string | null>(null);
  const { pins, togglePin } = usePins();

  const swaps = useMemo(() => {
    if (swapLevel === 'all') return data.SWAPS;
    return data.SWAPS.filter((s: any) => (s.level || '').toLowerCase().includes(swapLevel));
  }, [swapLevel]);

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="✅" label="VALIDATE" color="#22c55e"
        title="Validate"
        desc="Score, lint, refine. 32 lint rules, 58 word swaps with level filter, interactive aesthetic keyword picker, quality checklist, prompt scoring scale."
        count={data.SWAPS.length + data.LINT.length + data.CHECKS.length}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <Lbl text="Word Swaps" color="#22c55e" />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(['all', 'beginner', 'misconception', 'advanced'] as const).map(l => (
              <Pill key={l} label={l.toUpperCase()} active={swapLevel === l} color="#22c55e" onClick={() => setSwapLevel(l)} count={l === 'all' ? data.SWAPS.length : data.SWAPS.filter((s:any)=>(s.level||'').toLowerCase().includes(l)).length} />
            ))}
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {swaps.map((s: any, i: number) => {
              const isKeywordRow = (s.bad || '').includes('[specific aesthetic keyword]');
              return (
                <WikiCard key={i} accent="#22c55e" pad="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-red-400 line-through">{s.bad}</span>
                        <span className="text-zinc-400">→</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-green-400 font-mono">{s.good}</span>
                        <div className="flex items-center gap-1">
                          <PinButton
                            item={{
                              id: `validate:swaps:${i}`,
                              section: 'validate',
                              sectionLabel: 'Validate',
                              sectionColor: '#22c55e',
                              label: `Swap: ${s.bad} → ${s.good}`,
                              content: s.good,
                              desc: s.tip,
                            }}
                            pins={pins}
                            togglePin={togglePin}
                          />
                          <CopyButton text={s.good} />
                        </div>
                      </div>
                      {s.tip && <p className="text-xs text-zinc-400 mt-1">{s.tip}</p>}
                      {s.level && <span className="mono-label text-zinc-400 mt-1 inline-block">{s.level}</span>}
                      {isKeywordRow && (
                        <div className="mt-2">
                          <button
                            onClick={() => setKeywordPicker(keywordPicker === String(i) ? null : String(i))}
                            className="text-xs px-2 py-1 rounded border border-green-500/40 text-green-400 hover:bg-green-500/10"
                          >
                            {keywordPicker === String(i) ? 'HIDE' : 'PICK'} KEYWORD
                          </button>
                          {keywordPicker === String(i) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {data.AESTHETIC_KEYWORDS.map((k: string) => (
                                <button
                                  key={k}
                                  onClick={() => navigator.clipboard?.writeText(k)}
                                  className="text-[10px] px-2 py-1 rounded border border-white/15 text-zinc-300 hover:border-green-500/50 hover:text-green-400 font-mono"
                                >
                                  {k}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </WikiCard>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Lbl text="Lint Rules" color="#22c55e" />
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {data.LINT.map((l: any, i: number) => (
                <WikiCard key={i} accent="#22c55e" pad="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-sm">{l.rule}</div>
                    <div className="flex items-center gap-1.5">
                      {l.cat && <Badge variant="cat">{l.cat}</Badge>}
                      <PinButton
                        item={{
                          id: `validate:lint:${i}`,
                          section: 'validate',
                          sectionLabel: 'Validate',
                          sectionColor: '#22c55e',
                          label: l.rule,
                          content: l.fix || l.why || '',
                          desc: l.why,
                        }}
                        pins={pins}
                        togglePin={togglePin}
                      />
                    </div>
                  </div>
                  {l.why && <p className="text-xs text-zinc-400 mt-1">{l.why}</p>}
                  {l.fix && <p className="text-xs text-green-400 mt-1 font-mono">FIX: {l.fix}</p>}
                </WikiCard>
              ))}
            </div>
          </div>

          <div>
            <Lbl text="Quality Checklist" color="#22c55e" />
            <div className="space-y-1.5">
              {data.CHECKS.map((c: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm p-2 rounded border border-white/10 bg-black/20">
                  <span className="text-green-400 mt-0.5">□</span>
                  <span className="text-zinc-300">{c.label || c.check || c.text || JSON.stringify(c)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Lbl text="Scoring Dimensions" color="#22c55e" />
            <div className="grid grid-cols-2 gap-2">
              {data.SDIMS.map((d: any, i: number) => (
                <div key={i} className="text-xs p-2 rounded border border-white/10 bg-black/20">
                  <div className="font-semibold">{d.name || d.dim || d.label}</div>
                  {d.desc && <div className="text-zinc-400 mt-0.5">{d.desc}</div>}
                </div>
              ))}
            </div>
            <Lbl text="Grade Scale" color="#22c55e" />
            <div className="flex flex-wrap gap-2">
              {data.SSCALE.map((s: any, i: number) => (
                <div key={i} className="text-xs px-2 py-1 rounded border border-white/10 bg-black/20">
                  <span className="font-mono text-green-400">{s.grade || s.label || s.score}</span>
                  <span className="text-zinc-400 ml-1">{s.desc || s.range || s.use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaybookSection() {
  const [cat, setCat] = useState<string>('all');
  const { pins, togglePin } = usePins();
  const cats = useMemo(() => {
    const s = new Set<string>();
    for (const w of data.WF) s.add((w as any).cat || 'General');
    return ['all', ...Array.from(s)];
  }, []);
  const filtered = cat === 'all' ? data.WF : data.WF.filter((w:any) => (w.cat || 'General') === cat);

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="📋" label="PLAYBOOK" color="#FFB000"
        title="Playbook"
        desc="24 step-by-step workflows across 9 categories. Each workflow is a named animal chain applied to a specific domain. Click to expand → copy the chain prompt."
        count={data.WF.length}
      />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <Pill key={c} label={c === 'all' ? 'ALL' : c} active={cat === c} color="#FFB000" onClick={() => setCat(c)} />
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((w: any, i: number) => (
          <Disclosure key={i} summary={
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm flex-1">{w.title}</span>
              {w.cat && <Badge variant="rank">{w.cat}</Badge>}
              {w.chain && <span className="text-xs text-zinc-400">{Array.isArray(w.chain) ? w.chain.join(' → ') : w.chain}</span>}
              <PinButton
                item={{
                  id: `playbook:wf:${i}`,
                  section: 'playbook',
                  sectionLabel: 'Playbook',
                  sectionColor: '#FFB000',
                  label: w.title,
                  content: w.out || w.purpose || '',
                  desc: w.purpose,
                }}
                pins={pins}
                togglePin={togglePin}
              />
            </div>
          }>
            <div className="space-y-2">
              {w.purpose && <p className="text-xs text-zinc-400">{w.purpose}</p>}
              {w.best && <p className="text-xs text-amber-400">BEST FOR: {w.best}</p>}
              {w.steps && Array.isArray(w.steps) && (
                <div className="space-y-1.5">
                  {w.steps.map((step: any, j: number) => (
                    <div key={j} className="border border-white/10 rounded p-2 bg-black/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">{step.a || '→'}</span>
                        <span className="font-semibold text-sm">{step.t || step.title || `Step ${j+1}`}</span>
                      </div>
                      {step.items && Array.isArray(step.items) && (
                        <ul className="text-xs text-zinc-400 ml-4 list-disc space-y-0.5">
                          {step.items.map((it: string, k: number) => <li key={k}>{it}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {w.out && (
                <div>
                  <Lbl text="Output" color="#FFB000" />
                  <p className="text-xs text-zinc-400 mb-2">{w.out}</p>
                </div>
              )}
            </div>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

export function BuilderSection() {
  const [goal, setGoal] = useState('');
  const [chain, setChain] = useState<string[]>([]);
  const [history, setHistory] = useState<{goal: string; chain: string[]; prompt: string}[]>([]);

  const animals = data.ANIMALS;
  const guide = data.ANIMAL_GUIDE;

  const toggle = (name: string) => {
    setChain(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const generate = () => {
    if (!goal.trim() || chain.length === 0) return;
    const sections = chain.map(name => {
      const a = animals.find((x:any) => x.name === name);
      return a ? `### ${a.emoji} ${a.name.toUpperCase()} — ${a.mode}\n${a.prompt}\n\nAPPLIED TO: ${goal}` : '';
    }).filter(Boolean).join('\n\n---\n\n');
    const prompt = `GOAL: ${goal}\n\nCHAIN: ${chain.join(' → ')}\n\n${sections}\n\n---\n\nFINAL OUTPUT: Synthesize the above perspectives into one cohesive response. Do not summarize — integrate.`;
    setHistory(prev => [{goal, chain, prompt}, ...prev].slice(0, 10));
  };

  return (
    <div className="anim-zone">
      <SectionHeader
        emoji="🔨" label="BUILDER" color="#FF4FD8"
        title="Builder"
        desc="Interactive workflow builder. Click animals to compose a reasoning chain, type your goal, generate the combined prompt, save to history."
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <WikiCard accent="#FF4FD8">
          <Lbl text="1. Pick Animal Chain" color="#FF4FD8" />
          <div className="grid grid-cols-2 gap-2 mb-3">
            {animals.map((a:any) => {
              const active = chain.includes(a.name);
              const g = guide.find((x:any) => x.name === a.name);
              return (
                <button
                  key={a.name}
                  onClick={() => toggle(a.name)}
                  className={`text-left p-2 rounded-lg border transition-all ${active ? 'border-pink-500/60 bg-pink-500/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{a.emoji}</span>
                    <div>
                      <div className={`font-semibold text-sm ${active ? 'text-pink-400' : ''}`}>{a.name}</div>
                      <div className="text-[10px] text-zinc-400">{a.mode}</div>
                    </div>
                  </div>
                  {g && <div className="text-[10px] text-zinc-400 mt-1">{g.cognitive_role}</div>}
                </button>
              );
            })}
          </div>

          <Lbl text="2. State Your Goal" color="#FF4FD8" />
          <textarea
            value={goal} onChange={e => setGoal(e.target.value)} rows={3} placeholder="e.g. Launch a $29/mo AI tool for recruiters"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-pink-400 resize-y mb-3"
          />

          <button
            onClick={generate}
            disabled={!goal.trim() || chain.length === 0}
            className="w-full px-4 py-2 rounded-lg font-mono uppercase text-sm tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-pink-500/15 border border-pink-500/50 text-pink-400 hover:bg-pink-500/25"
          >
            ⚡ GENERATE COMBINED PROMPT
          </button>

          {chain.length > 0 && (
            <div className="mt-3 text-xs text-zinc-400">
              Chain: <span className="font-mono text-pink-400">{chain.join(' → ')}</span>
            </div>
          )}
        </WikiCard>

        <div className="space-y-3">
          <Lbl text="Generated Prompt" color="#FF4FD8" />
          {history.length === 0 ? (
            <WikiCard pad="p-6">
              <p className="text-xs text-zinc-400 text-center">Pick animals + type a goal, then click GENERATE.</p>
            </WikiCard>
          ) : (
            history.map((h, i) => (
              <WikiCard key={i} accent="#FF4FD8">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm">{h.goal}</div>
                    <div className="text-xs text-zinc-400">{h.chain.join(' → ')}</div>
                  </div>
                  <CopyButton text={h.prompt} label="COPY" />
                </div>
                <CodeBlock text={h.prompt} maxHeight="240px" />
              </WikiCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
