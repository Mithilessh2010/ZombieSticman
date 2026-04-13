export interface GunDef {
  id: string;
  name: string;
  damage: number;
  fireRate: number;   // shots per second
  bulletSpeed: number;
  bulletSize: number;
  bulletColor: string;
  spread: number;     // degrees half-angle, 0 = none
  pellets: number;    // 1 for most, >1 for shotgun
  pierce: number;     // how many enemies bullet passes through
  price: number;      // 0 = starter (always owned)
  description: string;
  color: string;      // UI accent color
}

export const GUNS: GunDef[] = [
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 18,
    fireRate: 2.5,
    bulletSpeed: 620,
    bulletSize: 5,
    bulletColor: '#ffd54f',
    spread: 0,
    pellets: 1,
    pierce: 0,
    price: 0,
    description: 'Reliable starter sidearm.',
    color: '#ffd54f',
  },
  {
    id: 'rifle',
    name: 'Rifle',
    damage: 32,
    fireRate: 5,
    bulletSpeed: 900,
    bulletSize: 5,
    bulletColor: '#80cbc4',
    spread: 0,
    pellets: 1,
    pierce: 0,
    price: 120,
    description: 'Fast accurate burst fire.',
    color: '#80cbc4',
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 22,
    fireRate: 1.2,
    bulletSpeed: 520,
    bulletSize: 4,
    bulletColor: '#ff8a65',
    spread: 14,
    pellets: 5,
    pierce: 0,
    price: 180,
    description: '5-pellet spread. Devastating up close.',
    color: '#ff8a65',
  },
  {
    id: 'sniper',
    name: 'Sniper',
    damage: 110,
    fireRate: 0.7,
    bulletSpeed: 1400,
    bulletSize: 7,
    bulletColor: '#ce93d8',
    spread: 0,
    pellets: 1,
    pierce: 2,
    price: 250,
    description: 'One-shot power. Pierces 2 enemies.',
    color: '#ce93d8',
  },
  {
    id: 'smg',
    name: 'SMG',
    damage: 12,
    fireRate: 12,
    bulletSpeed: 700,
    bulletSize: 4,
    bulletColor: '#a5d6a7',
    spread: 4,
    pellets: 1,
    pierce: 0,
    price: 200,
    description: 'Sprays bullets at extreme speed.',
    color: '#a5d6a7',
  },
];

export function getGun(id: string): GunDef {
  return GUNS.find((g) => g.id === id) ?? GUNS[0];
}
