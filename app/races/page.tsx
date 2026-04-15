import { getRaceSchedule } from "@/lib/api";
import RacesClient from "@/components/RacesClient";

export default async function RacesPage() {
  const races = await getRaceSchedule("current");
  return <RacesClient races={races} />;
}
