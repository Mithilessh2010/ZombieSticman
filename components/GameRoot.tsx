'use client';

import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import MainMenu from './MainMenu';
import StoryScreen from './StoryScreen';
import GameCanvas from './GameCanvas';
import UpgradeScreen from './UpgradeScreen';
import GameOverScreen from './GameOverScreen';
import VictoryScreen from './VictoryScreen';

export default function GameRoot() {
  const { screen, proceedStory } = useGameStore();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {screen === 'menu' && <MainMenu key="menu" />}
        {screen === 'story' && <StoryScreen key="story" />}
        {screen === 'playing' && (
          <div
            key="playing"
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GameCanvas />
          </div>
        )}
        {screen === 'upgrade' && <UpgradeScreen key="upgrade" />}
        {screen === 'gameover' && <GameOverScreen key="gameover" />}
        {screen === 'victory' && <VictoryScreen key="victory" />}
      </AnimatePresence>
    </div>
  );
}
