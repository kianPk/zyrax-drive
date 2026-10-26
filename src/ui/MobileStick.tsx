import { useEffect, useRef } from "react";
import { stick } from "../input";

/** Virtual joystick fixed at bottom-left for phones */
export default function MobileStick({ enabled }: { enabled: boolean }) {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const active = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const el = base.current;
    if (!el) return;
    const max = 48;

    const setKnob = (dx: number, dy: number) => {
      const dist = Math.min(max, Math.hypot(dx, dy));
      const ang = Math.atan2(dy, dx);
      const x = Math.cos(ang) * dist;
      const y = Math.sin(ang) * dist;
      if (knob.current) knob.current.style.transform = `translate(${x}px, ${y}px)`;
      stick.x = x / max;
      stick.y = y / max;
    };

    const onStart = (e: TouchEvent) => {
      if (active.current != null) return;
      const t = e.changedTouches[0];
      active.current = t.identifier;
      const rect = el.getBoundingClientRect();
      origin.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setKnob(t.clientX - origin.current.x, t.clientY - origin.current.y);
    };
    const onMove = (e: TouchEvent) => {
      if (active.current == null) return;
      let t: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === active.current) t = e.changedTouches[i];
      }
      if (!t) return;
      e.preventDefault();
      setKnob(t.clientX - origin.current.x, t.clientY - origin.current.y);
    };
    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === active.current) {
          active.current = null;
          stick.x = 0;
          stick.y = 0;
          if (knob.current) knob.current.style.transform = "translate(0,0)";
        }
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      stick.x = 0;
      stick.y = 0;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="stick-host">
      <div className="stick" ref={base} aria-label="Drive joystick">
        <div className="stick-knob" ref={knob} />
      </div>
    </div>
  );
}
