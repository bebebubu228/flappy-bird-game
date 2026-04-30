// ввод пользователя
export const Input = {
  keys: {},

  // проверка нажатия
  pressed(key) {
    return this.keys[key];
  }
};

// нажатие клавиши
window.addEventListener("keydown", (e) => {
  Input.keys[e.code] = true;
});

// отпускание клавиши
window.addEventListener("keyup", (e) => {
  Input.keys[e.code] = false;
});
