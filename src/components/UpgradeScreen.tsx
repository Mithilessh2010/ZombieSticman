// src/components/UpgradeScreen.tsx
'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ALL_UPGRADES } from '@/game/upgrades';

const RARITY_STYLES: Record<string, { border: string; glow: string; badge: string; bg: string }> = {
  common:    { border: '#475569', glow: 'rgba(71,85,105,0.3)',   badge: '#475569', bg: 'rgba(71,85,105,0.08)' },
  rare:      { border: '#38bdf8', glow: 'rgba(56,189,248,0.25)', badge: '#0284c7', bg: 'rgba(56,189,248,0.08)' },
  epic:      { border: '#a78bfa', glow: 'rgba(167,139,250,0.3)', badge: '#7c3aed', bg: 'rgba(167,139,250,0.08)' },
  legendary: { border: '#fbbf24', glow: 'rgba(251,191,36,0.35)', badge: '#d97706', bg: 'rgba(251,191,36,0.1)' },
};

export default function UpgradeScreen() {
  const { upgradeChoices, chooseUpgrade, playerLevel } = useGameStore();

  const upgrades = upgradeChoices
    .map(id => ALL_UPGRADES.find(u => u.id === id))
    .filter(Boolean) as typeof ALL_UPGRADES;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'rgba(11,15,26,0.92)', backdropFilter: 'blur(12px)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <div className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#a78bfa' }}>
          Level Up!
        </div>
        <h2 className="text-4xl font-black text-white leading-none">
          LEVEL <span style={{ color: '#22c55e' }}>{playerLevel}</span>
        </h2>
        <p className="text-sm text-white/40 mt-2">Choose an upgrade to enhance your arsenal</p>
      </motion.div>

      {/* Upgrade Cards */}
      <div className="flex gap-5 px-4 flex-wrap justify-center">
        {upgrades.map((upgrade, i) => {
          const style = RARITY_STYLES[upgrade.rarity];
          return (
            <motion.button
              key={upgrade.id}
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => chooseUpgrade(upgrade.id)}
              className="relative w-60 p-5 rounded-2xl text-left cursor-pointer transition-all duration-200"
              style={{
                background: style.bg,
                border: `1.5px solid ${style.border}`,
                boxShadow: `0 0 24px ${style.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Rarity badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                style={{ background: style.badge }}>
                {upgrade.rarity}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-3 leading-none">{upgrade.icon}</div>

              {/* Name */}
              <h3 className="text-base font-black text-white mb-1.5 leading-tight pr-12">{upgrade.name}</h3>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {upgrade.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${style.glow}, transparent 70%)` }} />
            </motion.button>
          );
        })}
      </div>

      {/* Subtle animated background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
