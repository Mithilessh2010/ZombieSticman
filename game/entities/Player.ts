import { InputHandler } from '@/game/engine/InputHandler';
import { RunStats } from '@/game/data/upgrades';

const GRAVITY = 720;

export class Player {
  x: number; y: number;
  w = 28; h = 56;
  vx = 0; vy = 0;
  onGround = false;
  facing = 1;
  flashTimer = 0;
  invTimer = 0;
  fireCooldown = 0;

  constructor(x: number, y: number) { this.x = x; this.y = y; }

  update(dt: number, input: InputHandler, stats: RunStats, groundY: number, cw: number) {
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.invTimer > 0) this.invTimer -= dt;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;

    if (input.left())  { this.vx = -stats.speed; this.facing = -1; }
    else if (input.right()) { this.vx = stats.speed; this.facing = 1; }
    else { this.vx *= 0.75; if (Math.abs(this.vx) < 3) this.vx = 0; }

    if (input.jump() && this.onGround) { this.vy = -stats.jumpStrength; this.onGround = false; }

    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // ground
    if (this.y + this.h >= groundY) { this.y = groundY - this.h; this.vy = 0; this.onGround = true; }
    // walls
    this.x = Math.max(0, Math.min(cw - this.w, this.x));
  }

  takeDamage(dmg: number): number {
    if (this.invTimer > 0) return 0;
    this.flashTimer = 0.15; this.invTimer = 0.55;
    return dmg;
  }

  cx() { return this.x + this.w / 2; }
  cy() { return this.y + this.h / 2; }
}
