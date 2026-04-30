// проверка столкновений
export function checkCollision(player, pipes) {
  for (let p of pipes) {
    if (
      player.x < p.x + 50 &&
      player.x + player.w > p.x &&
      (player.y < p.top || player.y + player.h > p.bottom)
    ) {
      return true;
    }
  }
  return false;
}