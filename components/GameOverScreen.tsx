'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';

export default function GameOverScreen() {
  const { currentLevel, enemiesDefeated, totalCoins, resetGame } = useGameStore();

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#050508' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="text-5xl font-bold mb-4 tracking-widest"
        style={{ color: '#ef5350', fontFamily: 'Courier New', textShadow: '0 0 20px #ef535066' }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        GAME OVER
      </motion.h1>

      <motion.div
        className="mt-8 mb-12 text-center"
        style={{ color: '#90a4ae', fontFamily: 'Courier New' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-lg mb-2">Levels completed: <span style={{ color: '#4fc3f7' }}>{currentLevel - 1}</span></p>
        <p className="text-lg mb-2">Enemies defeated: <span style={{ color: '#4fc3f7' }}>{enemiesDefeated}</span></p>
        <p className="text-lg">Coins collected: <span style={{ color: '#ffd700' }}>{totalCoins}</span></p>
      </motion.div>

      <motion.button
        className="px-10 py-4 text-xl tracking-widest border-2 rounded"
        style={{
          background: 'transparent',
          borderColor: '#ef5350',
          color: '#ef5350',
          fontFamily: 'Courier New',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05, backgroundColor: '#ef535022' }}
        whileTap={{ scale: 0.97 }}
        onClick={resetGame}
      >
        TRY AGAIN
      </motion.button>
    </motion.div>
  );
}
