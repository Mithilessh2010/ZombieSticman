// src/components/MainMenu.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import SkillTree from './SkillTree';
import { MAP_CONFIG } from '@/game/background';

const MAPS = ['city', 'lab', 'desert', 'snow', 'forest'] as const;
type MapType = typeof MAPS[number];

interface Props {
  onStart: (map: MapType) => void;
}

export default function MainMenu({ onStart }: Props) {
  const { totalCoins, bestStats, screen, setScreen } = useGameStore();
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [selectedMap, setSelectedMap] = useState<MapType>('city');
  const [hoveredMap, setHoveredMap] = useState<MapType | null>(null);

  const displayMap = hoveredMap || selectedMap;
  const mapCfg = MAP_CONFIG[displayMap];

  // Floating particles for menu BG
  const [particles] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 4,
  })));

  if (showSkillTree) {
    return <SkillTree onClose={() => setShowSkillTree(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0b0f1a', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: mapCfg.ambientColor }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Radial glow */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 60%, ${mapCfg.ambientColor}18 0%, transparent 70%)`
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6">

        {/* Logo */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 14 }}
          className="text-center mb-2"
        >
          <div className="text-xs font-bold tracking-[0.5em] uppercase mb-3" style={{ color: mapCfg.ambientColor }}>
            Roguelike Survivor
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter mb-1">
            STICKMAN
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black leading-none tracking-widest uppercase"
            style={{ color: mapCfg.ambientColor }}>
            Last Stand
          </h2>
          <div className="mt-3 text-xs text-white/30 tracking-widest">
            Top-down • Roguelike • Survival
          </div>
        </motion.div>

        {/* Best stats banner */}
        {bestStats.totalRuns > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mt-4 mb-6 px-5 py-2 rounded-full text-xs"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-white/40">Best Wave: <span className="text-green-400 font-bold">{bestStats.highestWave}</span></span>
            <span className="text-white/20">|</span>
            <span className="text-white/40">Kills: <span className="text-red-400 font-bold">{bestStats.totalKills}</span></span>
            <span className="text-white/20">|</span>
            <span className="text-white/40">Runs: <span className="text-white font-bold">{bestStats.totalRuns}</span></span>
          </motion.div>
        )}

        {/* Map selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full mb-6 mt-4"
        >
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest text-center mb-3">Select Map</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {MAPS.map(map => {
              const cfg = MAP_CONFIG[map];
              const isSelected = selectedMap === map;
              return (
                <motion.button
                  key={map}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMap(map)}
                  onMouseEnter={() => setHoveredMap(map)}
                  onMouseLeave={() => setHoveredMap(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{
                    background: isSelected ? cfg.ambientColor + '25' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected ? cfg.ambientColor + '80' : 'rgba(255,255,255,0.08)'}`,
                    color: isSelected ? cfg.ambientColor : 'rgba(255,255,255,0.45)',
                    boxShadow: isSelected ? `0 0 12px ${cfg.ambientColor}30` : 'none',
                  }}
                >
                  {cfg.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Play button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 160, damping: 16 }}
          className="w-full mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStart(selectedMap)}
            className="w-full py-4 rounded-2xl font-black text-xl text-white tracking-wide relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${mapCfg.ambientColor}cc, ${mapCfg.ambientColor})`,
              boxShadow: `0 0 30px ${mapCfg.ambientColor}50, 0 4px 16px rgba(0,0,0,0.4)`,
            }}
          >
            <span className="relative z-10">▶ PLAY</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
              style={{ background: 'linear-gradient(135deg, white, transparent)' }} />
          </motion.button>
        </motion.div>

        {/* Secondary buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex gap-3 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowSkillTree(true)}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa' }}
          >
            🌳 Skill Tree
            <span className="px-1.5 py-0.5 rounded-full text-xs font-black"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
              {totalCoins}💰
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setScreen('settings')}
            className="flex-1 py-3 rounded-2xl font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}
          >
            ⚙ Settings
          </motion.button>
        </motion.div>

        {/* Controls summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 text-center text-xs text-white/20 leading-relaxed"
        >
          WASD Move  •  Mouse Aim  •  Click Shoot  •  Shift Dash  •  R Reload
        </motion.div>
      </div>
    </motion.div>
  );
}
