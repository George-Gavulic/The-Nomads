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

// puzzleComboTimer
let timerInterval;
let comboMulti = 1;
let timeLeft = 0;

//const iframe = window.frameElement || window.parent.document.getElementById("game-panel-frame");
//const SCALE = iframe.clientWidth / (MAP_WIDTH * TILE_SIZE); //test
//alert("Calculated SCALE: " + SCALE);
canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;
canvas.style.width  = canvas.width  * SCALE + "px";
canvas.style.height = canvas.height * SCALE + "px";

let points = 0;
let currentLevel = "still set to default";
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
    housecorners: "/innercorners.png",
    gates: "/housegates.png",
};

const tileSheet = new Image();

// TILE DEFINITIONS
const tiles = {
    900:{ name:"voidtile", solid:true},
    964:{ name:"orangeLeftGateTop", solid:true, tileset:"gates", x:6, y:3 }, 
    965:{ name:"orangeLeftGateBottom", solid:true, tileset:"gates", x:6, y:4 },
    966:{ name:"orangeRightGateTop", solid:true, tileset:"gates", x:7, y:3 }, 
    967:{ name:"orangeRightGateBottom", solid:true, tileset:"gates", x:7, y:4 },
    968:{ name:"orangeBottomGateLeft", solid:true, tileset:"gates", x:6, y:2 }, 
    969:{ name:"orangeBottomGateRight", solid:true, tileset:"gates", x:7, y:2 },
    970:{ name:"orangeTopGateLeft", solid:true, tileset:"gates", x:6, y:1 }, 
    971:{ name:"orangeTopGateRight", solid:true, tileset:"gates", x:7, y:1 },

    972:{ name:"whiteLeftGateTop", solid:true, tileset:"gates", x:4, y:3 }, 
    973:{ name:"whiteLeftGateBottom", solid:true, tileset:"gates", x:4, y:4 },
    974:{ name:"whiteRightGateTop", solid:true, tileset:"gates", x:5, y:3 }, 
    975:{ name:"whiteRightGateBottom", solid:true, tileset:"gates", x:5, y:4 },
    976:{ name:"whiteBottomGateLeft", solid:true, tileset:"gates", x:4, y:2 }, 
    977:{ name:"whiteBottomGateRight", solid:true, tileset:"gates", x:5, y:2 },
    978:{ name:"whiteTopGateLeft", solid:true, tileset:"gates", x:4, y:1 }, 
    979:{ name:"whiteTopGateRight", solid:true, tileset:"gates", x:5, y:1 },

    980:{ name:"brownLeftGateTop", solid:true, tileset:"gates", x:2, y:3 }, 
    981:{ name:"brownLeftGateBottom", solid:true, tileset:"gates", x:2, y:4 },
    982:{ name:"brownRightGateTop", solid:true, tileset:"gates", x:3, y:3 }, 
    983:{ name:"brownRightGateBottom", solid:true, tileset:"gates", x:3, y:4 },
    984:{ name:"brownBottomGateLeft", solid:true, tileset:"gates", x:2, y:2 }, 
    985:{ name:"brownBottomGateRight", solid:true, tileset:"gates", x:3, y:2 },
    986:{ name:"brownTopGateLeft", solid:true, tileset:"gates", x:2, y:1 }, 
    987:{ name:"brownTopGateRight", solid:true, tileset:"gates", x:3, y:1 },

    988:{ name:"yellowLeftGateTop", solid:true, tileset:"gates", x:0, y:3 }, 
    989:{ name:"yellowLeftGateBottom", solid:true, tileset:"gates", x:0, y:4 },
    990:{ name:"yellowRightGateTop", solid:true, tileset:"gates", x:1, y:3 }, 
    991:{ name:"yellowRightGateBottom", solid:true, tileset:"gates", x:1, y:4 },
    992:{ name:"yellowBottomGateLeft", solid:true, tileset:"gates", x:0, y:2 }, 
    993:{ name:"yellowBottomGateRight", solid:true, tileset:"gates", x:1, y:2 },
    994:{ name:"yellowTopGateLeft", solid:true, tileset:"gates", x:0, y:1 }, 
    995:{ name:"yellowTopGateRight", solid:true, tileset:"gates", x:1, y:1 }, 

    996:{ name:"gateConnectorRight", solid:true, tileset:"gates", x:3, y:0 }, // connectors are to be used if a gate is greater than 2 tiles wide
    997:{ name:"gateConnectorLeft", solid:true, tileset:"gates", x:2, y:0 }, 
    998:{ name:"gateConnectorTop", solid:true, tileset:"gates", x:1, y:0 }, 
    999:{ name:"gateConnectorBottom", solid:true, tileset:"gates", x:0, y:0 }, 

    200: { name: "topLeftCorner", solid: true, tileset: "housefloors", x: 0, y: 0 },
    201: { name: "bottomLeftCorner", solid: true, tileset: "housefloors", x: 0, y: 8 },
    202: { name: "topRightCorner", solid: true,  tileset: "housefloors", x: 17, y: 0 },
    203: { name: "bottomRightCorner", solid: true, tileset: "housefloors", x: 17, y: 8 },
    204: { name: "leftWall", solid: true, tileset: "housefloors", x: 0, y: 1 },
    205: { name: "greenfloor", solid: false, tileset: "housefloors", x: 2, y: 2 },
    206: { name: "rightWall", solid: true, tileset: "housefloors", x: 17, y: 2 },
    207: { name: "topWall", solid: true, tileset: "housefloors", x: 9, y: 0 },
    208: { name: "bottomWall", solid: true, tileset: "housefloors", x: 16, y: 8 },
    209: { name: "brickfloor", solid: false, tileset: "housefloors", x: 14, y: 6 },
    210:{ name: "tilefloor", solid: false, tileset: "housefloors", x: 6, y: 6 },
    211:{ name: "woodfloor1a", solid: false, tileset: "housefloors", x: 2, y: 6 },
    212:{ name: "woodfloor1b", solid: false, tileset: "housefloors", x: 3, y: 6 },
    213:{ name: "woodfloor2a", solid: false, tileset:"housefloors", x: 10, y: 6 },
    214:{ name: "woodfloor2b", solid: false, tileset:"housefloors", x: 11, y: 6 },
    215:{ name: "innerUpperLeft", solid:true, tileset:"housecorners", x:0, y:0 },
    216:{ name: "innerBottomLeft", solid:true, tileset:"housecorners", x:1, y:0 },
    217:{ name: "innerUpperRight", solid:true, tileset:"housecorners", x:2, y:0 },
    218:{ name: "innerBottomRight", solid:true, tileset:"housecorners", x:3, y:0 },

    //Size-(Orientation)-Color-Piece-Object
    117:{ name:"SmallOrangeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:0 },
    118:{ name:"SmallOrangeTopRightEndtable", solid:true, tileset:"f1", x:1, y:0 },
    119:{ name:"SmallOrangeBottomLeftEndtable", solid:true, tileset:"f1", x:0, y:1 },
    120:{ name:"SmallOrangeBottomRightEndtable", solid:true, tileset:"f1", x:1, y:1 },

    121:{ name:"LargeTanTopLeftTable", solid:true, tileset:"f1", x:0, y:2 },
    122:{ name:"LargeTanTopMidTable", solid:true, tileset:"f1", x:1, y:2 },
    123:{ name:"LargeTanTopRightTable", solid:true, tileset:"f1", x:2, y:2 },
    124:{ name:"LargeTanBottomLeftTable", solid:true, tileset:"f1", x:0, y:3 },
    125:{ name:"LargeTanBottomMidTable", solid:true, tileset:"f1", x:1, y:3 },
    126:{ name:"LargeTanBottomRightTable", solid:true, tileset:"f1", x:2, y:3 },

    127:{ name:"LargeVertTanTopLeftTable", solid:true, tileset:"f1", x:0, y:4 },
    128:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:0, y:5 },
    129:{ name:"LargeVertTanTopRightTable", solid:true, tileset:"f1", x:0, y:6 },
    130:{ name:"LargeVertTanBottomLeftTable", solid:true, tileset:"f1", x:1, y:4 },
    131:{ name:"LargeVertTanLeftMidTable", solid:true, tileset:"f1", x:1, y:5 },
    132:{ name:"LargeVertTanBottomRightTable", solid:true, tileset:"f1", x:1, y:6 },

    133:{ name:"TallBrownLargeTopLeftEndtable", solid:true, tileset:"f1", x:0, y:7 },
    134:{ name:"TallBrownLeftMidEndtable", solid:true, tileset:"f1", x:0, y:8 },
    135:{ name:"TallBrownTopRightEndtable", solid:true, tileset:"f1", x:0, y:9 },
    136:{ name:"TallBrownBottomLeftEndtable", solid:true, tileset:"f1", x:1, y:7 },
    137:{ name:"TallBrownRightMidEndtable", solid:true, tileset:"f1", x:1, y:8 },
    138:{ name:"TallBrownBottomRightEndtable", solid:true, tileset:"f1", x:1, y:9 },

    139:{ name:"SmallOrangeSideTopEndtable", solid:true, tileset:"f1", x:2, y:0 },
    140:{ name:"SmallOrangeSideBottomEndtable", solid:true, tileset:"f1", x:2, y:1 },

    141:{ name:"SmallBrownTopEndtable", solid:true, tileset:"f1", x:3, y:0 },
    142:{ name:"SmallBrownBottomEndtable", solid:true, tileset:"f1", x:3, y:1 },

    143:{ name:"WhiteTopChair", solid:true, tileset:"f1", x:5, y:0 },
    144:{ name:"WhiteBottomChair", solid:true, tileset:"f1", x:5, y:1 },

    145:{ name:"WhiteSideTopChair", solid:true, tileset:"f1", x:6, y:0 },
    146:{ name:"WhiteSideBottomChair", solid:true, tileset:"f1", x:6, y:1 },

    147:{ name:"WhiteBackTopChair", solid:true, tileset:"f1", x:7, y:0 },
    148:{ name:"WhiteBackBottomChair", solid:true, tileset:"f1", x:7, y:1 },

    149:{ name:"TanTopChair", solid:true, tileset:"f1", x:8, y:0 },
    150:{ name:"TanBottomChair", solid:true, tileset:"f1", x:8, y:1 },

    151:{ name:"TanSideTopChair", solid:true, tileset:"f1", x:9, y:0 },
    152:{ name:"TanSideBottomChair", solid:true, tileset:"f1", x:9, y:1 },

    153:{ name:"TanBackTopChair", solid:true, tileset:"f1", x:10, y:0 },
    154:{ name:"TanBackBottomChair", solid:true, tileset:"f1", x:10, y:1 },

    155:{ name:"BrownTopStool", solid:true, tileset:"f1", x:12, y:1 },

    156:{ name:"SmallTanTopLeftBookcase", solid:true, tileset:"f1", x:3, y:2 },
    157:{ name:"SmallTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:2 },
    158:{ name:"SmallTanBottomLeftBookcase", solid:true, tileset:"f1", x:3, y:3 },
    159:{ name:"SmallTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:3 },
    
    160:{ name:"LargeTanTopLeftBookcase", solid:true, tileset:"f1", x:2, y:4 },
    161:{ name:"LargeTanTopMidBookcase", solid:true, tileset:"f1", x:3, y:4 },
    162:{ name:"LargeTanTopRightBookcase", solid:true, tileset:"f1", x:4, y:4 },
    163:{ name:"LargeTanMiddleLeftBookcase", solid:true, tileset:"f1", x:2, y:5 },
    164:{ name:"LargeTanMiddleBookcase", solid:true, tileset:"f1", x:3, y:5 },
    165:{ name:"LargeTanMiddleRightBookcase", solid:true, tileset:"f1", x:4, y:5 },
    166:{ name:"LargeTanBottomLeftBookcase", solid:true, tileset:"f1", x:2, y:6 },
    167:{ name:"LargeTanBottomMidBookcase", solid:true, tileset:"f1", x:3, y:6 },
    168:{ name:"LargeTanBottomRightBookcase", solid:true, tileset:"f1", x:4, y:6 },

    169:{ name:"LargeOrangeTopLeftBookcase", solid:true, tileset:"f1", x:6, y:4 },
    170:{ name:"LargeOrangeTopMidBookcase", solid:true, tileset:"f1", x:7, y:4 },
    171:{ name:"LargeOrangeTopRightBookcase", solid:true, tileset:"f1", x:8, y:4 },
    172:{ name:"LargeOrangeMiddleLeftBookcase", solid:true, tileset:"f1", x:6, y:5 },
    173:{ name:"LargeOrangeMiddleBookcase", solid:true, tileset:"f1", x:7, y:5 },
    174:{ name:"LargeOrangeMiddleRightBookcase", solid:true, tileset:"f1", x:8, y:5 },
    175:{ name:"LargeOrangeBottomLeftBookcase", solid:true, tileset:"f1", x:6, y:6 },
    176:{ name:"LargeOrangeBottomMidBookcase", solid:true, tileset:"f1", x:7, y:6 },
    177:{ name:"LargeOrangeBottomRightBookcase", solid:true, tileset:"f1", x:8, y:6 },

    178:{ name:"TopLamp", solid:true, tileset:"f1", x:6, y:7 },
    179:{ name:"MiddleLamp", solid:true, tileset:"f1", x:6, y:8 },
    180:{ name:"BottomLamp", solid:true, tileset:"f1", x:6, y:9 },

    181:{ name:"TanTopHatstand", solid:true, tileset:"f1", x:3, y:7 },
    182:{ name:"TanMiddleHatstand", solid:true, tileset:"f1", x:3, y:8 },
    183:{ name:"TanBottomHatstand", solid:true, tileset:"f1", x:3, y:9 },

    184:{ name:"OrangeTopLeftClock", solid:true, tileset:"f1", x:4, y:7 },
    185:{ name:"OrangeBrownLeftMidClock", solid:true, tileset:"f1", x:4, y:8 },
    186:{ name:"OrangeTopRightClock", solid:true, tileset:"f1", x:4, y:9 },
    187:{ name:"OrangeBottomLeftClock", solid:true, tileset:"f1", x:5, y:7 },
    188:{ name:"OrangeRightMidClock", solid:true, tileset:"f1", x:5, y:8 },
    189:{ name:"OrangeBottomRightClock", solid:true, tileset:"f1", x:5, y:9 },

    190:{ name:"OrangeTopLeftCouch", solid:true, tileset:"f1", x:5, y:10 },
    191:{ name:"OrangeTopLMidCouch", solid:true, tileset:"f1", x:6, y:10 },
    192:{ name:"OrangeTopRMidCouch", solid:true, tileset:"f1", x:7, y:10 },
    193:{ name:"OrangeTopRightCouch", solid:true, tileset:"f1", x:8, y:10 },
    194:{ name:"OrangeBottomLeftCouch", solid:true, tileset:"f1", x:5, y:11 },
    195:{ name:"OrangeBottomLMidCouch", solid:true, tileset:"f1", x:6, y:11 },
    196:{ name:"OrangeBottomRMidCouch", solid:true, tileset:"f1", x:7, y:11 },
    197:{ name:"OrangeBottomRightCouch", solid:true, tileset:"f1", x:8, y:11 },

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
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [200,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,980],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,981],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
        ],
        blocks: [
            { shape: "small_orange_endtable", x: 1, y: 3, goals: [{x: 23, y: 3}], highlight: "orange" },
        ]
    },

    level2: { 
        map:    [ 
            [200,207,207,207,207,207,202,900,900,900,900,900,900,900,200,207,207,207,207,207,207,207,207,207,207,202],
            [204,205,205,205,205,205,206,900,900,900,900,900,900,900,204,205,205,205,205,205,205,205,205,205,205,206],
            [204,205,205,205,205,205,216,207,207,207,207,207,207,202,204,205,205,205,205,205,205,205,205,205,205,206],
            [201,208,208,217,205,205,205,205,205,205,205,205,205,206,204,205,205,215,208,208,208,208,217,205,205,206],
            [900,900,900,204,205,205,205,205,205,205,205,205,205,206,204,205,205,206,900,900,900,900,204,205,205,216],
            [900,900,900,201,208,208,208,208,208,208,217,205,205,206,204,205,205,206,900,900,900,900,204,205,205,980],
            [900,900,900,900,900,900,900,900,900,900,204,205,205,216,218,205,205,206,900,900,900,900,204,205,205,981],
            [900,900,900,900,900,900,900,900,900,900,204,205,205,205,205,205,205,206,900,900,900,900,201,208,208,208],
            [900,900,900,900,900,900,900,900,900,900,204,205,205,205,205,205,205,206,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,201,208,208,208,208,208,208,203,900,900,900,900,900,900,900,900],
        ],
        blocks: [
            { shape: "small_orange_endtable", x: 1, y: 1, goals: [{x: 23, y: 5}], highlight: "orange"},
        ]
    },


    level3: {
        map:    [
            [200,207,207,207,207,207,207,207,970,998,998,971,207,207,207,207,207,202,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,972,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,973,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203,900,900,900,900,900,900,900,900],
        ],
        blocks: [
            { shape: "orange_couch", x: 6, y: 4, goals: [{x: 8, y: 1},{x: 9, y: 1},{x: 10, y: 1},{x: 11, y: 1}], highlight: "orange" },
            { shape: "large_tan_table", x: 7, y: 2, goals: [{x: 14, y: 3}], highlight: "yellow" },
            { shape: "small_tan_bookcase", x: 10, y: 4, goals: [{x: 15, y: 3}], highlight: "yellow" },
            { shape: "white_side_chair", x: 15, y: 5, goals: [{x: 16, y: 3}], highlight: "white" },
        ]
    },
    level4: {
        map:    [
            [200,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,210,972,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,210,973,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [966,209,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [996,209,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [967,209,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206,900,900,900,900,900,900],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203,900,900,900,900,900,900],
        ],
        blocks: [
            { shape: "large_tan_table_vert", x: 4, y: 2, goals: [{x: 1, y: 6}], highlight: "yellow" },
            { shape: "white_chair", x: 2, y: 3, goals: [{x: 18, y: 3}], highlight: "white" },
            { shape: "white_side_chair", x: 12, y: 2, goals: [{x: 18, y: 3}], highlight: "white" },
            { shape: "white_chair", x: 13, y: 3, goals: [{x: 18, y: 3}], highlight: "white" },
            { shape: "white_side_chair", x: 12, y: 4, goals: [{x: 18, y: 3}], highlight: "white" },
            { shape: "white_side_chair", x: 14, y: 5, goals: [{x: 18, y: 3}], highlight: "white" },
        ]
    },
    
    level5: {
        map:    [
            [900,900,900,200,207,207,207,207,207,207,207,207,207,207,986,998,987,207,207,207,202,200,978,979,207,202],
            [900,900,900,204,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,206],
            [900,900,900,204,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,988],
            [200,207,207,218,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,997],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,989],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,205,205,205,205,205,205,216,218,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],

        ],
        blocks: [
            { shape: "large_tan_table", x: 22, y: 1, goals: [{x: 14, y: 1}], highlight: "brown" },
            { shape: "large_tan_table_vert", x: 23, y: 3, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "white_side_chair", x: 22, y: 2, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 3, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 4, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 5, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "lamp", x: 17, y: 4, goals: [{x: 24, y: 2}], highlight: "yellow" },
            { shape: "large_tan_table_vert", x: 18, y: 2, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "white_side_chair", x: 17, y: 2, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" }
        ]
    },

    level6: {
        map:    [
            [200,207,207,207,207,207,207,207,207,978,979,207,207,207,207,207,207,207,207,207,207,202,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [204,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,209,206,900,900,900,900],
            [201,208,208,208,968,969,208,208,208,208,208,208,208,208,208,208,984,999,985,208,208,203,900,900,900,900],

        ],
        blocks: [
            { shape: "small_orange_endtable", x: 2, y: 1, goals: [{x: 16, y: 7},{x: 17, y: 7},{x: 18, y: 7}], highlight: "orange" },
            { shape: "large_tan_table_vert", x: 3, y: 3, goals: [{x: 4, y: 6},{x: 5, y: 6}], highlight: "yellow" },
            { shape: "white_back_chair", x: 15, y: 1, goals: [{x: 9, y: 1},{x: 10, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 12, y: 3, goals: [{x: 9, y: 1},{x: 10, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 10, y: 4, goals: [{x: 9, y: 1},{x: 10, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 17, y: 2, goals: [{x: 9, y: 1},{x: 10, y: 1}], highlight: "white" },
            { shape: "lamp", x: 7, y: 4, goals: [{x: 4, y: 6},{x: 5, y: 6}], highlight: "yellow" },
            { shape: "large_orange_bookcase", x: 2, y: 6, goals: [{x: 16, y: 6},{x: 17, y: 6},{x: 18, y: 6}], highlight: "orange" },
            { shape: "white_back_chair", x: 7, y: 7, goals: [{x: 9, y: 1},{x: 10, y: 1}], highlight: "white" },
            { shape: "lamp", x: 15, y: 5, goals: [{x: 4, y: 6},{x: 5, y: 6}], highlight: "yellow" },
            { shape: "large_tan_table_vert", x: 16, y: 4, goals: [{x: 4, y: 6},{x: 5, y: 6}], highlight: "yellow" },
        ]
    },

    level7: {
        map:    [
            [200,207,207,207,207,207,207,207,207,207,207,207,970,971,207,202,900,900,900,900,900,900,900,900,900,900], //yellow gate: goals: [{x: 12, y: 1},{x: 13, y: 1}]
            [204,211,212,211,212,211,212,211,212,211,212,211,212,211,212,206,900,900,900,900,900,900,900,900,900,900], //white gate: goals: [{x: 1, y: 2},{x: 1, y: 3}]
            [974,213,214,213,214,213,214,213,214,213,214,213,214,213,214,206,900,900,900,900,900,900,900,900,900,900], //brown gate: goals: [{x: 18, y: 5},{x: 18, y: 6},{x: 18, y: 7}]
            [975,211,212,211,212,211,212,211,212,211,212,211,212,211,212,206,900,900,900,900,900,900,900,900,900,900],
            [204,213,214,213,214,213,214,213,214,213,214,213,214,213,214,216,207,207,207,207,202,900,900,900,900,900],
            [204,211,212,211,212,211,212,211,212,211,212,211,212,211,212,209,209,209,209,209,980,900,900,900,900,900],
            [204,213,214,213,214,213,214,213,214,213,214,213,214,213,214,209,209,209,209,209,997,900,900,900,900,900],
            [204,211,212,211,212,211,212,211,212,211,212,211,212,211,212,209,209,209,209,209,981,900,900,900,900,900],
            [204,213,214,213,214,213,214,213,214,213,214,213,214,213,214,215,208,208,208,208,203,900,900,900,900,900],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203,900,900,900,900,900,900,900,900,900,900],

        ],
        blocks: [
            { shape: "large_brown_endtable", x: 1, y: 1, goals: [{x: 18, y: 5},{x: 18, y: 6}], highlight: "brown" },
            { shape: "large_tan_table_vert", x: 18, y: 5, goals: [{x: 12, y: 1},{x: 13, y: 1}], highlight: "yellow" },
            { shape: "white_side_chair", x: 17, y: 5, goals: [{x: 1, y: 2}], highlight: "white" },
            { shape: "large_tan_table_vert", x: 15, y: 5, goals: [{x: 12, y: 1},{x: 13, y: 1}], highlight: "yellow" },
            { shape: "large_orange_bookcase", x: 12, y: 6, goals: [{x: 17, y: 5}], highlight: "orange" },
            { shape: "white_chair", x: 12, y: 2, goals: [{x: 1, y: 2}], highlight: "white" },
            { shape: "orange_clock", x: 10, y: 3, goals: [{x: 18, y: 5}], highlight: "orange" },
        ]
    },

    level8: {
        map:    [
            [900,900,900,900,900,900,900,900,900,900,200,970,998,971,202,900,900,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,900,900,204,205,205,205,206,900,900,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,200,207,218,205,205,205,216,207,202,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,974,205,205,205,205,205,205,205,988,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,996,205,205,205,205,205,205,205,997,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,975,205,205,205,205,205,205,205,989,900,800,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,201,208,217,205,205,205,215,208,203,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,204,205,205,205,206,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,201,984,999,985,203,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],

        ],
        blocks: [
            { shape: "large_brown_endtable", x: 11, y: 1, goals: [{x: 11, y: 5},{x: 12, y: 5}], highlight: "brown" },
            { shape: "brown_stool", x: 13, y: 1, goals: [{x: 11, y: 7},{x: 12, y: 7},{x: 13, y: 7}], highlight: "brown" },
            { shape: "brown_stool", x: 9, y: 3, goals: [{x: 11, y: 7},{x: 12, y: 7},{x: 13, y: 7}], highlight: "brown" },
            { shape: "tan_side_chair", x: 9, y: 4, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "tan_back_chair", x: 12, y: 6, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "large_tan_table", x: 10, y: 4, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "white_chair", x: 15, y: 4, goals: [{x: 9, y: 3},{x: 9, y: 4}], highlight: "white" },
            { shape: "lamp", x: 13, y: 5, goals: [{x: 15, y: 3}], highlight: "yellow" },
        ]
    },

    level9: {
        map:    [
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900], 
            [200,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202,900,900], 
            [204,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,206,900,900], 
            [974,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,980,900,900],
            [996,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,997,900,900],
            [975,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,981,900,900],
            [204,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,214,213,206,900,900],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],

        ],
        blocks: [
            { shape: "white_chair", x: 15, y: 4, goals: [{x: 1, y: 3},{x: 1, y: 4}], highlight: "white" },
            { shape: "white_side_chair", x: 17, y: 5, goals: [{x: 1, y: 3},{x: 1, y: 4}], highlight: "white" },
            { shape: "lamp", x: 7, y: 4, goals: [{x: 1, y: 3}], highlight: "yellow" },
            { shape: "brown_stool", x: 2, y: 3, goals: [{x: 22, y: 3},{x: 22, y: 4},{x: 22, y: 5}], highlight: "brown" },
            { shape: "brown_stool", x: 1, y: 5, goals: [{x: 22, y: 3},{x: 22, y: 4},{x: 22, y: 5}], highlight: "brown" },
            { shape: "large_brown_endtable", x: 16, y: 2, goals: [{x: 21, y: 3}], highlight: "brown" },
            { shape: "orange_clock", x: 10, y: 3, goals: [{x: 21, y: 3}], highlight: "orange" },
        ]
    },

    level10: {
        map:    [
            [900,200,207,207,970,971,207,207,202,900,900,900,900,900,900,900,900,200,207,207,994,995,207,207,202,900], 
            [900,204,210,210,209,209,210,210,206,900,900,900,900,900,900,900,900,204,210,210,205,205,210,210,206,900], 
            [900,204,210,210,210,210,210,210,216,207,207,207,207,207,207,207,207,218,210,210,210,210,210,210,206,900], 
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [200,218,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,216,202],
            [974,213,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,211,980],
            [975,213,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,211,981],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],

        ],
        blocks: [
            { shape: "lamp", x: 7, y: 4, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_tan_bookcase", x: 2, y: 3, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "lamp", x: 4, y: 3, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_tan_bookcase", x: 3, y: 6, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_brown_endtable", x: 16, y: 3, goals: [{x: 24, y: 7}], highlight: "brown" }, //brown gate
            { shape: "small_brown_endtable", x: 1, y: 7, goals: [{x: 24, y: 7}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 12, y: 7, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 13, y: 6, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 16, y: 8, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 20, y: 1, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "large_tan_table", x: 13, y: 7, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table", x: 19, y: 2, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table", x: 4, y: 1, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "white_side_chair", x: 18, y: 1, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table_vert", x: 19, y: 5, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
            { shape: "orange_clock", x: 17, y: 3, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
            { shape: "orange_clock", x: 10, y: 3, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
        ]
    },

    level11: { 
        map:    [
            [200,207,207,986,987,207,207,202,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900], 
            [204,213,214,213,214,213,214,206,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900], 
            [204,213,214,213,214,213,214,206,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900], 
            [204,213,214,213,214,213,214,206,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],
            [204,205,205,205,205,205,205,216,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,210,988],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,210,989],
            [204,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,206],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],

        ],
        blocks: [
            { shape: "large_tan_table_vert", x: 19, y: 5, goals: [{x: 3, y: 1}], highlight: "brown" }, //orange gate
            { shape: "brown_stool", x: 19, y: 8, goals: [{x: 3, y: 1},{x: 4, y: 1}], highlight: "brown" },
            { shape: "brown_stool", x: 20, y: 8, goals: [{x: 3, y: 1},{x: 4, y: 1}], highlight: "brown" },
            { shape: "white_chair", x: 15, y: 5, goals: [{x: 24, y: 6}], highlight: "yellow" },
            { shape: "white_side_chair", x: 17, y: 5, goals: [{x: 24, y: 6}], highlight: "yellow" },
            { shape: "white_side_chair", x: 7, y: 7, goals: [{x: 24, y: 6}], highlight: "yellow" },
            { shape: "brown_stool", x: 16, y: 5, goals: [{x: 3, y: 1},{x: 4, y: 1}], highlight: "brown" },
            { shape: "large_tan_table", x: 15, y: 7, goals: [{x: 22, y: 6}], highlight: "yellow" },
            { shape: "large_tan_table", x: 3, y: 3, goals: [{x: 22, y: 6}], highlight: "yellow" },
            { shape: "large_tan_table", x: 6, y: 5, goals: [{x: 22, y: 6}], highlight: "yellow" },
            { shape: "orange_clock", x: 2, y: 6, goals: [{x: 3, y: 1}], highlight: "brown" },
        ]
    },

    level12: { 
        map:    [
            [200,207,207,207,207,978,998,979,207,207,207,207,202,200,207,207,207,207,986,998,987,207,207,207,207,202], 
            [204,211,212,211,212,211,212,211,212,211,212,211,206,204,213,214,213,214,213,214,213,214,213,214,213,206], 
            [204,211,212,211,212,211,212,211,212,211,212,211,216,218,213,214,213,214,213,214,213,214,213,214,213,206], 
            [204,211,212,211,212,211,212,211,212,211,212,211,210,210,213,214,213,214,213,214,213,214,213,214,213,206],
            [204,211,212,211,212,211,212,211,212,211,212,211,210,210,213,214,213,214,213,214,213,214,213,214,213,206],
            [204,211,212,211,212,211,212,211,212,211,212,211,210,210,213,214,213,214,213,214,213,214,213,214,213,206],
            [204,211,212,211,212,211,212,211,212,211,212,211,210,210,213,214,213,214,213,214,213,214,213,214,213,206],
            [204,211,212,211,212,211,212,211,212,211,212,211,215,217,213,214,213,214,213,214,213,214,213,214,213,206],
            [204,211,212,211,212,211,212,211,212,211,212,211,206,204,213,214,213,214,213,214,213,214,213,214,213,206],
            [201,208,208,208,208,992,999,993,208,208,208,208,203,201,208,208,208,208,968,999,969,208,208,208,208,203],

        ],
        blocks: [
                { shape: "orange_clock", x: 2, y: 6, goals: [{x: 18, y: 6}, {x: 19, y: 6}], highlight: "orange" },
                { shape: "orange_clock", x: 8, y: 1, goals: [{x: 18, y: 6}, {x: 19, y: 6}], highlight: "orange" },
                { shape: "orange_clock", x: 6, y: 3, goals: [{x: 18, y: 1}, {x: 19, y: 1}], highlight: "brown" },
                { shape: "large_tan_table_vert", x: 12, y: 4, goals: [{x: 5, y: 1}, {x: 6, y: 1}], highlight: "white" },
                { shape: "large_tan_table_vert", x: 22, y: 2, goals: [{x: 5, y: 1}, {x: 6, y: 1}], highlight: "white" },
                { shape: "large_tan_table_vert", x: 15, y: 6, goals: [{x: 5, y: 6}, {x: 6, y: 6}], highlight: "yellow" },
                { shape: "brown_stool", x: 12, y: 3, goals: [{x: 18, y: 1},{x: 19, y: 1},{x: 20, y: 1}], highlight: "brown" },
                { shape: "brown_stool", x: 13, y: 3, goals: [{x: 18, y: 1},{x: 19, y: 1},{x: 20, y: 1}], highlight: "brown" },
                { shape: "white_side_chair", x: 11, y: 4, goals: [{x: 5, y: 7},{x: 6, y: 7},{x: 7, y: 7}], highlight: "yellow" },
                { shape: "white_chair", x: 14, y: 5, goals: [{x: 5, y: 7},{x: 6, y: 7},{x: 7, y: 7}], highlight: "yellow" },
                { shape: "white_chair", x: 17, y: 7, goals: [{x: 5, y: 1},{x: 6, y: 1},{x: 7, y: 1}], highlight: "white" },
        ]
    },

    level13: { 
        map:    [
            [200,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,202,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,972,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,997,900,900,900,900,900,900],
            [204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,973,900,900,900,900,900,900],
            [966,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900],
            [996,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900],
            [967,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900,900,900,900,900,900],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203,900,900,900,900,900,900],

        ],
        blocks: [
            { shape: "orange_clock", x: 12, y: 4, goals: [{x: 1, y: 6}], highlight: "orange" },
            { shape: "orange_couch", x: 10, y: 2, goals: [{x: 1, y: 6},{x: 1, y: 7}], highlight: "orange" },
            { shape: "orange_clock", x: 3, y: 5, goals: [{x: 1, y: 6}], highlight: "orange" },
            { shape: "orange_couch", x: 12, y: 7, goals: [{x: 1, y: 6},{x: 1, y: 7}], highlight: "orange" },
            { shape: "orange_clock", x: 10, y: 6, goals: [{x: 1, y: 6}], highlight: "orange" },
            { shape: "orange_clock", x: 16, y: 4, goals: [{x: 1, y: 6}], highlight: "orange" },
            { shape: "orange_couch", x: 2, y: 3, goals: [{x: 1, y: 6},{x: 1, y: 7}], highlight: "orange" },
            { shape: "large_tan_table_vert", x: 1, y: 6, goals: [{x: 17, y: 3}], highlight: "white" },
            { shape: "large_tan_table_vert", x: 6, y: 4, goals: [{x: 17, y: 3}], highlight: "white" },
            { shape: "large_tan_table_vert", x: 14, y: 2, goals: [{x: 17, y: 3}], highlight: "white" },
            { shape: "large_tan_table", x: 7, y: 2, goals: [{x: 16, y: 3},{x: 16, y: 4}], highlight: "white" },
            { shape: "large_tan_table", x: 6, y: 7, goals: [{x: 16, y: 3},{x: 16, y: 4}], highlight: "white" },
            { shape: "white_chair", x: 1, y: 1, goals: [{x: 18, y: 3},{x: 18, y: 4}], highlight: "white" },
            { shape: "white_chair", x: 8, y: 5, goals: [{x: 18, y: 3},{x: 18, y: 4}], highlight: "white" },
            { shape: "white_chair", x: 18, y: 2, goals: [{x: 18, y: 3},{x: 18, y: 4}], highlight: "white" },
        ]
    },

    level14: { 
        map:    [
            [900,200,207,207,970,971,207,207,202,900,900,900,900,900,900,900,900,200,207,207,994,995,207,207,202,900], 
            [900,204,210,210,209,209,210,210,206,900,900,900,900,900,900,900,900,204,210,210,205,205,210,210,206,900], 
            [900,204,210,210,210,210,210,210,216,207,207,207,207,207,207,207,207,218,210,210,210,210,210,210,206,900], 
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [900,204,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,206,900],
            [200,218,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,210,216,202],
            [974,213,210,210,210,210,210,210,215,208,208,208,208,208,208,208,208,217,210,210,210,210,210,210,211,980],
            [975,213,210,210,210,210,210,210,206,900,900,900,900,900,900,900,900,204,210,210,210,210,210,210,211,981],
            [201,208,208,208,208,208,208,208,203,900,900,900,900,900,900,900,900,201,208,208,208,208,208,208,208,203],

        ],
        blocks: [
            { shape: "lamp", x: 7, y: 4, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_tan_bookcase", x: 2, y: 3, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "lamp", x: 4, y: 3, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_tan_bookcase", x: 22, y: 6, goals: [{x: 20, y: 1}, {x: 21, y: 1}], highlight: "yellow" }, //yellow gate
            { shape: "small_brown_endtable", x: 16, y: 3, goals: [{x: 24, y: 7}], highlight: "brown" }, //brown gate
            { shape: "small_brown_endtable", x: 18, y: 7, goals: [{x: 24, y: 7}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 5, y: 6, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 13, y: 4, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 16, y: 5, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "brown_stool", x: 20, y: 1, goals: [{x: 24, y: 7},{x: 24, y: 8}], highlight: "brown" }, //brown gate
            { shape: "large_tan_table", x: 13, y: 4, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table", x: 19, y: 2, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table", x: 4, y: 1, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "white_side_chair", x: 18, y: 1, goals: [{x: 1, y: 7}], highlight: "white" }, //white gate
            { shape: "large_tan_table_vert", x: 19, y: 5, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
            { shape: "orange_clock", x: 17, y: 3, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
            { shape: "orange_clock", x: 10, y: 3, goals: [{x: 4, y: 1}], highlight: "orange" }, //orange gate
        ]
    },

    level15: { 
            map:    [
            [900,900,900,200,207,207,207,207,207,207,207,207,207,207,986,998,987,207,207,207,202,200,978,979,207,202],
            [900,900,900,204,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,206],
            [900,900,900,204,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,988],
            [200,207,207,218,214,213,214,213,214,213,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,997],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,205,205,205,205,205,205,206,204,209,209,209,989],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,205,205,205,205,205,205,216,218,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [204,205,205,205,205,205,205,205,205,205,214,213,214,213,214,213,214,213,214,213,214,213,209,209,209,206],
            [201,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,203],

        ],
        blocks: [
            { shape: "large_tan_table", x: 22, y: 1, goals: [{x: 14, y: 1}], highlight: "brown" },
            { shape: "large_tan_table", x: 12, y: 5, goals: [{x: 14, y: 1}], highlight: "brown" },
            { shape: "large_tan_table", x: 10, y: 7, goals: [{x: 14, y: 1}], highlight: "brown" },
            { shape: "large_tan_table", x: 5, y: 3, goals: [{x: 14, y: 1}], highlight: "brown" },
            { shape: "large_tan_table_vert", x: 23, y: 3, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "large_tan_table_vert", x: 23, y: 6, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "large_tan_table_vert", x: 3, y: 5, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "white_side_chair", x: 22, y: 2, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 4, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 5, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 22, y: 7, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 2, y: 5, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_side_chair", x: 2, y: 6, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 5, y: 1, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 7, y: 1, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 12, y: 3, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "white_chair", x: 14, y: 3, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" },
            { shape: "lamp", x: 17, y: 4, goals: [{x: 24, y: 2}], highlight: "yellow" },
            { shape: "lamp", x: 7, y: 6, goals: [{x: 24, y: 2}], highlight: "yellow" },
            { shape: "lamp", x: 1, y: 5, goals: [{x: 24, y: 2}], highlight: "yellow" },
            { shape: "lamp", x: 15, y: 1, goals: [{x: 24, y: 2}], highlight: "yellow" },
            { shape: "large_tan_table_vert", x: 18, y: 2, goals: [{x: 14, y: 1},{x: 15, y: 1}], highlight: "brown" },
            { shape: "white_side_chair", x: 17, y: 2, goals: [{x: 22, y: 1},{x: 23, y: 1}], highlight: "white" }
        ]
    },

    level16: { 
        map:    [
            [900,900,900,900,900,900,900,900,900,900,200,970,998,971,202,900,900,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,900,900,204,210,210,210,206,900,900,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,200,207,218,210,210,210,216,207,202,900,900,900,900,900,900,900,900,900], 
            [900,900,900,900,900,900,900,900,974,210,210,210,210,210,210,210,988,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,996,210,210,210,210,210,210,210,997,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,975,210,210,210,210,210,210,210,989,900,800,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,201,208,217,210,210,210,215,208,203,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,204,210,210,210,206,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,201,984,999,985,203,900,900,900,900,900,900,900,900,900,900,900],
            [900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900],

        ],
        blocks: [
            { shape: "large_brown_endtable", x: 11, y: 1, goals: [{x: 11, y: 5},{x: 12, y: 5}], highlight: "brown" },
            { shape: "brown_stool", x: 13, y: 7, goals: [{x: 11, y: 7},{x: 12, y: 7},{x: 13, y: 7}], highlight: "brown" },
            { shape: "brown_stool", x: 9, y: 3, goals: [{x: 11, y: 7},{x: 12, y: 7},{x: 13, y: 7}], highlight: "brown" },
            { shape: "tan_side_chair", x: 11, y: 6, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "tan_back_chair", x: 12, y: 6, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "tan_back_chair", x: 9, y: 4, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "large_tan_table", x: 13, y: 4, goals: [{x: 11, y: 1},{x: 12, y: 1},{x: 13, y: 1}], highlight: "orange" },
            { shape: "white_chair", x: 12, y: 4, goals: [{x: 9, y: 3},{x: 9, y: 4}], highlight: "white" },
            { shape: "lamp", x: 13, y: 1, goals: [{x: 15, y: 3}], highlight: "yellow" },
        ]
    },
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
    //size-color-object-orientation
    small_orange_endtable: [
        { x: 0, y: 0, tileId: 117 },
        { x: 1, y: 0, tileId: 118 },
        { x: 0, y: 1, tileId: 119 },
        { x: 1, y: 1, tileId: 120 }
    ],
    small_orange_endtable_side: [
        { x: 0, y: 0, tileId: 139 },
        { x: 0, y: 1, tileId: 140 },
    ],
    large_tan_table: [
        { x: 0, y: 0, tileId: 121 },
        { x: 1, y: 0, tileId: 122 },
        { x: 2, y: 0, tileId: 123 },
        { x: 0, y: 1, tileId: 124 },
        { x: 1, y: 1, tileId: 125 },
        { x: 2, y: 1, tileId: 126 }
    ],
    large_tan_table_vert: [
        { x: 0, y: 0, tileId: 127 },
        { x: 0, y: 1, tileId: 128 },
        { x: 0, y: 2, tileId: 129 },
        { x: 1, y: 0, tileId: 130 },
        { x: 1, y: 1, tileId: 131 },
        { x: 1, y: 2, tileId: 132 }
    ],
    large_brown_endtable: [
        { x: 0, y: 0, tileId: 133 },
        { x: 0, y: 1, tileId: 134 },
        { x: 0, y: 2, tileId: 135 },
        { x: 1, y: 0, tileId: 136 },
        { x: 1, y: 1, tileId: 137 },
        { x: 1, y: 2, tileId: 138 }
    ],
    small_brown_endtable: [
        { x: 0, y: 0, tileId: 141 },
        { x: 0, y: 1, tileId: 142 },
    ],
    white_chair: [
        { x: 0, y: 0, tileId: 143 },
        { x: 0, y: 1, tileId: 144 },
    ],
    white_side_chair: [
        { x: 0, y: 0, tileId: 145 },
        { x: 0, y: 1, tileId: 146 },
    ],
    white_back_chair: [
        { x: 0, y: 0, tileId: 147 },
        { x: 0, y: 1, tileId: 148 },
    ],
    tan_chair: [
        { x: 0, y: 0, tileId: 149 },
        { x: 0, y: 1, tileId: 150 },
    ],
    tan_side_chair: [
        { x: 0, y: 0, tileId: 151 },
        { x: 0, y: 1, tileId: 152 },
    ],
    tan_back_chair: [
        { x: 0, y: 0, tileId: 153 },
        { x: 0, y: 1, tileId: 154 },
    ],
    brown_stool: [
        { x: 0, y: 0, tileId: 155 },
    ],
    small_tan_bookcase: [
        { x: 0, y: 0, tileId: 156 },
        { x: 1, y: 0, tileId: 157 },
        { x: 0, y: 1, tileId: 158 },
        { x: 1, y: 1, tileId: 159 },
    ],
    large_tan_bookcase: [
        { x: 0, y: 0, tileId: 160 },
        { x: 1, y: 0, tileId: 161 },
        { x: 2, y: 0, tileId: 162 },
        { x: 0, y: 1, tileId: 163 },
        { x: 1, y: 1, tileId: 164 },
        { x: 2, y: 1, tileId: 165 },
        { x: 0, y: 2, tileId: 166 },
        { x: 1, y: 2, tileId: 167 },
        { x: 2, y: 2, tileId: 168 },
    ],
    large_orange_bookcase: [
        { x: 0, y: 0, tileId: 169 },
        { x: 1, y: 0, tileId: 170 },
        { x: 2, y: 0, tileId: 171 },
        { x: 0, y: 1, tileId: 172 },
        { x: 1, y: 1, tileId: 173 },
        { x: 2, y: 1, tileId: 174 },
        { x: 0, y: 2, tileId: 175 },
        { x: 1, y: 2, tileId: 176 },
        { x: 2, y: 2, tileId: 177 },
    ],
    lamp: [
        { x: 0, y: 0, tileId: 178 },
        { x: 0, y: 1, tileId: 179 },
        { x: 0, y: 2, tileId: 180 },
    ],
    tan_hatstand: [
        { x: 0, y: 0, tileId: 181 },
        { x: 0, y: 1, tileId: 182 },
        { x: 0, y: 2, tileId: 183 },
    ],
    orange_clock: [
        { x: 0, y: 0, tileId: 184 },
        { x: 0, y: 1, tileId: 185 },
        { x: 0, y: 2, tileId: 186 },
        { x: 1, y: 0, tileId: 187 },
        { x: 1, y: 1, tileId: 188 },
        { x: 1, y: 2, tileId: 189 }
    ],
    orange_couch: [
        { x: 0, y: 0, tileId: 190 },
        { x: 1, y: 0, tileId: 191 },
        { x: 2, y: 0, tileId: 192 },
        { x: 3, y: 0, tileId: 193 },
        { x: 0, y: 1, tileId: 194 },
        { x: 1, y: 1, tileId: 195 },
        { x: 2, y: 1, tileId: 196 },
        { x: 3, y: 1, tileId: 197 }
    ],
};

class Block {
    constructor(shape, gridX, gridY, goals = [], highlight) {
        this.shape = shape;
        this.gridX = gridX;
        this.gridY = gridY;
        this.goals = goals; // Array of goal positions, e.g., [{x: 8, y: 1}, {x: 1, y: 1}] or just a single goal
        this.pixelX = gridX * TILE_SIZE;
        this.pixelY = gridY * TILE_SIZE;
        this.dragging = false;
        this.lastValidX = gridX;
        this.lastValidY = gridY;
        this.highlight = highlight;
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
    points = 0;
    currentMap = level.map;

    blocks = level.blocks.map(b =>
        new Block(SHAPES[b.shape], b.x, b.y, b.goals || [],b.highlight)
    );
    puzzleComboTimer();
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
    points += (block.shape.length * comboMulti); //temp
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
            triggerSound("Sounds/Success.mp3");
            //check if player just completed the game, if so send win message and switch screen messgae

            if (blocks.length == 0) { 
                // 1. Save the score data into a temporary "pending" slot
                const pendingData = {
                    level: currentLevel,
                    score: points,
                    game: "luggageGame" // Put your actual game name here
                };
                localStorage.setItem("pendingScoreData", JSON.stringify(pendingData));

                // 2. Now tell the parent to switch the page
                window.parent.postMessage(
                    { 
                        type: "SWITCH_PAGE", 
                        page: "Leaderboard_Resources/leaderboard.html"
                    }, 
                    "*"
                );
            }

            // if (blocks.length == 0){ //checking if there any any more blocks of the screen
            //     //alert("sending point" + points);
            //     window.parent.postMessage(
            //         { type: "LEVEL_COMPLETE", 
            //         level: currentLevel,
            //         score: points}, // button.id will be the level choice, and can be used by the roguelike game to load the correct level
            //         "*"
            //     );
            //     window.parent.postMessage(
            //     { type: "SWITCH_PAGE", 
            //       page: "Leaderboard_Resources/leaderboard.html",
            //     }, // button.id will be the level choice, and can be used by the roguelike game to load the correct level
            //     "*"
            //     )
// //added something here to pull up prompt for username, untested
//                 window.addEventListener('reachedGoal', function() {
//                 let userName = prompt("Please enter name:");
//                 if (userName !== null) {
//                     console.log("User entered:", userName);
//                 },
//                 });   
                

        }
        return;
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
    ctx.strokeStyle = block.highlight;
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

function triggerSound(soundPath) {
  window.parent.postMessage({
    type: 'TRIGGER_SOUND',
    file: soundPath
  }, '*');
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
                triggerSound("Sounds/Pickup_Sound.mp3");
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
        currentLevel = event.data.level; // using currentLevel to send the level completed to the leaderboard when this level is completed
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

function puzzleComboTimer() {
    const timer = document.getElementById("timer");

     // clear existing timer
    clearInterval(timerInterval);
    timerInterval = setInterval( () => {
        // check time before incrementing
        if (timeLeft > 0) {
            timeLeft--; // time goes down at speed of 1000ms
        } else {console.log("puzzleTimer bigger than zero error")}

        timer.textContent = `x${comboMulti} ${timeLeft} sec`;

        if (reachedGoal === true) {
            clearInterval(timerInterval);
            reachedGoal = false;
            timeLeft = 5;
            comboMulti++;
            puzzleComboTimer();
        } else if (timeLeft <= 0 ) {

            comboMulti = 1;
            puzzleComboTimer();
        }

    }, 1000); // milliseconds
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas); //its just white if it happens to be called before the DOM is loaded

loadLevel("level1"); // this is needed to set the map, while the system waits for the message about level selected
//TODO: make level 1 or level 0 and tile/loading/unplayable but good looking level/screen

loadAllImages(() => {
    
    gameLoop();
});