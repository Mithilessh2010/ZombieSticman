// src/game/background.ts

export type MapType = 'city' | 'lab' | 'desert' | 'snow' | 'forest';

export const MAP_CONFIG: Record<MapType, { floorColor: string; gridColor: string; ambientColor: string; name: string }> = {
  city:   { floorColor: '#111827', gridColor: '#1f2937', ambientColor: '#22c55e', name: 'City Streets' },
  lab:    { floorColor: '#0f172a', gridColor: '#1e293b', ambientColor: '#38bdf8', name: 'Abandoned Lab' },
  desert: { floorColor: '#1c1410', gridColor: '#2a1f15', ambientColor: '#f97316', name: 'Desert Outpost' },
  snow:   { floorColor: '#0f172a', gridColor: '#1e3a5f', ambientColor: '#bae6fd', name: 'Snow Base' },
  forest: { floorColor: '#0a1208', gridColor: '#15261a', ambientColor: '#86efac', name: 'Dark Forest' },
};

export class Background {
  private mapType: MapType;
  private worldW: number;
  private worldH: number;
  private props: Array<{ x: number; y: number; type: number; size: number }> = [];
  private animFrame = 0;

  constructor(mapType: MapType, worldW: number, worldH: number) {
    this.mapType = mapType;
    this.worldW = worldW;
    this.worldH = worldH;
    this.generateProps();
  }

  private generateProps() {
    const count = 120;
    for (let i = 0; i < count; i++) {
      this.props.push({
        x: Math.random() * this.worldW,
        y: Math.random() * this.worldH,
        type: Math.floor(Math.random() * 4),
        size: 6 + Math.random() * 20,
      });
    }
  }

  update(dt: number) {
    this.animFrame += dt;
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number, canvasW: number, canvasH: number) {
    const cfg = MAP_CONFIG[this.mapType];

    // Floor
    ctx.fillStyle = cfg.floorColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Grid
    ctx.strokeStyle = cfg.gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    const gridSize = 80;
    const offsetX = (-camX % gridSize + gridSize) % gridSize;
    const offsetY = (-camY % gridSize + gridSize) % gridSize;

    for (let x = offsetX; x < canvasW; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, canvasH);
      ctx.stroke();
    }
    for (let y = offsetY; y < canvasH; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(canvasW, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Props
    for (const p of this.props) {
      const sx = p.x - camX;
      const sy = p.y - camY;
      if (sx < -50 || sx > canvasW + 50 || sy < -50 || sy > canvasH + 50) continue;

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = cfg.ambientColor;
      ctx.fillStyle = cfg.gridColor;
      ctx.lineWidth = 1.5;

      this.drawProp(ctx, sx, sy, p.type, p.size, cfg);
      ctx.restore();
    }

    // World border
    const b = { x: -camX, y: -camY, w: this.worldW, h: this.worldH };
    ctx.strokeStyle = cfg.ambientColor;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.globalAlpha = 1;
  }

  private drawProp(ctx: CanvasRenderingContext2D, x: number, y: number, type: number, size: number, cfg: { ambientColor: string }) {
    switch (this.mapType) {
      case 'city':
        if (type === 0) { ctx.fillRect(x - size / 2, y - size / 2, size, size * 1.5); ctx.strokeRect(x - size / 2, y - size / 2, size, size * 1.5); }
        else if (type === 1) { ctx.beginPath(); ctx.arc(x, y, size / 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        else { ctx.fillRect(x - size, y - 4, size * 2, 8); ctx.strokeRect(x - size, y - 4, size * 2, 8); }
        break;
      case 'lab':
        ctx.beginPath(); ctx.rect(x - size / 2, y - size / 2, size, size); ctx.fill(); ctx.stroke();
        if (type < 2) { ctx.beginPath(); ctx.moveTo(x - size / 2, y); ctx.lineTo(x + size / 2, y); ctx.stroke(); }
        break;
      case 'desert':
        if (type === 0) { ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size * 0.4, y + size * 0.5); ctx.lineTo(x - size * 0.4, y + size * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
        break;
      case 'snow':
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * size / 2, y + Math.sin(a) * size / 2); ctx.stroke();
        }
        break;
      case 'forest':
        if (type === 0) { ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size * 0.5, y + size * 0.6); ctx.lineTo(x - size * 0.5, y + size * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
        break;
    }
  }
}
