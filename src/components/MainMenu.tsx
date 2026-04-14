import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { Play, ShoppingBag, Trophy, Settings, Shield, Zap, Skull } from 'lucide-react';
import { audioManager } from '../game/systems/AudioManager';
import { cn } from '../lib/utils';
import { Difficulty } from '../types/game';

export const MainMenu: React.FC = () => {
  const { setGameState, nextWave, stats, difficulty, setDifficulty } = useGameStore();

  const handleStart = () => {
    audioManager.init();
    nextWave();
  };

  const difficulties: { id: Difficulty; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'EASY', label: 'EASY', icon: <Shield size={16} />, color: 'text-green-400' },
    { id: 'NORMAL', label: 'NORMAL', icon: <Zap size={16} />, color: 'text-yellow-400' },
    { id: 'HARD', label: 'HARD', icon: <Skull size={16} />, color: 'text-red-500' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-12"
      >
        <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter mb-2">
          STICKMAN
          <span className="block text-red-600 text-4xl md:text-6xl -mt-4 md:-mt-8">LAST STAND</span>
        </h1>
        <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-sm">Zombie Survival Protocol</p>
      </motion.div>

      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        {/* Difficulty Selector */}
        <div className="flex bg-gray-900/80 p-1 rounded-2xl border border-gray-800 mb-2">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setDifficulty(diff.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all gap-1",
                difficulty === diff.id 
                  ? "bg-gray-800 shadow-inner" 
                  : "hover:bg-gray-800/50 opacity-50 grayscale hover:grayscale-0"
              )}
            >
              <div className={cn(difficulty === diff.id ? diff.color : "text-gray-500")}>
                {diff.icon}
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-tighter italic",
                difficulty === diff.id ? "text-white" : "text-gray-500"
              )}>
                {diff.label}
              </span>
            </button>
          ))}
        </div>

        <MenuButton 
          icon={<Play fill="currentColor" />} 
          label="START SURVIVAL" 
          onClick={handleStart}
          primary
        />
        <MenuButton 
          icon={<Settings />} 
          label="SETTINGS" 
          onClick={() => setGameState('SETTINGS')}
        />
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl text-center">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Highest Wave</div>
                <div className="text-2xl font-black text-white italic">{stats.highestWave}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl text-center">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Kills</div>
                <div className="text-2xl font-black text-white italic">{stats.totalKills}</div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-600 font-mono text-xs">
        V1.0.0 // SESSION ONLY MODE
      </div>
    </div>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick, primary }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black italic tracking-tight text-lg transition-all
      ${primary 
        ? 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' 
        : 'bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800'}
    `}
  >
    {icon}
    {label}
  </motion.button>
);
