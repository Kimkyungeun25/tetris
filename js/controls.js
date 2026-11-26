
export function setupControls(game) {
  // 키보드 입력
  document.addEventListener("keydown", (event) => {
    const keys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Space"
    ];

    if (keys.includes(event.code)) {
      event.preventDefault();
    }

    if (event.repeat && event.code === "Space") return;

    if (event.code === "ArrowLeft") {
      game.move(-1, 0);
    } else if (event.code === "ArrowRight") {
      game.move(1, 0);
    } else if (event.code === "ArrowDown") {
      if (game.move(0, 1)) {
        game.score += 1;
        game.onUpdate();
      }
    } else if (event.code === "ArrowUp") {
      game.rotate();
    } else if (event.code === "Space") {
      game.hardDrop();
    } else if (event.code === "KeyP" || event.code === "Escape") {
      if (game.state === "PLAYING") {
        game.pauseGame();
      } else if (game.state === "PAUSED") {
        game.resumeGame();
      }
    } else if (event.code === "Enter") {
      if (game.state === "START" || game.state === "GAME OVER") {
        game.startGame();
      } else if (game.state === "PAUSED") {
        game.resumeGame();
      }
    }
  });

  // 버튼 조작 연결
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const overlayButton = document.getElementById("overlay-button");

  startButton.addEventListener("click", () => {
    if (game.state === "PAUSED") {
      game.resumeGame();
    } else {
      game.startGame();
    }
  });

  pauseButton.addEventListener("click", () => {
    if (game.state === "PLAYING") {
      game.pauseGame();
    } else if (game.state === "PAUSED") {
      game.resumeGame();
    }
  });

  overlayButton.addEventListener("click", () => {
    if (game.state === "PAUSED") {
      game.resumeGame();
    } else {
      game.startGame();
    }
  });

  // 모바일 터치 버튼용 공통 함수
  function addTouchButton(id, action) {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      action();
    });
  }

  addTouchButton("touch-left", () => game.move(-1, 0));
  addTouchButton("touch-right", () => game.move(1, 0));

  addTouchButton("touch-down", () => {
    if (game.move(0, 1)) {
      game.score += 1;
      game.onUpdate();
    }
  });

  addTouchButton("touch-rotate", () => game.rotate());
  addTouchButton("touch-drop", () => game.hardDrop());
}
