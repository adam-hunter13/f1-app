import { getDriverProfile, getDriverSeasonStats, getDriverResults } from "@/lib/api";
import { fetchDriverPhoto } from "@/lib/driverPhotos";
import DriverProfileClient from "@/components/DriverProfileClient";
import { notFound } from "next/navigation";

interface Props {
  params: { driverId: string };
}

export default async function DriverProfilePage({ params }: Props) {
  const profile = await getDriverProfile(params.driverId).catch(() => null);
  if (!profile) return notFound();

  const [seasonStats, currentResults, photo] = await Promise.all([
    getDriverSeasonStats(params.driverId).catch(() => []),
    getDriverResults(params.driverId, "current").catch(() => []),
    fetchDriverPhoto(params.driverId).catch(() => null),
  ]);

  return (
    <DriverProfileClient
      profile={profile}
      seasonStats={seasonStats}
      currentResults={currentResults}
      photo={photo}
    />
  );
}
