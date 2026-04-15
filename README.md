# 🏎️ F1 Pit Wall

A Formula 1 dashboard built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Data is sourced from the free [Jolpica F1 API](https://jolpi.ca/) (Ergast successor) — no API key required.

---

## Features

- **Team Theming** — Pick your team and the entire app recolors to match
- **Dashboard** — Live driver and constructor championship standings with points bars
- **Races** — Full season calendar with next race highlighted
- **Results** — Browse any season (2015–2025), select a race, see the full classification including fastest lap

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Jolpica F1 API | F1 data (free, no key) |
| Google Fonts (Barlow Condensed, Barlow, Share Tech Mono) | Typography |

---

## API

All data comes from `https://api.jolpi.ca/ergast/f1/` — a free, public F1 data API with no authentication required. Data is cached with `next: { revalidate: 3600 }` (1 hour).

### Endpoints used

| Endpoint | Data |
|----------|------|
| `/{season}/driverStandings.json` | Driver championship standings |
| `/{season}/constructorStandings.json` | Constructor standings |
| `/{season}.json` | Race schedule |
| `/{season}/results/1.json` | Season winners (1 per race) |
| `/{season}/{round}/results.json` | Full race classification |

---

## Project Structure

```
app/
  layout.tsx          # Root layout with TeamProvider + Navbar
  page.tsx            # Dashboard (standings)
  races/page.tsx      # Race calendar
  results/page.tsx    # Results browser
  globals.css         # Global styles + CSS variables
components/
  Navbar.tsx          # Sticky nav with team selector
  DashboardClient.tsx # Standings UI
  RacesClient.tsx     # Calendar UI
  ResultsClient.tsx   # Results browser UI
  ui.tsx              # Shared UI primitives
lib/
  teams.ts            # All 10 F1 teams with color palettes
  TeamContext.tsx     # React context + CSS variable injection
  api.ts              # Typed Jolpica API wrapper
```

---

## Customization

To add more seasons to the results dropdown, edit the `SEASONS` array in `components/ResultsClient.tsx`.

Team colors can be updated in `lib/teams.ts` if liveries change.
# f1-app
# f1-app
