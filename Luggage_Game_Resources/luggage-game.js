//BASIC CONFIG for TILEMAP
const TILE_SIZE = 16;
const MAP_WIDTH = 26;
const MAP_HEIGHT = 10;

const availableWidth = getAvailableWidth(); // using this to work around an error of the map not loading because we were gathering the size of the iframe before it had fully loaded or something, this function sets a default.
const SCALE = availableWidth / (MAP_WIDTH * TILE_SIZE); 
// const iframe = window.frameElement;
// const iframeWidth = iframe.clientWidth;
// const SCALE = iframeWidth / (MAP_WIDTH * TILE_SIZE);

//const SCALE = 3;

const canvas = document.getElementById("luggageGameScreen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";

//const iframe = window.frameElement || window.parent.document.getElementById("game-panel-frame");
//const SCALE = iframe.clientWidth / (MAP_WIDTH * TILE_SIZE); //test
//alert("Calculated SCALE: " + SCALE);
canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;
canvas.style.width  = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

let points = 0;
let reachedGoal = false;

// TILESET IMAGE
// grabbing tileset image for backgroud tiles
const TILESETS = {
    airport: "/AirPort.png",
    cracks: "/decorative_cracks_walls.png",
    f1: "/Furniture1.png", 
    f2: "/Furniture2.png", 
    gate: "/Door_1.png",
    housefloors: "/HouseFloorsAndWalls.png",
};

const tileSheet = new Image();

// TILE DEFINITIONS
const tiles = {
    999:{ name:"brownGate", solid:true, tileset:"gate", x:0, y:0 }, // <<< only one in use, all other are temp
    0: { name: "topLeftCorner", solid: false, tileset: "housefloors", x: 0, y: 0 },
    1: { name: "bottomLeftCorner", solid: false, tileset: "housefloors", x: 0, y: 8 },
    2: { name: "topRightCorner", solid: true,  tileset: "housefloors", x: 17, y: 0 },
    3: { name: "bottomRightCorner", solid: true, tileset: "housefloors", x: 17, y: 8 },
    4: { name: "leftWall", solid: true, tileset: "housefloors", x: 0, y: 1 },
    5: { name: "greenfloor", solid: false, tileset: "housefloors", x: 2, y: 2 },
    6: { name: "rightWall", solid: true, tileset: "housefloors", x: 17, y: 2 },
    7: { name: "topWall", solid: true, tileset: "housefloors", x: 9, y: 0 },
    8: { name: "bottomWall", solid: true, tileset: "housefloors", x: 16, y: 8 },
    9: { name: "brickfloor", solid: false, tileset: "housefloors", x: 14, y: 6 },
    10:{ name: "tilefloor", solid: false, tileset: "housefloors", x: 6, y: 6 },
    11:{ name: "woodfloor1a", solid: false, tileset: "housefloors", x: 2, y: 6 },
    12:{ name: "woodfloor1b", solid: false, tileset: "housefloors", x: 3, y: 6 },
    13:{ name: "woodfloor2a", solid: false, tileset:"housefloors", x: 10, y: 6 },
    14:{ name: "woodfloor2b", solid: false, tileset:"housefloors", x: 11, y: 6 },
    //15:{ name: "bottomRoadLeft", solid:true, tileset:"airport", x:5, y:4 }, currently unused
    //16:{ name: "bottomRoadRight", solid:true, tileset:"airport", x:6, y:4 },

    //Size-(Orientation)-Color-Piece-Object
    17:{ name:"SmallOrangeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:0 },
    18:{ name:"SmallOrangeTopRightEndtable", solid:true, tileset:"f1", x:1, y:0 },
    19:{ name:"SmallOrangeBottomLeftEndtable", solid:true, tileset:"f1", x:0, y:1 },
    20:{ name:"SmallOrangeBottomRightEndtable", solid:true, tileset:"f1", x:1, y:1 },

    21:{ name:"LargeTanTopLeftTable", solid:true, tileset:"f1", x:0, y:2 },
    22:{ name:"LargeTanTopMidTable", solid:true, tileset:"f1", x:1, y:2 },
    23:{ name:"LargeTanTopRightTable", solid:true, tileset:"f1", x:2, y:2 },
    24:{ name:"LargeTanBottomLeftTable", solid:true, tileset:"f1", x:0, y:3 },
    25:{ name:"LargeTanBottomMidTable", solid:true, tileset:"f1", x:1, y:3 },
    26:{ name:"LargeTanBottomRightTable", solid:true, tileset:"f1", x:2, y:3 },

    27:{ name:"LargeVertTanTopLeftTable", solid:true, tileset:"f1", x:0, y:4 },
    28:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:0, y:5 },
    29:{ name:"LargeVertTanTopRightTable", solid:true, tileset:"f1", x:0, y:6 },
    30:{ name:"LargeVertTanBottomLeftTable", solid:true, tileset:"f1", x:1, y:4 },
    31:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:1, y:5 },
    32:{ name:"LargeVertTanBottomRightTable", solid:true, tileset:"f1", x:1, y:6 },

    33:{ name:"TallBrownLargeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:7 },
    34:{ name:"TallBrownLeftMidEndtable", solid:true, tileset:"f1", x:0, y:8 },
    35:{ name:"TallBrownTopRightEndtable", solid:true, tileset:"f1", x:0, y:9 },
    36:{ name:"TallBrownBottomLeftEndtable", solid:true, tileset:"f1", x:1, y:7 },
    37:{ name:"TallBrownRightMidEndtable", solid:true, tileset:"f1", x:1, y:8 },
    38:{ name:"TallBrownBottomRightEndtable", solid:true, tileset:"f1", x:1, y:9 },

    39:{ name:"SmallOrangeSideTopEndtable", solid:true, tileset:"f1", x:2, y:0 },
    40:{ name:"SmallOrangeSideBottomEndtable", solid:true, tileset:"f1", x:2, y:1 },

    41:{ name:"SmallBrownTopEndtable", solid:true, tileset:"f1", x:3, y:0 },
    42:{ name:"SmallBrownBottomEndtable", solid:true, tileset:"f1", x:3, y:1 },

    43:{ name:"WhiteTopChair", solid:true, tileset:"f1", x:5, y:0 },
    44:{ name:"WhiteBottomChair", solid:true, tileset:"f1", x:5, y:1 },

    45:{ name:"WhiteSideTopChair", solid:true, tileset:"f1", x:6, y:0 },
    46:{ name:"WhiteSideBottomChair", solid:true, tileset:"f1", x:6, y:1 },

    47:{ name:"WhiteBackTopChair", solid:true, tileset:"f1", x:7, y:0 },
    48:{ name:"WhiteBackBottomChair", solid:true, tileset:"f1", x:7, y:1 },

    49:{ name:"TanTopChair", solid:true, tileset:"f1", x:8, y:0 },
    50:{ name:"TanBottomChair", solid:true, tileset:"f1", x:8, y:1 },

    51:{ name:"TanSideTopChair", solid:true, tileset:"f1", x:9, y:0 },
    52:{ name:"TanSideBottomChair", solid:true, tileset:"f1", x:9, y:1 },

    53:{ name:"TanBackTopChair", solid:true, tileset:"f1", x:10, y:0 },
    54:{ name:"TanBackBottomChair", solid:true, tileset:"f1", x:10, y:1 },

    55:{ name:"BrownTopStool", solid:true, tileset:"f1", x:12, y:1 },

    56:{ name:"SmallTanTopLeftBookcase", solid:true, tileset:"f1", x:3, y:2 },
    57:{ name:"SmallTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:2 },
    58:{ name:"SmallTanBottomLeftBookcase", solid:true, tileset:"f1", x:3, y:3 },
    59:{ name:"SmallTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:3 },
    
    60:{ name:"LargeTanTopLeftBookcase", solid:true, tileset:"f1", x:2, y:4 },
    61:{ name:"LargeTanTopMidBookcase", solid:true, tileset:"f1", x:3, y:4 },
    62:{ name:"LargeTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:4 },
    63:{ name:"LargeTanMiddleLeftBookcase", solid:true, tileset:"f1", x:2, y:5 },
    64:{ name:"LargeTanMiddleBookcase", solid:true, tileset:"f1", x:3, y:5 },
    65:{ name:"LargeTanMiddleRightBookcase", solid:true, tileset:"f1", x:4, y:5 },
    66:{ name:"LargeTanBottomLeftBookcase", solid:true, tileset:"f1", x:2, y:6 },
    67:{ name:"LargeTanBottomMidBookcase", solid:true, tileset:"f1", x:3, y:6 },
    68:{ name:"LargeTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:6 },

    69:{ name:"LargeOrangeTopLeftBookcase", solid:true, tileset:"f1", x:6, y:4 },
    70:{ name:"LargeOrangeTopMidBookcase", solid:true, tileset:"f1", x:7, y:4 },
    71:{ name:"LargeOrangeTopRightBookcase", solid:true, tileset:"f1", x:8, y:4 },
    72:{ name:"LargeOrangeMiddleLeftBookcase", solid:true, tileset:"f1", x:6, y:5 },
    73:{ name:"LargeOrangeMiddleBookcase", solid:true, tileset:"f1", x:7, y:5 },
    74:{ name:"LargeOrangeMiddleRightBookcase", solid:true, tileset:"f1", x:8, y:5 },
    75:{ name:"LargeOrangeBottomLeftBookcase", solid:true, tileset:"f1", x:6, y:6 },
    76:{ name:"LargeOrangeBottomMidBookcase", solid:true, tileset:"f1", x:7, y:6 },
    77:{ name:"LargeOrangeBottomRightBookcase", solid:true, tileset:"f1", x:8, y:6 },

    78:{ name:"TopLamp", solid:true, tileset:"f1", x:6, y:7 },
    79:{ name:"MiddleLamp", solid:true, tileset:"f1", x:6, y:8 },
    80:{ name:"BottomLamp", solid:true, tileset:"f1", x:6, y:9 },

    81:{ name:"TanTopHatstand", solid:true, tileset:"f1", x:3, y:7 },
    82:{ name:"TanMiddleHatstand", solid:true, tileset:"f1", x:3, y:8 },
    83:{ name:"TanBottomHatstand", solid:true, tileset:"f1", x:3, y:9 },

    84:{ name:"OrangeTopLeftClock", solid:true, tileset:"f1", x:4, y:7 },
    85:{ name:"OrangeBrownLeftMidClock", solid:true, tileset:"f1", x:4, y:8 },
    86:{ name:"OrangeTopRightClock", solid:true, tileset:"f1", x:4, y:9 },
    87:{ name:"OrangeBottomLeftClock", solid:true, tileset:"f1", x:5, y:7 },
    88:{ name:"OrangeRightMidClock", solid:true, tileset:"f1", x:5, y:8 },
    89:{ name:"OrangeBottomRightClock", solid:true, tileset:"f1", x:5, y:9 },

    90:{ name:"OrangeTopLeftCouch", solid:true, tileset:"f1", x:5, y:10 },
    91:{ name:"OrangeTopLMidCouch", solid:true, tileset:"f1", x:6, y:10 },
    92:{ name:"OrangeTopRMidCouch", solid:true, tileset:"f1", x:7, y:10 },
    93:{ name:"OrangeTopRightCouch", solid:true, tileset:"f1", x:8, y:10 },
    94:{ name:"OrangeBottomLeftCouch", solid:true, tileset:"f1", x:5, y:11 },
    95:{ name:"OrangeBottomLMidCouch", solid:true, tileset:"f1", x:6, y:11 },
    96:{ name:"OrangeBottomRMidCouch", solid:true, tileset:"f1", x:7, y:11 },
    97:{ name:"OrangeBottomRightCouch", solid:true, tileset:"f1", x:8, y:11 },

    //39:{ name:"redGate", solid:true, tileset:"gate", x:0, y:0 },
    //40:{ name:"orangeGate", solid:true, tileset:"gate", x:1, y:0 },//some of these will become like a table gate or something.
    //41:{ name:"yellowGate", solid:true, tileset:"gate", x:2, y:0 },
    //42:{ name:"greenGate", solid:true, tileset:"gate", x:3, y:0 },
    //43:{ name:"blueGate", solid:true, tileset:"gate", x:4, y:0 },
    //44:{ name:"purpleGate", solid:true, tileset:"gate", x:5, y:0 },
    //46:{ name:"blackGate", solid:true, tileset:"gate", x:7, y:0 },
    //47:{ name:"grayGate", solid:true, tileset:"gate", x:8, y:0 },
    //48:{ name:"temp1Gate", solid:true, tileset:"gate", x:9, y:0 },
    //49:{ name:"temp2Gate", solid:true, tileset:"gate", x:10, y:0 },
    //50:{ name:"temp3Gate", solid:true, tileset:"gate", x:11, y:0 },
    //51:{ name:"temp4Gate", solid:true, tileset:"gate", x:12, y:0 },
    //52:{ name:"temp5Gate", solid:true, tileset:"gate", x:13, y:0 },
    //53:{ name:"temp6Gate", solid:true, tileset:"gate", x:14, y:0 },
    //54:{ name:"temp7Gate", solid:true, tileset:"gate", x:15, y:0 },

    

};

const imageCache = {};

function loadAllImages(callback) {
    const sources = Object.values(TILESETS);
    let loaded = 0;

    sources.forEach(src => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            loaded++;
            if (loaded === sources.length) {
                callback();
            }
        };

        imageCache[src] = img;
    });
}

// LEVEL DATA
const levels = {
    //lets try a 20 by 10 map for the demo, we can always add more levels later, but this is a good start for testing
    level1: {
        map:    [
            [0,7,7,7,7,7,7,7,999,999,999,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
            [4,9,9,9,10,10,10,10,11,12,11,12,11,12,11,12,11,12,11,12,13,14,13,14,13,6],
            [4,9,9,9,10,10,10,10,11,12,11,12,11,12,11,12,11,12,11,12,13,14,13,14,13,6],
            [4,9,9,9,10,10,10,10,11,12,11,12,11,12,11,12,11,12,11,12,13,14,13,14,13,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,3],
        ],
        blocks: [
            { shape: "orange_couch", x: 8, y: 2, goals: [{x: 15, y: 3}] },
            { shape: "large_tan_table", x: 7, y: 4, goals: [{x: 8, y: 1}, {x: 16, y: 3}] },
            { shape: "small_tan_bookcase", x: 10, y: 4, goals: [{x: 8, y: 1}, {x: 17, y: 3}] }
        ]
    },
    level2: {
        map:    [
            [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,3],
        ],
        blocks: [
            { shape: "large_tan_table_vert", x: 4, y: 2, goals: [{x: 8, y: 1}] },
            { shape: "white_chair", x: 2, y: 3, goals: [{x: 8, y: 1}] }
        ]
    },
    
    level3: {
        map:    [
            [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,999,5,5,5,5,5,5,5,5,5,5,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,999],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16,15,16],
        ],
        blocks: [
            { shape: "large_tan_table_vert", x: 4, y: 2, goals: [{x: 8, y: 1}] },
            { shape: "white_chair", x: 2, y: 3, goals: [{x: 8, y: 1}] }
        ]
    }
};


// DRAWING FUNCTIONS
function drawTile(tileId, gridX, gridY) {
    const tile = tiles[tileId];
    if (!tile) return;


    const img = imageCache[TILESETS[tile.tileset]];
    if (!img) return;

    ctx.drawImage(
        img,
        tile.x * TILE_SIZE,
        tile.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        gridX * TILE_SIZE,
        gridY * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

function drawMap() {
    for (let y = 0; y < currentMap.length; y++) {
        for (let x = 0; x < currentMap[y].length; x++) {
            drawTile(currentMap[y][x], x, y);
        }
    }
}

// OBSTICAL DEFINITIONS for the luggage the player can move
const SHAPES = {
    T: [
        { x: 0, y: 0, tileId: 10 },
        { x: -1, y: 0, tileId: 10 },
        { x: 1, y: 0, tileId: 10 },
        { x: 0, y: -1, tileId: 10 }
    ],

    L: [
        { x: 0, y: 0, tileId: 11 },
        { x: 0, y: -1, tileId: 12 },
        { x: 0, y: -2, tileId: 13 },
        { x: 1, y: 0, tileId: 14 }
    ],
    //size-color-object-orientation
    small_orange_endtable: [
        { x: 0, y: 0, tileId: 17 },
        { x: 1, y: 0, tileId: 18 },
        { x: 0, y: 1, tileId: 19 },
        { x: 1, y: 1, tileId: 20 }
    ],
    small_orange_endtable_side: [
        { x: 0, y: 0, tileId: 39 },
        { x: 0, y: 1, tileId: 40 },
    ],
    large_tan_table: [
        { x: 0, y: 0, tileId: 21 },
        { x: 1, y: 0, tileId: 22 },
        { x: 2, y: 0, tileId: 23 },
        { x: 0, y: 1, tileId: 24 },
        { x: 1, y: 1, tileId: 25 },
        { x: 2, y: 1, tileId: 26 }
    ],
    large_tan_table_vert: [
        { x: 0, y: 0, tileId: 27 },
        { x: 0, y: 1, tileId: 28 },
        { x: 0, y: 2, tileId: 29 },
        { x: 1, y: 0, tileId: 30 },
        { x: 1, y: 1, tileId: 31 },
        { x: 1, y: 2, tileId: 32 }
    ],
    large_brown_endtable: [
        { x: 0, y: 0, tileId: 33 },
        { x: 0, y: 1, tileId: 34 },
        { x: 0, y: 2, tileId: 35 },
        { x: 1, y: 0, tileId: 36 },
        { x: 1, y: 1, tileId: 37 },
        { x: 1, y: 2, tileId: 38 }
    ],
    small_brown_endtable: [
        { x: 0, y: 0, tileId: 41 },
        { x: 0, y: 1, tileId: 42 },
    ],
    white_chair: [
        { x: 0, y: 0, tileId: 43 },
        { x: 0, y: 1, tileId: 44 },
    ],
    white_side_chair: [
        { x: 0, y: 0, tileId: 45 },
        { x: 0, y: 1, tileId: 46 },
    ],
    white_back_chair: [
        { x: 0, y: 0, tileId: 47 },
        { x: 0, y: 1, tileId: 48 },
    ],
    tan_chair: [
        { x: 0, y: 0, tileId: 49 },
        { x: 0, y: 1, tileId: 50 },
    ],
    tan_side_chair: [
        { x: 0, y: 0, tileId: 51 },
        { x: 0, y: 1, tileId: 52 },
    ],
    tan_back_chair: [
        { x: 0, y: 0, tileId: 53 },
        { x: 0, y: 1, tileId: 54 },
    ],
    brown_stool: [
        { x: 0, y: 0, tileId: 55 },
    ],
    small_tan_bookcase: [
        { x: 0, y: 0, tileId: 56 },
        { x: 1, y: 0, tileId: 57 },
        { x: 0, y: 1, tileId: 58 },
        { x: 1, y: 1, tileId: 59 },
    ],
    large_tan_bookcase: [
        { x: 0, y: 0, tileId: 60 },
        { x: 1, y: 0, tileId: 61 },
        { x: 2, y: 0, tileId: 62 },
        { x: 0, y: 1, tileId: 63 },
        { x: 1, y: 1, tileId: 64 },
        { x: 2, y: 1, tileId: 65 },
        { x: 0, y: 2, tileId: 66 },
        { x: 1, y: 2, tileId: 67 },
        { x: 2, y: 2, tileId: 68 },
    ],
    large_orange_bookcase: [
        { x: 0, y: 0, tileId: 69 },
        { x: 1, y: 0, tileId: 70 },
        { x: 2, y: 0, tileId: 71 },
        { x: 0, y: 1, tileId: 72 },
        { x: 1, y: 1, tileId: 73 },
        { x: 2, y: 1, tileId: 74 },
        { x: 0, y: 2, tileId: 75 },
        { x: 1, y: 2, tileId: 76 },
        { x: 2, y: 2, tileId: 77 },
    ],
    lamp: [
        { x: 0, y: 0, tileId: 78 },
        { x: 0, y: 1, tileId: 79 },
        { x: 0, y: 2, tileId: 80 },
    ],
    tan_hatstand: [
        { x: 0, y: 0, tileId: 81 },
        { x: 0, y: 1, tileId: 82 },
        { x: 0, y: 2, tileId: 83 },
    ],
    orange_clock: [
        { x: 0, y: 0, tileId: 84 },
        { x: 0, y: 1, tileId: 85 },
        { x: 0, y: 2, tileId: 86 },
        { x: 1, y: 0, tileId: 87 },
        { x: 1, y: 1, tileId: 88 },
        { x: 1, y: 2, tileId: 89 }
    ],
    orange_couch: [
        { x: 0, y: 0, tileId: 90 },
        { x: 1, y: 0, tileId: 91 },
        { x: 2, y: 0, tileId: 92 },
        { x: 3, y: 0, tileId: 93 },
        { x: 0, y: 1, tileId: 94 },
        { x: 1, y: 1, tileId: 95 },
        { x: 2, y: 1, tileId: 96 },
        { x: 3, y: 1, tileId: 97 }
    ],
};

class Block {
    constructor(shape, gridX, gridY, goals = []) {
        this.shape = shape;
        this.gridX = gridX;
        this.gridY = gridY;
        this.goals = goals; // Array of goal positions, e.g., [{x: 8, y: 1}, {x: 1, y: 1}] or just a single goal
        this.pixelX = gridX * TILE_SIZE;
        this.pixelY = gridY * TILE_SIZE;
        this.dragging = false;
        this.lastValidX = gridX;
        this.lastValidY = gridY;
    }

    getGridTiles(x = this.gridX, y = this.gridY) {
        return this.shape.map(p => ({
            x: x + p.x,
            y: y + p.y,
            tileId: p.tileId
        }));
    }
}


// ACTIVE BLOCKS IN THE LEVEL
let blocks = [];

function loadLevel(levelName) {
    const level = levels[levelName];

    currentMap = level.map;

    blocks = level.blocks.map(b =>
        new Block(SHAPES[b.shape], b.x, b.y, b.goals || [])
    );
}

let activeBlock = null;
let mouseOffset = { x: 0, y: 0 };
let currentMap;

function canPlaceBlock(block, testX, testY) {
    for (const t of block.getGridTiles(testX, testY)) {

        if ( // Check map boundaries and solid tiles
            t.x < 0 || t.y < 0 ||
            t.x >= MAP_WIDTH || t.y >= MAP_HEIGHT ||
            tiles[currentMap[t.y][t.x]]?.solid
        ) { 
            checkIfGate(block, testX, testY);
            return false;
        }

        for (const other of blocks) { // Check against other blocks
            if (other === block) continue;
            if (other.getGridTiles().some(o => o.x === t.x && o.y === t.y))
                return false;
        }
    }
    return true; 
}
let scoreBoard = document.getElementById("luggage-game-points");
function Scoreboard(block) {
    //TODO add a precondition to prevent this from being called multiple times for the same block.
    if (!block || block.scored) return;
    block.scored = true; // Mark this block as scored to prevent double scoring

    //get the number of tiles in the block, and add that to the score, this is just a placeholder scoring system, we can change it later to be more complex if we want, but for now this is good enough for testing
    points += block.shape.length; //temp
    //alert(block +" reached the gate! You earned " + block.shape.length + " points!"); //temp
    scoreBoard.innerText = "Points: " + points;
    
}

function checkIfGate(block, testX, testY) {
    for (const t of block.getGridTiles(testX, testY)) {
        const tileId = currentMap[t.y]?.[t.x];
        //alert("Grid X: " + block.gridX + "\nGrid Y: " + block.gridY + "\nGoal X: " + block.goals[0].x + "\nGoal Y: " + block.goals[0].y + "\nIf you have a second goal enable the next alert\n to remove this alert make sure mouse is in the middle of the screen\n and keep pressing enter\nor fix the bug where the alert is triggered when you hit a wall, which is really bad ngl,\nbut this is just for testing so its fine for now");
        //^^Useful for Testing^^
        reachedGoal = false;

        //check each possible goal for the block, if any of them are reached, then we can remove the block and end the level
        for (let i = 0; i < block.goals.length; i++) {
            const goal = block.goals[i];
            if (block.gridX === goal.x && block.gridY === goal.y) {
                reachedGoal = true;
                break;
            }
        }
        if (reachedGoal) {
            // TODO: exit animation (slide off screen)
            blocks = blocks.filter(b => b !== block); // b => b !== block, this means "keep all blocks that are not the current block", effectively removing the current block from the game
            Scoreboard(block);
            return;
        }
    }
}

function releaseBlock() {
    if (!activeBlock) return;

    activeBlock.gridX = activeBlock.lastValidX;
    activeBlock.gridY = activeBlock.lastValidY;
    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;

    activeBlock.dragging = false;
    activeBlock = null;
}

//start of game loop
function drawBlock(block) {
    for (const t of block.getGridTiles()) {
        drawTile(t.tileId, t.x, t.y);
    }
}

function drawActiveOutline(block) {
    if (!block.dragging) return;
    if (reachedGoal) return;

    const tiles = block.getGridTiles();

    // Find bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const t of tiles) {
        if (t.x < minX) minX = t.x;
        if (t.y < minY) minY = t.y;
        if (t.x > maxX) maxX = t.x;
        if (t.y > maxY) maxY = t.y;
    }

    const width = (maxX - minX + 1) * TILE_SIZE;
    const height = (maxY - minY + 1) * TILE_SIZE;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 1;
    ctx.shadowColor = "red";
    ctx.shadowBlur = 8;
    ctx.strokeRect(
        minX * TILE_SIZE,
        minY * TILE_SIZE,
        width,
        height
    );
    ctx.restore();
}

function getAvailableWidth() {
    const iframe = window.frameElement;

    if (iframe && iframe.clientWidth) {
        return iframe.clientWidth;
    }

    // fallback if not in iframe
    return window.innerWidth;
}

function resizeCanvas() {
    const parent = canvas.parentElement;
    const availableWidth = parent ? parent.clientWidth : window.innerWidth;

    const scale = availableWidth / canvas.width;

    canvas.style.width  = canvas.width  * scale + "px";
    canvas.style.height = canvas.height * scale + "px";
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    if (activeBlock) 
        drawActiveOutline(activeBlock);
    for (const block of blocks) 
        drawBlock(block);
    requestAnimationFrame(gameLoop);
}

//mouse movement listeners
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    reachedGoal = false; // reset for next block

    for (const block of blocks) {
        for (const t of block.getGridTiles()) {
            if (
                mx >= t.x * TILE_SIZE &&
                mx < (t.x + 1) * TILE_SIZE &&
                my >= t.y * TILE_SIZE &&
                my < (t.y + 1) * TILE_SIZE
            ) {
                activeBlock = block;
                block.dragging = true;
                mouseOffset.x = mx - block.pixelX;
                mouseOffset.y = my - block.pixelY;
                return;
            }
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!activeBlock || !activeBlock.dragging) return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / SCALE;
    const my = (e.clientY - rect.top) / SCALE;

    const desiredGridX = Math.round((mx - mouseOffset.x) / TILE_SIZE);
    const desiredGridY = Math.round((my - mouseOffset.y) / TILE_SIZE);

    if (canPlaceBlock(activeBlock, desiredGridX, desiredGridY)) {
        activeBlock.gridX = desiredGridX;
        activeBlock.gridY = desiredGridY;
        activeBlock.lastValidX = desiredGridX;
        activeBlock.lastValidY = desiredGridY;
    }

    activeBlock.pixelX = activeBlock.gridX * TILE_SIZE;
    activeBlock.pixelY = activeBlock.gridY * TILE_SIZE;
});

canvas.addEventListener("mouseup", releaseBlock);
canvas.addEventListener("mouseleave", releaseBlock);

window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "GAME_SELECTED") return;
    if (!event.data.level) return;

    if (event.data.level) {
        //alert("Level selected: " + event.data.level);
        loadLevel(event.data.level);
    }
});

document.getElementById("back-to-level-choice")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Level_Choice_Resources/level-choice.html",
        game: "Luggage" },
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

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas); //its just white if it happens to be called before the DOM is loaded

loadLevel("level1"); // this is needed to set the map, while the system waits for the message about level selected
//TODO: make level 1 or level 0 and tile/loading/unplayable but good looking level/screen

loadAllImages(() => {

    gameLoop();
});