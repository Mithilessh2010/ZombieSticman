export interface UpgradeDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  apply: (s: RunStats) => RunStats;
}

export interface RunStats {
  maxHealth: number;
  speed: number;
  jumpStrength: number;
  fireRateMult: number;
  damageMult: number;
  doubleShot: boolean;
  bulletPierce: number;
  xpGainMult: number;
}

export const BASE_RUN_STATS: RunStats = {
  maxHealth: 100,
  speed: 230,
  jumpStrength: 480,
  fireRateMult: 1,
  damageMult: 1,
  doubleShot: false,
  bulletPierce: 0,
  xpGainMult: 1,
};

export const UPGRADE_POOL: UpgradeDef[] = [
  {
    id: 'speed',
    label: 'Swift Feet',
    description: 'Move speed +25',
    icon: '',
    apply: (s) => ({ ...s, speed: s.speed + 25 }),
  },
  {
    id: 'fire_rate',
    label: 'Trigger Happy',
    description: 'Fire rate ×1.25',
    icon: '',
    apply: (s) => ({ ...s, fireRateMult: +(s.fireRateMult * 1.25).toFixed(3) }),
  },
  {
    id: 'damage',
    label: 'Hot Lead',
    description: 'Bullet damage ×1.3',
    icon: '',
    apply: (s) => ({ ...s, damageMult: +(s.damageMult * 1.3).toFixed(3) }),
  },
  {
    id: 'health',
    label: 'Iron Will',
    description: 'Max health +30',
    icon: '',
    apply: (s) => ({ ...s, maxHealth: s.maxHealth + 30 }),
  },
  {
    id: 'double_shot',
    label: 'Double Shot',
    description: 'Fire an extra bullet',
    icon: '',
    apply: (s) => ({ ...s, doubleShot: true }),
  },
  {
    id: 'pierce',
    label: 'Penetrator',
    description: 'Bullets pierce +1 enemy',
    icon: '',
    apply: (s) => ({ ...s, bulletPierce: s.bulletPierce + 1 }),
  },
  {
    id: 'xp',
    label: 'Fast Learner',
    description: 'XP gain ×1.4',
    icon: '',
    apply: (s) => ({ ...s, xpGainMult: +(s.xpGainMult * 1.4).toFixed(3) }),
  },
  {
    id: 'jump',
    label: 'Spring Legs',
    description: 'Jump height +60',
    icon: '',
    apply: (s) => ({ ...s, jumpStrength: s.jumpStrength + 60 }),
  },
];

export function pickUpgrades(count = 3): UpgradeDef[] {
  return [...UPGRADE_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}
