"use client";

import { useTeam } from "@/lib/TeamContext";
import { DriverStanding, ConstructorStanding } from "@/lib/api";
import {
  SectionHeading,
  PosBadge,
  PointsChip,
  Flag,
  Card,
  PageHeader,
} from "@/components/ui";

interface Props {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
}

export default function DashboardClient({ drivers, constructors }: Props) {
  const { team } = useTeam();

  const topDriver = drivers[0];
  const topConstructor = constructors[0];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Box Box"
        subtitle={`${new Date().getFullYear()} Formula 1 World Championship — Live Standings`}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Hero cards */}
        {topDriver && topConstructor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Championship Leader - Driver */}
            <Card className="p-6 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                style={{ backgroundColor: team.secondary }}
              />
              <p className="font-mono-f1 text-xs tracking-widest uppercase mb-3" style={{ color: team.secondary }}>
                🏆 Driver's Championship Leader
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-4xl font-900 italic uppercase leading-none">
                    {topDriver.Driver.givenName}
                  </p>
                  <p
                    className="font-display text-5xl font-900 italic uppercase leading-none"
                    style={{ color: team.secondary }}
                  >
                    {topDriver.Driver.familyName}
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    {topDriver.Constructors[0]?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-mono-f1 text-4xl font-bold"
                    style={{ color: team.secondary }}
                  >
                    {topDriver.points}
                  </p>
                  <p className="text-white/40 text-xs font-mono-f1 uppercase tracking-widest">points</p>
                  <p className="text-white/40 text-xs mt-1">{topDriver.wins} wins</p>
                </div>
              </div>
            </Card>

            {/* Championship Leader - Constructor */}
            <Card className="p-6 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                style={{ backgroundColor: team.accent }}
              />
              <p className="font-mono-f1 text-xs tracking-widest uppercase mb-3" style={{ color: team.accent }}>
                🏆 Constructor's Championship Leader
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p
                    className="font-display text-5xl font-900 italic uppercase leading-none"
                    style={{ color: team.accent }}
                  >
                    {topConstructor.Constructor.name}
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    <Flag nationality={topConstructor.Constructor.nationality} />{" "}
                    {topConstructor.Constructor.nationality}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono-f1 text-4xl font-bold" style={{ color: team.accent }}>
                    {topConstructor.points}
                  </p>
                  <p className="text-white/40 text-xs font-mono-f1 uppercase tracking-widest">points</p>
                  <p className="text-white/40 text-xs mt-1">{topConstructor.wins} wins</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Two column standings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drivers Championship */}
          <div>
            <SectionHeading>Drivers Championship</SectionHeading>
            <div className="space-y-2">
              {drivers.map((d, i) => (
                <Card
                  key={d.Driver.driverId}
                  className={`p-4 card-hover flex items-center gap-4 ${
                    i === 0 ? "border-opacity-40" : ""
                  }`}
                  style={
                    i === 0
                      ? { borderColor: `${team.secondary}60` }
                      : undefined
                  }
                >
                  <PosBadge pos={parseInt(d.position)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base font-700 uppercase tracking-wide truncate">
                      <span className="text-white/40 mr-1 text-sm">{d.Driver.code}</span>{" "}
                      {d.Driver.givenName}{" "}
                      <span style={{ color: i < 3 ? team.secondary : "inherit" }}>
                        {d.Driver.familyName}
                      </span>
                    </p>
                    <p className="text-white/40 text-xs truncate">
                      <Flag nationality={d.Driver.nationality} />{" "}
                      {d.Constructors[0]?.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <PointsChip points={d.points} />
                    {d.wins !== "0" && (
                      <p className="text-white/30 text-xs mt-1">{d.wins}W</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Constructors Championship */}
          <div>
            <SectionHeading>Constructors Championship</SectionHeading>
            <div className="space-y-2">
              {constructors.map((c, i) => {
                const pct = Math.round(
                  (parseInt(c.points) / parseInt(constructors[0].points)) * 100
                );
                return (
                  <Card
                    key={c.Constructor.constructorId}
                    className="p-4 card-hover"
                    style={
                      i === 0
                        ? { borderColor: `${team.secondary}60` }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <PosBadge pos={parseInt(c.position)} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base font-700 uppercase tracking-wide truncate">
                          <span style={{ color: i < 3 ? team.secondary : "inherit" }}>
                            {c.Constructor.name}
                          </span>
                        </p>
                        <p className="text-white/40 text-xs">
                          <Flag nationality={c.Constructor.nationality} />{" "}
                          {c.Constructor.nationality}
                        </p>
                      </div>
                      <PointsChip points={c.points} />
                    </div>
                    {/* Points bar */}
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: i === 0 ? team.secondary : team.accent,
                          opacity: i === 0 ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
