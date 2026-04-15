import { create } from 'zustand';
import { GameState, PlayerStats, Weapon, Upgrade, GameControls, Difficulty } from '../types/game';

interface GameStore {
  gameState: GameState;
  previousGameState: GameState;
  difficulty: Difficulty;
  stats: PlayerStats;
  currentWave: number;
  zombiesRemaining: number;
  equippedWeaponId: string;
  weapons: Weapon[];
  upgrades: Upgrade[];
  controls: GameControls;
  
  // Actions
  setGameState: (state: GameState) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setControl: (action: keyof GameControls, key: string) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  addKill: () => void;
  nextWave: () => void;
  setZombiesRemaining: (count: number) => void;
  buyWeapon: (id: string) => void;
  equipWeapon: (id: string) => void;
  buyUpgrade: (id: string) => void;
  resetRun: () => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
}

const INITIAL_WEAPONS: Weapon[] = [
  {
    id: 'fists',
    name: 'Fists',
    damage: 10,
    fireRate: 500,
    bulletSpeed: 0, // Melee
    reloadTime: 0,
    magazineSize: Infinity,
    price: 0,
    unlocked: true,
    description: 'Your bare hands. Short range but reliable.',
  },
  {
    id: 'spear',
    name: 'Spear',
    damage: 18,
    fireRate: 800,
    bulletSpeed: 0, // Melee
    reloadTime: 0,
    magazineSize: Infinity,
    price: 150,
    unlocked: false,
    description: 'Long reach melee weapon. Keep them at a distance.',
  },
  {
    id: 'katana',
    name: 'Katana',
    damage: 35,
    fireRate: 400,
    bulletSpeed: 0, // Melee
    reloadTime: 0,
    magazineSize: Infinity,
    price: 800,
    unlocked: false,
    description: 'Fast and deadly blade. High damage melee.',
  },
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 15,
    fireRate: 400,
    bulletSpeed: 12,
    reloadTime: 1000,
    magazineSize: 12,
    price: 300,
    unlocked: false,
    description: 'Reliable sidearm. Infinite ammo.',
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    damage: 60,
    fireRate: 1200,
    bulletSpeed: 18,
    reloadTime: 1500,
    magazineSize: 1,
    price: 1000,
    unlocked: false,
    description: 'Silent and powerful. Pierces through multiple enemies.',
  },
  {
    id: 'smg',
    name: 'SMG',
    damage: 10,
    fireRate: 100,
    bulletSpeed: 14,
    reloadTime: 1500,
    magazineSize: 30,
    price: 500,
    unlocked: false,
    description: 'High fire rate, low damage.',
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 25, // Per pellet
    fireRate: 800,
    bulletSpeed: 10,
    reloadTime: 2000,
    magazineSize: 6,
    price: 1200,
    unlocked: false,
    description: 'Devastating at close range.',
  },
  {
    id: 'rifle',
    name: 'Assault Rifle',
    damage: 22,
    fireRate: 150,
    bulletSpeed: 16,
    reloadTime: 1800,
    magazineSize: 25,
    price: 2500,
    unlocked: false,
    description: 'Balanced power and speed.',
  },
  {
    id: 'sniper',
    name: 'Sniper',
    damage: 150,
    fireRate: 1500,
    bulletSpeed: 25,
    reloadTime: 2500,
    magazineSize: 5,
    price: 5000,
    unlocked: false,
    description: 'One shot, one kill.',
  },
];

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'health',
    name: 'Vitality',
    description: 'Increase max health by 20.',
    cost: 200,
    level: 0,
    maxLevel: 10,
    effect: (s) => ({ ...s, maxHealth: s.maxHealth + 20, health: s.health + 20 }),
  },
  {
    id: 'speed',
    name: 'Agility',
    description: 'Increase movement speed by 10%.',
    cost: 300,
    level: 0,
    maxLevel: 5,
    effect: (s) => ({ ...s, speed: s.speed * 1.1 }),
  },
  {
    id: 'coins',
    name: 'Greed',
    description: 'Zombies drop 20% more coins.',
    cost: 400,
    level: 0,
    maxLevel: 5,
    effect: (s) => s, // Handled in game logic
  },
];

export const useGameStore = create<GameStore>()(
  (set) => ({
    gameState: 'MENU',
    previousGameState: 'MENU',
    difficulty: 'NORMAL',
    currentWave: 0,
    zombiesRemaining: 0,
    equippedWeaponId: 'fists',
    weapons: INITIAL_WEAPONS,
    upgrades: INITIAL_UPGRADES,
    controls: {
      moveLeft: 'KeyA',
      moveRight: 'KeyD',
      jump: 'KeyW',
      inventory: 'KeyI',
      shoot: 'MouseButton',
    },
    stats: {
      maxHealth: 100,
      health: 100,
      speed: 5,
      jumpForce: 12,
      xp: 0,
      level: 1,
      coins: 0,
      totalCoins: 0,
      totalKills: 0,
      highestWave: 0,
    },

    setGameState: (gameState) => set((state) => ({ 
      previousGameState: state.gameState,
      gameState 
    })),

    setDifficulty: (difficulty) => set({ difficulty }),
    
    setControl: (action, key) => set((state) => ({
      controls: { ...state.controls, [action]: key }
    })),

    addCoins: (amount) => set((state) => ({
      stats: {
        ...state.stats,
        coins: state.stats.coins + amount,
        totalCoins: state.stats.totalCoins + amount,
      }
    })),

    addXP: (amount) => set((state) => {
      const newXP = state.stats.xp + amount;
      const xpNeeded = state.stats.level * 100;
      if (newXP >= xpNeeded) {
        return {
          gameState: 'LEVEL_UP',
          stats: {
            ...state.stats,
            xp: newXP - xpNeeded,
            level: state.stats.level + 1,
            health: state.stats.maxHealth, // Heal on level up
          }
        };
      }
      return { stats: { ...state.stats, xp: newXP } };
    }),

    addKill: () => set((state) => ({
      stats: { ...state.stats, totalKills: state.stats.totalKills + 1 },
      zombiesRemaining: Math.max(0, state.zombiesRemaining - 1),
    })),

    nextWave: () => set((state) => {
      const nextWave = state.currentWave + 1;
      return {
        currentWave: nextWave,
        gameState: 'PLAYING',
        stats: {
          ...state.stats,
          highestWave: Math.max(state.stats.highestWave, nextWave),
        }
      };
    }),

    setZombiesRemaining: (count) => set({ zombiesRemaining: count }),

    buyWeapon: (id) => set((state) => {
      const weapon = state.weapons.find(w => w.id === id);
      if (weapon && !weapon.unlocked && state.stats.coins >= weapon.price) {
        return {
          stats: { ...state.stats, coins: state.stats.coins - weapon.price },
          weapons: state.weapons.map(w => w.id === id ? { ...w, unlocked: true } : w),
        };
      }
      return state;
    }),

    equipWeapon: (id) => set({ equippedWeaponId: id }),

    buyUpgrade: (id) => set((state) => {
      const upgrade = state.upgrades.find(u => u.id === id);
      if (upgrade && upgrade.level < upgrade.maxLevel && state.stats.coins >= upgrade.cost) {
        const newStats = upgrade.effect(state.stats);
        return {
          stats: { ...newStats, coins: state.stats.coins - upgrade.cost },
          upgrades: state.upgrades.map(u => u.id === id ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) } : u),
        };
      }
      return state;
    }),

    resetRun: () => set((state) => ({
      gameState: 'PLAYING',
      previousGameState: 'GAMEOVER',
      currentWave: 1,
      weapons: INITIAL_WEAPONS,
      upgrades: INITIAL_UPGRADES,
      equippedWeaponId: 'fists',
      stats: {
        maxHealth: 100,
        health: 100,
        speed: 5,
        jumpForce: 12,
        xp: 0,
        level: 1,
        coins: 0,
        totalCoins: 0,
        totalKills: 0,
        highestWave: state.stats.highestWave,
      }
    })),

    damagePlayer: (amount) => set((state) => {
      const newHealth = Math.max(0, state.stats.health - amount);
      if (newHealth <= 0) {
        return {
          gameState: 'GAMEOVER',
          stats: { ...state.stats, health: 0 }
        };
      }
      return { stats: { ...state.stats, health: newHealth } };
    }),

    healPlayer: (amount) => set((state) => ({
      stats: { ...state.stats, health: Math.min(state.stats.maxHealth, state.stats.health + amount) }
    })),
  })
);
