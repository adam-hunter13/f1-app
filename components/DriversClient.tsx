"use client";

import Link from "next/link";
import { useTeam } from "@/lib/TeamContext";
import { DriverProfile, DriverStanding } from "@/lib/api";
import { PageHeader, Card, Flag } from "@/components/ui";

interface Props {
  drivers: DriverProfile[];
  standings: DriverStanding[];
}

export default function DriversClient({ drivers, standings }: Props) {
  const { team } = useTeam();

  // Build a quick lookup: driverId → standing info
  const standingMap = new Map(
    standings.map((s) => [s.Driver.driverId, s])
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Drivers"
        subtitle={`${new Date().getFullYear()} Formula 1 Season — ${drivers.length} Drivers`}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {drivers.map((driver) => {
            const standing = standingMap.get(driver.driverId);
            const pos = standing ? parseInt(standing.position) : null;

            return (
              <Link key={driver.driverId} href={`/drivers/${driver.driverId}`}>
                <Card className="p-5 card-hover group cursor-pointer h-full relative overflow-hidden">
                  {/* Background number watermark */}
                  <div
                    className="absolute -right-3 -bottom-4 font-display font-900 italic leading-none select-none pointer-events-none"
                    style={{
                      fontSize: "7rem",
                      color: `${team.secondary}10`,
                    }}
                  >
                    {driver.permanentNumber || "?"}
                  </div>

                  {/* Top row: position + number */}
                  <div className="flex items-start justify-between mb-4 relative">
                    {pos !== null ? (
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded font-display font-800 italic text-lg leading-none"
                        style={{
                          color: pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : pos === 3 ? "#CD7F32" : team.secondary,
                          border: `1.5px solid ${pos <= 3 ? (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : "#CD7F32") : team.secondary}30`,
                          backgroundColor: `${pos <= 3 ? (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : "#CD7F32") : team.secondary}10`,
                        }}
                      >
                        {pos}
                      </div>
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                    <span
                      className="font-mono-f1 text-2xl font-bold leading-none"
                      style={{ color: `${team.secondary}60` }}
                    >
                      #{driver.permanentNumber || "—"}
                    </span>
                  </div>

                  {/* Driver name */}
                  <div className="relative mb-3">
                    <p className="font-display text-sm font-600 uppercase tracking-wide text-white/40">
                      {driver.givenName}
                    </p>
                    <p
                      className="font-display text-2xl font-900 italic uppercase leading-tight group-hover:opacity-80 transition-opacity"
                      style={{ color: team.text }}
                    >
                      {driver.familyName}
                    </p>
                    <p className="font-mono-f1 text-xs text-white/30 mt-0.5 tracking-widest">
                      {driver.code}
                    </p>
                  </div>

                  {/* Bottom: nationality + team */}
                  <div className="relative mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                    <p className="text-white/40 text-xs flex items-center gap-1.5">
                      <Flag nationality={driver.nationality} />
                      <span>{driver.nationality}</span>
                    </p>
                    {standing && (
                      <span
                        className="font-mono-f1 text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${team.secondary}15`, color: team.secondary }}
                      >
                        {standing.points} pts
                      </span>
                    )}
                  </div>

                  {/* Constructor */}
                  {standing?.Constructors?.[0] && (
                    <p className="text-white/25 text-xs mt-1.5 truncate relative">
                      {standing.Constructors[0].name}
                    </p>
                  )}

                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                    <span className="font-mono-f1 text-xs" style={{ color: team.secondary }}>→</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
