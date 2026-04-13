'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/game/systems/gameStore';
import { GameEngine } from '@/game/engine/GameEngine';
import { LEVELS, STORY_BEATS } from '@/game/data/gameData';

const CANVAS_W = 960;
const CANVAS_H = 540;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const {
    currentLevel,
    playerStats,
    playerHealth,
    coins,
    setPlayerHealth,
    addCoins,
    addEnemyKill,
    showStory,
    showUpgrades,
    setScreen,
  } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resolve level index (1-based id → 0-based array index)
    const levelIndex = LEVELS.findIndex((l) => l.id === currentLevel);
    if (levelIndex < 0) return;

    const engine = new GameEngine(
      canvas,
      levelIndex,
      playerStats,
      playerHealth,
      coins,
      (type, data) => {
        if (type === 'coin_collected') {
          addCoins(data as number);
        } else if (type === 'enemy_killed') {
          addEnemyKill();
        } else if (type === 'player_dead') {
          setPlayerHealth(0);
          engine.stop();
          setScreen('gameover');
        } else if (type === 'level_clear') {
          const hp = engine.getCurrentHealth();
          setPlayerHealth(hp);
          addCoins(0); // flush
          engine.stop();

          const storyKey = `after_${currentLevel}`;
          const text = STORY_BEATS[storyKey];
          if (text) {
            showStory(text, 'upgrade');
          } else {
            showUpgrades();
          }
        } else if (type === 'boss_defeated') {
          engine.stop();
          showStory(STORY_BEATS.after_boss, 'victory');
        }
      }
    );

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}
