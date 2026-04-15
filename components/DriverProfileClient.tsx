"use client";

import Link from "next/link";
import { useTeam } from "@/lib/TeamContext";
import { DriverProfile, DriverSeasonStat, Race } from "@/lib/api";
import { Card, Flag, PosBadge, SectionHeading } from "@/components/ui";

interface Props {
  profile: DriverProfile;
  seasonStats: DriverSeasonStat[];
  currentResults: Race[];
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  const { team } = useTeam();
  return (
    <Card className="p-4 text-center">
      <p
        className="font-display text-3xl font-900 italic leading-none mb-1"
        style={{ color: accent ? team.secondary : team.text }}
      >
        {value}
      </p>
      <p className="font-mono-f1 text-xs tracking-widest uppercase text-white/30">{label}</p>
    </Card>
  );
}

export default function DriverProfileClient({ profile, seasonStats, currentResults }: Props) {
  const { team } = useTeam();

  // Compute career totals from season stats
  const careerWins = seasonStats.reduce((sum, s) => sum + parseInt(s.wins || "0"), 0);
  const careerPoints = seasonStats.reduce((sum, s) => sum + parseFloat(s.points || "0"), 0);
  const championships = seasonStats.filter((s) => s.position === "1").length;
  const seasonsRaced = seasonStats.length;

  // Current season standing
  const currentSeason = seasonStats.find((s) => s.season === new Date().getFullYear().toString())
    ?? seasonStats[seasonStats.length - 1];

  // Age from DOB
  const dob = new Date(profile.dateOfBirth);
  const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  // Current season race results summary
  const raceWins = currentResults.filter((r) => r.Results?.[0]?.position === "1").length;
  const podiums = currentResults.filter((r) => {
    const pos = parseInt(r.Results?.[0]?.position ?? "99");
    return pos <= 3;
  }).length;
  const dnfs = currentResults.filter((r) => {
    const status = r.Results?.[0]?.status ?? "";
    return !status.includes("Finished") && !status.includes("Lap");
  }).length;

  return (
    <div className="animate-fade-in">
      {/* Hero header */}
      <div className="relative overflow-hidden py-12 px-4">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, ${team.secondary} 0px, ${team.secondary} 1px, transparent 1px, transparent 20px)`,
          }}
        />
        {/* Giant number watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 font-display font-900 italic leading-none select-none pointer-events-none flex items-center"
          style={{ fontSize: "20rem", color: `${team.secondary}06` }}
        >
          {profile.permanentNumber}
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href="/drivers"
            className="inline-flex items-center gap-2 mb-6 text-sm font-display font-600 uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: team.secondary }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Drivers
          </Link>

          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1">
              {/* Number badge */}
              <div className="flex items-center gap-3 mb-3">
                <div className="racing-stripe h-0.5 w-12" />
                <span
                  className="font-mono-f1 text-sm font-bold tracking-widest"
                  style={{ color: team.secondary }}
                >
                  #{profile.permanentNumber}
                </span>
                <span className="font-mono-f1 text-xs tracking-widest text-white/30">· {profile.code}</span>
              </div>

              <p className="font-display text-2xl font-400 uppercase tracking-widest text-white/60">
                {profile.givenName}
              </p>
              <h1
                className="font-display text-6xl md:text-8xl font-900 italic uppercase leading-none"
                style={{ color: team.text }}
              >
                {profile.familyName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <p className="text-white/50 flex items-center gap-2 text-sm">
                  <Flag nationality={profile.nationality} />
                  {profile.nationality}
                </p>
                <span className="text-white/20">·</span>
                <p className="text-white/50 text-sm">
                  Born {dob.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <span className="text-white/20">·</span>
                <p className="text-white/50 text-sm">Age {age}</p>
                {currentSeason?.Constructor && (
                  <>
                    <span className="text-white/20">·</span>
                    <p className="text-sm" style={{ color: team.secondary }}>
                      {currentSeason.Constructor.name}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Current championship position */}
            {currentSeason && (
              <div
                className="flex-shrink-0 text-center p-6 rounded-xl border"
                style={{ borderColor: `${team.secondary}40`, backgroundColor: `${team.secondary}10` }}
              >
                <p className="font-mono-f1 text-xs tracking-widest uppercase text-white/30 mb-1">
                  {currentSeason.season} Championship
                </p>
                <p
                  className="font-display text-6xl font-900 italic leading-none"
                  style={{ color: team.secondary }}
                >
                  P{currentSeason.position}
                </p>
                <p className="font-mono-f1 text-lg mt-1 text-white/60">
                  {currentSeason.points} pts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-10">
        {/* Career stats */}
        <div>
          <SectionHeading>Career Stats</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox label="Seasons" value={seasonsRaced} />
            <StatBox label="Race Wins" value={careerWins} accent />
            <StatBox label="Championships" value={championships} accent={championships > 0} />
            <StatBox label="Career Points" value={Math.round(careerPoints)} />
          </div>
        </div>

        {/* Current season summary */}
        {currentResults.length > 0 && (
          <div>
            <SectionHeading>{new Date().getFullYear()} Season</SectionHeading>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatBox label="Wins" value={raceWins} accent={raceWins > 0} />
              <StatBox label="Podiums" value={podiums} accent={podiums > 0} />
              <StatBox label="DNFs" value={dnfs} />
            </div>

            {/* Race by race results */}
            <div className="space-y-2">
              {currentResults.map((race) => {
                const result = race.Results?.[0];
                if (!result) return null;
                const pos = parseInt(result.position);
                const isFastestLap = result.FastestLap?.rank === "1";
                return (
                  <Card key={race.round} className="px-4 py-3 flex items-center gap-4">
                    <PosBadge pos={pos} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-700 italic uppercase truncate">
                        {race.raceName.replace("Grand Prix", "GP")}
                      </p>
                      <p className="text-white/30 text-xs">{race.Circuit.Location.locality}</p>
                    </div>
                    <div className="hidden sm:block text-right flex-shrink-0">
                      {result.Time ? (
                        <p className="font-mono-f1 text-sm text-white/50">{result.Time.time}</p>
                      ) : (
                        <p className="font-mono-f1 text-xs text-white/30">{result.status}</p>
                      )}
                    </div>
                    {isFastestLap && (
                      <span
                        className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono-f1"
                        style={{ backgroundColor: "#9B59B620", color: "#9B59B6" }}
                      >
                        ⚡ FL
                      </span>
                    )}
                    <div className="flex-shrink-0">
                      <span
                        className="font-mono-f1 text-sm px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${team.secondary}15`, color: team.secondary }}
                      >
                        {result.points} pts
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Season-by-season history */}
        {seasonStats.length > 0 && (
          <div>
            <SectionHeading>Season History</SectionHeading>
            <div className="space-y-2">
              {[...seasonStats].reverse().map((stat) => {
                const isChamp = stat.position === "1";
                return (
                  <Card
                    key={stat.season}
                    className="px-4 py-3 flex items-center gap-4"
                    style={isChamp ? { borderColor: `#FFD70040` } : undefined}
                  >
                    <div
                      className="flex-shrink-0 w-16 text-center font-mono-f1 text-sm"
                      style={{ color: team.secondary }}
                    >
                      {stat.season}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-700 uppercase truncate text-white/80">
                        {stat.Constructor.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {isChamp && (
                        <span className="text-sm" title="World Champion">🏆</span>
                      )}
                      <span
                        className="font-mono-f1 text-sm px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${team.secondary}15`, color: team.secondary }}
                      >
                        {stat.points} pts
                      </span>
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center font-display font-800 italic text-base leading-none flex-shrink-0"
                        style={{
                          color: stat.position === "1" ? "#FFD700" : stat.position === "2" ? "#C0C0C0" : stat.position === "3" ? "#CD7F32" : "rgba(255,255,255,0.4)",
                          border: `1px solid ${stat.position === "1" ? "#FFD70030" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        P{stat.position}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Wikipedia link */}
        {profile.url && (
          <div className="text-center pt-4">
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono-f1 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: team.secondary }}
            >
              View on Wikipedia →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
