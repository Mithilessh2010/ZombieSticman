// src/components/SkillTree.tsx
'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  onClose: () => void;
}

export default function SkillTree({ onClose }: Props) {
  const { skillNodes, unlockSkill, totalCoins } = useGameStore();

  const canAfford = (cost: number) => totalCoins >= cost;
  const canUnlock = (id: string) => {
    const node = skillNodes.find(n => n.id === id);
    if (!node || node.unlocked) return false;
    if (!canAfford(node.cost)) return false;
    return node.requires.every(r => skillNodes.find(n => n.id === r)?.unlocked);
  };

  const rowCount = Math.max(...skillNodes.map(n => n.row)) + 1;
  const colCount = Math.max(...skillNodes.map(n => n.col)) + 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-50 overflow-auto py-8"
      style={{ background: 'rgba(11,15,26,0.97)', backdropFilter: 'blur(20px)' }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-3xl mx-auto px-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#a78bfa' }}>Persistent</div>
            <h2 className="text-3xl font-black text-white">Skill Tree</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <span className="text-lg font-black text-amber-400">{totalCoins} 💰</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-sm text-white/60 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ✕ Close
            </motion.button>
          </div>
        </div>

        {/* Grid */}
        <div className="relative" style={{ minHeight: rowCount * 120 }}>
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {skillNodes.map(node =>
              node.requires.map(reqId => {
                const req = skillNodes.find(n => n.id === reqId);
                if (!req) return null;
                const x1 = (req.col / (colCount - 1)) * 100;
                const y1 = (req.row / Math.max(rowCount - 1, 1)) * 100;
                const x2 = (node.col / (colCount - 1)) * 100;
                const y2 = (node.row / Math.max(rowCount - 1, 1)) * 100;
                const unlocked = req.unlocked && node.unlocked;
                return (
                  <line key={`${node.id}-${reqId}`}
                    x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                    stroke={unlocked ? '#22c55e' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={2}
                    strokeDasharray={unlocked ? undefined : '4 4'}
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {skillNodes.map((node) => {
            const left = `${(node.col / (colCount - 1)) * 100}%`;
            const top = `${(node.row / Math.max(rowCount - 1, 1)) * 100}%`;
            const unlockable = canUnlock(node.id);
            const locked = !node.unlocked && !unlockable;

            return (
              <motion.div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left, top, zIndex: 1 }}
                whileHover={!node.unlocked ? { scale: 1.05 } : {}}
              >
                <div className="relative group">
                  <motion.button
                    onClick={() => unlockable && unlockSkill(node.id)}
                    disabled={!unlockable}
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200"
                    style={{
                      background: node.unlocked
                        ? 'linear-gradient(135deg, #14532d, #16a34a)'
                        : unlockable
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${node.unlocked ? '#22c55e' : unlockable ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: node.unlocked ? '0 0 20px rgba(34,197,94,0.3)' : unlockable ? '0 0 10px rgba(34,197,94,0.15)' : 'none',
                      opacity: locked ? 0.4 : 1,
                      cursor: unlockable ? 'pointer' : 'default',
                    }}
                  >
                    {node.unlocked
                      ? <span className="text-2xl">✓</span>
                      : <span className="text-xl">🔒</span>
                    }
                    <span className="text-[9px] font-bold text-center px-1 leading-tight"
                      style={{ color: node.unlocked ? '#86efac' : unlockable ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
                      {node.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </motion.button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                    <div className="text-xs font-black text-white mb-1">{node.name}</div>
                    <div className="text-[10px] text-white/50 mb-2">{node.description}</div>
                    {!node.unlocked && (
                      <div className="text-[10px] font-bold" style={{ color: canAfford(node.cost) ? '#fbbf24' : '#ef4444' }}>
                        Cost: {node.cost} 💰
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-white/25 mt-8">
          Earn coins during runs • Permanent upgrades carry into every run
        </p>
      </motion.div>
    </motion.div>
  );
}
