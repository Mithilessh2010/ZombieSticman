import { Entity } from './Entity';
import { PlayerStats, Weapon, GameControls } from '../../types/game';

import { Platform } from './Platform';

export class Player extends Entity {
  stats: PlayerStats;
  weapon: Weapon;
  isJumping: boolean = false;
  groundY: number;
  facing: number = 1; // 1 for right, -1 for left
  lastShot: number = 0;
  currentMag: number;
  isReloading: boolean = false;
  reloadStartTime: number = 0;
  
  // Punch Animation
  punchProgress: number = 0;
  isPunching: boolean = false;
  
  // Visuals
  bob: number = 0;
  bobSpeed: number = 0.1;
  bobAmount: number = 2;

  constructor(x: number, y: number, stats: PlayerStats, weapon: Weapon, groundY: number) {
    super(x, y, 30, 50);
    this.stats = stats;
    this.weapon = weapon;
    this.groundY = groundY;
    this.currentMag = weapon.magazineSize;
  }

  update(dt: number, keys: Set<string>, canvasWidth: number, platforms: Platform[], controls: GameControls) {
    // Movement
    let moveX = 0;
    if (keys.has(controls.moveLeft) || keys.has('ArrowLeft')) moveX -= 1;
    if (keys.has(controls.moveRight) || keys.has('ArrowRight')) moveX += 1;

    this.vx = moveX * this.stats.speed;
    if (moveX !== 0) this.facing = moveX;

    // Jump
    if ((keys.has(controls.jump) || keys.has('ArrowUp') || keys.has('Space')) && !this.isJumping) {
      this.vy = -this.stats.jumpForce;
      this.isJumping = true;
    }

    // Gravity
    this.vy += 0.6; // Gravity constant
    
    // Vertical movement and collision
    this.y += this.vy * dt;
    
    let onGround = false;

    // Ground collision
    if (this.y + this.height > this.groundY) {
      this.y = this.groundY - this.height;
      this.vy = 0;
      onGround = true;
    }

    // Platform collision (top-down only for simplicity)
    if (this.vy >= 0) {
      for (const platform of platforms) {
        if (
          this.x + this.width > platform.x &&
          this.x < platform.x + platform.width &&
          this.y + this.height > platform.y &&
          this.y + this.height < platform.y + platform.height + this.vy * dt + 5
        ) {
          this.y = platform.y - this.height;
          this.vy = 0;
          onGround = true;
          break;
        }
      }
    }

    this.isJumping = !onGround;

    // Horizontal movement
    this.x += this.vx * dt;

    // Bounds
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }

    // Reloading
    if (this.isReloading) {
      const now = Date.now();
      if (now - this.reloadStartTime >= this.weapon.reloadTime) {
        this.isReloading = false;
        this.currentMag = this.weapon.magazineSize;
      }
    }

    // Animation
    if (moveX !== 0) {
      this.bob += this.bobSpeed * dt;
    } else {
      this.bob = 0;
    }

    // Punch Animation Update
    if (this.isPunching) {
      this.punchProgress += 0.2 * dt;
      if (this.punchProgress >= 1) {
        this.isPunching = false;
        this.punchProgress = 0;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawY = this.y + Math.sin(this.bob) * this.bobAmount;

    ctx.save();
    ctx.translate(this.x + this.width / 2, drawY + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

    // Stickman Body
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    // Head
    ctx.arc(0, -15, 8, 0, Math.PI * 2);
    
    // Body
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 10);
    
    // Arms
    ctx.moveTo(0, -2);
    if (this.isPunching) {
      const punchX = Math.sin(this.punchProgress * Math.PI) * 15;
      ctx.lineTo(10 + punchX, 5);
    } else {
      ctx.lineTo(10, 5); // Holding weapon
    }
    
    // Legs
    const legAngle = Math.sin(this.bob) * 0.5;
    ctx.moveTo(0, 10);
    ctx.lineTo(-5 - legAngle * 5, 20);
    
    ctx.moveTo(0, 10);
    ctx.lineTo(5 + legAngle * 5, 20);
    
    ctx.stroke();

    // Weapon Visuals
    ctx.save();
    let weaponX = 10;
    if (this.isPunching) {
      weaponX += Math.sin(this.punchProgress * Math.PI) * 15;
    }

    if (this.weapon.id === 'fists') {
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(weaponX, 5, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.weapon.id === 'spear') {
      ctx.strokeStyle = '#92400e'; // Wood
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(weaponX - 10, 5);
      ctx.lineTo(weaponX + 25, 5);
      ctx.stroke();
      
      ctx.fillStyle = '#94a3b8'; // Metal tip
      ctx.beginPath();
      ctx.moveTo(weaponX + 25, 5);
      ctx.lineTo(weaponX + 35, 5);
      ctx.lineTo(weaponX + 25, 2);
      ctx.fill();
    } else if (this.weapon.id === 'katana') {
      ctx.strokeStyle = '#e2e8f0'; // Blade
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(weaponX, 5);
      ctx.lineTo(weaponX + 20, -5);
      ctx.stroke();
      
      ctx.strokeStyle = '#1e293b'; // Handle
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(weaponX, 5);
      ctx.lineTo(weaponX - 5, 8);
      ctx.stroke();
    } else if (this.weapon.id === 'crossbow') {
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(weaponX, 5);
      ctx.lineTo(weaponX + 15, 5); // Body
      ctx.moveTo(weaponX + 10, 0);
      ctx.lineTo(weaponX + 10, 10); // Bow part
      ctx.stroke();
    } else {
      // Default Gun
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(weaponX - 2, 2, 15, 6);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(weaponX + 8, 2, 5, 2);
    }
    ctx.restore();

    ctx.restore();

    // Reload Bar
    if (this.isReloading) {
      const progress = (Date.now() - this.reloadStartTime) / this.weapon.reloadTime;
      ctx.fillStyle = '#374151';
      ctx.fillRect(this.x, this.y - 15, this.width, 4);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(this.x, this.y - 15, this.width * progress, 4);
    }
  }

  canShoot() {
    const now = Date.now();
    return !this.isReloading && this.currentMag > 0 && now - this.lastShot >= this.weapon.fireRate;
  }

  shoot() {
    this.lastShot = Date.now();
    
    if (this.weapon.bulletSpeed === 0) {
      this.isPunching = true;
      this.punchProgress = 0;
    }
    
    this.currentMag--;
    if (this.currentMag <= 0) {
      this.reload();
    }
  }

  reload() {
    if (this.isReloading || this.currentMag === this.weapon.magazineSize) return;
    this.isReloading = true;
    this.reloadStartTime = Date.now();
  }
}
