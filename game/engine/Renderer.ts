import { Player } from '@/game/entities/Player';
import { Enemy } from '@/game/entities/Enemy';
import { Boss } from '@/game/entities/Boss';
import { Collectible } from '@/game/entities/Collectible';
import { Platform } from '@/game/entities/Platform';
import { ParticleSystem } from './ParticleSystem';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear(bgColor: string) {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPlatforms(platforms: Platform[]) {
    for (const p of platforms) {
      this.ctx.fillStyle = '#4a4a6a';
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.fillStyle = '#6a6a9a';
      this.ctx.fillRect(p.x, p.y, p.w, 4);
    }
  }

  drawStickman(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    facing: number,
    isAttacking: boolean,
    flash: boolean
  ) {
    const ctx = this.ctx;
    const cx = x + w / 2;
    const headR = w * 0.28;
    const headY = y + headR;
    const bodyTop = headY + headR;
    const bodyBot = y + h * 0.6;
    const legY = y + h;

    ctx.strokeStyle = flash ? '#ffffff' : color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    // head
    ctx.beginPath();
    ctx.arc(cx, headY, headR, 0, Math.PI * 2);
    ctx.stroke();

    // body
    ctx.beginPath();
    ctx.moveTo(cx, bodyTop);
    ctx.lineTo(cx, bodyBot);
    ctx.stroke();

    // legs
    ctx.beginPath();
    ctx.moveTo(cx, bodyBot);
    ctx.lineTo(cx - w * 0.3, legY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, bodyBot);
    ctx.lineTo(cx + w * 0.3, legY);
    ctx.stroke();

    // arms
    const armY = bodyTop + (bodyBot - bodyTop) * 0.3;
    if (isAttacking) {
      const atkX = cx + facing * w * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx, armY);
      ctx.lineTo(atkX, armY - h * 0.05);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, armY);
      ctx.lineTo(cx - facing * w * 0.35, armY + h * 0.1);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, armY);
      ctx.lineTo(cx + facing * w * 0.4, armY + h * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, armY);
      ctx.lineTo(cx - facing * w * 0.4, armY + h * 0.15);
      ctx.stroke();
    }
  }

  drawPlayer(player: Player) {
    this.drawStickman(
      player.x,
      player.y,
      player.w,
      player.h,
      '#4fc3f7',
      player.facing,
      player.isAttacking,
      player.flashTimer > 0
    );
  }

  drawEnemy(enemy: Enemy) {
    const color = enemy.type === 'tank' ? '#e57373' : enemy.type === 'fast' ? '#ffb300' : '#ef9a9a';
    this.drawStickman(
      enemy.x,
      enemy.y,
      enemy.w,
      enemy.h,
      color,
      enemy.facing,
      false,
      enemy.flashTimer > 0
    );
    // health bar
    const bw = enemy.w;
    const bh = 4;
    const bx = enemy.x;
    const by = enemy.y - 10;
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(bx, by, bw, bh);
    this.ctx.fillStyle = '#e53935';
    this.ctx.fillRect(bx, by, bw * (enemy.health / enemy.maxHealth), bh);
  }

  drawBoss(boss: Boss) {
    const ctx = this.ctx;
    const flash = boss.flashTimer > 0;
    const color = flash ? '#ffffff' : (boss.phase === 2 ? '#ff1744' : '#ce93d8');
    this.drawStickman(
      boss.x,
      boss.y,
      boss.w,
      boss.h,
      color,
      boss.facing,
      boss.isAttacking,
      flash
    );
    // crown
    const cx = boss.x + boss.w / 2;
    const headR = boss.w * 0.28;
    const headY = boss.y + headR;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - headR, headY - headR);
    ctx.lineTo(cx - headR * 0.5, headY - headR * 1.5);
    ctx.lineTo(cx, headY - headR);
    ctx.lineTo(cx + headR * 0.5, headY - headR * 1.5);
    ctx.lineTo(cx + headR, headY - headR);
    ctx.stroke();
    // health bar
    const bw = boss.w;
    const bh = 8;
    const bx = boss.x;
    const by = boss.y - 16;
    ctx.fillStyle = '#333';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#d500f9';
    ctx.fillRect(bx, by, bw * (boss.health / boss.maxHealth), bh);
    // boss name
    ctx.fillStyle = '#ce93d8';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('EVIL KING', boss.x + boss.w / 2, boss.y - 22);
    ctx.textAlign = 'left';
  }

  drawCollectibles(collectibles: Collectible[]) {
    const ctx = this.ctx;
    for (const c of collectibles) {
      if (c.type === 'coin') {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffaa00';
        ctx.font = '8px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('$', c.x + c.w / 2, c.y + c.h / 2 + 3);
        ctx.textAlign = 'left';
      } else {
        ctx.fillStyle = c.type === 'potion_speed' ? '#29b6f6' : c.type === 'potion_damage' ? '#ef5350' : '#66bb6a';
        ctx.beginPath();
        ctx.arc(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('+', c.x + c.w / 2, c.y + c.h / 2 + 3);
        ctx.textAlign = 'left';
      }
    }
  }

  drawProjectiles(projectiles: { x: number; y: number; w: number; h: number; color: string }[]) {
    const ctx = this.ctx;
    for (const p of projectiles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHUD(health: number, maxHealth: number, coins: number, levelName: string) {
    const ctx = this.ctx;
    // health bar bg
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 204, 22);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(12, 12, 200, 18);
    ctx.fillStyle = '#e53935';
    ctx.fillRect(12, 12, Math.max(0, 200 * (health / maxHealth)), 18);
    ctx.fillStyle = '#fff';
    ctx.font = '11px Courier New';
    ctx.fillText(`HP ${health}/${maxHealth}`, 16, 25);

    // coins
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 38, 120, 20);
    ctx.fillStyle = '#ffd700';
    ctx.font = '13px Courier New';
    ctx.fillText(`💰 ${coins}`, 16, 53);

    // level name
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(this.width / 2 - 80, 10, 160, 22);
    ctx.fillStyle = '#b0bec5';
    ctx.font = '13px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(levelName, this.width / 2, 26);
    ctx.textAlign = 'left';

    // controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px Courier New';
    ctx.fillText('WASD/Arrows: Move  Z/J/Enter: Punch', 10, this.height - 10);
  }

  drawParticles(ps: ParticleSystem) {
    ps.draw(this.ctx);
  }
}
