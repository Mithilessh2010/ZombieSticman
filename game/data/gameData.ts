export interface LevelConfig {
  id: number;
  name: string;
  enemyCount: number;
  enemySpeedMult: number;
  enemyHealthMult: number;
  hasBoss: boolean;
  background: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Ruined Village',
    enemyCount: 5,
    enemySpeedMult: 1.0,
    enemyHealthMult: 1.0,
    hasBoss: false,
    background: '#1a1a2e',
  },
  {
    id: 2,
    name: 'Forest Ruins',
    enemyCount: 8,
    enemySpeedMult: 1.2,
    enemyHealthMult: 1.3,
    hasBoss: false,
    background: '#0d1f0d',
  },
  {
    id: 3,
    name: 'Underground Cave',
    enemyCount: 10,
    enemySpeedMult: 1.4,
    enemyHealthMult: 1.6,
    hasBoss: false,
    background: '#0f0f0f',
  },
  {
    id: 4,
    name: 'Fortress Gates',
    enemyCount: 12,
    enemySpeedMult: 1.6,
    enemyHealthMult: 2.0,
    hasBoss: false,
    background: '#1a0a0a',
  },
  {
    id: 5,
    name: 'Throne Room',
    enemyCount: 0,
    enemySpeedMult: 1.0,
    enemyHealthMult: 1.0,
    hasBoss: true,
    background: '#1a0a1a',
  },
];

export const STORY_BEATS: Record<string, string> = {
  start: 'The kingdom has fallen.\nThe Evil King has corrupted the land.\nYou are the last fighter standing.',
  after_1: 'You are not the only survivor.\nShadows stir in the ruins behind you.',
  after_2: 'The corruption spreads underground.\nEven the earth itself recoils.',
  after_3: 'The king knows you are coming.\nHis armies grow desperate.',
  after_4: 'The gates of the fortress stand before you.\nOne last push.',
  before_boss: 'The throne room awaits.\nEnd this.',
  after_boss: 'The king has fallen.\nLight returns to the land.\nThe world can heal.',
};

export interface UpgradeOption {
  id: string;
  label: string;
  description: string;
  apply: (stats: PlayerStats) => PlayerStats;
}

export interface PlayerStats {
  maxHealth: number;
  speed: number;
  damage: number;
  coinMultiplier: number;
  potionHealMult: number;
}

export const BASE_STATS: PlayerStats = {
  maxHealth: 100,
  speed: 220,
  damage: 20,
  coinMultiplier: 1,
  potionHealMult: 1,
};

export const UPGRADE_POOL: UpgradeOption[] = [
  {
    id: 'damage',
    label: '💥 Iron Fist',
    description: 'Punch damage +10',
    apply: (s) => ({ ...s, damage: s.damage + 10 }),
  },
  {
    id: 'speed',
    label: '⚡ Swift Legs',
    description: 'Movement speed +30',
    apply: (s) => ({ ...s, speed: s.speed + 30 }),
  },
  {
    id: 'health',
    label: '❤️ Tough Skin',
    description: 'Max health +25',
    apply: (s) => ({ ...s, maxHealth: s.maxHealth + 25 }),
  },
  {
    id: 'coins',
    label: '💰 Gold Touch',
    description: 'Coin gain ×1.5',
    apply: (s) => ({ ...s, coinMultiplier: +(s.coinMultiplier * 1.5).toFixed(2) }),
  },
  {
    id: 'potion',
    label: '🧪 Alchemist',
    description: 'Potions heal 50% more',
    apply: (s) => ({ ...s, potionHealMult: +(s.potionHealMult * 1.5).toFixed(2) }),
  },
];

export function pickRandomUpgrades(count = 3): UpgradeOption[] {
  const shuffled = [...UPGRADE_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
