// src/components/HUD.tsx
'use client';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { WEAPONS } from '@/game/weapons';
import { WeaponType } from '@/types';

const RARITY_COLORS: Record<string, string> = {
  common: '#94a3b8', rare: '#38bdf8', epic: '#a78bfa', legendary: '#fbbf24',
};

export default function HUD() {
  const {
    wave, playerHealth, playerMaxHealth, playerLevel, playerXP, playerXPToNext,
    ammo, maxAmmo, isReloading, reloadProgress, currentWeapon,
    kills, coins, dashCooldownPct, bossHP, bossMaxHP,
  } = useGameStore();

  const hpPct = Math.max(0, playerHealth / playerMaxHealth);
  const xpPct = playerXP / playerXPToNext;
  const hpColor = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#fbbf24' : '#ef4444';

  // Find current weapon rarity
  const weaponEntry = Object.values(WEAPONS).find(w => w.name === currentWeapon);
  const weaponRarityColor = weaponEntry ? RARITY_COLORS[weaponEntry.rarity] : '#94a3b8';

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-4 pt-3 gap-4">
        {/* Health */}
        <div className="flex flex-col gap-1 min-w-[220px]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Health</span>
            <span className="text-sm font-bold" style={{ color: hpColor }}>
              {Math.ceil(playerHealth)} / {playerMaxHealth}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${hpColor}aa, ${hpColor})`, boxShadow: `0 0 8px ${hpColor}` }}
              animate={{ width: `${hpPct * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </div>
        </div>

        {/* Wave + Kills */}
        <div className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-xs text-white/50 tracking-widest uppercase">Wave</span>
          <span className="text-2xl font-black text-white leading-none">{wave}</span>
        </div>

        {/* Coins + Kills */}
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-base">💰</span>
            <span className="text-sm font-bold text-amber-400">{coins}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-base">💀</span>
            <span className="text-sm font-bold text-white">{kills}</span>
          </div>
        </div>
      </div>

      {/* XP BAR */}
      <div className="absolute top-[60px] left-0 right-0 px-4">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.15)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', boxShadow: '0 0 6px #a78bfa' }}
            animate={{ width: `${xpPct * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </div>
        <div className="flex justify-between mt-0.5 px-0.5">
          <span className="text-[10px] font-bold text-purple-400">LVL {playerLevel}</span>
          <span className="text-[10px] text-white/30">{playerXP} / {playerXPToNext} XP</span>
        </div>
      </div>

      {/* BOSS HP BAR */}
      <AnimatePresence>
        {bossHP !== null && bossMaxHP !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] max-w-[90vw]"
          >
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-black text-red-400 tracking-widest uppercase">⚠ BOSS</span>
                <span className="text-xs text-red-300">{Math.ceil(bossHP)} / {bossMaxHP}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7f1d1d, #ef4444)', boxShadow: '0 0 10px #ef4444' }}
                  animate={{ width: `${(bossHP / bossMaxHP) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM - Weapon + Ammo + Dash */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">

        {/* Reload bar */}
        <AnimatePresence>
          {isReloading && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="px-4 py-1 rounded-full text-xs font-bold tracking-widest"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fbbf24' }}>
              RELOADING... {Math.round(reloadProgress * 100)}%
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weapon info card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.65)', border: `1px solid ${weaponRarityColor}44`, backdropFilter: 'blur(8px)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: weaponRarityColor }}>{weaponEntry?.rarity || 'common'}</div>
            <div className="text-sm font-bold text-white">{currentWeapon}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-xl font-black leading-none" style={{ color: isReloading ? '#fbbf24' : 'white' }}>
              {ammo}
            </div>
            <div className="text-[10px] text-white/40">/{maxAmmo}</div>
          </div>
          {/* Ammo pips */}
          <div className="flex flex-wrap gap-[2px] max-w-[80px]">
            {Array.from({ length: Math.min(maxAmmo, 20) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: i < ammo ? weaponRarityColor : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>

        {/* Dash cooldown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Dash</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #38bdf8, #7dd3fc)', boxShadow: '0 0 4px #38bdf8' }}
              animate={{ width: `${(1 - dashCooldownPct) * 100}%` }}
              transition={{ type: 'linear' }}
            />
          </div>
          <span className="text-[10px]">{dashCooldownPct > 0 ? '⏳' : '✓'}</span>
        </div>
      </div>

      {/* WEAPON SLOTS - bottom right */}
      <WeaponSlots />

      {/* Controls hint - bottom left */}
      <div className="absolute bottom-5 left-4 text-[10px] text-white/25 leading-relaxed">
        <div>WASD Move  •  Click Shoot  •  Shift Dash</div>
        <div>R Reload  •  1-5 Weapons  •  ESC Pause</div>
      </div>
    </div>
  );
}

function WeaponSlots() {
  const { currentWeapon } = useGameStore();

  // Can't easily read inventory from store, show placeholder
  return null;
}
