"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTeam } from "@/lib/TeamContext";
import { TEAMS } from "@/lib/teams";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/drivers",
    label: "Drivers",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href: "/races",
    label: "Races",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l8 2 8-2v10l-8 2-8-2V4z" />
        <path d="M12 6v10" />
      </svg>
    ),
  },
  {
    href: "/results",
    label: "Results",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V12" />
        <path d="M9 20V8" />
        <path d="M14 20V4" />
        <path d="M19 20v-6" />
      </svg>
    ),
  },
];

/* ── DESKTOP SIDEBAR ─────────────────────────────────── */
export function Sidebar() {
  const { team, setTeamById } = useTeam();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[220px] z-50"
      style={{
        backgroundColor: `${team.primary}f8`,
        backdropFilter: "blur(20px)",
        borderRight: `1px solid rgba(255,255,255,0.06)`,
      }}
    >
      {/* Team color accent line */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[2px]"
        style={{ background: `linear-gradient(to bottom, ${team.secondary}, ${team.accent}50, transparent)` }}
      />

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display text-sm font-900 italic flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: team.secondary, color: team.primary }}
          >
            F1
          </div>
          <div>
            <p className="font-display font-800 italic uppercase text-base tracking-wide leading-none text-white/90">
              Box Box
            </p>
            <p className="font-mono-f1 text-[9px] tracking-[0.18em] text-white/25 mt-0.5">
              {new Date().getFullYear()} SEASON
            </p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-4 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="px-3 flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
              style={{
                backgroundColor: isActive ? `${team.secondary}18` : "transparent",
                color: isActive ? team.secondary : "rgba(255,255,255,0.45)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }}
            >
              <span className="flex-shrink-0">{item.icon(isActive)}</span>
              <span
                className="font-display text-sm font-700 uppercase tracking-[0.1em]"
                style={{ color: isActive ? team.secondary : "rgba(255,255,255,0.55)" }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="ml-auto w-1 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.secondary }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Team selector */}
      <div className="px-3 pb-6 flex-shrink-0">
        <div className="h-px bg-white/[0.06] mb-4" />
        <p className="font-mono-f1 text-[9px] tracking-[0.2em] uppercase text-white/20 px-2 mb-3">
          Team
        </p>

        {/* Current team button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2 transition-all"
          style={{
            backgroundColor: `${team.secondary}14`,
            border: `1px solid ${team.secondary}30`,
          }}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: team.secondary, boxShadow: `0 0 8px ${team.secondary}80` }}
          />
          <span className="font-display text-sm font-700 uppercase tracking-wide flex-1 text-left" style={{ color: team.secondary }}>
            {team.shortName}
          </span>
          <svg
            className={`w-3 h-3 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            style={{ color: team.secondary }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Team grid */}
        {expanded && (
          <div
            className="rounded-xl overflow-hidden border border-white/[0.08] p-2"
            style={{ backgroundColor: `${team.primary}e8` }}
          >
            <div className="grid grid-cols-2 gap-1">
              {TEAMS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTeamById(t.id); setExpanded(false); }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-left"
                  style={{
                    backgroundColor: team.id === t.id ? `${t.secondary}20` : "transparent",
                    border: `1px solid ${team.id === t.id ? `${t.secondary}40` : "transparent"}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.secondary }} />
                  <span
                    className="font-display text-[11px] font-700 tracking-wide truncate"
                    style={{ color: team.id === t.id ? t.secondary : "rgba(255,255,255,0.6)" }}
                  >
                    {t.shortName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── MOBILE TOP BAR ──────────────────────────────────── */
export function MobileTopBar() {
  const { team, setTeamById } = useTeam();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4"
        style={{
          backgroundColor: `${team.primary}f2`,
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] flex">
          <div className="flex-1" style={{ backgroundColor: team.secondary }} />
          <div className="w-1/4 opacity-35" style={{ backgroundColor: team.accent }} />
        </div>

        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-xs font-900 italic"
            style={{ backgroundColor: team.secondary, color: team.primary }}
          >
            F1
          </div>
          <span className="font-display font-800 italic uppercase text-sm tracking-wide text-white/85">Box Box</span>
        </Link>

        {/* Team selector button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: `${team.secondary}14`, border: `1px solid ${team.secondary}30` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: team.secondary }} />
          <span className="font-display text-xs font-700 uppercase tracking-wide" style={{ color: team.secondary }}>
            {team.shortName}
          </span>
        </button>
      </header>

      {/* Team picker overlay */}
      {open && (
        <div
          className="md:hidden fixed top-14 left-0 right-0 z-40 px-4 py-4"
          style={{ backgroundColor: `${team.primary}f8`, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="grid grid-cols-3 gap-2">
            {TEAMS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTeamById(t.id); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  backgroundColor: team.id === t.id ? `${t.secondary}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${team.id === t.id ? `${t.secondary}40` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.secondary }} />
                <span
                  className="font-display text-xs font-700 truncate"
                  style={{ color: team.id === t.id ? t.secondary : "rgba(255,255,255,0.7)" }}
                >
                  {t.shortName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ── MOBILE BOTTOM NAV ───────────────────────────────── */
export function MobileBottomNav() {
  const { team } = useTeam();
  const pathname  = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        backgroundColor: `${team.primary}f8`,
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            style={{ color: isActive ? team.secondary : "rgba(255,255,255,0.35)" }}
          >
            {item.icon(isActive)}
            <span
              className="font-display text-[9px] font-700 uppercase tracking-[0.1em]"
              style={{ color: isActive ? team.secondary : "rgba(255,255,255,0.35)" }}
            >
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] rounded-b-sm" style={{ backgroundColor: team.secondary }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
