// src/components/SettingsMenu.tsx
'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: Props) {
  const { volume, setVolume, screenShake, setScreenShake, showDamageNumbers, setShowDamageNumbers } = useGameStore();

  const keybinds = [
    { action: 'Move', key: 'WASD / Arrow Keys' },
    { action: 'Aim', key: 'Mouse' },
    { action: 'Shoot', key: 'Left Click' },
    { action: 'Dash', key: 'Shift' },
    { action: 'Reload', key: 'R' },
    { action: 'Pause', key: 'ESC' },
    { action: 'Swap Weapon', key: '1 – 5' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'rgba(11,15,26,0.97)', backdropFilter: 'blur(20px)', fontFamily: 'Inter, sans-serif' }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        className="w-[400px] max-w-[95vw] rounded-3xl p-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">Settings</h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            ✕
          </motion.button>
        </div>

        {/* Audio */}
        <div className="mb-6">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Audio</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">🔊 Master Volume</span>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-28 accent-green-400" />
              <span className="text-xs font-bold text-white/50 w-8 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="mb-6 space-y-3">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Visual</div>
          {[
            { label: '📳 Screen Shake', value: screenShake, set: setScreenShake },
            { label: '🔢 Damage Numbers', value: showDamageNumbers, set: setShowDamageNumbers },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-white/70">{item.label}</span>
              <button onClick={() => item.set(!item.value)}
                className="w-10 h-5 rounded-full transition-all duration-200 relative"
                style={{ background: item.value ? '#22c55e' : 'rgba(255,255,255,0.1)' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: item.value ? '22px' : '2px' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Keybinds */}
        <div className="mb-6">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Controls</div>
          <div className="space-y-2">
            {keybinds.map(kb => (
              <div key={kb.action} className="flex items-center justify-between py-1.5 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-sm text-white/60">{kb.action}</span>
                <kbd className="px-2 py-0.5 rounded-md text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {kb.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 16px rgba(34,197,94,0.25)' }}
        >
          Save & Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
