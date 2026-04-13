import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Sword } from 'lucide-react';
import { cn } from '../lib/utils';

export const Inventory: React.FC = () => {
  const { setGameState, weapons, equipWeapon, equippedWeaponId, previousGameState } = useGameStore();

  const unlockedWeapons = weapons.filter(w => w.unlocked);

  const handleBack = () => {
    // Return to whatever state we were in before opening inventory
    setGameState(previousGameState);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold uppercase text-sm tracking-widest transition-colors"
          >
            <ArrowLeft size={18} />
            BACK
          </button>
          
          <h1 className="text-4xl font-black text-white italic tracking-tighter">INVENTORY</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockedWeapons.map((weapon) => (
            <motion.div 
              key={weapon.id}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-6 rounded-3xl border transition-all cursor-pointer",
                equippedWeaponId === weapon.id 
                  ? "bg-blue-900/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
              )}
              onClick={() => equipWeapon(weapon.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Sword size={24} className={equippedWeaponId === weapon.id ? "text-blue-400" : "text-gray-500"} />
                </div>
                {equippedWeaponId === weapon.id && (
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                    Equipped
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white italic mb-1">{weapon.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{weapon.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-gray-600 uppercase">Damage</div>
                  <div className="text-lg font-black text-white italic">{weapon.damage}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-gray-600 uppercase">Rate</div>
                  <div className="text-lg font-black text-white italic">{Math.round(1000/weapon.fireRate)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-gray-600 uppercase">Mag</div>
                  <div className="text-lg font-black text-white italic">{weapon.magazineSize === Infinity ? '∞' : weapon.magazineSize}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {unlockedWeapons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-bold uppercase tracking-widest">Your inventory is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};
