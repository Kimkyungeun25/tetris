
const CELL_SIZE = 30;

const boardCanvas = document.getElementById("game-board");
const boardCtx = boardCanvas.getContext("2d");

const nextCanvas = document.getElementById("next-board");
const nextCtx = nextCanvas.getContext("2d");

const COLS = 10;
const ROWS = 20;

function drawCell(ctx, x, y, color, size = CELL_SIZE) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    x * size + 1,
    y * size + 1,
    size - 2,
    size - 2
  );
}

// 게임판 배경과 격자 그리기
function drawGrid() {
  boardCtx.fillStyle = "#080d19";
  boardCtx.fillRect(0, 0, 300, 600);

  boardCtx.strokeStyle = "#18243a";
  boardCtx.lineWidth = 1;

  for (let x = 0; x <= COLS; x++) {
    boardCtx.beginPath();
    boardCtx.moveTo(x * CELL_SIZE, 0);
    boardCtx.lineTo(x * CELL_SIZE, 600);
    boardCtx.stroke();
  }

  for (let y = 0; y <= ROWS; y++) {
    boardCtx.beginPath();
    boardCtx.moveTo(0, y * CELL_SIZE);
    boardCtx.lineTo(300, y * CELL_SIZE);
    boardCtx.stroke();
  }
}

// 고정된 블록 그리기
function drawFixedBlocks(board) {
  board.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color) {
        drawCell(boardCtx, x, y, color);
      }
    });
  });
}

// 현재 움직이는 블록 그리기
function drawCurrentPiece(piece) {
  if (!piece) return;

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawCell(
          boardCtx,
          piece.x + x,
          piece.y + y,
          piece.color
        );
      }
    });
  });
}

// 다음 블록 미리보기
export function drawNextPiece(piece) {
  nextCtx.clearRect(0, 0, 120, 120);

  if (!piece) return;

  const size = 24;
  const shape = piece.shape;

  const offsetX = (120 - shape[0].length * size) / 2;
  const offsetY = (120 - shape.length * size) / 2;

  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;

      nextCtx.fillStyle = piece.color;
      nextCtx.fillRect(
        offsetX + x * size + 1,
        offsetY + y * size + 1,
        size - 2,
        size - 2
      );
    });
  });
}

// 게임판 전체 갱신
export function drawBoard(game) {
  drawGrid();
  drawFixedBlocks(game.board);
  drawCurrentPiece(game.currentPiece);

  document.getElementById("score").textContent = game.score;
  document.getElementById("level").textContent = game.level;
  document.getElementById("lines").textContent = game.lines;

  drawNextPiece(game.nextPiece);
}

// 게임 상태에 따른 오버레이 표시
export function updateOverlay(state, score = 0) {
  const overlay = document.getElementById("overlay");
  const title = document.getElementById("overlay-title");
  const message = document.getElementById("overlay-message");
  const button = document.getElementById("overlay-button");

  overlay.classList.remove("hidden");

  if (state === "PLAYING") {
    overlay.classList.add("hidden");
    return;
  }

  if (state === "START") {
    title.textContent = "NEON TETRIS";
    message.textContent = "블록을 쌓아 최고 점수에 도전하세요!";
    button.textContent = "게임 시작";
  } else if (state === "PAUSED") {
    title.textContent = "PAUSED";
    message.textContent = "게임이 일시정지되었습니다.";
    button.textContent = "게임 재개";
  } else if (state === "GAME OVER") {
    title.textContent = "GAME OVER";
    message.textContent = `최종 점수: ${score}`;
    button.textContent = "다시 시작";
  }
}
