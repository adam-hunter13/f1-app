"use client";

import { useTeam } from "@/lib/TeamContext";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  const { team } = useTeam();
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex gap-0.5 flex-shrink-0">
        <div className="w-1 h-7 rounded-sm" style={{ backgroundColor: team.secondary }} />
        <div className="w-1 h-7 rounded-sm opacity-40" style={{ backgroundColor: team.secondary }} />
      </div>
      <h2
        className="font-display text-xl font-800 tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.12em" }}
      >
        {children}
      </h2>
    </div>
  );
}

export function PosBadge({ pos }: { pos: number }) {
  const { team } = useTeam();
  const medals: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  const color = medals[pos] ?? team.secondary;
  return (
    <span
      className="pos-badge inline-flex items-center justify-center w-8 h-8 rounded-md text-base leading-none flex-shrink-0 tabular-nums"
      style={{
        color,
        border: `1px solid ${color}28`,
        backgroundColor: `${color}12`,
        fontSize: pos >= 10 ? "0.8rem" : undefined,
      }}
    >
      {pos}
    </span>
  );
}

export function PointsChip({ points }: { points: string }) {
  const { team } = useTeam();
  return (
    <span
      className="font-mono-f1 text-xs px-2.5 py-1 rounded-md tabular-nums"
      style={{
        backgroundColor: `${team.secondary}18`,
        color: team.secondary,
        border: `1px solid ${team.secondary}28`,
      }}
    >
      {points} <span style={{ opacity: 0.6 }}>pts</span>
    </span>
  );
}

export function Flag({ nationality }: { nationality: string }) {
  const flags: Record<string, string> = {
    British: "🇬🇧", Dutch: "🇳🇱", Spanish: "🇪🇸", Mexican: "🇲🇽",
    Monegasque: "🇲🇨", Australian: "🇦🇺", German: "🇩🇪", French: "🇫🇷",
    Canadian: "🇨🇦", Finnish: "🇫🇮", Japanese: "🇯🇵", Thai: "🇹🇭",
    Chinese: "🇨🇳", Danish: "🇩🇰", American: "🇺🇸", Italian: "🇮🇹",
    Brazilian: "🇧🇷", Argentine: "🇦🇷", Swiss: "🇨🇭", Austrian: "🇦🇹",
    Belgian: "🇧🇪", Polish: "🇵🇱", "New Zealander": "🇳🇿",
  };
  return <span title={nationality}>{flags[nationality] ?? "🏎"}</span>;
}

export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { team } = useTeam();
  return (
    <div className="relative overflow-hidden py-14 px-4">
      {/* Diagonal speed lines */}
      <div className="absolute inset-0 header-pattern opacity-[0.035]" />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-16"
        style={{ background: `linear-gradient(to top, ${team.primary}, transparent)` }}
      />

      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: `linear-gradient(to bottom, ${team.secondary}, transparent)` }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <div className="racing-stripe h-px w-10 opacity-70" />
          <span
            className="font-mono-f1 text-xs tracking-[0.2em] uppercase"
            style={{ color: `${team.secondary}cc` }}
          >
            {new Date().getFullYear()} · {team.shortName}
          </span>
        </div>

        <h1
          className="font-display font-900 uppercase italic leading-[0.9]"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            color: team.text,
            textShadow: `0 0 80px ${team.secondary}20`,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-white/40 text-sm tracking-wide font-body max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
