import { Entity } from './Entity';

export class Particle extends Entity {
  color: string;
  life: number;
  maxLife: number;
  alpha: number = 1;
  gravity: number;

  constructor(x: number, y: number, vx: number, vy: number, color: string, life: number = 1, gravity: number = 0.2) {
    super(x, y, 2, 2);
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.gravity = gravity;
  }

  update(dt: number) {
    super.update(dt);
    this.vy += this.gravity;
    this.life -= 0.02 * dt;
    this.alpha = Math.max(0, this.life / this.maxLife);
    if (this.life <= 0) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    const oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.globalAlpha = oldAlpha;
  }
}

export class FloatingText extends Entity {
  text: string;
  color: string;
  life: number = 1;
  alpha: number = 1;

  constructor(x: number, y: number, text: string, color: string) {
    super(x, y, 0, 0);
    this.text = text;
    this.color = color;
    this.vy = -1;
  }

  update(dt: number) {
    super.update(dt);
    this.life -= 0.015 * dt;
    this.alpha = Math.max(0, this.life);
    if (this.life <= 0) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    const oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    // Note: setting font is expensive, but since these are individual entities 
    // we don't have a clean way to batch without a renderer system.
    // However, we can at least ensure we only set it when needed.
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = oldAlpha;
  }
}
