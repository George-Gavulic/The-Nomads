function startCanvas() {
    const canvas = document.getElementById('luggageGameScreen');
    const context = canvas.getContext('2d');
    canvas.style.width  = canvas.width  * SCALE + "px";
    canvas.style.height = canvas.height * SCALE + "px";

    //const [width, height] = getScreenDimensions();
    
}





//BASIC CONFIG for TILEMAP
const TILE_SIZE = 16;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 8;
const SCALE = 3;

const canvas = document.getElementById("luggageGameScreen");
const ctx = canvas.getContext("2d");

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

// TILESET IMAGE
// grabbing tileset image for backgroud tiles
const tileSheet = new Image();
tileSheet.src = "IrWOZ_.png"; // example tileset

// TILE DEFINITIONS
const tiles = {
  0: { name: "topLeftCorner", solid: false, x: 0, y: 6 },
  1: { name: "bottomLefteCorner", solid: false, x: 0, y: 7 },
  2: { name: "topLeftCorner", solid: true,  x: 1, y: 6 },
  3: { name: "bottomRightCorner", solid: true, x: 1, y: 7 },
  4: { name: "leftWall", solid: true, x: 2, y: 7 },
  5: { name: "floor", solid: false, x: 2, y: 4 },
  6: { name: "rightWall", solid: true, x: 2, y: 6 },
  7: { name: "topWall", solid: true, x: 1, y: 4 },
  8: { name: "bottomWall", solid: true, x: 0, y: 4 },
  9: { name: "window", solid: false, x: 3, y: 2 },
  10: { name: "wall", solid: false, x: 4, y: 2 },
  11: { name: "doorLeft", solid: false, x: 5, y: 2 },
  12: { name: "doorRight", solid: true, x: 6, y: 2 },
  13: { name: "topRoadLeft", solid: true, x: 5, y: 3 },
  14: { name: "topRoadRight", solid: true, x: 6, y: 3 },
  15: { name: "bottomRoadLeft", solid: true, x: 5, y: 4 },
  16: { name: "bottomRoadRight", solid: true, x: 6, y: 4 },


};

// LEVEL DATA
const levels = {
  level1: [
    [0,7,7,7,7,7,7,7,7,2],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [1,8,8,8,8,8,8,8,8,3],
    [10,10,10,10,11,12,10,10,10,10],
    [13,14,13,14,13,14,13,14,13,14],
    [15,16,15,16,15,16,15,16,15,16],
  ],

  level2: [
    [0,7,7,7,7,7,7,7,7,2],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,9,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [4,5,5,5,5,5,5,5,5,6],
    [1,8,8,8,8,8,8,8,8,3],
  ]
};

let currentMap = levels.level1;

// DRAWING FUNCTIONS

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

// GAME LOOP
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

// START GAME when TILESET LOADS
tileSheet.onload = () => {
  gameLoop();
  startCanvas();
};

