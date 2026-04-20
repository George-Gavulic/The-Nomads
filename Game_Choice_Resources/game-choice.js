window.parent.postMessage({
  type: 'TRIGGER_BGM',
  file: 'Sounds/Loop_Game_Choice_Background.mp3' // Path to your looping music file
}, '*'
);
const muteBtn = document.getElementById("mute-btn");

if (muteBtn) {
    // 1. Read the extension's true local storage
    let isMuted = localStorage.getItem("globalMute") === "true";
    muteBtn.innerText = isMuted ? "🔇" : "🔊";

    // 2. NEW: Immediately tell the Screen Manager the true state BEFORE music triggers!
    window.parent.postMessage({
        type: "SYNC_MUTE",
        isMuted: isMuted
    }, "*");

    // 3. Listen for future clicks
    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted; 
        localStorage.setItem("globalMute", isMuted);
        muteBtn.innerText = isMuted ? "🔇" : "🔊";
        
        window.parent.postMessage({
            type: "TOGGLE_MUTE",
            isMuted: isMuted
        }, "*");
    });
}

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



