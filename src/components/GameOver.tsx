import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { RotateCcw, Home } from 'lucide-react';

export const GameOver: React.FC = () => {
  const { stats, currentWave, resetRun, setGameState } = useGameStore();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-8xl font-black text-red-600 italic tracking-tighter mb-2">WASTED</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest mb-12">You survived until Wave {currentWave}</p>

        <div className="grid grid-cols-2 gap-8 mb-12 max-w-md mx-auto">
          <StatBox label="Zombies Killed" value={stats.totalKills} />
          <StatBox label="Coins Earned" value={stats.coins} />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button 
            onClick={() => resetRun()}
            className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black italic text-xl hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={24} /> TRY AGAIN
          </button>
          <button 
            onClick={() => setGameState('MENU')}
            className="flex items-center justify-center gap-3 bg-gray-900 text-gray-400 px-8 py-4 rounded-2xl font-black italic text-xl border border-gray-800 hover:text-white transition-all"
          >
            <Home size={24} /> MAIN MENU
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: number | string }) => (
  <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl">
    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-black text-white italic">{value}</div>
  </div>
);
