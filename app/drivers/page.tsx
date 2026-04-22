import { getSeasonDrivers, getDriverStandings } from "@/lib/api";
import { fetchDriverPhotoBatch } from "@/lib/driverPhotos";
import DriversClient from "@/components/DriversClient";

export default async function DriversPage() {
  const [drivers, standings] = await Promise.all([
    getSeasonDrivers("current"),
    getDriverStandings("current"),
  ]);

  const raceDriverIds = new Set(standings.map((s) => s.Driver.driverId));
  const raceDrivers = drivers.filter((d) => raceDriverIds.has(d.driverId));

  const photos = await fetchDriverPhotoBatch(
    raceDrivers.map((d) => ({ driverId: d.driverId, url: d.url }))
  );

  return <DriversClient drivers={raceDrivers} standings={standings} driverPhotos={photos} />;
}