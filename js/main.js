
import { TetrisGame } from "./game.js";
import { setupControls } from "./controls.js";
import { drawBoard, updateOverlay } from "./ui.js";

// 게임 인스턴스 생성
const game = new TetrisGame(() => {
  drawBoard(game);
  updateOverlay(game.state, game.score);
});

// 키보드 및 버튼 조작 연결
setupControls(game);

// 최초 화면 표시
drawBoard(game);
updateOverlay(game.state, game.score);

console.log("NEON TETRIS initialized!");
