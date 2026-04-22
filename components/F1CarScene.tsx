"use client";

import Image from "next/image";

const BASE =
  "https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026";

const CAR_SLUGS: Record<string, string> = {
  red_bull:      "redbullracing",
  ferrari:       "ferrari",
  mclaren:       "mclaren",
  mercedes:      "mercedes",
  aston_martin:  "astonmartin",
  alpine:        "alpine",
  haas:          "haasf1team",
  williams:      "williams",
  rb:            "racingbulls",
  "kick-sauber": "audi",
  audi:          "audi",
  cadillac:      "cadillac",
};

interface Props {
  teamId: string;
  secondary: string;
}

export default function F1CarScene({ teamId }: Props) {
  const slug = CAR_SLUGS[teamId] ?? "mclaren";
  const src = `${BASE}/${slug}/2026${slug}carright.webp`;

  return (
    <Image
      src={src}
      alt={`${teamId} 2026 F1 car`}
      width={512}
      height={224}
      className="w-full h-auto"
      priority
    />
  );
}
