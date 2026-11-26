
export const PIECES = {
  I: {
    color: "#00e5ff",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  O: {
    color: "#ffe600",
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    color: "#b44aff",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  S: {
    color: "#00e676",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  Z: {
    color: "#ff4569",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  },
  J: {
    color: "#448aff",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    color: "#ff9800",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  }
};

const TYPES = Object.keys(PIECES);

// 7-bag 방식으로 블록 생성
let bag = [];

function refillBag() {
  bag = [...TYPES];

  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

// 새로운 블록 생성
export function createPiece(type = null) {
  if (bag.length === 0) {
    refillBag();
  }

  const pieceType = type ?? bag.pop();
  const pieceData = PIECES[pieceType];

  if (!pieceData) {
    throw new Error(`잘못된 블록 유형: ${pieceType}`);
  }

  return {
    type: pieceType,
    color: pieceData.color,
    shape: pieceData.shape.map(row => [...row]),
    x: 3,
    y: 0
  };
}

// 시계 방향 90도 회전
export function rotatePiece(piece) {
  if (piece.type === "O") {
    return piece.shape.map(row => [...row]);
  }

  const size = piece.shape.length;
  const rotated = Array.from(
    { length: size },
    () => Array(size).fill(0)
  );

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = piece.shape[y][x];
    }
  }

  return rotated;
}
