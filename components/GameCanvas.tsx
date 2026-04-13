'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/game/systems/gameStore';
import { GameEngine } from '@/game/engine/GameEngine';
import { getGun } from '@/game/data/guns';

const CW = 960, CH = 540;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const {
    equippedGunId, runStats, runHealth,
    takeDamage, addKill, addRunXp, addRunCoins,
    tickTime, screen, endRun,
  } = useGameStore();

  useEffect(() => {
    if (screen !== 'playing') {
      engineRef.current?.stop();
      engineRef.current = null;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const store = useGameStore.getState();

    const engine = new GameEngine(canvas, equippedGunId, runStats, (evt, val) => {
      const s = useGameStore.getState();
      if (evt === 'damage') { s.takeDamage(val ?? 0); }
      else if (evt === 'kill') { s.addKill(); }
      else if (evt === 'xp') { s.addRunXp(val ?? 0); }
      else if (evt === 'coin') { s.addRunCoins(val ?? 0); }
    });

    engineRef.current = engine;
    engine.start();

    // HUD draw loop (canvas draws its own HUD separately so we can read zustand)
    let rafId = 0;
    let last = performance.now();
    const hudLoop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = useGameStore.getState();
      if (s.screen !== 'playing') return;
      s.tickTime(dt);

      // draw HUD on top of game
      const ctx = canvas.getContext('2d');
      if (!ctx) { rafId = requestAnimationFrame(hudLoop); return; }
      const { runHealth: hp, runStats: rs, runXp, xpToNext, runLevel, runCoins, enemiesKilled, timeAlive } = s;
      const gun = getGun(s.equippedGunId);
      // HUD drawn by renderer — call via engine's renderer access
      engine.renderer.drawHUD(
        hp, rs.maxHealth, runXp, xpToNext, runLevel, runCoins, enemiesKilled, timeAlive,
        gun.name, gun.color
      );

      rafId = requestAnimationFrame(hudLoop);
    };
    rafId = requestAnimationFrame(hudLoop);

    return () => {
      engine.stop();
      cancelAnimationFrame(rafId);
      engineRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // When screen changes to upgrade, pause engine; when back to playing, resume
  useEffect(() => {
    if (!engineRef.current) return;
    if (screen === 'upgrade') {
      engineRef.current.pause();
    } else if (screen === 'playing') {
      engineRef.current.resume(runStats);
    }
  }, [screen, runStats]);

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
    />
  );
}
