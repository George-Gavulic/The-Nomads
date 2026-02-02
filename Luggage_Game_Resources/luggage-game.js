
startCanvas();

function startCanvas() {
    const canvas = document.getElementById('luggageGameScreen');
    const context = canvas.getContext('2d');
    //const [width, height] = getScreenDimensions();
    
}




//geting the screen dimentions of the iframe which is 80% of the window
//this will be used to size the canvas in the luggage game to showcase responsivness 
// and show a limited amount of the map based on the users screen size
//note, when 
function getScreenDimensions() {
    var width = window.innerWidth * 0.8;
    var height = window.innerHeight * 0.8;
    return [width, height];
}
