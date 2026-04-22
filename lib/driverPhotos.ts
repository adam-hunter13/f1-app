const BASE = "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026";

const DRIVER_PHOTOS: Record<string, string> = {
  // Red Bull
  max_verstappen: `${BASE}/redbullracing/maxver01/2026redbullracingmaxver01right.webp`,
  hadjar:         `${BASE}/redbullracing/isahad01/2026redbullracingisahad01right.webp`,

  // Ferrari
  leclerc:        `${BASE}/ferrari/chalec01/2026ferrarichalec01right.webp`,
  hamilton:       `${BASE}/ferrari/lewham01/2026ferrarilewham01right.webp`,

  // McLaren
  norris:         `${BASE}/mclaren/lannor01/2026mclarenlannor01right.webp`,
  piastri:        `${BASE}/mclaren/oscpia01/2026mclarenoscpia01right.webp`,

  // Mercedes
  russell:        `${BASE}/mercedes/georus01/2026mercedesgeorus01right.webp`,
  antonelli:      `${BASE}/mercedes/andant01/2026mercedesandant01right.webp`,

  // Aston Martin
  alonso:         `${BASE}/astonmartin/feralo01/2026astonmartinferalo01right.webp`,
  stroll:         `${BASE}/astonmartin/lanstr01/2026astonmartinlanstr01right.webp`,

  // Alpine
  gasly:          `${BASE}/alpine/piegas01/2026alpinepiegas01right.webp`,
  colapinto:      `${BASE}/alpine/fracol01/2026alpinefracol01right.webp`,

  // Haas
  ocon:           `${BASE}/haasf1team/estoco01/2026haasf1teamestoco01right.webp`,
  bearman:        `${BASE}/haasf1team/olibea01/2026haasf1teamolibea01right.webp`,

  // Williams
  sainz:          `${BASE}/williams/carsai01/2026williamscarsai01right.webp`,
  albon:          `${BASE}/williams/alealb01/2026williamsalealb01right.webp`,

  // Audi (Kick Sauber)
  hulkenberg:     `${BASE}/audi/nichul01/2026audinichul01right.webp`,
  bortoleto:      `${BASE}/audi/gabbor01/2026audigabbor01right.webp`,

  // Racing Bulls
  lawson:         `${BASE}/racingbulls/lialaw01/2026racingbullslialaw01right.webp`,
  arvid_lindblad: `${BASE}/racingbulls/arvlin01/2026racingbullsarvlin01right.webp`,

  // Cadillac
  perez:          `${BASE}/cadillac/serper01/2026cadillacserper01right.webp`,
  bottas:         `${BASE}/cadillac/valbot01/2026cadillacvalbot01right.webp`,
};

export function getDriverPhotoUrl(driverId: string): string | null {
  return DRIVER_PHOTOS[driverId] ?? null;
}

// Called with driverId directly
export async function fetchDriverPhoto(driverId: string): Promise<string | null> {
  return DRIVER_PHOTOS[driverId] ?? null;
}

export async function fetchDriverPhotoBatch(
  drivers: { driverId: string; url: string }[]
): Promise<Record<string, string | null>> {
  return Object.fromEntries(
    drivers.map((d) => [d.driverId, DRIVER_PHOTOS[d.driverId] ?? null])
  );
}
