const canvas = document.getElementById("snakeGameScreen");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("snake-game-points");
const resetBtn = document.getElementById("resetBtn");
const gameWidth = canvas.width;
const gameHeight = canvas.height;
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
let score = 0;
let snake = [ // the starting body of the snake
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
function clearBoard(){
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
function drawFood(){
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

function drawSnake(){
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



// /////////////////////////////////////// The Tutorial ends here \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// //BASIC CONFIG for TILEMAP
// const TILE_SIZE = 16;
// const MAP_WIDTH = 26;
// const MAP_HEIGHT = 10;

// const availableWidth = getAvailableWidth(); // using this to work around an error of the map not loading because we were gathering the size of the iframe before it had fully loaded or something, this function sets a default.
// const SCALE = availableWidth / (MAP_WIDTH * TILE_SIZE); 

// // const canvas = document.getElementById("snakeGameScreen");
// const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false;
// canvas.style.imageRendering = "pixelated";

// canvas.width = MAP_WIDTH * TILE_SIZE;
// canvas.height = MAP_HEIGHT * TILE_SIZE;
// canvas.style.width  = canvas.width  * SCALE + "px";
// canvas.style.height = canvas.height * SCALE + "px";


// // TILESET IMAGE            WHICH I GRABBED FOR EASE SKIP TO LINE 240ish //////////////////////////////////////
// // grabbing tileset image for backgroud tiles
// const TILESETS = {
//     airport: "/AirPort.png",
//     cracks: "/decorative_cracks_walls.png",
//     f1: "/Furniture1.png", 
//     f2: "/Furniture2.png", 
//     gate: "/Door_1.png",
//     housefloors: "/HouseFloorsAndWalls.png",
//     housecorners: "/innercorners.png",
//     gates: "/housegates.png",
// };

// const tileSheet = new Image();

// // TILE DEFINITIONS
// const tiles = {
//     964:{ name:"orangeLeftGateTop", solid:true, tileset:"gates", x:6, y:3 }, 
//     965:{ name:"orangeLeftGateBottom", solid:true, tileset:"gates", x:6, y:4 },
//     966:{ name:"orangeRightGateTop", solid:true, tileset:"gates", x:7, y:3 }, 
//     967:{ name:"orangeRightGateBottom", solid:true, tileset:"gates", x:7, y:4 },
//     968:{ name:"orangeBottomGateLeft", solid:true, tileset:"gates", x:6, y:2 }, 
//     969:{ name:"orangeBottomGateRight", solid:true, tileset:"gates", x:7, y:2 },
//     970:{ name:"orangeTopGateLeft", solid:true, tileset:"gates", x:6, y:1 }, 
//     971:{ name:"orangeTopGateRight", solid:true, tileset:"gates", x:7, y:1 },

//     972:{ name:"whiteLeftGateTop", solid:true, tileset:"gates", x:4, y:3 }, 
//     973:{ name:"whiteLeftGateBottom", solid:true, tileset:"gates", x:4, y:4 },
//     974:{ name:"whiteRightGateTop", solid:true, tileset:"gates", x:5, y:3 }, 
//     975:{ name:"whiteRightGateBottom", solid:true, tileset:"gates", x:5, y:4 },
//     976:{ name:"whiteBottomGateLeft", solid:true, tileset:"gates", x:4, y:2 }, 
//     977:{ name:"whiteBottomGateRight", solid:true, tileset:"gates", x:5, y:2 },
//     978:{ name:"whiteTopGateLeft", solid:true, tileset:"gates", x:4, y:1 }, 
//     979:{ name:"whiteTopGateRight", solid:true, tileset:"gates", x:5, y:1 },

//     980:{ name:"brownLeftGateTop", solid:true, tileset:"gates", x:2, y:3 }, 
//     981:{ name:"brownLeftGateBottom", solid:true, tileset:"gates", x:2, y:4 },
//     982:{ name:"brownRightGateTop", solid:true, tileset:"gates", x:3, y:3 }, 
//     983:{ name:"brownRightGateBottom", solid:true, tileset:"gates", x:3, y:4 },
//     984:{ name:"brownBottomGateLeft", solid:true, tileset:"gates", x:2, y:2 }, 
//     985:{ name:"brownBottomGateRight", solid:true, tileset:"gates", x:3, y:2 },
//     986:{ name:"brownTopGateLeft", solid:true, tileset:"gates", x:2, y:1 }, 
//     987:{ name:"brownTopGateRight", solid:true, tileset:"gates", x:3, y:1 },

//     988:{ name:"yellowLeftGateTop", solid:true, tileset:"gates", x:0, y:3 }, 
//     989:{ name:"yellowLeftGateBottom", solid:true, tileset:"gates", x:0, y:4 },
//     990:{ name:"yellowRightGateTop", solid:true, tileset:"gates", x:1, y:3 }, 
//     991:{ name:"yellowRightGateBottom", solid:true, tileset:"gates", x:1, y:4 },
//     992:{ name:"yellowBottomGateLeft", solid:true, tileset:"gates", x:0, y:2 }, 
//     993:{ name:"yellowBottomGateRight", solid:true, tileset:"gates", x:1, y:2 },
//     994:{ name:"yellowTopGateLeft", solid:true, tileset:"gates", x:0, y:1 }, 
//     995:{ name:"yellowTopGateRight", solid:true, tileset:"gates", x:1, y:1 }, 

//     996:{ name:"gateConnectorRight", solid:true, tileset:"gates", x:3, y:0 }, // connectors are to be used if a gate is greater than 2 tiles wide
//     997:{ name:"gateConnectorLeft", solid:true, tileset:"gates", x:2, y:0 }, 
//     998:{ name:"gateConnectorTop", solid:true, tileset:"gates", x:1, y:0 }, 
//     999:{ name:"gateConnectorBottom", solid:true, tileset:"gates", x:0, y:0 }, 

//     200: { name: "topLeftCorner", solid: false, tileset: "housefloors", x: 0, y: 0 },
//     201: { name: "bottomLeftCorner", solid: false, tileset: "housefloors", x: 0, y: 8 },
//     202: { name: "topRightCorner", solid: true,  tileset: "housefloors", x: 17, y: 0 },
//     203: { name: "bottomRightCorner", solid: true, tileset: "housefloors", x: 17, y: 8 },
//     204: { name: "leftWall", solid: true, tileset: "housefloors", x: 0, y: 1 },
//     205: { name: "greenfloor", solid: false, tileset: "housefloors", x: 2, y: 2 },
//     206: { name: "rightWall", solid: true, tileset: "housefloors", x: 17, y: 2 },
//     207: { name: "topWall", solid: true, tileset: "housefloors", x: 9, y: 0 },
//     208: { name: "bottomWall", solid: true, tileset: "housefloors", x: 16, y: 8 },
//     209: { name: "brickfloor", solid: false, tileset: "housefloors", x: 14, y: 6 },
//     210:{ name: "tilefloor", solid: false, tileset: "housefloors", x: 6, y: 6 },
//     211:{ name: "woodfloor1a", solid: false, tileset: "housefloors", x: 2, y: 6 },
//     212:{ name: "woodfloor1b", solid: false, tileset: "housefloors", x: 3, y: 6 },
//     213:{ name: "woodfloor2a", solid: false, tileset:"housefloors", x: 10, y: 6 },
//     214:{ name: "woodfloor2b", solid: false, tileset:"housefloors", x: 11, y: 6 },
//     215:{ name: "innerUpperLeft", solid:true, tileset:"housecorners", x:0, y:0 },
//     216:{ name: "innerBottomLeft", solid:true, tileset:"housecorners", x:1, y:0 },
//     217:{ name: "innerUpperRight", solid:true, tileset:"housecorners", x:2, y:0 },
//     218:{ name: "innerBottomRight", solid:true, tileset:"housecorners", x:3, y:0 },

//     //Size-(Orientation)-Color-Piece-Object
//     117:{ name:"SmallOrangeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:0 },
//     118:{ name:"SmallOrangeTopRightEndtable", solid:true, tileset:"f1", x:1, y:0 },
//     119:{ name:"SmallOrangeBottomLeftEndtable", solid:true, tileset:"f1", x:0, y:1 },
//     120:{ name:"SmallOrangeBottomRightEndtable", solid:true, tileset:"f1", x:1, y:1 },

//     121:{ name:"LargeTanTopLeftTable", solid:true, tileset:"f1", x:0, y:2 },
//     122:{ name:"LargeTanTopMidTable", solid:true, tileset:"f1", x:1, y:2 },
//     123:{ name:"LargeTanTopRightTable", solid:true, tileset:"f1", x:2, y:2 },
//     124:{ name:"LargeTanBottomLeftTable", solid:true, tileset:"f1", x:0, y:3 },
//     125:{ name:"LargeTanBottomMidTable", solid:true, tileset:"f1", x:1, y:3 },
//     126:{ name:"LargeTanBottomRightTable", solid:true, tileset:"f1", x:2, y:3 },

//     127:{ name:"LargeVertTanTopLeftTable", solid:true, tileset:"f1", x:0, y:4 },
//     128:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:0, y:5 },
//     129:{ name:"LargeVertTanTopRightTable", solid:true, tileset:"f1", x:0, y:6 },
//     130:{ name:"LargeVertTanBottomLeftTable", solid:true, tileset:"f1", x:1, y:4 },
//     131:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:1, y:5 },
//     132:{ name:"LargeVertTanBottomRightTable", solid:true, tileset:"f1", x:1, y:6 },

//     133:{ name:"TallBrownLargeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:7 },
//     134:{ name:"TallBrownLeftMidEndtable", solid:true, tileset:"f1", x:0, y:8 },
//     135:{ name:"TallBrownTopRightEndtable", solid:true, tileset:"f1", x:0, y:9 },
//     136:{ name:"TallBrownBottomLeftEndtable", solid:true, tileset:"f1", x:1, y:7 },
//     137:{ name:"TallBrownRightMidEndtable", solid:true, tileset:"f1", x:1, y:8 },
//     138:{ name:"TallBrownBottomRightEndtable", solid:true, tileset:"f1", x:1, y:9 },

//     139:{ name:"SmallOrangeSideTopEndtable", solid:true, tileset:"f1", x:2, y:0 },
//     140:{ name:"SmallOrangeSideBottomEndtable", solid:true, tileset:"f1", x:2, y:1 },

//     141:{ name:"SmallBrownTopEndtable", solid:true, tileset:"f1", x:3, y:0 },
//     142:{ name:"SmallBrownBottomEndtable", solid:true, tileset:"f1", x:3, y:1 },

//     143:{ name:"WhiteTopChair", solid:true, tileset:"f1", x:5, y:0 },
//     144:{ name:"WhiteBottomChair", solid:true, tileset:"f1", x:5, y:1 },

//     145:{ name:"WhiteSideTopChair", solid:true, tileset:"f1", x:6, y:0 },
//     146:{ name:"WhiteSideBottomChair", solid:true, tileset:"f1", x:6, y:1 },

//     147:{ name:"WhiteBackTopChair", solid:true, tileset:"f1", x:7, y:0 },
//     148:{ name:"WhiteBackBottomChair", solid:true, tileset:"f1", x:7, y:1 },

//     149:{ name:"TanTopChair", solid:true, tileset:"f1", x:8, y:0 },
//     150:{ name:"TanBottomChair", solid:true, tileset:"f1", x:8, y:1 },

//     151:{ name:"TanSideTopChair", solid:true, tileset:"f1", x:9, y:0 },
//     152:{ name:"TanSideBottomChair", solid:true, tileset:"f1", x:9, y:1 },

//     153:{ name:"TanBackTopChair", solid:true, tileset:"f1", x:10, y:0 },
//     154:{ name:"TanBackBottomChair", solid:true, tileset:"f1", x:10, y:1 },

//     155:{ name:"BrownTopStool", solid:true, tileset:"f1", x:12, y:1 },

//     156:{ name:"SmallTanTopLeftBookcase", solid:true, tileset:"f1", x:3, y:2 },
//     157:{ name:"SmallTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:2 },
//     158:{ name:"SmallTanBottomLeftBookcase", solid:true, tileset:"f1", x:3, y:3 },
//     159:{ name:"SmallTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:3 },
    
//     160:{ name:"LargeTanTopLeftBookcase", solid:true, tileset:"f1", x:2, y:4 },
//     161:{ name:"LargeTanTopMidBookcase", solid:true, tileset:"f1", x:3, y:4 },
//     162:{ name:"LargeTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:4 },
//     163:{ name:"LargeTanMiddleLeftBookcase", solid:true, tileset:"f1", x:2, y:5 },
//     164:{ name:"LargeTanMiddleBookcase", solid:true, tileset:"f1", x:3, y:5 },
//     165:{ name:"LargeTanMiddleRightBookcase", solid:true, tileset:"f1", x:4, y:5 },
//     166:{ name:"LargeTanBottomLeftBookcase", solid:true, tileset:"f1", x:2, y:6 },
//     167:{ name:"LargeTanBottomMidBookcase", solid:true, tileset:"f1", x:3, y:6 },
//     168:{ name:"LargeTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:6 },

//     169:{ name:"LargeOrangeTopLeftBookcase", solid:true, tileset:"f1", x:6, y:4 },
//     170:{ name:"LargeOrangeTopMidBookcase", solid:true, tileset:"f1", x:7, y:4 },
//     171:{ name:"LargeOrangeTopRightBookcase", solid:true, tileset:"f1", x:8, y:4 },
//     172:{ name:"LargeOrangeMiddleLeftBookcase", solid:true, tileset:"f1", x:6, y:5 },
//     173:{ name:"LargeOrangeMiddleBookcase", solid:true, tileset:"f1", x:7, y:5 },
//     174:{ name:"LargeOrangeMiddleRightBookcase", solid:true, tileset:"f1", x:8, y:5 },
//     175:{ name:"LargeOrangeBottomLeftBookcase", solid:true, tileset:"f1", x:6, y:6 },
//     176:{ name:"LargeOrangeBottomMidBookcase", solid:true, tileset:"f1", x:7, y:6 },
//     177:{ name:"LargeOrangeBottomRightBookcase", solid:true, tileset:"f1", x:8, y:6 },

//     178:{ name:"TopLamp", solid:true, tileset:"f1", x:6, y:7 },
//     179:{ name:"MiddleLamp", solid:true, tileset:"f1", x:6, y:8 },
//     180:{ name:"BottomLamp", solid:true, tileset:"f1", x:6, y:9 },

//     181:{ name:"TanTopHatstand", solid:true, tileset:"f1", x:3, y:7 },
//     182:{ name:"TanMiddleHatstand", solid:true, tileset:"f1", x:3, y:8 },
//     183:{ name:"TanBottomHatstand", solid:true, tileset:"f1", x:3, y:9 },

//     184:{ name:"OrangeTopLeftClock", solid:true, tileset:"f1", x:4, y:7 },
//     185:{ name:"OrangeBrownLeftMidClock", solid:true, tileset:"f1", x:4, y:8 },
//     186:{ name:"OrangeTopRightClock", solid:true, tileset:"f1", x:4, y:9 },
//     187:{ name:"OrangeBottomLeftClock", solid:true, tileset:"f1", x:5, y:7 },
//     188:{ name:"OrangeRightMidClock", solid:true, tileset:"f1", x:5, y:8 },
//     189:{ name:"OrangeBottomRightClock", solid:true, tileset:"f1", x:5, y:9 },

//     190:{ name:"OrangeTopLeftCouch", solid:true, tileset:"f1", x:5, y:10 },
//     191:{ name:"OrangeTopLMidCouch", solid:true, tileset:"f1", x:6, y:10 },
//     192:{ name:"OrangeTopRMidCouch", solid:true, tileset:"f1", x:7, y:10 },
//     193:{ name:"OrangeTopRightCouch", solid:true, tileset:"f1", x:8, y:10 },
//     194:{ name:"OrangeBottomLeftCouch", solid:true, tileset:"f1", x:5, y:11 },
//     195:{ name:"OrangeBottomLMidCouch", solid:true, tileset:"f1", x:6, y:11 },
//     196:{ name:"OrangeBottomRMidCouch", solid:true, tileset:"f1", x:7, y:11 },
//     197:{ name:"OrangeBottomRightCouch", solid:true, tileset:"f1", x:8, y:11 },

//     //39:{ name:"redGate", solid:true, tileset:"gate", x:0, y:0 },
//     //40:{ name:"orangeGate", solid:true, tileset:"gate", x:1, y:0 },//some of these will become like a table gate or something.
//     //41:{ name:"yellowGate", solid:true, tileset:"gate", x:2, y:0 },
//     //42:{ name:"greenGate", solid:true, tileset:"gate", x:3, y:0 },
//     //43:{ name:"blueGate", solid:true, tileset:"gate", x:4, y:0 },
//     //44:{ name:"purpleGate", solid:true, tileset:"gate", x:5, y:0 },
//     //46:{ name:"blackGate", solid:true, tileset:"gate", x:7, y:0 },
//     //47:{ name:"grayGate", solid:true, tileset:"gate", x:8, y:0 },
//     //48:{ name:"temp1Gate", solid:true, tileset:"gate", x:9, y:0 },
//     //49:{ name:"temp2Gate", solid:true, tileset:"gate", x:10, y:0 },
//     //50:{ name:"temp3Gate", solid:true, tileset:"gate", x:11, y:0 },
//     //51:{ name:"temp4Gate", solid:true, tileset:"gate", x:12, y:0 },
//     //52:{ name:"temp5Gate", solid:true, tileset:"gate", x:13, y:0 },
//     //53:{ name:"temp6Gate", solid:true, tileset:"gate", x:14, y:0 },
//     //54:{ name:"temp7Gate", solid:true, tileset:"gate", x:15, y:0 },

// };
// // LEVEL DATA
// const levels = {
//     //lets try a 20 by 10 map for the demo, we can always add more levels later, but this is a good start for testing
//     level1: {
//         map:    [
//             [200,207,207,207,207,207,207,207,978,998,979,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202],
//             [204,209,209,209,210,210,210,210,211,212,211,212,211,212,211,212,211,212,211,212,213,214,213,214,213,206],
//             [204,209,209,209,210,210,210,210,211,212,211,212,211,212,211,212,211,212,211,212,213,214,213,214,213,206],
//             [204,209,209,209,210,210,210,210,211,212,211,212,211,212,211,212,211,212,211,212,213,214,213,214,213,972],
//             [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,973],
//             [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
//             [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
//             [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
//             [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
//             [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],
//         ]
//     }
// }


// const imageCache = {};

// function loadAllImages(callback) {
//     const sources = Object.values(TILESETS);
//     let loaded = 0;

//     sources.forEach(src => {
//         const img = new Image();
//         img.src = src;

//         img.onload = () => {
//             loaded++;
//             if (loaded === sources.length) {
//                 callback();
//             }
//         };

//         imageCache[src] = img;
//     });
// }


// // DRAWING FUNCTIONS
// function drawTile(tileId, gridX, gridY) {
//     const tile = tiles[tileId];
//     if (!tile) return;


//     const img = imageCache[TILESETS[tile.tileset]];
//     if (!img) return;

//     ctx.drawImage(
//         img,
//         tile.x * TILE_SIZE,
//         tile.y * TILE_SIZE,
//         TILE_SIZE,
//         TILE_SIZE,
//         gridX * TILE_SIZE,
//         gridY * TILE_SIZE,
//         TILE_SIZE,
//         TILE_SIZE
//     );
// }

// function drawMap() {
//     for (let y = 0; y < currentMap.length; y++) {
//         for (let x = 0; x < currentMap[y].length; x++) {
//             drawTile(currentMap[y][x], x, y);
//         }
//     }
// }


// let currentMap;
// // END OF GRABBING TILESET//////////////////////////////////////////////////////////////////

// ///////////         REDO BELOW           ///////////////////////
// let scoreBoard = document.getElementById("snake-game-points");
// function Scoreboard(block) {
//     //TODO add a precondition to prevent this from being called multiple times for the same block.
//     if (!block || block.scored) return;
//     block.scored = true; // Mark this block as scored to prevent double scoring

//     //get the number of tiles in the block, and add that to the score, this is just a placeholder scoring system, we can change it later to be more complex if we want, but for now this is good enough for testing
//     points += (block.shape.length * comboMulti); //temp
//     //alert(block +" reached the gate! You earned " + block.shape.length + " points!"); //temp
//     scoreBoard.innerText = "Points: " + points;
    
// }
// //////////////////////////////SNAKE STUFF
// let count = 0;

// let snake = [{ x: 10, y: 10}];


// /////////////////////////////////////////////////////////

// function getAvailableWidth() {
//     const iframe = window.frameElement;

//     if (iframe && iframe.clientWidth) {
//         return iframe.clientWidth;
//     }

//     // fallback if not in iframe
//     return window.innerWidth;
// }


// function resizeCanvas() {
//     const parent = canvas.parentElement;
//     const availableWidth = parent ? parent.clientWidth : window.innerWidth;

//     const scale = availableWidth / canvas.width;

//     canvas.style.width  = canvas.width  * scale + "px";
//     canvas.style.height = canvas.height * scale + "px";
// }


// document.getElementById("back-to-level-choice")
//   .addEventListener("click", () => {
//     window.parent.postMessage(
//       { type: "SWITCH_PAGE", 
//         page: "Level_Choice_Resources/level-choice.html",
//         game: "Snake" },
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


// let lastKey = [];
// function lastKeyTracker() {
//     if ()
//     if (length(lastKey) > 1){
//     lastKey.pop();
// }
// }

// const keyState = {};

// document.addEventListener('keydown', (e) => {
//     keyState[e.code] = true; // Track physical key position
// });


// // listen to keyboard events to move the snake
// document.addEventListener('keydown', function(e) {
// // prevent snake from backtracking on itself by checking that it's not already moving on the same axis (pressing left while moving
// // left won't do anything, and pressing right while moving left shouldn't let you collide with your own body)

// // left arrow key
// if (e.code === 'ArrowLeft' && snake.dx === 0) {
//     snake.dx = -grid;
//     snake.dy = 0;
// }
// // up 
// else if (e.code === 'ArrowUp' && snake.dy === 0) {
//     snake.dy = -grid;
//     snake.dx = 0;
// }
// // right 
// else if (e.code === 'ArrowRight' && snake.dx === 0) {
//     snake.dx = grid;
//     snake.dy = 0;
// }
// // down 
// else if (e.code === 'ArrowDown' && snake.dy === 0) {
//     snake.dy = grid;
//     snake.dx = 0;
// }
// });


// window.addEventListener("resize", resizeCanvas);
// window.addEventListener("load", resizeCanvas); //its just white if it happens to be called before the DOM is loaded

// loadLevel("level1"); // this is needed to set the map, while the system waits for the message about level selected
// //TODO: make level 1 or level 0 and tile/loading/unplayable but good looking level/screen


// // END OF DOCUMENT
// function loop() {
//     requestAnimationFrame(loop);
// }
