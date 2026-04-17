// This file will handle the level choice page, it will listen for messages from the game choice page to know which game was selected, and then display the correct levels for that game.
let GameChoice = "level non-selected";

//setting up the level screen
//this listerner is used to set up the look based on the game chosen
window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "GAME_SELECTED") return;
    if (!event.data.game) return;

    if (event.data.type === "GAME_SELECTED") {
        GameChoice = event.data.game;
        const buttons = document.getElementsByClassName("level-button");
        
        //alert("Level 1 selected!" + " Game Choice is: " + GameChoice);
        for (let button of buttons) {
            button.classList.remove("Roguelike", "Luggage"); //remove previous game class if needed
            button.classList.add(GameChoice);
        }
    }
});

//prepping for leaving the screen
for (let button of document.getElementsByClassName("level-button")) {
    if (button.classList.contains("locked")) continue; //skip locked levels (no action on click)
    button.addEventListener("click", () => {
        //alert("Level 1 selected!" + " Game Choice is: " + GameChoice);
        if (GameChoice === "Roguelike") {
          sessionStorage.setItem("selectedLevel", button.id);
            window.parent.postMessage(
                { type: "SWITCH_PAGE", 
                  page: "Roguelike_Game_Resources/roguelike-game.html",
                  level: button.id}, // button.id will be the level choice, and can be used by the roguelike game to load the correct level
                "*"
            );
        } else if (GameChoice === "Luggage") {
            window.parent.postMessage(
                { type: "SWITCH_PAGE",
                  page: "Luggage_Game_Resources/luggage-game.html",
                  level: button.id},
                "*"
            );
        }
    });
}

document.getElementById("back-to-game-choice")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Game_Choice_Resources/game-choice.html"},
      "*"
    );
  }
);