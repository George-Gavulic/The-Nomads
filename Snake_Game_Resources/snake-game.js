const sprites = {}; // Sprites for the snake game

function loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function loadSprites() {
sprites.apple = loadImage("Snake graphics/apple.png"); // food sprite

sprites.head_up = loadImage("Snake graphics/head_up.png"); // sprites for the snake head
sprites.head_down = loadImage("Snake graphics/head_down.png");
sprites.head_left = loadImage("Snake graphics/head_left.png");
sprites.head_right = loadImage("Snake graphics/head_right.png");

sprites.tail_up = loadImage("Snake graphics/tail_up.png"); // tail for the snake
sprites.tail_down = loadImage("Snake graphics/tail_down.png");
sprites.tail_left = loadImage("Snake graphics/tail_left.png");
sprites.tail_right = loadImage("Snake graphics/tail_right.png");

sprites.body_vertical = loadImage("Snake graphics/body_vertical.png"); // horizontal and vertical sprites for the snake
sprites.body_horizontal - loadImage("Snake graphics/body_horizontal.png");

sprites.body_topleft = loadImage("Snake graphics/body_topleft.png");
sprites.body_topright = loadImage("Snake graphics/body_topright.png");
sprites.body_bottomleft = loadImage("Snake graphics/body_bottomleft.png");
sprites.body_bottomright = loadImage("Snake graphics/body_bottomright.png");
}

loadSprites();

const canvas = document.getElementById("snakeGameScreen");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("snake-game-points");
const resetBtn = document.getElementById("resetBtn");
const gameWidth = canvas.width;
const gameHeight = canvas.height;


ctx.imageSmoothingEnabled = false;


const width = gameBoard.width;
const height = gameBoard.height;

// let foodX;
// let foodY;

const boardBackground = 'white';
const snakeColor = 'green';
const snakeBorder = 'black';
const foodColor = 'red';
const poisonColor = 'purple';
const rockColor = 'dark grey';
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let holeCD = 0;
let score = 0;
let snake = [ // the starting body of the snake   ////// DOUBLE
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];
let snakeTail = snake[-1];

const inputQ = [];
const maxQ = 1;
let poisonX;
let poisonY;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    createPoison();
    drawFood();
    nextTick();
};
function nextTick(){
    if (running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            drawPoison();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 150); //higher num = slower
    } else {
        displayGameOver();
    }
};

function clearBoard(){ // fill style, fill game rect
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

};

function createFood(){
    foodX = randomCoord(0, gameWidth - unitSize);
    foodY = randomCoord(0, gameHeight - unitSize);
};
function randomCoord(min,max){
    const randPos = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randPos;
}
function createPoison(){
    poisonX = randomCoord(0, gameWidth - unitSize);
    poisonY = randomCoord(0, gameHeight - unitSize);
}
function drawFood(){ ////////////// DOUBLE
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function drawPoison(){
    ctx.fillStyle = 'purple';
    ctx.fillRect(poisonX, poisonY, unitSize, unitSize);
}
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,    y: snake[0].y + yVelocity};
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else if(snake[0].x == poisonX && snake[0].y == poisonY){
        score-=1;
        scoreText.textContent = score;
        snake.pop();
        snake.pop()
        createPoison(); 
    } else {
        snake.pop();
    }
};

function drawSnake(){    ///////////// DOUBLE
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {       // making an arg for each snake part in an array of objects
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); // goes x coord, y coord, x size of fill, y size of fill
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;


// function drawSnake(){  // draw snake, all parts
//     ctx.fillStyle = snakeColor;
//     ctx.strokeStyle = snakeBorder;
//     snake.forEach(snakePart => {       // making an arg for each snake part in an array of objects
//         ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); // goes x coord, y coord, x size of fill, y size of fill
//         ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
//     })
// };

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
};
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth): //gameover rightborder
            running = false;
            break;
        case (snake[0].y >= gameHeight): //gameover bottom border
            running = false;
            break;
        case (snake[0].y < 0): //gameover top border
            running = false;
            break;
    }
    if(Object.keys(snake).length === 0)
        running = false;
    for(let i = 1; i < snake.length; i += 1) { // for each body part (snake.length)
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) // if snake[0/head] would[i+=1]^ = snake body part spot game over
            running = false;
    }
};
function displayGameOver(){
    ctx.font = "50px WingDings";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [ // the starting body of the snake
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
    ];
    gameStart();
};



function moveSnake() { // moved stuff to move snake to limit snake direction change to change on tick
    if (inputQ.length > 0) {
        const keyPressed = inputQ.shift();
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;

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


function nextTick(){ // if running set speed and clear board, draw, move snake, fnx game over, call self. loops n display game over
    if (running){
        setTimeout(()=>{
            if (holeCD > 0)     holeCD--;
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
document.addEventListener("click", e => {
    const aBtn = e.dataset.Btn;
    if (aBtn === e.gameChoiceBtn) 
    if (aBtn === resetBtn) resetGame();

})

gameStart()




























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

// function tickHoleTimers() {
//     entities.forEach(ent => {
//         if (ent.type === 'hole' && ent.inUse) {
//             const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
//             if (!snakeInHole) {
//                 ent.inUse = false;
//                 return false; // go away entrance
// // >>>>>>> Stashed changes
//             }
//         });
//     }
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
// function to draw the snake sprite part 2
function drawSnake() {     ///////////////////// DOUBLE
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
    }
    //Head
    if (i === 0) {
        const neck = snake[1];
        const dir = neck ? getDirection(neck, segment) : "right";
        drawSprite(sprites[`head_${dir}`], segment.x, segment.y);
    }

    // Tail
    else if (i === snake.length - 1) {
        const beforeTail = snake[i - 1];
        const dir = getDirection(beforeTail, segment);
        drawSprite(sprites[`tail_${dir}`], segment.x, segment.y);
    }

    // Body
    else {
        const prev = snake[i - 1];
        const next = snake[i + 1];;

        const dirtoPrev = getDirection(segment, prev);
        const dirtoNext = getDirection(segment, next);

        // Straight sprites for the body
        if (
            (dirtoPrev === "left" && dirtoNext === "right") ||
            (dirtoPrev === "right" && dirtoNext === "left")
        ) {
            drawSprite(sprites.body_horizontal, segment.x, segment.y);
        }
        else if (
            (dirtoPrev === "up" && dirtoNext === "down") ||
            (dirtoPrev === "down" && dirtoNext === "up")
        ) {
            drawSprites(sprites.body_vertical,segment.x, segment.y);
        }
        // Corners of the snake
        else if (
            (dirtoPrev === "up" && dirtoNext === "right") ||
            (dirtoPrev === "right" && dirtoNext === "up")
        ) {
            drawSprite(sprites.body_topright,segment.x, segment.y);
        }
        else if ( 
        (dirtoPrev === "up" && dirtoNext === "left") ||
        (dirtoPrev === "left" && dirtoNext === "up")
        ) {
            drawSprites(sprites.body_topleft, segment.x, segment.y);
        }
        else if (
            (dirtoPrev === "down" && dirtoNext === "right") ||
            (dirtoPrev === "right" && dirtoNext === "down")
        ) {
            (drawSprites.body_bottomright, segment.x, segment.y);
        }
        else if (
            (dirtoPrev === "down" && dirtoNext === "left") ||
            (dirtoPrev === "left" && dirtoNext === "down")
        ) {
            drawSprite(sprites.body_bottomleft, segment.x, segment.y);
        }
    }
    }

    function drawFood() {  //////////////////////// DOUBLE
        drawSprite(sprites.apple, foodX, foodY);
    }

        function drawGame() { //////////////// THIS AND FUNC GAMESTART DO SIMILAR THINGS
        clearBoard();
        drawFood();
        drawSnake();
    }

// /////////////////////////////////////// The Tutorial ends here \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


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
   

    xVelocity = unitSize;
    yVelocity = 0;
    loadLevel(currentLevel);
    drawSnake();
    nextTick();
}

