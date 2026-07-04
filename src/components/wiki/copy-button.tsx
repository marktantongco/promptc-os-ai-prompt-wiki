'use client';

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: "sm" | "md";
}

export function CopyButton({ text, label = "COPY", className, variant = "sm" }: CopyButtonProps) {
  const [ok, setOk] = useState(false);

  const fallbackCopy = (t: string) => {
    try {
      const el = document.createElement("textarea");
      el.value = t;
      el.style.cssText = "position:fixed;top:-9999px;opacity:0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } catch (e) {
      /* noop */
    }
  };

  const go = useCallback(() => {
    const t = text;
    if (navigator.clipboard && (window as any).isSecureContext) {
      navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
    } else {
      fallbackCopy(t);
    }
    setOk(true);
    setTimeout(() => setOk(false), 1800);
  }, [text]);

  return (
    <button
      onClick={go}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-mono uppercase tracking-wider transition-all",
        ok
          ? "border-green-500/40 bg-green-500/10 text-green-400"
          : "border-white/20 bg-white/5 text-zinc-200 hover:border-white/40 hover:text-white",
        variant === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
        className
      )}
      aria-label={label}
    >
      {ok ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {ok ? "COPIED" : label}
    </button>
  );
}

// Code block with copy button — preserves source aesthetic
export function CodeBlock({ text, maxHeight }: { text: string; maxHeight?: string }) {
  return (
    <div className="relative">
      <pre className="wiki-code" style={maxHeight ? { maxHeight } : undefined}>{text}</pre>
      <div className="absolute right-2 top-2">
        <CopyButton text={text} />
      </div>
    </div>
  );
}
