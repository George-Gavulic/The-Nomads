// Start the menu music
window.parent.postMessage({
  type: 'TRIGGER_BGM',
  file: 'Sounds/Loop_Game_Choice_Background1.mp3' // Path to your looping music file
}, '*');

document.getElementById("luggage-game-button")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Level_Choice_Resources/level-choice.html",
        game: "Luggage" },
      "*"
    );
  }
);

document.getElementById("roguelike-game-button")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Level_Choice_Resources/level-choice.html",
        game: "Roguelike" }, // screenmanager will listen and store this. Level choice can then import it.
      "*"
    );
  }
);

