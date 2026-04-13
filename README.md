# Stickman: Last Stand — Zombie Survival

**A complete, production-ready browser-based zombie survival game built with Next.js and Canvas.**

## What's Included

A fully functional 2D side-scrolling zombie survival shooter featuring:

- **Dynamic Wave System** with progressive difficulty (10→15→20→25→30+ zombies per wave)
- **Multiple Enemy Types**: Basic, Fast, Tank, Exploder, Mini Boss bosses
- **Extensive Arsenal**: 5 unique weapons with different fire rates, spread, and pierce
- **Persistent Progression**: Save coins and equipped gear between runs
- **Smooth 60 FPS Gameplay**: Canvas-based rendering with optimized physics
- **Visual Effects**: Particles, screen shake, health bars, floating UI
- **Complete UI System**: Main menu, shop, inventory, game over screens
- **State Management**: Zustand for clean, persistent game state

## Quick Start

```bash
npm install
npm run dev
```

Game available at: http://localhost:3000

## Controls

- **A/D** or **Arrow Keys** - Move
- **W/Space/↑** - Jump
- **Click** - Shoot (auto-aims at nearest zombie)
- **R** - Punch
- **I** - Inventory (during gameplay)

## Game Loop

1. **Main Menu** - Select Start Run
2. **Wave Shop** - Buy guns, armor, upgrades before starting
3. **Wave Gameplay** - Kill zombies, collect coins & XP
4. **Level Up** - Permanent stat increases
5. **Repeat** - Difficulty increases each wave

## Technology Stack

- **Frontend**: React 18 + Next.js 14
- **Language**: TypeScript
- **Rendering**: HTML5 Canvas (2D)
- **State**: Zustand (persistent + session)
- **Styling**: TailwindCSS + Framer Motion
- **Game Logic**: Custom ECS-inspired architecture

## Key Features Implemented

✅ Wave-based zombie spawning with dynamic difficulty  
✅ 5 unique zombie types with different behaviors  
✅ Mini boss enemies every 5 waves  
✅ Explosion mechanics for Exploder zombies  
✅ 5 guns with unique fire patterns  
✅ Persistent inventory & equipment  
✅ XP/leveling system  
✅ Coin economy  
✅ Multiple armor options  
✅ Consumable potions  
✅ Smooth camera and fluid controls  
✅ Comprehensive HUD with wave counter  
✅ Shop between waves  
✅ Game over statistics  
✅ Local storage persistence  

## File Structure

```
ZombieSticman/
├── app/                    # Next.js app directory
├── components/             # React UI components
│   ├── GameCanvas.tsx      # Game rendering loop
│   ├── GameRoot.tsx        # Game container
│   ├── MainMenu.tsx        # Menu screen
│   ├── ShopScreen.tsx      # Shop UI
│   ├── InventoryScreen.tsx # Equipment UI
│   └── GameOverScreen.tsx  # End screen
├── game/                   # Game logic
│   ├── engine/             # Core game systems
│   │   ├── GameEngine.ts   # Main loop, physics, collisions
│   │   ├── Renderer.ts     # Canvas drawing
│   │   ├── InputHandler.ts # Input management
│   │   └── ParticleSystem.ts # Visual effects
│   ├── entities/           # Game objects
│   │   ├── Player.ts       # Player character
│   │   ├── Zombie.ts       # Enemy zombies
│   │   ├── Bullet.ts       # Projectiles
│   │   ├── Drop.ts         # Loot drops
│   │   └── Platform.ts     # Level geometry
│   ├── systems/            # Game systems
│   │   ├── gameStore.ts    # Zustand state management
│   │   └── EnemySpawner.ts # Wave spawning logic
│   └── data/               # Game balance data
│       ├── guns.ts         # Weapon definitions
│       ├── armor.ts        # Armor definitions
│       ├── potions.ts      # Consumable items
│       └── upgrades.ts     # Upgrade system
├── public/                 # Static assets
├── package.json
└── DEPLOYMENT_GUIDE.md     # How to deploy and package
```

## Performance

- **Target FPS**: 60
- **Rendering**: Optimized canvas drawing with batch updates
- **Physics**: Discrete collision detection with grid optimization
- **Particles**: Pooled particle emitter with culling
- **State**: Zustand with selective subscriptions (no unnecessary re-renders)

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Package as ZIP
```bash
cd ..
zip -r Stickman-Last-Stand.zip ZombieSticman/ \
  -x "ZombieSticman/node_modules/*" \
     "ZombieSticman/.git/*" \
     "ZombieSticman/.next/*"
```

### Deploy to Vercel
Push to GitHub and connect to Vercel for automatic deployments.

### Other Hosting
See `DEPLOYMENT_GUIDE.md` for detailed instructions for:
- Netlify
- Traditional VPS/Cloud servers
- Docker containers
- Static file hosts

## Game Balance

All values are configurable in `/game/data/`:
- **Gun Stats**: Damage, fire rate, spread, pierce
- **Enemy Stats**: Speed, health, damage per wave
- **Wave Scaling**: 10, 15, 20, 25, 30+ zombies
- **Difficulty**: +6% health/speed per difficulty level
- **Mini Bosses**: Every 5 waves with 4x base health

## Future Enhancement Ideas

- Abilities/perks system
- Sound effects & BGM
- Leaderboards
- Multiplayer
- Mobile touch controls
- More enemy types
- Procedural arena generation
- Achievement system
- Trading/economy

## Technical Highlights

**State Management**: Zustand store with localStorage persistence for coins, equipment, and stats

**Physics**: Custom gravity-based collision with ground and platform detection

**Input Handling**: Event-based keyboard tracking with debounced input flush

**Rendering**: Single canvas context with layer-based drawing (background → enemies → bullets → UI)

**Particles**: Efficient particle pool with automatic garbage collection

**Spawning**: Wave-based enemy spawner with difficulty scaling via elapsed time tracking

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Any modern browser with HTML5 Canvas

## System Requirements

- **Minimum**: 2GB RAM, 1 GHz processor
- **Recommended**: 4GB RAM, quad-core processor
- **Display**: 960x540 minimum resolution

## Credits

Developed as a complete, production-ready indie web game.

---

## Getting Help

1. **Read** `DEPLOYMENT_GUIDE.md` for deployment questions
2. **Check** game logic in `/game/engine/GameEngine.ts` for mechanics
3. **Modify** `/game/data/` files for balance adjustments
4. **Customize** `/components/` files for UI changes

---

**Ready to play?** Run `npm install && npm run dev` to start!
