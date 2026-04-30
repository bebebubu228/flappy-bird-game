import { Player } from "./player.js";
import { LEVEL, updateLevel, drawLevel, resetLevel } from "./level.js";
import { checkCollision } from "./physics.js";
import { Input } from "./input.js";
import { GameState } from "./state.js";
import { Sound } from "./sound.js";

// ассеты
const assets = {
  bird: new Image(),
  bg: new Image(),
  pipeTop: new Image(),
  pipeBottom: new Image()
};

assets.bird.src = "assets/b0.png";
assets.bg.src = "assets/BG.png";
assets.pipeTop.src = "assets/toppipe.png";
assets.pipeBottom.src = "assets/botpipe.png";

// canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ui
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const muteBtn = document.getElementById("muteBtn");

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const playerNameEl = document.getElementById("playerName");

// состояние игры
let game = {
  state: GameState.MENU,
  player: null,
  score: 0,
  time: 120,
  timerId: null,
  playerName: "",
  tester: false,
  countdown: 3,           // счетчик обратного отсчета
  countdownId: null       // ID интервала отсчета
};

// блокировка старта
nameInput.addEventListener("input", () => {
  startBtn.disabled = nameInput.value.trim() === "";
});

// старт игры
startBtn.onclick = () => {
  game.playerName = nameInput.value.trim();
  game.tester = game.playerName === "tester";
  playerNameEl.textContent = game.tester ? "test mode" : game.playerName;
  startGame();
};

// запуск игры
function startGame() {
  resetLevel();
  game.player = new Player();
  game.score = 0;
  game.time = 120;

  // начало с обратного отсчета
  game.state = GameState.COUNTDOWN;
  game.countdown = 3;
  startCountdown();

  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  gameOverScreen.classList.remove("active");
}

// обратный отсчет 
function startCountdown() {
  clearInterval(game.countdownId);
  game.countdownId = setInterval(() => {
    game.countdown--;
    if (game.countdown <= 0) {
      clearInterval(game.countdownId);
      game.state = GameState.PLAYING;
      startTimer();      // запуск основного таймера
    }
  }, 1000);
}

// основной таймер игры
function startTimer() {
  clearInterval(game.timerId);
  game.timerId = setInterval(() => {
    if (game.state !== GameState.PLAYING) return;
    if (game.tester) return;
    game.time--;
    timerEl.textContent = formatTime(game.time);
    if (game.time <= 0) endGame();
  }, 1000);
}

// формат времени
function formatTime(t) {
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

// обновление логики
function update() {
  if (game.state !== GameState.PLAYING) return;

  game.player.update();
  updateLevel(game);

  if (!game.tester) {
    if (checkCollision(game.player, LEVEL.pipes)) {
      Sound.play(Sound.hit);
      endGame();
    }
    if (game.player.y < 0 || game.player.y > 768) {
      Sound.play(Sound.hit);
      endGame();
    }
  }
}

// рендер
function render() {
  ctx.clearRect(0, 0, 1024, 768);
  ctx.drawImage(assets.bg, 0, 0, 1024, 768);

  if (game.state === GameState.COUNTDOWN) {
    // затемнение
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, 1024, 768);
    // цифра отсчета
    ctx.fillStyle = "#fff";
    ctx.font = "bold 96px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(game.countdown, 1024 / 2, 768 / 2);
    return;
  }

  if (game.state === GameState.PLAYING || game.state === GameState.PAUSED) {
    drawLevel(ctx, assets);
    game.player.draw(ctx, assets);
    scoreEl.textContent = game.score;

    if (game.state === GameState.PAUSED) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, 1024, 768);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ПАУЗА", 1024 / 2, 768 / 2);
    }
  }
}

// главный цикл
function loop() {
  if (game.state === GameState.PLAYING) {
    update();
    render();
  } else if (game.state === GameState.COUNTDOWN || game.state === GameState.PAUSED) {

    render();
  }
  requestAnimationFrame(loop);
}
loop();

// пауза 
function togglePause() {
  if (game.state === GameState.PLAYING) {
    game.state = GameState.PAUSED;
  } else if (game.state === GameState.PAUSED) {
    game.state = GameState.PLAYING;
  }
}

// управление
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePause();
  }
  if (e.code === "KeyM") Sound.toggle();
  if (e.code === "Escape") Input.keys["Escape"] = true;
});

const pauseBtn = document.getElementById("pauseBtn");
if (pauseBtn) {
  pauseBtn.onclick = togglePause;
}

muteBtn.onclick = () => {
  Sound.toggle();
  muteBtn.textContent = Sound.enabled ? "Звук" : "Нет звука";
};
muteBtn.textContent = Sound.enabled ? "Звук" : "Нет звука";

// шрифт
let fontSize = 16;
document.getElementById("fontPlus").onclick = () => {
  fontSize = Math.min(30, fontSize + 2);
  document.body.style.fontSize = fontSize + "px";
};
document.getElementById("fontMinus").onclick = () => {
  fontSize = Math.max(12, fontSize - 2);
  document.body.style.fontSize = fontSize + "px";
};

// конец игры
function endGame() {
  clearInterval(game.timerId);
  game.state = GameState.GAME_OVER;
  gameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");

  let scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push({ name: game.playerName, score: game.score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);
  localStorage.setItem("scores", JSON.stringify(scores));

  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < scores.length; i++) {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${scores[i].name}</td>
        <td>${scores[i].score}</td>
      </tr>
    `;
  }
}

// рестарт
document.getElementById("restartBtn").onclick = () => location.reload();