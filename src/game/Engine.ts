import { Player } from './entities/Player';
import { Zombie, ZombieType } from './entities/Zombie';
import { Bullet } from './entities/Bullet';
import { Particle, FloatingText } from './entities/Particles';
import { InputManager } from './systems/InputManager';
import { audioManager } from './systems/AudioManager';
import { Platform } from './entities/Platform';
import { useGameStore } from '../store/useGameStore';

export class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  zombies: Zombie[] = [];
  bullets: Bullet[] = [];
  platforms: Platform[] = [];
  particles: (Particle | FloatingText)[] = [];
  input: InputManager;
  
  groundY: number;
  lastTime: number = 0;
  shake: number = 0;
  
  spawnTimer: number = 0;
  zombiesToSpawn: number = 0;
  private lastWaveProcessed: number = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input = new InputManager();
    this.groundY = canvas.height - 50;

    const state = useGameStore.getState();
    const weapon = state.weapons.find(w => w.id === state.equippedWeaponId)!;
    
    this.player = new Player(
      canvas.width / 2,
      this.groundY - 50,
      state.stats,
      weapon,
      this.groundY
    );

    this.initPlatforms();
    this.startWave(state.currentWave);
  }

  private initPlatforms() {
    this.platforms = [
      new Platform(200, this.groundY - 80, 200, 15),
      new Platform(this.canvas.width - 400, this.groundY - 80, 200, 15),
      new Platform(this.canvas.width / 2 - 100, this.groundY - 160, 200, 15),
    ];
  }

  startWave(wave: number) {
    this.zombiesToSpawn = 10 + (wave - 1) * 5;
    useGameStore.getState().setZombiesRemaining(this.zombiesToSpawn);
    this.spawnTimer = 0;
  }

  update(time: number) {
    const dt = (time - this.lastTime) / 16.67; // Normalize to 60fps
    this.lastTime = time;

    const state = useGameStore.getState();

    // Sync Wave State
    if (state.gameState === 'PLAYING' && this.lastWaveProcessed !== state.currentWave) {
      this.startWave(state.currentWave);
      this.lastWaveProcessed = state.currentWave;
    }

    // Handle Game Over - Clear Zombies
    if (state.gameState === 'GAMEOVER') {
      if (this.zombies.length > 0 || this.bullets.length > 0 || this.zombiesToSpawn > 0) {
        this.zombies = [];
        this.bullets = [];
        this.zombiesToSpawn = 0;
        this.lastWaveProcessed = -1; // Reset so restart from Wave 1 works
      }
    }

    if (state.gameState !== 'PLAYING') {
      // Allow toggling inventory back to previous state
      if (state.gameState === 'INVENTORY') {
        if (this.input.keys.has(state.controls.inventory)) {
          if (!this.input.keys.has('PREV_INV')) {
            state.setGameState(state.previousGameState);
            this.input.keys.add('PREV_INV');
          }
        } else {
          this.input.keys.delete('PREV_INV');
        }
      }
      return;
    }

    // Update player stats reference (in case of upgrades/heals)
    this.player.stats = state.stats;

    // Shake decay
    this.shake *= 0.9;

    // Player
    this.player.update(dt, this.input.keys, this.canvas.width, this.platforms, state.controls);

    // Toggle Inventory
    if (this.input.keys.has(state.controls.inventory)) {
      if (!this.input.keys.has('PREV_INV')) {
        state.setGameState('INVENTORY');
        this.input.keys.add('PREV_INV');
      }
    } else {
      this.input.keys.delete('PREV_INV');
    }

    // Manual Attack
    if (this.input.isMouseDown && this.player.canShoot()) {
      const nearest = this.getNearestZombie();
      if (this.player.weapon.id === 'fists') {
        // For fists, we just punch even if no zombie is near (for animation)
        this.melee(nearest);
      } else if (nearest) {
        // For guns, we need a target
        this.shoot(nearest);
      }
    }

    // Spawning
    this.spawnTimer += dt;
    if (this.zombiesToSpawn > 0 && this.spawnTimer > 60) {
      this.spawnZombie();
      this.spawnTimer = 0;
    }

    // Entities
    this.zombies.forEach(z => z.update(dt, this.player.x));
    this.bullets.forEach(b => b.update(dt));
    this.particles.forEach(p => p.update(dt));

    // Collisions
    this.checkCollisions();

    // Cleanup
    this.zombies = this.zombies.filter(z => !z.markedForDeletion);
    this.bullets = this.bullets.filter(b => !b.markedForDeletion && b.x > 0 && b.x < this.canvas.width);
    this.particles = this.particles.filter(p => !p.markedForDeletion);

    // Wave Complete - Only if we are actually playing and have processed the current wave
    if (state.gameState === 'PLAYING' && 
        this.lastWaveProcessed === state.currentWave &&
        this.zombiesToSpawn === 0 && 
        this.zombies.length === 0) {
      useGameStore.getState().setGameState('SHOP');
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    if (this.shake > 0.5) {
      this.ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }

    // Background
    this.drawBackground();

    // Ground
    this.ctx.fillStyle = '#1f2937';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, 50);

    // Platforms
    this.platforms.forEach(p => p.draw(this.ctx));

    // Entities
    this.particles.forEach(p => p.draw(this.ctx));
    this.bullets.forEach(b => b.draw(this.ctx));
    this.zombies.forEach(z => z.draw(this.ctx));
    this.player.draw(this.ctx);

    this.ctx.restore();
  }

  private drawBackground() {
    // Simple parallax-ish background
    this.ctx.fillStyle = '#111827';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Stars/Glow
    this.ctx.fillStyle = '#1e293b';
    for(let i=0; i<20; i++) {
        const x = (i * 137) % this.canvas.width;
        const y = (i * 251) % (this.groundY - 100);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
  }

  private spawnZombie() {
    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side === 1 ? -50 : this.canvas.width + 50;
    const wave = useGameStore.getState().currentWave;
    
    let type: ZombieType = 'BASIC';
    const rand = Math.random();
    if (wave >= 5 && wave % 5 === 0 && this.zombiesToSpawn === 1) {
        type = 'BOSS';
    } else if (wave > 3 && rand > 0.8) {
        type = 'RUNNER';
    } else if (wave > 5 && rand > 0.9) {
        type = 'TANK';
    } else if (wave > 7 && rand > 0.95) {
        type = 'EXPLODER';
    }

    this.zombies.push(new Zombie(x, this.groundY - 50, type, wave));
    this.zombiesToSpawn--;
  }

  private getNearestZombie() {
    let nearest = null;
    let minDist = Infinity;
    for (const z of this.zombies) {
      const dist = Math.abs(z.x - this.player.x);
      if (dist < minDist && dist < 500) {
        minDist = dist;
        nearest = z;
      }
    }
    return nearest;
  }

  private shoot(target: Zombie) {
    const dir = target.x > this.player.x ? 1 : -1;
    const weapon = this.player.weapon;
    
    // Muzzle flash
    this.createExplosion(this.player.x + (dir === 1 ? 25 : 5), this.player.y + 25, '#fbbf24', 5);
    
    if (weapon.id === 'shotgun') {
        for(let i=0; i<5; i++) {
            const vy = (Math.random() - 0.5) * 2;
            this.bullets.push(new Bullet(this.player.x + 15, this.player.y + 25, dir * weapon.bulletSpeed, vy, weapon.damage));
        }
    } else {
        this.bullets.push(new Bullet(this.player.x + 15, this.player.y + 25, dir * weapon.bulletSpeed, 0, weapon.damage));
    }

    this.player.shoot();
    audioManager.playShoot();
    this.shake = 3;
  }

  private melee(target: Zombie | null) {
    const weapon = this.player.weapon;
    
    // Fix: Check both X and Y distance to prevent hitting zombies from platforms above
    if (target && 
        Math.abs(target.x - this.player.x) < 70 && 
        Math.abs(target.y - this.player.y) < 60) {
      this.createExplosion(target.x + target.width / 2, target.y + target.height / 2, target.config.color, 5);
      this.particles.push(new FloatingText(target.x + target.width / 2, target.y, `-${weapon.damage}`, '#ef4444'));
      
      if (target.takeDamage(weapon.damage)) {
        this.killZombie(target);
      }
      audioManager.playHit();
      this.shake = 2;
    }
    
    this.player.shoot(); // Triggers animation and cooldown
  }

  private checkCollisions() {
    // Bullets vs Zombies
    for (const b of this.bullets) {
      for (const z of this.zombies) {
        if (b.collidesWith(z)) {
          b.markedForDeletion = true;
          this.createExplosion(b.x, b.y, z.config.color, 3);
          this.particles.push(new FloatingText(z.x + z.width/2, z.y, `-${b.damage}`, '#ef4444'));
          
          if (z.takeDamage(b.damage)) {
            this.killZombie(z);
          }
          audioManager.playHit();
          break;
        }
      }
    }

    // Zombies vs Player
    for (const z of this.zombies) {
      if (z.collidesWith(this.player)) {
        useGameStore.getState().damagePlayer(z.config.damage * 0.1);
        this.shake = 5;
      }
    }
  }

  private killZombie(z: Zombie) {
    z.markedForDeletion = true;
    this.createExplosion(z.x + z.width / 2, z.y + z.height / 2, z.config.color, 15);
    
    const state = useGameStore.getState();
    state.addKill();
    state.addXP(z.config.xpValue);
    state.addCoins(z.config.coinValue);
    
    this.particles.push(new FloatingText(z.x + z.width/2, z.y - 20, `+${z.config.coinValue}c`, '#facc15'));
    audioManager.playDeath();

    if (z.config.type === 'EXPLODER') {
        this.createExplosion(z.x, z.y, '#f97316', 30);
        // AOE Damage to player if close
        const dist = Math.abs(z.x - this.player.x);
        if (dist < 100) state.damagePlayer(30);
    }
  }

  private createExplosion(x: number, y: number, color: string, count: number) {
    // Performance: Limit total particles
    if (this.particles.length > 300) return;
    
    const actualCount = Math.min(count, 100 - (this.particles.length / 4));
    for (let i = 0; i < actualCount; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        color,
        Math.random() * 0.5 + 0.5
      ));
    }
  }
}
