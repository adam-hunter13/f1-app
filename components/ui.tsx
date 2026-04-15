"use client";

import { useTeam } from "@/lib/TeamContext";

// Section heading with racing stripe
export function SectionHeading({ children }: { children: React.ReactNode }) {
  const { team } = useTeam();
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: team.secondary }} />
      <h2 className="font-display text-2xl font-800 tracking-widest uppercase" style={{ color: team.text }}>
        {children}
      </h2>
    </div>
  );
}

// Position badge (1st, 2nd, 3rd etc.)
export function PosBadge({ pos }: { pos: number }) {
  const { team } = useTeam();
  const medals: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  const color = medals[pos] || team.secondary;
  return (
    <span
      className="pos-badge inline-flex items-center justify-center w-9 h-9 rounded text-lg leading-none flex-shrink-0"
      style={{ color, border: `1.5px solid ${color}22`, backgroundColor: `${color}15` }}
    >
      {pos}
    </span>
  );
}

// Points chip
export function PointsChip({ points }: { points: string }) {
  const { team } = useTeam();
  return (
    <span
      className="font-mono-f1 text-sm px-2 py-0.5 rounded"
      style={{ backgroundColor: `${team.secondary}22`, color: team.secondary }}
    >
      {points} pts
    </span>
  );
}

// Flag emoji helper
export function Flag({ nationality }: { nationality: string }) {
  const flags: Record<string, string> = {
    British: "🇬🇧", Dutch: "🇳🇱", Spanish: "🇪🇸", Mexican: "🇲🇽",
    Monegasque: "🇲🇨", Australian: "🇦🇺", German: "🇩🇪", French: "🇫🇷",
    Canadian: "🇨🇦", Finnish: "🇫🇮", Japanese: "🇯🇵", Thai: "🇹🇭",
    Chinese: "🇨🇳", Danish: "🇩🇰", American: "🇺🇸", Italian: "🇮🇹",
    Brazilian: "🇧🇷", Argentine: "🇦🇷", Swiss: "🇨🇭", Austrian: "🇦🇹",
    Belgian: "🇧🇪", Polish: "🇵🇱", "New Zealander": "🇳🇿",
  };
  return <span title={nationality}>{flags[nationality] || "🏎"}</span>;
}

// Card component
export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Skeleton loader
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`shimmer rounded-lg ${className}`} />
  );
}

// Page header
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { team } = useTeam();
  return (
    <div className="relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            ${team.secondary} 0px,
            ${team.secondary} 1px,
            transparent 1px,
            transparent 20px
          )`,
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="racing-stripe h-0.5 w-12" />
          <span className="font-mono-f1 text-xs tracking-widest uppercase" style={{ color: team.secondary }}>
            {team.shortName}
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-900 tracking-tight uppercase italic"
          style={{ color: team.text }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-white/50 font-body text-sm tracking-wide">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
