"use client";

import { useState, useEffect } from "react";
import { useTeam } from "@/lib/TeamContext";
import { Race, QualifyingRace } from "@/lib/api";
import { PageHeader, Card, SectionHeading, PosBadge, PointsChip } from "@/components/ui";

const SEASONS = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - i).toString());

const countryFlags: Record<string, string> = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦", USA: "🇺🇸", "United States": "🇺🇸",
  Italy: "🇮🇹", Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸",
  Austria: "🇦🇹", UK: "🇬🇧", "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱",
  Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
  Brazil: "🇧🇷", "Abu Dhabi": "🇦🇪", UAE: "🇦🇪", Qatar: "🇶🇦",
};

type ResultTab = "race" | "qualifying";
type ViewState = "season" | "detail";

export default function ResultsClient() {
  const { team } = useTeam();
  const [season, setSeason] = useState(new Date().getFullYear().toString());
  const [tab, setTab] = useState<ResultTab>("race");

  // Race state
  const [races, setRaces] = useState<Race[]>([]);
  const [raceDetail, setRaceDetail] = useState<Race | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [loadingRaceDetail, setLoadingRaceDetail] = useState(false);

  // Qualifying state
  const [qualifyingRaces, setQualifyingRaces] = useState<QualifyingRace[]>([]);
  const [qualifyingDetail, setQualifyingDetail] = useState<QualifyingRace | null>(null);
  const [selectedQualRound, setSelectedQualRound] = useState<string | null>(null);
  const [loadingQual, setLoadingQual] = useState(false);
  const [loadingQualDetail, setLoadingQualDetail] = useState(false);

  const [view, setView] = useState<ViewState>("season");

  // Load season race winners
  useEffect(() => {
    setLoadingRaces(true);
    setRaces([]);
    setRaceDetail(null);
    setSelectedRound(null);
    setView("season");
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/results/1.json`)
      .then((r) => r.json())
      .then((d) => setRaces(d.MRData?.RaceTable?.Races ?? []))
      .finally(() => setLoadingRaces(false));
  }, [season]);

  // Load season qualifying summaries
  useEffect(() => {
    setLoadingQual(true);
    setQualifyingRaces([]);
    setQualifyingDetail(null);
    setSelectedQualRound(null);
    setView("season");
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/qualifying.json?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        // API returns all qualifying results flat — dedupe by round
        const rawRaces = d.MRData?.RaceTable?.Races ?? [];
        const seen = new Set<string>();
        const deduped = rawRaces.filter((r: QualifyingRace) => {
          if (seen.has(r.round)) return false;
          seen.add(r.round);
          return true;
        });
        setQualifyingRaces(deduped);
      })
      .finally(() => setLoadingQual(false));
  }, [season]);

  // Load individual race detail
  useEffect(() => {
    if (!selectedRound) return;
    setLoadingRaceDetail(true);
    setRaceDetail(null);
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/${selectedRound}/results.json`)
      .then((r) => r.json())
      .then((d) => {
        setRaceDetail(d.MRData?.RaceTable?.Races?.[0] ?? null);
        setView("detail");
      })
      .finally(() => setLoadingRaceDetail(false));
  }, [selectedRound, season]);

  // Load individual qualifying detail
  useEffect(() => {
    if (!selectedQualRound) return;
    setLoadingQualDetail(true);
    setQualifyingDetail(null);
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/${selectedQualRound}/qualifying.json`)
      .then((r) => r.json())
      .then((d) => {
        setQualifyingDetail(d.MRData?.RaceTable?.Races?.[0] ?? null);
        setView("detail");
      })
      .finally(() => setLoadingQualDetail(false));
  }, [selectedQualRound, season]);

  const handleBack = () => {
    setView("season");
    setSelectedRound(null);
    setRaceDetail(null);
    setSelectedQualRound(null);
    setQualifyingDetail(null);
  };

  const switchTab = (t: ResultTab) => {
    setTab(t);
    setView("season");
    setSelectedRound(null);
    setSelectedQualRound(null);
    setRaceDetail(null);
    setQualifyingDetail(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Results" subtitle="Race by race — every winner, every point" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Season selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-mono-f1 text-xs tracking-widest uppercase text-white/40">Season</span>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className="px-4 py-1.5 rounded font-display font-700 text-sm tracking-widest uppercase transition-all"
                style={{
                  backgroundColor: season === s ? team.secondary : "rgba(255,255,255,0.05)",
                  color: season === s ? team.primary : "rgba(255,255,255,0.5)",
                  border: `1px solid ${season === s ? team.secondary : "transparent"}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Race / Qualifying tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-white/10">
          {(["race", "qualifying"] as ResultTab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className="px-5 py-3 font-display text-sm font-700 tracking-widest uppercase transition-all relative"
              style={{ color: tab === t ? team.secondary : "rgba(255,255,255,0.4)" }}
            >
              {t === "race" ? "Race" : "Qualifying"}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: team.secondary }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Back button */}
        {view === "detail" && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-sm font-display font-600 uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: team.secondary }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {season} Season
          </button>
        )}

        {/* ── RACE TAB — Season Grid ── */}
        {tab === "race" && view === "season" && (
          <>
            <SectionHeading>{season} Race Results</SectionHeading>
            {loadingRaces ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="shimmer h-28 rounded-xl" />
                ))}
              </div>
            ) : races.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="font-display text-2xl text-white/20 italic uppercase">No Results Yet</p>
                <p className="text-white/30 text-sm mt-2">This season may not have started yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {races.map((race) => {
                  const winner = race.Results?.[0];
                  const flag = countryFlags[race.Circuit.Location.country] || "🏁";
                  return (
                    <button key={race.round} onClick={() => setSelectedRound(race.round)} className="text-left">
                      <Card className="p-4 card-hover h-full group cursor-pointer"
                        style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="font-mono-f1 text-xs tracking-widest uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${team.secondary}20`, color: team.secondary }}>
                            Rd {race.round}
                          </span>
                          <span className="text-lg">{flag}</span>
                        </div>
                        <p className="font-display text-base font-800 italic uppercase leading-tight mb-1"
                          style={{ color: team.text }}>
                          {race.raceName.replace("Grand Prix", "GP")}
                        </p>
                        <p className="text-white/40 text-xs mb-3">
                          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                        </p>
                        {winner && (
                          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                            <span className="text-sm">🏆</span>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-700 uppercase truncate">
                                {winner.Driver.givenName}{" "}
                                <span style={{ color: team.secondary }}>{winner.Driver.familyName}</span>
                              </p>
                              <p className="text-white/30 text-xs truncate">{winner.Constructor.name}</p>
                            </div>
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-mono-f1 tracking-widest uppercase"
                            style={{ color: team.secondary }}>View Results →</span>
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── RACE TAB — Detail ── */}
        {tab === "race" && view === "detail" && (
          <>
            {loadingRaceDetail ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-xl" />
                ))}
              </div>
            ) : raceDetail ? (
              <>
                <RaceDetailHeader race={raceDetail} season={season} team={team} />
                <SectionHeading>Race Classification</SectionHeading>
                <div className="space-y-2">
                  {(raceDetail.Results ?? []).map((result, i) => {
                    const isFastestLap = result.FastestLap?.rank === "1";
                    return (
                      <Card key={result.position}
                        className="px-4 py-3 card-hover flex items-center gap-4"
                        style={i === 0 ? { borderColor: `${team.secondary}50` } : undefined}>
                        <PosBadge pos={parseInt(result.position)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-f1 text-xs text-white/30 w-8">{result.Driver.code}</span>
                            <p className="font-display text-base font-700 uppercase truncate">
                              {result.Driver.givenName}{" "}
                              <span style={{ color: i < 3 ? team.secondary : "inherit" }}>
                                {result.Driver.familyName}
                              </span>
                            </p>
                            {isFastestLap && (
                              <span className="text-xs px-1.5 py-0.5 rounded font-mono-f1 flex-shrink-0"
                                style={{ backgroundColor: "#9B59B620", color: "#9B59B6" }}>⚡ FL</span>
                            )}
                          </div>
                          <p className="text-white/40 text-xs truncate">{result.Constructor.name}</p>
                        </div>
                        <div className="text-right flex-shrink-0 hidden sm:block">
                          {result.Time ? (
                            <p className="font-mono-f1 text-sm text-white/60">{result.Time.time}</p>
                          ) : (
                            <p className="font-mono-f1 text-xs text-white/30">{result.status}</p>
                          )}
                          {isFastestLap && result.FastestLap?.Time && (
                            <p className="font-mono-f1 text-xs mt-0.5" style={{ color: "#9B59B6" }}>
                              {result.FastestLap.Time.time}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <PointsChip points={result.points} />
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <div className="mt-4 text-xs text-white/30 font-mono-f1">
                  ⚡ <span style={{ color: "#9B59B6" }}>FL</span> = Fastest Lap bonus point
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="font-display text-xl text-white/20 italic uppercase">Race not found</p>
              </Card>
            )}
          </>
        )}

        {/* ── QUALIFYING TAB — Season Grid ── */}
        {tab === "qualifying" && view === "season" && (
          <>
            <SectionHeading>{season} Qualifying Results</SectionHeading>
            {loadingQual ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="shimmer h-28 rounded-xl" />
                ))}
              </div>
            ) : qualifyingRaces.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="font-display text-2xl text-white/20 italic uppercase">No Qualifying Data</p>
                <p className="text-white/30 text-sm mt-2">This season may not have started yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualifyingRaces.map((race) => {
                  const pole = race.QualifyingResults?.[0];
                  const flag = countryFlags[race.Circuit.Location.country] || "🏁";
                  return (
                    <button key={race.round} onClick={() => setSelectedQualRound(race.round)} className="text-left">
                      <Card className="p-4 card-hover h-full group cursor-pointer"
                        style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="font-mono-f1 text-xs tracking-widest uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${team.secondary}20`, color: team.secondary }}>
                            Rd {race.round}
                          </span>
                          <span className="text-lg">{flag}</span>
                        </div>
                        <p className="font-display text-base font-800 italic uppercase leading-tight mb-1"
                          style={{ color: team.text }}>
                          {race.raceName.replace("Grand Prix", "GP")}
                        </p>
                        <p className="text-white/40 text-xs mb-3">
                          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                        </p>
                        {pole && (
                          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                            <span className="text-sm">🏎</span>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-700 uppercase truncate">
                                {pole.Driver.givenName}{" "}
                                <span style={{ color: team.secondary }}>{pole.Driver.familyName}</span>
                              </p>
                              <p className="text-white/30 text-xs font-mono-f1">
                                {pole.Q3 || pole.Q2 || pole.Q1}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-mono-f1 tracking-widest uppercase"
                            style={{ color: team.secondary }}>View Results →</span>
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── QUALIFYING TAB — Detail ── */}
        {tab === "qualifying" && view === "detail" && (
          <>
            {loadingQualDetail ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-xl" />
                ))}
              </div>
            ) : qualifyingDetail ? (
              <>
                <Card className="p-6 mb-6 relative overflow-hidden"
                  style={{ borderColor: `${team.secondary}40` }}>
                  <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: `radial-gradient(circle at 70% 50%, ${team.secondary}, transparent 60%)` }} />
                  <div className="relative">
                    <p className="font-mono-f1 text-xs tracking-widest uppercase mb-1"
                      style={{ color: team.secondary }}>
                      Round {qualifyingDetail.round} · {season} · Qualifying
                    </p>
                    <h2 className="font-display text-4xl font-900 italic uppercase">
                      {qualifyingDetail.raceName}
                    </h2>
                    <p className="text-white/50 mt-1">
                      {countryFlags[qualifyingDetail.Circuit.Location.country] || "🏁"}{" "}
                      {qualifyingDetail.Circuit.circuitName} · {qualifyingDetail.Circuit.Location.locality},{" "}
                      {qualifyingDetail.Circuit.Location.country}
                    </p>
                  </div>
                </Card>

                <SectionHeading>Qualifying Classification</SectionHeading>

                {/* Column headers */}
                <div className="hidden sm:grid px-4 pb-2 text-xs font-mono-f1 tracking-widest uppercase text-white/25"
                  style={{ gridTemplateColumns: "3rem 1fr 6rem 6rem 6rem 3rem" }}>
                  <span>Pos</span>
                  <span>Driver</span>
                  <span className="text-right">Q1</span>
                  <span className="text-right">Q2</span>
                  <span className="text-right">Q3</span>
                  <span className="text-right">#</span>
                </div>

                <div className="space-y-2">
                  {(qualifyingDetail.QualifyingResults ?? []).map((result, i) => (
                    <Card
                      key={result.position}
                      className="px-4 py-3 card-hover"
                      style={i === 0 ? { borderColor: `${team.secondary}50` } : undefined}
                    >
                      <div className="flex items-center gap-4">
                        <PosBadge pos={parseInt(result.position)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-f1 text-xs text-white/30 w-8">{result.Driver.code}</span>
                            <p className="font-display text-base font-700 uppercase truncate">
                              {result.Driver.givenName}{" "}
                              <span style={{ color: i < 3 ? team.secondary : "inherit" }}>
                                {result.Driver.familyName}
                              </span>
                            </p>
                          </div>
                          <p className="text-white/40 text-xs truncate">{result.Constructor.name}</p>
                        </div>

                        {/* Q times — desktop */}
                        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                          {[result.Q1, result.Q2, result.Q3].map((time, qi) => (
                            <div key={qi} className="w-24 text-right">
                              <p className={`font-mono-f1 text-sm ${
                                qi === 2 && result.Q3
                                  ? i === 0 ? "" : "text-white/70"
                                  : "text-white/25"
                              }`}
                              style={qi === 2 && i === 0 && result.Q3 ? { color: team.secondary } : undefined}>
                                {time || "—"}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Best time — mobile */}
                        <div className="sm:hidden flex-shrink-0">
                          <p className="font-mono-f1 text-sm"
                            style={{ color: i === 0 ? team.secondary : "rgba(255,255,255,0.6)" }}>
                            {result.Q3 || result.Q2 || result.Q1 || "—"}
                          </p>
                        </div>

                        <div className="flex-shrink-0 w-8 text-right">
                          <span className="font-mono-f1 text-xs text-white/25">#{result.number}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/25 font-mono-f1">
                  <span>Q1 → eliminates P16–P20</span>
                  <span>Q2 → eliminates P11–P15</span>
                  <span style={{ color: `${team.secondary}99` }}>Q3 → pole shootout</span>
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="font-display text-xl text-white/20 italic uppercase">Qualifying not found</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RaceDetailHeader({ race, season, team }: { race: Race; season: string; team: any }) {
  const flags: Record<string, string> = {
    Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", Bahrain: "🇧🇭",
    "Saudi Arabia": "🇸🇦", USA: "🇺🇸", "United States": "🇺🇸",
    Italy: "🇮🇹", Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸",
    Austria: "🇦🇹", UK: "🇬🇧", "United Kingdom": "🇬🇧",
    Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱",
    Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
    Brazil: "🇧🇷", "Abu Dhabi": "🇦🇪", UAE: "🇦🇪", Qatar: "🇶🇦",
  };
  return (
    <Card className="p-6 mb-6 relative overflow-hidden" style={{ borderColor: `${team.secondary}40` }}>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `radial-gradient(circle at 70% 50%, ${team.secondary}, transparent 60%)` }} />
      <div className="relative">
        <p className="font-mono-f1 text-xs tracking-widest uppercase mb-1" style={{ color: team.secondary }}>
          Round {race.round} · {season}
        </p>
        <h2 className="font-display text-4xl font-900 italic uppercase">{race.raceName}</h2>
        <p className="text-white/50 mt-1">
          {flags[race.Circuit.Location.country] || "🏁"}{" "}
          {race.Circuit.circuitName} · {race.Circuit.Location.locality},{" "}
          {race.Circuit.Location.country}
        </p>
        <p className="text-white/30 text-sm mt-1 font-mono-f1">
          {new Date(race.date).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>
    </Card>
  );
}
