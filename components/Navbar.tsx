"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTeam } from "@/lib/TeamContext";
import { TEAMS } from "@/lib/teams";

export default function Navbar() {
  const { team, setTeamById } = useTeam();
  const pathname = usePathname();

  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/",        label: "Dashboard" },
    { href: "/drivers", label: "Drivers"   },
    { href: "/races",   label: "Races"     },
    { href: "/results", label: "Results"   },
  ];

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: `${team.primary}f0`,
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top accent stripe — two-tone */}
      <div className="h-[2px] w-full flex">
        <div className="flex-1" style={{ backgroundColor: team.secondary }} />
        <div className="w-1/4 opacity-40" style={{ backgroundColor: team.accent }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-sm font-900 italic tracking-tight select-none transition-transform group-hover:scale-105"
            style={{ backgroundColor: team.secondary, color: team.primary }}
          >
            F1
          </div>
          <span
            className="hidden sm:block font-display font-800 text-base italic uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Box Box
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link px-4 py-2 font-display text-sm font-700 tracking-[0.1em] uppercase transition-colors ${isActive ? "active" : ""}`}
                style={{ color: isActive ? team.secondary : "rgba(255,255,255,0.5)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Team Selector */}
        <div className="relative hidden md:block flex-shrink-0">
          <button
            onClick={() => setTeamMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all text-xs font-display font-700 tracking-[0.12em] uppercase"
            style={{
              color: team.secondary,
              backgroundColor: `${team.secondary}12`,
              border: `1px solid ${team.secondary}30`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: team.secondary, boxShadow: `0 0 6px ${team.secondary}80` }}
            />
            <span>{team.shortName}</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${teamMenuOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {teamMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden animate-scale-in"
              style={{ backgroundColor: `${team.primary}f8`, backdropFilter: "blur(20px)" }}
            >
              <div className="px-4 pt-3 pb-2 border-b border-white/[0.07]">
                <p className="font-mono-f1 text-[10px] tracking-[0.2em] text-white/30 uppercase">
                  Select Team
                </p>
              </div>
              <div className="py-1.5 max-h-80 overflow-y-auto">
                {TEAMS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTeamById(t.id); setTeamMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: t.secondary,
                          boxShadow: team.id === t.id ? `0 0 8px ${t.secondary}80` : "none",
                        }}
                      />
                    </div>
                    <span
                      className="font-display text-sm font-700 tracking-wide flex-1"
                      style={{ color: team.id === t.id ? t.secondary : "rgba(255,255,255,0.75)" }}
                    >
                      {t.shortName}
                    </span>
                    {team.id === t.id && (
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.secondary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
          style={{
            backgroundColor: `${team.secondary}12`,
            border: `1px solid ${team.secondary}30`,
            color: team.secondary,
          }}
          aria-label="Toggle menu"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/[0.07] animate-slide-down"
          style={{ backgroundColor: `${team.primary}f8` }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  style={{
                    backgroundColor: isActive ? `${team.secondary}14` : "transparent",
                    color: isActive ? team.secondary : "rgba(255,255,255,0.65)",
                  }}
                >
                  {isActive && (
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: team.secondary }} />
                  )}
                  <span className="font-display text-sm font-700 tracking-[0.1em] uppercase">
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Team grid */}
          <div className="px-4 pb-4 border-t border-white/[0.06] pt-3">
            <p className="font-mono-f1 text-[10px] tracking-[0.2em] text-white/25 uppercase mb-2.5">
              Select Team
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {TEAMS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTeamById(t.id); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left"
                  style={{
                    backgroundColor: team.id === t.id ? `${t.secondary}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${team.id === t.id ? `${t.secondary}40` : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.secondary }}
                  />
                  <span
                    className="font-display text-xs font-700 tracking-wide"
                    style={{ color: team.id === t.id ? t.secondary : "rgba(255,255,255,0.7)" }}
                  >
                    {t.shortName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
