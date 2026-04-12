// src/app/page.tsx
'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import GameCanvas from '@/components/GameCanvas';
import SettingsMenu from '@/components/SettingsMenu';

type AppScreen = 'menu' | 'game' | 'settings';

export default function Home() {
  const [appScreen, setAppScreen] = useState<AppScreen>('menu');
  const [selectedMap, setSelectedMap] = useState('city');
  const { setScreen } = useGameStore();

  const handleStart = useCallback((map: string) => {
    setSelectedMap(map);
    setAppScreen('game');
  }, []);

  const handleDead = useCallback(() => {
    // Restart - go back to game screen which remounts GameCanvas
    setAppScreen('menu');
    setTimeout(() => setAppScreen('menu'), 50);
  }, []);

  const handleMenu = useCallback(() => {
    setAppScreen('menu');
    setScreen('menu');
  }, [setScreen]);

  const handleSettings = useCallback(() => {
    setAppScreen('settings');
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAppScreen('menu');
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0b0f1a' }}>
      <AnimatePresence mode="wait">
        {appScreen === 'menu' && (
          <div key="menu" style={{ position: 'absolute', inset: 0 }}>
            <MainMenu onStart={handleStart} />
          </div>
        )}
        {appScreen === 'game' && (
          <div key="game" style={{ position: 'absolute', inset: 0 }}>
            <GameCanvas mapType={selectedMap} onDead={handleDead} onMenu={handleMenu} />
          </div>
        )}
        {appScreen === 'settings' && (
          <div key="settings" style={{ position: 'absolute', inset: 0 }}>
            <SettingsMenu onClose={handleSettingsClose} />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
