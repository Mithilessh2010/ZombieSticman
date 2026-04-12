// src/components/GameCanvas.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import HUD from './HUD';
import UpgradeScreen from './UpgradeScreen';
import PauseMenu from './PauseMenu';
import RunSummary from './RunSummary';

interface Props {
  mapType: string;
  onDead: () => void;
  onMenu: () => void;
}

export default function GameCanvas({ mapType, onDead, onMenu }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<import('@/game/engine').GameEngine | null>(null);
  const { screen, setScreen } = useGameStore();
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Resize handler
  useEffect(() => {
    const resize = () => {
      setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Start engine once canvas is ready
  useEffect(() => {
    if (!canvasRef.current || canvasSize.w === 0) return;

    const canvas = canvasRef.current;
    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;

    let engine: import('@/game/engine').GameEngine;

    import('@/game/engine').then(({ GameEngine }) => {
      engine = new GameEngine(canvas);
      engineRef.current = engine;
      engine.start(mapType as any);
      setScreen('playing');
    });

    return () => {
      engine?.cleanup();
      engineRef.current = null;
    };
  }, []); // Only on mount

  // Update canvas size when resized
  useEffect(() => {
    if (!canvasRef.current || canvasSize.w === 0) return;
    canvasRef.current.width = canvasSize.w;
    canvasRef.current.height = canvasSize.h;
  }, [canvasSize]);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const handleQuit = useCallback(() => {
    engineRef.current?.cleanup();
    engineRef.current = null;
    onMenu();
  }, [onMenu]);

  const handleRestart = useCallback(() => {
    engineRef.current?.cleanup();
    engineRef.current = null;
    onDead();
  }, [onDead]);

  return (
    <div className="relative w-full h-full" style={{ cursor: 'crosshair' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ display: 'block', background: '#0b0f1a' }}
      />

      {/* UI Overlay */}
      {(screen === 'playing' || screen === 'paused') && <HUD />}

      <AnimatePresence>
        {screen === 'upgrade' && <UpgradeScreen key="upgrade" />}
      </AnimatePresence>

      <AnimatePresence>
        {screen === 'paused' && (
          <PauseMenu key="pause" onResume={handleResume} onQuit={handleQuit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen === 'dead' && (
          <RunSummary key="dead" onRestart={handleRestart} onMenu={handleQuit} />
        )}
      </AnimatePresence>
    </div>
  );
}
