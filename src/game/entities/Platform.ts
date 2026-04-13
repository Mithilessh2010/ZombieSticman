import { Entity } from './Entity';

export class Platform extends Entity {
  color: string;

  constructor(x: number, y: number, width: number, height: number, color: string = '#374151') {
    super(x, y, width, height);
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Top highlight
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(this.x, this.y, this.width, 4);
    
    ctx.restore();
  }
}
