import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Keyboard, ArrowLeft } from 'lucide-react';
import { GameControls } from '../types/game';

export const Settings: React.FC = () => {
  const { controls, setControl, setGameState } = useGameStore();
  const [activeAction, setActiveAction] = useState<keyof GameControls | null>(null);

  useEffect(() => {
    if (!activeAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setControl(activeAction, e.code);
      setActiveAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAction, setControl]);

  const controlLabels: Record<keyof GameControls, string> = {
    moveLeft: 'Move Left',
    moveRight: 'Move Right',
    jump: 'Jump',
    inventory: 'Inventory',
  };

  return (
    <div className="fixed inset-0 bg-gray-950/95 text-white p-8 flex flex-col items-center overflow-y-auto z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">SETTINGS</h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Customize your experience</p>
          </div>
          <button 
            onClick={() => setGameState('MENU')}
            className="ml-auto p-3 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <Keyboard size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Controls</span>
          </div>

          {(Object.keys(controlLabels) as Array<keyof GameControls>).map((action) => (
            <div key={action} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl border border-gray-800">
              <span className="font-bold text-gray-300">{controlLabels[action]}</span>
              <button
                onClick={() => setActiveAction(action)}
                className={`px-6 py-2 rounded-xl font-mono font-bold transition-all border-2 ${
                  activeAction === action 
                    ? 'bg-blue-600 border-blue-400 scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                    : 'bg-gray-900 border-gray-700 hover:border-gray-500'
                }`}
              >
                {activeAction === action ? 'PRESS ANY KEY...' : controls[action]}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-900/10 rounded-2xl border border-blue-500/20">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center">
            Tip: You can always use Arrow Keys for movement and Space for jumping.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
