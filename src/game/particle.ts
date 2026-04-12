// src/game/particle.ts
import { ParticleData } from '@/types';

export class ParticleSystem {
  particles: ParticleData[] = [];

  spawn(p: Omit<ParticleData, 'alpha'> & { alpha?: number }) {
    this.particles.push({ alpha: 1, ...p });
  }

  blood(x: number, y: number, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 180;
      this.spawn({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4, maxLife: 0.8,
        size: 2 + Math.random() * 4, color: `hsl(${355 + Math.random() * 10}, 80%, 40%)`,
        type: 'blood',
      });
    }
  }

  spark(x: number, y: number, color: string, count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.spawn({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.3, maxLife: 0.6,
        size: 1.5 + Math.random() * 2.5, color,
        type: 'spark',
      });
    }
  }

  muzzleFlash(x: number, y: number, angle: number, color: string) {
    for (let i = 0; i < 4; i++) {
      const spread = (Math.random() - 0.5) * 0.5;
      const speed = 100 + Math.random() * 100;
      this.spawn({
        x, y, vx: Math.cos(angle + spread) * speed, vy: Math.sin(angle + spread) * speed,
        life: 0.1, maxLife: 0.1, size: 3 + Math.random() * 3, color,
        type: 'muzzle',
      });
    }
  }

  explosion(x: number, y: number, radius = 60) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (30 + Math.random() * radius);
      const colors = ['#f97316', '#ef4444', '#fbbf24', '#fff'];
      this.spawn({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.5, maxLife: 1,
        size: 3 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)],
        type: 'explosion',
      });
    }
  }

  xpPop(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      this.spawn({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 30,
        life: 0.6, maxLife: 0.6, size: 3 + Math.random() * 3,
        color: '#a78bfa', type: 'xp',
      });
    }
  }

  damageNumber(x: number, y: number, amount: number, isCrit: boolean) {
    this.spawn({
      x, y: y - 10, vx: (Math.random() - 0.5) * 30, vy: -80 - Math.random() * 40,
      life: 0.8 + (isCrit ? 0.4 : 0), maxLife: 1.2,
      size: isCrit ? 20 : 14, color: isCrit ? '#fbbf24' : '#ffffff',
      type: 'text', text: isCrit ? `${amount}!` : `${amount}`,
    });
  }

  smoke(x: number, y: number) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 40;
    this.spawn({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 20,
      life: 0.8 + Math.random() * 0.4, maxLife: 1.2,
      size: 8 + Math.random() * 12, color: 'rgba(100,100,100,0.4)',
      type: 'smoke',
    });
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type !== 'smoke') {
        p.vx *= 0.96;
        p.vy *= 0.96;
      }
      p.alpha = Math.max(0, p.life / p.maxLife);
    }
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    for (const p of this.particles) {
      const sx = p.x - camX;
      const sy = p.y - camY;
      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.type === 'text' && p.text) {
        ctx.font = `bold ${p.size}px Inter, sans-serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.fillText(p.text, sx, sy);
      } else if (p.type === 'smoke') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * (1 - p.alpha * 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * p.alpha + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
