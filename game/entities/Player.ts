import { Platform, resolveCollision } from './Platform';
import { InputHandler } from '@/game/engine/InputHandler';
import { PlayerStats } from '@/game/data/gameData';

const GRAVITY = 700;
const JUMP_VEL = -420;

export class Player {
  x: number;
  y: number;
  w = 32;
  h = 60;
  vx = 0;
  vy = 0;
  onGround = false;
  facing = 1;
  isAttacking = false;
  attackTimer = 0;
  attackCooldown = 0;
  flashTimer = 0;
  invincibleTimer = 0;
  speedBoostTimer = 0;
  damageBoostTimer = 0;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
  }

  update(dt: number, input: InputHandler, platforms: Platform[], stats: PlayerStats) {
    // timers
    if (this.attackTimer > 0) this.attackTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;
    if (this.damageBoostTimer > 0) this.damageBoostTimer -= dt;

    this.isAttacking = this.attackTimer > 0;

    // movement
    const spd = stats.speed * (this.speedBoostTimer > 0 ? 1.5 : 1);
    if (input.isLeft()) {
      this.vx = -spd;
      this.facing = -1;
    } else if (input.isRight()) {
      this.vx = spd;
      this.facing = 1;
    } else {
      this.vx *= 0.8;
      if (Math.abs(this.vx) < 5) this.vx = 0;
    }

    if (input.isJump() && this.onGround) {
      this.vy = JUMP_VEL;
      this.onGround = false;
    }

    if (input.isAttack() && this.attackCooldown <= 0) {
      this.attackTimer = 0.25;
      this.attackCooldown = 0.45;
    }

    // gravity
    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    resolveCollision(this, platforms);
  }

  getHitbox() {
    const reach = this.facing * (this.w * 0.8);
    return {
      x: this.x + this.w / 2 + (this.facing > 0 ? 0 : -this.w * 0.8),
      y: this.y + this.h * 0.2,
      w: this.w * 0.8,
      h: this.h * 0.5,
    };
  }

  takeDamage(dmg: number) {
    if (this.invincibleTimer > 0) return 0;
    this.flashTimer = 0.15;
    this.invincibleTimer = 0.6;
    return dmg;
  }
}
