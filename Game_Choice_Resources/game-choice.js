document.getElementById("luggage-game-button")
    .addEventListener("click", () => {
      window.parent.postMessage(
        { type: "SWITCH_PAGE", page: "Luggage_Game_Resources/luggage-game.html" },
        "*"
      );
    });


document.getElementById("roguelike-game-button")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", page: "Roguelike_Game_Resources/roguelike-game.html" },
      "*"
    );
  });
