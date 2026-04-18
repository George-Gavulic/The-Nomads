const sprites = {}; // Sprites for the snake game

function loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function loadSprites() {
    sprites.apple = loadImage("Snake_graphics/apple.png"); // food sprite

    sprites.hole = loadImage("Snake_graphics/hole_5.png");

    sprites.head_up = loadImage("Snake_graphics/head_up.png"); // sprites for the snake head
    sprites.head_down = loadImage("Snake_graphics/head_down.png");
    sprites.head_left = loadImage("Snake_graphics/head_left.png");
    sprites.head_right = loadImage("Snake_graphics/head_right.png");

    sprites.tail_up = loadImage("Snake_graphics/tail_up.png"); // tail for the snake
    sprites.tail_down = loadImage("Snake_graphics/tail_down.png");
    sprites.tail_left = loadImage("Snake_graphics/tail_left.png");
    sprites.tail_right = loadImage("Snake_graphics/tail_right.png");

    sprites.body_vertical = loadImage("Snake_graphics/body_vertical.png"); // horizontal and vertical sprites for the snake
    sprites.body_horizontal = loadImage("Snake_graphics/body_horizontal.png");

    sprites.body_topleft = loadImage("Snake_graphics/body_topleft.png");
    sprites.body_topright = loadImage("Snake_graphics/body_topright.png");
    sprites.body_bottomleft = loadImage("Snake_graphics/body_bottomleft.png");
    sprites.body_bottomright = loadImage("Snake_graphics/body_bottomright.png");
}

loadSprites();

const gameBoard = document.querySelector("#gameBoard");
const ctx =  gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

ctx.imageSmoothingEnabled = false;

const width = gameBoard.width;
const height = gameBoard.height;
const boardBackground = 'white';

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
let snakeTail = snake[-1]
const inputQ = [];
const maxQ = 2;

const entityTypes = { 
    food: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
    poison: { color: 'purple', points: 0, grow: false, shrink: true, respawn: true, sprite: null },
    rock: { color: 'darkgrey', points: 0, grow: false, shrink: false, respawn: false, sprite: null },
    hole: { color: 'brown', points: 0, grow: false, shrink: false, respawn: true, sprite: 'hole' },
    moreFood: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
};

let entities = [];
window.addEventListener("keydown", changeDirection);


////////////////////////////////////////////////////////////////////////
function nextTick(){ // if running set speed and clear board, draw, move snake, fnx game over, call self. loops n display game over
    if (running){
        setTimeout(()=>{
            if (holeCD > 0)     holeCD--; // so no insta tele back
            // tickHoleTimers();
            clearBoard();
            moveSnake();
            snakeHoleCheck();
            drawEntities();       
            
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100); //higher num = slower
    } else {
        displayGameOver();
    }
};


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

///////////////////////////////////////////////////////////////////
function randomCoord(min,max){ // random pos maker
    const randPos = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randPos;
}


function changeDirection(event){  // change this for direction only
    const key = event.key.toLowerCase();

    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) { // prevent scrolling
        event.preventDefault();
    }
    if (inputQ.length < maxQ) {
        inputQ.pop();
        inputQ.unshift(event.keyCode);
    } 
}

function checkGameOver(){ // game overs, make more like stone
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= width): //gameover rightborder
            running = false;
            break;
        case (snake[0].y >= height): //gameover bottom border
            running = false;
            break;
        case (snake[0].y < 0): //gameover top border
            running = false;
            break;
    }

    if(snake.length === 1)
        running = false;
    for(let i = 1; i < snake.length; i++) { // for each body part (snake.length)
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) // if snake[0/head] would[i+=1]^ = snake body part spot game over
            running = false;
    }
};

function displayGameOver(){ // lol font, and message
    ctx.font = "50px Ariel";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", width / 2, height / 2);
};

function resetGame(){ // make everything 0, start by going right, snake body arr, gamestart()
    score = 0;
    inputQ.length = 0; // to remove any prior input
    xVelocity = unitSize;
    yVelocity = 0;
    running = false;
    snake = [
        { x: 100, y: 100 },
        { x: 75, y: 100 },
        { x: 50, y: 100 }
    ];
    gameStart();
};
// all the things in one place

function drawEntities() { // for each ent draw on screen
    entities.forEach(ent => {
        // if (ent.sprite) { drawSprite(sprites[ent.sprite], ent.x, ent.y); //play time
        if (ent.sprite === 'apple') { 
            drawSprite(sprites.apple, ent.x, ent.y);
        } else if (ent.sprite === 'hole'){
            drawSprite(sprites.hole, ent.x, ent.y);
        } else {
            ctx.fillStyle = ent.color;
            ctx.fillRect(ent.x, ent.y, unitSize, unitSize);
        }
    });
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
    if (hit.type === 'hole') {
        teleportSnake(hit);
        spawnEntity('hole');

        snake.pop();
    }
    if (hit.type === 'moreFood'){
        spawnEntity(hit.type);
    }  
    if (hit.respawn && hit.type !== 'hole'){
        spawnEntity(hit.type);
        entities.splice(entLocInd, 1);
    }
    if (!hit.respawn && hit.type !== 'hole') {
        entities.splice(entLocInd, 1);
    }

    // if (snake[-1].x === 'hole' && snake[-1].y === 'hole') {
    //     entities.splice(entLocInd, 1); }
    // grow snake
    return true;
}
//////////////////////////////////////////////////////////////////////
function teleportSnake(entrance) {
    const exitHole = entities.find(ent => ent.type === 'hole' && ent !== ent.inUse  );
    if (entrance.cd > 0) return;
    if (!exitHole) return;
    /// coordinates
    exitHole !== entrance;
    // const enterX = entrance.x;
    // const enterY = entrance.y;
    snake[0].x = exitHole.x;
    snake[0].y = exitHole.y;
    //// cooldowns
    entrance.cd = snake.length;
    exitHole.cd = snake.length;
    entrance.inUse = true;
    exitHole.inUse = true;
    spawnEntity('hole');
}

// function snakeHoleCheck () {
//     entities.forEach((ent, index) => {
//         // don't bother with non holes
//         if (ent.type !== 'hole') return;
//         // countdown CD
//         if (ent.cd > 0) { 
//             ent.cd--;
//         }
//         // when CD reaches 0
//         if (ent.cd <= 0 && ent.inUse) {
//             const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
//             if (!snakeInHole) {
//                 entities.splice(index, 1);
//                 ent.inUse = !ent.inUse;
//             }
//         }
// })
// }

// function teleportSnake(entrance) {

    
//     const exitHole = entities.find(ent => ent.type === 'hole' && ent !== ent.inUse  );//&& ent !== 'inUse'
//     // find a different hole entity to act as the exit
//     if (holeCD > 0) return;
//     if (entrance.inUse) return;
//     if (!exitHole && entrance.inUse) return;
//     // move the snake head to the exit hole's position
//     snake[0].x = exitHole.x;
//     snake[0].y = exitHole.y;
//     holeCD = 2;
//     entrance.inUse = true;
//     // setTimeout( ()=> {
//     //     exitHole.inUse = true;
//     // },holeCD);
    
//     // if (entrance.inUse === false) then take it out, place in check entity collision under respawn
//     // only take out the entrance
//     // spawnEntity('hole'); // replace hole so i don't run into myself when going through hole
    
// }
// show the hole while snake goes through it

// function snakeHoleCheck() {
//     entities.forEach((ent, index) => {
//         if (ent.type === 'hole' && ent.inUse) {
//             const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
//         } 
//         if (ent.type === 'hole' && !snakeInHole){
//             // ent.inUse = !ent.inUse
//             ent.splice(index, 1)
//         }

//         if (ent.type === 'hole' && ent.inUse !== null && !ent.inUse )
            
//         //////////////////////////////
//         if (ent === exitHole && snake[snake.length-1].x === exitHole.x && snake[snake.length-1].y === exitHole)
//             if (snake[snake.length -1].x === ent.x && snake[snake.length -1].y === ent.y) {             
//     }
//     );
    
// }



////////////////////////////////////////////////////////////////////////////////
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
        type,  x,  y,  ...entityTypes[type]    // spreads in color, points, etc
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

