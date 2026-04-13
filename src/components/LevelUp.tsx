import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export const LevelUp: React.FC = () => {
  const { setGameState, stats } = useGameStore();

  const handleContinue = () => {
    setGameState('PLAYING');
  };

  return (
    <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-md flex flex-col items-center justify-center p-6 z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center bg-gray-900 border-2 border-blue-500 p-12 rounded-[40px] shadow-[0_0_50px_rgba(59,130,246,0.3)]"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            <Zap size={40} className="text-white" fill="currentColor" />
        </div>
        <h2 className="text-6xl font-black text-white italic tracking-tighter mb-2">LEVEL UP!</h2>
        <p className="text-blue-400 font-bold uppercase tracking-widest mb-8 text-xl">Reached Level {stats.level}</p>
        
        <p className="text-gray-400 mb-12 max-w-sm">Your health has been fully restored. Keep fighting!</p>

        <button 
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-black italic text-2xl hover:bg-blue-500 transition-all"
        >
          CONTINUE
        </button>
      </motion.div>
    </div>
  );
};
