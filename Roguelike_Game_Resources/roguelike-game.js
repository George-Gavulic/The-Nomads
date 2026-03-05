let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const SCALE = 3; //used to size up the canvas proportinal to the tile sizes
const TILE_SIZE = 16;
const MAP_WIDTH = 10; //used for tile maps, this is the number of tiles along the width
const MAP_HEIGHT = 8; //# of tiles in height


canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

canvas.style.width = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

const GAME_WIDTH = canvas.width  * SCALE;
const GAME_HEIGHT = canvas.height * SCALE;
//----------------------------------------------------------------------------------------------------
//Above this is the canvas and general declaration settup
//Here starts the section for the tile map
//----------------------------------------------------------------------------------------------------
// grabbing tileset image for backgroud tiles
const groundTileSheet = new Image();
const topTileSheet = new Image();
groundTileSheet.src = "/AirPort.png"; // example tileset
topTileSheet.src = "/AirPort.png"; // example tileset //TODO change this

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
    16: { name: "bottomRoadRight", solid: true, x: 6, y: 4 }
};

// LEVEL DATA
const groundLayers = {
    groundLevel1: [
        [0,7,7,7,7,7,7,7,7,2],
        [4,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,6],
        [1,8,8,8,8,8,8,8,8,3],
        [10,10,10,10,11,12,10,10,10,10],
        [13,14,13,14,13,14,13,14,13,14],
        [15,16,15,16,15,16,15,16,15,16],
    ],

    groundLevel2: [
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

const topLayers = {
    topLevel1: [
        [0,7,9,7,7,7,7,7,7,2],
        [4,5,9,5,5,5,5,5,5,6],
        [4,5,9,9,5,5,5,9,5,6],
        [4,5,5,5,5,5,5,5,5,6],
        [1,8,8,8,8,8,8,8,8,3],
        [10,10,10,10,11,12,10,10,10,10],
        [13,14,13,14,13,14,13,14,13,14],
        [15,16,15,16,15,16,15,16,15,16],
    ],

    topLevel2: [
        [0,7,7,9,9,9,9,9,7,2],
        [4,5,5,5,5,5,5,9,5,6],
        [4,5,5,5,5,5,5,9,5,6],
        [4,5,5,5,5,5,5,9,5,6],
        [4,5,5,5,9,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,6],
        [4,5,5,5,5,5,5,5,5,6],
        [1,8,8,8,8,8,8,8,8,3],
    ]
};

let currentGroundMap = groundLayers.groundLevel1;
let currentTopMap = topLayers.topLevel1;

// DRAWING FUNCTIONS

function drawTile(tileId, gridX, gridY) {
    const tile = tiles[tileId];
    if (!tile) return;

    ctx.drawImage( //this is the GROUND layer
        groundTileSheet,
        tile.x * TILE_SIZE,
        tile.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        gridX * TILE_SIZE,
        gridY * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
    ctx.drawImage( // this is the TOP layer
        topTileSheet,
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
    for (let y = 0; y < currentGroundMap.length; y++) { //this is the GROUND layer
        for (let x = 0; x < currentGroundMap[y].length; x++) {
            
            drawTile(currentGroundMap[y][x], x, y);
        }
    }
    for (let y = 0; y < currentTopMap.length; y++) { // this is the TOP layer
        for (let x = 0; x < currentTopMap[y].length; x++) {
        
            drawTile(currentTopMap[y][x], x, y);
        }
    }
}


//End of tile map
//----------------------------------------------------------------------------------------------------
//Above it the Tilemap
//Below this is the testing for player movement
//----------------------------------------------------------------------------------------------------

//class and context can be moved to input.js
class InputHandler {
    constructor(){
        //Key press
        document.addEventListener('keydown', (event) => {
            //alert(event.keyCode); //check for keypress and give alert in browser with keycode
            switch(event.keyCode){
                case 37: //37 is the keycode for left arrow key
                    character.moveLeft();
                    break;
                case 38: //38 is the keycode for up arrow key
                    character.moveUp();
                    break;
                case 39: //39 is the keycode for right arrow key
                    character.moveRight();
                    break;
                case 40: //40 is the keycode for down arrow key
                    character.moveDown();
                    break;
            }
        });
        //Key release
        document.addEventListener('keyup', (event) => {
            switch(event.keyCode){
                case 37: //37 is the keycode for left arrow key
                    if(character.xspeed < 0)
                        character.xstop();
                    break;
                case 38: //38 is the keycode for up arrow key
                    if(character.yspeed < 0)
                        character.ystop();
                    break;
                case 39: //39 is the keycode for right arrow key
                    if(character.xspeed > 0)
                        character.xstop();
                    break;
                case 40: //40 is the keycode for down arrow key
                    if(character.yspeed > 0)
                        character.ystop();
                    break;
            }
        });
    }
}

//class and context can be moved to character.js
class Character {
    constructor(gameWidth, gameHeight){
        this.width = 20;
        this.height = 20;

        this.maxSpeed = 7;
        this.xspeed = 0;
        this.yspeed = 0;

        this.position = {
            x: gameWidth / 2 - this.width / 2,
            y: gameHeight / 2  - this.height / 2
        };
    }
    moveLeft(){
        this.xspeed = -this.maxSpeed;
    }
    moveRight(){
        this.xspeed = this.maxSpeed;
    }
    moveUp(){
        this.yspeed = -this.maxSpeed;
    }
    moveDown(){
        this.yspeed = this.maxSpeed;
    }
    xstop(){
        this.xspeed = 0;
    }
    ystop(){
        this.yspeed = 0;
    }

    draw(ctx){
        ctx.fillStyle = '#0ff'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime){
        if(!deltaTime) return;

        this.position.x += this.xspeed;
        this.position.y += this.yspeed;

        //keeps square within bounds of canvas
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x + this.width > GAME_WIDTH) this.position.x = GAME_WIDTH - this.width;

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > GAME_HEIGHT) this.position.y = GAME_HEIGHT - this.height;

    }
}
let character = new Character(GAME_WIDTH, GAME_HEIGHT);
character.draw(ctx);
new InputHandler();
let lastTime = 0;
//moved the game loop to the bottom, it is also being used for the tile map
//----------------------------------------------------------------------------------------------------
//Above this was all of the testing for possible player movement 
//Below 
//----------------------------------------------------------------------------------------------------

//gameloop that updates every frame to redraw the canvas and player
function gameLoop(timestamp){
    //used for tilemap (drawing tiles first so that players are drawn over them)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    //----------------------------

    //used for player movement
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    //ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT);
    character.update(deltaTime);
    character.draw(ctx);
    

    requestAnimationFrame(gameLoop);
    //------------------------------
}

/* =========================
   LEVEL SWITCHING (DEMO)
========================= */
window.addEventListener("keydown", e => {
    if (e.key === "1") {
        currentGroundMap = groundLayers.groundLevel1;
        currentTopMap = topLayers.topLevel1;
    }
    if (e.key === "2") {
        currentGroundMap = groundLayers.groundLevel2;
        currentTopMap = topLayers.topLevel2;
    }
});
    
// START GAME when TILESET LOADS
groundTileSheet.onload = () => {
    //TODO only when both load
    gameLoop();
};