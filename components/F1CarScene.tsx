"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Livery {
  body: string;
  nose: string;
  frontWing: string;
  sidepods: string;
  sidepodAccent: string;
  cockpit: string;
  engineCover: string;
  engineCoverAccent: string;
  rearWingLo: string;
  rearWingHi: string;
  endplates: string;
  halo: string;
  rimColor: string;
}

const CF = "#0a0a0a";

const LIVERIES: Record<string, Livery> = {
  red_bull: {
    body:               "#1B1F6E",
    nose:               "#0E1244",
    frontWing:          "#1B1F6E",
    sidepods:           "#1B1F6E",
    sidepodAccent:      "#CC1E4A",
    cockpit:            "#0E1244",
    engineCover:        "#1B1F6E",
    engineCoverAccent:  "#CC1E4A",
    rearWingLo:         "#1B1F6E",
    rearWingHi:         "#CC1E4A",
    endplates:          "#0E1244",
    halo:               CF,
    rimColor:           "#d4af37",
  },
  ferrari: {
    body:               "#DC0000",
    nose:               "#A80000",
    frontWing:          "#DC0000",
    sidepods:           "#DC0000",
    sidepodAccent:      "#FFD700",
    cockpit:            "#1a0000",
    engineCover:        "#DC0000",
    engineCoverAccent:  "#FFD700",
    rearWingLo:         "#DC0000",
    rearWingHi:         "#FFD700",
    endplates:          "#A80000",
    halo:               CF,
    rimColor:           "#FFD700",
  },
  mclaren: {
    body:               "#FF8000",
    nose:               "#111111",
    frontWing:          "#FF8000",
    sidepods:           "#FF8000",
    sidepodAccent:      "#0090FF",
    cockpit:            "#111111",
    engineCover:        "#FF8000",
    engineCoverAccent:  "#0090FF",
    rearWingLo:         "#FF8000",
    rearWingHi:         "#0090FF",
    endplates:          "#111111",
    halo:               CF,
    rimColor:           "#888888",
  },
  mercedes: {
    body:               "#C0C0C0",
    nose:               "#1a1a1a",
    frontWing:          "#C0C0C0",
    sidepods:           "#00D2BE",
    sidepodAccent:      "#C0C0C0",
    cockpit:            "#1a1a1a",
    engineCover:        "#00D2BE",
    engineCoverAccent:  "#C0C0C0",
    rearWingLo:         "#00D2BE",
    rearWingHi:         "#C0C0C0",
    endplates:          "#1a1a1a",
    halo:               CF,
    rimColor:           "#C0C0C0",
  },
  aston_martin: {
    body:               "#00665A",
    nose:               "#003D35",
    frontWing:          "#00665A",
    sidepods:           "#00665A",
    sidepodAccent:      "#CEDC00",
    cockpit:            "#003D35",
    engineCover:        "#00665A",
    engineCoverAccent:  "#CEDC00",
    rearWingLo:         "#00665A",
    rearWingHi:         "#CEDC00",
    endplates:          "#003D35",
    halo:               CF,
    rimColor:           "#CEDC00",
  },
  alpine: {
    body:               "#0090FF",
    nose:               "#05003A",
    frontWing:          "#0090FF",
    sidepods:           "#0090FF",
    sidepodAccent:      "#FF69B4",
    cockpit:            "#05003A",
    engineCover:        "#0090FF",
    engineCoverAccent:  "#FF69B4",
    rearWingLo:         "#0090FF",
    rearWingHi:         "#FF69B4",
    endplates:          "#05003A",
    halo:               CF,
    rimColor:           "#888888",
  },
  haas: {
    body:               "#FFFFFF",
    nose:               "#111111",
    frontWing:          "#FFFFFF",
    sidepods:           "#FFFFFF",
    sidepodAccent:      "#E8002D",
    cockpit:            "#111111",
    engineCover:        "#E8002D",
    engineCoverAccent:  "#FFFFFF",
    rearWingLo:         "#FFFFFF",
    rearWingHi:         "#E8002D",
    endplates:          "#111111",
    halo:               CF,
    rimColor:           "#888888",
  },
  williams: {
    body:               "#005AFF",
    nose:               "#001A4E",
    frontWing:          "#005AFF",
    sidepods:           "#005AFF",
    sidepodAccent:      "#FFFFFF",
    cockpit:            "#001A4E",
    engineCover:        "#005AFF",
    engineCoverAccent:  "#FFFFFF",
    rearWingLo:         "#005AFF",
    rearWingHi:         "#FFFFFF",
    endplates:          "#001A4E",
    halo:               CF,
    rimColor:           "#FFFFFF",
  },
  rb: {
    body:               "#1E2060",
    nose:               "#0D0F3A",
    frontWing:          "#1E2060",
    sidepods:           "#6692FF",
    sidepodAccent:      "#00C5FF",
    cockpit:            "#0D0F3A",
    engineCover:        "#1E2060",
    engineCoverAccent:  "#00C5FF",
    rearWingLo:         "#1E2060",
    rearWingHi:         "#00C5FF",
    endplates:          "#0D0F3A",
    halo:               CF,
    rimColor:           "#6692FF",
  },
  "kick-sauber": {
    body:               "#1a1a1a",
    nose:               "#0a0a0a",
    frontWing:          "#1a1a1a",
    sidepods:           "#1a1a1a",
    sidepodAccent:      "#00E400",
    cockpit:            "#0a0a0a",
    engineCover:        "#1a1a1a",
    engineCoverAccent:  "#00E400",
    rearWingLo:         "#1a1a1a",
    rearWingHi:         "#00E400",
    endplates:          "#0a0a0a",
    halo:               CF,
    rimColor:           "#00E400",
  },
  audi: {
    body:               "#111111",
    nose:               "#0a0a0a",
    frontWing:          "#111111",
    sidepods:           "#111111",
    sidepodAccent:      "#BB0A30",
    cockpit:            "#0a0a0a",
    engineCover:        "#BB0A30",
    engineCoverAccent:  "#FFFFFF",
    rearWingLo:         "#111111",
    rearWingHi:         "#BB0A30",
    endplates:          "#0a0a0a",
    halo:               CF,
    rimColor:           "#888888",
  },
  cadillac: {
    body:               "#111111",
    nose:               "#0a0a0a",
    frontWing:          "#111111",
    sidepods:           "#C8102E",
    sidepodAccent:      "#D4AF37",
    cockpit:            "#0a0a0a",
    engineCover:        "#C8102E",
    engineCoverAccent:  "#D4AF37",
    rearWingLo:         "#C8102E",
    rearWingHi:         "#D4AF37",
    endplates:          "#0a0a0a",
    halo:               CF,
    rimColor:           "#D4AF37",
  },
};

const FALLBACK_LIVERY: Livery = LIVERIES.mclaren;

function getLivery(teamId: string): Livery {
  return LIVERIES[teamId] ?? FALLBACK_LIVERY;
}

interface Props {
  teamId: string;
  secondary: string;
}

function Box({
  p, s, c, m = 0.15, r = 0.3,
}: {
  p: [number, number, number];
  s: [number, number, number];
  c: string;
  m?: number;
  r?: number;
}) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} metalness={m} roughness={r} />
    </mesh>
  );
}

function Wheel({ p, front, rimColor }: { p: [number, number, number]; front: boolean; rimColor: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 3.5;
  });
  const rad = front ? 0.262 : 0.292;
  const h   = front ? 0.232 : 0.262;
  return (
    <group position={p} ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[rad, rad, h, 22]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[rad * 0.57, rad * 0.57, h + 0.01, 10]} />
        <meshStandardMaterial color={rimColor} roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[rad * 0.18, rad * 0.18, h + 0.02, 6]} />
        <meshStandardMaterial color="#aaa" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

function Car({ teamId, secondary }: Props) {
  const g = useRef<THREE.Group>(null);
  const lv = getLivery(teamId);

  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.getElapsedTime();
    g.current.rotation.y = t * 0.27;
    g.current.position.y = Math.sin(t * 0.85) * 0.055;
  });

  return (
    <group ref={g}>
      {/* ── MAIN BODY ── */}
      <Box p={[0,     0.04,   0]}      s={[3.4,  0.22,  0.72]}  c={lv.body} />

      {/* ── NOSE ── */}
      <Box p={[2.05, -0.01,  0]}       s={[1.1,  0.13,  0.35]}  c={lv.nose} m={0.2} r={0.5} />

      {/* ── FRONT WING ── */}
      <Box p={[2.3,  -0.175,  0]}      s={[0.5,  0.04,  1.88]}  c={lv.frontWing} />
      <Box p={[2.28, -0.04,  0.93]}    s={[0.46, 0.28,  0.04]}  c={lv.endplates} m={0.2} r={0.5} />
      <Box p={[2.28, -0.04, -0.93]}    s={[0.46, 0.28,  0.04]}  c={lv.endplates} m={0.2} r={0.5} />

      {/* ── SIDEPODS ── */}
      <Box p={[-0.1,  0.05,  0.70]}    s={[2.0,  0.24,  0.50]}  c={lv.sidepods} />
      <Box p={[-0.1,  0.05, -0.70]}    s={[2.0,  0.24,  0.50]}  c={lv.sidepods} />
      {/* sidepod accent stripe */}
      <Box p={[-0.1,  0.165,  0.70]}   s={[2.0,  0.04,  0.48]}  c={lv.sidepodAccent} />
      <Box p={[-0.1,  0.165, -0.70]}   s={[2.0,  0.04,  0.48]}  c={lv.sidepodAccent} />

      {/* ── COCKPIT ── */}
      <Box p={[0.35,  0.19,  0]}       s={[0.62, 0.15,  0.48]}  c={lv.cockpit} m={0.2} r={0.5} />

      {/* ── HALO ── */}
      <Box p={[0.32,  0.335,  0.24]}   s={[0.48, 0.032, 0.032]} c={lv.halo} m={0.75} r={0.2} />
      <Box p={[0.32,  0.335, -0.24]}   s={[0.48, 0.032, 0.032]} c={lv.halo} m={0.75} r={0.2} />
      <Box p={[0.62,  0.36,   0]}      s={[0.032,0.032, 0.52]}  c={lv.halo} m={0.75} r={0.2} />

      {/* ── ENGINE COVER ── */}
      <Box p={[-0.38, 0.25,  0]}       s={[1.45, 0.23,  0.29]}  c={lv.engineCover} />
      {/* engine cover accent fin top */}
      <Box p={[-0.38, 0.375,  0]}      s={[1.45, 0.04,  0.27]}  c={lv.engineCoverAccent} />

      {/* ── REAR WING ── */}
      <Box p={[-1.80, 0.30,  0.87]}    s={[0.12, 0.58,  0.04]}  c={lv.endplates} m={0.2} r={0.5} />
      <Box p={[-1.80, 0.30, -0.87]}    s={[0.12, 0.58,  0.04]}  c={lv.endplates} m={0.2} r={0.5} />
      <Box p={[-1.83, 0.64,  0]}       s={[0.09, 0.05,  1.74]}  c={lv.rearWingLo} />
      <Box p={[-1.83, 0.73,  0]}       s={[0.09, 0.05,  1.74]}  c={lv.rearWingHi} />

      {/* ── FLOOR ── */}
      <Box p={[-0.15,-0.155,  0]}      s={[3.3,  0.035, 1.70]}  c={CF} m={0.5} r={0.6} />

      {/* ── WHEELS ── */}
      <Wheel p={[ 1.52, -0.265,  1.0]}  front      rimColor={lv.rimColor} />
      <Wheel p={[ 1.52, -0.265, -1.0]}  front      rimColor={lv.rimColor} />
      <Wheel p={[-1.35, -0.265,  1.0]}  front={false} rimColor={lv.rimColor} />
      <Wheel p={[-1.35, -0.265, -1.0]}  front={false} rimColor={lv.rimColor} />
    </group>
  );
}

export default function F1CarScene({ teamId, secondary }: Props) {
  const lv = getLivery(teamId);
  return (
    <Canvas
      camera={{ position: [5, 2.2, 5], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[7, 10, 4]} intensity={1.6} />
      <pointLight position={[0, 2.5, 1]} color={secondary} intensity={0.6} distance={8} />
      <directionalLight position={[-4, 1.5, -3]} intensity={0.35} color={lv.rearWingHi} />
      <Car teamId={teamId} secondary={secondary} />
    </Canvas>
  );
}
