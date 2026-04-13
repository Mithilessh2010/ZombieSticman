import { Player } from '@/game/entities/Player';
import { Zombie } from '@/game/entities/Zombie';
import { Bullet } from '@/game/entities/Bullet';
import { Drop } from '@/game/entities/Drop';
import { Platform } from '@/game/entities/Platform';
import { ParticleSystem } from '@/game/engine/ParticleSystem';

export class Renderer {
  ctx: CanvasRenderingContext2D;
  w: number; h: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.w = canvas.width; this.h = canvas.height;
  }

  clear() {
    const g = this.ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, '#0c0c1a'); g.addColorStop(1, '#161628');
    this.ctx.fillStyle = g; this.ctx.fillRect(0, 0, this.w, this.h);
  }

  drawGround(groundY: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#2a2a44';
    ctx.fillRect(0, groundY, this.w, this.h - groundY);
    ctx.fillStyle = '#4a4a7a';
    ctx.fillRect(0, groundY, this.w, 4);
  }

  drawPlatforms(platforms: Platform[]) {
    const ctx = this.ctx;
    for (const p of platforms) {
      ctx.fillStyle = '#3a3a5a';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#5a5a8a';
      ctx.fillRect(p.x, p.y, p.w, 4);
    }
  }

  private stickman(
    x: number, y: number, w: number, h: number,
    color: string, facing: number, flash: boolean, armed = false, mouseAngle?: number
  ) {
    const ctx = this.ctx;
    ctx.strokeStyle = flash ? '#fff' : color;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    const cx = x + w/2;
    const hr = w * 0.27;
    const headY = y + hr;
    const bodyTop = headY + hr;
    const bodyBot = y + h * 0.62;
    const legY = y + h;

    // head
    ctx.beginPath(); ctx.arc(cx, headY, hr, 0, Math.PI*2); ctx.stroke();
    // body
    ctx.beginPath(); ctx.moveTo(cx, bodyTop); ctx.lineTo(cx, bodyBot); ctx.stroke();
    // legs
    ctx.beginPath(); ctx.moveTo(cx, bodyBot); ctx.lineTo(cx - w*0.28, legY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, bodyBot); ctx.lineTo(cx + w*0.28, legY); ctx.stroke();
    // arms
    const ay = bodyTop + (bodyBot - bodyTop)*0.28;
    if (armed) {
      if (mouseAngle !== undefined) {
        // Draw arm pointing at mouse angle
        const armLen = w * 0.65;
        const armEndX = cx + Math.cos(mouseAngle) * armLen;
        const armEndY = ay + Math.sin(mouseAngle) * armLen;
        ctx.beginPath(); ctx.moveTo(cx, ay); ctx.lineTo(armEndX, armEndY); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(cx, ay); ctx.lineTo(cx + facing * w*0.65, ay); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(cx, ay); ctx.lineTo(cx - facing * w*0.35, ay + h*0.12); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(cx, ay); ctx.lineTo(cx + facing * w*0.38, ay + h*0.14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, ay); ctx.lineTo(cx - facing * w*0.38, ay + h*0.14); ctx.stroke();
    }
  }

  drawPlayer(p: Player) {
    this.stickman(p.x, p.y, p.w, p.h, '#4fc3f7', p.facing, p.flashTimer > 0, true, p.mouseAngle);
  }

  drawZombie(z: Zombie) {
    const color = z.type === 'tank' ? '#ef5350' : z.type === 'fast' ? '#ffb300' : '#81c784';
    this.stickman(z.x, z.y, z.w, z.h, color, z.facing, z.flashTimer > 0, false);
    // health bar
    const bw = z.w; const bh = 4;
    this.ctx.fillStyle = '#222'; this.ctx.fillRect(z.x, z.y - 9, bw, bh);
    this.ctx.fillStyle = z.type === 'tank' ? '#ef5350' : z.type === 'fast' ? '#ffb300' : '#66bb6a';
    this.ctx.fillRect(z.x, z.y - 9, bw * (z.health / z.maxHealth), bh);
  }

  drawBullet(b: Bullet) {
    const ctx = this.ctx;
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawDrop(d: Drop) {
    const ctx = this.ctx;
    if (d.type === 'xp') {
      ctx.fillStyle = '#b39ddb';
      ctx.shadowColor = '#b39ddb'; ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8;
    }
    ctx.beginPath(); ctx.arc(d.x + d.w/2, d.y + d.h/2, d.w/2, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.font = '8px Courier New'; ctx.textAlign = 'center';
    ctx.fillText(d.type === 'xp' ? 'xp' : '$', d.x + d.w/2, d.y + d.h/2 + 3);
    ctx.textAlign = 'left';
  }

  drawParticles(ps: ParticleSystem) { ps.draw(this.ctx); }

  drawHUD(
    health: number, maxHealth: number,
    xp: number, xpNext: number,
    level: number, coins: number, kills: number, time: number,
    gunName: string, gunColor: string,
    wave: number, enemyCount: number
  ) {
    const ctx = this.ctx;
    const pad = 12;

    // HP bar
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, pad, 204, 20);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(pad+2, pad+2, 200, 16);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(pad+2, pad+2, Math.max(0, 200*(health/maxHealth)), 16);
    ctx.fillStyle = '#fff'; ctx.font = '11px Courier New';
    ctx.fillText(`HP ${Math.ceil(health)}/${maxHealth}`, pad+6, pad+14);

    // XP bar
    const xby = pad + 26;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, xby, 204, 14);
    ctx.fillStyle = '#4527a0';
    ctx.fillRect(pad+2, xby+2, 200, 10);
    ctx.fillStyle = '#b39ddb';
    ctx.fillRect(pad+2, xby+2, 200*(xp/xpNext), 10);
    ctx.fillStyle = '#e0e0e0'; ctx.font = '9px Courier New';
    ctx.fillText(`LVL ${level}  XP ${xp}/${xpNext}`, pad+4, xby+10);

    // Coins, kills, time (no emojis)
    ctx.fillStyle = '#ffd700'; ctx.font = '13px Courier New';
    ctx.fillText(`Coins: ${coins}`, pad, xby + 30);
    ctx.fillStyle = '#90a4ae'; ctx.font = '12px Courier New';
    ctx.fillText(`Kills: ${kills}   Time: ${Math.floor(time)}s`, pad, xby + 48);

    // Wave # and zombie count (top-right)
    const gx = this.w - 200;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(gx - 6, pad - 2, 200, 22);
    ctx.fillStyle = '#4fc3f7'; ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'right';
    ctx.fillText(`Wave: ${wave}  Zombies: ${enemyCount}`, this.w - pad, pad + 13);
    ctx.textAlign = 'left';

    // Gun name
    const gunX = this.w - 140;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(gunX - 6, xby - 2, 140, 22);
    ctx.fillStyle = gunColor; ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'right';
    ctx.fillText(gunName || 'Fists', this.w - pad, xby + 13);
    ctx.textAlign = 'left';

    // Controls hint (enhanced visibility)
    ctx.fillStyle = '#fff'; ctx.font = '11px Courier New'; ctx.textAlign = 'left';
    ctx.fillText('A/D: Move  Space: Jump  Click: Shoot  R: Punch  I: Inventory', pad, this.h - 8);
  }
}
