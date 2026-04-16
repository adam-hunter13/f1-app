"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTeam } from "@/lib/TeamContext";
import { DriverProfile, DriverStanding } from "@/lib/api";
import { PageHeader, Card, Flag } from "@/components/ui";

interface Props {
  drivers: DriverProfile[];
  standings: DriverStanding[];
}

type SortKey = "championship" | "points" | "wins" | "number" | "name" | "nationality";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "championship", label: "Championship" },
  { key: "points", label: "Points" },
  { key: "wins", label: "Wins" },
  { key: "number", label: "Car No." },
  { key: "name", label: "Name" },
  { key: "nationality", label: "Nationality" },
];

export default function DriversClient({ drivers, standings }: Props) {
  const { team } = useTeam();
  const [sort, setSort] = useState<SortKey>("championship");
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  // Build lookup maps
  const standingMap = new Map(standings.map((s) => [s.Driver.driverId, s]));

  // Collect unique constructor names for filter dropdown
  const constructors = useMemo(() => {
    const names = new Set<string>();
    standings.forEach((s) => {
      if (s.Constructors?.[0]?.name) names.add(s.Constructors[0].name);
    });
    return Array.from(names).sort();
  }, [standings]);

  // Filter + sort
  const displayedDrivers = useMemo(() => {
    let list = [...drivers];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.givenName.toLowerCase().includes(q) ||
          d.familyName.toLowerCase().includes(q) ||
          d.code?.toLowerCase().includes(q) ||
          d.nationality?.toLowerCase().includes(q)
      );
    }

    // Team filter
    if (teamFilter !== "all") {
      list = list.filter((d) => {
        const standing = standingMap.get(d.driverId);
        return standing?.Constructors?.[0]?.name === teamFilter;
      });
    }

    // Sort
    list.sort((a, b) => {
      const sa = standingMap.get(a.driverId);
      const sb = standingMap.get(b.driverId);

      switch (sort) {
        case "championship": {
          const pa = sa ? parseInt(sa.position) : 999;
          const pb = sb ? parseInt(sb.position) : 999;
          return pa - pb;
        }
        case "points": {
          const pa = sa ? parseFloat(sa.points) : 0;
          const pb = sb ? parseFloat(sb.points) : 0;
          return pb - pa;
        }
        case "wins": {
          const wa = sa ? parseInt(sa.wins) : 0;
          const wb = sb ? parseInt(sb.wins) : 0;
          return wb - wa;
        }
        case "number": {
          const na = parseInt(a.permanentNumber || "999");
          const nb = parseInt(b.permanentNumber || "999");
          return na - nb;
        }
        case "name":
          return a.familyName.localeCompare(b.familyName);
        case "nationality":
          return (a.nationality || "").localeCompare(b.nationality || "");
        default:
          return 0;
      }
    });

    return list;
  }, [drivers, standings, search, teamFilter, sort, standingMap]);

  const hasActiveFilter = search.trim() !== "" || teamFilter !== "all";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Drivers"
        subtitle={`${new Date().getFullYear()} Formula 1 Season — ${drivers.length} Drivers`}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* ── Filter / Sort Bar ── */}
        <div className="mb-8 space-y-4">
          {/* Search + Team filter row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search drivers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
                style={{ caretColor: team.secondary }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Team filter */}
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 font-display text-sm tracking-wide text-white/70 focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <option value="all" style={{ backgroundColor: "#111" }}>All Teams</option>
              {constructors.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "#111" }}>{c}</option>
              ))}
            </select>

            {/* Clear filters */}
            {hasActiveFilter && (
              <button
                onClick={() => { setSearch(""); setTeamFilter("all"); }}
                className="px-4 py-2.5 rounded-lg border border-white/10 font-display text-sm tracking-widest uppercase text-white/40 hover:text-white/70 hover:border-white/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-f1 text-xs tracking-widest uppercase text-white/30 mr-1">
              Sort by
            </span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className="px-3 py-1.5 rounded-full font-display text-xs font-600 tracking-widest uppercase transition-all"
                style={{
                  backgroundColor: sort === opt.key ? team.secondary : "rgba(255,255,255,0.06)",
                  color: sort === opt.key ? team.primary : "rgba(255,255,255,0.45)",
                  border: `1px solid ${sort === opt.key ? team.secondary : "transparent"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="font-mono-f1 text-xs tracking-widest text-white/25">
            {displayedDrivers.length === drivers.length
              ? `${drivers.length} drivers`
              : `${displayedDrivers.length} of ${drivers.length} drivers`}
          </p>
        </div>

        {/* ── Driver Grid ── */}
        {displayedDrivers.length === 0 ? (
          <Card className="p-16 text-center">
            <p className="font-display text-3xl italic uppercase text-white/15">No drivers found</p>
            <p className="text-white/25 text-sm mt-2">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(""); setTeamFilter("all"); }}
              className="mt-6 px-5 py-2.5 rounded font-display text-sm font-700 uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ backgroundColor: team.secondary, color: team.primary }}
            >
              Reset Filters
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedDrivers.map((driver) => {
              const standing = standingMap.get(driver.driverId);
              const pos = standing ? parseInt(standing.position) : null;

              return (
                <Link key={driver.driverId} href={`/drivers/${driver.driverId}`}>
                  <Card className="p-5 card-hover group cursor-pointer h-full relative overflow-hidden">
                    {/* Background number watermark */}
                    <div
                      className="absolute -right-3 -bottom-4 font-display font-900 italic leading-none select-none pointer-events-none"
                      style={{ fontSize: "7rem", color: `${team.secondary}10` }}
                    >
                      {driver.permanentNumber || "?"}
                    </div>

                    {/* Top row: championship position + car number */}
                    <div className="flex items-start justify-between mb-4 relative">
                      {pos !== null ? (
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded font-display font-800 italic text-lg leading-none"
                          style={{
                            color:
                              pos === 1 ? "#FFD700" :
                              pos === 2 ? "#C0C0C0" :
                              pos === 3 ? "#CD7F32" :
                              team.secondary,
                            border: `1.5px solid ${
                              pos <= 3
                                ? (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : "#CD7F32")
                                : team.secondary
                            }30`,
                            backgroundColor: `${
                              pos <= 3
                                ? (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : "#CD7F32")
                                : team.secondary
                            }10`,
                          }}
                        >
                          {pos}
                        </div>
                      ) : (
                        <div className="w-8 h-8" />
                      )}
                      <span
                        className="font-mono-f1 text-2xl font-bold leading-none"
                        style={{ color: `${team.secondary}60` }}
                      >
                        #{driver.permanentNumber || "—"}
                      </span>
                    </div>

                    {/* Driver name */}
                    <div className="relative mb-3">
                      <p className="font-display text-sm font-600 uppercase tracking-wide text-white/40">
                        {driver.givenName}
                      </p>
                      <p
                        className="font-display text-2xl font-900 italic uppercase leading-tight group-hover:opacity-80 transition-opacity"
                        style={{ color: team.text }}
                      >
                        {driver.familyName}
                      </p>
                      <p className="font-mono-f1 text-xs text-white/30 mt-0.5 tracking-widest">
                        {driver.code}
                      </p>
                    </div>

                    {/* Bottom: nationality + points */}
                    <div className="relative mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                      <p className="text-white/40 text-xs flex items-center gap-1.5">
                        <Flag nationality={driver.nationality} />
                        <span>{driver.nationality}</span>
                      </p>
                      {standing && (
                        <div className="flex items-center gap-2">
                          {parseInt(standing.wins) > 0 && (
                            <span className="font-mono-f1 text-xs text-white/30">
                              {standing.wins}W
                            </span>
                          )}
                          <span
                            className="font-mono-f1 text-xs px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${team.secondary}15`, color: team.secondary }}
                          >
                            {standing.points} pts
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Constructor */}
                    {standing?.Constructors?.[0] && (
                      <p className="text-white/25 text-xs mt-1.5 truncate relative">
                        {standing.Constructors[0].name}
                      </p>
                    )}

                    {/* Hover arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      <span className="font-mono-f1 text-xs" style={{ color: team.secondary }}>→</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
