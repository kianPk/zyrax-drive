import { ZONES } from "../data";

type Props = {
  nearId: string | null;
  started: boolean;
  onStart: () => void;
  onOpen: () => void;
  isTouch: boolean;
};

export default function HUD({ nearId, started, onStart, onOpen, isTouch }: Props) {
  const zone = ZONES.find((z) => z.id === nearId) || null;

  return (
    <>
      {!started && (
        <div className="overlay welcome">
          <div className="panel">
            <p className="eyebrow">Zyrax Drive</p>
            <h1>Drive Kian's world</h1>
            <p className="lede">
              Cruise a low-poly portfolio map. Pull up to glowing buildings to unlock
              projects — inspired by playful 3D portfolios, built original for Kian.
            </p>
            <ul className="controls">
              {isTouch ? (
                <>
                  <li>
                    <b>Joystick</b> — drive
                  </li>
                  <li>
                    <b>Near a building</b> — tap Open
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <b>WASD / arrows</b> — drive
                  </li>
                  <li>
                    <b>Shift</b> — boost
                  </li>
                  <li>
                    <b>Near a building</b> — press Open / Enter
                  </li>
                </>
              )}
            </ul>
            <button type="button" className="cta" onClick={onStart}>
              Start driving
            </button>
          </div>
        </div>
      )}

      {started && (
        <div className="hud-top">
          <div className="brand">
            <strong>Zyrax Drive</strong>
            <span>Kian Zarandi</span>
          </div>
          <a className="ghost" href="https://t.me/Kian_asli" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </div>
      )}

      {started && zone && (
        <div className="zone-card">
          <div className="swatch" style={{ background: zone.color }} />
          <div>
            <h2>{zone.title}</h2>
            <p>{zone.blurb}</p>
          </div>
          {zone.href && (
            <button type="button" className="cta small" onClick={onOpen}>
              Open
            </button>
          )}
        </div>
      )}

    </>
  );
}
