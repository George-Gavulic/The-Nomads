class Character { //
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


function gameLoop(){
    ctx.clearRect(0,0, 800, 600)
    character.update();
}

update()