// 1. Try to remember the game from a previous visit, default to something safe
let GameChoice = sessionStorage.getItem("CurrentGame") || "level non-selected";

// 2. Extract the unlocking logic into a reusable function
function refreshLevelLocks() {
    if (GameChoice === "level non-selected") return;

    const buttons = Array.from(document.getElementsByClassName("level-button"));
    const storageKey = GameChoice + "_MaxLevel"; 
    
    // Get max unlocked from localStorage
    const maxUnlocked = parseInt(localStorage.getItem(storageKey)) || 1;

    buttons.forEach(button => {
        button.classList.remove("Roguelike", "Luggage");
        button.classList.add(GameChoice);

        const btnLevelNum = parseInt(button.id.replace("level", ""), 10);

        // Lock or Unlock based on progress
        if (btnLevelNum <= maxUnlocked) {
            button.classList.remove("locked");
            button.classList.add("unlocked");
        } else {
            button.classList.remove("unlocked");
            button.classList.add("locked");
        }
    });
}

// 3. Run this immediately when the page loads!
refreshLevelLocks();

// 4. Update the listener to save the choice and refresh locks
window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "GAME_SELECTED" || !event.data.game) return;

    GameChoice = event.data.game;
    sessionStorage.setItem("CurrentGame", GameChoice); // Save it so we remember next time!
    
    refreshLevelLocks(); // Update the visuals now that we have a confirmed game

    // Trigger Music
    if (GameChoice === "Roguelike") {
        window.parent.postMessage({
            type: 'TRIGGER_BGM',
            file: 'Sounds/Loop_Snake_Background_Playfull.mp3'
        }, '*');
    } else if (GameChoice === "Luggage") {
        window.parent.postMessage({
            type: 'TRIGGER_BGM',
            file: 'Sounds/Loop_Mover_Background_Nostalgic.mp3'
        }, '*');
    }
});

// 5. Prepping for leaving the screen
for (let button of document.getElementsByClassName("level-button")) {
    button.addEventListener("click", () => {
        // Double check it's not locked at the moment of click
        if (button.classList.contains("locked")) return; 

        if (GameChoice === "Roguelike") {
            sessionStorage.setItem("selectedLevel", button.id);
            window.parent.postMessage(
                { type: "SWITCH_PAGE", page: "Roguelike_Game_Resources/roguelike-game.html", level: button.id },
                "*"
            );
        } else if (GameChoice === "Luggage") {
          
            window.parent.postMessage(
                { type: "SWITCH_PAGE", page: "Luggage_Game_Resources/luggage-game.html", level: button.id },
                "*"
            );
        }
    });
}

document.getElementById("back-to-game-choice").addEventListener("click", () => {
    window.parent.postMessage(
        { type: "SWITCH_PAGE", page: "Game_Choice_Resources/game-choice.html" },
        "*"
    );
});