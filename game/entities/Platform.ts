export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function buildPlatforms(canvasWidth: number, canvasHeight: number): Platform[] {
  const ground = { x: 0, y: canvasHeight - 40, w: canvasWidth, h: 40 };
  return [
    ground,
    { x: 80, y: canvasHeight - 160, w: 140, h: 16 },
    { x: 300, y: canvasHeight - 230, w: 140, h: 16 },
    { x: 520, y: canvasHeight - 160, w: 140, h: 16 },
    { x: 730, y: canvasHeight - 280, w: 140, h: 16 },
    { x: canvasWidth - 220, y: canvasHeight - 160, w: 140, h: 16 },
  ];
}

export function resolveCollision(
  entity: { x: number; y: number; w: number; h: number; vx: number; vy: number; onGround: boolean },
  platforms: Platform[]
) {
  entity.onGround = false;
  for (const p of platforms) {
    if (
      entity.x < p.x + p.w &&
      entity.x + entity.w > p.x &&
      entity.y < p.y + p.h &&
      entity.y + entity.h > p.y
    ) {
      const overlapX = Math.min(entity.x + entity.w - p.x, p.x + p.w - entity.x);
      const overlapY = Math.min(entity.y + entity.h - p.y, p.y + p.h - entity.y);

      if (overlapY < overlapX) {
        if (entity.vy >= 0 && entity.y + entity.h - entity.vy * 0.016 <= p.y + 4) {
          entity.y = p.y - entity.h;
          entity.vy = 0;
          entity.onGround = true;
        } else if (entity.vy < 0) {
          entity.y = p.y + p.h;
          entity.vy = 0;
        }
      } else {
        if (entity.vx > 0) entity.x = p.x - entity.w;
        else if (entity.vx < 0) entity.x = p.x + p.w;
        entity.vx = 0;
      }
    }
  }
}
