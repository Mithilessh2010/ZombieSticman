'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/game/systems/gameStore';
import { GUNS } from '@/game/data/guns';
import { ARMOR } from '@/game/data/armor';

export default function InventoryScreen() {
  const { ownedGunIds, equippedGunId, equipGun, ownedArmorIds, equippedArmorId, equipArmor, setScreen } = useGameStore();
  const ownedGuns = GUNS.filter(g => ownedGunIds.includes(g.id));
  const ownedArmors = ARMOR.filter(a => ownedArmorIds.includes(a.id));

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center"
      style={{ background:'linear-gradient(160deg,#080810 0%,#12102a 100%)', overflowY:'auto', paddingBottom:32 }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

      <div className="w-full flex items-center justify-between px-8 pt-6 pb-4">
        <motion.button onClick={() => setScreen('menu')}
          className="text-sm px-4 py-2 border rounded"
          style={{ borderColor:'#546e7a', color:'#90a4ae', fontFamily:'Courier New', cursor:'pointer' }}
          whileHover={{ scale:1.05 }}>
          ← BACK
        </motion.button>
        <h2 style={{ color:'#ce93d8', fontFamily:'Courier New', fontSize:22, letterSpacing:'0.3em' }}>INVENTORY</h2>
        <div/>
      </div>

      {/* Guns section */}
      {ownedGuns.length > 0 && (
        <div style={{ width: '100%', marginBottom: 24 }}>
          <h3 style={{ color:'#4fc3f7', fontFamily:'Courier New', fontSize:16, paddingLeft:32, marginBottom:12 }}>
            WEAPONS
          </h3>
          <div className="grid gap-5 px-8" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', width:'100%', maxWidth:900 }}>
            {ownedGuns.map((gun, i) => {
              const isEquipped = equippedGunId === gun.id;
              return (
                <motion.div key={gun.id}
                  className="rounded-xl border-2 p-5 flex flex-col gap-2 cursor-pointer"
                  style={{
                    borderColor: isEquipped ? gun.color : '#2a2a44',
                    background: isEquipped ? gun.color + '18' : '#0d0d1e',
                    boxShadow: isEquipped ? `0 0 16px ${gun.color}44` : 'none',
                  }}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
                  whileHover={{ scale:1.03, borderColor: gun.color }}
                  whileTap={{ scale:0.97 }}
                  onClick={() => equipGun(gun.id)}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: gun.color, fontFamily:'Courier New', fontSize:17, fontWeight:'bold' }}>
                      {gun.name}
                    </span>
                    {isEquipped && (
                      <span style={{ color:'#66bb6a', fontFamily:'Courier New', fontSize:12, letterSpacing:'0.1em' }}>
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <p style={{ color:'#78909c', fontFamily:'Courier New', fontSize:11 }}>{gun.description}</p>
                  <div style={{ color:'#b0bec5', fontFamily:'Courier New', fontSize:11, lineHeight:1.7 }}>
                    <div>DMG {gun.damage} · RATE {gun.fireRate}/s · SPD {gun.bulletSpeed}</div>
                    {gun.pellets > 1 && <div>Pellets: {gun.pellets} · Spread: {gun.spread}°</div>}
                    {gun.pierce > 0 && <div>Pierce: {gun.pierce}</div>}
                  </div>
                  {!isEquipped && (
                    <span style={{ color: gun.color, fontFamily:'Courier New', fontSize:11, marginTop:4 }}>
                      Click to equip →
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Armor section */}
      {ownedArmors.length > 0 && (
        <div style={{ width: '100%' }}>
          <h3 style={{ color:'#ff6f00', fontFamily:'Courier New', fontSize:16, paddingLeft:32, marginBottom:12 }}>
            ARMOR
          </h3>
          <div className="grid gap-5 px-8" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', width:'100%', maxWidth:900 }}>
            {ownedArmors.map((armor, i) => {
              const isEquipped = equippedArmorId === armor.id;
              return (
                <motion.div key={armor.id}
                  className="rounded-xl border-2 p-5 flex flex-col gap-2 cursor-pointer"
                  style={{
                    borderColor: isEquipped ? armor.color : '#2a2a44',
                    background: isEquipped ? armor.color + '18' : '#0d0d1e',
                    boxShadow: isEquipped ? `0 0 16px ${armor.color}44` : 'none',
                  }}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
                  whileHover={{ scale:1.03, borderColor: armor.color }}
                  whileTap={{ scale:0.97 }}
                  onClick={() => equipArmor(armor.id)}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: armor.color, fontFamily:'Courier New', fontSize:17, fontWeight:'bold' }}>
                      {armor.name}
                    </span>
                    {isEquipped && (
                      <span style={{ color:'#66bb6a', fontFamily:'Courier New', fontSize:12, letterSpacing:'0.1em' }}>
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <p style={{ color:'#78909c', fontFamily:'Courier New', fontSize:11 }}>{armor.description}</p>
                  <div style={{ color:'#b0bec5', fontFamily:'Courier New', fontSize:11, lineHeight:1.7 }}>
                    <div>HP +{armor.maxHealthBoost} · Reduction {(armor.damageReduction*100).toFixed(0)}%</div>
                  </div>
                  {!isEquipped && (
                    <span style={{ color: armor.color, fontFamily:'Courier New', fontSize:11, marginTop:4 }}>
                      Click to equip →
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          {/* No armor button */}
          {equippedArmorId && (
            <motion.button
              onClick={() => equipArmor('')}
              className="mt-4 px-6 py-2 border rounded text-sm"
              style={{
                borderColor: '#546e7a',
                color: '#90a4ae',
                background: 'transparent',
                fontFamily: 'Courier New',
                cursor: 'pointer',
                marginLeft: 32,
              }}
              whileHover={{ scale: 1.05 }}>
              EQUIP NO ARMOR
            </motion.button>
          )}
        </div>
      )}

      {ownedGuns.length === 0 && ownedArmors.length === 0 && (
        <p style={{ color:'#546e7a', fontFamily:'Courier New', fontSize:14, marginTop:32 }}>
          No items. Purchase weapons or armor in the shop.
        </p>
      )}
    </motion.div>
  );
}
