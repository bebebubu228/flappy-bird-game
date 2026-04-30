// система звуков
export const Sound = {
  enabled: true,

  // звуки
  jump: new Audio("assets/jump.mp3"),
  hit: new Audio("assets/hit.mp3"),
  point: new Audio("assets/point.mp3"),

  // проигрывание звука
  play(audio) {
    if (!this.enabled) return;

    audio.currentTime = 0;
    audio.play();
  },

  // включение/выключение звука
  toggle() {
    this.enabled = !this.enabled;
  }
};