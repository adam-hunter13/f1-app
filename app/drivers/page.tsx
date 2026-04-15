import { getSeasonDrivers, getDriverStandings } from "@/lib/api";
import DriversClient from "@/components/DriversClient";

export default async function DriversPage() {
  const [drivers, standings] = await Promise.all([
    getSeasonDrivers("current"),
    getDriverStandings("current"),
  ]);

  return <DriversClient drivers={drivers} standings={standings} />;
}
