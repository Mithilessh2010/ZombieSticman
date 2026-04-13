import { create } from 'zustand';
import { BASE_STATS, PlayerStats, pickRandomUpgrades, UpgradeOption } from '@/game/data/gameData';

export type Screen =
  | 'menu'
  | 'story'
  | 'playing'
  | 'upgrade'
  | 'gameover'
  | 'victory';

export interface GameState {
  screen: Screen;
  currentLevel: number;
  playerStats: PlayerStats;
  playerHealth: number;
  coins: number;
  totalCoins: number;
  enemiesDefeated: number;
  storyText: string;
  upgradeChoices: UpgradeOption[];
  setScreen: (s: Screen) => void;
  setLevel: (l: number) => void;
  setPlayerStats: (s: PlayerStats) => void;
  setPlayerHealth: (h: number) => void;
  addCoins: (n: number) => void;
  addEnemyKill: () => void;
  showStory: (text: string, next: Screen) => void;
  storyNext: Screen;
  proceedStory: () => void;
  showUpgrades: () => void;
  applyUpgrade: (id: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'menu',
  currentLevel: 1,
  playerStats: { ...BASE_STATS },
  playerHealth: BASE_STATS.maxHealth,
  coins: 0,
  totalCoins: 0,
  enemiesDefeated: 0,
  storyText: '',
  upgradeChoices: [],
  storyNext: 'playing',

  setScreen: (screen) => set({ screen }),
  setLevel: (currentLevel) => set({ currentLevel }),
  setPlayerStats: (playerStats) => set({ playerStats }),
  setPlayerHealth: (playerHealth) => set({ playerHealth }),

  addCoins: (n) =>
    set((s) => ({
      coins: s.coins + Math.floor(n * s.playerStats.coinMultiplier),
      totalCoins: s.totalCoins + Math.floor(n * s.playerStats.coinMultiplier),
    })),

  addEnemyKill: () => set((s) => ({ enemiesDefeated: s.enemiesDefeated + 1 })),

  showStory: (text, next) =>
    set({ screen: 'story', storyText: text, storyNext: next }),

  proceedStory: () => {
    const next = get().storyNext;
    set({ screen: next });
  },

  showUpgrades: () => {
    const choices = pickRandomUpgrades(3);
    set({ screen: 'upgrade', upgradeChoices: choices });
  },

  applyUpgrade: (id) => {
    const { upgradeChoices, playerStats } = get();
    const choice = upgradeChoices.find((u) => u.id === id);
    if (!choice) return;
    const newStats = choice.apply(playerStats);
    set({ playerStats: newStats, playerHealth: Math.min(get().playerHealth + 15, newStats.maxHealth) });
  },

  resetGame: () =>
    set({
      screen: 'menu',
      currentLevel: 1,
      playerStats: { ...BASE_STATS },
      playerHealth: BASE_STATS.maxHealth,
      coins: 0,
      totalCoins: 0,
      enemiesDefeated: 0,
    }),
}));
