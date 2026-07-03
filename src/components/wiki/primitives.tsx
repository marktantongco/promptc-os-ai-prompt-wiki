'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Section heading with display font + accent color
export function SectionHeader({
  emoji, label, title, desc, color, count,
}: { emoji: string; label: string; title: string; desc: string; color: string; count?: number }) {
  return (
    <header className="mb-6">
      <div className="mono-label mb-1.5" style={{ color }}>{emoji} {label}</div>
      <h1 className="wiki-display text-4xl sm:text-5xl mb-2" style={{ color }}>
        {title}
        {count !== undefined && (
          <span className="ml-3 text-base align-middle font-mono opacity-60">[{count}]</span>
        )}
      </h1>
      <p className="text-sm text-zinc-400 max-w-2xl">{desc}</p>
    </header>
  );
}

// Card with optional accent border (preserves source aesthetic)
export function WikiCard({
  children, accent, className, pad = "p-4",
}: { children: ReactNode; accent?: string; className?: string; pad?: string }) {
  return (
    <div
      className={cn("rounded-xl bg-[#14161A] border transition-colors", pad, className)}
      style={{ borderColor: accent ? `${accent}22` : "rgba(255,255,255,0.08)" }}
    >
      {children}
    </div>
  );
}

// Filter pill
export function Pill({
  label, active, color, onClick, count,
}: { label: string; active?: boolean; color?: string; onClick?: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all whitespace-nowrap",
        active ? "border" : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
      )}
      style={active ? {
        background: `${color}18`,
        borderColor: `${color}55`,
        color: color,
      } : undefined}
    >
      {label}{count !== undefined && <span className="ml-1.5 opacity-60">{count}</span>}
    </button>
  );
}

// Mono label
export function Lbl({ text, color = "#4DFFFF" }: { text: string; color?: string }) {
  return <div className="mono-label mb-1.5" style={{ color }}>{text}</div>;
}

// Expandable disclosure
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Disclosure({
  summary, children, defaultOpen = false,
}: { summary: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-white/5 transition-colors"
      >
        <span>{summary}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-3 pb-3 pt-1 border-t border-white/10">{children}</div>}
    </div>
  );
}
