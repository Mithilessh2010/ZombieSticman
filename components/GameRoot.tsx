'use client';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import MainMenu from './MainMenu';
import ShopScreen from './ShopScreen';
import InventoryScreen from './InventoryScreen';
import UpgradeScreen from './UpgradeScreen';
import GameOverScreen from './GameOverScreen';
import GameCanvas from './GameCanvas';

export default function GameRoot() {
  const { screen } = useGameStore();
  const inGame = screen === 'playing' || screen === 'upgrade';

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#080810', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>

      {/* Canvas always rendered when in-game so engine isn't destroyed on upgrade screen */}
      <div style={{ width:'100%', height:'100%', display: inGame ? 'flex' : 'none', alignItems:'center', justifyContent:'center' }}>
        <GameCanvas />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'menu'      && <MainMenu      key="menu" />}
        {screen === 'shop'      && <ShopScreen    key="shop" />}
        {screen === 'inventory' && <InventoryScreen key="inv" />}
        {screen === 'gameover'  && <GameOverScreen key="over" />}
      </AnimatePresence>

      {/* Upgrade overlay on top of running canvas */}
      <AnimatePresence>
        {screen === 'upgrade' && <UpgradeScreen key="upgrade" />}
      </AnimatePresence>
    </div>
  );
}
