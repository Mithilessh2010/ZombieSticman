// src/game/upgrades.ts
import { Upgrade, PlayerStats } from '@/types';

export const ALL_UPGRADES: Upgrade[] = [
  // --- DAMAGE ---
  { id: 'dmg_boost', name: 'Power Shot', description: '+15% bullet damage', rarity: 'common', icon: '💥', maxStacks: 8,
    apply: (s) => ({ ...s, damage: s.damage + 15 }) },
  { id: 'crit_chance', name: 'Eagle Eye', description: '+8% critical hit chance', rarity: 'common', icon: '🎯', maxStacks: 8,
    apply: (s) => ({ ...s, critChance: s.critChance + 8 }) },
  { id: 'crit_dmg', name: 'Executioner', description: '+25% critical hit damage', rarity: 'rare', icon: '⚡', maxStacks: 5,
    apply: (s) => ({ ...s, critMultiplier: s.critMultiplier + 25 }) },
  { id: 'atk_speed', name: 'Adrenaline', description: '+10% attack speed', rarity: 'common', icon: '🔥', maxStacks: 8,
    apply: (s) => ({ ...s, attackSpeed: s.attackSpeed + 10 }) },
  { id: 'bullet_speed', name: 'Accelerator', description: '+15% bullet speed', rarity: 'common', icon: '🚀', maxStacks: 5,
    apply: (s) => ({ ...s, bulletSpeed: s.bulletSpeed + 15 }) },
  { id: 'bullet_size', name: 'Big Rounds', description: '+20% bullet size', rarity: 'rare', icon: '⭕', maxStacks: 4,
    apply: (s) => ({ ...s, bulletSize: s.bulletSize + 20 }) },
  { id: 'piercing', name: 'Penetrator', description: 'Bullets pierce +1 enemy', rarity: 'rare', icon: '🗡️', maxStacks: 4,
    apply: (s) => ({ ...s, piercing: s.piercing + 1 }) },
  { id: 'explosive', name: 'Explosive Rounds', description: 'Bullets deal 30% splash damage', rarity: 'epic', icon: '💣', maxStacks: 3,
    apply: (s) => ({ ...s, damage: s.damage + 5, bulletSize: s.bulletSize + 30 }) },
  { id: 'chain_lightning', name: 'Chain Lightning', description: '+20% damage, electric visual', rarity: 'epic', icon: '⚡', maxStacks: 3,
    apply: (s) => ({ ...s, damage: s.damage + 20 }) },
  { id: 'fire_bullets', name: 'Incendiary', description: 'Fire bullets burn enemies for extra damage', rarity: 'epic', icon: '🔥', maxStacks: 3,
    apply: (s) => ({ ...s, damage: s.damage + 10 }) },
  { id: 'ice_bullets', name: 'Cryo Rounds', description: 'Ice bullets slow enemies on hit', rarity: 'epic', icon: '❄️', maxStacks: 3,
    apply: (s) => ({ ...s, damage: s.damage + 8, attackSpeed: s.attackSpeed + 5 }) },
  { id: 'ricochet', name: 'Ricochet', description: 'Bullets bounce off walls once', rarity: 'epic', icon: '🔄', maxStacks: 2,
    apply: (s) => ({ ...s, piercing: s.piercing + 1 }) },
  { id: 'lifesteal', name: 'Vampiric', description: '+5% lifesteal on hit', rarity: 'rare', icon: '🩸', maxStacks: 5,
    apply: (s) => ({ ...s, lifeSteal: s.lifeSteal + 5 }) },
  { id: 'execute', name: 'Execute', description: '+50% damage to enemies below 20% HP', rarity: 'legendary', icon: '💀', maxStacks: 2,
    apply: (s) => ({ ...s, damage: s.damage + 30, critChance: s.critChance + 15 }) },

  // --- DEFENSE ---
  { id: 'max_hp', name: 'Fortified', description: '+30 max health', rarity: 'common', icon: '❤️', maxStacks: 10,
    apply: (s) => ({ ...s, maxHealth: s.maxHealth + 30 }) },
  { id: 'armor', name: 'Body Armor', description: '+8 armor (flat damage reduction)', rarity: 'common', icon: '🛡️', maxStacks: 8,
    apply: (s) => ({ ...s, armor: s.armor + 8 }) },
  { id: 'dodge', name: 'Evasion', description: '+6% dodge chance', rarity: 'rare', icon: '💨', maxStacks: 5,
    apply: (s) => ({ ...s, dodgeChance: s.dodgeChance + 6 }) },
  { id: 'regen', name: 'Regeneration', description: '+1.5 HP/sec passive regen', rarity: 'rare', icon: '💚', maxStacks: 5,
    apply: (s) => ({ ...s, regen: s.regen + 1.5 }) },
  { id: 'thorns', name: 'Thorns', description: 'Reflect 20% damage taken', rarity: 'epic', icon: '🌵', maxStacks: 3,
    apply: (s) => ({ ...s, armor: s.armor + 5, damage: s.damage + 5 }) },

  // --- MOBILITY ---
  { id: 'move_speed', name: 'Sneakers', description: '+8% movement speed', rarity: 'common', icon: '👟', maxStacks: 8,
    apply: (s) => ({ ...s, speed: s.speed + 8 }) },
  { id: 'dash_cd', name: 'Quick Recovery', description: '-20% dash cooldown', rarity: 'rare', icon: '⚡', maxStacks: 4,
    apply: (s) => ({ ...s, dashCooldown: s.dashCooldown * 0.8 }) },
  { id: 'dash_dmg', name: 'Blade Rush', description: 'Dash deals damage to nearby enemies', rarity: 'epic', icon: '🌀', maxStacks: 2,
    apply: (s) => ({ ...s, dashCooldown: s.dashCooldown * 0.9, damage: s.damage + 10 }) },

  // --- UTILITY ---
  { id: 'xp_boost', name: 'Scholar', description: '+25% XP gain', rarity: 'common', icon: '📚', maxStacks: 5,
    apply: (s) => ({ ...s, xpMultiplier: s.xpMultiplier + 25 }) },
  { id: 'gold_boost', name: 'Greed', description: '+30% coin drops', rarity: 'common', icon: '💰', maxStacks: 5,
    apply: (s) => ({ ...s, goldMultiplier: s.goldMultiplier + 30 }) },
  { id: 'magnet', name: 'Magnet', description: '+80 XP pickup radius', rarity: 'rare', icon: '🧲', maxStacks: 4,
    apply: (s) => ({ ...s, magnetRadius: s.magnetRadius + 80 }) },
  { id: 'luck', name: 'Lucky Charm', description: '+10 luck (better upgrade rarity)', rarity: 'rare', icon: '🍀', maxStacks: 5,
    apply: (s) => ({ ...s, luck: s.luck + 10 }) },

  // --- LEGENDARY ---
  { id: 'berserker', name: 'Berserker', description: '+5% damage for each % missing HP', rarity: 'legendary', icon: '😡', maxStacks: 1,
    apply: (s) => ({ ...s, critChance: s.critChance + 20, damage: s.damage + 25 }) },
  { id: 'glass_cannon', name: 'Glass Cannon', description: '+60% damage, -30% max health', rarity: 'legendary', icon: '🔮', maxStacks: 1,
    apply: (s) => ({ ...s, damage: s.damage + 60, maxHealth: Math.max(50, s.maxHealth - 30) }) },
  { id: 'immortal', name: 'Second Chance', description: 'Survive one hit at 1HP (one time)', rarity: 'legendary', icon: '👼', maxStacks: 1,
    apply: (s) => ({ ...s, maxHealth: s.maxHealth + 50, armor: s.armor + 15 }) },
  { id: 'overcharge', name: 'Overcharge', description: '+40% attack speed & +20% bullet size', rarity: 'legendary', icon: '⚡', maxStacks: 1,
    apply: (s) => ({ ...s, attackSpeed: s.attackSpeed + 40, bulletSize: s.bulletSize + 20 }) },
];

export function getDefaultStats(): PlayerStats {
  return {
    maxHealth: 100, health: 100, armor: 0, speed: 200, dashCooldown: 3000, dashDuration: 200,
    luck: 0, critChance: 5, critMultiplier: 150, dodgeChance: 0, regen: 0, magnetRadius: 120,
    damage: 100, attackSpeed: 100, bulletSpeed: 100, bulletSize: 100, piercing: 0,
    lifeSteal: 0, xpMultiplier: 100, goldMultiplier: 100,
  };
}

export function rollUpgrades(
  applied: Map<string, number>,
  luck: number,
  count = 3
): Upgrade[] {
  const available = ALL_UPGRADES.filter((u) => {
    const stacks = applied.get(u.id) || 0;
    return stacks < u.maxStacks;
  });

  // Weight by rarity based on luck
  const luckFactor = 1 + luck / 100;
  const weights: Record<string, number> = {
    common: 50,
    rare: Math.round(25 * luckFactor),
    epic: Math.round(15 * luckFactor),
    legendary: Math.round(5 * luckFactor),
  };

  const pool: Upgrade[] = [];
  for (const u of available) {
    const w = weights[u.rarity] || 1;
    for (let i = 0; i < w; i++) pool.push(u);
  }

  const picked: Upgrade[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count && pool.length > 0; i++) {
    let attempts = 0;
    while (attempts < 100) {
      const idx = Math.floor(Math.random() * pool.length);
      const candidate = pool[idx];
      if (!usedIds.has(candidate.id)) {
        picked.push(candidate);
        usedIds.add(candidate.id);
        break;
      }
      attempts++;
    }
  }

  return picked;
}
