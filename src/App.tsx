import { useGameStore } from './store/useGameStore';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu } from './components/MainMenu';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { Settings } from './components/Settings';
import { GameOver } from './components/GameOver';
import { LevelUp } from './components/LevelUp';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const gameState = useGameStore(state => state.gameState);

  return (
    <div className="w-full h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      {/* Game Engine Layer */}
      {(gameState === 'PLAYING' || gameState === 'SHOP' || gameState === 'LEVEL_UP' || gameState === 'GAMEOVER' || gameState === 'INVENTORY' || gameState === 'SETTINGS') && (
        <GameCanvas />
      )}

      {/* UI Overlay Layer */}
      <AnimatePresence mode="wait">
        {gameState === 'MENU' && (
          <MainMenu key="menu" />
        )}
        
        {gameState === 'SHOP' && (
          <Shop key="shop" />
        )}

        {gameState === 'INVENTORY' && (
          <Inventory key="inventory" />
        )}

        {gameState === 'GAMEOVER' && (
          <GameOver key="gameover" />
        )}

        {gameState === 'LEVEL_UP' && (
          <LevelUp key="levelup" />
        )}

        {gameState === 'SETTINGS' && (
          <Settings key="settings" />
        )}
      </AnimatePresence>

      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-40" />
    </div>
  );
}
