# STICKMAN: LAST STAND 🧟

A top-down roguelike zombie survival shooter. Survive endless waves, level up, collect powerful upgrades, and unlock permanent progression.

## Features

- Top-down stickman shooter with roguelike progression
- 10+ weapon types with unique feel
- 8 enemy types including epic bosses
- 50+ stackable upgrades
- Permanent meta-progression skill tree
- Screen shake, particles, damage numbers, and full game juice
- Dynamic wave difficulty scaling
- Stat tracking with localStorage

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) and it auto-deploys.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Aim |
| Click | Shoot |
| Shift | Dash |
| R | Reload |
| ESC | Pause |
| 1-5 | Swap Weapon |

## Stack

- **Next.js 14** — App Router, static export
- **React 18** — UI layer
- **TypeScript** — Full type safety
- **TailwindCSS** — Styling
- **Framer Motion** — UI animations
- **Zustand** — Game state
- **HTML5 Canvas** — Game rendering

## Architecture

```
src/
├── app/          — Next.js pages & layout
├── components/   — React UI components (HUD, menus, screens)
├── game/         — Core game engine (pure TS, no React)
│   ├── engine.ts     — Game loop & coordinator
│   ├── player.ts     — Player entity
│   ├── enemy.ts      — Enemy types & AI
│   ├── bullet.ts     — Projectile system
│   ├── particle.ts   — VFX particle system
│   ├── xporb.ts      — XP pickup
│   ├── waves.ts      — Wave director AI
│   ├── upgrades.ts   — Upgrade definitions
│   └── renderer.ts   — Canvas drawing
├── store/        — Zustand global store
└── types/        — TypeScript interfaces
```
