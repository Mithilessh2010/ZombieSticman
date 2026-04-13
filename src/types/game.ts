export type GameState = 'MENU' | 'PLAYING' | 'SHOP' | 'GAMEOVER' | 'LEVEL_UP' | 'INVENTORY' | 'SETTINGS';

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  fireRate: number; // ms between shots
  bulletSpeed: number;
  reloadTime: number; // ms
  magazineSize: number;
  price: number;
  unlocked: boolean;
  description: string;
}

export interface PlayerStats {
  maxHealth: number;
  health: number;
  speed: number;
  jumpForce: number;
  xp: number;
  level: number;
  coins: number;
  totalCoins: number;
  totalKills: number;
  highestWave: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: (stats: PlayerStats) => PlayerStats;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  lastUsed: number;
  active: boolean;
  duration: number;
}

export interface GameControls {
  moveLeft: string;
  moveRight: string;
  jump: string;
  inventory: string;
}
