export class InputHandler {
  private held = new Set<string>();
  private pressed = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.kd);
    window.addEventListener('keyup', this.ku);
  }
  private kd = (e: KeyboardEvent) => {
    if (!this.held.has(e.code)) this.pressed.add(e.code);
    this.held.add(e.code);
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
  };
  private ku = (e: KeyboardEvent) => { this.held.delete(e.code); };

  isHeld(c: string) { return this.held.has(c); }
  wasPressed(c: string) { return this.pressed.has(c); }
  flush() { this.pressed.clear(); }
  destroy() {
    window.removeEventListener('keydown', this.kd);
    window.removeEventListener('keyup', this.ku);
  }
  left()  { return this.isHeld('KeyA') || this.isHeld('ArrowLeft'); }
  right() { return this.isHeld('KeyD') || this.isHeld('ArrowRight'); }
  jump()  { return this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); }
}
