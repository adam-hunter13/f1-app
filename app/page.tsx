import { getDriverStandings, getConstructorStandings } from "@/lib/api";
import DashboardClient from "@/components/DashboardClient";

export default async function HomePage() {
  const [drivers, constructors] = await Promise.all([
    getDriverStandings("current"),
    getConstructorStandings("current"),
  ]);

  return <DashboardClient drivers={drivers} constructors={constructors} />;
}
