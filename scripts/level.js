// уровень игры
export let LEVEL = {
  pipes: [],
  spawnTimer: 0
};

// сброс уровня
export function resetLevel() {
  LEVEL.pipes = [];
  LEVEL.spawnTimer = 0;
}

// обновление уровня
export function updateLevel(state) {
  LEVEL.spawnTimer--;

  // спавн труб
  if (LEVEL.spawnTimer <= 0) {
    LEVEL.spawnTimer = 120;

    let gap = 200;
    let top = Math.random() * 300 + 50;

    LEVEL.pipes.push({
      x: 1024,
      top: top,
      bottom: top + gap,
      passed: false
    });
  }

  // движение труб
  for (let p of LEVEL.pipes) {
    p.x -= 3;

    // начисление очков
    if (!p.passed && p.x < 200) {
      p.passed = true;
      state.score++;
    }
  }

  // удаление старых труб
  LEVEL.pipes = LEVEL.pipes.filter(p => p.x > -50);
}

// отрисовка труб
export function drawLevel(ctx, assets) {
  for (let p of LEVEL.pipes) {
    ctx.drawImage(assets.pipeTop, p.x, 0, 80, p.top);
    ctx.drawImage(assets.pipeBottom, p.x, p.bottom, 80, 768 - p.bottom);
  }
}