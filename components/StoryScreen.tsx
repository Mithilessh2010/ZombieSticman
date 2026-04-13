'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';

export default function StoryScreen() {
  const { storyText, proceedStory } = useGameStore();

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-12"
      style={{ background: '#050508' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={proceedStory}
    >
      <motion.div
        className="max-w-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {storyText.split('\n').map((line, i) => (
          <p
            key={i}
            className="text-xl leading-relaxed mb-4"
            style={{
              color: '#cfd8dc',
              fontFamily: 'Courier New',
              textShadow: '0 0 8px #4fc3f744',
            }}
          >
            {line}
          </p>
        ))}
      </motion.div>

      <motion.p
        className="mt-16 text-sm tracking-widest"
        style={{ color: '#546e7a', fontFamily: 'Courier New' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
      >
        [ CLICK TO CONTINUE ]
      </motion.p>
    </motion.div>
  );
}
