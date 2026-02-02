document.getElementById("luggage-game-button")
    .addEventListener("click", () => {
      window.parent.postMessage(
        { type: "SWITCH_PAGE", page: "Luggage_Game_Resources/luggage-game.html" },
        "*"
      );
    });
