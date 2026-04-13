'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';

export default function GameOverScreen() {
  const { timeAlive, enemiesKilled, runLevel, runCoins, startRun, setScreen, coins } = useGameStore();

  // resetGame isn't defined — we just go back to menu (coins were banked on endRun)
  const goMenu = () => setScreen('menu');

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background:'linear-gradient(160deg,#080810 0%,#1a0a0a 100%)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

      <motion.h1 className="text-5xl font-bold mb-2 tracking-widest"
        style={{ color:'#ef5350', fontFamily:'Courier New', textShadow:'0 0 22px #ef535077' }}
        initial={{ scale:0.6, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:180 }}>
        YOU DIED
      </motion.h1>

      <motion.p className="mb-8 text-sm" style={{ color:'#546e7a', fontFamily:'Courier New' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
        The horde overwhelmed you.
      </motion.p>

      <motion.div className="mb-10 text-center"
        style={{ color:'#90a4ae', fontFamily:'Courier New', lineHeight:2 }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
        <p>Time survived: <span style={{ color:'#4fc3f7' }}>{Math.floor(timeAlive)}s</span></p>
        <p>Enemies killed: <span style={{ color:'#4fc3f7' }}>{enemiesKilled}</span></p>
        <p>Level reached: <span style={{ color:'#4fc3f7' }}>{runLevel}</span></p>
        <p>Coins earned: <span style={{ color:'#ffd700' }}>{runCoins}</span></p>
        <p className="mt-1" style={{ color:'#ffd700' }}>Total coins: {coins}</p>
      </motion.div>

      <div className="flex gap-4">
        {[
          { label:'PLAY AGAIN', action: startRun, border:'#ef5350', color:'#ef5350' },
          { label:'MAIN MENU', action: goMenu,  border:'#546e7a', color:'#90a4ae' },
        ].map((btn, i) => (
          <motion.button key={btn.label}
            className="px-8 py-3 text-sm tracking-widest border-2 rounded"
            style={{ background:'transparent', borderColor:btn.border, color:btn.color, fontFamily:'Courier New', cursor:'pointer' }}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 + i*0.1 }}
            whileHover={{ scale:1.05, backgroundColor: btn.border+'22' }}
            whileTap={{ scale:0.97 }}
            onClick={btn.action}>
            {btn.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
