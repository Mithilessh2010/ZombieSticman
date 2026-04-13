export class Bullet {
  x: number; y: number;
  vx: number; vy: number;
  damage: number; size: number; color: string;
  pierce: number; hits = 0;
  dead = false;

  constructor(x: number, y: number, vx: number, vy: number, damage: number, size: number, color: string, pierce: number) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.damage = damage; this.size = size; this.color = color; this.pierce = pierce;
  }

  update(dt: number, cw: number) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (this.x < -20 || this.x > cw + 20) this.dead = true;
  }

  overlaps(o: { x: number; y: number; w: number; h: number }) {
    return this.x > o.x && this.x < o.x+o.w && this.y > o.y && this.y < o.y+o.h;
  }
}
