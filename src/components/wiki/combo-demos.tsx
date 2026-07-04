'use client';

import { Suspense, useRef, useMemo, useEffect, useState, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial, Icosahedron, Sphere, Torus } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Cyberpunk Glow demo: neon particles orbiting a distorted sphere ─────────
function CyberpunkScene() {
  const mesh = useRef<any>(null);
  const torus1 = useRef<any>(null);
  const torus2 = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.3;
      mesh.current.rotation.y = t * 0.4;
    }
    if (torus1.current) {
      torus1.current.rotation.x = t * 0.5;
      torus1.current.rotation.z = t * 0.3;
    }
    if (torus2.current) {
      torus2.current.rotation.y = t * 0.4;
      torus2.current.rotation.z = -t * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#FF4FD8" />
      <pointLight position={[-5, -5, -5]} intensity={2} color="#4DFFFF" />
      <Sphere ref={mesh} args={[1, 32, 32]}>
        <MeshDistortMaterial
          color="#FF4FD8"
          emissive="#FF4FD8"
          emissiveIntensity={0.6}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <Torus ref={torus1} args={[1.6, 0.04, 16, 100]}>
        <meshStandardMaterial color="#4DFFFF" emissive="#4DFFFF" emissiveIntensity={1.5} />
      </Torus>
      <Torus ref={torus2} args={[2.0, 0.03, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </Torus>
      <Sparkles count={50} scale={6} size={3} speed={0.4} color="#FFB000" />
    </>
  );
}

export function CyberpunkGlowDemo() {
  return (
    <div className="h-56 rounded-lg overflow-hidden border border-white/10 bg-black relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <CyberpunkScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }} />
      <div className="absolute bottom-2 left-2 mono-label text-pink-400">LIVE · three.js + r3f</div>
    </div>
  );
}

// ── Liquid Gradient demo: animated CSS-only mesh gradient ──────────────────
export function LiquidGradientDemo() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 360), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-56 rounded-lg overflow-hidden border border-white/10 relative" style={{
      background: `
        radial-gradient(circle at ${30 + Math.sin(phase * 0.05) * 20}% ${30 + Math.cos(phase * 0.05) * 20}%, #4DFFFF 0%, transparent 40%),
        radial-gradient(circle at ${70 + Math.cos(phase * 0.04) * 20}% ${60 + Math.sin(phase * 0.06) * 20}%, #FF4FD8 0%, transparent 40%),
        radial-gradient(circle at ${50 + Math.sin(phase * 0.03) * 30}% ${80 + Math.cos(phase * 0.05) * 10}%, #FF6B00 0%, transparent 40%),
        #0B0D10
      `,
      transition: "background 0.05s linear",
    }}>
      <div className="absolute bottom-2 left-2 mono-label text-cyan-400">LIVE · css mesh</div>
    </div>
  );
}

// ── Motion-First demo: GSAP stagger entrance on bento cards ─────────────────
export function MotionFirstDemo() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const cards = container.current.querySelectorAll(".motion-card");
    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="h-56 rounded-lg overflow-hidden border border-white/10 bg-[#0B0D10] p-3 grid grid-cols-3 gap-2">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="motion-card rounded-md border border-white/10 flex items-center justify-center text-[10px] font-mono"
          style={{
            background: `linear-gradient(135deg, ${["#4DFFFF22", "#FF4FD822", "#FFB00022", "#22c55e22", "#FF6B0022", "#38bdf822"][i]}, transparent)`,
            color: ["#4DFFFF", "#FF4FD8", "#FFB000", "#22c55e", "#FF6B00", "#38bdf8"][i],
          }}
        >
          {["glass", "neon", "amber", "green", "orange", "blue"][i]}
        </div>
      ))}
      <div className="absolute bottom-2 left-2 mono-label text-amber-400" style={{ position: "absolute" }}>LIVE · gsap stagger</div>
    </div>
  );
}

// ── Glass + Bento demo: glass cards with backdrop blur ─────────────────────
export function GlassBentoDemo() {
  return (
    <div className="h-56 rounded-lg overflow-hidden border border-white/10 relative" style={{
      background: `
        radial-gradient(circle at 20% 30%, #4DFFFF55 0%, transparent 30%),
        radial-gradient(circle at 80% 70%, #FF4FD855 0%, transparent 30%),
        radial-gradient(circle at 60% 20%, #FFB00055 0%, transparent 30%),
        #0B0D10
      `,
    }}>
      <div className="absolute inset-3 grid grid-cols-3 grid-rows-3 gap-2">
        <div className="col-span-2 row-span-2 rounded-lg border border-white/15 flex items-end p-2" style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <span className="text-[10px] font-mono text-white">KPI · $42,310</span>
        </div>
        <div className="rounded-lg border border-white/15 flex items-center justify-center text-[10px] font-mono text-cyan-300" style={{
          background: "rgba(77,255,255,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>↑ 23%</div>
        <div className="rounded-lg border border-white/15 flex items-center justify-center text-[10px] font-mono text-pink-300" style={{
          background: "rgba(255,79,216,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>live</div>
        <div className="col-span-2 rounded-lg border border-white/15 flex items-center justify-center text-[10px] font-mono text-amber-300" style={{
          background: "rgba(255,176,0,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>▁▂▄▃▅▆▇█▇▆</div>
        <div className="rounded-lg border border-white/15 flex items-center justify-center text-[10px] font-mono text-green-300" style={{
          background: "rgba(34,197,94,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>●</div>
      </div>
      <div className="absolute bottom-2 left-2 mono-label text-cyan-400">LIVE · backdrop-blur</div>
    </div>
  );
}

// ── Demo registry ──────────────────────────────────────────────────────────
export const COMBO_DEMOS: Record<string, () => ReactElement> = {
  "🎮 Cyberpunk Glow": CyberpunkGlowDemo,
  "🌊 Liquid + Ambient": LiquidGradientDemo,
  "⚡ Motion-First": MotionFirstDemo,
  "🫧 Glass + Bento": GlassBentoDemo,
};

export function ComboDemo({ combo }: { combo: string }) {
  const Demo = COMBO_DEMOS[combo];
  if (!Demo) return null;
  return <Demo />;
}
