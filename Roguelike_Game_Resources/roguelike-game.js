function sendMessageAsync(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (resp) => {
      // If an error occurred in the message channel (e.g. listener returned true but didn't respond), surface it
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(resp);
    });
  });
}



let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
//ctx.imageSmoothingEnabled = false;

const SCALE = 3; //used to size up the canvas proportinal to the tile sizes
const TILE_SIZE = 16;
const MAP_WIDTH = 10; //used for tile maps, this is the number of tiles along the width
const MAP_HEIGHT = 8; //# of tiles in height


canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

canvas.style.width = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

const GAME_WIDTH = canvas.width  * SCALE;
const GAME_HEIGHT = canvas.height * SCALE;




//----------------------------------------------------------------------------------------------------
//Above this is the canvas and general declaration settup
//Here starts the section for the tile map
//----------------------------------------------------------------------------------------------------










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
        });
        //Key release
        document.addEventListener('keyup', (event) => {
            switch(event.keyCode){
                case 37: //37 is the keycode for left arrow key
                    if(character.xspeed < 0)
                        character.xstop();
                    break;
                case 38: //38 is the keycode for up arrow key
                    if(character.yspeed < 0)
                        character.ystop();
                    break;
                case 39: //39 is the keycode for right arrow key
                    if(character.xspeed > 0)
                        character.xstop();
                    break;
                case 40: //40 is the keycode for down arrow key
                    if(character.yspeed > 0)
                        character.ystop();
                    break;
            }
        });
    }
}

//class and context can be moved to character.js
class Character {
    constructor(gameWidth, gameHeight){
        this.width = 20;
        this.height = 20;

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





    //----------------------------

    //used for player movement
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT);
    character.update(deltaTime);
    character.draw(ctx);

    requestAnimationFrame(gameLoop);
    //------------------------------
}
    
gameLoop();