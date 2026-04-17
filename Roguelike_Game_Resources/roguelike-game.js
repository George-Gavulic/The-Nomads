const sprites = {};

function loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function loadSprites() {
    sprites.apple = loadImage("./snake_graphics/apple.png");

    sprites.head_up = loadImage("./snake_graphics/head_up.png");
    sprites.head_down = loadImage("./snake_graphics/head_down.png");
    sprites.head_left = loadImage("./snake_graphics/head_left.png");
    sprites.head_right = loadImage("./snake_graphics/head_right.png");

    sprites.tail_up = loadImage("./snake_graphics/tail_up.png");
    sprites.tail_down = loadImage("./snake_graphics/tail_down.png");
    sprites.tail_left = loadImage("./snake_graphics/tail_left.png");
    sprites.tail_right = loadImage("./snake_graphics/tail_right.png");

    sprites.body_vertical = loadImage("./snake_graphics/body_vertical.png");
    sprites.body_horizontal = loadImage("./snake_graphics/body_horizontal.png");

    sprites.body_topleft = loadImage("./snake_graphics/body_topleft.png");
    sprites.body_topright = loadImage("./snake_graphics/body_topright.png");
    sprites.body_bottomleft = loadImage("./snake_graphics/body_bottomleft.png");
    sprites.body_bottomright = loadImage("./snake_graphics/body_bottomright.png");
}

loadSprites();

const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");


// const boardBackground = "white";

ctx.imageSmoothingEnabled = false;




const width = gameBoard.width;
const height = gameBoard.height;
const boardBackground = 'white';
const poisonColor = 'purple';
const rockColor = 'dark grey';
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let holeCD = 0;
let score = 0;
let snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 }
];
let snakeTail = snake[-1];
const inputQ = [];
const maxQ = 2;
let foodX;
let foodY;

canvas.style.width = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

const GAME_WIDTH = canvas.width  ;//* SCALE;
const GAME_HEIGHT = canvas.height ;//* SCALE;
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

            ctx.fillRect(x, y, unitSize, unitSize);
        }
    }
}

// function createFood() {
//     function randomFood(min, max) {
//         return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
//     }

//     foodX = randomFood(0, width - unitSize);
//     foodY = randomFood(0, height - unitSize);
// }
///////////////////////////////////////////////////////////////////
function randomCoord(min,max){ // random pos maker
    const randPos = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randPos;
}  

////////////////////////////////////////////////////////////////////////////////////
function moveSnake() { // moved stuff to move snake to limit snake direction change to change on tick
    if (inputQ.length > 0) {
        const keyPressed = inputQ.shift();
        const LEFT = 37 && 65;
        const UP = 38 && 87;
        const RIGHT = 39 && 68;
        const DOWN = 40 && 83;

        const goingUP = (yVelocity == -unitSize);
        const goingDOWN = (yVelocity == unitSize);
        const goingRIGHT = (xVelocity == unitSize);
        const goingLEFT = (xVelocity == -unitSize);

        switch(true){

            case(keyPressed == LEFT && !goingRIGHT):
                xVelocity = -unitSize;
                yVelocity = 0;
                break;
            case(keyPressed == RIGHT && !goingLEFT):
                xVelocity = unitSize;
                yVelocity = 0;
                break;
            case(keyPressed == UP && !goingDOWN):
                xVelocity = 0;
                yVelocity = -unitSize;
                break;
            case(keyPressed == DOWN && !goingUP):
                xVelocity = 0;
                yVelocity = unitSize;
                break;
        }
    } // head of snake, if hit check ent collision
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    const hitSomething = checkEntityCollision();
    if (!hitSomething) snake.pop();
}

// function moveSnake() {
//     const head = {
//         x: snake[0].x + xVelocity,
//         y: snake[0].y + yVelocity
//     };

//     snake.unshift(head);

//     if (head.x === foodX && head.y === foodY) {
//         score++;
//         scoreText.textContent = score;
//         createFood();
//     } else {
//         snake.pop();
//     }
// }
///////////////////////////////////////////////////////////////////////////////////////////
function changeDirection(event){  // change this for direction only
    const key = event.key.toLowerCase();

    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) { // prevent scrolling
        event.preventDefault();
    }
    if (inputQ.length < maxQ) {
        inputQ.push(event.keyCode);
    }
  
};

// function changeDirection(event) {
//     const key = event.key.toLowerCase(); 


//     if (["w", "a", "s", "d"].includes(key)) {
//         event.preventDefault();
//     }

//     const goingUp = yVelocity === -unitSize;
//     const goingDown = yVelocity === unitSize;
//     const goingLeft = xVelocity === -unitSize;
//     const goingRight = xVelocity === unitSize;

//     if (key === "a" && !goingRight) {
//         xVelocity = -unitSize;
//         yVelocity = 0;
//     } 
//     else if (key === "w" && !goingDown) {
//         xVelocity = 0;
//         yVelocity = -unitSize;
//     } 
//     else if (key === "d" && !goingLeft) {
//         xVelocity = unitSize;
//         yVelocity = 0;
//     } 
//     else if (key === "s" && !goingUp) {
//         xVelocity = 0;
//         yVelocity = unitSize;
//     }
// }
/////////////////////////////////////////////////////////////////////////////////////
function checkEntityCollision() { // where ent is, if snake head there hit ent, upd n score points in arr,
    const entLocInd = entities.findIndex(ent => ent.x === snake[0].x && ent.y === snake[0].y)
    if (entLocInd === -1) return false;
    // readability
    const hit = entities[entLocInd];
    score += hit.points;
    scoreText.textContent = `Score: ${score}`;
    // shrink
    if (hit.type === 'rock') {
        return running = false;
    }
    if (hit.shrink){
        snake.pop();
        snake.pop();
    }
    // respawn ent // replace with new one of same type
    if (hit.type === 'hole') {
        teleportSnake(hit);
        snake.pop();
    }
    if (hit.respawn){
        entities.splice(entLocInd, 1);
        spawnEntity(hit.type);
    } else if (!hit.respawn) {
        entities.splice(entLocInd, 1);
    }
        // double tap for more food
    if (hit.type === 'moreFood'){
        spawnEntity(hit.type)
    } 
    // grow snake
    return true;
}
//////////////////////////////////////////////////////////////////////
function teleportSnake(entrance) {
    // find a different hole entity to act as the exit
    if (holeCD > 0) return;
    if (entrance.inUse) return;
    const exitHole = entities.find(ent => ent.type === 'hole' && ent !== entrance && ent !== 'inUse');
    if (!exitHole || entrance.inUse) return;
    // move the snake head to the exit hole's position
    snake[0].x = exitHole.x;
    snake[0].y = exitHole.y;
    entrance.inUse = true;
     // only take out the entrance
    // spawnEntity('hole'); // replace hole so i don't run into myself when going through hole
    holeCD = 1;
}
// show the hole while snake goes through it
function tickHoleTimers() {
    entities.forEach(ent => {
        if (ent.type === 'hole' && ent.inUse) {
            const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
            if (!snakeInHole) {
                ent.inUse = false;
                return false; // go away entrance
            }
        };
    }
}

//class and context can be moved to character.js
class Character {
    constructor(gameWidth, gameHeight){
        this.width = 10;
        this.height = 10;

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
}

const mapTiles = {
    'R': 'rock',
    'F': 'food',
    'H': 'hole',
    'P': 'poison',
    'M': 'moreFood'
};

function spawnEntity(type) { // insert entity into arr and generate coord for ent
    let x, y;
    let attempts = 0;
    // while entity === another, do change coordinate, while loop safety
    do {
        x = randomCoord(0, width - unitSize);
        y = randomCoord(0, height - unitSize);
        attempts ++;
        if (attempts > 100) return; // so it doesn't run forever unlikely
    } while (
        entities.some(e => e.x === x && e.y === y) || 
        snake.some(s => s.x === x && s.y === y )
    );
    const ent = {
        type,
        x,
        y,
        ...entityTypes[type]    // spreads in color, points, etc
        };

    if (type === 'hole') {
        ent.inUse = null;
    }
    entities.push(ent);
}

const levels = [{
    level: 1,
    speed: 150,
    map: [            

        "RRRRRRRRRRRRRRRRRR",
        "R................R",
        "R..RR........RR..R",
        "R................R",
        "R....RRRRRR......R",
        "R................R",
        "R..RR........RR..R",
        "R................R",
        "RRRRRRRRRRRRRRRRRR",
        ],

        entities: [
            { type:  'food', qty: 1 },
            { type:  'hole', qty: 2 },
            { type:  'poison', qty: 2 },
        ],
        // winCon: {score, food eaten, poison eaten}
}
]


function drawSprite(img, x, y) {
    ctx.drawImage(img, x, y, unitSize, unitSize);
}

function getDirection(from, to) {
    if (to.x > from.x) return "right";
    if (to.x < from.x) return "left";
    if (to.y > from.y) return "down";
    if (to.y < from.y) return "up";
    return null;
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];

        if (i === 0) {
            const neck = snake[1];
            const dir = neck ? getDirection(neck, segment) : "right";
            drawSprite(sprites[`head_${dir}`], segment.x, segment.y);
        } else if (i === snake.length - 1) {
            const beforeTail = snake[i - 1];
            const dir = getDirection(beforeTail, segment);
            drawSprite(sprites[`tail_${dir}`], segment.x, segment.y);
        } else {
            const prev = snake[i - 1];
            const next = snake[i + 1];

            const dirToPrev = getDirection(segment, prev);
            const dirToNext = getDirection(segment, next);

            if (
                (dirToPrev === "left" && dirToNext === "right") ||
                (dirToPrev === "right" && dirToNext === "left")
            ) {
                drawSprite(sprites.body_horizontal, segment.x, segment.y);
            } else if (
                (dirToPrev === "up" && dirToNext === "down") ||
                (dirToPrev === "down" && dirToNext === "up")
            ) {
                drawSprite(sprites.body_vertical, segment.x, segment.y);
            } else if (
                (dirToPrev === "up" && dirToNext === "right") ||
                (dirToPrev === "right" && dirToNext === "up")
            ) {
                drawSprite(sprites.body_topright, segment.x, segment.y);
            } else if (
                (dirToPrev === "up" && dirToNext === "left") ||
                (dirToPrev === "left" && dirToNext === "up")
            ) {
                drawSprite(sprites.body_topleft, segment.x, segment.y);
            } else if (
                (dirToPrev === "down" && dirToNext === "right") ||
                (dirToPrev === "right" && dirToNext === "down")
            ) {
                drawSprite(sprites.body_bottomright, segment.x, segment.y);
            } else if (
                (dirToPrev === "down" && dirToNext === "left") ||
                (dirToPrev === "left" && dirToNext === "down")
            ) {
                drawSprite(sprites.body_bottomleft, segment.x, segment.y);
            }
        }
    }
}

// function drawFood() {
//     drawSprite(sprites.apple, foodX, foodY);
// }
// BUTTONS
document.getElementById("back-to-level-choice")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Level_Choice_Resources/level-choice.html",
        game: "Roguelike" },
      "*"
    );
  }
);

document.getElementById("back-to-game-choice")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Game_Choice_Resources/game-choice.html"},
      "*"
    );
  }
);

resetBtn.addEventListener("click", resetGame);
// loadLevel('level1');
// gameStart()

// /////////////////////////////////////////// MAKE LEVELS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let currentLevel = null;
const mapTiles = {
    'R' :  'rock',
    'F' :  'food',
    'P': 'poison',
    'H': 'hole',
    'M': 'moreFood',
};

function loadMap(level) {
    level.map.forEach((row, rowIndex) => {
        [...row].forEach((char, colIndex) => {
            if (mapTiles[char]) {
                entities.push({
                    type: mapTiles[char],
                    x: colIndex * unitSize,
                    y: rowIndex * unitSize,
                    ...entityTypes[mapTiles[char]]
                });
            }
        });
    });
}

function loadLevel(levelName) {
    const level = levels[levelName];
    if (!level) {
        console.log(`loadLevel error`);
        return;
    }
    if (level.map) loadMap(level);
    level.entities.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) spawnEntity(type);
    });
    // currentMap = level.map;
    // entities = level.entities;
    // puzzleComboTimer();
}


const levels = {
    
    level1: {
        // speed: 150, // could change speed who knows
        map: [
            "RRRRRRRRRRRRRRRRRRRR",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "RRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'food',    count: 1 },
            { type: 'poison',  count: 2 },
            { type: 'hole',    count: 2 },
        ]
        
    },

    level2: {
        map: [
            "RRRRRRRRRRRRRRRRRRRR",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "RRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'moreFood', count: 1},
            { type: 'poison', count: 50}
        ]
    },
        level3: {
        map: [
            "RRRRRRRRRRRRRRRRRRRR",
            "R..................R",
            "R.....RRRRRRRR.....R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R..................R",
            "R.....RRRRRRRR.....R",
            "R..................R",
            "RRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'moreFood', count: 1},
            { type: 'poison', count: 50}
        ]
    }
};

// window.addEventListener("message", (event) => {
//     if (!event.data || event.data.type !== "SWITCH_PAGE") return;
//     if (!event.data.level) return;

//     console.log("load level", event.data.level);
//     currentLevel = event.data.level; // using currentLevel to send the level completed to the leaderboard when this level is completed
//     gameStart();
// });

window.addEventListener("DOMContentLoaded", () => {
    const levelName = sessionStorage.getItem("selectedLevel");
    console.log("level from storage:", levelName);
    if (levelName) {
        currentLevel = levelName;
        gameStart();
    }
});

function gameStart() { // running = true, ent arr clear iterate food, poison
    running = true;
    entities = [];
    score = 0;
    holeCD = 0;
    snake = [
        { x: 100, y: 100 },
        { x: 75, y: 100 },
        { x: 50, y: 100 }
    ];
    scoreText.textContent = `Score: ${score}`;
   
    // spawnEntity('hole');
    // spawnEntity('hole');
    // spawnEntity('food');
    // spawnEntity('moreFood');
    // for (let i = 0; i < 2; i++) spawnEntity('poison');
    // spawnEntity('rock');
    xVelocity = unitSize;
    yVelocity = 0;
    loadLevel(currentLevel);
    drawSnake();
    nextTick();
}