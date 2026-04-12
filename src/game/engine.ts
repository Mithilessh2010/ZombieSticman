// src/game/engine.ts
import { PlayerStats, GameStats } from '@/types';
import { Player, BulletSpawn, PlayerInput } from './player';
import { Enemy } from './enemy';
import { Bullet } from './bullet';
import { XPOrb } from './xporb';
import { ParticleSystem } from './particle';
import { WaveDirector } from './waves';
import { Background, MapType } from './background';
import { rollUpgrades, getDefaultStats } from './upgrades';
import { WEAPONS, WEAPON_DROP_ORDER } from './weapons';
import { useGameStore } from '@/store/gameStore';

export const WORLD_W = 3200;
export const WORLD_H = 3200;

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;
  private lastTime = 0;
  private running = false;

  // Camera
  camX = 0;
  camY = 0;
  shakeX = 0;
  shakeY = 0;
  shakeDuration = 0;
  shakeMagnitude = 0;

  // Game objects
  player!: Player;
  enemies: Enemy[] = [];
  bullets: Bullet[] = [];
  enemyBullets: Bullet[] = [];
  xpOrbs: XPOrb[] = [];
  particles = new ParticleSystem();
  waveDirector!: WaveDirector;
  background!: Background;

  // Input state
  input: PlayerInput = {
    up: false, down: false, left: false, right: false,
    dash: false, mouseX: 0, mouseY: 0, shoot: false, reload: false,
    weapon1: false, weapon2: false, weapon3: false, weapon4: false, weapon5: false,
  };

  // Stats tracking
  stats: GameStats = {
    kills: 0, damageDealt: 0, shotsFired: 0, shotsHit: 0,
    wavesReached: 1, timeAlive: 0, xpGained: 0, coinsEarned: 0,
    highestWave: 0, totalKills: 0, totalRuns: 0,
  };

  coins = 0;

  // Timing
  waveStartDelay = 0;
  betweenWave = false;
  betweenWaveTimer = 0;
  mapType: MapType = 'city';

  // Upgrades
  appliedUpgradesMap = new Map<string, number>();
  pendingLevelUp = false;

  // Weapon drops
  weaponDropIdx = 1;

  private boundKeyDown = this.onKeyDown.bind(this);
  private boundKeyUp = this.onKeyUp.bind(this);
  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseDown = this.onMouseDown.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);
  private boundContextMenu = (e: Event) => e.preventDefault();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  start(mapType: MapType = 'city') {
    this.mapType = mapType;
    this.setupGame();
    this.addInputListeners();
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  private setupGame() {
    const store = useGameStore.getState();
    const baseStats = getDefaultStats();

    // Apply unlocked skill nodes
    let stats = { ...baseStats };
    for (const node of store.skillNodes) {
      if (node.unlocked) {
        for (const [key, val] of Object.entries(node.effect)) {
          const k = key as keyof PlayerStats;
          (stats as Record<string, number>)[k] = ((stats as Record<string, number>)[k] || 0) + (val as number);
        }
      }
    }

    this.particles = new ParticleSystem();
    this.player = new Player(WORLD_W / 2, WORLD_H / 2, stats, this.particles);
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.xpOrbs = [];
    this.stats = { kills: 0, damageDealt: 0, shotsFired: 0, shotsHit: 0, wavesReached: 1, timeAlive: 0, xpGained: 0, coinsEarned: 0, highestWave: 0, totalKills: 0, totalRuns: 0 };
    this.coins = 0;
    this.appliedUpgradesMap = new Map();
    this.weaponDropIdx = 1;
    this.waveDirector = new WaveDirector(WORLD_W, WORLD_H);
    this.background = new Background(this.mapType, WORLD_W, WORLD_H);

    this.betweenWave = true;
    this.betweenWaveTimer = 2000;

    // Camera start
    this.camX = this.player.x - this.canvas.width / 2;
    this.camY = this.player.y - this.canvas.height / 2;
  }

  private loop(now: number) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const store = useGameStore.getState();
    if (store.screen === 'paused') {
      this.rafId = requestAnimationFrame(this.loop.bind(this));
      return;
    }
    if (store.screen === 'upgrade') {
      this.rafId = requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.update(dt);
    this.draw();
    this.syncStore(store);

    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  private update(dt: number) {
    this.stats.timeAlive += dt;
    this.background.update(dt);
    this.particles.update(dt);

    // Wave logic
    if (this.betweenWave) {
      this.betweenWaveTimer -= dt * 1000;
      if (this.betweenWaveTimer <= 0) {
        this.betweenWave = false;
        this.waveDirector.startWave(this.player.x, this.player.y);
        this.stats.wavesReached = this.waveDirector.wave;
      }
      return;
    }

    // Spawn enemies
    const spawns = this.waveDirector.update(dt);
    for (const s of spawns) {
      this.enemies.push(new Enemy(s, this.particles));
    }

    // Wave complete check
    if (this.waveDirector.waveComplete) {
      this.waveDirector.nextWave();
      this.betweenWave = true;
      this.betweenWaveTimer = 3500;
      // Maybe drop a weapon
      if (this.waveDirector.wave % 4 === 0 && this.weaponDropIdx < WEAPON_DROP_ORDER.length) {
        const newWeapon = WEAPON_DROP_ORDER[this.weaponDropIdx++];
        if (!this.player.inventory.includes(newWeapon)) {
          this.player.inventory.push(newWeapon);
        }
      }
      this.triggerScreenShake(4, 200);
      return;
    }

    // Player input
    const worldMouseX = this.input.mouseX + this.camX;
    const worldMouseY = this.input.mouseY + this.camY;

    // Weapon switching
    if (this.input.weapon1) this.player.switchWeapon(0);
    if (this.input.weapon2) this.player.switchWeapon(1);
    if (this.input.weapon3) this.player.switchWeapon(2);
    if (this.input.weapon4) this.player.switchWeapon(3);
    if (this.input.weapon5) this.player.switchWeapon(4);

    if (this.input.reload) this.player.startReload();

    this.player.update(dt, this.input, WORLD_W, WORLD_H);

    // Shooting
    if (this.input.shoot) {
      const spawned = this.player.tryShoot(worldMouseX, worldMouseY);
      if (spawned) {
        for (const b of spawned) {
          this.bullets.push(new Bullet(b));
          this.stats.shotsFired++;
        }
      }
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(dt);
      if (!b.alive) { this.bullets.splice(i, 1); continue; }

      // Bullet vs enemy
      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (!e.alive) continue;
        const dx = b.x - e.x, dy = b.y - e.y;
        const hitRadius = e.size + b.size;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          const xpGained = e.takeDamage(b.damage);
          this.stats.damageDealt += b.damage;
          this.stats.shotsHit++;
          this.particles.damageNumber(e.x, e.y - e.size, b.damage, b.isCrit);
          this.triggerScreenShake(b.isCrit ? 4 : 2, 80);

          // Lifesteal
          if (this.player.stats.lifeSteal > 0) {
            this.player.healQueue += b.damage * (this.player.stats.lifeSteal / 100);
          }

          if (!e.alive) {
            this.onEnemyKilled(e, xpGained);
          }

          if (b.piercing <= b.piercedCount) {
            b.alive = false;
            hit = true;
            break;
          } else {
            b.piercedCount++;
          }
        }
      }
      if (hit) { this.bullets.splice(i, 1); }
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.alive) { this.enemies.splice(i, 1); continue; }

      const newBullet = e.update(dt, this.player.x, this.player.y);
      if (newBullet) this.enemyBullets.push(newBullet);

      // AOE
      if (e.pendingAOE) {
        const aoe = e.pendingAOE;
        const dx = this.player.x - aoe.x, dy = this.player.y - aoe.y;
        if (dx * dx + dy * dy < aoe.radius * aoe.radius) {
          const dead = this.player.takeDamage(aoe.dmg);
          if (dead) this.onPlayerDead();
        }
        e.pendingAOE = null;
      }

      // Splitter spawn
      if (!e.alive && e.type === 'splitter' && !e.hasSplit) {
        e.hasSplit = true;
        for (let k = 0; k < 2; k++) {
          const offset = k === 0 ? 1 : -1;
          this.enemies.push(new Enemy(
            { type: 'walker', x: e.x + offset * 20, y: e.y },
            this.particles
          ));
          this.waveDirector.enemiesAlive++;
        }
      }

      // Enemy vs player collision
      if (!this.player.invincible) {
        const dx = this.player.x - e.x, dy = this.player.y - e.y;
        const hitRadius = e.size + 18;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          const dead = this.player.takeDamage(e.damage * dt * 2);
          if (dead) { this.onPlayerDead(); return; }
        }
      }
    }

    // Enemy bullets vs player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.update(dt);
      if (!b.alive) { this.enemyBullets.splice(i, 1); continue; }
      const dx = this.player.x - b.x, dy = this.player.y - b.y;
      if (dx * dx + dy * dy < (18 + b.size) * (18 + b.size)) {
        const dead = this.player.takeDamage(b.damage);
        if (dead) { this.onPlayerDead(); return; }
        b.alive = false;
        this.enemyBullets.splice(i, 1);
      }
    }

    // XP orbs
    for (let i = this.xpOrbs.length - 1; i >= 0; i--) {
      const orb = this.xpOrbs[i];
      orb.update(dt, this.player.x, this.player.y, this.player.stats.magnetRadius);
      if (!orb.alive) {
        const leveled = this.player.addXP(orb.value);
        this.stats.xpGained += orb.value;
        this.xpOrbs.splice(i, 1);
        if (leveled && !this.pendingLevelUp) {
          this.pendingLevelUp = true;
          this.scheduleLevelUp();
        }
      }
    }

    // Camera
    this.updateCamera(dt);

    // Screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt * 1000;
      const str = (this.shakeDuration / 200) * this.shakeMagnitude;
      this.shakeX = (Math.random() - 0.5) * str * 2;
      this.shakeY = (Math.random() - 0.5) * str * 2;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  private onEnemyKilled(e: Enemy, xpGained: number) {
    this.stats.kills++;
    this.player.killStreak++;
    this.player.killStreakTimer = 4000;
    this.waveDirector.onEnemyKilled();

    const xpCount = e.isBoss ? 10 : Math.min(5, Math.ceil(e.xpValue / 5));
    for (let i = 0; i < xpCount; i++) {
      this.xpOrbs.push(new XPOrb(e.x, e.y, Math.round(e.xpValue / xpCount)));
    }

    const coinDrop = Math.round(e.coinValue * (this.player.stats.goldMultiplier / 100));
    this.coins += coinDrop;
    this.stats.coinsEarned += coinDrop;

    if (e.isBoss) {
      this.triggerScreenShake(15, 600);
    }
  }

  private scheduleLevelUp() {
    setTimeout(() => {
      if (!this.running) return;
      const store = useGameStore.getState();
      const upgrades = rollUpgrades(this.appliedUpgradesMap, this.player.stats.luck);
      store.setUpgradeChoices(upgrades.map(u => u.id));
      store.setOnUpgradeChosen((id: string) => {
        const { ALL_UPGRADES } = require('./upgrades');
        const upgrade = ALL_UPGRADES.find((u: { id: string }) => u.id === id);
        if (upgrade) {
          this.player.stats = upgrade.apply(this.player.stats);
          this.player.stats.maxHealth = Math.max(this.player.stats.maxHealth, 1);
          const cur = this.appliedUpgradesMap.get(id) || 0;
          this.appliedUpgradesMap.set(id, cur + 1);
        }
        this.pendingLevelUp = false;
      });
      store.setScreen('upgrade');
    }, 300);
  }

  private onPlayerDead() {
    this.running = false;
    this.stats.highestWave = this.waveDirector.wave;

    const store = useGameStore.getState();
    store.setRunStats({ ...this.stats });
    store.setCoins(this.coins);
    const newTotal = store.totalCoins + this.coins;
    store.setTotalCoins(newTotal);
    store.updateBestStats(this.stats);
    store.setScreen('dead');
    this.cleanup();
  }

  private updateCamera(dt: number) {
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;
    this.camX += (targetX - this.camX) * Math.min(1, 8 * dt);
    this.camY += (targetY - this.camY) * Math.min(1, 8 * dt);

    // Clamp camera to world bounds
    this.camX = Math.max(0, Math.min(WORLD_W - this.canvas.width, this.camX));
    this.camY = Math.max(0, Math.min(WORLD_H - this.canvas.height, this.camY));
  }

  private draw() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cx = this.camX + this.shakeX;
    const cy = this.camY + this.shakeY;

    ctx.clearRect(0, 0, W, H);

    // Background
    this.background.draw(ctx, cx, cy, W, H);

    // XP orbs (below entities)
    for (const orb of this.xpOrbs) orb.draw(ctx, cx, cy);

    // Enemy bullets
    for (const b of this.enemyBullets) {
      ctx.save();
      ctx.shadowColor = '#86efac'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#86efac';
      const sx = b.x - cx, sy = b.y - cy;
      ctx.beginPath(); ctx.arc(sx, sy, b.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Player bullets
    for (const b of this.bullets) b.draw(ctx, cx, cy);

    // Enemies
    for (const e of this.enemies) e.draw(ctx, cx, cy);

    // Player
    const px = this.player.x - cx;
    const py = this.player.y - cy;
    this.player.draw(ctx, px, py);

    // Particles (on top)
    this.particles.draw(ctx, cx, cy);

    // Between-wave overlay
    if (this.betweenWave) {
      const alpha = Math.min(0.7, this.betweenWaveTimer / 1000) * 0.4;
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private syncStore(store: ReturnType<typeof useGameStore.getState>) {
    store.setPlayerHealth(Math.round(this.player.health), this.player.stats.maxHealth);
    store.setPlayerXP(this.player.xp, this.player.xpToNext, this.player.level);
    const reloadPct = this.player.reloading ? 1 - this.player.reloadTimer / WEAPONS[this.player.weaponType].reloadTime : 0;
    store.setAmmo(this.player.ammo, WEAPONS[this.player.weaponType].magazineSize, this.player.reloading, reloadPct);
    store.setCurrentWeapon(WEAPONS[this.player.weaponType].name);
    store.setKills(this.stats.kills);
    store.setCoins(this.coins);
    store.setWave(this.waveDirector.wave);
    const dashPct = this.player.dashCooldownTimer / this.player.stats.dashCooldown;
    store.setDashCooldown(dashPct);

    // Boss HP
    const boss = this.enemies.find(e => e.isBoss);
    if (boss) store.setBossHP(boss.health, boss.maxHealth);
    else store.setBossHP(null, null);
  }

  triggerScreenShake(magnitude: number, duration: number) {
    const store = useGameStore.getState();
    if (!store.screenShake) return;
    if (magnitude > this.shakeMagnitude) {
      this.shakeMagnitude = magnitude;
      this.shakeDuration = duration;
    }
  }

  pause() {
    useGameStore.getState().setScreen('paused');
  }

  resume() {
    useGameStore.getState().setScreen('playing');
    this.lastTime = performance.now();
  }

  cleanup() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.removeInputListeners();
  }

  private addInputListeners() {
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
    this.canvas.addEventListener('mouseup', this.boundMouseUp);
    this.canvas.addEventListener('contextmenu', this.boundContextMenu);
  }

  private removeInputListeners() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('mouseup', this.boundMouseUp);
    this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
  }

  private onKeyDown(e: KeyboardEvent) {
    const store = useGameStore.getState();
    if (e.code === 'Escape') {
      if (store.screen === 'playing') this.pause();
      else if (store.screen === 'paused') this.resume();
      return;
    }
    if (store.screen !== 'playing') return;

    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    this.input.up = true;    break;
      case 'KeyS': case 'ArrowDown':  this.input.down = true;  break;
      case 'KeyA': case 'ArrowLeft':  this.input.left = true;  break;
      case 'KeyD': case 'ArrowRight': this.input.right = true; break;
      case 'ShiftLeft': case 'ShiftRight': this.input.dash = true; break;
      case 'KeyR':     this.input.reload = true; break;
      case 'Digit1':   this.input.weapon1 = true; break;
      case 'Digit2':   this.input.weapon2 = true; break;
      case 'Digit3':   this.input.weapon3 = true; break;
      case 'Digit4':   this.input.weapon4 = true; break;
      case 'Digit5':   this.input.weapon5 = true; break;
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    this.input.up = false;    break;
      case 'KeyS': case 'ArrowDown':  this.input.down = false;  break;
      case 'KeyA': case 'ArrowLeft':  this.input.left = false;  break;
      case 'KeyD': case 'ArrowRight': this.input.right = false; break;
      case 'ShiftLeft': case 'ShiftRight': this.input.dash = false; break;
      case 'KeyR':     this.input.reload = false; break;
      case 'Digit1':   this.input.weapon1 = false; break;
      case 'Digit2':   this.input.weapon2 = false; break;
      case 'Digit3':   this.input.weapon3 = false; break;
      case 'Digit4':   this.input.weapon4 = false; break;
      case 'Digit5':   this.input.weapon5 = false; break;
    }
  }

  private onMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.input.mouseX = e.clientX - rect.left;
    this.input.mouseY = e.clientY - rect.top;
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) this.input.shoot = true;
  }

  private onMouseUp(e: MouseEvent) {
    if (e.button === 0) this.input.shoot = false;
  }
}
