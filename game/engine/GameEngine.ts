import { Renderer } from '@/game/engine/Renderer';
import { InputHandler } from '@/game/engine/InputHandler';
import { ParticleSystem } from '@/game/engine/ParticleSystem';
import { Player } from '@/game/entities/Player';
import { Enemy } from '@/game/entities/Enemy';
import { Boss } from '@/game/entities/Boss';
import { Collectible, randomCollectibleType } from '@/game/entities/Collectible';
import { buildPlatforms, Platform } from '@/game/entities/Platform';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { LEVELS, STORY_BEATS, PlayerStats } from '@/game/data/gameData';

export type GameEventType =
  | 'level_clear'
  | 'boss_defeated'
  | 'player_dead'
  | 'coin_collected'
  | 'enemy_killed';

export type GameEventCallback = (type: GameEventType, data?: unknown) => void;

export class GameEngine {
  private renderer: Renderer;
  private input: InputHandler;
  private particles: ParticleSystem;
  private platforms: Platform[];
  private player: Player;
  private enemies: Enemy[] = [];
  private boss: Boss | null = null;
  private collectibles: Collectible[] = [];
  private spawner: EnemySpawner;
  private rafId = 0;
  private lastTime = 0;
  private onEvent: GameEventCallback;
  private canvas: HTMLCanvasElement;
  private levelIndex: number;
  private isBossLevel: boolean;
  private bgColor: string;
  private levelName: string;
  private playerStats: PlayerStats;
  private playerHealth: number;
  private coins: number;

  constructor(
    canvas: HTMLCanvasElement,
    levelIndex: number,
    playerStats: PlayerStats,
    playerHealth: number,
    coins: number,
    onEvent: GameEventCallback
  ) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.input = new InputHandler();
    this.particles = new ParticleSystem();
    this.spawner = new EnemySpawner(canvas.width, canvas.height);
    this.onEvent = onEvent;
    this.levelIndex = levelIndex;
    this.playerStats = playerStats;
    this.playerHealth = playerHealth;
    this.coins = coins;

    const levelCfg = LEVELS[levelIndex];
    this.isBossLevel = levelCfg.hasBoss;
    this.bgColor = levelCfg.background;
    this.levelName = levelCfg.name;

    this.platforms = buildPlatforms(canvas.width, canvas.height);
    const groundY = canvas.height - 40;
    this.player = new Player(100, groundY - 60);

    if (this.isBossLevel) {
      this.boss = new Boss(canvas.width / 2 - 28, groundY - 100, canvas.width);
    } else {
      this.enemies = this.spawner.spawnForLevel(levelCfg);
    }
  }

  start() {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
  }

  private loop = (now: number) => {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.update(dt);
    this.draw();
    this.input.flush();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.player.update(dt, this.input, this.platforms, this.playerStats);

    // clamp player to canvas
    this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.w, this.player.x));
    if (this.player.y > this.canvas.height + 100) {
      this.player.y = this.canvas.height - 40 - this.player.h;
      this.player.vy = 0;
    }

    this.particles.update(dt);

    for (const c of this.collectibles) c.update(dt);

    if (this.isBossLevel && this.boss) {
      this.updateBoss(dt);
    } else {
      this.updateEnemies(dt);
    }

    this.updateCollectibles();
  }

  private updateEnemies(dt: number) {
    const playerCx = this.player.x + this.player.w / 2;
    const playerCy = this.player.y + this.player.h / 2;

    for (const e of this.enemies) {
      if (e.isDead) continue;
      e.update(dt, playerCx, playerCy, this.platforms);

      // enemy attacks player on contact
      if (e.overlaps(this.player) && e.attackCooldown <= 0) {
        const dmg = this.player.takeDamage(e.damage);
        if (dmg > 0) {
          this.playerHealth -= dmg;
          e.attackCooldown = 1.0;
          this.particles.emit(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, '#ff5252', 6, 80);
          if (this.playerHealth <= 0) {
            this.onEvent('player_dead');
            return;
          }
        }
      }

      // player punch hits enemy
      if (this.player.isAttacking) {
        const hb = this.player.getHitbox();
        if (
          e.x < hb.x + hb.w &&
          e.x + e.w > hb.x &&
          e.y < hb.y + hb.h &&
          e.y + e.h > hb.y
        ) {
          const dmg = this.playerStats.damage * (this.player.damageBoostTimer > 0 ? 1.5 : 1);
          const killed = e.takeDamage(dmg);
          this.particles.emit(e.x + e.w / 2, e.y + e.h / 2, '#ffcc02', 8, 120);
          if (killed) {
            this.onEvent('enemy_killed');
            this.dropCollectibles(e.x, e.y);
          }
        }
      }
    }

    const alive = this.enemies.filter((e) => !e.isDead);
    if (alive.length === 0 && this.enemies.length > 0) {
      setTimeout(() => this.onEvent('level_clear'), 400);
      this.enemies = [];
    }
  }

  private updateBoss(dt: number) {
    const boss = this.boss!;
    boss.update(dt, this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, this.platforms);

    // boss melee
    if (boss.overlaps(this.player) && boss.isAttacking) {
      const dmg = this.player.takeDamage(boss.damage);
      if (dmg > 0) {
        this.playerHealth -= dmg;
        this.particles.emit(this.player.x + this.player.w / 2, this.player.y, '#ff1744', 8, 100);
        if (this.playerHealth <= 0) {
          this.onEvent('player_dead');
          return;
        }
      }
    }

    // boss projectiles
    for (let i = boss.projectiles.length - 1; i >= 0; i--) {
      const p = boss.projectiles[i];
      if (
        p.x < this.player.x + this.player.w &&
        p.x + p.w > this.player.x &&
        p.y < this.player.y + this.player.h &&
        p.y + p.h > this.player.y
      ) {
        const dmg = this.player.takeDamage(p.damage);
        if (dmg > 0) {
          this.playerHealth -= dmg;
          this.particles.emit(p.x, p.y, p.color, 6, 80);
          boss.projectiles.splice(i, 1);
          if (this.playerHealth <= 0) {
            this.onEvent('player_dead');
            return;
          }
        }
      }
    }

    // player punches boss
    if (this.player.isAttacking) {
      const hb = this.player.getHitbox();
      if (boss.overlaps(hb)) {
        const dmg = this.playerStats.damage * (this.player.damageBoostTimer > 0 ? 1.5 : 1);
        const killed = boss.takeDamage(dmg);
        this.particles.emit(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ce93d8', 10, 140);
        if (killed) {
          this.particles.emit(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffd700', 30, 200);
          setTimeout(() => this.onEvent('boss_defeated'), 800);
          this.boss = null;
        }
      }
    }
  }

  private dropCollectibles(x: number, y: number) {
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const type = randomCollectibleType();
      this.collectibles.push(new Collectible(x + Math.random() * 30 - 15, y, type));
    }
  }

  private updateCollectibles() {
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      if (c.collected) { this.collectibles.splice(i, 1); continue; }
      if (c.overlaps(this.player)) {
        c.collected = true;
        this.applyCollectible(c.type, c.x, c.y);
      }
    }
  }

  private applyCollectible(type: string, x: number, y: number) {
    if (type === 'coin') {
      this.coins += Math.floor(5 * this.playerStats.coinMultiplier);
      this.onEvent('coin_collected', Math.floor(5 * this.playerStats.coinMultiplier));
      this.particles.emit(x, y, '#ffd700', 5, 80);
    } else if (type === 'potion_heal') {
      const heal = Math.floor(20 * this.playerStats.potionHealMult);
      this.playerHealth = Math.min(this.playerStats.maxHealth, this.playerHealth + heal);
      this.particles.emit(x, y, '#66bb6a', 8, 80);
    } else if (type === 'potion_speed') {
      this.player.speedBoostTimer = 6;
      this.particles.emit(x, y, '#29b6f6', 8, 80);
    } else if (type === 'potion_damage') {
      this.player.damageBoostTimer = 6;
      this.particles.emit(x, y, '#ef5350', 8, 80);
    }
  }

  private draw() {
    this.renderer.clear(this.bgColor);
    this.renderer.drawPlatforms(this.platforms);
    this.renderer.drawCollectibles(this.collectibles);

    for (const e of this.enemies) {
      if (!e.isDead) this.renderer.drawEnemy(e);
    }

    if (this.boss) {
      this.renderer.drawBoss(this.boss);
      this.renderer.drawProjectiles(this.boss.projectiles);
    }

    this.renderer.drawPlayer(this.player);
    this.renderer.drawParticles(this.particles);
    this.renderer.drawHUD(
      Math.max(0, Math.round(this.playerHealth)),
      this.playerStats.maxHealth,
      this.coins,
      this.levelName
    );
  }

  getCurrentHealth() { return this.playerHealth; }
  getCurrentCoins() { return this.coins; }
}
