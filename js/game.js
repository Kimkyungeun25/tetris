
import {
  createBoard,
  isCollision,
  lockPiece,
  clearLines,
  movePiece
} from "./board.js";

import {
  createPiece,
  rotatePiece
} from "./pieces.js";

export class TetrisGame {
  constructor(onUpdate = () => {}) {
    this.onUpdate = onUpdate;
    this.state = "START";

    this.board = createBoard();
    this.currentPiece = null;
    this.nextPiece = createPiece();

    this.score = 0;
    this.level = 1;
    this.lines = 0;

    this.dropInterval = 1000;
    this.lastDrop = 0;
    this.animationId = null;
    this.lastTime = 0;
  }

  // 게임 시작
  startGame() {
    this.resetGame();
    this.state = "PLAYING";
    this.spawnNextPiece();
    this.lastTime = 0;
    this.onUpdate();
    this.animationId = requestAnimationFrame(this.loop);
  }

  // 게임 초기화
  resetGame() {
    this.stopLoop();

    this.board = createBoard();
    this.currentPiece = null;
    this.nextPiece = createPiece();

    this.score = 0;
    this.level = 1;
    this.lines = 0;

    this.dropInterval = 1000;
    this.lastDrop = 0;
  }

  // 다음 블록 생성
  spawnNextPiece() {
    this.currentPiece = this.nextPiece;
    this.currentPiece.x = 3;
    this.currentPiece.y = 0;

    this.nextPiece = createPiece();

    if (isCollision(this.board, this.currentPiece)) {
      this.gameOver();
      return false;
    }

    this.onUpdate();
    return true;
  }

  // 블록 이동
  move(dx, dy) {
    if (this.state !== "PLAYING" || !this.currentPiece) {
      return false;
    }

    const moved = movePiece(
      this.board,
      this.currentPiece,
      dx,
      dy
    );

    if (moved) {
      this.onUpdate();
    }

    return moved;
  }

  // 시계 방향 회전 및 기본 Wall Kick
  rotate() {
    if (this.state !== "PLAYING" || !this.currentPiece) {
      return;
    }

    const rotated = rotatePiece(this.currentPiece);

    const kicks = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [-2, 0],
      [2, 0],
      [0, -1]
    ];

    for (const [dx, dy] of kicks) {
      if (!isCollision(
        this.board,
        this.currentPiece,
        dx,
        dy,
        rotated
      )) {
        this.currentPiece.shape = rotated;
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        this.onUpdate();
        return;
      }
    }
  }

  // 블록을 바닥까지 즉시 내리기
  hardDrop() {
    if (this.state !== "PLAYING" || !this.currentPiece) {
      return;
    }

    while (movePiece(
      this.board,
      this.currentPiece,
      0,
      1
    )) {
      this.score += 2;
    }

    this.lockCurrentPiece();
  }

  // 블록 고정 및 줄 제거
  lockCurrentPiece() {
    lockPiece(this.board, this.currentPiece);

    const cleared = clearLines(this.board);

    this.calculateScore(cleared);
    this.spawnNextPiece();
    this.onUpdate();
  }

  // 점수 계산
  calculateScore(cleared) {
    const points = [0, 100, 300, 500, 800];

    this.score += (points[cleared] || 0) * this.level;
    this.lines += cleared;

    this.updateLevel();
  }

  // 레벨 업데이트
  updateLevel() {
    const newLevel = Math.floor(this.lines / 10) + 1;

    if (newLevel !== this.level) {
      this.level = newLevel;
      this.dropInterval = Math.max(
        100,
        1000 - (this.level - 1) * 80
      );
    }
  }

  // 한 칸 아래로 이동
  drop() {
    if (this.state !== "PLAYING") return;

    if (!movePiece(
      this.board,
      this.currentPiece,
      0,
      1
    )) {
      this.lockCurrentPiece();
    } else {
      this.onUpdate();
    }
  }

  // 일시정지
  pauseGame() {
    if (this.state !== "PLAYING") return;

    this.state = "PAUSED";
    this.stopLoop();
    this.onUpdate();
  }

  // 게임 재개
  resumeGame() {
    if (this.state !== "PAUSED") return;

    this.state = "PLAYING";
    this.lastTime = 0;
    this.animationId = requestAnimationFrame(this.loop);
    this.onUpdate();
  }

  // 게임 오버
  gameOver() {
    this.state = "GAME OVER";
    this.stopLoop();
    this.onUpdate();
  }

  // 게임 루프
  loop = (time = 0) => {
    if (this.state !== "PLAYING") return;

    if (!this.lastTime) {
      this.lastTime = time;
    }

    const delta = time - this.lastTime;
    this.lastTime = time;

    this.lastDrop += delta;

    if (this.lastDrop >= this.dropInterval) {
      this.drop();
      this.lastDrop = 0;
    }

    if (this.state === "PLAYING") {
      this.animationId = requestAnimationFrame(this.loop);
    }
  };

  // 게임 루프 중단
  stopLoop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
