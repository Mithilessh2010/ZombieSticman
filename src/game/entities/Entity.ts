export class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number = 0;
  vy: number = 0;
  markedForDeletion: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(dt: number, ..._args: any[]) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Override in subclasses
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }

  collidesWith(other: Entity) {
    const b1 = this.getBounds();
    const b2 = other.getBounds();
    return (
      b1.left < b2.right &&
      b1.right > b2.left &&
      b1.top < b2.bottom &&
      b1.bottom > b2.top
    );
  }
}
