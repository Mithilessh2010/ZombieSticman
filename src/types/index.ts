// src/types/index.ts

export interface Vec2 {
  x: number;
  y: number;
}

export type GameScreen = 'menu' | 'playing' | 'paused' | 'upgrade' | 'dead' | 'settings' | 'skilltree';

export type WeaponType =
  | 'pistol' | 'shotgun' | 'smg' | 'assault_rifle' | 'sniper'
  | 'minigun' | 'flamethrower' | 'rocket_launcher' | 'laser' | 'crossbow';

export type EnemyType =
  | 'walker' | 'runner' | 'tank' | 'spitter' | 'bomber'
  | 'splitter' | 'shielder' | 'invisible' | 'boss_abomination'
  | 'boss_necromancer' | 'boss_behemoth';

export type UpgradeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  rarity: UpgradeRarity;
  icon: string;
  maxStacks: number;
  apply: (stats: PlayerStats) => PlayerStats;
}

export interface PlayerStats {
  maxHealth: number;
  health: number;
  armor: number;
  speed: number;
  dashCooldown: number;
  dashDuration: number;
  luck: number;
  critChance: number;
  critMultiplier: number;
  dodgeChance: number;
  regen: number;
  magnetRadius: number;
  // Weapon modifiers
  damage: number;
  attackSpeed: number;
  bulletSpeed: number;
  bulletSize: number;
  piercing: number;
  lifeSteal: number;
  // Meta
  xpMultiplier: number;
  goldMultiplier: number;
}

export interface WeaponData {
  type: WeaponType;
  name: string;
  damage: number;
  fireRate: number; // shots per second
  reloadTime: number; // ms
  magazineSize: number;
  bulletSpeed: number;
  bulletCount: number; // for shotgun spread
  spread: number; // degrees
  range: number;
  color: string;
  rarity: UpgradeRarity;
}

export interface GameStats {
  kills: number;
  damageDealt: number;
  shotsFired: number;
  shotsHit: number;
  wavesReached: number;
  timeAlive: number;
  xpGained: number;
  coinsEarned: number;
  highestWave: number;
  totalKills: number;
  totalRuns: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  requires: string[];
  row: number;
  col: number;
  effect: Partial<PlayerStats>;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'blood' | 'spark' | 'xp' | 'explosion' | 'muzzle' | 'smoke' | 'text';
  text?: string;
}
