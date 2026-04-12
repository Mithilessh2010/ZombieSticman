// src/store/gameStore.ts
import { create } from 'zustand';
import { GameScreen, GameStats, SkillNode } from '@/types';

interface GameStore {
  screen: GameScreen;
  setScreen: (s: GameScreen) => void;

  // In-run state (mirrored from engine for React UI)
  wave: number;
  setWave: (n: number) => void;
  playerHealth: number;
  playerMaxHealth: number;
  setPlayerHealth: (h: number, max: number) => void;
  playerLevel: number;
  playerXP: number;
  playerXPToNext: number;
  setPlayerXP: (xp: number, toNext: number, level: number) => void;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  reloadProgress: number;
  setAmmo: (a: number, max: number, reloading: boolean, progress: number) => void;
  currentWeapon: string;
  setCurrentWeapon: (w: string) => void;
  kills: number;
  setKills: (k: number) => void;
  coins: number;
  setCoins: (c: number) => void;
  dashCooldownPct: number;
  setDashCooldown: (pct: number) => void;
  bossHP: number | null;
  bossMaxHP: number | null;
  setBossHP: (hp: number | null, max: number | null) => void;

  // Upgrade choices
  upgradeChoices: string[];
  setUpgradeChoices: (ids: string[]) => void;
  chooseUpgrade: (id: string) => void;
  onUpgradeChosen: ((id: string) => void) | null;
  setOnUpgradeChosen: (fn: (id: string) => void) => void;

  // Run summary
  runStats: GameStats | null;
  setRunStats: (s: GameStats) => void;

  // Persistent
  totalCoins: number;
  setTotalCoins: (n: number) => void;
  skillNodes: SkillNode[];
  setSkillNodes: (nodes: SkillNode[]) => void;
  unlockSkill: (id: string) => void;
  bestStats: { highestWave: number; totalKills: number; totalRuns: number };
  updateBestStats: (s: GameStats) => void;

  // Settings
  volume: number;
  setVolume: (v: number) => void;
  screenShake: boolean;
  setScreenShake: (v: boolean) => void;
  showDamageNumbers: boolean;
  setShowDamageNumbers: (v: boolean) => void;
}

const DEFAULT_SKILL_NODES: SkillNode[] = [
  { id: 'hp1', name: '+25 Max HP', description: 'Increase starting health by 25.', cost: 50, unlocked: false, requires: [], row: 0, col: 0, effect: { maxHealth: 25 } },
  { id: 'spd1', name: '+10% Speed', description: 'Move faster from the start.', cost: 50, unlocked: false, requires: [], row: 0, col: 2, effect: { speed: 10 } },
  { id: 'dmg1', name: '+10% Damage', description: 'Deal more damage every run.', cost: 75, unlocked: false, requires: [], row: 0, col: 4, effect: { damage: 10 } },
  { id: 'hp2', name: '+50 Max HP', description: 'Serious health boost.', cost: 150, unlocked: false, requires: ['hp1'], row: 1, col: 0, effect: { maxHealth: 50 } },
  { id: 'regen1', name: 'Regeneration', description: '+1 HP/sec passive regen.', cost: 100, unlocked: false, requires: ['hp1'], row: 1, col: 1, effect: { regen: 1 } },
  { id: 'crit1', name: 'Sharp Eyes', description: '+10% crit chance.', cost: 100, unlocked: false, requires: ['dmg1'], row: 1, col: 4, effect: { critChance: 10 } },
  { id: 'dash1', name: 'Quick Dash', description: '-20% dash cooldown.', cost: 100, unlocked: false, requires: ['spd1'], row: 1, col: 2, effect: { dashCooldown: -20 } },
  { id: 'xp1', name: 'Scholar', description: '+20% XP gain.', cost: 75, unlocked: false, requires: [], row: 0, col: 3, effect: { xpMultiplier: 20 } },
  { id: 'magnet1', name: 'Magnetism', description: '+50% XP pickup radius.', cost: 100, unlocked: false, requires: ['xp1'], row: 1, col: 3, effect: { magnetRadius: 80 } },
  { id: 'armor1', name: 'Thick Skin', description: '+10 armor.', cost: 125, unlocked: false, requires: ['hp2'], row: 2, col: 0, effect: { armor: 10 } },
  { id: 'lifesteal1', name: 'Vampire', description: '+5% lifesteal.', cost: 150, unlocked: false, requires: ['crit1'], row: 2, col: 4, effect: { lifeSteal: 5 } },
  { id: 'pierce1', name: 'Penetrator', description: 'Bullets pierce 1 extra enemy.', cost: 200, unlocked: false, requires: ['dmg1', 'crit1'], row: 2, col: 3, effect: { piercing: 1 } },
];

function loadPersisted() {
  if (typeof window === 'undefined') return { coins: 0, nodes: DEFAULT_SKILL_NODES, best: { highestWave: 0, totalKills: 0, totalRuns: 0 } };
  try {
    return {
      coins: parseInt(localStorage.getItem('sls_coins') || '0'),
      nodes: JSON.parse(localStorage.getItem('sls_skills') || 'null') || DEFAULT_SKILL_NODES,
      best: JSON.parse(localStorage.getItem('sls_best') || 'null') || { highestWave: 0, totalKills: 0, totalRuns: 0 },
    };
  } catch { return { coins: 0, nodes: DEFAULT_SKILL_NODES, best: { highestWave: 0, totalKills: 0, totalRuns: 0 } }; }
}

export const useGameStore = create<GameStore>((set, get) => {
  const p = loadPersisted();
  return {
    screen: 'menu',
    setScreen: (s) => set({ screen: s }),

    wave: 1, setWave: (n) => set({ wave: n }),
    playerHealth: 100, playerMaxHealth: 100,
    setPlayerHealth: (h, max) => set({ playerHealth: h, playerMaxHealth: max }),
    playerLevel: 1, playerXP: 0, playerXPToNext: 100,
    setPlayerXP: (xp, toNext, level) => set({ playerXP: xp, playerXPToNext: toNext, playerLevel: level }),
    ammo: 12, maxAmmo: 12, isReloading: false, reloadProgress: 0,
    setAmmo: (a, max, reloading, progress) => set({ ammo: a, maxAmmo: max, isReloading: reloading, reloadProgress: progress }),
    currentWeapon: 'Pistol', setCurrentWeapon: (w) => set({ currentWeapon: w }),
    kills: 0, setKills: (k) => set({ kills: k }),
    coins: 0, setCoins: (c) => set({ coins: c }),
    dashCooldownPct: 0, setDashCooldown: (pct) => set({ dashCooldownPct: pct }),
    bossHP: null, bossMaxHP: null, setBossHP: (hp, max) => set({ bossHP: hp, bossMaxHP: max }),

    upgradeChoices: [], setUpgradeChoices: (ids) => set({ upgradeChoices: ids }),
    chooseUpgrade: (id) => {
      const fn = get().onUpgradeChosen;
      if (fn) fn(id);
      set({ screen: 'playing', upgradeChoices: [] });
    },
    onUpgradeChosen: null, setOnUpgradeChosen: (fn) => set({ onUpgradeChosen: fn }),

    runStats: null, setRunStats: (s) => set({ runStats: s }),

    totalCoins: p.coins,
    setTotalCoins: (n) => {
      set({ totalCoins: n });
      localStorage.setItem('sls_coins', String(n));
    },
    skillNodes: p.nodes,
    setSkillNodes: (nodes) => {
      set({ skillNodes: nodes });
      localStorage.setItem('sls_skills', JSON.stringify(nodes));
    },
    unlockSkill: (id) => {
      const nodes = get().skillNodes.map(n => n.id === id ? { ...n, unlocked: true } : n);
      const node = get().skillNodes.find(n => n.id === id);
      if (!node) return;
      const newCoins = get().totalCoins - node.cost;
      set({ skillNodes: nodes, totalCoins: newCoins });
      localStorage.setItem('sls_skills', JSON.stringify(nodes));
      localStorage.setItem('sls_coins', String(newCoins));
    },
    bestStats: p.best,
    updateBestStats: (s) => {
      const cur = get().bestStats;
      const best = {
        highestWave: Math.max(cur.highestWave, s.wavesReached),
        totalKills: cur.totalKills + s.kills,
        totalRuns: cur.totalRuns + 1,
      };
      set({ bestStats: best });
      localStorage.setItem('sls_best', JSON.stringify(best));
    },

    volume: 0.5, setVolume: (v) => set({ volume: v }),
    screenShake: true, setScreenShake: (v) => set({ screenShake: v }),
    showDamageNumbers: true, setShowDamageNumbers: (v) => set({ showDamageNumbers: v }),
  };
});
