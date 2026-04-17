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



const width = gameBoard.width;
const height = gameBoard.height;
const boardBackground = 'white';
const unitSize = 25;
ctx.imageSmoothingEnabled = false;

const poisonColor = 'purple';
const rockColor = 'dark grey'; //new

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let holeCD = 0; //new
let foodX;
let foodY;
let score = 0;
let snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 }
];

let snakeTail = snake[-1]; //new
const inputQ = [];
const maxQ = 2;


function randomCoord(min,max){ // random pos maker //new name
    const randPos = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randPos;
}  

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


function changeDirection(event){  // change this for direction only
    const key = event.key.toLowerCase();

    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) { // prevent scrolling
        event.preventDefault();
    }
    if (inputQ.length < maxQ) {
        inputQ.push(event.keyCode);
    }
  
};

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
// function tickHoleTimers() {
//     entities.forEach(ent => {
//         if (ent.type === 'hole' && ent.inUse) {
//             const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
//             if (!snakeInHole) {
//                 ent.inUse = false;
//                 return false; // go away entrance
//             }
//         };
//     }
// }

const mapTiles = { // new
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