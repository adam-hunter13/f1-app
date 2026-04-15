"use client";

import { Race } from "@/lib/api";
import { useTeam } from "@/lib/TeamContext";
import { PageHeader, Card, SectionHeading } from "@/components/ui";

interface Props {
  races: Race[];
}

// Country → flag mapping
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
  if (diff < 7 * 24 * 60 * 60 * 1000) return "next"; // within 7 days
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

export default function RacesClient({ races }: Props) {
  const { team } = useTeam();

  const now = new Date();
  const nextRaceIndex = races.findIndex((r) => new Date(r.date) >= now);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Race Calendar"
        subtitle={`2025 Formula 1 Season — ${races.length} Grands Prix`}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Next race highlight */}
        {nextRaceIndex !== -1 && (
          <div className="mb-10">
            <SectionHeading>Next Race</SectionHeading>
            {(() => {
              const race = races[nextRaceIndex];
              const { day, month, year } = formatDate(race.date);
              const flag = countryFlags[race.Circuit.Location.country] || "🏁";
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
                      style={{ backgroundColor: `${team.secondary}20`, border: `1px solid ${team.secondary}40` }}
                    >
                      <p className="font-mono-f1 text-3xl font-bold" style={{ color: team.secondary }}>{day}</p>
                      <p className="font-display text-sm font-700 tracking-widest" style={{ color: team.secondary }}>{month}</p>
                      <p className="font-mono-f1 text-xs text-white/40">{year}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono-f1 text-xs tracking-widest uppercase mb-1" style={{ color: team.secondary }}>
                        Round {race.round}
                      </p>
                      <p className="font-display text-3xl font-900 italic uppercase">{race.raceName}</p>
                      <p className="text-white/60 mt-1">
                        {flag} {race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-f1 text-xs tracking-widest uppercase"
                        style={{ backgroundColor: `${team.secondary}25`, color: team.secondary, border: `1px solid ${team.secondary}50` }}
                      >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: team.secondary }} />
                        Upcoming
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Full calendar */}
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
