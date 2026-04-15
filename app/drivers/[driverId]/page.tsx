import { getDriverProfile, getDriverSeasonStats, getDriverResults } from "@/lib/api";
import DriverProfileClient from "@/components/DriverProfileClient";
import { notFound } from "next/navigation";

interface Props {
  params: { driverId: string };
}

export default async function DriverProfilePage({ params }: Props) {
  const [profile, seasonStats, currentResults] = await Promise.all([
    getDriverProfile(params.driverId),
    getDriverSeasonStats(params.driverId),
    getDriverResults(params.driverId, "current"),
  ]);

  if (!profile) return notFound();

  return (
    <DriverProfileClient
      profile={profile}
      seasonStats={seasonStats}
      currentResults={currentResults}
    />
  );
}
