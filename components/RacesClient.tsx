"use client";

import { useEffect, useState } from "react";
import { Race } from "@/lib/api";
import { useTeam } from "@/lib/TeamContext";
import { PageHeader, Card, SectionHeading } from "@/components/ui";

interface Props {
  races: Race[];
}

const countryFlags: Record<string, string> = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦", USA: "🇺🇸", "United States": "🇺🇸",
  Italy: "🇮🇹", Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸",
  Austria: "🇦🇹", UK: "🇬🇧", "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱",
  Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
  Brazil: "🇧🇷", "Abu Dhabi": "🇦🇪", UAE: "🇦🇪", Qatar: "🇶🇦",
  "Las Vegas": "🇺🇸", Miami: "🇺🇸",
};

function getRaceStatus(dateStr: string): "past" | "upcoming" | "next" {
  const now = new Date();
  const raceDate = new Date(dateStr);
  const diff = raceDate.getTime() - now.getTime();
  if (diff < 0) return "past";
  if (diff < 7 * 24 * 60 * 60 * 1000) return "next";
  return "upcoming";
}

function formatDate(dateStr: string): { day: string; month: string; year: string } {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
  };
}

// ── Countdown tile ──────────────────────────────────────────────
function CountdownTile({ value, label }: { value: number; label: string }) {
  const { team } = useTeam();
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: `${team.secondary}12`,
          border: `1px solid ${team.secondary}35`,
          boxShadow: `0 0 20px ${team.secondary}10`,
        }}
      >
        {/* Top highlight line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: `${team.secondary}50` }}
        />
        {/* Center divider (flip-clock feel) */}
        <div
          className="absolute inset-x-0 top-1/2 h-px opacity-20"
          style={{ backgroundColor: team.secondary }}
        />
        <span
          className="font-display text-4xl md:text-5xl font-900 italic tabular-nums leading-none"
          style={{ color: team.secondary }}
        >
          {pad(value)}
        </span>
      </div>
      <span className="font-mono-f1 text-xs tracking-widest uppercase text-white/30">
        {label}
      </span>
    </div>
  );
}

// ── Countdown widget ─────────────────────────────────────────────
function CountdownWidget({ race }: { race: Race }) {
  const { team } = useTeam();

  const raceTarget = new Date(`${race.date}T${race.time ?? "12:00:00"}`);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(raceTarget));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(raceTarget)), 1000);
    return () => clearInterval(id);
  }, [race.date, race.time]);

  const flag = countryFlags[race.Circuit.Location.country] || "🏁";
  const raceDate = new Date(race.date);
  const formattedDate = raceDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const units: { value: number; label: string }[] = [
    { value: timeLeft.days,    label: "Days"    },
    { value: timeLeft.hours,   label: "Hours"   },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <Card
      className="p-6 md:p-8 relative overflow-hidden mb-6"
      style={{ borderColor: `${team.secondary}40` }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${team.secondary}12` }}
      />
      {/* Top accent */}
      <div
        className="absolute top-0 inset-x-0 h-0.5"
        style={{ backgroundColor: team.secondary }}
      />

      <div className="relative">
        {/* Label */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="inline-flex items-center gap-2 font-mono-f1 text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${team.secondary}20`,
              color: team.secondary,
              border: `1px solid ${team.secondary}40`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: team.secondary }}
            />
            Countdown to Race Day
          </span>
        </div>

        {/* Race info */}
        <div className="mb-6">
          <p
            className="font-mono-f1 text-xs tracking-widest uppercase mb-1"
            style={{ color: `${team.secondary}80` }}
          >
            Round {race.round} · {flag} {race.Circuit.Location.country}
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-900 italic uppercase leading-tight">
            {race.raceName}
          </h3>
          <p className="text-white/40 text-sm mt-1">
            {race.Circuit.circuitName} · {formattedDate}
            {race.time && (
              <span className="ml-2 font-mono-f1">
                · {new Date(`${race.date}T${race.time}`).toLocaleTimeString("en-US", {
                  hour: "numeric", minute: "2-digit", timeZoneName: "short",
                })}
              </span>
            )}
          </p>
        </div>

        {/* Timer tiles */}
        <div className="flex items-start justify-center md:justify-start gap-3 md:gap-4">
          {units.map(({ value, label }, i) => (
            <div key={label} className="flex items-start gap-3 md:gap-4">
              <CountdownTile value={value} label={label} />
              {i < units.length - 1 && (
                <span
                  className="font-display text-3xl font-900 italic mt-5 leading-none select-none"
                  style={{ color: `${team.secondary}40` }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Main page component ───────────────────────────────────────────
export default function RacesClient({ races }: Props) {
  const { team } = useTeam();

  const now = new Date();
  const nextRaceIndex = races.findIndex((r) => new Date(r.date) >= now);
  const nextRace = nextRaceIndex !== -1 ? races[nextRaceIndex] : null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Race Calendar"
        subtitle={`${new Date().getFullYear()} Formula 1 Season — ${races.length} Grands Prix`}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">

        {nextRace && (
          <div className="mb-10">
            {/* ── Countdown ── */}
            <CountdownWidget race={nextRace} />

            {/* ── Next Race card ── */}
            <SectionHeading>Next Race</SectionHeading>
            {(() => {
              const { day, month, year } = formatDate(nextRace.date);
              const flag = countryFlags[nextRace.Circuit.Location.country] || "🏁";
              return (
                <Card
                  className="p-6 relative overflow-hidden"
                  style={{ borderColor: `${team.secondary}60` }}
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `radial-gradient(circle at 80% 50%, ${team.secondary}, transparent 60%)`,
                    }}
                  />
                  <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    <div
                      className="text-center w-24 flex-shrink-0 rounded-lg p-3"
                      style={{
                        backgroundColor: `${team.secondary}20`,
                        border: `1px solid ${team.secondary}40`,
                      }}
                    >
                      <p className="font-mono-f1 text-3xl font-bold" style={{ color: team.secondary }}>
                        {day}
                      </p>
                      <p className="font-display text-sm font-700 tracking-widest" style={{ color: team.secondary }}>
                        {month}
                      </p>
                      <p className="font-mono-f1 text-xs text-white/40">{year}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono-f1 text-xs tracking-widest uppercase mb-1" style={{ color: team.secondary }}>
                        Round {nextRace.round}
                      </p>
                      <p className="font-display text-3xl font-900 italic uppercase">{nextRace.raceName}</p>
                      <p className="text-white/60 mt-1">
                        {flag} {nextRace.Circuit.circuitName} · {nextRace.Circuit.Location.locality},{" "}
                        {nextRace.Circuit.Location.country}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-f1 text-xs tracking-widest uppercase"
                        style={{
                          backgroundColor: `${team.secondary}25`,
                          color: team.secondary,
                          border: `1px solid ${team.secondary}50`,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: team.secondary }}
                        />
                        Upcoming
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })()}
          </div>
        )}

        {/* ── Full calendar ── */}
        <SectionHeading>Full Calendar</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {races.map((race, i) => {
            const { day, month } = formatDate(race.date);
            const status = getRaceStatus(race.date);
            const flag = countryFlags[race.Circuit.Location.country] || "🏁";
            const isNext = i === nextRaceIndex;

            return (
              <Card
                key={race.round}
                className={`p-4 card-hover relative overflow-hidden ${status === "past" ? "opacity-60" : ""}`}
                style={isNext ? { borderColor: `${team.secondary}50` } : undefined}
              >
                {isNext && (
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: team.secondary }}
                  />
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="text-center w-14 flex-shrink-0 rounded p-2"
                    style={{
                      backgroundColor: status === "past"
                        ? "rgba(255,255,255,0.05)"
                        : `${team.secondary}15`,
                    }}
                  >
                    <p
                      className="font-mono-f1 text-2xl font-bold leading-none"
                      style={{ color: status === "past" ? "rgba(255,255,255,0.4)" : team.secondary }}
                    >
                      {day}
                    </p>
                    <p
                      className="font-display text-xs font-700 tracking-widest mt-0.5"
                      style={{ color: status === "past" ? "rgba(255,255,255,0.3)" : team.secondary }}
                    >
                      {month}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-f1 text-xs text-white/30 uppercase tracking-widest">Rd {race.round}</p>
                    <p className="font-display text-base font-700 uppercase italic leading-tight truncate">
                      {race.raceName.replace("Grand Prix", "GP")}
                    </p>
                    <p className="text-white/40 text-xs mt-1 truncate">
                      {flag} {race.Circuit.Location.locality}
                    </p>
                  </div>
                  {status === "past" && (
                    <span className="text-xs text-white/20 font-mono-f1 flex-shrink-0">✓</span>
                  )}
                  {status === "next" && (
                    <span
                      className="w-2 h-2 rounded-full animate-pulse flex-shrink-0 mt-1"
                      style={{ backgroundColor: team.secondary }}
                    />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
