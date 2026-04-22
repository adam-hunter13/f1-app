"use client";

import dynamic from "next/dynamic";
import { useTeam } from "@/lib/TeamContext";
import { DriverStanding, ConstructorStanding } from "@/lib/api";
import { PosBadge, PointsChip, Flag, SectionHeading } from "@/components/ui";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const F1CarScene = dynamic(() => import("./F1CarScene"), { ssr: false });

interface Props {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  driverPhotos: Record<string, string | null>;
}

/* ── animated number count-up ── */
function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <span>{value}</span>;
}

/* ── driver face card ── */
function DriverFace({
  standing,
  photo,
  rank,
  delay,
}: {
  standing: DriverStanding;
  photo: string | null;
  rank: number;
  delay: number;
}) {
  const { team } = useTeam();
  const medalColor = rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : team.secondary;
  const d = standing.Driver;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      className="flex flex-col items-center gap-3"
    >
      {/* Photo + glow */}
      <div className="relative flex flex-col items-center">
        {/* Radial glow behind photo */}
        <div
          className="absolute -inset-4 rounded-full blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 60%, ${medalColor}45 0%, ${medalColor}15 45%, transparent 70%)` }}
        />
        {/* Outer ring */}
        <div
          className="relative rounded-full p-[2px]"
          style={{
            background: `linear-gradient(135deg, ${medalColor}, ${medalColor}40)`,
            boxShadow: `0 0 30px ${medalColor}50, 0 0 60px ${medalColor}20`,
          }}
        >
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden"
            style={{ background: team.primary }}
          >
            {photo ? (
              <img
                src={photo}
                alt={`${d.givenName} ${d.familyName}`}
                className="w-full h-full object-cover object-top scale-110"
                style={{ filter: "saturate(1.15) contrast(1.05)" }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-display font-900 italic text-3xl"
                style={{ background: `linear-gradient(135deg, ${team.primary}, ${team.secondary}40)`, color: medalColor }}
              >
                {d.code}
              </div>
            )}
          </div>
        </div>
        {/* Rank badge */}
        <div
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center font-display font-900 italic text-sm z-10"
          style={{ backgroundColor: medalColor, color: team.primary, boxShadow: `0 0 10px ${medalColor}80` }}
        >
          {rank}
        </div>
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="font-display font-900 italic uppercase text-sm leading-none" style={{ color: medalColor }}>
          {d.familyName}
        </p>
        <p className="font-mono-f1 text-[10px] tracking-[0.15em] text-white/35 mt-0.5">
          {d.code}
        </p>
        <p className="font-mono-f1 text-xs mt-1 tabular-nums" style={{ color: `${medalColor}cc` }}>
          <CountUp target={parseInt(standing.points)} /> pts
        </p>
      </div>
    </motion.div>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function DashboardClient({ drivers, constructors, driverPhotos }: Props) {
  const { team } = useTeam();
  const top1 = drivers[0];
  const top2 = drivers[1];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ════════════════════════════════════════
          HERO — 3D car + driver faces
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col lg:flex-row"
        style={{ minHeight: "min(70vh, 580px)" }}
      >
        {/* Background */}
        <div className="absolute inset-0 speed-lines opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, ${team.secondary}10 0%, transparent 65%),
                         radial-gradient(ellipse at 20% 80%, ${team.accent}08 0%, transparent 50%)`,
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 z-10"
          style={{ background: `linear-gradient(to top, ${team.primary}, transparent)` }}
        />
        {/* Left color stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: `linear-gradient(to bottom, ${team.secondary}, ${team.accent}60, transparent)` }}
        />

        {/* LEFT: driver info + faces */}
        <div className="relative z-20 flex flex-col justify-center px-6 md:px-10 pt-10 pb-4 lg:pb-10 lg:w-[45%] lg:min-h-full">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="racing-stripe h-px w-8 opacity-60" />
              <span
                className="font-mono-f1 text-[10px] tracking-[0.22em] uppercase"
                style={{ color: `${team.secondary}cc` }}
              >
                {new Date().getFullYear()} World Championship
              </span>
            </div>

            <h1
              className="font-display font-900 italic uppercase leading-[0.88]"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                color: team.text,
                textShadow: `0 0 60px ${team.secondary}25`,
              }}
            >
              Box<br />
              <span style={{ color: team.secondary }}>Box</span>
            </h1>
          </motion.div>

          {/* Driver faces */}
          {(top1 || top2) && (
            <div className="flex items-end gap-8 mt-8">
              {top1 && (
                <DriverFace
                  standing={top1}
                  photo={driverPhotos[top1.Driver.driverId] ?? null}
                  rank={1}
                  delay={0.2}
                />
              )}
              {top2 && (
                <DriverFace
                  standing={top2}
                  photo={driverPhotos[top2.Driver.driverId] ?? null}
                  rank={2}
                  delay={0.35}
                />
              )}
            </div>
          )}
        </div>

        {/* RIGHT: 3D car canvas */}
        <div className="relative z-20 lg:w-[55%] h-[240px] md:h-[300px] lg:h-auto">
          <F1CarScene
            teamId={team.id}
            secondary={team.secondary}
          />
          {/* Glow under car */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-8 blur-2xl rounded-full pointer-events-none"
            style={{ backgroundColor: `${team.secondary}30` }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════
          STANDINGS
      ════════════════════════════════════════ */}
      <div className="flex-1 px-4 sm:px-6 pb-10 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Drivers */}
          <div>
            <SectionHeading>Drivers Championship</SectionHeading>
            <motion.div
              className="space-y-1.5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {drivers.map((d, i) => {
                const medalColor = i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : null;
                return (
                  <motion.div
                    key={d.Driver.driverId}
                    variants={rowVariants}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl cursor-default"
                    style={{
                      backgroundColor: i === 0 ? `${team.secondary}0e` : "rgba(255,255,255,0.025)",
                      border: `1px solid ${i === 0 ? `${team.secondary}25` : "rgba(255,255,255,0.05)"}`,
                    }}
                    whileHover={{ backgroundColor: i === 0 ? `${team.secondary}15` : "rgba(255,255,255,0.04)" }}
                  >
                    <PosBadge pos={parseInt(d.position)} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-800 uppercase tracking-wide leading-none">
                        <span className="text-white/25 text-xs mr-1.5">{d.Driver.code}</span>
                        <span className="text-white/75">{d.Driver.givenName} </span>
                        <span style={{ color: medalColor ?? "rgba(255,255,255,0.9)" }}>
                          {d.Driver.familyName}
                        </span>
                      </p>
                      <p className="text-white/30 text-xs mt-1 font-body flex items-center gap-1">
                        <Flag nationality={d.Driver.nationality} />
                        {d.Constructors[0]?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {d.wins !== "0" && (
                        <span className="font-mono-f1 text-[10px] text-white/20">{d.wins}W</span>
                      )}
                      <PointsChip points={d.points} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Constructors */}
          <div>
            <SectionHeading>Constructors Championship</SectionHeading>
            <motion.div
              className="space-y-1.5"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {constructors.map((c, i) => {
                const pct = Math.round(
                  (parseInt(c.points) / parseInt(constructors[0].points)) * 100
                );
                return (
                  <motion.div
                    key={c.Constructor.constructorId}
                    variants={rowVariants}
                    className="px-3.5 py-3 rounded-xl"
                    style={{
                      backgroundColor: i === 0 ? `${team.secondary}0e` : "rgba(255,255,255,0.025)",
                      border: `1px solid ${i === 0 ? `${team.secondary}25` : "rgba(255,255,255,0.05)"}`,
                    }}
                    whileHover={{ backgroundColor: i === 0 ? `${team.secondary}15` : "rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex items-center gap-3.5 mb-2.5">
                      <PosBadge pos={parseInt(c.position)} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-800 uppercase tracking-wide">
                          <span style={{ color: i < 3 ? team.secondary : "rgba(255,255,255,0.9)" }}>
                            {c.Constructor.name}
                          </span>
                        </p>
                        <p className="text-white/30 text-xs mt-0.5 font-body flex items-center gap-1">
                          <Flag nationality={c.Constructor.nationality} />
                          {c.Constructor.nationality}
                        </p>
                      </div>
                      <PointsChip points={c.points} />
                    </div>
                    {/* Bar */}
                    <div className="stat-bar-track ml-11">
                      <motion.div
                        className="stat-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                        style={{
                          backgroundColor: i === 0 ? team.secondary : team.accent,
                          opacity: i === 0 ? 0.9 : 0.5,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
