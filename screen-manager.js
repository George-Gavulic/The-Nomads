if (!document.getElementById("my-circle-button")) { // if already open, do nothing
  const btn = document.createElement("div"); 
  btn.id = "my-circle-button"; // used for styling in game-panel.css (and other detections)
  btn.className = "my-circle-button"; // the look of all of this is crafted in good-game-button.css
  btn.textContent = "GG";

  
  btn.addEventListener("click", () => {
    console.log("Circle button clicked");
    openGamePanel();
  });

  document.body.appendChild(btn);
}

function openGamePanel() { 
  if (document.getElementById("game-panel-frame")){ //the look of this panel is also crafted in game-panel.css
    closeGamePanel(); // this will oporate as a toggle, if the panel is open, close it
    return; // don't continue and open a new one, duh, lol
  }
  const panelUrl = chrome.runtime.getURL("Game_Choice_Resources/game-choice.html"); //connect the panel to HTML, this will setup the structure/look of the panel
  //console.log("Opening panel:", panelUrl);

  const iframe = document.createElement("iframe");
  iframe.id = "game-panel-frame"; //by adding this ID, game-panel.css will style it
  iframe.src = panelUrl;
  iframe.className = "game-panel-frame"; 

  iframe.onload = () => {
    iframe.contentWindow.postMessage(
      {
        type: "GAME_SELECTED", //this will allow the level choice page to know which game was selected, and then display the correct levels for that game.
        game: selectedGame,
        level: selectedLevel
      },
      "*"
    );
  };
  document.body.appendChild(iframe); //add the iframe to the body of the page
}

function closeGamePanel() {
  const iframe = document.getElementById("game-panel-frame");
  if (iframe) {
    iframe.remove();
  }
}

function switchPage(newPageUrl) {
  const iframe = document.getElementById("game-panel-frame");

  if (!iframe) {
    //console.log("Panel is not open");
    return;
  }

  const resolvedUrl = chrome.runtime.getURL(newPageUrl);

  if (iframe.src === resolvedUrl) {
    //console.log("Already on the desired page");
    return;
  }

  iframe.src = resolvedUrl;
}


//Here will be the location for all of the page switching functions
// Listens for messages from the iframe to switch pages
let selectedGame = "Sceen Manager Default Game"; // this will store the game choice, and can be imported by the level choice page to know which levels to show. It will be updated when the game choice page sends a message with the game choice.
let selectedLevel = "Screen Manager Default Level"; // this will store the level choice, and can be imported by the game page to load the correct level. It will be updated when the level choice page sends a message with the level choice.

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === "SWITCH_PAGE") {
    //alert("Screen Manager received game choice: " + event.data.game);
    if (event.data.game) {
      selectedGame = event.data.game;
    }
    if (event.data.level) {
      selectedLevel = event.data.level;
    }
    switchPage(event.data.page);
  }
});

