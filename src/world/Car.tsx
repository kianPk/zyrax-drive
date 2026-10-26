import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { driveInput } from "../input";
import { WORLD, ZONES } from "../data";

export type CarState = {
  x: number;
  z: number;
  yaw: number;
  speed: number;
  nearZoneId: string | null;
};

type Props = {
  state: React.MutableRefObject<CarState>;
  onNearZone: (id: string | null) => void;
  lite: boolean;
};

const HALF = WORLD.size / 2 - 1.5;

function hitsBuilding(x: number, z: number) {
  for (const zoned of ZONES) {
    const hw = zoned.w / 2 + 0.9;
    const hd = zoned.d / 2 + 0.9;
    if (Math.abs(x - zoned.x) < hw && Math.abs(z - zoned.z) < hd) return true;
  }
  return false;
}

function Wheel({
  innerRef,
  position,
  lite,
}: {
  innerRef: React.MutableRefObject<THREE.Mesh | null>;
  position: [number, number, number];
  lite: boolean;
}) {
  return (
    <mesh
      ref={innerRef}
      position={position}
      rotation={[0, 0, Math.PI / 2]}
      castShadow={!lite}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.24, lite ? 8 : 12]} />
      <meshStandardMaterial color="#0b1220" roughness={0.95} />
    </mesh>
  );
}

export default function Car({ state, onNearZone, lite }: Props) {
  const group = useRef<THREE.Group>(null);
  const wheelFL = useRef<THREE.Mesh | null>(null);
  const wheelFR = useRef<THREE.Mesh | null>(null);
  const wheelRL = useRef<THREE.Mesh | null>(null);
  const wheelRR = useRef<THREE.Mesh | null>(null);
  const steerAngle = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const { throttle, steer, boost } = driveInput();
    const s = state.current;

    const maxSpeed = boost ? 18 : 11;
    const accel = boost ? 28 : 18;
    const turnRate = 2.4;

    if (Math.abs(throttle) > 0.05) {
      s.speed += throttle * accel * d;
    } else {
      s.speed *= 1 - 3.2 * d;
    }
    s.speed = Math.max(-maxSpeed * 0.45, Math.min(maxSpeed, s.speed));

    if (Math.abs(s.speed) > 0.2) {
      s.yaw += steer * turnRate * (s.speed / maxSpeed) * d;
    }

    const nx = s.x + Math.sin(s.yaw) * s.speed * d;
    const nz = s.z + Math.cos(s.yaw) * s.speed * d;
    const cx = Math.max(-HALF, Math.min(HALF, nx));
    const cz = Math.max(-HALF, Math.min(HALF, nz));

    if (!hitsBuilding(cx, cz)) {
      s.x = cx;
      s.z = cz;
    } else {
      s.speed *= -0.25;
    }

    let nearest: string | null = null;
    let best = 7.5;
    for (const z of ZONES) {
      const dist = Math.hypot(s.x - z.x, s.z - z.z);
      if (dist < best) {
        best = dist;
        nearest = z.id;
      }
    }
    if (s.nearZoneId !== nearest) {
      s.nearZoneId = nearest;
      onNearZone(nearest);
    }

    if (group.current) {
      group.current.position.set(s.x, 0.45, s.z);
      group.current.rotation.y = s.yaw;
    }

    steerAngle.current = THREE.MathUtils.lerp(steerAngle.current, steer * 0.5, 0.2);
    const spin = s.speed * d * 2.8;
    for (const w of [wheelFL, wheelFR, wheelRL, wheelRR]) {
      if (w.current) w.current.rotation.x += spin;
    }
    if (wheelFL.current) wheelFL.current.rotation.y = steerAngle.current;
    if (wheelFR.current) wheelFR.current.rotation.y = steerAngle.current;
  });

  return (
    <group ref={group} position={[WORLD.spawn.x, 0.45, WORLD.spawn.z]}>
      <mesh castShadow={!lite} position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.35, 2.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh castShadow={!lite} position={[0, 0.48, -0.15]}>
        <boxGeometry args={[1.2, 0.45, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0.35]}>
        <boxGeometry args={[1.05, 0.28, 0.08]} />
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.12, 1.15]}>
        <boxGeometry args={[1.2, 0.12, 0.25]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.35} />
      </mesh>

      <Wheel innerRef={wheelFL} position={[-0.65, -0.05, 0.75]} lite={lite} />
      <Wheel innerRef={wheelFR} position={[0.65, -0.05, 0.75]} lite={lite} />
      <Wheel innerRef={wheelRL} position={[-0.65, -0.05, -0.75]} lite={lite} />
      <Wheel innerRef={wheelRR} position={[0.65, -0.05, -0.75]} lite={lite} />
    </group>
  );
}
