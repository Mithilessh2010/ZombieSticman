// src/components/PauseMenu.tsx
'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  onResume: () => void;
  onQuit: () => void;
}

export default function PauseMenu({ onResume, onQuit }: Props) {
  const { wave, kills, coins, screenShake, setScreenShake, showDamageNumbers, setShowDamageNumbers, volume, setVolume } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(11,15,26,0.88)', backdropFilter: 'blur(16px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-[380px] rounded-3xl p-8"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#38bdf8' }}>Paused</div>
          <h2 className="text-3xl font-black text-white">Game Paused</h2>
        </div>

        {/* Run stats summary */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Wave', value: wave, color: '#22c55e' },
            { label: 'Kills', value: kills, color: '#ef4444' },
            { label: 'Coins', value: coins, color: '#fbbf24' },
          ].map(stat => (
            <div key={stat.label} className="text-center py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="space-y-3 mb-8">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Settings</div>

          {/* Volume */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">🔊 Volume</span>
            <input type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-28 accent-green-400" />
          </div>

          {/* Screen Shake */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">📳 Screen Shake</span>
            <button onClick={() => setScreenShake(!screenShake)}
              className="w-10 h-5 rounded-full transition-all duration-200 relative"
              style={{ background: screenShake ? '#22c55e' : 'rgba(255,255,255,0.1)' }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: screenShake ? '22px' : '2px' }} />
            </button>
          </div>

          {/* Damage Numbers */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">🔢 Damage Numbers</span>
            <button onClick={() => setShowDamageNumbers(!showDamageNumbers)}
              className="w-10 h-5 rounded-full transition-all duration-200 relative"
              style={{ background: showDamageNumbers ? '#22c55e' : 'rgba(255,255,255,0.1)' }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: showDamageNumbers ? '22px' : '2px' }} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-3.5 rounded-2xl font-black text-base text-white tracking-wide"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}
          >
            ▶ Resume
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 rounded-2xl font-bold text-sm text-white/50 hover:text-white/80 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Quit to Menu
          </motion.button>
        </div>

        <p className="text-center text-xs text-white/25 mt-4">Press ESC to resume</p>
      </motion.div>
    </motion.div>
  );
}
