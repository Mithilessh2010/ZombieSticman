'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';

export default function UpgradeScreen() {
  const { upgradeChoices, applyUpgrade, runLevel } = useGameStore();

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background:'rgba(5,5,14,0.92)', backdropFilter:'blur(4px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

      <motion.h2 className="text-3xl tracking-widest mb-1"
        style={{ color:'#ffd700', fontFamily:'Courier New', textShadow:'0 0 14px #ffd70077' }}
        initial={{ y:-18, opacity:0 }} animate={{ y:0, opacity:1 }}>
        LEVEL UP!
      </motion.h2>
      <p className="mb-10 text-sm tracking-widest" style={{ color:'#546e7a', fontFamily:'Courier New' }}>
        Level {runLevel} — choose an upgrade
      </p>

      <div className="flex gap-5 flex-wrap justify-center px-8">
        {upgradeChoices.map((u, i) => (
          <motion.button key={u.id}
            className="flex flex-col items-center p-6 rounded-xl border-2 w-44"
            style={{ background:'#0d0d1e', borderColor:'#4fc3f7', color:'#e0e0e0', fontFamily:'Courier New', cursor:'pointer', minHeight:155 }}
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}
            whileHover={{ scale:1.07, borderColor:'#ffd700', backgroundColor:'#1a1a30' }}
            whileTap={{ scale:0.96 }}
            onClick={() => applyUpgrade(u.id)}>
            <span className="text-4xl mb-3">{u.icon}</span>
            <span className="text-xs font-bold mb-2 text-center leading-tight" style={{ color:'#4fc3f7', letterSpacing:'0.05em' }}>
              {u.label.toUpperCase()}
            </span>
            <span className="text-xs text-center" style={{ color:'#78909c' }}>{u.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
