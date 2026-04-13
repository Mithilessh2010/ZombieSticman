import { Platform, resolveCollision } from './Platform';

const GRAVITY = 700;

export type EnemyType = 'basic' | 'fast' | 'tank';

export class Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  vx = 0;
  vy = 0;
  onGround = false;
  facing = -1;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  type: EnemyType;
  flashTimer = 0;
  attackCooldown = 0;
  isDead = false;

  constructor(x: number, y: number, type: EnemyType, speedMult: number, healthMult: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    if (type === 'tank') {
      this.w = 40;
      this.h = 72;
      this.speed = 80 * speedMult;
      this.maxHealth = Math.round(80 * healthMult);
      this.damage = 18;
    } else if (type === 'fast') {
      this.w = 28;
      this.h = 52;
      this.speed = 180 * speedMult;
      this.maxHealth = Math.round(30 * healthMult);
      this.damage = 10;
    } else {
      this.w = 32;
      this.h = 60;
      this.speed = 110 * speedMult;
      this.maxHealth = Math.round(40 * healthMult);
      this.damage = 12;
    }
    this.health = this.maxHealth;
  }

  update(dt: number, playerX: number, playerY: number, platforms: Platform[]) {
    if (this.isDead) return;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const dx = playerX - this.x;
    this.facing = dx > 0 ? 1 : -1;
    this.vx = this.facing * this.speed;

    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    resolveCollision(this, platforms);
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
