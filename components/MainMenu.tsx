'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';

export default function MainMenu() {
  const { startRun, setScreen, coins } = useGameStore();

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#080810 0%,#12102a 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* stickman logo */}
      <motion.svg width="70" height="110" viewBox="0 0 70 110"
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
        <circle cx="35" cy="16" r="13" stroke="#4fc3f7" strokeWidth="2.5" fill="none"/>
        <line x1="35" y1="29" x2="35" y2="68" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="35" y1="42" x2="12" y2="58" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="35" y1="42" x2="58" y2="42" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="35" y1="68" x2="20" y2="100" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="35" y1="68" x2="50" y2="100" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
      </motion.svg>

      <motion.h1 className="text-5xl font-bold mt-3 tracking-widest"
        style={{ color:'#4fc3f7', fontFamily:'Courier New', textShadow:'0 0 24px #4fc3f7aa' }}
        initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.25 }}>
        STICKMAN
      </motion.h1>
      <motion.h2 className="text-xl tracking-[0.4em] mb-2"
        style={{ color:'#90a4ae', fontFamily:'Courier New' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
        LAST STAND
      </motion.h2>
      <motion.p className="text-xs mb-10" style={{ color:'#ffd700', fontFamily:'Courier New' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
        💰 {coins} coins saved
      </motion.p>

      {[
        { label: '▶  START RUN',  action: startRun,           border:'#4fc3f7', color:'#4fc3f7' },
        { label: '🛒  SHOP',       action: ()=>setScreen('shop'), border:'#ffd700', color:'#ffd700' },
        { label: '🎒  INVENTORY',  action: ()=>setScreen('inventory'), border:'#ce93d8', color:'#ce93d8' },
      ].map((btn, i) => (
        <motion.button key={btn.label}
          className="px-10 py-3 mb-3 text-base tracking-widest border-2 rounded w-56"
          style={{ background:'transparent', borderColor:btn.border, color:btn.color, fontFamily:'Courier New', cursor:'pointer' }}
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 + i*0.1 }}
          whileHover={{ scale:1.05, backgroundColor: btn.border + '22' }}
          whileTap={{ scale:0.97 }}
          onClick={btn.action}>
          {btn.label}
        </motion.button>
      ))}

      <motion.p className="mt-8 text-xs" style={{ color:'#455a64', fontFamily:'Courier New' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}>
        A/D move · Space jump · Auto-aims nearest zombie
      </motion.p>
    </motion.div>
  );
}
