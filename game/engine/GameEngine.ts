import { Renderer } from '@/game/engine/Renderer';
import { InputHandler } from '@/game/engine/InputHandler';
import { ParticleSystem } from '@/game/engine/ParticleSystem';
import { Player } from '@/game/entities/Player';
import { Zombie } from '@/game/entities/Zombie';
import { Bullet } from '@/game/entities/Bullet';
import { Drop } from '@/game/entities/Drop';
import { Platform, buildPlatforms, resolveCollision } from '@/game/entities/Platform';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { RunStats } from '@/game/data/upgrades';
import { GunDef, getGun } from '@/game/data/guns';

export type EngineEvent = 'damage' | 'kill' | 'xp' | 'coin' | 'dead' | 'levelup' | 'waveComplete';
export type EngineCallback = (e: EngineEvent, val?: number) => void;

const CW = 960;
const CH = 540;
const GROUND_Y = CH - 50;

export class GameEngine {
  public renderer: Renderer;
  private input: InputHandler;
  private particles: ParticleSystem;
  private player: Player;
  private zombies: Zombie[] = [];
  private bullets: Bullet[] = [];
  private drops: Drop[] = [];
  private platforms: Platform[];
  private spawner: EnemySpawner;
  private gun: GunDef | null;
  private stats: RunStats;
  private raf = 0;
  private last = 0;
  private elapsed = 0;
  private cb: EngineCallback;
  private paused = false;
  private waveInProgress = false;
  private waveZombieCount = 0;
  private waveCheckDelay = 0;
  private waveNumber = 1;

  constructor(canvas: HTMLCanvasElement, gunId: string, stats: RunStats, cb: EngineCallback, waveNumber: number = 1) {
    this.renderer = new Renderer(canvas);
    this.input = new InputHandler(canvas);
    this.particles = new ParticleSystem();
    this.platforms = buildPlatforms(CW, CH);
    this.spawner = new EnemySpawner(CW, CH - 50);
    this.gun = gunId ? getGun(gunId) : null;
    this.stats = stats;
    this.cb = cb;
    this.player = new Player(CW / 2 - 14, CH - 100);
    this.waveInProgress = true;
    this.waveNumber = waveNumber;
    // Set difficulty based on wave number (each wave increases difficulty by 1)
    this.elapsed = (waveNumber - 1) * 3;
  }

  start() { this.last = performance.now(); this.raf = requestAnimationFrame(this.loop); }
  stop()  { cancelAnimationFrame(this.raf); this.input.destroy(); }
  pause() { this.paused = true; }
  resume(newStats: RunStats) { this.stats = newStats; this.paused = false; this.last = performance.now(); this.raf = requestAnimationFrame(this.loop); }

  private loop = (now: number) => {
    if (this.paused) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.elapsed += dt;
    this.update(dt);
    this.draw();
    this.input.flush();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const p = this.player;
    p.update(dt, this.input, this.stats, GROUND_Y, CW);

    // Apply platform collision to player
    resolveCollision(p, this.platforms);

    // handle punch attack
    if (this.input.punch() && p.punchCooldown <= 0) {
      this.punch();
      p.punchCooldown = 0.5;
    }

    // handle gun shooting (mouse click, only if gun equipped)
    if (this.gun && this.input.isMouseClicked() && p.fireCooldown <= 0) {
      const mousePos = this.input.getMousePos();
      this.fireBullets(mousePos.x, mousePos.y);
      p.fireCooldown = 1 / (this.gun.fireRate * this.stats.fireRateMult);
    }

    // Calculate target zombie count for this wave
    const targetZombies = 10 + Math.min(this.waveNumber - 1, 5) * 5; // 10, 15, 20, 25, 30...

    // spawn zombies
    if (this.waveInProgress && this.waveZombieCount < targetZombies) {
      const newZ = this.spawner.update(dt, Math.floor(this.elapsed / 3), this.waveNumber);
      for (const z of newZ) {
        if (this.waveZombieCount < targetZombies) {
          this.zombies.push(z);
          this.waveZombieCount++;
        }
      }
    }

    // update zombies
    for (const z of this.zombies) {
      if (z.dead) continue;
      z.update(dt, p.cx(), GROUND_Y);

      // Apply platform collision to zombies (keep them on ground level)
      resolveCollision(z, this.platforms);

      // zombie hits player
      if (z.overlaps(p) && z.attackCooldown <= 0) {
        const dmg = p.takeDamage(z.damage);
        if (dmg > 0) {
          z.attackCooldown = 0.9;
          this.cb('damage', dmg);
          this.particles.emit(p.cx(), p.cy(), '#ff5252', 6, 80);
        }
      }
    }

    // update bullets
    for (const b of this.bullets) {
      if (b.dead) continue;
      b.update(dt, CW);
      for (const z of this.zombies) {
        if (z.dead || !b.overlaps(z)) continue;
        const killed = z.hit(b.damage);
        this.particles.emit(z.cx(), z.cy(), '#ffcc02', 7, 110);
        b.hits++;
        if (b.hits > b.pierce) b.dead = true;
        if (killed) {
          this.cb('kill');
          this.spawnDrops(z);
          // Handle explosion on exploder death
          if (z.type === 'exploder' && z.explodeRadius > 0) {
            this.triggerExplosion(z.cx(), z.cy(), z.explodeRadius, z.explodeDamage);
          }
        }
        if (b.dead) break;
      }
    }

    // update drops
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.update(dt);
      if (d.overlaps(p)) {
        d.collected = true;
        if (d.type === 'xp') this.cb('xp', d.value);
        else this.cb('coin', d.value);
        this.particles.emit(d.x + 7, d.y + 7, d.type === 'xp' ? '#b39ddb' : '#ffd700', 4, 60);
        this.drops.splice(i, 1);
      }
    }

    this.particles.update(dt);

    // clean up dead entities
    this.zombies = this.zombies.filter(z => !z.dead);
    this.bullets = this.bullets.filter(b => !b.dead);

    // Check if wave is complete
    if (this.waveInProgress && this.waveZombieCount >= targetZombies && this.zombies.length === 0) {
      this.waveCheckDelay += dt;
      if (this.waveCheckDelay >= 0.5) {
        this.waveInProgress = false;
        this.cb('waveComplete');
      }
    }
  }

  private fireBullets(tx: number, ty: number) {
    if (!this.gun) return;
    const g = this.gun;
    const ox = this.player.cx();
    const oy = this.player.y + this.player.h * 0.35;
    const totalPierce = g.pierce + this.stats.bulletPierce;

    const offsets = this.stats.doubleShot ? [0, 10] : [0];
    for (const yo of offsets) {
      for (let i = 0; i < g.pellets; i++) {
        const spreadRad = (g.spread * (Math.random() - 0.5) * 2) * (Math.PI / 180);
        const dx = tx - ox; const dy = (ty + yo) - oy;
        const len = Math.sqrt(dx*dx + dy*dy) || 1;
        const angle = Math.atan2(dy / len, dx / len) + spreadRad;
        const spd = g.bulletSpeed;
        const dmg = Math.round(g.damage * this.stats.damageMult);
        this.bullets.push(new Bullet(ox, oy + yo, Math.cos(angle)*spd, Math.sin(angle)*spd, dmg, g.bulletSize, g.bulletColor, totalPierce));
      }
    }
    this.player.facing = tx > this.player.cx() ? 1 : -1;
  }

  private punch() {
    const px = this.player.cx();
    const py = this.player.cy();
    const range = 80;
    const damage = Math.round(15 * this.stats.damageMult);

    for (const z of this.zombies) {
      if (z.dead) continue;
      const dist = Math.hypot(z.cx() - px, z.cy() - py);
      if (dist < range) {
        const killed = z.hit(damage);
        this.particles.emit(z.cx(), z.cy(), '#ff6f00', 5, 100);
        if (killed) {
          this.cb('kill');
          this.spawnDrops(z);
        }
      }
    }
  }

  private nearestZombie(): Zombie | null {
    let best: Zombie | null = null; let bestD = Infinity;
    const px = this.player.cx(); const py = this.player.cy();
    for (const z of this.zombies) {
      if (z.dead) continue;
      const d = Math.hypot(z.cx() - px, z.cy() - py);
      if (d < bestD) { bestD = d; best = z; }
    }
    return best;
  }

  private spawnDrops(z: Zombie) {
    const ex = z.x + Math.random() * z.w;
    const ey = z.y;
    this.drops.push(new Drop(ex, ey, 'xp', z.xpValue));
    if (Math.random() < 0.55) this.drops.push(new Drop(ex + 16, ey, 'coin', z.coinValue));
  }

  private triggerExplosion(cx: number, cy: number, radius: number, damage: number) {
    for (const z of this.zombies) {
      if (z.dead) continue;
      const d = Math.hypot(z.cx() - cx, z.cy() - cy);
      if (d < radius) {
        const killed = z.hit(damage);
        this.particles.emit(z.cx(), z.cy(), '#ff4500', 6, 120);
        if (killed) {
          this.cb('kill');
          this.spawnDrops(z);
        }
      }
    }
    // Explosion visual
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 0.8;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      this.particles.emit(px, py, '#ff6f00', 5, 150);
    }
  }

  private draw() {
    this.renderer.clear();
    this.renderer.drawGround(GROUND_Y);
    this.renderer.drawPlatforms(this.platforms);
    for (const d of this.drops) this.renderer.drawDrop(d);
    for (const z of this.zombies) this.renderer.drawZombie(z);
    for (const b of this.bullets) this.renderer.drawBullet(b);
    this.renderer.drawPlayer(this.player, this.gun !== null);
    this.renderer.drawParticles(this.particles);
  }

  getElapsed() { return this.elapsed; }
  getEnemyCount() { return this.zombies.filter(z => !z.dead).length; }
  getDifficulty() { return Math.floor(this.elapsed / 3); }
  getWave() { return this.waveNumber; }
}
