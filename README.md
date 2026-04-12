# STICKMAN: LAST STAND 🎮

A top-down roguelike zombie survival shooter. Survive endless waves, unlock upgrades, and see how long you can last.

---

## 🚀 Play Instantly

Just open `index.html` in any modern browser — no install needed.

---

## 🌐 Deploy to Vercel (Free)

```bash
# Option 1: Drag & Drop
# Go to https://vercel.com/new → drag the folder → done

# Option 2: CLI
npm i -g vercel
cd stickman-last-stand
vercel --yes
```

## 🌐 Deploy to Netlify (Free)

1. Go to https://netlify.com
2. Drag the `stickman-last-stand` folder onto the deploy zone
3. Live in seconds ⚡

## 🌐 GitHub Pages

```bash
git init
git add .
git commit -m "launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stickman-last-stand.git
git push -u origin main
# Then: Settings → Pages → Deploy from main branch
```

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Aim |
| Click (hold) | Shoot / Auto-fire |
| SHIFT | Dash (3 charges, regen over time) |
| R | Reload |
| Q | Grenade (unlock via upgrade) |
| E | Deploy Turret (unlock via upgrade) |
| Z | Time Slow (unlock via upgrade) |
| X | Shield Bubble (unlock via upgrade) |
| ESC | Pause |

---

## 🎮 Game Features

### Weapons (9 total)
- 🔫 Pistol (starter)
- Shotgun, SMG, Assault Rifle, Sniper, Minigun, Flamethrower, Rocket Launcher, Laser Rifle
- Unlock via Level Up upgrade cards

### 12+ Enemy Types
- Walker, Runner, Tank, Spitter, Bomber, Shield Zombie, Shadow (Invisible), Splitter, Elite
- 4 Boss types every 5th wave: Abomination, Necromancer, Behemoth, Spider Queen

### 30+ Upgrades
- Weapon stats, movement, abilities, unlocks
- Rarity tiers: Common → Rare → Epic → Legendary

### Abilities
- Dash (built-in), Grenade, Turret, Time Slow, Shield Bubble

### Systems
- Full roguelike XP/leveling loop
- Persistent kill streak tracker
- Minimap
- Screen shake, damage numbers, particles
- Lifesteal, crit, pierce, chain lightning, triple shot, explosive rounds
- Armor absorption system
- Stamina-based dash charges
- Auto-fire, reload mechanics
- Wave director with dynamic scaling
- Boss HP bar + minion spawning

---

## 📁 File Structure

```
stickman-last-stand/
└── index.html    ← Entire game, zero dependencies
```

Single self-contained file. No build step. No npm. No node_modules.

---

## 🏆 Tips

- Prioritize XP Sponge + damage upgrades early
- Unlock the Sniper for boss waves
- Use Shield before boss attacks
- Chain Lightning + Explosive Rounds = chaos
- Stamina regens naturally — dash aggressively

---

*Built with vanilla HTML5 Canvas + CSS. Zero dependencies.*
