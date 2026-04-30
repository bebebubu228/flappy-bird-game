import { Input } from "./input.js";
import { Sound } from "./sound.js";

// игрок
export class Player {
  constructor() {
    this.x = 200;
    this.y = 300;

    this.w = 40;
    this.h = 40;

    this.vy = 0;
    this.gravity = 0.6;
    this.jumpForce = -10;
  }
  update() {
    // прыжок
    if (Input.pressed("Escape")) {
      this.vy = this.jumpForce;
      Sound.play(Sound.jump);
    }

    // физика
    this.vy += this.gravity;
    this.y += this.vy;
  }

  draw(ctx, assets) {
    ctx.drawImage(assets.bird, this.x, this.y, this.w, this.h);
  }
}