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
// const and variables
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const ScoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameboard.gamewidth;
const gameHeight = gameBoard.gameheight;
const boardBackground = "white";
const snakeBorder = "black";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function nextTick(){};
function clearBoard(){};
function createFood(){
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min))
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
};
function moveSnake(){};
function drawSnake(){};
function changeDirection(){};
function checkGameOver(){};
function displayGameOver(){};
function resetGame(){};

//array for the snake position
let snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 },
];
// function for drawing the snake sprite
function getDirection(from, to) {
    if (to.x > from.x) return "right";
    if (to.x < from.x) return "left";
    if (to.y > from.y) return "down";
    if (to.y < from.y) return "up";
    return null;
}
// function to draw the snake sprite part 2
function drawSnake() {
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

    function drawFood() {
        drawSPrite(sprites.apple, foodX, foodY);
    }

    function drawGame() {
        clearBoard();
        drawFood();
        drawSnake();
    }