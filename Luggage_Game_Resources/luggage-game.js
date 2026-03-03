//BASIC CONFIG for TILEMAP
const TILE_SIZE = 16;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 10;
const SCALE = 3;

const canvas = document.getElementById("luggageGameScreen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;
canvas.style.width  = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

const TILESETS = {
    airport: "/AirPort.png",
    cracks: "/decorative_cracks_walls.png",
    f1: "/Furniture1.png"   
};

// TILESET IMAGE
// grabbing tileset image for backgroud tiles
const tileSheet = new Image();
// tileSheet.src = "/decorative_cracks_walls.png";
// tileSheet.src = "/AirPort.png"; // example tileset


// TILE DEFINITIONS
const tiles = {
    0: { name: "topLeftCorner", solid: false, tileset: "airport", x: 0, y: 6 },
    1: { name: "bottomLeftCorner", solid: false, tileset: "airport", x: 0, y: 7 },
    2: { name: "topRightCorner", solid: true,  tileset: "airport", x: 1, y: 6 },
    3: { name: "bottomRightCorner", solid: true, tileset: "airport", x: 1, y: 7 },
    4: { name: "leftWall", solid: false, tileset: "airport", x: 2, y: 7 },
    5: { name: "floor", solid: false, tileset: "airport", x: 2, y: 4 },
    6: { name: "rightWall", solid: true, tileset: "airport", x: 2, y: 6 },
    7: { name: "topWall", solid: true, tileset: "airport", x: 1, y: 4 },
    8: { name: "bottomWall", solid: true, tileset: "airport", x: 0, y: 4 },
    9: { name: "window", solid: false, tileset: "airport", x: 3, y: 2 },
    10:{ name: "wall", solid: false, tileset: "airport", x: 4, y: 2 },
    11:{ name: "doorLeft", solid: false, tileset: "airport", x: 5, y: 2 },
    12:{ name: "doorRight", solid: true, tileset: "airport", x: 6, y: 2 },
    13:{ name:"topRoadLeft", solid:true, tileset:"airport", x:5, y:3 },
    14:{ name:"topRoadRight", solid:true, tileset:"airport", x:6, y:3 },
    15:{ name:"bottomRoadLeft", solid:true, tileset:"airport", x:5, y:4 },
    16:{ name:"bottomRoadRight", solid:true, tileset:"airport", x:6, y:4 },

    17:{ name:"TopLeftTable", solid:true, tileset:"f1", x:0, y:0 },
    18:{ name:"TopRightTable", solid:true, tileset:"f1", x:1, y:0 },
    19:{ name:"BottomLeftTable", solid:true, tileset:"f1", x:0, y:1 },
    20:{ name:"BottomRightTable", solid:true, tileset:"f1", x:1, y:1 },

    21:{ name:"LTopLeftTable", solid:true, tileset:"f1", x:0, y:2 },
    22:{ name:"LTopMidTable", solid:true, tileset:"f1", x:1, y:2 },
    23:{ name:"LTopRightTable", solid:true, tileset:"f1", x:2, y:2 },
    24:{ name:"LBottomLeftTable", solid:true, tileset:"f1", x:0, y:3 },
    25:{ name:"LBottomMidTable", solid:true, tileset:"f1", x:1, y:3 },
    26:{ name:"LBottomRightTable", solid:true, tileset:"f1", x:2, y:3 },

    27:{ name:"LVTopLeftTable", solid:true, tileset:"f1", x:0, y:4 },
    28:{ name:"LVLeftMidTable", solid:true, tileset:"f1", x:0, y:5 },
    29:{ name:"LVTopRightTable", solid:true, tileset:"f1", x:0, y:6 },
    30:{ name:"LVBottomLeftTable", solid:true, tileset:"f1", x:1, y:4 },
    31:{ name:"LVLeftMidTable", solid:true, tileset:"f1", x:1, y:5 },
    32:{ name:"LVBottomRightTable", solid:true, tileset:"f1", x:1, y:6 },

    33:{ name:"B_TopLeftEndtable", solid:true, tileset:"f1", x:0, y:7 },
    34:{ name:"B_LeftMidEndtable", solid:true, tileset:"f1", x:0, y:8 },
    35:{ name:"B_TopRightEndtable", solid:true, tileset:"f1", x:0, y:9 },
    36:{ name:"B_BottomLeftEndtable", solid:true, tileset:"f1", x:1, y:7 },
    37:{ name:"B_RightMidEndtable", solid:true, tileset:"f1", x:1, y:8 },
    38:{ name:"B_BottomRightEndtable", solid:true, tileset:"f1", x:1, y:9 },
};

const imageCache = {};

function loadAllImages(callback) {
    const sources = Object.values(TILESETS);
    let loaded = 0;

    sources.forEach(src => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            loaded++;
            if (loaded === sources.length) {
                callback();
            }
        };

        imageCache[src] = img;
    });
}

// LEVEL DATA
const levels = {
    //lets try a 20 by 10 map for the demo, we can always add more levels later, but this is a good start for testing
    level1: [
        [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,3],
        [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
        [13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14],
        [15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16],
    ],
    level2: [
        [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
        [15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16],
    ]
};

let currentMap = levels.level1;

// DRAWING FUNCTIONS
function drawTile(tileId, gridX, gridY) {
    const tile = tiles[tileId];
    if (!tile) return;


    const img = imageCache[TILESETS[tile.tileset]];
    if (!img) return;

    ctx.drawImage(
        img,
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
        { x: 0, y: 0, tileId: 10 },
        { x: -1, y: 0, tileId: 10 },
        { x: 1, y: 0, tileId: 10 },
        { x: 0, y: -1, tileId: 10 }
    ],

    L: [
        { x: 0, y: 0, tileId: 11 },
        { x: 0, y: -1, tileId: 12 },
        { x: 0, y: -2, tileId: 13 },
        { x: 1, y: 0, tileId: 14 }
    ],
    small_table: [
        { x: 0, y: 0, tileId: 17 },
        { x: 1, y: 0, tileId: 18 },
        { x: 0, y: 1, tileId: 19 },
        { x: 1, y: 1, tileId: 20 }
    ],
    large_table: [
        { x: 0, y: 0, tileId: 21 },
        { x: 1, y: 0, tileId: 22 },
        { x: 2, y: 0, tileId: 23 },
        { x: 0, y: 1, tileId: 24 },
        { x: 1, y: 1, tileId: 25 },
        { x: 2, y: 1, tileId: 26 }
    ],
    large_table_vert: [
        { x: 0, y: 0, tileId: 27 },
        { x: 0, y: 1, tileId: 28 },
        { x: 0, y: 2, tileId: 29 },
        { x: 1, y: 0, tileId: 30 },
        { x: 1, y: 1, tileId: 31 },
        { x: 1, y: 2, tileId: 32 }
    ],
    brown_endtable: [
        { x: 0, y: 0, tileId: 33 },
        { x: 0, y: 1, tileId: 34 },
        { x: 0, y: 2, tileId: 35 },
        { x: 1, y: 0, tileId: 36 },
        { x: 1, y: 1, tileId: 37 },
        { x: 1, y: 2, tileId: 38 }
    ],

};

class Block {
    constructor(shape, gridX, gridY) {
        this.shape = shape;
        this.gridX = gridX;
        this.gridY = gridY;
        this.pixelX = gridX * TILE_SIZE;
        this.pixelY = gridY * TILE_SIZE;
        this.dragging = false;
        this.lastValidX = gridX;
        this.lastValidY = gridY;
    }

    getGridTiles(x = this.gridX, y = this.gridY) {
        return this.shape.map(p => ({
            x: x + p.x,
            y: y + p.y,
            tileId: p.tileId
        }));
    }
}

// ACTIVE BLOCKS IN THE LEVEL
const blocks = [
    //new Block(SHAPES.T, 4, 3),
    //new Block(SHAPES.L, 7, 4),
    new Block(SHAPES.small_table, 8, 2),
    new Block(SHAPES.large_table, 7, 4),
    new Block(SHAPES.large_table_vert, 4, 3),
    new Block(SHAPES.brown_endtable, 2, 3),
];

let activeBlock = null;
let mouseOffset = { x: 0, y: 0 };

function canPlaceBlock(block, testX, testY) {
    for (const t of block.getGridTiles(testX, testY)) {

        if ( // Check map boundaries and solid tiles
            t.x < 0 || t.y < 0 ||
            t.x >= MAP_WIDTH || t.y >= MAP_HEIGHT ||
            tiles[currentMap[t.y][t.x]]?.solid
        ) return false;

        for (const other of blocks) { // Check against other blocks
            if (other === block) continue;
            if (other.getGridTiles().some(o => o.x === t.x && o.y === t.y))
                return false;
        }
    }
    return true; 
}

function releaseBlock() {
    if (!activeBlock) return;

    activeBlock.gridX = activeBlock.lastValidX;
    activeBlock.gridY = activeBlock.lastValidY;
    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;

    activeBlock.dragging = false;
    activeBlock = null;
}

//start of game loop
function drawBlock(block) {
    for (const t of block.getGridTiles()) {
        drawTile(t.tileId, t.x, t.y);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    for (const block of blocks) drawBlock(block);
    requestAnimationFrame(gameLoop);
}

//mouse movement listeners
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    for (const block of blocks) {
        for (const t of block.getGridTiles()) {
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
    if (!activeBlock || !activeBlock.dragging) return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    const desiredGridX = Math.round((mx - mouseOffset.x) / TILE_SIZE);
    const desiredGridY = Math.round((my - mouseOffset.y) / TILE_SIZE);

    if (canPlaceBlock(activeBlock, desiredGridX, desiredGridY)) {
        activeBlock.gridX = desiredGridX;
        activeBlock.gridY = desiredGridY;
        activeBlock.lastValidX = desiredGridX;
        activeBlock.lastValidY = desiredGridY;
    }

    // Render position always derived from grid
    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;
});

canvas.addEventListener("mouseup", releaseBlock);
canvas.addEventListener("mouseleave", releaseBlock);

/* =========================
   LEVEL SWITCHING (DEMO)
========================= */
window.addEventListener("keydown", e => {
    if (e.key === "1") currentMap = levels.level1;
    if (e.key === "2") currentMap = levels.level2;
});

loadAllImages(() => {
    gameLoop();
});