export class InputHandler {
  private held = new Set<string>();
  private pressed = new Set<string>();
  private mouseX = 0;
  private mouseY = 0;
  private mouseClicked = false;

  constructor(canvas?: HTMLCanvasElement) {
    window.addEventListener('keydown', this.kd);
    window.addEventListener('keyup', this.ku);
    if (canvas) {
      canvas.addEventListener('mousemove', this.mm);
      canvas.addEventListener('mousedown', this.md);
      canvas.addEventListener('mouseup', this.mu);
    }
  }

  private kd = (e: KeyboardEvent) => {
    if (!this.held.has(e.code)) this.pressed.add(e.code);
    this.held.add(e.code);
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
  };

  private ku = (e: KeyboardEvent) => { this.held.delete(e.code); };

  private mm = (e: MouseEvent) => {
    if (e.target instanceof HTMLCanvasElement) {
      const rect = e.target.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (e.target.width / rect.width);
      this.mouseY = (e.clientY - rect.top) * (e.target.height / rect.height);
    }
  };

  private md = (e: MouseEvent) => {
    this.mouseClicked = true;
    e.preventDefault();
  };

  private mu = (e: MouseEvent) => {
    this.mouseClicked = false;
  };

  isHeld(c: string) { return this.held.has(c); }
  wasPressed(c: string) { return this.pressed.has(c); }
  flush() { this.pressed.clear(); }

  getMousePos() { return { x: this.mouseX, y: this.mouseY }; }
  isMouseClicked() { return this.mouseClicked; }
  punch() { return this.wasPressed('KeyR'); }

  destroy() {
    window.removeEventListener('keydown', this.kd);
    window.removeEventListener('keyup', this.ku);
    // Note: Canvas listeners auto-cleanup when canvas is removed
  }

  left()  { return this.isHeld('KeyA') || this.isHeld('ArrowLeft'); }
  right() { return this.isHeld('KeyD') || this.isHeld('ArrowRight'); }
  jump()  { return this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); }
}
