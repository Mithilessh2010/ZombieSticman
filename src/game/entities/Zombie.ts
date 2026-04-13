import { Entity } from './Entity';

export type ZombieType = 'BASIC' | 'RUNNER' | 'TANK' | 'EXPLODER' | 'BOSS';

export interface ZombieConfig {
  type: ZombieType;
  health: number;
  speed: number;
  damage: number;
  color: string;
  width: number;
  height: number;
  xpValue: number;
  coinValue: number;
}

const ZOMBIE_TYPES: Record<ZombieType, ZombieConfig> = {
  BASIC: {
    type: 'BASIC',
    health: 20,
    speed: 1.5,
    damage: 10,
    color: '#4ade80',
    width: 30,
    height: 50,
    xpValue: 10,
    coinValue: 5,
  },
  RUNNER: {
    type: 'RUNNER',
    health: 15,
    speed: 3,
    damage: 5,
    color: '#facc15',
    width: 25,
    height: 45,
    xpValue: 15,
    coinValue: 8,
  },
  TANK: {
    type: 'TANK',
    health: 80,
    speed: 0.8,
    damage: 20,
    color: '#ef4444',
    width: 45,
    height: 65,
    xpValue: 40,
    coinValue: 20,
  },
  EXPLODER: {
    type: 'EXPLODER',
    health: 30,
    speed: 2,
    damage: 40,
    color: '#f97316',
    width: 35,
    height: 35,
    xpValue: 25,
    coinValue: 12,
  },
  BOSS: {
    type: 'BOSS',
    health: 1000,
    speed: 1,
    damage: 30,
    color: '#7c3aed',
    width: 80,
    height: 120,
    xpValue: 500,
    coinValue: 200,
  },
};

export class Zombie extends Entity {
  config: ZombieConfig;
  health: number;
  maxHealth: number;
  facing: number = 1;
  bob: number = 0;

  constructor(x: number, y: number, type: ZombieType, waveMultiplier: number) {
    const config = { ...ZOMBIE_TYPES[type] };
    // Scale stats with wave - starts easy, gets harder faster
    config.health *= (1 + waveMultiplier * 0.4);
    config.speed *= (1 + waveMultiplier * 0.08);
    config.damage *= (1 + waveMultiplier * 0.15);

    super(x, y, config.width, config.height);
    this.config = config;
    this.health = config.health;
    this.maxHealth = config.health;
  }

  update(dt: number, playerX: number) {
    const dir = playerX > this.x ? 1 : -1;
    this.vx = dir * this.config.speed;
    this.facing = dir;
    this.bob += 0.1 * dt;
    super.update(dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawY = this.y + Math.sin(this.bob) * 3;

    ctx.save();
    ctx.translate(this.x + this.width / 2, drawY + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

    // Zombie Body
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(0, -this.height / 2 + 8, 8, 0, Math.PI * 2);
    
    // Body
    ctx.moveTo(0, -this.height / 2 + 16);
    ctx.lineTo(0, this.height / 2 - 10);
    
    // Arms (Reaching out)
    ctx.moveTo(0, -this.height / 2 + 20);
    ctx.lineTo(15, -this.height / 2 + 15);
    
    // Legs
    const legAngle = Math.sin(this.bob) * 0.5;
    ctx.moveTo(0, this.height / 2 - 10);
    ctx.lineTo(-5 - legAngle * 5, this.height / 2);
    
    ctx.stroke();
    ctx.restore();

    // Health Bar
    if (this.health < this.maxHealth) {
      ctx.fillStyle = '#374151';
      ctx.fillRect(this.x, this.y - 10, this.width, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 4);
    }
  }

  takeDamage(amount: number) {
    this.health -= amount;
    return this.health <= 0;
  }
}
