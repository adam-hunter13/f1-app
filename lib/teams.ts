export interface Team {
  id: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  constructorId: string;
}

export const TEAMS: Team[] = [
  {
    id: "red_bull",
    name: "Oracle Red Bull Racing",
    shortName: "Red Bull",
    primary: "#1E1E2E",
    secondary: "#3671C6",
    accent: "#CC1E4A",
    text: "#ffffff",
    constructorId: "red_bull",
  },
  {
    id: "mercedes",
    name: "Mercedes-AMG Petronas",
    shortName: "Mercedes",
    primary: "#0F1923",
    secondary: "#00D2BE",
    accent: "#C0C0C0",
    text: "#ffffff",
    constructorId: "mercedes",
  },
  {
    id: "ferrari",
    name: "Scuderia Ferrari",
    shortName: "Ferrari",
    primary: "#1A0000",
    secondary: "#E8002D",
    accent: "#FFD700",
    text: "#ffffff",
    constructorId: "ferrari",
  },
  {
    id: "mclaren",
    name: "McLaren F1 Team",
    shortName: "McLaren",
    primary: "#1A1200",
    secondary: "#FF8000",
    accent: "#0090FF",
    text: "#ffffff",
    constructorId: "mclaren",
  },
  {
    id: "aston_martin",
    name: "Aston Martin Aramco",
    shortName: "Aston Martin",
    primary: "#0A1A12",
    secondary: "#229971",
    accent: "#CEDC00",
    text: "#ffffff",
    constructorId: "aston_martin",
  },
  {
    id: "alpine",
    name: "BWT Alpine F1 Team",
    shortName: "Alpine",
    primary: "#0A0A1A",
    secondary: "#0090FF",
    accent: "#FF69B4",
    text: "#ffffff",
    constructorId: "alpine",
  },
  {
    id: "williams",
    name: "Williams Racing",
    shortName: "Williams",
    primary: "#001A2E",
    secondary: "#005AFF",
    accent: "#FFFFFF",
    text: "#ffffff",
    constructorId: "williams",
  },
  {
    id: "haas",
    name: "MoneyGram Haas F1",
    shortName: "Haas",
    primary: "#1A0000",
    secondary: "#E8002D",
    accent: "#FFFFFF",
    text: "#ffffff",
    constructorId: "haas",
  },
  {
    id: "rb",
    name: "Visa Cash App RB",
    shortName: "Racing Bulls",
    primary: "#0A0A1E",
    secondary: "#6692FF",
    accent: "#00C5FF",
    text: "#ffffff",
    constructorId: "rb",
  },
  {
    id: "audi",
    name: "Audi F1 Team",
    shortName: "Audi",
    primary: "#000000",
    secondary: "#BB0A30",
    accent: "#FFFFFF",
    text: "#ffffff",
    constructorId: "audi",
  },

  {
    id: "cadillac",
    name: "Cadillac F1 Team",
    shortName: "Cadillac",
    primary: "#000000",
    secondary: "#C8102E",
    accent: "#D4AF37",
    text: "#ffffff",
    constructorId: "cadillac",
  },
];

export const DEFAULT_TEAM = TEAMS[2]; // Ferrari as default

export function getTeamById(id: string): Team {
  return TEAMS.find((t) => t.id === id) || DEFAULT_TEAM;
}
