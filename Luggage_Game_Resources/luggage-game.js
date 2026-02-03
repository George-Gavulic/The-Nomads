function startCanvas() {
    const canvas = document.getElementById('luggageGameScreen');
    const context = canvas.getContext('2d');
    //const [width, height] = getScreenDimensions();
    
}





/* =========================
   BASIC CONFIG for TILEMAP
========================= */
const TILE_SIZE = 32;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 8;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

/* =========================
   TILESET IMAGE
========================= */
// You can replace this with your own spritesheet
const tileSheet = new Image();
tileSheet.src = "https://i.imgur.com/3cXn5XW.png"; // example tileset

/* =========================
   TILE DEFINITIONS
========================= */
const tiles = {
  0: { name: "empty", solid: false, x: 0, y: 0 },
  1: { name: "grass", solid: false, x: 1, y: 0 },
  2: { name: "wall", solid: true,  x: 2, y: 0 },
  3: { name: "water", solid: true, x: 3, y: 0 }
};

/* =========================
   LEVEL DATA
========================= */
const levels = {
  level1: [
    [2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,0,0,0,0,0,0,1,2],
    [2,1,0,2,2,2,2,0,1,2],
    [2,1,0,0,0,0,0,0,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,2,2,2,2,2,2,2,2,2]
  ],

  level2: [
    [2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,3,3,3,3,3,3,1,2],
    [2,1,3,0,0,0,0,3,1,2],
    [2,1,3,0,2,2,0,3,1,2],
    [2,1,3,0,0,0,0,3,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,2,2,2,2,2,2,2,2,2]
  ]
};

let currentMap = levels.level1;

/* =========================
   DRAWING FUNCTIONS
========================= */
function drawTile(tileId, gridX, gridY) {
  const tile = tiles[tileId];
  if (!tile) return;

  ctx.drawImage(
    tileSheet,
    tile.x * TILE_SIZE,
    tile.y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    gridX * TILE_SIZE,
    gridY * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawMap() {
  for (let y = 0; y < currentMap.length; y++) {
    for (let x = 0; x < currentMap[y].length; x++) {
      drawTile(currentMap[y][x], x, y);
    }
  }
}

/* =========================
   GAME LOOP
========================= */
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  requestAnimationFrame(gameLoop);
}

/* =========================
   LEVEL SWITCHING (DEMO)
========================= */
window.addEventListener("keydown", e => {
  if (e.key === "1") currentMap = levels.level1;
  if (e.key === "2") currentMap = levels.level2;
});

/* =========================
   START GAME
========================= */
tileSheet.onload = () => {
  gameLoop();
  startCanvas();
};

