"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Team, DEFAULT_TEAM, getTeamById } from "@/lib/teams";

interface TeamContextType {
  team: Team;
  setTeamById: (id: string) => void;
}

const TeamContext = createContext<TeamContextType>({
  team: DEFAULT_TEAM,
  setTeamById: () => {},
});

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<Team>(DEFAULT_TEAM);

  useEffect(() => {
    const saved = localStorage.getItem("f1-team");
    if (saved) setTeam(getTeamById(saved));
  }, []);

  const setTeamById = (id: string) => {
    const t = getTeamById(id);
    setTeam(t);
    localStorage.setItem("f1-team", id);
  };

  return (
    <TeamContext.Provider value={{ team, setTeamById }}>
      <style>{`
        :root {
          --team-primary: ${team.primary};
          --team-secondary: ${team.secondary};
          --team-accent: ${team.accent};
          --team-text: ${team.text};
        }
      `}</style>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
