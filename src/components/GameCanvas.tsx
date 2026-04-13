import React, { useEffect, useRef } from 'react';
import { Engine } from '../game/Engine';
import { useGameStore } from '../store/useGameStore';
import { HUD } from './HUD';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const gameState = useGameStore(state => state.gameState);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new Engine(canvas);
    engineRef.current = engine;

    let animationFrameId: number;

    const render = (time: number) => {
      engine.update(time);
      engine.draw();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.groundY = canvas.height - 50;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {gameState === 'PLAYING' && <HUD />}
    </div>
  );
};
