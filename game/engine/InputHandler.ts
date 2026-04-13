export class InputHandler {
  private keys: Set<string> = new Set();
  private justPressed: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.keys.has(e.code)) {
      this.justPressed.add(e.code);
    }
    this.keys.add(e.code);
    // prevent arrow key scroll
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  wasJustPressed(code: string): boolean {
    return this.justPressed.has(code);
  }

  flush() {
    this.justPressed.clear();
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  isLeft(): boolean {
    return this.isDown('ArrowLeft') || this.isDown('KeyA');
  }

  isRight(): boolean {
    return this.isDown('ArrowRight') || this.isDown('KeyD');
  }

  isJump(): boolean {
    return this.isDown('ArrowUp') || this.isDown('KeyW') || this.isDown('Space');
  }

  isAttack(): boolean {
    return this.isDown('KeyZ') || this.isDown('KeyJ') || this.isDown('Enter');
  }
}
