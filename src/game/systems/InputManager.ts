export class InputManager {
  keys: Set<string> = new Set();
  isMouseDown: boolean = false;

  constructor() {
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('mousedown', () => this.isMouseDown = true);
    window.addEventListener('mouseup', () => this.isMouseDown = false);
  }

  isPressed(code: string) {
    return this.keys.has(code);
  }
}
