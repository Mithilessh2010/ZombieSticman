import { Enemy, EnemyType } from '@/game/entities/Enemy';
import { LevelConfig } from '@/game/data/gameData';

export class EnemySpawner {
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  spawnForLevel(level: LevelConfig): Enemy[] {
    const enemies: Enemy[] = [];
    const groundY = this.canvasHeight - 40;

    for (let i = 0; i < level.enemyCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side === 1
        ? this.canvasWidth - 80 - Math.random() * 200
        : 60 + Math.random() * 200;
      const y = groundY - 60;
      const type = this.pickType(level.id, i);
      enemies.push(new Enemy(x, y, type, level.enemySpeedMult, level.enemyHealthMult));
    }
    return enemies;
  }

  private pickType(levelId: number, index: number): EnemyType {
    if (levelId >= 4) {
      if (index % 4 === 0) return 'tank';
      if (index % 3 === 0) return 'fast';
      return 'basic';
    }
    if (levelId >= 3) {
      if (index % 5 === 0) return 'tank';
      if (index % 3 === 0) return 'fast';
      return 'basic';
    }
    if (levelId >= 2) {
      if (index % 4 === 0) return 'fast';
      return 'basic';
    }
    return 'basic';
  }
}
