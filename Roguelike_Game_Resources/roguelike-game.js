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
const boardBackground = "white";
const unitSize = 25;
ctx.imageSmoothingEnabled = false;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 }
];

ctx.imageSmoothingEnabled = false;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    score = 0;
    scoreText.textContent = score;
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 }
    ];

    createFood();
    clearBoard();
    drawFood();
    drawSnake();
    nextTick();
    }

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            moveSnake();
            checkGameOver();
            drawFood();
            drawSnake();

    if (running) {
        nextTick();
    } else {
        displayGameOver();
    }
        }, 100);
    }
}

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
function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
}
function createFood() {
    foodX = randomFood(0, width - unitSize);
    foodY = randomFood(0, height - unitSize);
}

function moveSnake() {
    const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const key = event.key.toLowerCase(); 

    if (["w", "a", "s", "d", "arrowleft", "arrowup", "arrowright", "arrowdown"].includes(key)) {
        event.preventDefault();
    }

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;
    const goingRight = xVelocity === unitSize;

    if ((key === "a" || key === "arrowleft") && !goingRight) {
        xVelocity = -unitSize;
        yVelocity = 0;
    } 
    else if ((key === "w" || key === "arrowup") && !goingDown) {
        xVelocity = 0;
        yVelocity = -unitSize;
    }       
    else if ((key === "d" || key === "arrowright") && !goingLeft) {
        xVelocity = unitSize;
        yVelocity = 0;
    } 
    else if ((key === "s" || key === "arrowdown") && !goingUp) {
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

function resetGame() {
    running = false;
    gameStart();
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

function drawFood() {
    drawSprite(sprites.apple, foodX, foodY);
}
//BUTTONS
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


// gameStart();
