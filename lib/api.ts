const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchF1<T>(path: string): Promise<T> {
  const url = `${BASE_URL}/${path.replace(/^\//, "")}.json`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("F1 API URL:", url); // 👈 add this
    throw new Error(`F1 API error: ${res.status}`);
  }

  const data = await res.json();
  return data.MRData as T;
}

// Types
export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    url: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code: string;
    permanentNumber: string;
  };
  Constructors: Array<{ constructorId: string; name: string }>;
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export interface Race {
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: { locality: string; country: string };
  };
  Results?: RaceResult[];
}

export interface RaceResult {
  position: string;
  points: string;
  number: string;
  grid: string;
  laps: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
    permanentNumber: string;
    nationality: string;
  };
  Constructor: { constructorId: string; name: string };
  Time?: { time: string };
  status: string;
  FastestLap?: { rank: string; lap: string; Time: { time: string } };
}

export interface QualifyingResult {
  number: string;
  position: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
    permanentNumber: string;
  };
  Constructor: { constructorId: string; name: string };
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface QualifyingRace {
  round: string;
  raceName: string;
  date: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: { locality: string; country: string };
  };
  QualifyingResults?: QualifyingResult[];
}

export interface DriverProfile {
  driverId: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  code: string;
  permanentNumber: string;
  url: string;
}

export interface DriverSeasonStat {
  season: string;
  position: string;
  points: string;
  wins: string;
  Constructor: { constructorId: string; name: string };
}

// Fetch driver standings for a season
export async function getDriverStandings(season = "current") {
  const data = await fetchF1<any>(`${season}/driverStandings`);
  const list =
    data.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  return list as DriverStanding[];
}

// Fetch constructor standings for a season
export async function getConstructorStandings(season = "current") {
  const data = await fetchF1<any>(`${season}/constructorStandings`);
  const list =
    data.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  return list as ConstructorStanding[];
}

// Fetch full race schedule for a season
export async function getRaceSchedule(season = "current") {
  const data = await fetchF1<any>(`/${season}`);
  return (data.RaceTable?.Races ?? []) as Race[];
}

// Fetch results for a specific race
export async function getRaceResults(season: string, round: string) {
  const data = await fetchF1<any>(`/${season}/${round}/results`);
  const race = data.RaceTable?.Races?.[0];
  return race as Race | undefined;
}

// Fetch all race results for a season (summary - winner only per race)
export async function getSeasonResults(season: string) {
  const data = await fetchF1<any>(`/${season}/results/1`);
  return (data.RaceTable?.Races ?? []) as Race[];
}

// Fetch qualifying results for a specific race
export async function getQualifyingResults(season: string, round: string) {
  const data = await fetchF1<any>(`/${season}/${round}/qualifying`);
  return (data.RaceTable?.Races?.[0] ?? null) as QualifyingRace | null;
}

// Fetch all qualifying results for a season
export async function getSeasonQualifying(season: string) {
  const data = await fetchF1<any>(`/${season}/qualifying`);
  return (data.RaceTable?.Races ?? []) as QualifyingRace[];
}

// Fetch all drivers for a season
export async function getSeasonDrivers(season = "current") {
  const data = await fetchF1<any>(`/${season}/drivers`);
  return (data.DriverTable?.Drivers ?? []) as DriverProfile[];
}

// Fetch a single driver's profile
export async function getDriverProfile(driverId: string) {
  const data = await fetchF1<any>(`/drivers/${driverId}`);
  return (data.DriverTable?.Drivers?.[0] ?? null) as DriverProfile | null;
}

// Fetch a driver's season-by-season standings history
export async function getDriverSeasonStats(driverId: string) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - i);
  const stats: DriverSeasonStat[] = [];

  for (const year of years) {
    try {
      const data = await fetchF1<any>(`${year}/drivers/${driverId}/driverStandings`);
      const list = data.StandingsTable?.StandingsLists?.[0];
      if (!list) continue;
      stats.push({
        season: list.season,
        position: list.DriverStandings?.[0]?.position ?? "-",
        points: list.DriverStandings?.[0]?.points ?? "0",
        wins: list.DriverStandings?.[0]?.wins ?? "0",
        Constructor: list.DriverStandings?.[0]?.Constructors?.[0] ?? { constructorId: "", name: "Unknown" },
      });
    } catch {
      // skip years where driver didn't race or API failed
    }
  }
  return stats;
}

// Fetch a driver's race results for a season
export async function getDriverResults(driverId: string, season = "current") {
  const data = await fetchF1<any>(`/${season}/drivers/${driverId}/results`);
  return (data.RaceTable?.Races ?? []) as Race[];
}
