// src/game/xporb.ts
export class XPOrb {
  x: number;
  y: number;
  value: number;
  size: number;
  vx = 0;
  vy = 0;
  alive = true;
  pulsePhase: number;

  constructor(x: number, y: number, value: number) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.value = value;
    this.size = value >= 20 ? 7 : value >= 10 ? 5 : 3.5;
    this.pulsePhase = Math.random() * Math.PI * 2;
    // Small initial scatter
    const angle = Math.random() * Math.PI * 2;
    const spd = 30 + Math.random() * 60;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
  }

  update(dt: number, playerX: number, playerY: number, magnetRadius: number) {
    // Drift to stop
    this.vx *= Math.max(0, 1 - dt * 4);
    this.vy *= Math.max(0, 1 - dt * 4);

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < magnetRadius) {
      const pullStrength = Math.min(800, 300 + (1 - dist / magnetRadius) * 500);
      this.vx += (dx / dist) * pullStrength * dt;
      this.vy += (dy / dist) * pullStrength * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (dist < 20) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const sx = this.x - camX;
    const sy = this.y - camY;
    const pulse = Math.sin(Date.now() / 300 + this.pulsePhase) * 0.3 + 0.7;

    ctx.save();
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.9;

    // Outer glow
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.size * 2.5);
    grad.addColorStop(0, `rgba(167,139,250,${0.8 * pulse})`);
    grad.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = `rgba(220,200,255,${pulse})`;
    ctx.beginPath();
    ctx.arc(sx, sy, this.size * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
