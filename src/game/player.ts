// src/game/player.ts
import { PlayerStats, WeaponType } from '@/types';
import { WEAPONS } from './weapons';
import { ParticleSystem } from './particle';

export class Player {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  angle = 0;

  stats: PlayerStats;
  health: number;
  armor: number;

  // Current weapon
  weaponType: WeaponType = 'pistol';
  ammo: number;
  maxAmmo: number;
  reloading = false;
  reloadTimer = 0;
  fireCooldown = 0;

  // Weapons inventory
  inventory: WeaponType[] = ['pistol'];

  // Dash
  dashing = false;
  dashTimer = 0;
  dashDx = 0;
  dashDy = 0;
  dashCooldownTimer = 0;
  invincible = false;
  invincibleTimer = 0;

  // Hit flash
  hitFlash = 0;

  // XP / level
  level = 1;
  xp = 0;
  xpToNext = 100;

  // Applied upgrades tracking
  appliedUpgrades = new Map<string, number>();

  // Kill streak
  killStreak = 0;
  killStreakTimer = 0;

  // Regen accumulator
  regenAccum = 0;

  // Lifesteal queue
  healQueue = 0;

  private particles: ParticleSystem;

  constructor(x: number, y: number, stats: PlayerStats, particles: ParticleSystem) {
    this.x = x;
    this.y = y;
    this.stats = { ...stats };
    this.health = stats.maxHealth;
    this.armor = stats.armor;
    const w = WEAPONS[this.weaponType];
    this.ammo = w.magazineSize;
    this.maxAmmo = w.magazineSize;
    this.particles = particles;
  }

  get weapon() { return WEAPONS[this.weaponType]; }

  get speed() {
    return this.stats.speed * (this.stats.attackSpeed / 100);
  }

  get realSpeed() {
    return this.stats.speed;
  }

  takeDamage(dmg: number): boolean {
    if (this.invincible) return false;

    // Dodge chance
    if (Math.random() * 100 < this.stats.dodgeChance) {
      this.particles.damageNumber(this.x, this.y - 20, 0, false);
      return false;
    }

    const reduced = Math.max(1, dmg - this.armor);
    this.health = Math.max(0, this.health - reduced);
    this.hitFlash = 0.2;
    this.invincible = true;
    this.invincibleTimer = 400;
    this.particles.blood(this.x, this.y);
    return this.health <= 0;
  }

  heal(amount: number) {
    this.health = Math.min(this.stats.maxHealth, this.health + amount);
  }

  tryShoot(targetX: number, targetY: number): BulletSpawn[] | null {
    if (this.reloading) return null;
    if (this.fireCooldown > 0) return null;
    if (this.ammo <= 0) { this.startReload(); return null; }

    const w = this.weapon;
    const fireInterval = (1000 / w.fireRate) / (this.stats.attackSpeed / 100);
    this.fireCooldown = fireInterval;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const baseAngle = Math.atan2(dy, dx);
    this.angle = baseAngle;

    const bullets: BulletSpawn[] = [];
    const sizeScale = this.stats.bulletSize / 100;
    const speedScale = this.stats.bulletSpeed / 100;
    const dmgScale = this.stats.damage / 100;

    for (let i = 0; i < w.bulletCount; i++) {
      const spreadRad = ((Math.random() - 0.5) * w.spread * Math.PI) / 180;
      const angle = baseAngle + spreadRad;
      const speed = w.bulletSpeed * speedScale;
      const damage = w.damage * dmgScale;
      const isCrit = Math.random() * 100 < this.stats.critChance;
      const finalDmg = isCrit ? Math.round(damage * (this.stats.critMultiplier / 100)) : Math.round(damage);

      bullets.push({
        x: this.x, y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: finalDmg,
        isCrit,
        range: w.range,
        size: (w.type === 'rocket_launcher' ? 8 : w.type === 'flamethrower' ? 5 : 4) * sizeScale,
        color: w.color,
        piercing: this.stats.piercing,
        weaponType: w.type,
      });
    }

    this.particles.muzzleFlash(this.x, this.y, baseAngle, w.color);

    this.ammo--;
    if (this.ammo <= 0) this.startReload();

    return bullets;
  }

  startReload() {
    if (this.reloading || this.ammo === this.maxAmmo) return;
    this.reloading = true;
    this.reloadTimer = this.weapon.reloadTime;
  }

  switchWeapon(idx: number) {
    if (idx < 0 || idx >= this.inventory.length) return;
    if (this.inventory[idx] === this.weaponType) return;
    this.weaponType = this.inventory[idx];
    this.reloading = false;
    this.reloadTimer = 0;
    this.fireCooldown = 0;
    const w = WEAPONS[this.weaponType];
    this.ammo = w.magazineSize;
    this.maxAmmo = w.magazineSize;
  }

  tryDash(dx: number, dy: number) {
    if (this.dashing || this.dashCooldownTimer > 0) return;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    this.dashing = true;
    this.dashTimer = this.stats.dashDuration;
    this.dashDx = (dx / len) * 600;
    this.dashDy = (dy / len) * 600;
    this.invincible = true;
    this.invincibleTimer = this.stats.dashDuration + 100;
  }

  addXP(amount: number): boolean {
    const scaled = Math.round(amount * (this.stats.xpMultiplier / 100));
    this.xp += scaled;
    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.round(this.xpToNext * 1.3 + 20);
      this.heal(20);
      return true; // leveled up
    }
    return false;
  }

  update(dt: number, input: PlayerInput, worldW: number, worldH: number) {
    // Timers
    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - dt * 1000);
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt * 3);
    if (this.invincibleTimer > 0) {
      this.invincibleTimer = Math.max(0, this.invincibleTimer - dt * 1000);
      if (this.invincibleTimer <= 0) this.invincible = false;
    }
    if (this.killStreakTimer > 0) {
      this.killStreakTimer -= dt * 1000;
      if (this.killStreakTimer <= 0) this.killStreak = 0;
    }

    // Reload
    if (this.reloading) {
      this.reloadTimer -= dt * 1000;
      if (this.reloadTimer <= 0) {
        this.reloading = false;
        const w = WEAPONS[this.weaponType];
        this.ammo = w.magazineSize;
        this.maxAmmo = w.magazineSize;
      }
    }

    // Dash cooldown
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer = Math.max(0, this.dashCooldownTimer - dt * 1000);

    // Dash movement
    if (this.dashing) {
      this.dashTimer -= dt * 1000;
      this.x += this.dashDx * dt;
      this.y += this.dashDy * dt;
      if (this.dashTimer <= 0) {
        this.dashing = false;
        this.dashCooldownTimer = this.stats.dashCooldown;
      }
    } else {
      // Normal movement
      const spd = this.stats.speed;
      let mvx = 0, mvy = 0;
      if (input.up) mvy -= 1;
      if (input.down) mvy += 1;
      if (input.left) mvx -= 1;
      if (input.right) mvx += 1;
      const len = Math.sqrt(mvx * mvx + mvy * mvy);
      if (len > 0) { mvx /= len; mvy /= len; }

      const targetVx = mvx * spd;
      const targetVy = mvy * spd;
      const acc = 20;
      this.vx += (targetVx - this.vx) * Math.min(1, acc * dt);
      this.vy += (targetVy - this.vy) * Math.min(1, acc * dt);
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Dash input
      if (input.dash) this.tryDash(mvx || Math.cos(this.angle), mvy || Math.sin(this.angle));
    }

    // World bounds
    const PAD = 20;
    this.x = Math.max(PAD, Math.min(worldW - PAD, this.x));
    this.y = Math.max(PAD, Math.min(worldH - PAD, this.y));

    // Regen
    if (this.stats.regen > 0) {
      this.regenAccum += this.stats.regen * dt;
      if (this.regenAccum >= 1) {
        this.heal(Math.floor(this.regenAccum));
        this.regenAccum -= Math.floor(this.regenAccum);
      }
    }

    // Heal queue (lifesteal)
    if (this.healQueue > 0) {
      const toHeal = Math.min(this.healQueue, 2);
      this.heal(toHeal);
      this.healQueue -= toHeal;
    }
  }

  draw(ctx: CanvasRenderingContext2D, sx: number, sy: number) {
    ctx.save();
    ctx.translate(sx, sy);

    const flash = this.hitFlash > 0;
    const dashAlpha = this.dashing ? 0.7 : 1;
    ctx.globalAlpha = dashAlpha;

    // Invincible blink
    if (this.invincible && !this.dashing && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Glow ring (level indicator)
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;

    const col = flash ? '#ef4444' : '#22c55e';
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -8); ctx.lineTo(0, 8);
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(0, -14, 7, 0, Math.PI * 2);
    ctx.stroke();

    // Arms - one points toward aim angle
    const armAngle = this.angle;
    // Shooting arm
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(Math.cos(armAngle) * 12, Math.sin(armAngle) * 12);
    ctx.stroke();
    // Other arm opposite
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(Math.cos(armAngle + Math.PI * 0.7) * 9, Math.sin(armAngle + Math.PI * 0.7) * 9);
    ctx.stroke();

    // Legs
    const legSway = Math.sin(Date.now() / 120) * 0.25;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(Math.cos(Math.PI / 2 + legSway) * 10, 8 + Math.sin(Math.PI / 2 + legSway) * 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(Math.cos(Math.PI / 2 - legSway) * (-10), 8 + Math.sin(Math.PI / 2 - legSway) * 10);
    ctx.stroke();

    // Weapon visual
    const wColor = WEAPONS[this.weaponType].color;
    ctx.strokeStyle = wColor;
    ctx.shadowColor = wColor;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 3;
    const wLen = this.weaponType === 'sniper' ? 22 : this.weaponType === 'minigun' ? 16 : 14;
    ctx.beginPath();
    ctx.moveTo(Math.cos(armAngle) * 10, Math.sin(armAngle) * 10);
    ctx.lineTo(Math.cos(armAngle) * (10 + wLen), Math.sin(armAngle) * (10 + wLen));
    ctx.stroke();

    ctx.restore();
  }
}

export interface BulletSpawn {
  x: number; y: number;
  vx: number; vy: number;
  damage: number;
  isCrit: boolean;
  range: number;
  size: number;
  color: string;
  piercing: number;
  weaponType: WeaponType;
}

export interface PlayerInput {
  up: boolean; down: boolean; left: boolean; right: boolean;
  dash: boolean;
  mouseX: number; mouseY: number;
  shoot: boolean;
  reload: boolean;
  weapon1: boolean; weapon2: boolean; weapon3: boolean; weapon4: boolean; weapon5: boolean;
}
