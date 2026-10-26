export type Stick = { x: number; y: number };

export const keys = {
  forward: false,
  back: false,
  left: false,
  right: false,
  boost: false,
};

export const stick: Stick = { x: 0, y: 0 };

export function bindKeyboard() {
  const down = (e: KeyboardEvent) => {
    if (e.code === "KeyW" || e.code === "ArrowUp") keys.forward = true;
    if (e.code === "KeyS" || e.code === "ArrowDown") keys.back = true;
    if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = true;
    if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = true;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.boost = true;
  };
  const up = (e: KeyboardEvent) => {
    if (e.code === "KeyW" || e.code === "ArrowUp") keys.forward = false;
    if (e.code === "KeyS" || e.code === "ArrowDown") keys.back = false;
    if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = false;
    if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = false;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.boost = false;
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
  };
}

export function driveInput() {
  let throttle = 0;
  let steer = 0;
  if (keys.forward) throttle += 1;
  if (keys.back) throttle -= 1;
  if (keys.left) steer += 1;
  if (keys.right) steer -= 1;
  // Touch stick: y forward negative in screen space → invert
  throttle += -stick.y;
  steer += -stick.x;
  throttle = Math.max(-1, Math.min(1, throttle));
  steer = Math.max(-1, Math.min(1, steer));
  return { throttle, steer, boost: keys.boost || Math.hypot(stick.x, stick.y) > 0.85 };
}
