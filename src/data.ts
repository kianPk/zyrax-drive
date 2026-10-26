export type Zone = {
  id: string;
  title: string;
  blurb: string;
  href?: string;
  x: number;
  z: number;
  color: string;
  w: number;
  d: number;
  h: number;
};

export const ZONES: Zone[] = [
  {
    id: "tradeforge",
    title: "TradeForge",
    blurb: "Multi-market perpetual clearing in Solidity",
    href: "https://kianpk.github.io/tradeforge/",
    x: -18,
    z: -14,
    color: "#22d3ee",
    w: 6,
    d: 6,
    h: 5,
  },
  {
    id: "vaultforge",
    title: "VaultForge",
    blurb: "ERC-4626 vault lab with strategies",
    href: "https://github.com/kianPk/vaultforge",
    x: 16,
    z: -16,
    color: "#a78bfa",
    w: 5.5,
    d: 5.5,
    h: 6.5,
  },
  {
    id: "playfield",
    title: "Playfield",
    blurb: "Roll the earth globe in a 3D portfolio world",
    href: "https://kianpk.github.io/playfield/",
    x: -20,
    z: 12,
    color: "#34d399",
    w: 6,
    d: 6,
    h: 4.5,
  },
  {
    id: "orbit",
    title: "Orbit Desk",
    blurb: "Cinematic 3D desk portfolio",
    href: "https://kianpk.github.io/orbit-desk/",
    x: 18,
    z: 14,
    color: "#f472b6",
    w: 5,
    d: 5,
    h: 5.5,
  },
  {
    id: "about",
    title: "About Kian",
    blurb: "Solidity · Rust · Go · Flutter · Vue/Node · Iran",
    href: "https://github.com/kianPk",
    x: 0,
    z: -24,
    color: "#fbbf24",
    w: 8,
    d: 4,
    h: 3.5,
  },
  {
    id: "contact",
    title: "Telegram",
    blurb: "Say hi @Kian_asli",
    href: "https://t.me/Kian_asli",
    x: 0,
    z: 22,
    color: "#38bdf8",
    w: 5,
    d: 5,
    h: 4,
  },
];

export const WORLD = {
  size: 70,
  spawn: { x: 0, z: 6 },
};
