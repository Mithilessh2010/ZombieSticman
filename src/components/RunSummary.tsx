// src/components/RunSummary.tsx
'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  onRestart: () => void;
  onMenu: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RunSummary({ onRestart, onMenu }: Props) {
  const { runStats, coins, bestStats } = useGameStore();

  if (!runStats) return null;

  const accuracy = runStats.shotsFired > 0 ? Math.round((runStats.shotsHit / runStats.shotsFired) * 100) : 0;

  const statRows = [
    { label: 'Waves Survived', value: runStats.wavesReached, icon: '🌊', color: '#22c55e' },
    { label: 'Enemies Killed', value: runStats.kills, icon: '💀', color: '#ef4444' },
    { label: 'Damage Dealt', value: runStats.damageDealt.toLocaleString(), icon: '💥', color: '#f97316' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: '#38bdf8' },
    { label: 'XP Gained', value: runStats.xpGained.toLocaleString(), icon: '✨', color: '#a78bfa' },
    { label: 'Coins Earned', value: runStats.coinsEarned, icon: '💰', color: '#fbbf24' },
    { label: 'Time Survived', value: formatTime(runStats.timeAlive), icon: '⏱', color: '#94a3b8' },
  ];

  const isNewBest = runStats.wavesReached >= bestStats.highestWave;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center z-50 overflow-auto py-8"
      style={{ background: 'rgba(11,15,26,0.96)', backdropFilter: 'blur(20px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.1 }}
        className="w-[420px] max-w-[95vw] rounded-3xl p-8 mx-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
      >
        {/* Death header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="text-5xl mb-3">💀</div>
          <h2 className="text-3xl font-black text-white leading-none">You Died</h2>
          {isNewBest && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#1c1400' }}
            >
              🏆 New Best Wave!
            </motion.div>
          )}
        </motion.div>

        {/* Coins earned */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-3 mb-6 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
        >
          <div className="text-2xl font-black text-amber-400">+{runStats.coinsEarned} 💰</div>
          <div className="text-xs text-white/40 mt-0.5">Coins earned this run</div>
        </motion.div>

        {/* Stats grid */}
        <div className="space-y-2 mb-8">
          {statRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{row.icon}</span>
                <span className="text-sm text-white/60">{row.label}</span>
              </div>
              <span className="text-sm font-black" style={{ color: row.color }}>{row.value}</span>
            </motion.div>
          ))}
        </div>

        {/* All-time bests */}
        <div className="py-3 px-4 rounded-xl mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">All Time</div>
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Best Wave: <span className="text-green-400 font-bold">{bestStats.highestWave}</span></span>
            <span className="text-white/50">Total Kills: <span className="text-red-400 font-bold">{bestStats.totalKills}</span></span>
            <span className="text-white/50">Runs: <span className="text-white/70 font-bold">{bestStats.totalRuns}</span></span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm tracking-wide"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}
          >
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onMenu}
            className="flex-1 py-3.5 rounded-2xl font-bold text-white/60 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
