"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useTeam } from "@/lib/TeamContext";
import { DriverProfile, DriverStanding } from "@/lib/api";
import { Flag } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  drivers: DriverProfile[];
  standings: DriverStanding[];
  driverPhotos: Record<string, string | null>;
}

type SortKey = "championship" | "points" | "wins" | "number" | "name" | "nationality";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "championship", label: "Standing" },
  { key: "points",       label: "Points"   },
  { key: "wins",         label: "Wins"     },
  { key: "number",       label: "No."      },
  { key: "name",         label: "Name"     },
  { key: "nationality",  label: "Flag"     },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

/* ── Spotlight card ── */
function DriverCard({
  driver,
  standing,
  photo,
}: {
  driver: DriverProfile;
  standing?: DriverStanding;
  photo: string | null;
}) {
  const { team } = useTeam();
  const ref  = useRef<HTMLDivElement>(null);
  const pos  = standing ? parseInt(standing.position) : null;
  const medalColor =
    pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : pos === 3 ? "#CD7F32" : null;
  const accent = medalColor ?? team.secondary;

  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/drivers/${driver.driverId}`}>
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            backgroundColor: "rgba(255,255,255,0.035)",
            border: `1px solid ${hovered ? `${accent}45` : "rgba(255,255,255,0.07)"}`,
            transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20` : "none",
          }}
        >
          {/* Mouse spotlight */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
              style={{
                background: `radial-gradient(circle 130px at ${mouse.x}% ${mouse.y}%, ${accent}18, transparent)`,
              }}
            />
          )}

          {/* Top accent bar */}
          <div
            className="absolute top-0 inset-x-0 h-[2px] transition-opacity"
            style={{
              backgroundColor: accent,
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* PHOTO SECTION — top ~55% */}
          <div
            className="relative overflow-hidden"
            style={{ height: "180px", backgroundColor: `${accent}0a` }}
          >
            {/* Number watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center font-display font-900 italic select-none pointer-events-none"
              style={{ fontSize: "9rem", color: `${accent}0c`, lineHeight: 1 }}
            >
              {driver.permanentNumber ?? "?"}
            </div>

            {/* Speed lines */}
            <div className="absolute inset-0 speed-lines opacity-30" />

            {photo ? (
              <img
                src={photo}
                alt={`${driver.givenName} ${driver.familyName}`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{
                  filter: "saturate(1.05) contrast(1.08)",
                  transition: "transform 0.4s ease",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                  maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
              />
            ) : (
              <div
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: `linear-gradient(160deg, ${accent}15, transparent 60%)`,
                }}
              >
                <span className="font-display font-900 italic text-5xl uppercase" style={{ color: `${accent}60` }}>
                  {driver.code}
                </span>
              </div>
            )}

            {/* Pos badge */}
            {pos !== null && (
              <div
                className="absolute top-3 left-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 italic text-sm"
                style={{
                  backgroundColor: `${accent}20`,
                  border: `1px solid ${accent}40`,
                  color: accent,
                }}
              >
                {pos}
              </div>
            )}

            {/* Car number top right */}
            <div className="absolute top-3 right-3 z-20">
              <span
                className="font-mono-f1 text-lg font-bold tabular-nums"
                style={{ color: `${accent}55` }}
              >
                #{driver.permanentNumber ?? "—"}
              </span>
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="p-4">
            <p className="font-display text-[10px] font-700 uppercase tracking-[0.14em] text-white/35 leading-none">
              {driver.givenName}
            </p>
            <p
              className="font-display text-xl font-900 italic uppercase leading-tight"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              {driver.familyName}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.07]">
              <p className="text-white/30 text-xs flex items-center gap-1.5 font-body">
                <Flag nationality={driver.nationality} />
                {driver.nationality}
              </p>
              {standing && (
                <span
                  className="font-mono-f1 text-xs px-2.5 py-1 rounded-md tabular-nums"
                  style={{
                    backgroundColor: `${accent}14`,
                    color: accent,
                    border: `1px solid ${accent}28`,
                  }}
                >
                  {standing.points} pts
                </span>
              )}
            </div>

            {standing?.Constructors?.[0] && (
              <p className="text-white/20 text-[10px] mt-1.5 truncate font-body">
                {standing.Constructors[0].name}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DriversClient({ drivers, standings, driverPhotos }: Props) {
  const { team } = useTeam();
  const [sort,       setSort]       = useState<SortKey>("championship");
  const [search,     setSearch]     = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const standingMap = new Map(standings.map((s) => [s.Driver.driverId, s]));

  const constructors = useMemo(() => {
    const names = new Set<string>();
    standings.forEach((s) => {
      if (s.Constructors?.[0]?.name) names.add(s.Constructors[0].name);
    });
    return Array.from(names).sort();
  }, [standings]);

  const displayedDrivers = useMemo(() => {
    let list = [...drivers];
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
    if (teamFilter !== "all") {
      list = list.filter(
        (d) => standingMap.get(d.driverId)?.Constructors?.[0]?.name === teamFilter
      );
    }
    list.sort((a, b) => {
      const sa = standingMap.get(a.driverId);
      const sb = standingMap.get(b.driverId);
      switch (sort) {
        case "championship": return (sa ? parseInt(sa.position) : 999) - (sb ? parseInt(sb.position) : 999);
        case "points":       return (sb ? parseFloat(sb.points) : 0)   - (sa ? parseFloat(sa.points) : 0);
        case "wins":         return (sb ? parseInt(sb.wins) : 0)        - (sa ? parseInt(sa.wins) : 0);
        case "number":       return parseInt(a.permanentNumber || "999") - parseInt(b.permanentNumber || "999");
        case "name":         return a.familyName.localeCompare(b.familyName);
        case "nationality":  return (a.nationality || "").localeCompare(b.nationality || "");
        default:             return 0;
      }
    });
    return list;
  }, [drivers, standings, search, teamFilter, sort, standingMap]);

  const hasActiveFilter = search.trim() !== "" || teamFilter !== "all";

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="relative overflow-hidden py-12 px-4 sm:px-6">
        <div className="absolute inset-0 header-pattern opacity-[0.03]" />
        <div
          className="absolute bottom-0 inset-x-0 h-16"
          style={{ background: `linear-gradient(to top, ${team.primary}, transparent)` }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: `linear-gradient(to bottom, ${team.secondary}, transparent)` }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="racing-stripe h-px w-8 opacity-60" />
            <span className="font-mono-f1 text-[10px] tracking-[0.22em] uppercase" style={{ color: `${team.secondary}cc` }}>
              {new Date().getFullYear()} · {drivers.length} Drivers
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="font-display font-900 italic uppercase leading-none"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: team.text }}
          >
            Drivers
          </motion.h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-14">
        {/* Filter bar */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search drivers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border bg-white/[0.04] font-body text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.08)", caretColor: team.secondary }}
                onFocus={(e) => (e.currentTarget.style.borderColor = `${team.secondary}50`)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-base leading-none">
                  ×
                </button>
              )}
            </div>

            {/* Team filter */}
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border bg-white/[0.04] font-display text-sm tracking-wide text-white/55 focus:outline-none appearance-none cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <option value="all"  style={{ backgroundColor: "#111" }}>All Teams</option>
              {constructors.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "#111" }}>{c}</option>
              ))}
            </select>

            {hasActiveFilter && (
              <button
                onClick={() => { setSearch(""); setTeamFilter("all"); }}
                className="px-4 py-2.5 rounded-xl font-display text-xs font-700 tracking-[0.1em] uppercase text-white/35 hover:text-white/60 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase text-white/25 mr-1">Sort</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className="px-3 py-1.5 rounded-lg font-display text-xs font-700 tracking-[0.1em] uppercase transition-all"
                style={{
                  backgroundColor: sort === opt.key ? team.secondary : "rgba(255,255,255,0.05)",
                  color:           sort === opt.key ? team.primary   : "rgba(255,255,255,0.4)",
                  border:         `1px solid ${sort === opt.key ? team.secondary : "transparent"}`,
                  boxShadow:       sort === opt.key ? `0 0 12px ${team.secondary}35` : "none",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="font-mono-f1 text-[10px] tracking-[0.2em] text-white/20">
            {displayedDrivers.length === drivers.length
              ? `${drivers.length} drivers`
              : `${displayedDrivers.length} of ${drivers.length} drivers`}
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {displayedDrivers.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center rounded-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="font-display text-3xl italic uppercase text-white/10">No drivers found</p>
              <button
                onClick={() => { setSearch(""); setTeamFilter("all"); }}
                className="mt-6 px-5 py-2.5 rounded-xl font-display text-sm font-700 uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{ backgroundColor: team.secondary, color: team.primary }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {displayedDrivers.map((driver) => (
                <DriverCard
                  key={driver.driverId}
                  driver={driver}
                  standing={standingMap.get(driver.driverId)}
                  photo={driverPhotos[driver.driverId] ?? null}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
