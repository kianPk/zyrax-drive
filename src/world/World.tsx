import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ZONES, WORLD } from "../data";

type Props = {
  lite: boolean;
  activeId: string | null;
};

export default function WorldMesh({ lite, activeId }: Props) {
  const trees = useMemo(() => {
    const pts: { x: number; z: number; h: number }[] = [];
    for (let i = 0; i < (lite ? 18 : 36); i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 28 + (i % 5) * 2.2;
      pts.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h: 1.4 + (i % 4) * 0.35,
      });
    }
    return pts;
  }, [lite]);

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!lite} position={[0, 0, 0]}>
        <planeGeometry args={[WORLD.size, WORLD.size]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>

      {/* Soft checker strips */}
      {!lite &&
        Array.from({ length: 7 }).map((_, i) => (
          <mesh
            key={`strip-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, -24 + i * 8]}
            receiveShadow
          >
            <planeGeometry args={[WORLD.size * 0.92, 0.35]} />
            <meshStandardMaterial color="#334155" roughness={1} />
          </mesh>
        ))}

      {/* Border walls */}
      {(
        [
          [0, WORLD.size / 2, WORLD.size, 1.2, 0.6],
          [0, -WORLD.size / 2, WORLD.size, 1.2, 0.6],
          [WORLD.size / 2, 0, 0.6, 1.2, WORLD.size],
          [-WORLD.size / 2, 0, 0.6, 1.2, WORLD.size],
        ] as const
      ).map(([x, z, w, h, d], i) => (
        <mesh key={`wall-${i}`} position={[x, h / 2, z]} castShadow={!lite}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Center plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[6, lite ? 24 : 48]} />
        <meshStandardMaterial color="#243044" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 2.2, 8]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.25} />
      </mesh>

      {/* Project buildings */}
      {ZONES.map((z) => {
        const active = activeId === z.id;
        return (
          <group key={z.id} position={[z.x, 0, z.z]}>
            <mesh castShadow={!lite} position={[0, z.h / 2, 0]}>
              <boxGeometry args={[z.w, z.h, z.d]} />
              <meshStandardMaterial
                color={z.color}
                roughness={0.55}
                metalness={0.1}
                emissive={z.color}
                emissiveIntensity={active ? 0.35 : 0.08}
              />
            </mesh>
            {/* Roof plate */}
            <mesh position={[0, z.h + 0.12, 0]}>
              <boxGeometry args={[z.w * 1.05, 0.2, z.d * 1.05]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
            <Text
              position={[0, z.h + 1.1, 0]}
              fontSize={0.7}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#020617"
              maxWidth={8}
            >
              {z.title}
            </Text>
            {/* Floor pad */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
              <circleGeometry args={[Math.max(z.w, z.d) * 0.85, 24]} />
              <meshStandardMaterial
                color={z.color}
                transparent
                opacity={active ? 0.35 : 0.12}
              />
            </mesh>
          </group>
        );
      })}

      {/* Decorative trees */}
      {trees.map((t, i) => (
        <group key={`tree-${i}`} position={[t.x, 0, t.z]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.8, 6]} />
            <meshStandardMaterial color="#7c4a2d" />
          </mesh>
          <mesh position={[0, 0.9 + t.h * 0.35, 0]}>
            <coneGeometry args={[0.7, t.h, lite ? 5 : 7]} />
            <meshStandardMaterial color={i % 2 ? "#059669" : "#10b981"} />
          </mesh>
        </group>
      ))}

      {/* Soft fog-friendly fill cubes as hills */}
      {!lite && (
        <>
          <mesh position={[-28, 0.8, -28]}>
            <boxGeometry args={[8, 1.6, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[26, 0.5, 26]}>
            <boxGeometry args={[6, 1, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </>
      )}
    </group>
  );
}
