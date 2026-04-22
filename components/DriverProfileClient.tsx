"use client";

import Link from "next/link";
import { useTeam } from "@/lib/TeamContext";
import { DriverProfile, DriverSeasonStat, Race } from "@/lib/api";
import { Flag, PosBadge, SectionHeading } from "@/components/ui";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  profile: DriverProfile;
  seasonStats: DriverSeasonStat[];
  currentResults: Race[];
  photo: string | null;
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  const { team } = useTeam();
  return (
    <div
      className="p-5 rounded-2xl text-center"
      style={{
        backgroundColor: accent ? `${team.secondary}0e` : "rgba(255,255,255,0.035)",
        border: `1px solid ${accent ? `${team.secondary}28` : "rgba(255,255,255,0.07)"}`,
      }}
    >
      <p className="font-display text-4xl font-900 italic leading-none mb-1.5 tabular-nums"
        style={{ color: accent ? team.secondary : "rgba(255,255,255,0.88)" }}>
        {value}
      </p>
      <p className="font-mono-f1 text-[9px] tracking-[0.22em] uppercase text-white/30">{label}</p>
    </div>
  );
}

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return <span>{value}</span>;
}

const listVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function DriverProfileClient({ profile, seasonStats, currentResults, photo }: Props) {
  const { team } = useTeam();

  const careerWins    = seasonStats.reduce((s, x) => s + parseInt(x.wins || "0"), 0);
  const careerPoints  = seasonStats.reduce((s, x) => s + parseFloat(x.points || "0"), 0);
  const championships = seasonStats.filter((s) => s.position === "1").length;
  const seasonsRaced  = seasonStats.length;
  const currentSeason = seasonStats.find((s) => s.season === new Date().getFullYear().toString())
    ?? seasonStats[seasonStats.length - 1];

  const dob = new Date(profile.dateOfBirth);
  const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  const raceWins = currentResults.filter((r) => r.Results?.[0]?.position === "1").length;
  const podiums  = currentResults.filter((r) => parseInt(r.Results?.[0]?.position ?? "99") <= 3).length;
  const dnfs     = currentResults.filter((r) => {
    const s = r.Results?.[0]?.status ?? "";
    return !s.includes("Finished") && !s.includes("Lap");
  }).length;

  return (
    <div className="animate-fade-in">

      {/* ── HERO ────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 speed-lines opacity-25" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${team.secondary}12, transparent 60%)`,
          }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: `linear-gradient(to bottom, ${team.secondary}, ${team.accent}50, transparent)` }}
        />

        <div className="relative flex flex-col lg:flex-row">
          {/* Left: info */}
          <div className="flex-1 px-5 sm:px-8 pt-8 pb-6 lg:py-14 flex flex-col justify-center">
            <Link
              href="/drivers"
              className="inline-flex items-center gap-2 mb-8 font-display text-xs font-700 uppercase tracking-[0.14em] transition-opacity hover:opacity-60 w-fit"
              style={{ color: team.secondary }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              All Drivers
            </Link>

            <div className="flex items-center gap-3 mb-3">
              <div className="racing-stripe h-px w-10 opacity-60" />
              <span className="font-mono-f1 text-sm font-bold tracking-[0.15em]" style={{ color: team.secondary }}>
                #{profile.permanentNumber}
              </span>
              <span className="font-mono-f1 text-xs tracking-[0.15em] text-white/25">· {profile.code}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            >
              <p className="font-display text-xl font-700 uppercase tracking-[0.15em] text-white/45 leading-none">
                {profile.givenName}
              </p>
              <h1
                className="font-display font-900 italic uppercase leading-none"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", color: team.text }}
              >
                {profile.familyName}
              </h1>
            </motion.div>

            <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
              <span className="flex items-center gap-1.5 text-white/40 text-sm font-body">
                <Flag nationality={profile.nationality} /> {profile.nationality}
              </span>
              <span className="text-white/15">·</span>
              <span className="text-white/40 text-sm font-body">
                {dob.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="text-white/15">·</span>
              <span className="text-white/40 text-sm font-body">Age {age}</span>
              {currentSeason?.Constructor && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="text-sm font-display font-700 uppercase tracking-wide" style={{ color: team.secondary }}>
                    {currentSeason.Constructor.name}
                  </span>
                </>
              )}
            </div>

            {/* Championship position card */}
            {currentSeason && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                className="inline-flex items-center gap-5 px-6 py-4 rounded-2xl"
                style={{ backgroundColor: `${team.secondary}12`, border: `1px solid ${team.secondary}30` }}
              >
                <div>
                  <p className="font-mono-f1 text-[9px] tracking-[0.22em] uppercase text-white/30">
                    {currentSeason.season} Championship
                  </p>
                  <p
                    className="font-display font-900 italic leading-none mt-0.5"
                    style={{ fontSize: "3.5rem", color: team.secondary }}
                  >
                    P{currentSeason.position}
                  </p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <p className="font-mono-f1 text-[9px] tracking-[0.22em] uppercase text-white/30">Points</p>
                  <p className="font-mono-f1 text-2xl font-bold tabular-nums mt-0.5 text-white/70">
                    <CountUp target={parseInt(currentSeason.points)} />
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: photo */}
          <div className="lg:w-[38%] lg:min-h-[460px] relative overflow-hidden">
            {/* Giant number */}
            <div
              className="absolute right-0 inset-y-0 font-display font-900 italic leading-none select-none pointer-events-none flex items-center"
              style={{ fontSize: "clamp(8rem, 20vw, 18rem)", color: `${team.secondary}07` }}
            >
              {profile.permanentNumber}
            </div>

            {photo ? (
              <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                src={photo}
                alt={`${profile.givenName} ${profile.familyName}`}
                className="relative z-10 w-full h-full object-cover object-top"
                style={{
                  minHeight: "280px",
                  maxHeight: "500px",
                  filter: "saturate(1.1) contrast(1.05)",
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "destination-in",
                }}
              />
            ) : (
              <div
                className="relative z-10 w-full flex items-end justify-center pb-8"
                style={{ minHeight: "280px" }}
              >
                <span
                  className="font-display font-900 italic uppercase"
                  style={{ fontSize: "8rem", color: `${team.secondary}30` }}
                >
                  {profile.code}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────── */}
      <div className="px-5 sm:px-8 pb-14 space-y-12">

        {/* Career stats */}
        <div>
          <SectionHeading>Career Stats</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Seasons"       value={seasonsRaced}            />
            <StatBox label="Race Wins"     value={careerWins}     accent   />
            <StatBox label="Championships" value={championships}  accent={championships > 0} />
            <StatBox label="Career Points" value={Math.round(careerPoints)} />
          </div>
        </div>

        {/* Current season */}
        {currentResults.length > 0 && (
          <div>
            <SectionHeading>{new Date().getFullYear()} Season</SectionHeading>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatBox label="Wins"    value={raceWins} accent={raceWins > 0} />
              <StatBox label="Podiums" value={podiums}  accent={podiums > 0}  />
              <StatBox label="DNFs"    value={dnfs}                           />
            </div>

            <motion.div
              className="space-y-1.5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {currentResults.map((race) => {
                const result = race.Results?.[0];
                if (!result) return null;
                const pos        = parseInt(result.position);
                const isFastest  = result.FastestLap?.rank === "1";
                const medalColor = pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : pos === 3 ? "#CD7F32" : null;
                return (
                  <motion.div
                    key={race.round}
                    variants={rowVariants}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: pos === 1 ? `${team.secondary}0e` : "rgba(255,255,255,0.025)",
                      border: `1px solid ${pos === 1 ? `${team.secondary}25` : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <PosBadge pos={pos} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-800 italic uppercase truncate text-white/88">
                        {race.raceName.replace("Grand Prix", "GP")}
                      </p>
                      <p className="text-white/30 text-xs font-body">{race.Circuit.Location.locality}</p>
                    </div>
                    {isFastest && (
                      <span className="sector-badge flex-shrink-0"
                        style={{ backgroundColor: "#9B59B618", color: "#A78BFA", border: "1px solid #9B59B630" }}>
                        ⚡ FL
                      </span>
                    )}
                    <div className="hidden sm:block text-right flex-shrink-0">
                      {result.Time
                        ? <p className="font-mono-f1 text-sm text-white/40 tabular-nums">{result.Time.time}</p>
                        : <p className="font-mono-f1 text-xs text-white/25">{result.status}</p>}
                    </div>
                    <span
                      className="flex-shrink-0 font-mono-f1 text-xs px-2.5 py-1 rounded-md tabular-nums"
                      style={{
                        backgroundColor: `${medalColor ?? team.secondary}14`,
                        color: medalColor ?? team.secondary,
                        border: `1px solid ${medalColor ?? team.secondary}28`,
                      }}
                    >
                      {result.points}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Season history */}
        {seasonStats.length > 0 && (
          <div>
            <SectionHeading>Season History</SectionHeading>
            <motion.div
              className="space-y-1.5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {[...seasonStats].reverse().map((stat) => {
                const isChamp  = stat.position === "1";
                const posNum   = parseInt(stat.position);
                const posColor = posNum === 1 ? "#FFD700" : posNum === 2 ? "#C0C0C0" : posNum === 3 ? "#CD7F32" : "rgba(255,255,255,0.3)";
                return (
                  <motion.div
                    key={stat.season}
                    variants={rowVariants}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: isChamp ? "rgba(255,215,0,0.04)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${isChamp ? "#FFD70028" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <span className="flex-shrink-0 w-14 font-mono-f1 text-sm tabular-nums" style={{ color: team.secondary }}>
                      {stat.season}
                    </span>
                    <p className="flex-1 font-display text-sm font-700 uppercase text-white/65 truncate">
                      {stat.Constructor.name}
                    </p>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {isChamp && <span className="text-sm">🏆</span>}
                      <span className="font-mono-f1 text-xs px-2.5 py-1 rounded-md tabular-nums"
                        style={{ backgroundColor: `${team.secondary}14`, color: team.secondary, border: `1px solid ${team.secondary}28` }}>
                        {stat.points} pts
                      </span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 italic text-sm leading-none"
                        style={{ color: posColor, border: `1px solid ${posColor}25`, backgroundColor: `${posColor}0e` }}>
                        P{stat.position}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {profile.url && (
          <div className="text-center pt-2">
            <a href={profile.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono-f1 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
              style={{ color: team.secondary }}>
              View on Wikipedia →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
