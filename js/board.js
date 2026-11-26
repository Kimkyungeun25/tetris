
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// 빈 게임판 생성
export function createBoard() {
  return Array.from(
    { length: BOARD_HEIGHT },
    () => Array(BOARD_WIDTH).fill(0)
  );
}

// 블록이 게임판과 충돌하는지 검사
export function isCollision(board, piece, offsetX = 0, offsetY = 0, shape = piece.shape) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const newX = piece.x + x + offsetX;
      const newY = piece.y + y + offsetY;

      // 좌우 경계 및 바닥 충돌
      if (
        newX < 0 ||
        newX >= BOARD_WIDTH ||
        newY >= BOARD_HEIGHT
      ) {
        return true;
      }

      // 게임판 위쪽은 허용
      if (newY < 0) continue;

      // 이미 고정된 블록과 충돌
      if (board[newY][newX] !== 0) {
        return true;
      }
    }
  }

  return false;
}

// 블록을 게임판에 고정
export function lockPiece(board, piece) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (!piece.shape[y][x]) continue;

      const boardX = piece.x + x;
      const boardY = piece.y + y;

      if (
        boardY >= 0 &&
        boardY < BOARD_HEIGHT &&
        boardX >= 0 &&
        boardX < BOARD_WIDTH
      ) {
        board[boardY][boardX] = piece.color;
      }
    }
  }
}

// 가득 찬 줄 제거
export function clearLines(board) {
  let cleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));

      cleared++;
      y++;
    }
  }

  return cleared;
}

// 블록을 한 칸 이동
export function movePiece(board, piece, dx, dy) {
  if (isCollision(board, piece, dx, dy)) {
    return false;
  }

  piece.x += dx;
  piece.y += dy;

  return true;
}
