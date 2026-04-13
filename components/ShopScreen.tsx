'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import { GUNS } from '@/game/data/guns';
import { ARMOR } from '@/game/data/armor';
import { POTIONS } from '@/game/data/potions';

export default function ShopScreen() {
  const { coins, ownedGunIds, ownedArmorIds, currentWave, buyGun, buyArmor, buyPotion, continueToNextWave } = useGameStore();
  const [tab, setTab] = useState<'guns' | 'armor' | 'potions'>('armor');
  const [potionQuantity, setPotionQuantity] = useState<{ [key: string]: number }>({ health_small: 1, health_medium: 1, health_large: 1 });

  const showGuns = currentWave > 1;
  const tabList = showGuns ? ['guns', 'armor', 'potions'] : ['armor', 'potions'];

  // Reset tab if it becomes invalid for current wave
  useEffect(() => {
    if (tab === 'guns' && !showGuns) {
      setTab('armor');
    }
  }, [showGuns, tab]);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center"
      style={{ background:'linear-gradient(160deg,#080810 0%,#12102a 100%)', overflowY:'auto', paddingBottom:32 }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

      <div className="w-full flex items-center justify-between px-8 pt-6 pb-4">
        <motion.h2 style={{ color:'#4fc3f7', fontFamily:'Courier New', fontSize:20, letterSpacing:'0.2em', margin:0 }}>
          WAVE {currentWave}
        </motion.h2>
        <span style={{ color:'#ffd700', fontFamily:'Courier New', fontSize:15 }}>Coins: {coins}</span>
      </div>

      {/* Wave 1 special message */}
      {currentWave === 1 && (
        <motion.div className="mx-8 mb-6 p-4 rounded border-2"
          style={{ borderColor:'#ff6f00', color:'#ff6f00', fontFamily:'Courier New', fontSize:13, textAlign:'center', background:'#ff6f0011' }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
          <div className="font-bold mb-1">START WITH FISTS ONLY</div>
          <div>You begin with melee attacks. Purchase guns after this wave to unlock ranged combat!</div>
        </motion.div>
      )}

      {/* Tab buttons - show only available tabs for current wave */}
      <div className="flex gap-4 mb-6">
        {tabList.map((t) => (
          <motion.button key={t}
            onClick={() => setTab(t as any)}
            className="px-6 py-2 border rounded text-sm tracking-widest"
            style={{
              borderColor: tab === t ? '#ffd700' : '#546e7a',
              color: tab === t ? '#ffd700' : '#90a4ae',
              background: tab === t ? '#ffd70022' : 'transparent',
              fontFamily: 'Courier New',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
            whileHover={{ scale: 1.05 }}>
            {t}
          </motion.button>
        ))}
      </div>

      {/* Guns tab - only shown after wave 1 */}
      {showGuns && tab === 'guns' && (
        <div className="grid gap-5 px-8" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', width:'100%', maxWidth:900 }}>
          {GUNS.map((gun, i) => {
            const owned = ownedGunIds.includes(gun.id);
            const canBuy = !owned && coins >= gun.price;
            return (
              <motion.div key={gun.id}
                className="rounded-xl border-2 p-5 flex flex-col gap-2"
                style={{ borderColor: owned ? gun.color : '#2a2a44', background:'#0d0d1e' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: gun.color, fontFamily:'Courier New', fontSize:17, fontWeight:'bold' }}>
                    {gun.name}
                  </span>
                  {owned
                    ? <span style={{ color:'#66bb6a', fontFamily:'Courier New', fontSize:12 }}>OWNED</span>
                    : <span style={{ color:'#ffd700', fontFamily:'Courier New', fontSize:13 }}>{gun.price}</span>}
                </div>
                <p style={{ color:'#78909c', fontFamily:'Courier New', fontSize:11 }}>{gun.description}</p>
                <div style={{ color:'#b0bec5', fontFamily:'Courier New', fontSize:11, lineHeight:1.7 }}>
                  <div>DMG {gun.damage} · RATE {gun.fireRate}/s · SPD {gun.bulletSpeed}</div>
                  {gun.pellets > 1 && <div>Pellets: {gun.pellets} · Spread: {gun.spread}°</div>}
                  {gun.pierce > 0 && <div>Pierce: {gun.pierce}</div>}
                </div>
                {!owned && (
                  <motion.button
                    className="mt-2 py-2 rounded border text-sm tracking-widest"
                    style={{
                      borderColor: canBuy ? gun.color : '#37474f',
                      color: canBuy ? gun.color : '#546e7a',
                      background: 'transparent', fontFamily:'Courier New', cursor: canBuy ? 'pointer' : 'not-allowed',
                    }}
                    whileHover={canBuy ? { scale:1.03, backgroundColor: gun.color + '22' } : {}}
                    whileTap={canBuy ? { scale:0.97 } : {}}
                    onClick={() => canBuy && buyGun(gun.id)}>
                    {canBuy ? 'BUY' : coins < gun.price ? `NEED ${gun.price - coins}` : 'OWNED'}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Armor tab */}
      {tab === 'armor' && (
        <div className="grid gap-5 px-8" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', width:'100%', maxWidth:900 }}>
          {ARMOR.map((armor, i) => {
            const owned = ownedArmorIds.includes(armor.id);
            const canBuy = !owned && coins >= armor.price;
            return (
              <motion.div key={armor.id}
                className="rounded-xl border-2 p-5 flex flex-col gap-2"
                style={{ borderColor: owned ? armor.color : '#2a2a44', background:'#0d0d1e' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: armor.color, fontFamily:'Courier New', fontSize:17, fontWeight:'bold' }}>
                    {armor.name}
                  </span>
                  {owned
                    ? <span style={{ color:'#66bb6a', fontFamily:'Courier New', fontSize:12 }}>OWNED</span>
                    : <span style={{ color:'#ffd700', fontFamily:'Courier New', fontSize:13 }}>{armor.price}</span>}
                </div>
                <p style={{ color:'#78909c', fontFamily:'Courier New', fontSize:11 }}>{armor.description}</p>
                <div style={{ color:'#b0bec5', fontFamily:'Courier New', fontSize:11, lineHeight:1.7 }}>
                  <div>HP +{armor.maxHealthBoost} · Reduction {(armor.damageReduction*100).toFixed(0)}%</div>
                </div>
                {!owned && (
                  <motion.button
                    className="mt-2 py-2 rounded border text-sm tracking-widest"
                    style={{
                      borderColor: canBuy ? armor.color : '#37474f',
                      color: canBuy ? armor.color : '#546e7a',
                      background: 'transparent', fontFamily:'Courier New', cursor: canBuy ? 'pointer' : 'not-allowed',
                    }}
                    whileHover={canBuy ? { scale:1.03, backgroundColor: armor.color + '22' } : {}}
                    whileTap={canBuy ? { scale:0.97 } : {}}
                    onClick={() => canBuy && buyArmor(armor.id)}>
                    {canBuy ? 'BUY' : coins < armor.price ? `NEED ${armor.price - coins}` : 'OWNED'}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Potions tab */}
      {tab === 'potions' && (
        <div className="grid gap-5 px-8" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', width:'100%', maxWidth:900 }}>
          {POTIONS.map((potion, i) => {
            const qty = potionQuantity[potion.id] || 1;
            const totalCost = potion.price * qty;
            const canBuy = coins >= totalCost;
            return (
              <motion.div key={potion.id}
                className="rounded-xl border-2 p-5 flex flex-col gap-2"
                style={{ borderColor: potion.color, background:'#0d0d1e' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}>
                <div style={{ color: potion.color, fontFamily:'Courier New', fontSize:17, fontWeight:'bold' }}>
                  {potion.name}
                </div>
                <p style={{ color:'#78909c', fontFamily:'Courier New', fontSize:11 }}>{potion.description}</p>
                <div style={{ color:'#b0bec5', fontFamily:'Courier New', fontSize:11 }}>
                  Price: {potion.price} per unit
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setPotionQuantity({ ...potionQuantity, [potion.id]: Math.max(1, qty - 1) })}
                    style={{ background:'#546e7a', color:'#fff', border:'none', padding:'4px 8px', cursor:'pointer', fontFamily:'Courier New' }}>-</button>
                  <span style={{ color:'#fff', fontFamily:'Courier New', minWidth:'30px', textAlign:'center' }}>{qty}</span>
                  <button onClick={() => setPotionQuantity({ ...potionQuantity, [potion.id]: qty + 1 })}
                    style={{ background:'#546e7a', color:'#fff', border:'none', padding:'4px 8px', cursor:'pointer', fontFamily:'Courier New' }}>+</button>
                  <span style={{ color:'#ffd700', fontFamily:'Courier New', marginLeft:'auto' }}>Total: {totalCost}</span>
                </div>
                <motion.button
                  className="mt-2 py-2 rounded border text-sm tracking-widest"
                  style={{
                    borderColor: canBuy ? potion.color : '#37474f',
                    color: canBuy ? potion.color : '#546e7a',
                    background: 'transparent', fontFamily:'Courier New', cursor: canBuy ? 'pointer' : 'not-allowed',
                  }}
                  whileHover={canBuy ? { scale:1.03, backgroundColor: potion.color + '22' } : {}}
                  whileTap={canBuy ? { scale:0.97 } : {}}
                  onClick={() => canBuy && buyPotion(potion.id, qty)}>
                  {canBuy ? `BUY ${qty}` : `NEED ${totalCost - coins}`}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ready button */}
      <motion.div className="mt-8"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
        <motion.button
          onClick={() => continueToNextWave()}
          className="px-12 py-3 text-base tracking-widest border-2 rounded"
          style={{ background:'transparent', borderColor:'#4fc3f7', color:'#4fc3f7', fontFamily:'Courier New', cursor:'pointer' }}
          whileHover={{ scale:1.05, backgroundColor: '#4fc3f722' }}
          whileTap={{ scale:0.97 }}>
          READY FOR WAVE {currentWave + 1}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
