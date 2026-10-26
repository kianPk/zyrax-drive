import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import WorldMesh from "./world/World";
import Car, { CarState } from "./world/Car";
import FollowCamera from "./world/FollowCamera";
import HUD from "./ui/HUD";
import MobileStick from "./ui/MobileStick";
import { bindKeyboard } from "./input";
import { WORLD, ZONES } from "./data";

function detectLite() {
  if (typeof window === "undefined") return true;
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData;
  const cores = navigator.hardwareConcurrency || 4;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return Boolean(mobile || saveData || reduced || cores <= 4);
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [nearId, setNearId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const lite = useMemo(() => detectLite(), []);
  const carState = useRef<CarState>({
    x: WORLD.spawn.x,
    z: WORLD.spawn.z,
    yaw: 0,
    speed: 0,
    nearZoneId: null,
  });

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    return bindKeyboard();
  }, []);

  const openNear = useCallback(() => {
    const id = carState.current.nearZoneId;
    const z = ZONES.find((x) => x.id === id);
    if (z?.href) window.open(z.href, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "KeyE") openNear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, openNear]);

  return (
    <div className="app">
      <Canvas
        shadows={!lite}
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 12, 16], fov: lite ? 50 : 45, near: 0.1, far: 200 }}
        gl={{
          antialias: !lite,
          powerPreference: lite ? "low-power" : "high-performance",
          stencil: false,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0b1220");
        }}
      >
        <Suspense fallback={null}>
          <hemisphereLight intensity={0.55} color="#dbeafe" groundColor="#0f172a" />
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow={!lite}
            position={[18, 28, 12]}
            intensity={1.15}
            shadow-mapSize={lite ? 512 : 1024}
          />
          <fog attach="fog" args={["#0b1220", 28, lite ? 70 : 95]} />

          <WorldMesh lite={lite} activeId={nearId} />
          {started && (
            <Car state={carState} onNearZone={setNearId} lite={lite} />
          )}
          {started && <FollowCamera state={carState} lite={lite} />}
          {!lite && <AdaptiveDpr pixelated />}
        </Suspense>
      </Canvas>

      <HUD
        nearId={nearId}
        started={started}
        onStart={() => setStarted(true)}
        onOpen={openNear}
        isTouch={isTouch}
      />
      {started && isTouch && <MobileStick enabled />}
    </div>
  );
}
