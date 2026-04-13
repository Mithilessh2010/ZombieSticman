import { Zombie, ZombieType } from '@/game/entities/Zombie';

export class EnemySpawner {
  private timer = 0;
  private cw: number;
  private groundY: number;

  constructor(cw: number, groundY: number) { this.cw = cw; this.groundY = groundY; }

  update(dt: number, difficulty: number, waveNumber: number): Zombie[] {
    const interval = Math.max(0.38, 2.2 - difficulty * 0.04);
    this.timer += dt;
    const spawned: Zombie[] = [];
    while (this.timer >= interval) {
      this.timer -= interval;
      spawned.push(this.spawnOne(difficulty, waveNumber));
    }
    return spawned;
  }

  private spawnOne(diff: number, wave: number): Zombie {
    const side = Math.random() < 0.5 ? -1 : 1;
    const x = side === -1 ? -40 : this.cw + 10;
    const y = this.groundY - 60;
    const type = this.pickType(diff, wave);
    return new Zombie(x, y, type, diff);
  }

  private pickType(diff: number, wave: number): ZombieType {
    // Mini boss spawns every 5 waves
    if (wave % 5 === 0) return 'miniboss';

    const r = Math.random();
    if (diff > 20 && r < 0.15) return 'exploder';
    if (diff > 20 && r < 0.25) return 'tank';
    if (diff > 10 && r < 0.12) return 'exploder';
    if (diff > 10 && r < 0.28) return 'fast';
    if (diff > 5 && r < 0.20) return 'fast';
    return 'basic';
  }
}
