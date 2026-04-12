// src/game/enemy.ts
import { EnemyType } from '@/types';
import { ParticleSystem } from './particle';
import { Bullet } from './bullet';

export interface EnemySpawnData {
  type: EnemyType;
  x: number;
  y: number;
}

export class Enemy {
  x: number;
  y: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  xpValue: number;
  coinValue: number;
  size: number;
  color: string;
  hitColor: string;
  alive = true;
  hitFlash = 0;

  // AI state
  angle = 0;
  stateTimer = 0;
  state: 'chase' | 'attack' | 'idle' | 'charge' | 'shoot' = 'chase';
  chargeVx = 0;
  chargeVy = 0;

  // Spitter bullet timer
  shootTimer = 0;
  pendingBullet: { vx: number; vy: number } | null = null;

  // Bomber
  bomberTimer = 0;

  // Splitter
  hasSplit = false;

  // Shielder
  shieldHP = 40;
  shieldActive = true;

  // Invisible
  invisible = false;
  visibleTimer = 0;

  // Boss
  isBoss = false;
  bossPhase = 1;
  specialTimer = 0;
  pendingAOE: { x: number; y: number; radius: number; dmg: number } | null = null;

  private particles: ParticleSystem;

  constructor(data: EnemySpawnData, particles: ParticleSystem) {
    this.x = data.x;
    this.y = data.y;
    this.type = data.type;
    this.particles = particles;

    const cfg = ENEMY_CONFIG[data.type];
    this.health = cfg.health;
    this.maxHealth = cfg.health;
    this.speed = cfg.speed;
    this.damage = cfg.damage;
    this.xpValue = cfg.xp;
    this.coinValue = cfg.coins;
    this.size = cfg.size;
    this.color = cfg.color;
    this.hitColor = cfg.hitColor;

    if (data.type === 'invisible') {
      this.invisible = true;
    }
    if (['boss_abomination', 'boss_necromancer', 'boss_behemoth'].includes(data.type)) {
      this.isBoss = true;
    }
  }

  takeDamage(dmg: number): number {
    if (this.type === 'shielder' && this.shieldActive) {
      this.shieldHP -= dmg;
      if (this.shieldHP <= 0) {
        this.shieldActive = false;
        this.particles.explosion(this.x, this.y, 30);
      }
      this.hitFlash = 0.15;
      return 0;
    }

    this.health -= dmg;
    this.hitFlash = 0.2;
    this.particles.spark(this.x, this.y, this.hitColor, 4);

    if (this.type === 'invisible') {
      this.invisible = false;
      this.visibleTimer = 1500;
    }

    if (this.health <= 0) {
      this.die();
      return this.xpValue;
    }

    // Boss phase transition
    if (this.isBoss && this.bossPhase === 1 && this.health < this.maxHealth * 0.5) {
      this.bossPhase = 2;
      this.speed *= 1.4;
      this.damage = Math.round(this.damage * 1.3);
      this.particles.explosion(this.x, this.y, 100);
    }

    return 0;
  }

  die() {
    this.alive = false;
    if (this.type === 'bomber') {
      this.particles.explosion(this.x, this.y, 80);
      this.pendingAOE = { x: this.x, y: this.y, radius: 80, dmg: this.damage * 2 };
    } else if (this.type === 'splitter' && !this.hasSplit) {
      // Signal to engine to spawn 2 walkers
    } else {
      this.particles.blood(this.x, this.y, 8);
    }
  }

  update(dt: number, playerX: number, playerY: number): Bullet | null {
    if (this.hitFlash > 0) this.hitFlash -= dt * 5;
    if (this.stateTimer > 0) this.stateTimer -= dt * 1000;

    // Invisible timer
    if (this.type === 'invisible' && !this.invisible) {
      this.visibleTimer -= dt * 1000;
      if (this.visibleTimer <= 0) this.invisible = true;
    }

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);

    let bullet: Bullet | null = null;

    switch (this.type) {
      case 'walker':
        this.moveToward(dx, dy, dist, dt);
        break;

      case 'runner':
        this.moveToward(dx, dy, dist, dt, 1.5);
        break;

      case 'tank':
        this.moveToward(dx, dy, dist, dt, 0.6);
        break;

      case 'spitter':
        if (dist > 200) this.moveToward(dx, dy, dist, dt, 0.7);
        this.shootTimer -= dt * 1000;
        if (this.shootTimer <= 0 && dist < 500) {
          this.shootTimer = 2000;
          bullet = new Bullet({
            x: this.x, y: this.y,
            vx: (dx / dist) * 350, vy: (dy / dist) * 350,
            damage: this.damage, isCrit: false,
            range: 520, size: 5, color: '#86efac',
            piercing: 0, weaponType: 'pistol',
          });
        }
        break;

      case 'bomber':
        this.bomberTimer += dt * 1000;
        this.moveToward(dx, dy, dist, dt, 1.3);
        if (dist < 60) {
          this.health = 0;
          this.die();
        }
        break;

      case 'splitter':
        this.moveToward(dx, dy, dist, dt);
        break;

      case 'shielder':
        this.moveToward(dx, dy, dist, dt, 0.8);
        break;

      case 'invisible':
        this.moveToward(dx, dy, dist, dt, 1.1);
        break;

      case 'boss_abomination':
        this.moveToward(dx, dy, dist, dt, 0.9);
        this.specialTimer -= dt * 1000;
        if (this.specialTimer <= 0) {
          this.specialTimer = 4000 / this.bossPhase;
          // Charge
          this.state = 'charge';
          this.chargeVx = (dx / dist) * 500;
          this.chargeVy = (dy / dist) * 500;
          this.stateTimer = 400;
        }
        if (this.state === 'charge' && this.stateTimer > 0) {
          this.x += this.chargeVx * dt;
          this.y += this.chargeVy * dt;
        } else if (this.state === 'charge') {
          this.state = 'chase';
        }
        break;

      case 'boss_necromancer':
        if (dist > 300) this.moveToward(dx, dy, dist, dt, 0.6);
        this.specialTimer -= dt * 1000;
        if (this.specialTimer <= 0) {
          this.specialTimer = 3000;
          // Shoot ring
          for (let i = 0; i < 8; i++) {
            // Handled by engine via pendingBullet
          }
          this.pendingBullet = { vx: dx / dist * 300, vy: dy / dist * 300 };
        }
        if (this.pendingBullet) {
          bullet = new Bullet({
            x: this.x, y: this.y,
            vx: this.pendingBullet.vx, vy: this.pendingBullet.vy,
            damage: this.damage, isCrit: false, range: 600, size: 7,
            color: '#a78bfa', piercing: 2, weaponType: 'laser',
          });
          this.pendingBullet = null;
        }
        break;

      case 'boss_behemoth':
        this.moveToward(dx, dy, dist, dt, 0.5);
        this.specialTimer -= dt * 1000;
        if (this.specialTimer <= 0 && dist < 200) {
          this.specialTimer = 5000;
          this.pendingAOE = { x: this.x, y: this.y, radius: 150, dmg: this.damage * 3 };
          this.particles.explosion(this.x, this.y, 150);
        }
        break;
    }

    return bullet;
  }

  private moveToward(dx: number, dy: number, dist: number, dt: number, speedMult = 1) {
    if (dist < 5) return;
    this.x += (dx / dist) * this.speed * speedMult * dt;
    this.y += (dy / dist) * this.speed * speedMult * dt;
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const sx = this.x - camX;
    const sy = this.y - camY;

    // Cull offscreen
    if (sx < -100 || sx > ctx.canvas.width + 100 || sy < -100 || sy > ctx.canvas.height + 100) return;

    ctx.save();

    if (this.type === 'invisible' && this.invisible) {
      ctx.globalAlpha = 0.15;
    }

    ctx.translate(sx, sy);
    ctx.rotate(this.angle - Math.PI / 2);

    const flash = this.hitFlash > 0;
    const col = flash ? '#ffffff' : this.color;

    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = this.isBoss ? 20 : 8;
    ctx.lineWidth = this.isBoss ? 3.5 : 2;
    ctx.lineCap = 'round';

    if (this.isBoss) {
      this.drawBoss(ctx, col);
    } else {
      this.drawStickman(ctx, col);
    }

    // Shield visual
    if (this.type === 'shielder' && this.shieldActive) {
      ctx.rotate(-(this.angle - Math.PI / 2));
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Boss HP bar
    if (this.isBoss) {
      ctx.rotate(-(this.angle - Math.PI / 2));
      const barW = this.size * 3;
      const barH = 8;
      const pct = this.health / this.maxHealth;
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-barW / 2, -this.size - 20, barW, barH);
      ctx.fillStyle = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#fbbf24' : '#ef4444';
      ctx.fillRect(-barW / 2, -this.size - 20, barW * pct, barH);
    }

    ctx.restore();

    // Health bar for normal enemies
    if (!this.isBoss && this.health < this.maxHealth) {
      const bw = this.size * 2.5;
      const pct = this.health / this.maxHealth;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx - bw / 2, sy - this.size - 12, bw, 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(sx - bw / 2, sy - this.size - 12, bw * pct, 4);
    }
  }

  private drawStickman(ctx: CanvasRenderingContext2D, col: string) {
    const s = this.size / 14;
    // Head
    ctx.beginPath();
    ctx.arc(0, -14 * s, 7 * s, 0, Math.PI * 2);
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(0, -7 * s); ctx.lineTo(0, 8 * s);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(-9 * s, -2 * s); ctx.lineTo(9 * s, -2 * s);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(0, 8 * s);
    ctx.lineTo(-8 * s, 18 * s);
    ctx.moveTo(0, 8 * s);
    ctx.lineTo(8 * s, 18 * s);
    ctx.stroke();
  }

  private drawBoss(ctx: CanvasRenderingContext2D, col: string) {
    const s = this.size / 14;
    // Bigger stickman with extra features
    ctx.lineWidth = 4;
    // Head with crown/spikes
    ctx.beginPath();
    ctx.arc(0, -20 * s, 10 * s, 0, Math.PI * 2);
    ctx.stroke();

    // Spikes
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 10 * s, -20 * s + Math.sin(a) * 10 * s);
      ctx.lineTo(Math.cos(a) * 16 * s, -20 * s + Math.sin(a) * 16 * s);
      ctx.stroke();
    }

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -10 * s); ctx.lineTo(0, 16 * s);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(-16 * s, 0); ctx.lineTo(16 * s, 0);
    ctx.stroke();
    // Claws
    ctx.beginPath();
    ctx.moveTo(-16 * s, 0); ctx.lineTo(-22 * s, -6 * s);
    ctx.moveTo(-16 * s, 0); ctx.lineTo(-22 * s, 6 * s);
    ctx.moveTo(16 * s, 0); ctx.lineTo(22 * s, -6 * s);
    ctx.moveTo(16 * s, 0); ctx.lineTo(22 * s, 6 * s);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(0, 16 * s);
    ctx.lineTo(-12 * s, 30 * s);
    ctx.moveTo(0, 16 * s);
    ctx.lineTo(12 * s, 30 * s);
    ctx.stroke();
  }
}

interface EnemyConfig {
  health: number;
  speed: number;
  damage: number;
  xp: number;
  coins: number;
  size: number;
  color: string;
  hitColor: string;
}

const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  walker:    { health: 60,   speed: 70,  damage: 10, xp: 5,   coins: 1, size: 14, color: '#86efac', hitColor: '#bbf7d0' },
  runner:    { health: 40,   speed: 140, damage: 8,  xp: 6,   coins: 1, size: 12, color: '#fde047', hitColor: '#fef9c3' },
  tank:      { health: 250,  speed: 45,  damage: 25, xp: 15,  coins: 3, size: 22, color: '#f87171', hitColor: '#fecaca' },
  spitter:   { health: 70,   speed: 60,  damage: 15, xp: 10,  coins: 2, size: 14, color: '#4ade80', hitColor: '#bbf7d0' },
  bomber:    { health: 50,   speed: 100, damage: 50, xp: 8,   coins: 2, size: 13, color: '#fb923c', hitColor: '#fed7aa' },
  splitter:  { health: 80,   speed: 80,  damage: 12, xp: 10,  coins: 2, size: 16, color: '#a78bfa', hitColor: '#ede9fe' },
  shielder:  { health: 120,  speed: 55,  damage: 20, xp: 12,  coins: 3, size: 16, color: '#38bdf8', hitColor: '#e0f2fe' },
  invisible: { health: 60,   speed: 110, damage: 20, xp: 12,  coins: 3, size: 12, color: '#c084fc', hitColor: '#f3e8ff' },
  boss_abomination: { health: 1200, speed: 90, damage: 35, xp: 200, coins: 50, size: 40, color: '#ef4444', hitColor: '#fca5a5' },
  boss_necromancer: { health: 900,  speed: 70, damage: 25, xp: 200, coins: 50, size: 35, color: '#a78bfa', hitColor: '#c4b5fd' },
  boss_behemoth:    { health: 2000, speed: 60, damage: 50, xp: 300, coins: 80, size: 55, color: '#f97316', hitColor: '#fdba74' },
};
