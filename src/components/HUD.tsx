import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Heart, Coins, Target, Zap, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

const ControlKey = ({ label }: { label: string }) => (
  <div className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 font-mono text-[10px] font-bold min-w-[24px] text-center">
    {label}
  </div>
);

export const HUD: React.FC = () => {
  const { stats, currentWave, zombiesRemaining, controls } = useGameStore();
  
  const healthPercent = (stats.health / stats.maxHealth) * 100;
  const xpPercent = (stats.xp / (stats.level * 100)) * 100;

  const formatKey = (key: string) => key.replace('Key', '');

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          {/* Health */}
          <div className="w-64">
            <div className="flex items-center gap-2 mb-1 text-red-400 font-bold uppercase text-xs tracking-wider">
              <Heart size={14} fill="currentColor" />
              <span>Health</span>
              <span className="ml-auto">{Math.ceil(stats.health)}/{stats.maxHealth}</span>
            </div>
            <div className="h-3 bg-gray-900/80 rounded-full overflow-hidden border border-gray-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

          {/* XP */}
          <div className="w-64">
            <div className="flex items-center gap-2 mb-1 text-blue-400 font-bold uppercase text-xs tracking-wider">
              <Zap size={14} fill="currentColor" />
              <span>Level {stats.level}</span>
              <span className="ml-auto">{stats.xp}/{stats.level * 100} XP</span>
            </div>
            <div className="h-2 bg-gray-900/80 rounded-full overflow-hidden border border-gray-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wave Info */}
        <div className="text-center">
          <motion.div 
            key={currentWave}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-white italic tracking-tighter"
          >
            WAVE {currentWave}
          </motion.div>
          <div className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">
            {zombiesRemaining} ZOMBIES LEFT
          </div>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-3 bg-gray-900/80 px-4 py-2 rounded-xl border border-gray-800">
          <Coins className="text-yellow-400" size={20} />
          <span className="text-2xl font-mono font-bold text-white">{stats.coins}</span>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute left-6 bottom-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <ControlKey label={formatKey(controls.moveLeft)} />
          <ControlKey label={formatKey(controls.moveRight)} />
          <span className="text-gray-500 font-bold text-[10px] self-center ml-1 uppercase tracking-widest">Move</span>
        </div>
        <div className="flex gap-2">
          <ControlKey label={formatKey(controls.jump)} />
          <ControlKey label="SPACE" />
          <span className="text-gray-500 font-bold text-[10px] self-center ml-1 uppercase tracking-widest">Jump</span>
        </div>
        <div className="flex gap-2">
          <ControlKey label={formatKey(controls.inventory)} />
          <span className="text-gray-500 font-bold text-[10px] self-center ml-1 uppercase tracking-widest">Inventory</span>
        </div>
        <div className="flex gap-2 mt-2">
          <ControlKey label="L-CLICK" />
          <span className="text-gray-500 font-bold text-[10px] self-center ml-1 uppercase tracking-widest">Attack</span>
        </div>
      </div>

      {/* Bottom Right - Stats */}
      <div className="flex justify-end">
        <div className="bg-gray-900/80 px-4 py-2 rounded-xl border border-gray-800 flex gap-6">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-gray-400" />
            <span className="text-gray-300 font-bold">{stats.totalKills} Kills</span>
          </div>
        </div>
      </div>
    </div>
  );
};
