# Stickman: Last Stand — Complete Deployment Guide

## Project Information

**Game**: Stickman: Last Stand — Zombie Survival  
**Tech Stack**: Next.js 14, React 18, TypeScript, Canvas, Zustand, TailwindCSS, Framer Motion  
**Status**: Complete & Production-Ready

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

---

## Project Setup

### 1. Install Dependencies

```bash
cd ZombieSticman
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The game will be available at: **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
```

### 4. Run Production Server

```bash
npm start
```

---

## Project Structure

```
ZombieSticman/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main entry point
├── components/
│   ├── GameRoot.tsx        # Main game container
│   ├── GameCanvas.tsx      # Canvas renderer & loop
│   ├── MainMenu.tsx        # Menu screen
│   ├── ShopScreen.tsx      # Shop/upgrades UI
│   ├── InventoryScreen.tsx # Equipment selection
│   └── GameOverScreen.tsx  # Game over UI
├── game/
│   ├── engine/
│   │   ├── GameEngine.ts      # Core game loop
│   │   ├── Renderer.ts        # Canvas drawing
│   │   ├── InputHandler.ts    # Keyboard/mouse input
│   │   └── ParticleSystem.ts  # Visual effects
│   ├── entities/
│   │   ├── Player.ts          # Player character
│   │   ├── Zombie.ts          # Enemy zombies
│   │   ├── Bullet.ts          # Projectiles
│   │   ├── Drop.ts            # Coin/XP drops
│   │   ├── Platform.ts        # Level platforms
│   │   └── Enemy.ts           # Base enemy class
│   ├── systems/
│   │   ├── gameStore.ts       # Zustand state management
│   │   └── EnemySpawner.ts    # Wave/zombie spawning
│   └── data/
│       ├── guns.ts            # Gun definitions
│       ├── armor.ts           # Armor definitions
│       ├── potions.ts         # Potions data
│       └── upgrades.ts        # Upgrade systems
├── public/                 # Static assets
├── package.json
└── tsconfig.json
```

---

## Game Features

### Gameplay Loop
- **Main Menu** → Start Run
- **Waves** → Kill 10+ zombies (10, 15, 20, 25, 30... scaling)
- **Shop** → Buy guns, armor, upgrades
- **Level Up** → Gain XP from kills
- **Game Over** → Restart or view stats

### Zombie Types
- **Basic**: Standard zombie
- **Fast**: Quick runner
- **Tank**: High health
- **Exploder**: Explodes on death, damages nearby zombies
- **Mini Boss**: Spawns every 5 waves, massive health

### Combat System
- **Movement**: A/D keys or Arrow Keys
- **Jump**: W, Space, or Up Arrow
- **Shoot**: Click mouse (auto-aim toward nearest zombie)
- **Punch**: R key (melee attack)
- **Inventory**: I key (mid-game)

### Progression
- **Coins**: Drop from zombies, buy guns & upgrades
- **XP**: Gain from kills, level up for stat increases
- **Guns**: Pistol (starter), Rifle, Shotgun, SMG, Sniper
- **Armor**: Health & damage reduction upgrades
- **Potions**: Heal items for in-run survival

### Persistent Features
- **Saves**: Coins and equipped guns persist locally
- **Inventory**: Owned guns and armor stored
- **Stats**: Lifetime stats tracked (optional feature)

---

## Packaging as ZIP

### Option 1: Using Command Line (Recommended)

From the project root directory:

```bash
# Navigate to parent directory
cd ..

# Create ZIP archive
zip -r Stickman-Last-Stand.zip ZombieSticman/ -x "ZombieSticman/node_modules/*" "ZombieSticman/.git/*" "ZombieSticman/.next/*"

# Verify ZIP created
ls -lh Stickman-Last-Stand.zip
```

### Option 2: Using tar (Linux/Mac)

```bash
cd ..
tar --exclude='node_modules' --exclude='.git' --exclude='.next' -czf Stickman-Last-Stand.tar.gz ZombieSticman/
```

### Option 3: Using Windows

Right-click ZombieSticman folder → Send to → Compressed (zipped) folder

Then rename generated file to: `Stickman-Last-Stand.zip`

---

## File Sizes (Approximate)

- **Source Code**: ~200 KB
- **node_modules** (not included in ZIP): ~500 MB
- **ZIP Package** (without node_modules): ~300 KB
- **Built Next app** (.next/): ~2-3 MB

---

## Deployment Options

### Deploy to Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Stickman Last Stand"
git remote add origin https://github.com/yourusername/stickman-last-stand.git
git push -u origin main
```

2. Visit [vercel.com](https://vercel.com)
3. Select "Import Git Repository"
4. Deploy automatically occurs on every push

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Deploy to Any Node Host

1. Build the project:
```bash
npm run build
```

2. Transfer these folders to server:
   - `.next/`
   - `public/`
   - `node_modules/` (or run `npm install` on server)
   - `package.json`
   - `next.config.js`

3. Start on server:
```bash
npm start
```

---

## Performance Optimization

The game is optimized for 60 FPS with:
- Canvas-based rendering (no DOM overhead)
- Entity pooling for zombies
- Efficient collision detection
- Particle system batching
- Zustand state management (minimal re-renders)

---

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Build Fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Game Runs Slowly
- Ensure hardware acceleration is enabled in browser
- Close other tabs/applications
- Clear browser cache
- Try a different browser (Chrome recommended for best performance)

---

## Version Control

If using Git:

```bash
git init
git add .
git commit -m "Stickman: Last Stand - Initial Release"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Support & Customization

### To Modify Game Balance
Edit files in `/game/data/`:
- `guns.ts` - Adjust gun stats
- `armor.ts` - Armor properties
- `upgrades.ts` - Upgrade levels
- `enemies.ts` - Enemy difficulty scaling

### To Change Visuals
Edit `/game/engine/Renderer.ts`:
- Colors, sizes, effects
- HUD layout
- Animations

### To Add Features
- New zombie types: Edit `Zombie.ts`
- New guns: Add to `guns.ts`
- New screens: Create in `/components/`
- Game logic: Modify `GameEngine.ts`

---

## License

This project is created for educational and commercial use.

---

## Quick Start Summary

```bash
# Clone/extract project
cd ZombieSticman

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Package as ZIP
cd ..
zip -r Stickman-Last-Stand.zip ZombieSticman/ -x "ZombieSticman/node_modules/*" "ZombieSticman/.git/*" "ZombieSticman/.next/*"
```

---

**That's it!** Your game is ready to play, distribute, and deploy.
