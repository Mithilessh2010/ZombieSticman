import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RunStats, BASE_RUN_STATS, UpgradeDef, pickUpgrades } from '@/game/data/upgrades';
import { GUNS } from '@/game/data/guns';
import { ARMOR } from '@/game/data/armor';
import { POTIONS } from '@/game/data/potions';

export type Screen = 'menu' | 'shop' | 'inventory' | 'playing' | 'gameover';

interface PersistentState {
  coins: number;
  ownedGunIds: string[];
  equippedGunId: string;
  ownedArmorIds: string[];
  equippedArmorId: string | null;
}

interface SessionState {
  screen: Screen;
  currentWave: number;
  runStats: RunStats;
  runHealth: number;
  runCoins: number;
  runXp: number;
  runLevel: number;
  xpToNext: number;
  enemiesKilled: number;
  timeAlive: number;
  potionInventory: { id: string; count: number }[];
}

interface Actions {
  setScreen: (s: Screen) => void;
  buyGun: (id: string) => void;
  equipGun: (id: string) => void;
  buyArmor: (id: string) => void;
  equipArmor: (id: string) => void;
  buyPotion: (id: string, quantity: number) => void;
  usePotion: (id: string) => void;
  startRun: () => void;
  setCurrentWave: (w: number) => void;
  continueToNextWave: () => void;
  addRunCoins: (n: number) => void;
  addRunXp: (n: number) => void;
  addKill: () => void;
  tickTime: (dt: number) => void;
  takeDamage: (n: number) => void;
  setRunHealth: (h: number) => void;
  triggerLevelUp: () => void;
  endRun: () => void;
}

export type GameStore = PersistentState & SessionState & Actions;

const XP_BASE = 80;
function xpForLevel(level: number) { return Math.floor(XP_BASE * Math.pow(1.25, level - 1)); }

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // --- persistent ---
      coins: 0,
      ownedGunIds: [],
      equippedGunId: '',
      ownedArmorIds: [],
      equippedArmorId: null,

      // --- session ---
      screen: 'menu',
      currentWave: 0,
      runStats: { ...BASE_RUN_STATS },
      runHealth: BASE_RUN_STATS.maxHealth,
      runCoins: 0,
      runXp: 0,
      runLevel: 1,
      xpToNext: XP_BASE,
      enemiesKilled: 0,
      timeAlive: 0,
      potionInventory: [],

      // --- actions ---
      setScreen: (screen) => set({ screen }),

      setCurrentWave: (wave) => set({ currentWave: wave }),

      continueToNextWave: () => {
        set({ screen: 'playing', currentWave: get().currentWave + 1 });
      },

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

      buyArmor: (id) => {
        const armor = ARMOR.find((a) => a.id === id);
        if (!armor) return;
        const { coins, ownedArmorIds } = get();
        if (ownedArmorIds.includes(id)) return;
        if (coins < armor.price) return;
        set({ coins: coins - armor.price, ownedArmorIds: [...ownedArmorIds, id] });
      },

      equipArmor: (id) => {
        if (id === '' || get().ownedArmorIds.includes(id)) set({ equippedArmorId: id || null });
      },

      buyPotion: (id, quantity) => {
        const potion = POTIONS.find((p) => p.id === id);
        if (!potion) return;
        const { coins, potionInventory } = get();
        const totalCost = potion.price * quantity;
        if (coins < totalCost) return;
        const newInventory = [...potionInventory];
        const existing = newInventory.find((p) => p.id === id);
        if (existing) {
          existing.count += quantity;
        } else {
          newInventory.push({ id, count: quantity });
        }
        set({ coins: coins - totalCost, potionInventory: newInventory });
      },

      usePotion: (id) => {
        const potion = POTIONS.find((p) => p.id === id);
        if (!potion) return;
        const { runHealth, potionInventory } = get();
        const inv = potionInventory.find((p) => p.id === id);
        if (!inv || inv.count <= 0) return;
        const newInv = potionInventory.map((p) => p.id === id ? { ...p, count: p.count - 1 } : p).filter((p) => p.count > 0);
        set({ runHealth: Math.min(runHealth + potion.healAmount, get().runStats.maxHealth), potionInventory: newInv });
      },

      startRun: () => {
        const base = { ...BASE_RUN_STATS };
        const armor = get().equippedArmorId ? ARMOR.find((a) => a.id === get().equippedArmorId) : null;
        const maxHealth = base.maxHealth + (armor?.maxHealthBoost || 0);
        set({
          screen: 'shop',
          currentWave: 1,
          runStats: { ...base, maxHealth },
          runHealth: maxHealth,
          runCoins: 0,
          runXp: 0,
          runLevel: 1,
          xpToNext: XP_BASE,
          enemiesKilled: 0,
          timeAlive: 0,
          potionInventory: [],
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
        });
      },

      takeDamage: (n) => {
        const { runHealth, equippedArmorId } = get();
        const armor = equippedArmorId ? ARMOR.find((a) => a.id === equippedArmorId) : null;
        const reduction = armor?.damageReduction || 0;
        const finalDamage = Math.ceil(n * (1 - reduction));
        const h = runHealth - finalDamage;
        if (h <= 0) {
          set({ runHealth: 0 });
          get().endRun();
        } else {
          set({ runHealth: h });
        }
      },

      setRunHealth: (runHealth) => set({ runHealth }),

      endRun: () => {
        const { runCoins, coins } = get();
        set({ coins: coins + runCoins, screen: 'gameover' });
      },
    }),
    {
      name: 'stickman-save',
      partialize: (s) => ({
        coins: s.coins,
        ownedGunIds: s.ownedGunIds,
        equippedGunId: s.equippedGunId,
        ownedArmorIds: s.ownedArmorIds,
        equippedArmorId: s.equippedArmorId,
      }),
    }
  )
);
