import { getDriverStandings, getConstructorStandings } from "@/lib/api";
import { fetchDriverPhotoBatch } from "@/lib/driverPhotos";
import DashboardClient from "@/components/DashboardClient";

export default async function HomePage() {
  const [drivers, constructors] = await Promise.all([
    getDriverStandings("current"),
    getConstructorStandings("current"),
  ]);

  // Fetch headshots for top 5 drivers
  const top5 = drivers.slice(0, 5);
  const photos = await fetchDriverPhotoBatch(
    top5.map((d) => ({ driverId: d.Driver.driverId, url: d.Driver.url }))
  );

  return <DashboardClient drivers={drivers} constructors={constructors} driverPhotos={photos} />;
}
