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

// TILESET IMAGE
// grabbing tileset image for backgroud tiles
const TILESETS = {
    airport: "/AirPort.png",
    cracks: "/decorative_cracks_walls.png",
    f1: "/Furniture1.png", 
    gate: "/Door_1.png"
};

const tileSheet = new Image();

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

    39:{ name:"redGate", solid:true, tileset:"gate", x:0, y:0 },
    40:{ name:"orangeGate", solid:true, tileset:"gate", x:1, y:0 },//some of these will become like a table gate or something.
    41:{ name:"yellowGate", solid:true, tileset:"gate", x:2, y:0 },
    42:{ name:"greenGate", solid:true, tileset:"gate", x:3, y:0 },
    43:{ name:"blueGate", solid:true, tileset:"gate", x:4, y:0 },
    44:{ name:"purpleGate", solid:true, tileset:"gate", x:5, y:0 },
    45:{ name:"brownGate", solid:true, tileset:"gate", x:0, y:0 }, // <<< only one in use, all other are temp
    46:{ name:"blackGate", solid:true, tileset:"gate", x:7, y:0 },
    47:{ name:"grayGate", solid:true, tileset:"gate", x:8, y:0 },
    48:{ name:"temp1Gate", solid:true, tileset:"gate", x:9, y:0 },
    49:{ name:"temp2Gate", solid:true, tileset:"gate", x:10, y:0 },
    50:{ name:"temp3Gate", solid:true, tileset:"gate", x:11, y:0 },
    51:{ name:"temp4Gate", solid:true, tileset:"gate", x:12, y:0 },
    52:{ name:"temp5Gate", solid:true, tileset:"gate", x:13, y:0 },
    53:{ name:"temp6Gate", solid:true, tileset:"gate", x:14, y:0 },
    54:{ name:"temp7Gate", solid:true, tileset:"gate", x:15, y:0 },

    

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
    level1: {
        map:    [
            [0,7,7,7,7,7,7,7,45,45,7,7,7,7,7,7,7,7,7,2],
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
        blocks: [
            { shape: "small_table", x: 8, y: 2, goals: [{x: 8, y: 1}] },
            { shape: "large_table", x: 7, y: 4, goals: [{x: 8, y: 1}] }
        ]
    },
    level2: {
        map:    [
            [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,45],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,45],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16],
        ],
        blocks: [
            { shape: "large_table_vert", x: 4, y: 2, goals: [{x: 8, y: 1}] },
            { shape: "brown_endtable", x: 2, y: 3, goals: [{x: 8, y: 1}] }
        ]
    }
};


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
    ]
};

class Block {
    constructor(shape, gridX, gridY, goals = []) {
        this.shape = shape;
        this.gridX = gridX;
        this.gridY = gridY;
        this.goals = goals; // Array of goal positions, e.g., [{x: 8, y: 1}, {x: 1, y: 1}] or just a single goal
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
let blocks = [];

function loadLevel(levelName) {
    const level = levels[levelName];

    currentMap = level.map;

    blocks = level.blocks.map(b =>
        new Block(SHAPES[b.shape], b.x, b.y, b.goals || [])
    );
}

let activeBlock = null;
let mouseOffset = { x: 0, y: 0 };
let currentMap;

function canPlaceBlock(block, testX, testY) {
    for (const t of block.getGridTiles(testX, testY)) {

        if ( // Check map boundaries and solid tiles
            t.x < 0 || t.y < 0 ||
            t.x >= MAP_WIDTH || t.y >= MAP_HEIGHT ||
            tiles[currentMap[t.y][t.x]]?.solid
        ) { 
            checkIfGate(block, testX, testY);
            return false;
        }

        for (const other of blocks) { // Check against other blocks
            if (other === block) continue;
            if (other.getGridTiles().some(o => o.x === t.x && o.y === t.y))
                return false;
        }
    }
    return true; 
}

function checkIfGate(block, testX, testY) {
    for (const t of block.getGridTiles(testX, testY)) {
        const tileId = currentMap[t.y]?.[t.x];
        //alert("Grid X: " + block.gridX + "\nGrid Y: " + block.gridY + "\nGoal X: " + block.goals[0].x + "\nGoal Y: " + block.goals[0].y + "\nIf you have a second goal enable the next alert\n to remove this alert make sure mouse is in the middle of the screen\n and keep pressing enter\nor fix the bug where the alert is triggered when you hit a wall, which is really bad ngl,\nbut this is just for testing so its fine for now");
        //^^Useful for Testing^^
        let reachedGoal = false;

        //check each possible goal for the block, if any of them are reached, then we can remove the block and end the level
        for (let i = 0; i < block.goals.length; i++) {
            const goal = block.goals[i];
            if (block.gridX === goal.x && block.gridY === goal.y) {
                reachedGoal = true;
                break;
            }
        }
        if (reachedGoal) {
            // TODO: exit animation (slide off screen)
            blocks = blocks.filter(b => b !== block); // b => b !== block, this means "keep all blocks that are not the current block", effectively removing the current block from the game
            return;
        }
    }
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

function drawActiveOutline(block) {
    if (!block.dragging) return;

    const tiles = block.getGridTiles();

    // Find bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const t of tiles) {
        if (t.x < minX) minX = t.x;
        if (t.y < minY) minY = t.y;
        if (t.x > maxX) maxX = t.x;
        if (t.y > maxY) maxY = t.y;
    }

    const width = (maxX - minX + 1) * TILE_SIZE;
    const height = (maxY - minY + 1) * TILE_SIZE;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 1;
    ctx.shadowColor = "red";
    ctx.shadowBlur = 8;
    ctx.strokeRect(
        minX * TILE_SIZE,
        minY * TILE_SIZE,
        width,
        height
    );
    ctx.restore();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    for (const block of blocks) 
        drawBlock(block);
    if (activeBlock) 
        drawActiveOutline(activeBlock);
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

    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;
});

canvas.addEventListener("mouseup", releaseBlock);
canvas.addEventListener("mouseleave", releaseBlock);

window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "GAME_SELECTED") return;
    if (!event.data.level) return;

    if (event.data.level) {
        //alert("Level selected: " + event.data.level);
        loadLevel(event.data.level);
    }
});



/* =========================
   LEVEL SWITCHING (DEMO)
========================= */
// window.addEventListener("keydown", e => {
//     if (e.key === "1") loadLevel("level1");
//     if (e.key === "2") loadLevel("level2");
// });

// inisialize the game with the first level

loadLevel("level1"); // this is needed to set the map, while the system waits for the message about level selected
//TODO: make level 1 or level 0 and tile/loading/unplayable but good looking level/screen

loadAllImages(() => {
    gameLoop();
});