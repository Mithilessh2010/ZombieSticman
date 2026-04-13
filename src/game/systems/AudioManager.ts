class AudioManager {
  ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playShoot() {
    this.playTone(440, 0.1, 'square', 0.1);
  }

  playHit() {
    this.playTone(100, 0.1, 'sawtooth', 0.1);
  }

  playDeath() {
    this.playTone(50, 0.3, 'sine', 0.2);
  }

  playCoin() {
    this.playTone(880, 0.1, 'sine', 0.1);
  }

  private playTone(freq: number, duration: number, type: OscillatorType, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const audioManager = new AudioManager();
