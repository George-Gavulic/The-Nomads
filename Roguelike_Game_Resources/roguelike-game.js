//class and context can be moved to character.js
class Character {
    constructor(gameWidth, gameHeight){
        this.width = 150;
        this.height = 150;

        this.position = {
            x: gameWidth / 2 - this.width / 2,
            y: gameHeight / 2  - this.height / 2
        };

    }

    draw(ctx){
        ctx.fillStyle = '#0ff'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;


let character = new Character(GAME_WIDTH, GAME_HEIGHT);

character.draw(ctx);

let lastTime = 0;


function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0,0, 800, 600);
    character.update(deltaTime);
    character.draw(ctx);

    requestAnimationFrame(gameLoop);
}
//function should be moved to character.js
update(deltaTime);{
    if(!deltaTime) return;

    this.position.x += 5 / deltaTime;
}
    
gameLoop();