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
  const now  = new Date();
  const race = new Date(dateStr);
  const diff = race.getTime() - now.getTime();
  if (diff < 0) return "past";
  if (diff < 7 * 24 * 60 * 60 * 1000) return "next";
  return "upcoming";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day:   d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year:  d.getFullYear().toString(),
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(total / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
  };
}

function CountdownTile({ value, label, highlight }: { value: number; label: string; highlight: boolean }) {
  const { team } = useTeam();
  const display  = pad(value);
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className="relative w-[72px] h-[72px] md:w-[86px] md:h-[86px] rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: highlight ? `${team.secondary}16` : "rgba(255,255,255,0.05)",
          border: `1px solid ${highlight ? `${team.secondary}40` : "rgba(255,255,255,0.08)"}`,
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: highlight ? `${team.secondary}60` : "rgba(255,255,255,0.1)" }}
        />
        {/* Centerline flip-clock divider */}
        <div className="absolute inset-x-3 top-1/2 h-px bg-black/30" />

        <span
          className="font-display text-[2.6rem] md:text-[3rem] font-900 italic tabular-nums leading-none select-none"
          style={{ color: highlight ? team.secondary : "rgba(255,255,255,0.8)" }}
        >
          {display}
        </span>
      </div>
      <span className="font-mono-f1 text-[9px] tracking-[0.22em] uppercase text-white/30">
        {label}
      </span>
    </div>
  );
}

function CountdownWidget({ race }: { race: Race }) {
  const { team } = useTeam();
  const raceTarget = new Date(`${race.date}T${race.time ?? "12:00:00"}`);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(raceTarget));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(raceTarget)), 1000);
    return () => clearInterval(id);
  }, [race.date, race.time]);

  const flag         = countryFlags[race.Circuit.Location.country] ?? "🏁";
  const formattedDate = new Date(race.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const units = [
    { value: timeLeft.days,    label: "Days",    highlight: timeLeft.days < 7  },
    { value: timeLeft.hours,   label: "Hours",   highlight: timeLeft.days === 0 },
    { value: timeLeft.minutes, label: "Mins",    highlight: timeLeft.days === 0 && timeLeft.hours < 1 },
    { value: timeLeft.seconds, label: "Secs",    highlight: timeLeft.days === 0 && timeLeft.hours < 1 },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.035)",
        border: `1px solid ${team.secondary}30`,
      }}
    >
      {/* Speed lines background */}
      <div className="absolute inset-0 speed-lines opacity-40" />
      {/* Glow */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${team.secondary}10` }}
      />
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] flex">
        <div className="flex-1" style={{ backgroundColor: team.secondary }} />
        <div className="w-1/3 opacity-30" style={{ backgroundColor: team.accent }} />
      </div>

      <div className="relative">
        {/* Live badge */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="inline-flex items-center gap-2 font-mono-f1 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: `${team.secondary}18`,
              color: team.secondary,
              border: `1px solid ${team.secondary}35`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: team.secondary }} />
            Next Race Countdown
          </span>
        </div>

        {/* Race name */}
        <div className="mb-7">
          <p
            className="font-mono-f1 text-[10px] tracking-[0.22em] uppercase mb-1.5"
            style={{ color: `${team.secondary}90` }}
          >
            Round {race.round} · {flag} {race.Circuit.Location.country}
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-900 italic uppercase leading-tight text-white">
            {race.raceName}
          </h3>
          <p className="text-white/35 text-sm mt-1.5 font-body">
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

        {/* Countdown tiles */}
        <div className="flex items-end justify-center md:justify-start gap-2 md:gap-3">
          {units.map(({ value, label, highlight }, i) => (
            <div key={label} className="flex items-center gap-2 md:gap-3">
              <CountdownTile value={value} label={label} highlight={highlight} />
              {i < units.length - 1 && (
                <span
                  className="font-display text-2xl md:text-3xl font-900 italic mb-7 leading-none select-none"
                  style={{ color: `${team.secondary}35` }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RacesClient({ races }: Props) {
  const { team } = useTeam();
  const now           = new Date();
  const nextRaceIndex = races.findIndex((r) => new Date(r.date) >= now);
  const nextRace      = nextRaceIndex !== -1 ? races[nextRaceIndex] : null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Race Calendar"
        subtitle={`${new Date().getFullYear()} Formula 1 Season — ${races.length} Grands Prix`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">

        {nextRace && (
          <div className="mb-10">
            <CountdownWidget race={nextRace} />

            <SectionHeading>Next Race</SectionHeading>
            {(() => {
              const { day, month, year } = formatDate(nextRace.date);
              const flag = countryFlags[nextRace.Circuit.Location.country] ?? "🏁";
              return (
                <Card
                  className="relative overflow-hidden"
                  style={{ borderColor: `${team.secondary}40` }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: `radial-gradient(ellipse at 80% 50%, ${team.secondary}, transparent 65%)` }}
                  />
                  <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: team.secondary }} />

                  <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
                    {/* Date block */}
                    <div
                      className="text-center w-20 flex-shrink-0 rounded-xl p-3"
                      style={{ backgroundColor: `${team.secondary}18`, border: `1px solid ${team.secondary}35` }}
                    >
                      <p className="font-mono-f1 text-2xl font-bold tabular-nums" style={{ color: team.secondary }}>{day}</p>
                      <p className="font-display text-xs font-800 tracking-[0.1em]" style={{ color: team.secondary }}>{month}</p>
                      <p className="font-mono-f1 text-[10px] text-white/30 mt-0.5">{year}</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase mb-1"
                        style={{ color: team.secondary }}
                      >
                        Round {nextRace.round}
                      </p>
                      <p className="font-display text-2xl md:text-3xl font-900 italic uppercase leading-tight text-white">
                        {nextRace.raceName}
                      </p>
                      <p className="text-white/45 text-sm mt-1.5 font-body">
                        {flag} {nextRace.Circuit.circuitName} · {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="flex-shrink-0">
                      <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-f1 text-[10px] tracking-[0.18em] uppercase"
                        style={{ backgroundColor: `${team.secondary}18`, color: team.secondary, border: `1px solid ${team.secondary}40` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: team.secondary }} />
                        Upcoming
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Full Calendar */}
        <SectionHeading>Full Calendar</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {races.map((race, i) => {
            const { day, month } = formatDate(race.date);
            const status  = getRaceStatus(race.date);
            const flag    = countryFlags[race.Circuit.Location.country] ?? "🏁";
            const isNext  = i === nextRaceIndex;

            return (
              <div
                key={race.round}
                className="card-hover relative overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: status === "past" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isNext ? `${team.secondary}40` : "rgba(255,255,255,0.06)"}`,
                  opacity: status === "past" ? 0.55 : 1,
                }}
              >
                {isNext && (
                  <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: team.secondary }} />
                )}

                <div className="p-4 flex items-start gap-4">
                  {/* Date block */}
                  <div
                    className="text-center w-12 flex-shrink-0 rounded-lg py-2"
                    style={{
                      backgroundColor: status === "past"
                        ? "rgba(255,255,255,0.04)"
                        : `${team.secondary}14`,
                    }}
                  >
                    <p
                      className="font-mono-f1 text-xl font-bold tabular-nums leading-none"
                      style={{ color: status === "past" ? "rgba(255,255,255,0.3)" : team.secondary }}
                    >
                      {day}
                    </p>
                    <p
                      className="font-display text-[9px] font-800 tracking-[0.1em] mt-0.5"
                      style={{ color: status === "past" ? "rgba(255,255,255,0.2)" : team.secondary }}
                    >
                      {month}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-f1 text-[9px] text-white/25 uppercase tracking-[0.18em]">Rd {race.round}</p>
                    <p className="font-display text-sm font-800 uppercase italic leading-tight mt-0.5 text-white/85 truncate">
                      {race.raceName.replace("Grand Prix", "GP")}
                    </p>
                    <p className="text-white/35 text-xs mt-1 font-body truncate">
                      {flag} {race.Circuit.Location.locality}
                    </p>
                  </div>

                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {status === "past" && (
                      <span className="font-mono-f1 text-[10px] text-white/20">✓</span>
                    )}
                    {isNext && (
                      <span
                        className="w-2 h-2 rounded-full animate-pulse inline-block"
                        style={{ backgroundColor: team.secondary, boxShadow: `0 0 8px ${team.secondary}80` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
