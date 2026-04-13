import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RunStats, BASE_RUN_STATS, UpgradeDef, pickUpgrades } from '@/game/data/upgrades';
import { GUNS } from '@/game/data/guns';

export type Screen = 'menu' | 'shop' | 'inventory' | 'playing' | 'upgrade' | 'gameover';

interface PersistentState {
  coins: number;
  ownedGunIds: string[];
  equippedGunId: string;
}

interface SessionState {
  screen: Screen;
  runStats: RunStats;
  runHealth: number;
  runCoins: number;
  runXp: number;
  runLevel: number;
  xpToNext: number;
  enemiesKilled: number;
  timeAlive: number;
  upgradeChoices: UpgradeDef[];
}

interface Actions {
  setScreen: (s: Screen) => void;
  buyGun: (id: string) => void;
  equipGun: (id: string) => void;
  startRun: () => void;
  applyUpgrade: (id: string) => void;
  addRunCoins: (n: number) => void;
  addRunXp: (n: number) => void;
  addKill: () => void;
  tickTime: (dt: number) => void;
  takeDamage: (n: number) => void;
  setRunHealth: (h: number) => void;
  triggerLevelUp: () => void;
  endRun: () => void;
  showUpgrades: () => void;
}

export type GameStore = PersistentState & SessionState & Actions;

const XP_BASE = 80;
function xpForLevel(level: number) { return Math.floor(XP_BASE * Math.pow(1.25, level - 1)); }

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // --- persistent ---
      coins: 0,
      ownedGunIds: ['pistol'],
      equippedGunId: 'pistol',

      // --- session ---
      screen: 'menu',
      runStats: { ...BASE_RUN_STATS },
      runHealth: BASE_RUN_STATS.maxHealth,
      runCoins: 0,
      runXp: 0,
      runLevel: 1,
      xpToNext: XP_BASE,
      enemiesKilled: 0,
      timeAlive: 0,
      upgradeChoices: [],

      // --- actions ---
      setScreen: (screen) => set({ screen }),

      buyGun: (id) => {
        const gun = GUNS.find((g) => g.id === id);
        if (!gun) return;
        const { coins, ownedGunIds } = get();
        if (ownedGunIds.includes(id)) return;
        if (coins < gun.price) return;
        set({ coins: coins - gun.price, ownedGunIds: [...ownedGunIds, id] });
      },

      equipGun: (id) => {
        if (get().ownedGunIds.includes(id)) set({ equippedGunId: id });
      },

      startRun: () => {
        const base = { ...BASE_RUN_STATS };
        set({
          screen: 'playing',
          runStats: base,
          runHealth: base.maxHealth,
          runCoins: 0,
          runXp: 0,
          runLevel: 1,
          xpToNext: XP_BASE,
          enemiesKilled: 0,
          timeAlive: 0,
          upgradeChoices: [],
        });
      },

      applyUpgrade: (id) => {
        const { upgradeChoices, runStats, runHealth } = get();
        const u = upgradeChoices.find((x) => x.id === id);
        if (!u) return;
        const newStats = u.apply(runStats);
        set({
          runStats: newStats,
          runHealth: Math.min(runHealth + 10, newStats.maxHealth),
          screen: 'playing',
        });
      },

      addRunCoins: (n) => set((s) => ({ runCoins: s.runCoins + n })),
      addKill: () => set((s) => ({ enemiesKilled: s.enemiesKilled + 1 })),
      tickTime: (dt) => set((s) => ({ timeAlive: s.timeAlive + dt })),

      addRunXp: (n) => {
        const { runXp, xpToNext, runLevel, runStats } = get();
        const gained = Math.floor(n * runStats.xpGainMult);
        const newXp = runXp + gained;
        if (newXp >= xpToNext) {
          get().triggerLevelUp();
        } else {
          set({ runXp: newXp });
        }
      },

      triggerLevelUp: () => {
        const { runLevel, runXp, xpToNext } = get();
        const newLevel = runLevel + 1;
        const overflow = runXp - xpToNext;
        set({
          runLevel: newLevel,
          runXp: Math.max(0, overflow),
          xpToNext: xpForLevel(newLevel),
          upgradeChoices: pickUpgrades(3),
          screen: 'upgrade',
        });
      },

      takeDamage: (n) => {
        const h = get().runHealth - n;
        if (h <= 0) {
          set({ runHealth: 0 });
          get().endRun();
        } else {
          set({ runHealth: h });
        }
      },

      setRunHealth: (runHealth) => set({ runHealth }),

      showUpgrades: () => set({ upgradeChoices: pickUpgrades(3), screen: 'upgrade' }),

      endRun: () => {
        const { runCoins, coins } = get();
        set({ coins: coins + runCoins, screen: 'gameover' });
      },
    }),
    {
      name: 'stickman-save',
      partialize: (s) => ({ coins: s.coins, ownedGunIds: s.ownedGunIds, equippedGunId: s.equippedGunId }),
    }
  )
);
