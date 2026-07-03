'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { Pin, PinOff, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Pin List — users can pin any wiki item to a persistent panel.
// Inspired by skyleen77/pin-list on 21st.dev, rebuilt for the wiki context.
// Stores pins in localStorage (no backend needed).

export interface PinnedItem {
  id: string;
  section: string;
  sectionLabel: string;
  sectionColor: string;
  label: string;
  content: string;
  desc?: string;
  pinnedAt: number;
}

const STORAGE_KEY = "promptc-os-pins";

// ── External store via useSyncExternalStore (correct React 19 pattern) ─────
let pinsCache: PinnedItem[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function readPins(): PinnedItem[] {
  if (!initialized && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      pinsCache = raw ? JSON.parse(raw) : [];
    } catch {
      pinsCache = [];
    }
    initialized = true;
  }
  return pinsCache;
}

function writePins(pins: PinnedItem[]) {
  pinsCache = pins;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
  }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Hook: use pins state + toggle (uses useSyncExternalStore for SSR-safe localStorage)
export function usePins() {
  const pins = useSyncExternalStore(subscribe, readPins, () => [] as PinnedItem[]);

  const togglePin = useCallback((item: Omit<PinnedItem, 'pinnedAt'>) => {
    const id = item.id;
    const current = readPins();
    const exists = current.find(p => p.id === id);
    const next = exists
      ? current.filter(p => p.id !== id)
      : [...current, { ...item, pinnedAt: Date.now() }];
    writePins(next);
  }, []);

  const removePin = useCallback((id: string) => {
    writePins(readPins().filter(p => p.id !== id));
  }, []);

  return { pins, togglePin, removePin };
}

// Pin button — drop on any card
export function PinButton({
  item,
  pins,
  togglePin,
  className,
}: {
  item: Omit<PinnedItem, 'pinnedAt'>;
  pins: PinnedItem[];
  togglePin: (item: Omit<PinnedItem, 'pinnedAt'>) => void;
  className?: string;
}) {
  const pinned = pins.some(p => p.id === item.id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        togglePin(item);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-mono uppercase tracking-wider transition-all",
        pinned
          ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
          : "border-white/15 bg-white/5 text-zinc-400 hover:border-amber-500/40 hover:text-amber-400",
        "px-2 py-1 text-[10px]",
        className
      )}
      aria-label={pinned ? "Unpin" : "Pin"}
      title={pinned ? "Unpin from Pinned panel" : "Pin to Pinned panel"}
    >
      {pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
      {pinned ? "PINNED" : "PIN"}
    </button>
  );
}

// Pin List panel — renders in a drawer/dialog
export function PinListPanel({
  pins,
  removePin,
  onClose,
  onNavigate,
}: {
  pins: PinnedItem[];
  removePin: (id: string) => void;
  onClose: () => void;
  onNavigate: (section: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = q.trim()
    ? pins.filter(p => {
        const hay = `${p.label} ${p.desc || ''} ${p.content} ${p.sectionLabel}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : pins;

  // Sort by most recently pinned
  const sorted = [...filtered].sort((a, b) => b.pinnedAt - a.pinnedAt);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <aside className="relative w-full max-w-md ml-auto bg-[#0B0D10] border-l border-white/10 flex flex-col anim-slide">
        <header className="flex items-center justify-between gap-2 px-4 h-14 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-amber-400" />
            <span className="wiki-display text-lg">Pinned</span>
            <span className="mono-label text-zinc-500">[{pins.length}]</span>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Filter pins…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Pin className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{q ? "No pins match filter." : "No pins yet. Click PIN on any item to save it here."}</p>
            </div>
          ) : (
            sorted.map(p => (
              <div
                key={p.id}
                className="p-3 rounded-lg border border-white/10 bg-[#14161A] hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <button
                    onClick={() => { onNavigate(p.section); onClose(); }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="mono-label" style={{ color: p.sectionColor }}>{p.sectionLabel}</span>
                    </div>
                    <div className="font-semibold text-sm text-white truncate group-hover:text-amber-400">{p.label}</div>
                  </button>
                  <button
                    onClick={() => removePin(p.id)}
                    className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove pin"
                  >
                    <X className="h-3 w-3 text-zinc-500" />
                  </button>
                </div>
                {p.desc && <p className="text-xs text-zinc-500 line-clamp-1 mb-1">{p.desc}</p>}
                <p className="text-[10px] text-zinc-600 font-mono line-clamp-2">{p.content.slice(0, 120)}{p.content.length > 120 ? '…' : ''}</p>
              </div>
            ))
          )}
        </div>

        <footer className="p-3 border-t border-white/10 text-xs text-zinc-600 text-center">
          Pins stored locally (localStorage). Clear browser data to reset.
        </footer>
      </aside>
    </div>
  );
}

// Pin count badge — for the header button
export function PinBadge({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded hover:bg-white/5 transition-colors"
      aria-label="Open pinned items"
      title="Pinned items"
    >
      <Pin className={cn("h-5 w-5", count > 0 ? "text-amber-400" : "text-zinc-500")} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
