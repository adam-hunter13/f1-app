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

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/drivers", label: "Drivers" },
    { href: "/races", label: "Races" },
    { href: "/results", label: "Results" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ backgroundColor: `${team.primary}ee`, backdropFilter: "blur(12px)" }}
    >
      {/* Top accent stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: team.secondary }} />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center font-display text-sm font-900 italic"
            style={{ backgroundColor: team.secondary, color: team.primary }}
          >
            F1
          </div>
          {/* <span className="font-display text-xl font-bold tracking-widest uppercase hidden sm:block"
            style={{ color: team.text }}>
            Pit Wall
          </span> */}
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link px-4 py-2 font-display text-sm font-600 tracking-widest uppercase transition-colors ${
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)) ? "active" : ""
              }`}
              style={{
                color: (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)) ? team.secondary : "rgba(255,255,255,0.6)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Team selector */}
        <div className="relative">
          <button
            onClick={() => setTeamMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded border border-white/20 hover:border-white/40 transition-colors text-xs font-display font-600 tracking-widest uppercase"
            style={{ color: team.secondary }}
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: team.secondary }}
            />
            <span className="hidden sm:block">{team.shortName}</span>
            <svg className={`w-3 h-3 transition-transform ${teamMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {teamMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-white/10 shadow-2xl z-50 py-2 overflow-hidden"
              style={{ backgroundColor: team.primary }}
            >
              <p className="px-4 py-2 text-xs font-mono-f1 tracking-widest text-white/30 uppercase border-b border-white/10 mb-1">
                Select Your Team
              </p>
              {TEAMS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTeamById(t.id); setTeamMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <span
                    className="w-3 h-10 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: t.secondary }}
                  />
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span className="font-display text-sm font-600 tracking-wide"
                    style={{ color: team.id === t.id ? t.secondary : "rgba(255,255,255,0.8)" }}>
                    {t.shortName}
                  </span>
                  {team.id === t.id && (
                    <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: t.secondary }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
