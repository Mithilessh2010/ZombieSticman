export class Drop {
  x: number; y: number; baseY: number;
  w = 14; h = 14;
  type: 'xp' | 'coin';
  value: number;
  bob = 0;
  collected = false;

  constructor(x: number, y: number, type: 'xp' | 'coin', value: number) {
    this.x = x; this.y = y; this.baseY = y; this.type = type; this.value = value;
  }

  update(dt: number) {
    this.bob += dt * 3.5;
    this.y = this.baseY + Math.sin(this.bob) * 5;
  }

  overlaps(o: { x: number; y: number; w: number; h: number }) {
    return this.x < o.x+o.w && this.x+this.w > o.x && this.y < o.y+o.h && this.y+this.h > o.y;
  }
}
