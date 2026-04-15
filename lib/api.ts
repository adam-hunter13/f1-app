const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchF1<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}.json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`F1 API error: ${res.status}`);
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
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
  };
  Constructor: { constructorId: string; name: string };
  Time?: { time: string };
  status: string;
  FastestLap?: { rank: string; lap: string; Time: { time: string } };
}

// Fetch driver standings for a season
export async function getDriverStandings(season = "current") {
  const data = await fetchF1<any>(`/${season}/driverStandings`);
  const list =
    data.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  return list as DriverStanding[];
}

// Fetch constructor standings for a season
export async function getConstructorStandings(season = "current") {
  const data = await fetchF1<any>(`/${season}/constructorStandings`);
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
