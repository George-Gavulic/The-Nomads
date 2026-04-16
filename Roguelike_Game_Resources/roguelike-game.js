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
// const boardBackground = "white";
// const unitSize = 25;
ctx.imageSmoothingEnabled = false;
// let running = false;
// let xVelocity = unitSize;
// let yVelocity = 0;
let foodX;
let foodY;
// let score = 0;

// let snake = [
//     { x: 100, y: 100 },
//     { x: 75, y: 100 },
//     { x: 50, y: 100 }
// ];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

const boardBackground = 'white';
// const snakeColor = 'green';
// const snakeBorder = 'black';
// const foodColor = 'red';
const poisonColor = 'purple';
const rockColor = 'dark grey';
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
// let foodX;
// let foodY;
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

const entityTypes = { 
    food: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
    poison: { color: 'purple', points: -1, grow: false, shrink: true, respawn: true, sprite: null },
    rock: { color: 'grey', points: 0, grow: false, shrink: false, respawn: false, sprite: null },
    hole: { color: 'brown', points: 0, grow: false, shrink: false, respawn: true, sprite: null },
    moreFood: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
};

let entities = [];






//////////////////////////////////////////////////////////////////////////
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
    spawnEntity('hole');
    spawnEntity('hole');
    spawnEntity('food');
    spawnEntity('moreFood');
    for (let i = 0; i < 2; i++) spawnEntity('poison');
    spawnEntity('rock');
    xVelocity = unitSize;
    yVelocity = 0;
    drawSnake();
    nextTick();
}


// function gameStart() {
//     running = true;
//     score = 0;
//     scoreText.textContent = score;
//     xVelocity = unitSize;
//     yVelocity = 0;

//     snake = [
//         { x: 100, y: 100 },
//         { x: 75, y: 100 },
//         { x: 50, y: 100 }
//     ];

//     createFood();
//     clearBoard();
//     drawFood();
//     drawSnake();
//     nextTick();
// }
////////////////////////////////////////////////////////////////////////
function nextTick(){ // if running set speed and clear board, draw, move snake, fnx game over, call self. loops n display game over
    if (running){
        setTimeout(()=>{
            if (holeCD > 0)     holeCD--; // so no insta tele back
            tickHoleTimers();
            clearBoard();
            drawEntities();
            moveSnake();
            
            drawSnake();
            checkGameOver();
            nextTick();
        }, 150); //higher num = slower
    } else {
        displayGameOver();
    }
};

// function nextTick() {
//     if (running) {
//         setTimeout(() => {
//             clearBoard();
//             moveSnake();
//             checkGameOver();
//             drawFood();
//             drawSnake();

//             if (running) {
//                 nextTick();
//             } else {
//                 displayGameOver();
//             }
//         }, 100);
//     }
// }

function clearBoard() {
    for (let y = 0; y < height; y += unitSize) {
        for (let x = 0; x < width; x += unitSize) {

            // alternating grass colors
            if ((x / unitSize + y / unitSize) % 2 === 0) {
                ctx.fillStyle = "#7ccf5c"; // light grass
            } else {
                ctx.fillStyle = "#6bb84f"; // darker grass
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

    if (key === "a" && !goingRight) {
        xVelocity = -unitSize;
        yVelocity = 0;
    } 
    else if (key === "w" && !goingDown) {
        xVelocity = 0;
        yVelocity = -unitSize;
    } 
    else if (key === "d" && !goingLeft) {
        xVelocity = unitSize;
        yVelocity = 0;
    } 
    else if (key === "s" && !goingUp) {
        xVelocity = 0;
        yVelocity = unitSize;
    }
}

function checkGameOver() {
    const head = snake[0];

    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
        running = false;
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            running = false;
            return;
        }
    }
}

function displayGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", width / 2, height / 2);
}
///////////////////////////////////////////////////////////////////////////////////////////////
function resetGame(){ // make everything 0, start by going right, snake body arr, gamestart()
    running = false;
    score = 0;
    inputQ.length = 0; // to remove any prior input
    xVelocity = 0;/// changed to prevent movement at start w/o input
    yVelocity = 0;
    // snake = [ // the starting body of the snake
    // {x:unitSize * 4, y:0},
    // {x:unitSize * 3, y:0},
    // {x:unitSize * 2, y:0},
    // {x:unitSize, y:0},
    // {x:0, y:0}
    // ];
    gameStart();
};

// function resetGame() {
//     running = false;
//     gameStart();
// }

////////////////////////////////////////////////////////////////////////////////
function spawnEntity(type) { // insert enti into arr and generate coord for ent
    const ent = {
        type,
        x: randomCoord(0, width - unitSize),
        y: randomCoord(0, height - unitSize),
        ...entityTypes[type]    // spreads in color, points, etc
    };
    if (type === 'hole') {
        ent.inUse = null;
        ent.dead = false;
        ent.deadCD = snake.length * 10; // ticks it stays visible after
    }


    entities.push(ent);
}

function drawEntities() { // for each ent draw on screen
    entities.forEach(ent => {
        if (ent.sprite && sprites[ent.sprite]){
            drawSprite(sprites[ent.sprite], ent.x, ent.y);
        } else if (ent.type === 'hole') {
            ctx.fillStyle = ent.dead ? 'grey' : 'brown';
            ctx.fillRect(ent.x, ent.y, unitSize, unitSize); 
        }else {
            ctx.fillStyle = ent.color;
            ctx.fillRect(ent.x, ent.y, unitSize, unitSize);
        }

    });
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

gameStart()