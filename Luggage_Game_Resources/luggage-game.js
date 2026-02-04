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
ctx.imageSmoothingEnabled = false;

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
    4: { name: "leftWall", solid: false, x: 2, y: 7 },
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

// OBSTICAL DEFINITIONS for the luggage the player can move
const SHAPES = {
    T: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 }
    ],

    L: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: -2 },
        { x: 1, y: 0 }
    ]
};

class Block {
    constructor(shape, gridX, gridY, tileId = 5) {
        this.shape = shape;

        // grid position (authoritative)
        this.gridX = gridX;
        this.gridY = gridY;

        // pixel position (used while dragging)
        this.pixelX = gridX * TILE_SIZE;
        this.pixelY = gridY * TILE_SIZE;

        this.tileId = tileId;
        this.dragging = false;

        // rollback safety
        this.lastValidX = gridX;
        this.lastValidY = gridY;
    }

    getGridTiles(x = this.gridX, y = this.gridY) {
        return this.shape.map(p => ({
            x: x + p.x,
            y: y + p.y
        }));
    }

    getPixelTiles() {
        return this.shape.map(p => ({
            x: this.pixelX + p.x * TILE_SIZE,
            y: this.pixelY + p.y * TILE_SIZE
        }));
    }
}

// ACTIVE BLOCKS IN THE LEVEL
const blocks = [
    new Block(SHAPES.T, 4, 3, 9),
    new Block(SHAPES.L, 7, 4, 9)
];

let activeBlock = null;
let mouseOffset = { x: 0, y: 0 };


function drawBlock(block) {
    if (block.dragging) {
        // pixel-space drawing while dragging
        for (const p of block.getPixelTiles()) {
        ctx.drawImage(
            tileSheet,
            tiles[block.tileId].x * TILE_SIZE,
            tiles[block.tileId].y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            p.x,
            p.y,
            TILE_SIZE,
            TILE_SIZE
        );
        }
    } else {
        // grid-space drawing when placed
        for (const t of block.getGridTiles()) {
        drawTile(block.tileId, t.x, t.y);
        }
    }
}


function screenToGrid(mouseX, mouseY) {
    const rect = canvas.getBoundingClientRect();

    const canvasX = (mouseX - rect.left) / SCALE;
    const canvasY = (mouseY - rect.top) / SCALE;

    return {
        x: Math.floor(canvasX / TILE_SIZE),
        y: Math.floor(canvasY / TILE_SIZE)
    };
}

function isBlockUnderMouse(block, gx, gy) {
  return block.getTiles().some(t => t.x === gx && t.y === gy);
}

function canPlaceBlock(block, testX, testY) {
  // check map collision
  for (const t of block.getGridTiles(testX, testY)) {
    if (
      t.x < 0 || t.y < 0 ||
      t.y >= MAP_HEIGHT || t.x >= MAP_WIDTH ||
      tiles[currentMap[t.y][t.x]]?.solid
    ) {
      return false;
    }

    // check other blocks
    for (const other of blocks) {
      if (other === block) continue;
      if (
        other.getGridTiles().some(o => o.x === t.x && o.y === t.y)
      ) {
        return false;
      }
    }
  }
  return true;
}

function releaseBlock() {
    if (!activeBlock) return;

    const snapX = Math.round(activeBlock.pixelX / TILE_SIZE);
    const snapY = Math.round(activeBlock.pixelY / TILE_SIZE);

    if (canPlaceBlock(activeBlock, snapX, snapY)) {
        activeBlock.gridX = snapX;
        activeBlock.gridY = snapY;
        activeBlock.lastValidX = snapX;
        activeBlock.lastValidY = snapY;
    } else {
        activeBlock.gridX = activeBlock.lastValidX;
        activeBlock.gridY = activeBlock.lastValidY;
    }

    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;

    activeBlock.dragging = false;
    activeBlock = null;
}


// GAME LOOP
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    for (const block of blocks) {
        drawBlock(block);
    }
    requestAnimationFrame(gameLoop);
}

/* =========================
   LEVEL SWITCHING (DEMO)
========================= */
window.addEventListener("keydown", e => {
    if (e.key === "1") currentMap = levels.level1;
    if (e.key === "2") currentMap = levels.level2;
});


//listeners for MOUSE INTERACTIONS (picking up and dragging blocks)
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    for (const block of blocks) {
        const tiles = block.getGridTiles();
        for (const t of tiles) {
            if (
                mx >= t.x * TILE_SIZE &&
                mx < (t.x + 1) * TILE_SIZE &&
                my >= t.y * TILE_SIZE &&
                my < (t.y + 1) * TILE_SIZE
            ) {
                activeBlock = block;
                block.dragging = true;

                mouseOffset.x = mx - block.pixelX;
                mouseOffset.y = my - block.pixelY;
                return;
            }
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!activeBlock) return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    activeBlock.pixelX = mx - mouseOffset.x;
    activeBlock.pixelY = my - mouseOffset.y;
});


// canvas.addEventListener("mouseup", () => {
//   if (activeBlock) {
//     activeBlock.dragging = false;
//     activeBlock = null;
//   }
// });

// canvas.addEventListener("mouseleave", () => {
//   if (activeBlock) {
//     activeBlock.dragging = false;
//     activeBlock = null;
//   }
// });

canvas.addEventListener("mouseup", releaseBlock);
canvas.addEventListener("mouseleave", releaseBlock);








// START GAME when TILESET LOADS
tileSheet.onload = () => {
  gameLoop();
  startCanvas();
};

