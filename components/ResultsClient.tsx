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
  const [season, setSeason]   = useState(new Date().getFullYear().toString());
  const [tab,    setTab]      = useState<ResultTab>("race");

  const [races,             setRaces]             = useState<Race[]>([]);
  const [raceDetail,        setRaceDetail]        = useState<Race | null>(null);
  const [selectedRound,     setSelectedRound]     = useState<string | null>(null);
  const [loadingRaces,      setLoadingRaces]      = useState(false);
  const [loadingRaceDetail, setLoadingRaceDetail] = useState(false);

  const [qualifyingRaces,   setQualifyingRaces]   = useState<QualifyingRace[]>([]);
  const [qualifyingDetail,  setQualifyingDetail]  = useState<QualifyingRace | null>(null);
  const [selectedQualRound, setSelectedQualRound] = useState<string | null>(null);
  const [loadingQual,       setLoadingQual]       = useState(false);
  const [loadingQualDetail, setLoadingQualDetail] = useState(false);

  const [view, setView] = useState<ViewState>("season");

  useEffect(() => {
    setLoadingRaces(true);
    setRaces([]); setRaceDetail(null); setSelectedRound(null); setView("season");
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/results/1.json`)
      .then((r) => r.json())
      .then((d) => setRaces(d.MRData?.RaceTable?.Races ?? []))
      .finally(() => setLoadingRaces(false));
  }, [season]);

  useEffect(() => {
    setLoadingQual(true);
    setQualifyingRaces([]); setQualifyingDetail(null); setSelectedQualRound(null); setView("season");
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/qualifying.json?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        const rawRaces = d.MRData?.RaceTable?.Races ?? [];
        const seen     = new Set<string>();
        const deduped  = rawRaces.filter((r: QualifyingRace) => {
          if (seen.has(r.round)) return false;
          seen.add(r.round);
          return true;
        });
        setQualifyingRaces(deduped);
      })
      .finally(() => setLoadingQual(false));
  }, [season]);

  useEffect(() => {
    if (!selectedRound) return;
    setLoadingRaceDetail(true); setRaceDetail(null);
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/${selectedRound}/results.json`)
      .then((r) => r.json())
      .then((d) => { setRaceDetail(d.MRData?.RaceTable?.Races?.[0] ?? null); setView("detail"); })
      .finally(() => setLoadingRaceDetail(false));
  }, [selectedRound, season]);

  useEffect(() => {
    if (!selectedQualRound) return;
    setLoadingQualDetail(true); setQualifyingDetail(null);
    fetch(`https://api.jolpi.ca/ergast/f1/${season}/${selectedQualRound}/qualifying.json`)
      .then((r) => r.json())
      .then((d) => { setQualifyingDetail(d.MRData?.RaceTable?.Races?.[0] ?? null); setView("detail"); })
      .finally(() => setLoadingQualDetail(false));
  }, [selectedQualRound, season]);

  const handleBack = () => {
    setView("season"); setSelectedRound(null); setRaceDetail(null);
    setSelectedQualRound(null); setQualifyingDetail(null);
  };

  const switchTab = (t: ResultTab) => {
    setTab(t); setView("season"); setSelectedRound(null);
    setSelectedQualRound(null); setRaceDetail(null); setQualifyingDetail(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Results" subtitle="Race by race — every winner, every point" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">

        {/* Season selector */}
        <div className="flex flex-wrap items-center gap-2.5 mb-7">
          <span className="font-mono-f1 text-[10px] tracking-[0.22em] uppercase text-white/30">Season</span>
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className="px-3.5 py-1.5 rounded-lg font-display font-700 text-sm tracking-[0.08em] uppercase transition-all"
                style={{
                  backgroundColor: season === s ? team.secondary : "rgba(255,255,255,0.05)",
                  color:           season === s ? team.primary   : "rgba(255,255,255,0.45)",
                  border:         `1px solid ${season === s ? team.secondary : "transparent"}`,
                  boxShadow:       season === s ? `0 0 14px ${team.secondary}30` : "none",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {(["race", "qualifying"] as ResultTab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className="px-5 py-3 font-display text-sm font-700 tracking-[0.1em] uppercase transition-all relative"
              style={{ color: tab === t ? team.secondary : "rgba(255,255,255,0.35)" }}
            >
              {t === "race" ? "Race" : "Qualifying"}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-sm"
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
            className="flex items-center gap-2 mb-6 text-sm font-display font-700 uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
            style={{ color: team.secondary }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {season} Season
          </button>
        )}

        {/* ── RACE — Season Grid ── */}
        {tab === "race" && view === "season" && (
          <>
            <SectionHeading>{season} Race Results</SectionHeading>
            {loadingRaces ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="shimmer h-28 rounded-2xl" />
                ))}
              </div>
            ) : races.length === 0 ? (
              <Card className="p-14 text-center">
                <p className="font-display text-2xl text-white/15 italic uppercase">No Results Yet</p>
                <p className="text-white/25 text-sm mt-2">This season may not have started yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {races.map((race) => {
                  const winner = race.Results?.[0];
                  const flag   = countryFlags[race.Circuit.Location.country] ?? "🏁";
                  return (
                    <button key={race.round} onClick={() => setSelectedRound(race.round)} className="text-left">
                      <div
                        className="card-hover h-full rounded-2xl group cursor-pointer p-5 relative overflow-hidden"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.035)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = `${team.secondary}35`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-md"
                            style={{ backgroundColor: `${team.secondary}18`, color: team.secondary }}
                          >
                            Rd {race.round}
                          </span>
                          <span className="text-lg leading-none">{flag}</span>
                        </div>
                        <p className="font-display text-base font-900 italic uppercase leading-tight mb-1 text-white/90">
                          {race.raceName.replace("Grand Prix", "GP")}
                        </p>
                        <p className="text-white/35 text-xs mb-4 font-body">
                          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                        </p>
                        {winner && (
                          <div className="flex items-center gap-2 pt-3 border-t border-white/[0.07]">
                            <span className="text-sm">🏆</span>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-800 uppercase truncate">
                                {winner.Driver.givenName}{" "}
                                <span style={{ color: team.secondary }}>{winner.Driver.familyName}</span>
                              </p>
                              <p className="text-white/25 text-xs truncate font-body">{winner.Constructor.name}</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200">
                          <span className="font-mono-f1 text-xs" style={{ color: team.secondary }}>→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── RACE — Detail ── */}
        {tab === "race" && view === "detail" && (
          <>
            {loadingRaceDetail ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-xl" />
                ))}
              </div>
            ) : raceDetail ? (
              <>
                <RaceDetailHeader race={raceDetail} season={season} team={team} />
                <SectionHeading>Race Classification</SectionHeading>
                <div className="space-y-1.5">
                  {(raceDetail.Results ?? []).map((result, i) => {
                    const isFastestLap = result.FastestLap?.rank === "1";
                    return (
                      <div
                        key={result.position}
                        className="row-hover flex items-center gap-3.5 px-4 py-3 rounded-xl"
                        style={{
                          backgroundColor: i === 0 ? `${team.secondary}0e` : "rgba(255,255,255,0.025)",
                          border: `1px solid ${i === 0 ? `${team.secondary}25` : "rgba(255,255,255,0.05)"}`,
                        }}
                      >
                        <PosBadge pos={parseInt(result.position)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono-f1 text-[10px] text-white/25 w-7">{result.Driver.code}</span>
                            <p className="font-display text-sm font-800 uppercase">
                              {result.Driver.givenName}{" "}
                              <span style={{ color: i < 3 ? team.secondary : "rgba(255,255,255,0.88)" }}>
                                {result.Driver.familyName}
                              </span>
                            </p>
                            {isFastestLap && (
                              <span
                                className="sector-badge"
                                style={{ backgroundColor: "#9B59B618", color: "#A78BFA", border: "1px solid #9B59B630" }}
                              >
                                ⚡ FL
                              </span>
                            )}
                          </div>
                          <p className="text-white/30 text-xs mt-0.5 font-body">{result.Constructor.name}</p>
                        </div>
                        <div className="text-right flex-shrink-0 hidden sm:block">
                          {result.Time ? (
                            <p className="font-mono-f1 text-sm text-white/50">{result.Time.time}</p>
                          ) : (
                            <p className="font-mono-f1 text-xs text-white/25">{result.status}</p>
                          )}
                          {isFastestLap && result.FastestLap?.Time && (
                            <p className="font-mono-f1 text-xs mt-0.5 text-purple-400">
                              {result.FastestLap.Time.time}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <PointsChip points={result.points} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[10px] text-white/20 font-mono-f1">
                  ⚡ <span className="text-purple-400/70">FL</span> = Fastest Lap bonus point
                </p>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="font-display text-xl text-white/15 italic uppercase">Race not found</p>
              </Card>
            )}
          </>
        )}

        {/* ── QUALIFYING — Season Grid ── */}
        {tab === "qualifying" && view === "season" && (
          <>
            <SectionHeading>{season} Qualifying Results</SectionHeading>
            {loadingQual ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="shimmer h-28 rounded-2xl" />
                ))}
              </div>
            ) : qualifyingRaces.length === 0 ? (
              <Card className="p-14 text-center">
                <p className="font-display text-2xl text-white/15 italic uppercase">No Qualifying Data</p>
                <p className="text-white/25 text-sm mt-2">This season may not have started yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {qualifyingRaces.map((race) => {
                  const pole = race.QualifyingResults?.[0];
                  const flag = countryFlags[race.Circuit.Location.country] ?? "🏁";
                  return (
                    <button key={race.round} onClick={() => setSelectedQualRound(race.round)} className="text-left">
                      <div
                        className="card-hover h-full rounded-2xl group cursor-pointer p-5 relative overflow-hidden"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.035)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = `${team.secondary}35`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-md"
                            style={{ backgroundColor: `${team.secondary}18`, color: team.secondary }}
                          >
                            Rd {race.round}
                          </span>
                          <span className="text-lg leading-none">{flag}</span>
                        </div>
                        <p className="font-display text-base font-900 italic uppercase leading-tight mb-1 text-white/90">
                          {race.raceName.replace("Grand Prix", "GP")}
                        </p>
                        <p className="text-white/35 text-xs mb-4 font-body">
                          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                        </p>
                        {pole && (
                          <div className="flex items-center gap-2 pt-3 border-t border-white/[0.07]">
                            <span className="text-sm">🏎</span>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-800 uppercase truncate">
                                {pole.Driver.givenName}{" "}
                                <span style={{ color: team.secondary }}>{pole.Driver.familyName}</span>
                              </p>
                              <p className="text-white/25 text-xs font-mono-f1">
                                {pole.Q3 ?? pole.Q2 ?? pole.Q1}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200">
                          <span className="font-mono-f1 text-xs" style={{ color: team.secondary }}>→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── QUALIFYING — Detail ── */}
        {tab === "qualifying" && view === "detail" && (
          <>
            {loadingQualDetail ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-xl" />
                ))}
              </div>
            ) : qualifyingDetail ? (
              <>
                <Card className="p-6 mb-6 relative overflow-hidden" style={{ borderColor: `${team.secondary}30` }}>
                  <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{ backgroundImage: `radial-gradient(ellipse at 70% 50%, ${team.secondary}, transparent 65%)` }}
                  />
                  <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: team.secondary }} />
                  <div className="relative">
                    <p
                      className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase mb-1.5"
                      style={{ color: team.secondary }}
                    >
                      Round {qualifyingDetail.round} · {season} · Qualifying
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-900 italic uppercase text-white">
                      {qualifyingDetail.raceName}
                    </h2>
                    <p className="text-white/40 mt-1.5 font-body text-sm">
                      {countryFlags[qualifyingDetail.Circuit.Location.country] ?? "🏁"}{" "}
                      {qualifyingDetail.Circuit.circuitName} · {qualifyingDetail.Circuit.Location.locality},{" "}
                      {qualifyingDetail.Circuit.Location.country}
                    </p>
                  </div>
                </Card>

                <SectionHeading>Qualifying Classification</SectionHeading>

                {/* Column headers */}
                <div
                  className="hidden sm:grid px-4 pb-2 font-mono-f1 text-[9px] tracking-[0.2em] uppercase text-white/20"
                  style={{ gridTemplateColumns: "2.5rem 1fr 5.5rem 5.5rem 5.5rem 2.5rem" }}
                >
                  <span>Pos</span>
                  <span>Driver</span>
                  <span className="text-right">Q1</span>
                  <span className="text-right">Q2</span>
                  <span className="text-right">Q3</span>
                  <span className="text-right">#</span>
                </div>

                <div className="space-y-1.5">
                  {(qualifyingDetail.QualifyingResults ?? []).map((result, i) => (
                    <div
                      key={result.position}
                      className="row-hover flex items-center gap-3.5 px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: i === 0 ? `${team.secondary}0e` : "rgba(255,255,255,0.025)",
                        border: `1px solid ${i === 0 ? `${team.secondary}25` : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      <PosBadge pos={parseInt(result.position)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-f1 text-[10px] text-white/25 w-7">{result.Driver.code}</span>
                          <p className="font-display text-sm font-800 uppercase">
                            {result.Driver.givenName}{" "}
                            <span style={{ color: i < 3 ? team.secondary : "rgba(255,255,255,0.88)" }}>
                              {result.Driver.familyName}
                            </span>
                          </p>
                        </div>
                        <p className="text-white/30 text-xs mt-0.5 font-body">{result.Constructor.name}</p>
                      </div>

                      {/* Q times desktop */}
                      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                        {[result.Q1, result.Q2, result.Q3].map((time, qi) => (
                          <div key={qi} className="w-[5.5rem] text-right">
                            <p
                              className="font-mono-f1 text-xs tabular-nums"
                              style={{
                                color: qi === 2 && i === 0 && result.Q3
                                  ? team.secondary
                                  : qi === 2 && result.Q3
                                    ? "rgba(255,255,255,0.6)"
                                    : "rgba(255,255,255,0.22)",
                              }}
                            >
                              {time ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Best time mobile */}
                      <div className="sm:hidden flex-shrink-0">
                        <p
                          className="font-mono-f1 text-sm tabular-nums"
                          style={{ color: i === 0 ? team.secondary : "rgba(255,255,255,0.55)" }}
                        >
                          {result.Q3 ?? result.Q2 ?? result.Q1 ?? "—"}
                        </p>
                      </div>

                      <div className="flex-shrink-0 w-8 text-right">
                        <span className="font-mono-f1 text-[10px] text-white/20">#{result.number}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-4 font-mono-f1 text-[10px] text-white/20">
                  <span>Q1 → elim. P16–P20</span>
                  <span>Q2 → elim. P11–P15</span>
                  <span style={{ color: `${team.secondary}80` }}>Q3 → pole shootout</span>
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="font-display text-xl text-white/15 italic uppercase">Qualifying not found</p>
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
    <Card className="p-6 mb-6 relative overflow-hidden" style={{ borderColor: `${team.secondary}30` }}>
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: `radial-gradient(ellipse at 70% 50%, ${team.secondary}, transparent 65%)` }}
      />
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: team.secondary }} />
      <div className="relative">
        <p className="font-mono-f1 text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: team.secondary }}>
          Round {race.round} · {season}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-900 italic uppercase text-white">{race.raceName}</h2>
        <p className="text-white/40 mt-1.5 font-body text-sm">
          {flags[race.Circuit.Location.country] ?? "🏁"}{" "}
          {race.Circuit.circuitName} · {race.Circuit.Location.locality},{" "}
          {race.Circuit.Location.country}
        </p>
        <p className="text-white/25 text-xs mt-1 font-mono-f1">
          {new Date(race.date).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>
    </Card>
  );
}
