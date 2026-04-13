import { Entity } from './Entity';

export class Bullet extends Entity {
  damage: number;
  color: string;

  constructor(x: number, y: number, vx: number, vy: number, damage: number, color: string = '#fbbf24') {
    super(x, y, 8, 3);
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.color = color;
  }

  update(dt: number) {
    super.update(dt);
    // Bullets travel in straight lines usually
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
