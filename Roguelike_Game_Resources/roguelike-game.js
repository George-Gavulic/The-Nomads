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

ctx.imageSmoothingEnabled = true;

const width = gameBoard.width;
const height = gameBoard.height;
const boardBackground = 'white';

let unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let holeCD = 0;
let score = 0;
let snake = [
    { x: 100, y: 50 },
    { x: 100 - unitSize, y: 50 },
    { x: 100 - unitSize*2, y: 50 }
    ];
let snakeTail = snake[-1]
const inputQ = [];
const maxQ = 2;
let gameSpeed = 150;

const entityTypes = { 
    food: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
    poison: { color: 'purple', points: 0, grow: false, shrink: true, respawn: true, sprite: null },
    rock: { color: 'darkgrey', points: 0, grow: false, shrink: false, respawn: false, sprite: null },
    hole: { color: 'brown', points: 0, grow: false, shrink: false, respawn: true, sprite: 'hole' },
    moreFood: { color: 'red', points: +1, grow: true, shrink: false, respawn: true, sprite: 'apple'},
    statHole: { color: 'brown', points: 0, grow: false, shrink: false, respawn: false, sprite: 'hole' },
    // water: { color: 'skyblue', points: 0, grow: false, shrink: false, respawn: true, sprite: null, special: 1.3},
};

let entities = [];
window.addEventListener("keydown", changeDirection);


////////////////////////////////////////////////////////////////////////
function nextTick(){ // if running set speed and clear board, draw, move snake, fnx game over, call self. loops n display game over
    if (running){
        setTimeout(()=>{
            if (holeCD > 0)     holeCD--; // so no insta tele back

            clearBoard();
            moveSnake();
            snakeHoleCheck();
            drawEntities();       
            drawSnake();
            checkGameOver();
            nextTick();
        }, gameSpeed); //higher num = slower

    } else {
        displayGameOver();
    }
};


function resizeCanvas() {
    const canvas = document.getElementById("gameBoard");
    const parent = canvas.parentElement;
    
    // Get the space we are allowed to fill
    const availableWidth = parent ? parent.clientWidth : window.innerWidth;
    
    // Calculate the scale multiplier based on the internal width (600)
    // We multiply by 0.95 to leave a tiny 5% margin so it doesn't touch the exact edges
    const scale = (availableWidth * 0.95) / canvas.width;

    // Apply the scale purely to the CSS visuals
    canvas.style.width  = (canvas.width * scale) + "px";
    canvas.style.height = (canvas.height * scale) + "px";
}

// Run it when the page loads, and whenever the window/iframe resizes
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', resizeCanvas);


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
        { x: 100, y: 50 },
        { x: 100 - unitSize, y: 50 },
        { x: 100 - unitSize*2, y: 50 }
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
    if (hit.type === 'statHole'){
        stationaryHole(hit);
        snake.pop();
    }
    if (hit.type === 'moreFood'){
        spawnEntity(hit.type);
    }  
    if (hit.respawn && hit.type !== 'hole'){
        spawnEntity(hit.type);
        entities.splice(entLocInd, 1);
    }
    if (!hit.respawn && hit.type !== 'hole' && hit.type !== 'statHole') {
        entities.splice(entLocInd, 1);
    }
    // grow snake
    return true;
}
//////////////////////////////////////////////////////////////////////
function stationaryHole(entrance) {
    const exitHole = entities.find(ent => ent.type === 'statHole' && ent !== entrance  );
    if (entrance.cd > 0) return;
    if (!exitHole) return;
    snake[0].x = exitHole.x;
    snake[0].y = exitHole.y;

}

function teleportSnake(entrance) {
    const exitHole = entities.find(ent => ent.type === 'hole' && ent !== entrance  );
    if (entrance.cd > 0) return;
    if (!exitHole) return;
    /// coordinates
    exitHole !== entrance;

    snake[0].x = exitHole.x;
    snake[0].y = exitHole.y;
    //// cooldowns
    entrance.cd = snake.length;
    exitHole.cd = snake.length;
    entrance.inUse = true;
    exitHole.inUse = true; // if only want one hole gone and one spawn
    spawnEntity('hole');   // comment these lines out or the entrance.inUse
}

function snakeHoleCheck () {
    entities.forEach((ent, index) => {
        // don't bother with non holes
        if (ent.type !== 'hole' || ent.type !== 'statHole') return;
        // countdown CD
        if (ent.cd > 0) { 
            ent.cd--;
        }
        // when CD reaches 0
        if (ent.cd <= 0 && ent.inUse) {
            const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
            if (!snakeInHole) {
                entities.splice(index, 1);
                ent.inUse = !ent.inUse;
            }
        }
})
}



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
// document.getElementById("back-to-level-choice")
//   .addEventListener("click", () => {
//     window.parent.postMessage(
//       { type: "SWITCH_PAGE", 
//         page: "Level_Choice_Resources/level-choice.html",
//         game: "Roguelike" },
//       "*"
//     );
//   }
// );

// document.getElementById("back-to-game-choice")
//   .addEventListener("click", () => {
//     window.parent.postMessage(
//       { type: "SWITCH_PAGE", 
//         page: "Game_Choice_Resources/game-choice.html"},
//       "*"
//     );
//   }
// );

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
    'S': 'statHole',
};

const levels = {    // MAP SIZES small: med: 36w x 17h
    
    level1: {
        speed: 150, // could change speed who knows
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "........................",
            "........................",
            "........................",
            "..........RRRR..........",
            "..........RRRR..........",
            "..........RRRR..........",
            "..........RRRR..........",
            "..........RRRR..........",
            "..........RRRR..........",
            "........................",
            "........................",
            "........................",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'food',    count: 5 },
        ]
        
    },

    level2: {
        map: [
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
        ],
        entities: [
            { type: 'food', count: 1},
        ]
    },
    level3: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R......................R",
            "R...........RRRRRRRR...R",
            "R......................R",
            "RRR....................R",
            "R.....RRR...........R..R",
            "R.....R.....RRR.....R..R",
            "R.....R......RRR....R..R",
            "R...RRR.............R..R",
            "R......................R",
            "R.......RRRRRRRR.......R",
            "R..............R.......R",
            "R..............R.......R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'food', count: 5},
        ]
    },
    level4: {
        map: [
            "........................",
            "........................",
            "..RR..RRRRR..RRRRR..RR..",
            "..RR..RR........RR..RR..",
            "..RR..RR........RR..RR..",
            "..RR..RR........RR..RR..",
            "..RR......RRRR......RR..",
            "..RR......RRRR......RR..",
            "..RR..RR........RR..RR..",
            "..RR..RR........RR..RR..",
            "..RR..RR........RR..RR..",
            "..RR..RRRRR..RRRRR..RR..",
            "........................",
            "........................",
        ],
        entities: [
            { type: 'food', count: 1},
            { type: 'poison', count: 5}
        ]
    },
    level5: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R..R...................R",
            "R..R...RRRRRRRRR.......R",
            "R..RR......R........R..R",
            "R..R.......R........R..R",
            "R......RR..R........R..R",
            "R.....R....R.R......R..R",
            "RRRRRRR....R.R.........R",
            "R..........R...........R",
            "R..........R...........R",
            "R..RRRRRRRRRRRRR.......R",
            "R..............R.......R",
            "R.............SRS......R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: 'food', count: 2},
        ]
    },
    level6: {
        map: [      // 60w x 35h
            "............................................................",
            "R...........................................................",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R..........................",
            "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR........................",
            "R..R.................R..R..R..R..R..........................",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R..R.................R..R..R..R..R.................R..R..R..",
            "R...........................................................",
            "R..........................................................."
        ],
        entities: [
            { type: 'moreFood', count: 3},
        ]
    },
    level7: {
        map: [
            "........................",
            ".RRRRRRRRRRRR...........",
            ".R.........RR...........",
            ".R.........RR...........",
            ".R.........RR...........",
            ".R.........RR...........",
            ".RRRRRRRR..RR...........",
            "...........RR..RRRRRRRR.",
            "...........RR.........R.",
            "...........RR.........R.",
            "...........RR.........R.",
            "...........RR.........R.",
            "...........RRRRRRRRRRRR.",
            "........................",
        ],
        entities: [
            { type: 'food', count: 5},
        ]
    },
    level8: {
        map: [
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
        ],
        entities: [
            { type: 'food', count: 3},
            { type: 'hole', count: 2},
        ]
    },
    level9: {
        map: [
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
            "........................",
        ],
        entities: [
            { type: 'food', count: 3},
            { type: 'poison', count: 1},
        ]
    },
    level10: { 
        map: [  // SPIRAL 20 X 14
            "........................",
            "...RRRRRRRRRRRRRRRRRRR..",
            "R....................R..",
            "R..R..RRRRRRRRRRRRR..R..",
            "R..R..R..............R..",
            "...R..R..RRRRRRR..R..R..",
            "...R..R..RS.......R..R..",
            "...R..R.......SR..R..R..",
            "...R..R..RRRRRRR..R..R..",
            "R..R..............R..R..",
            "R..R..RRRRRRRRRRRRR..R..",
            "R..R....................",
            "...RRRRRRRRRRRRRRRRRRR..",
            "........................",
        ],
        entities: [
            { type: 'food', count: 4},
            { type: 'poison', count: 1},
        ]
    },
    level11: {
        map: [
            "........................",
            "........................",
            "........................",
            ".....P............P.....",
            ".....P..PPPPPPPP..P.....",
            "......PPPP....PPPP......",
            "....PP.PP......PP.PP....",
            "....P..PP......PP..P....",
            "...P....P......P....P...",
            "...PP......PP......PP...",
            ".....PPPP..PP..PPPP.....",
            "...........PP...........",
            "..........P..P..........",
            "..........P..P..........",
            
        ],
        entities: [
            { type: 'moreFood', count: 2 },
            { type: 'poison', count: 0 },
        ]
    },
    level12: {
        map: [      // 60w x 35h
            "RRRR..................RRRR..................................",
            "RRRR..................RRRR..................................",
            "RRRR..................RRRR..................................",
            "RRRR..................RRRR......RRRR........................",
            "....................RRRR.....RR.....................RRRR....",
            "....................RRRR....RRRR....................RRRR....",
            "....................RRRR....RRRR....................RRRR....",
            "....................RRRR...RRRRRR...RR..............RRRR....",
            "..........................RRRRRRRR..RR......................",
            "..........................RRR..RRR..RR......................",
            "..........................RR....RR..RR......RRRR............",
            "..........................R......R..........RRRR............",
            "....................RR.......RR.......RR....RRRR............",
            "..RRR...RRRR.........RR......RR......RR.....RRRR........RRRR",
            ".RRRR...RRRR.........RRR....RPPR....RRR.................RRRR",
            ".RRRR...RRRR.........RRR...RRPPRR...RRR.................RRRR",
            ".RRR....RRRR........RRRR...RPPPPR...RRRR................RRRR",
            ".RRR....RRRR.......RRRRR...RPPPPR...RRRRR...................",
            "..R.....RRRR.....RRRRRR....RPPPPR....RRRRRR.....RRRR........",
            "..R.....RRRR....RRRRRR.....RPPPPR.....RRRRRR....RRRR........",
            ".RRR....RRRR....RRRRRR.....RRPPRR.....RRRRRR....RRRR........",
            ".RRR.............RRRRRR.....RPPR.....RRRRRR.....RRRR........",
            ".RRRR..............RRRRR.....RR.....RRRR....................",
            ".RRRR.......RRRR....RRRR.....RR.....RRR.....................",
            "..RRR.......RRRR.....RR...R......R...RR.....................",
            "............RRRR....RR....RR....RR....RR....................",
            "............RRRR..........RRR..RRR..........................",
            "....RR....................RRRRRRRR....................RR....",
            "....RRR....................RRRRRR....................RRR....",
            ".....RRR..RR................RRRR................RR..RRR.....",
            "......RR..RRR...............RRRR...............RRR..RR......",
            "..........RRRR..RRR...RRR....RR....RRR...RRR..RRRR..........",
            "...........RRR..RRRR..RRRR........RRRR..RRRR..RRR...........",
            "................RRRR..RRRR...RR...RRRR..RRRR................",
            "................RRRR..RRRR..RRRR..RRRR..RRRR................"
        ],
        entities: [
            { type: 'moreFood', count: 1 },
            { type: 'food', count: 4 },
        ]
    },
    level13: {
        map: [      // 60w x 35h maze
            "SR..........................................................",      // 60w x 35h Fishbone
            ".R..........................................................",
            ".R..........................................................",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            ".R........................................................R.",
            "..........................................................R.",
            "..........................................................R.",
            "..........................................................RS",
        ],
        entities: [
            { type: 'food', count: 2 },
            { type: 'poison', count: 1 },
            { type: 'hole', count: 2}
        ]
    },
    level4: {
        map: [      // 60w x 35h high game speed
            ".......R....................................................",      // 60w x 35h Fishbone
            ".......R....................................................",
            ".......R................RRR.RRR.............................",
            ".......R...............RRFFFFFRR............................",
            "....RRRR................RFFFFFR.............................",
            ".........................RFFFR..............................",
            "..........................RRR...............................",
            "...........................R................................",
            "...........................R................................",
            "...........................R................................",
            ".......................RRRRRRRRR............................",
            "...........................R................................",
            "...........................R................................",
            "...........................R................................",
            "...........................R................................",
            "...........................R................................",
            "..........................RRR...............................",
            ".........................RRRRR..............................",
            "........................RRRRRRR.............................",
            ".........................RRRRR..............................",
            "..........................RRR...............................",
            "...........................R................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
            "............................................................",
        ],
        entities: [
            { type: 'food', count: 5},
        ]
    },
    level15: {
        map: [ // maybe snake face?
            ".............................RR.............................",      // 60w x 35h Fishbone
            ".............................RR.............................",
            "..RRRR.......................RR.......................RRRR..",
            "..R..........................RR..........................R..",
            "..R..........................RR..........................R..",
            "..R..RRRR....................RR....................RRRR..R..",
            ".....R.......................RR.......................R.....",
            ".....R.......................RR.......................R.....",
            "..R..R..RRRR.................RR.................RRRR..R..R..",
            "..R.....R....................RR....................R.....R..",
            "..R.....R....................RR....................R.....R..",
            "..R..R..R..RRRR..............RR..............RRRR..R..R..R..",
            ".....R.....R.................RR.................R.....R.....",
            ".....R.....R.................RR.................R.....R.....",
            "..RRRR..R..R..RRRR...........RR...........RRRR..R..R..RRRR..",
            "........R.....R..............RR..............R.....R........",
            "........R.....R..............RR..............R.....R........",
            ".....RRRR..R..R..RRRR........RR........RRRR..R..R..RRRR.....",
            "...........R.....R...........RR...........R.....R...........",
            "...........R.....R...........RR...........R.....R...........",
            "..RRRR..RRRR..R..R..RRRR..RRRRRRRR..RRRR..R..R..RRRR..RRRR..",
            "..R...........R.....R..................R.....R...........R..",
            "..R...........R.....R..................R.....R...........R..",
            "..R..RRRR..RRRR..R..R..RRRR......RRRR..R..R..RRRR..RRRR..R..",
            ".....R...........R.....R............R.....R...........R.....",
            ".....R...........R.....R............R.....R...........R.....",
            "..R..R..RRRR..RRRR..R..R..RRRRRRRR..R..R..RRRR..RRRR..R..R..",
            "..R.....R...........R.....RRRRRRRR.....R...........R.....R..",
            "..R.....R...........R.....RRRRRRRR.....R...........R.....R..",
            "..R..R..R..RRRR..RRRR..R..RRRRRRRR..R..RRRR..RRRR..R..R..R..",
            ".....R.....R...........R.....RR.....R...........R.....R.....",
            ".....R..R..R...........R.....RR.....R...........R.....R.....",
            "..RRRR..R..R..RRRR..RRRR.....RR.....RRRR..RRRR..R.....RRRR..",
            "........R.....R..............RR..............R..............",
            ".....RRRR.....R..............RR..............R..............",
            
        ],
        entities: [
            { type: 'moreFood', count: 1},
        ]
    },
    level16: {
        map: [      // 60w x 35h high speed, 2 hole sectors with a skinny in the middle
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "............................................................",
            "............................................................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR............................",
            "..............................RR..................S.........",
            "..............................RR............................",
            "..............................RR............................",
            "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
            ".........................................R..................",
            ".R.......................................R..................",
            ".R..RRRRRRRRRRRR..RRRRRRRRR..R.......RR..R........S.........",
            ".R.............R..R.........R.......RFR..R..................",
            ".R..RRR...RRR..R..R........R.......R..R..R..................",
            ".R..RR..R..RR..RRRR.......R.......R...R..R..................",
            ".R..R..RRR..R............R.......R....R..RRRRRRRRRRRRRRRRR..",
            ".R....RRRRR.............R.......R.....R.....................",
            ".R..R..RRR..R.....R....R.......R......R.....................",
            ".R..RR..R..RRR....R...R.......R.......R..RRRRRRRRRRRRRRRRR..",
            ".R..RRR...RRRRR...R..........R........R..R..................",
            ".R.........RRR....R...R.....R.........R..R..................",
            ".R..........R.....R....R...R....R.....R..RRRRRRRRRRRRRRRRRRR",
            ".R......................RFR......R..........................",
            ".R.......................R........R...R..RRRRR..RRRR..RRRRR.",
            ".R.................................R..R..RRRRR..RRRR..RRRRR.",
            "....................................RFR....................."
        ],
        entities: [
            { type: 'food', count: 2},
        ]
    },
};

function ChangeScreenSize(levelString) {
    const canvas = document.getElementById("gameBoard");

    // Define exactly which levels go to which function
    const grow = ["level6", "level12", "level13", "level14", "level15", "level16"];
    const shrink = ["level1", "level2", "level3", "level4", "level5", "level7", "level8", "level9", "level10", "level11"];

    const superSpeed = ["level14", "level16"];

    if (grow.includes(levelString)) {
        unitSize = 10;
    //    canvas.height = 425;
    } 
    else if (shrink.includes(levelString)) {
        unitSize = 25;
        // canvas.height = 350;
    } 
    else {
        console.warn("Level not recognized:", levelString);
    }

    if (superSpeed.includes(levelString)){
        gameSpeed = 100;
    } else {
        gameSpeed = 150;
    }

}

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
    // ChangeScreenSize(levelName);

    if (level.map) loadMap(level);
    level.entities.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) spawnEntity(type);
    });
    // currentMap = level.map;
    // entities = level.entities;
    // puzzleComboTimer();
}



window.addEventListener("DOMContentLoaded", () => {
    const levelName = sessionStorage.getItem("selectedLevel");
    console.log("level from storage:", levelName);
    if (levelName) {
        currentLevel = levelName;
        gameStart();
    }
});
let cLevel = levelName;
function gameStart() { // running = true, ent arr clear iterate food, poison
    running = true;
    entities = [];
    score = 0;
    holeCD = 0;
    ChangeScreenSize(currentLevel);
    snake = [
        { x: 100, y: 50 },
        { x: 100 - unitSize, y: 50 },
        { x: 100 - unitSize*2, y: 50 }
    ];
    scoreText.textContent = `Score: ${score}`;
   
    xVelocity = unitSize;
    yVelocity = 0;
    loadLevel(currentLevel);
    drawSnake();
    nextTick();
}

