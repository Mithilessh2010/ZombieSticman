const GRAVITY = 720;

export type ZombieType = 'basic' | 'fast' | 'tank';

export class Zombie {
  x: number; y: number;
  w: number; h: number;
  vx = 0; vy = 0;
  onGround = false;
  facing = 1;
  health: number; maxHealth: number;
  speed: number; damage: number;
  xpValue: number; coinValue: number;
  type: ZombieType;
  flashTimer = 0;
  attackCooldown = 0;
  dead = false;

  constructor(x: number, y: number, type: ZombieType, diff: number) {
    this.x = x; this.y = y; this.type = type;
    const d = 1 + diff * 0.06;
    if (type === 'tank') {
      this.w = 38; this.h = 68;
      this.speed = 75 * d; this.maxHealth = Math.round(120 * d);
      this.damage = 18; this.xpValue = 18; this.coinValue = 3;
    } else if (type === 'fast') {
      this.w = 24; this.h = 50;
      this.speed = 210 * d; this.maxHealth = Math.round(28 * d);
      this.damage = 10; this.xpValue = 10; this.coinValue = 2;
    } else {
      this.w = 28; this.h = 56;
      this.speed = 105 * d; this.maxHealth = Math.round(45 * d);
      this.damage = 12; this.xpValue = 8; this.coinValue = 1;
    }
    this.health = this.maxHealth;
  }

  update(dt: number, px: number, groundY: number) {
    if (this.dead) return;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    this.facing = px > this.x ? 1 : -1;
    this.vx = this.facing * this.speed;
    this.vy += GRAVITY * dt;
    this.x += this.vx * dt; this.y += this.vy * dt;

    if (this.y + this.h >= groundY) { this.y = groundY - this.h; this.vy = 0; this.onGround = true; }
  }

  hit(dmg: number) {
    this.health -= dmg; this.flashTimer = 0.1;
    if (this.health <= 0) { this.dead = true; return true; }
    return false;
  }

  overlaps(o: { x: number; y: number; w: number; h: number }) {
    return this.x < o.x+o.w && this.x+this.w > o.x && this.y < o.y+o.h && this.y+this.h > o.y;
  }
  cx() { return this.x + this.w/2; }
  cy() { return this.y + this.h/2; }
}
