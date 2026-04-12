// src/game/bullet.ts
import { WeaponType } from '@/types';

export class Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  isCrit: boolean;
  range: number;
  traveled = 0;
  size: number;
  color: string;
  piercing: number;
  piercedCount = 0;
  weaponType: WeaponType;
  alive = true;

  constructor(data: {
    x: number; y: number; vx: number; vy: number;
    damage: number; isCrit: boolean; range: number;
    size: number; color: string; piercing: number; weaponType: WeaponType;
  }) {
    Object.assign(this, data);
    this.x = data.x; this.y = data.y;
    this.vx = data.vx; this.vy = data.vy;
    this.damage = data.damage; this.isCrit = data.isCrit;
    this.range = data.range; this.size = data.size;
    this.color = data.color; this.piercing = data.piercing;
    this.weaponType = data.weaponType;
  }

  update(dt: number) {
    const dx = this.vx * dt;
    const dy = this.vy * dt;
    this.x += dx;
    this.y += dy;
    this.traveled += Math.sqrt(dx * dx + dy * dy);
    if (this.traveled >= this.range) this.alive = false;
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const sx = this.x - camX;
    const sy = this.y - camY;

    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.weaponType === 'laser' ? 12 : 6;
    ctx.fillStyle = this.color;

    if (this.weaponType === 'rocket_launcher') {
      // Rocket: elongated
      ctx.translate(sx, sy);
      ctx.rotate(Math.atan2(this.vy, this.vx));
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.weaponType === 'flamethrower') {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(sx, sy, this.size, 0, Math.PI * 2);
      ctx.fill();
      // Trail
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(sx - this.vx * 0.015, sy - this.vy * 0.015, this.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
