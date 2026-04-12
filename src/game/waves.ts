// src/game/waves.ts
import { EnemyType } from '@/types';
import { EnemySpawnData } from './enemy';

export interface WaveConfig {
  wave: number;
  enemies: SpawnGroup[];
  isBossWave: boolean;
}

interface SpawnGroup {
  type: EnemyType;
  count: number;
  delayMs: number; // delay between this group and previous
}

export class WaveDirector {
  wave = 1;
  spawnQueue: Array<{ type: EnemyType; x: number; y: number; delay: number }> = [];
  spawnTimer = 0;
  waveActive = false;
  waveComplete = false;
  betweenWaveTimer = 0;
  enemiesAlive = 0;
  totalEnemiesThisWave = 0;

  private worldW: number;
  private worldH: number;

  constructor(worldW: number, worldH: number) {
    this.worldW = worldW;
    this.worldH = worldH;
  }

  startWave(playerX: number, playerY: number) {
    const config = this.buildWaveConfig(this.wave);
    this.waveActive = true;
    this.waveComplete = false;
    this.betweenWaveTimer = 0;
    this.spawnQueue = [];
    let delay = 0;
    let total = 0;

    for (const group of config.enemies) {
      delay += group.delayMs;
      for (let i = 0; i < group.count; i++) {
        const pos = this.spawnPosition(playerX, playerY);
        this.spawnQueue.push({ type: group.type, ...pos, delay: delay + i * 200 });
        total++;
      }
    }

    this.totalEnemiesThisWave = total;
    this.enemiesAlive = total;
    this.spawnTimer = 0;
  }

  update(dt: number): EnemySpawnData[] {
    const spawned: EnemySpawnData[] = [];
    this.spawnTimer += dt * 1000;

    for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
      const s = this.spawnQueue[i];
      if (this.spawnTimer >= s.delay) {
        spawned.push({ type: s.type, x: s.x, y: s.y });
        this.spawnQueue.splice(i, 1);
      }
    }
    return spawned;
  }

  onEnemyKilled() {
    this.enemiesAlive--;
    if (this.enemiesAlive <= 0 && this.spawnQueue.length === 0) {
      this.waveActive = false;
      this.waveComplete = true;
    }
  }

  nextWave() {
    this.wave++;
    this.waveComplete = false;
  }

  private buildWaveConfig(wave: number): WaveConfig {
    const isBossWave = wave % 5 === 0;
    const enemies: SpawnGroup[] = [];

    const count = (base: number) => Math.floor(base + wave * 0.8);
    const eliteChance = Math.min(0.6, wave * 0.05);

    if (isBossWave) {
      const bossTypes: EnemyType[] = ['boss_abomination', 'boss_necromancer', 'boss_behemoth'];
      const bossIdx = Math.floor((wave / 5 - 1) % 3);
      enemies.push({ type: bossTypes[bossIdx], count: 1, delayMs: 1000 });
      enemies.push({ type: 'walker', count: count(5), delayMs: 0 });
      if (wave >= 10) enemies.push({ type: 'runner', count: count(3), delayMs: 500 });
    } else {
      enemies.push({ type: 'walker', count: count(3 + wave), delayMs: 0 });
      if (wave >= 2) enemies.push({ type: 'runner', count: count(1 + wave * 0.4), delayMs: 1000 });
      if (wave >= 3) enemies.push({ type: 'bomber', count: Math.floor(wave * 0.3), delayMs: 2000 });
      if (wave >= 4) enemies.push({ type: 'tank', count: Math.max(0, Math.floor(wave * 0.2)), delayMs: 1500 });
      if (wave >= 6) enemies.push({ type: 'spitter', count: Math.floor(wave * 0.3), delayMs: 2500 });
      if (wave >= 7 && Math.random() < eliteChance) enemies.push({ type: 'splitter', count: Math.floor(wave * 0.2), delayMs: 3000 });
      if (wave >= 8 && Math.random() < eliteChance) enemies.push({ type: 'shielder', count: Math.floor(wave * 0.15), delayMs: 3500 });
      if (wave >= 10 && Math.random() < eliteChance * 0.5) enemies.push({ type: 'invisible', count: Math.floor(wave * 0.1), delayMs: 4000 });
    }

    return { wave, enemies, isBossWave };
  }

  private spawnPosition(playerX: number, playerY: number) {
    const margin = 80;
    const minDist = 400;
    let x: number, y: number;
    let attempts = 0;

    do {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: x = Math.random() * this.worldW; y = margin; break;
        case 1: x = Math.random() * this.worldW; y = this.worldH - margin; break;
        case 2: x = margin; y = Math.random() * this.worldH; break;
        default: x = this.worldW - margin; y = Math.random() * this.worldH; break;
      }
      const dx = x - playerX, dy = y - playerY;
      if (Math.sqrt(dx * dx + dy * dy) >= minDist) break;
      attempts++;
    } while (attempts < 20);

    return { x: x!, y: y! };
  }
}
