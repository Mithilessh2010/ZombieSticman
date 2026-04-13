'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import { STORY_BEATS } from '@/game/data/gameData';

export default function MainMenu() {
  const { showStory, setLevel, setPlayerHealth, playerStats } = useGameStore();

  const handleStart = () => {
    setLevel(1);
    setPlayerHealth(playerStats.maxHealth);
    showStory(STORY_BEATS.start, 'playing');
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated stickman logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <svg width="80" height="120" viewBox="0 0 80 120">
          <circle cx="40" cy="20" r="14" stroke="#4fc3f7" strokeWidth="3" fill="none" />
          <line x1="40" y1="34" x2="40" y2="74" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="46" x2="16" y2="62" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="46" x2="64" y2="62" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="74" x2="24" y2="108" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="74" x2="56" y2="108" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.h1
        className="text-5xl font-bold mt-4 mb-2 tracking-widest"
        style={{ color: '#4fc3f7', fontFamily: 'Courier New', textShadow: '0 0 20px #4fc3f7aa' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        STICKMAN
      </motion.h1>

      <motion.h2
        className="text-2xl mb-12 tracking-[0.3em]"
        style={{ color: '#90a4ae' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        LAST STAND
      </motion.h2>

      <motion.button
        className="px-10 py-4 text-xl tracking-widest border-2 rounded"
        style={{
          background: 'transparent',
          borderColor: '#4fc3f7',
          color: '#4fc3f7',
          fontFamily: 'Courier New',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05, backgroundColor: '#4fc3f722' }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
      >
        START GAME
      </motion.button>

      <motion.p
        className="mt-10 text-sm"
        style={{ color: '#546e7a', fontFamily: 'Courier New' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        WASD / Arrows: Move &nbsp;|&nbsp; Z / J / Enter: Punch
      </motion.p>
    </motion.div>
  );
}
