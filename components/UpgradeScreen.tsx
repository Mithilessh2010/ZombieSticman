'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import { LEVELS, STORY_BEATS } from '@/game/data/gameData';

export default function UpgradeScreen() {
  const { upgradeChoices, applyUpgrade, currentLevel, setLevel, setScreen, showStory, playerStats, setPlayerHealth } = useGameStore();

  const handlePick = (id: string) => {
    applyUpgrade(id);

    const nextLevelIndex = currentLevel; // currentLevel is 1-based, array is 0-based
    if (nextLevelIndex >= LEVELS.length) {
      setScreen('victory');
      return;
    }

    const nextLevel = LEVELS[nextLevelIndex];
    setLevel(nextLevel.id);

    const storyKey = nextLevel.hasBoss ? 'before_boss' : `after_${currentLevel}`;
    const storyText = STORY_BEATS[storyKey] ?? STORY_BEATS[`after_${currentLevel}`] ?? 'Onward.';
    showStory(storyText, 'playing');
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a1a 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2
        className="text-3xl tracking-widest mb-2"
        style={{ color: '#ffd700', fontFamily: 'Courier New', textShadow: '0 0 12px #ffd70066' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        CHOOSE AN UPGRADE
      </motion.h2>
      <p className="mb-10 text-sm" style={{ color: '#546e7a', fontFamily: 'Courier New' }}>
        Pick one to carry into the next level
      </p>

      <div className="flex gap-6 flex-wrap justify-center px-8">
        {upgradeChoices.map((u, i) => (
          <motion.button
            key={u.id}
            className="flex flex-col items-center p-6 rounded-lg border-2 w-48"
            style={{
              background: '#0d0d1a',
              borderColor: '#4fc3f7',
              color: '#e0e0e0',
              fontFamily: 'Courier New',
              cursor: 'pointer',
              minHeight: 160,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ scale: 1.07, borderColor: '#ffd700', backgroundColor: '#1a1a2e' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handlePick(u.id)}
          >
            <span className="text-3xl mb-3">{u.label.split(' ')[0]}</span>
            <span className="text-sm font-bold mb-2 text-center leading-tight" style={{ color: '#4fc3f7' }}>
              {u.label.split(' ').slice(1).join(' ')}
            </span>
            <span className="text-xs text-center" style={{ color: '#90a4ae' }}>
              {u.description}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
