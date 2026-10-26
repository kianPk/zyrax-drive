import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CarState } from "./Car";

type Props = {
  state: React.MutableRefObject<CarState>;
  lite: boolean;
};

export default function FollowCamera({ state, lite }: Props) {
  const { camera } = useThree();
  const current = new THREE.Vector3();
  const look = new THREE.Vector3();

  useFrame((_, delta) => {
    const s = state.current;
    const dist = lite ? 9.5 : 11;
    const height = lite ? 5.2 : 5.8;
    const behindX = s.x - Math.sin(s.yaw) * dist;
    const behindZ = s.z - Math.cos(s.yaw) * dist;
    current.set(behindX, height, behindZ);
    camera.position.lerp(current, 1 - Math.exp(-3.2 * delta));
    look.set(s.x, 1.1, s.z);
    camera.lookAt(look);
  });

  return null;
}
