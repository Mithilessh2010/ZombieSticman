import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { ArrowLeft, Coins, Check, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export const Shop: React.FC = () => {
  const { setGameState, stats, weapons, upgrades, buyWeapon, equipWeapon, buyUpgrade, equippedWeaponId, nextWave } = useGameStore();

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => setGameState('MENU')}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold uppercase text-sm tracking-widest transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </button>
          
          <div className="flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800">
            <Coins className="text-yellow-400" size={24} />
            <span className="text-3xl font-mono font-bold text-white">{stats.coins}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setGameState('INVENTORY')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-2xl font-bold uppercase text-sm tracking-widest transition-all"
            >
              INVENTORY
            </button>
            <button 
              onClick={() => nextWave()}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-black italic text-xl shadow-[0_0_30px_rgba(22,163,74,0.2)] transition-all"
            >
              START NEXT WAVE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Weapons Section */}
          <section>
            <h2 className="text-3xl font-black text-white italic mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600" />
              ARMORY
            </h2>
            <div className="space-y-4">
              {weapons.map((weapon) => (
                <div 
                  key={weapon.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all",
                    weapon.unlocked ? "bg-gray-900/50 border-gray-800" : "bg-gray-900/20 border-gray-800/50 opacity-80"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{weapon.name}</h3>
                      <p className="text-gray-500 text-sm">{weapon.description}</p>
                    </div>
                    {weapon.unlocked ? (
                      equippedWeaponId === weapon.id ? (
                        <span className="flex items-center gap-1 text-green-500 font-bold text-xs uppercase tracking-widest">
                          <Check size={14} /> Equipped
                        </span>
                      ) : (
                        <button 
                          onClick={() => equipWeapon(weapon.id)}
                          className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-widest"
                        >
                          Equip
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => buyWeapon(weapon.id)}
                        disabled={stats.coins < weapon.price}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm",
                          stats.coins >= weapon.price ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        )}
                      >
                        <Lock size={14} /> {weapon.price}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <StatBar label="DMG" value={weapon.damage} max={150} />
                    <StatBar label="RATE" value={1000/weapon.fireRate} max={10} />
                    <StatBar label="MAG" value={weapon.magazineSize} max={100} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upgrades Section */}
          <section>
            <h2 className="text-3xl font-black text-white italic mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600" />
              PERMANENT UPGRADES
            </h2>
            <div className="space-y-4">
              {upgrades.map((upgrade) => (
                <div 
                  key={upgrade.id}
                  className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{upgrade.name}</h3>
                      <p className="text-gray-500 text-sm">{upgrade.description}</p>
                    </div>
                    <button 
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={stats.coins < upgrade.cost || upgrade.level >= upgrade.maxLevel}
                      className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm",
                        upgrade.level >= upgrade.maxLevel 
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : stats.coins >= upgrade.cost ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      {upgrade.level >= upgrade.maxLevel ? 'MAXED' : `${upgrade.cost}c`}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500">{upgrade.level}/{upgrade.maxLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, max }: { label: string, value: number, max: number }) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
      <span>{label}</span>
      <span>{Math.round(value)}</span>
    </div>
    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full bg-gray-400" style={{ width: `${Math.min(100, (value/max)*100)}%` }} />
    </div>
  </div>
);
