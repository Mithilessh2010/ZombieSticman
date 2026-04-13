import { Platform, resolveCollision } from './Platform';

const GRAVITY = 700;

export interface Projectile {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  color: string;
  damage: number;
}

export class Boss {
  x: number;
  y: number;
  w = 56;
  h = 96;
  vx = 0;
  vy = 0;
  onGround = false;
  facing = -1;
  health: number;
  maxHealth = 400;
  speed = 130;
  damage = 20;
  flashTimer = 0;
  isAttacking = false;
  attackTimer = 0;
  phase = 1;
  isDead = false;
  projectiles: Projectile[] = [];
  private stateTimer = 0;
  private state: 'chase' | 'dash' | 'shoot' | 'idle' = 'idle';
  private dashVx = 0;
  private canvasWidth: number;

  constructor(x: number, y: number, canvasWidth: number) {
    this.x = x;
    this.y = y;
    this.canvasWidth = canvasWidth;
    this.health = this.maxHealth;
    this.stateTimer = 2;
  }

  update(dt: number, playerX: number, playerY: number, platforms: Platform[]) {
    if (this.isDead) return;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.attackTimer > 0) this.attackTimer -= dt;
    this.isAttacking = this.attackTimer > 0;

    if (this.health < this.maxHealth * 0.4 && this.phase === 1) {
      this.phase = 2;
      this.speed = 200;
    }

    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      const roll = Math.random();
      if (roll < 0.35) {
        this.state = 'shoot';
        this.stateTimer = 1.5;
        this.fireProjectiles(playerX, playerY);
      } else if (roll < 0.65) {
        this.state = 'dash';
        this.stateTimer = 0.5;
        const dir = playerX > this.x ? 1 : -1;
        this.dashVx = dir * 600;
        this.attackTimer = 0.5;
      } else {
        this.state = 'chase';
        this.stateTimer = this.phase === 2 ? 1.5 : 2.5;
      }
    }

    // movement
    if (this.state === 'chase') {
      const dx = playerX - this.x;
      this.facing = dx > 0 ? 1 : -1;
      this.vx = this.facing * this.speed;
    } else if (this.state === 'dash') {
      this.vx = this.dashVx;
      this.facing = this.dashVx > 0 ? 1 : -1;
    } else {
      this.vx = 0;
    }

    // update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -50 || p.x > this.canvasWidth + 50 || p.y > 900) {
        this.projectiles.splice(i, 1);
      }
    }

    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    resolveCollision(this, platforms);

    // clamp to canvas
    this.x = Math.max(0, Math.min(this.canvasWidth - this.w, this.x));
  }

  private fireProjectiles(px: number, py: number) {
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const count = this.phase === 2 ? 5 : 3;
    for (let i = 0; i < count; i++) {
      const spread = (i - Math.floor(count / 2)) * 0.3;
      const dx = px - cx + Math.random() * 40 - 20;
      const dy = py - cy + Math.random() * 20 - 10;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const spd = 280;
      this.projectiles.push({
        x: cx - 8,
        y: cy - 8,
        w: 16,
        h: 16,
        vx: (dx / len + spread) * spd,
        vy: (dy / len) * spd,
        color: this.phase === 2 ? '#ff1744' : '#ce93d8',
        damage: this.phase === 2 ? 18 : 12,
      });
    }
  }

  takeDamage(dmg: number): boolean {
    this.health -= dmg;
    this.flashTimer = 0.12;
    if (this.health <= 0) {
      this.isDead = true;
      return true;
    }
    return false;
  }

  overlaps(other: { x: number; y: number; w: number; h: number }): boolean {
    return (
      this.x < other.x + other.w &&
      this.x + this.w > other.x &&
      this.y < other.y + other.h &&
      this.y + this.h > other.y
    );
  }
}
