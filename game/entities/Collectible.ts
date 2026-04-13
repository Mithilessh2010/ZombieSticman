export type CollectibleType = 'coin' | 'potion_heal' | 'potion_speed' | 'potion_damage';

export class Collectible {
  x: number;
  y: number;
  w = 16;
  h = 16;
  vy = 0;
  type: CollectibleType;
  collected = false;
  bobTimer = 0;
  baseY: number;

  constructor(x: number, y: number, type: CollectibleType) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.type = type;
  }

  update(dt: number) {
    this.bobTimer += dt * 3;
    this.y = this.baseY + Math.sin(this.bobTimer) * 4;
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

export function randomCollectibleType(): CollectibleType {
  const r = Math.random();
  if (r < 0.55) return 'coin';
  if (r < 0.7) return 'potion_heal';
  if (r < 0.85) return 'potion_speed';
  return 'potion_damage';
}
