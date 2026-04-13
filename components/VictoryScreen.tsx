'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import { STORY_BEATS } from '@/game/data/gameData';

export default function VictoryScreen() {
  const { enemiesDefeated, totalCoins, resetGame } = useGameStore();

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #050508 0%, #1a0a2e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti particles via CSS */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#ffd700','#4fc3f7','#ce93d8','#66bb6a','#ef5350'][i % 5],
            left: `${5 + i * 5.5}%`,
            top: '10%',
          }}
          animate={{ y: ['0vh', '80vh'], opacity: [1, 0], rotate: [0, 360 * (i % 3 === 0 ? 1 : -1)] }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      <motion.h1
        className="text-5xl font-bold mb-4 tracking-widest text-center"
        style={{ color: '#ffd700', fontFamily: 'Courier New', textShadow: '0 0 30px #ffd70088' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, delay: 0.2 }}
      >
        VICTORY!
      </motion.h1>

      <motion.p
        className="text-lg mb-10 text-center max-w-md px-8 leading-relaxed"
        style={{ color: '#cfd8dc', fontFamily: 'Courier New' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {STORY_BEATS.after_boss}
      </motion.p>

      <motion.div
        className="mb-10 text-center"
        style={{ color: '#90a4ae', fontFamily: 'Courier New' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-base mb-1">Enemies defeated: <span style={{ color: '#4fc3f7' }}>{enemiesDefeated}</span></p>
        <p className="text-base">Coins collected: <span style={{ color: '#ffd700' }}>{totalCoins}</span></p>
      </motion.div>

      <motion.button
        className="px-10 py-4 text-xl tracking-widest border-2 rounded"
        style={{
          background: 'transparent',
          borderColor: '#ffd700',
          color: '#ffd700',
          fontFamily: 'Courier New',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05, backgroundColor: '#ffd70022' }}
        whileTap={{ scale: 0.97 }}
        onClick={resetGame}
      >
        PLAY AGAIN
      </motion.button>
    </motion.div>
  );
}
