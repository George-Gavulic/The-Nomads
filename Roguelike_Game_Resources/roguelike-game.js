const sprites = {}; // Sprites for the snake game

function loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function loadSprites() {
    sprites.apple = loadImage("Snake_graphics/apple.png");
    sprites.hole = loadImage("Snake_graphics/hole_5.png");

    sprites.head_up = loadImage("Snake_graphics/head_up.png");
    sprites.head_down = loadImage("Snake_graphics/head_down.png");
    sprites.head_left = loadImage("Snake_graphics/head_left.png");
    sprites.head_right = loadImage("Snake_graphics/head_right.png");

    sprites.tail_up = loadImage("Snake_graphics/tail_up.png");
    sprites.tail_down = loadImage("Snake_graphics/tail_down.png");
    sprites.tail_left = loadImage("Snake_graphics/tail_left.png");
    sprites.tail_right = loadImage("Snake_graphics/tail_right.png");

    sprites.body_vertical = loadImage("Snake_graphics/body_vertical.png");
    sprites.body_horizontal = loadImage("Snake_graphics/body_horizontal.png");

    sprites.body_topleft = loadImage("Snake_graphics/body_topleft.png");
    sprites.body_topright = loadImage("Snake_graphics/body_topright.png");
    sprites.body_bottomleft = loadImage("Snake_graphics/body_bottomleft.png");
    sprites.body_bottomright = loadImage("Snake_graphics/body_bottomright.png");
}

loadSprites();

const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const muteBtn = document.getElementById("mute-btn");

ctx.imageSmoothingEnabled = false;

const width = gameBoard.width;
const height = gameBoard.height;
let unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let holeCD = 0;
let score = 0;
let gameSpeed = 90;

let snake = [
    { x: 100, y: 100 },
    { x: 75, y: 100 },
    { x: 50, y: 100 }
];

const inputQ = [];
const maxQ = 2;

// ===== SOUND FOR APPLE EFFECT
const eatSound = new Audio("Apple.Crunch.wav");
eatSound.preload = "auto";
eatSound.volume = 0.5;

function playEatSound() {
    const isMuted = localStorage.getItem("globalMute") === "true";
    if (isMuted) return;

    eatSound.currentTime = 0;
    eatSound.play().catch(() => {});
}

const entityTypes = {
    food:     { color: "red",      points: 1, grow: true,  shrink: false, respawn: true,  sprite: "apple" },
    poison:   { color: "purple",   points: 0, grow: false, shrink: true,  respawn: true,  sprite: null },
    rock:     { color: "darkgrey", points: 0, grow: false, shrink: false, respawn: false, sprite: null },
    hole:     { color: "brown",    points: 0, grow: false, shrink: false, respawn: true,  sprite: "hole" },
    moreFood: { color: "red",      points: 1, grow: true,  shrink: false, respawn: true,  sprite: "apple" }
};

let entities = [];
let currentLevel = null;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function nextTick() {
    if (running) {
        setTimeout(() => {
            if (holeCD > 0) holeCD--;

            clearBoard();
            moveSnake();
            snakeHoleCheck();
            drawEntities();
            drawSnake();
            checkGameOver();

            if (running) {
                nextTick();
            } else {
                displayGameOver();
            }
        }, gameSpeed);
    } else {
        displayGameOver();
    }
}

function resizeCanvas() {
    const canvas = document.getElementById("gameBoard");
    const parent = canvas.parentElement;
    const availableWidth = parent ? parent.clientWidth : window.innerWidth;
    const scale = (availableWidth * 0.95) / canvas.width;

    canvas.style.width = (canvas.width * scale) + "px";
    canvas.style.height = (canvas.height * scale) + "px";
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("DOMContentLoaded", resizeCanvas);

function clearBoard() {
    for (let y = 0; y < height; y += unitSize) {
        for (let x = 0; x < width; x += unitSize) {
            if ((x / unitSize + y / unitSize) % 2 === 0) {
                ctx.fillStyle = "#7ccf5c";
            } else {
                ctx.fillStyle = "#6bb84f";
            }
            ctx.fillRect(x, y, unitSize, unitSize);
        }
    }
}

function randomCoord(min, max) {
    return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
}

function changeDirection(event) {
    const key = event.key.toLowerCase();

    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "r", " ", "escape"].includes(key)) {
        event.preventDefault();
    }

    if (key === "escape") {
        running = false;
        window.parent.postMessage(
            {
                type: "SWITCH_PAGE",
                page: "Level_Choice_Resources/level-choice.html",
                game: "Roguelike"
            },
            "*"
        );
        return;
    }

    if (key === "r") {
        running = false;
        setTimeout(() => {
            resetGame();
        }, 150);
        return;
    }

    if (key === " " && running === false) {
        switchToLeaderboard();
        return;
    }

    const validKeys = {
        a: 65,
        w: 87,
        d: 68,
        s: 83,
        arrowleft: 65,
        arrowup: 87,
        arrowright: 68,
        arrowdown: 83
    };

    const mappedKey = validKeys[key];
    if (!mappedKey) return;

    const lastQueued = inputQ[0];
    if (lastQueued === mappedKey) return;

    if (inputQ.length >= maxQ) {
        inputQ.pop();
    }

    inputQ.unshift(mappedKey);
}
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= width):
        case (snake[0].y >= height):
        case (snake[0].y < 0):
            running = false;
            break;
    }

    if (snake.length === 1) running = false;

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", width / 2, height / 2);

    ctx.font = "30px Arial";
    ctx.fillText("Press 'Space' for leaderboard!", width / 2, (height / 2) + 30);
    ctx.fillText("Press 'R' to restart!", width / 2, (height / 2) + 60);
}

function switchToLeaderboard() {
    const currentLevelNum = parseInt(currentLevel.replace("level", ""), 10);
    const nextLevelNum = currentLevelNum + 1;

    const storageKey = "Roguelike_MaxLevel";
    const currentlyUnlocked = parseInt(localStorage.getItem(storageKey)) || 1;

    if (nextLevelNum > currentlyUnlocked) {
        localStorage.setItem(storageKey, nextLevelNum);
    }

    const pendingData = {
        level: currentLevel,
        score: score,
        game: "Snake"
    };

    localStorage.setItem("pendingScoreData", JSON.stringify(pendingData));

    window.parent.postMessage(
        {
            type: "SWITCH_PAGE",
            page: "Leaderboard_Resources/leaderboard.html"
        },
        "*"
    );
}

function resetGame() {
    score = 0;
    inputQ.length = 0;
    running = false;
    snake = [
        { x: 100, y: 100 },
        { x: 75, y: 100 },
        { x: 50, y: 100 }
    ];
    gameStart();
}

function drawEntities() {
    entities.forEach(ent => {
        if (ent.sprite === "apple") {
            drawSprite(sprites.apple, ent.x, ent.y);
        } else if (ent.sprite === "hole") {
            drawSprite(sprites.hole, ent.x, ent.y);
        } else {
            ctx.fillStyle = ent.color;
            ctx.fillRect(ent.x, ent.y, unitSize, unitSize);
        }
    });
}

function moveSnake() {
    if (inputQ.length > 0) {
        const keyPressed = inputQ.shift();

        const goingUp = yVelocity === -unitSize;
        const goingDown = yVelocity === unitSize;
        const goingRight = xVelocity === unitSize;
        const goingLeft = xVelocity === -unitSize;

        if (keyPressed === 65 && !goingRight) {
            xVelocity = -unitSize;
            yVelocity = 0;
        } else if (keyPressed === 68 && !goingLeft) {
            xVelocity = unitSize;
            yVelocity = 0;
        } else if (keyPressed === 87 && !goingDown) {
            xVelocity = 0;
            yVelocity = -unitSize;
        } else if (keyPressed === 83 && !goingUp) {
            xVelocity = 0;
            yVelocity = unitSize;
        }
    }

    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    const hitSomething = checkEntityCollision();
    if (!hitSomething) {
        snake.pop();
    }
}

function checkEntityCollision() {
    const entLocInd = entities.findIndex(ent => ent.x === snake[0].x && ent.y === snake[0].y);
    if (entLocInd === -1) return false;

    const hit = entities[entLocInd];

    if (hit.type === "food" || hit.type === "moreFood") {
        playEatSound();
    }

    score += hit.points;
    scoreText.textContent = `Score: ${score}`;

    if (hit.type === "rock") {
        running = false;
        return true;
    }

    if (hit.shrink) {
        if (snake.length > 1) snake.pop();
        if (snake.length > 1) snake.pop();
    }

    if (hit.type === "hole") {
        teleportSnake(hit);
        spawnEntity("hole");
        snake.pop();
    }

    if (hit.type === "moreFood") {
        spawnEntity(hit.type);
    }

    if (hit.respawn && hit.type !== "hole") {
        spawnEntity(hit.type);
        entities.splice(entLocInd, 1);
    }

    if (!hit.respawn && hit.type !== "hole") {
        entities.splice(entLocInd, 1);
    }

    return true;
}

function teleportSnake(entrance) {
    const exitHole = entities.find(ent => ent.type === "hole" && ent !== entrance && !ent.inUse);
    if (entrance.cd > 0) return;
    if (!exitHole) return;

    snake[0].x = exitHole.x;
    snake[0].y = exitHole.y;

    entrance.cd = snake.length;
    exitHole.cd = snake.length;
    entrance.inUse = true;
    exitHole.inUse = true;
    spawnEntity("hole");
}

function snakeHoleCheck() {
    entities.forEach((ent, index) => {
        if (ent.type !== "hole") return;

        if (ent.cd > 0) {
            ent.cd--;
        }

        if (ent.cd <= 0 && ent.inUse) {
            const snakeInHole = snake.some(part => part.x === ent.x && part.y === ent.y);
            if (!snakeInHole) {
                entities.splice(index, 1);
                ent.inUse = false;
            }
        }
    });
}

function spawnEntity(type) {
    let x, y;
    let attempts = 0;

    do {
        x = randomCoord(0, width - unitSize);
        y = randomCoord(0, height - unitSize);
        attempts++;
        if (attempts > 100) return;
    } while (
        entities.some(e => e.x === x && e.y === y) ||
        snake.some(s => s.x === x && s.y === y)
    );

    const ent = {
        type,
        x,
        y,
        ...entityTypes[type]
    };

    if (type === "hole") {
        ent.inUse = false;
        ent.cd = 0;
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

const mapTiles = {
    R: "rock",
    F: "food",
    P: "poison",
    H: "hole",
    M: "moreFood"
};

const levels = {
    level1: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [{ type: "food", count: 5 }]
    },

    level2: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [{ type: "food", count: 1 }]
    },

    level3: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R......................R",
            "R.......RRRRRRRR.......R",
            "R...................R..R",
            "R...................R..R",
            "R.....RRR...........R..R",
            "R.....R......R......R..R",
            "R.....R......R.........R",
            "R......................R",
            "R......................R",
            "R.......RRRRRRRR.......R",
            "R..............R.......R",
            "R..............R.......R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [{ type: "food", count: 5 }]
    },

    level4: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRR",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "R......................R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [
            { type: "food", count: 1 },
            { type: "poison", count: 5 }
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
            "R..............R.......R",
            "RRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [{ type: "food", count: 2 }]
    },

    level6: {
        map: [
            "RRRRRRRRRRRRRRRRRRRRRRRRR",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R.......................R",
            "R........................",
            "R.......................R",
            "RRRRRRRRRRRRRRRRRRRRRRRRR"
        ],
        entities: [{ type: "moreFood", count: 1 }]
    }
};

function ChangeScreenSize(levelString) {
    const grow = ["level6", "level12", "level13", "level14", "level15", "level16"];
    const shrink = ["level1", "level2", "level3", "level4", "level5", "level7", "level8", "level9", "level10", "level11"];

    const superSpeed = ["level14", "level16"];
    const tutorialSpeed = ["level1", "level2", "level3", "level4", "level5"];

    if (grow.includes(levelString)) {
        unitSize = 10;
    } else if (shrink.includes(levelString)) {
        unitSize = 25;
    }

    if (superSpeed.includes(levelString)) {
        gameSpeed = 65;
    } else if (tutorialSpeed.includes(levelString)) {
        gameSpeed = 120;
    } else {
        gameSpeed = 90;
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
        console.log("loadLevel error");
        return;
    }

    if (level.map) loadMap(level);

    level.entities.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            spawnEntity(type);
        }
    });
}

if (muteBtn) {
    let isMuted = localStorage.getItem("globalMute") === "true";
    muteBtn.innerText = isMuted ? "🔇" : "🔊";

    window.parent.postMessage({
        type: "SYNC_MUTE",
        isMuted: isMuted
    }, "*");

    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        localStorage.setItem("globalMute", isMuted);
        muteBtn.innerText = isMuted ? "🔇" : "🔊";

        window.parent.postMessage({
            type: "TOGGLE_MUTE",
            isMuted: isMuted
        }, "*");
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const levelName = sessionStorage.getItem("selectedLevel");
    if (levelName) {
        currentLevel = levelName;
        gameStart();
    }
});

function gameStart() {
    running = true;
    entities = [];
    score = 0;
    holeCD = 0;
    inputQ.length = 0;

    ChangeScreenSize(currentLevel);

    snake = [
        { x: 100, y: 100 },
        { x: 75, y: 100 },
        { x: 50, y: 100 }
    ];

    scoreText.textContent = `Score: ${score}`;

    xVelocity = unitSize;
    yVelocity = 0;

    loadLevel(currentLevel);
    clearBoard();
    drawEntities();
    drawSnake();
    nextTick();
}