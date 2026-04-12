// src/game/weapons.ts
import { WeaponData, WeaponType } from '@/types';

export const WEAPONS: Record<WeaponType, WeaponData> = {
  pistol: {
    type: 'pistol', name: 'Pistol', damage: 25, fireRate: 3, reloadTime: 1200,
    magazineSize: 12, bulletSpeed: 700, bulletCount: 1, spread: 3, range: 600,
    color: '#94a3b8', rarity: 'common',
  },
  shotgun: {
    type: 'shotgun', name: 'Shotgun', damage: 18, fireRate: 1, reloadTime: 2000,
    magazineSize: 6, bulletSpeed: 600, bulletCount: 7, spread: 20, range: 350,
    color: '#f97316', rarity: 'rare',
  },
  smg: {
    type: 'smg', name: 'SMG', damage: 12, fireRate: 12, reloadTime: 1500,
    magazineSize: 30, bulletSpeed: 750, bulletCount: 1, spread: 8, range: 450,
    color: '#38bdf8', rarity: 'rare',
  },
  assault_rifle: {
    type: 'assault_rifle', name: 'Assault Rifle', damage: 28, fireRate: 7, reloadTime: 1800,
    magazineSize: 25, bulletSpeed: 800, bulletCount: 1, spread: 4, range: 600,
    color: '#22c55e', rarity: 'rare',
  },
  sniper: {
    type: 'sniper', name: 'Sniper', damage: 150, fireRate: 0.8, reloadTime: 2500,
    magazineSize: 5, bulletSpeed: 1400, bulletCount: 1, spread: 0, range: 1400,
    color: '#a78bfa', rarity: 'epic',
  },
  minigun: {
    type: 'minigun', name: 'Minigun', damage: 10, fireRate: 20, reloadTime: 3000,
    magazineSize: 100, bulletSpeed: 700, bulletCount: 1, spread: 12, range: 500,
    color: '#fbbf24', rarity: 'epic',
  },
  flamethrower: {
    type: 'flamethrower', name: 'Flamethrower', damage: 8, fireRate: 25, reloadTime: 2000,
    magazineSize: 120, bulletSpeed: 350, bulletCount: 3, spread: 25, range: 250,
    color: '#ef4444', rarity: 'epic',
  },
  rocket_launcher: {
    type: 'rocket_launcher', name: 'Rocket Launcher', damage: 200, fireRate: 0.6, reloadTime: 3000,
    magazineSize: 3, bulletSpeed: 500, bulletCount: 1, spread: 0, range: 800,
    color: '#f97316', rarity: 'legendary',
  },
  laser: {
    type: 'laser', name: 'Laser Rifle', damage: 45, fireRate: 8, reloadTime: 1000,
    magazineSize: 40, bulletSpeed: 1200, bulletCount: 1, spread: 0, range: 900,
    color: '#38bdf8', rarity: 'legendary',
  },
  crossbow: {
    type: 'crossbow', name: 'Crossbow', damage: 80, fireRate: 1.5, reloadTime: 2200,
    magazineSize: 8, bulletSpeed: 900, bulletCount: 1, spread: 1, range: 750,
    color: '#84cc16', rarity: 'rare',
  },
};

export const WEAPON_DROP_ORDER: WeaponType[] = [
  'pistol', 'shotgun', 'smg', 'assault_rifle', 'crossbow',
  'sniper', 'minigun', 'flamethrower', 'laser', 'rocket_launcher'
];
