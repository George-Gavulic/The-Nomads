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
        level: selectedLevel,
        score: score,
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

// function debounce(func, timeout = 50) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, timeout);
//   };
// }

// const playSound = (fileName) => {

//   const soundUrl = chrome.runtime.getURL(fileName.toLowerCase()); 
  
//   console.log("Attempting to play:", soundUrl);
//   const audio = new Audio(soundUrl);
//   audio.play().catch(err => console.error("Playback Error:", err.name, err.message));
// };

// const debouncedPlay = debounce((file) => playSound(file), 50);

// window.addEventListener('message', (event) => {
//   // Check if message is the sound trigger
//   if (event.data && event.data.type === 'TRIGGER_SOUND') {
//     // Pass the filename from the iframe (e.g., 'pop.mp3')
//     console.log("Received sound trigger for:", event.data.file);
//     debouncedPlay(event.data.file);// || 'default.mp3');
//   }
// });


// 1. Configuration: List your sounds here
const SOUND_FILES = [
  "Sounds/Pickup_Sound.mp3",
  // "sounds/error.wav",
  "Sounds/Success.mp3",
];

// 2. The Cache: Pre-load all sounds into memory
const audioCache = {};

SOUND_FILES.forEach(path => {
  const url = chrome.runtime.getURL(path);
  const audio = new Audio(url);
  audio.preload = "auto";
  audioCache[path] = audio; // Keyed by the path you'll send in the message
});

// 3. Immediate-trigger Debounce (Leading Edge)
// Plays the sound immediately, then ignores subsequent calls for 'wait' ms
function debounceImmediate(func, wait) {
  let timeout;
  return function(...args) {
    const callNow = !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) func.apply(this, args);
  };
}

// 4. The Play Logic
const playSound = (requestedPath) => {
  // Debug: See exactly what the iframe is asking for
  console.log("Iframe requested:", requestedPath);

  const audio = audioCache[requestedPath];
  
  if (!audio) {
    console.error("CACHE MISS: No audio object found for key:", requestedPath);
    console.log("Available keys in cache:", Object.keys(audioCache));
    return;
  }

  // Check if the audio actually loaded
  if (audio.networkState === 3) { // 3 = NETWORK_NO_SOURCE
    console.error("LOAD ERROR: The file at this URL could not be found or was blocked:", audio.src);
    return;
  }

  audio.currentTime = 0;
  audio.play().catch(e => {
    console.error("Playback error:", e.message, "Source:", audio.src);
  });
};

// Apply debounce (50ms is usually plenty to prevent clipping while feeling instant)
const fastPlay = debounceImmediate((path) => playSound(path), 50);

// 5. Message Listener
window.addEventListener('message', (event) => {
  if (event.data?.type === 'TRIGGER_SOUND' && event.data.file) {
    fastPlay(event.data.file);
  }
});

//Here will be the location for all of the page switching functions
// Listens for messages from the iframe to switch pages
let selectedGame = "Sceen Manager Default Game"; // this will store the game choice, and can be imported by the level choice page to know which levels to show. It will be updated when the game choice page sends a message with the game choice.
let selectedLevel = "Screen Manager Default Level"; // this will store the level choice, and can be imported by the game page to load the correct level. It will be updated when the level choice page sends a message with the level choice.
let score = -998;

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
    if (event.data.score){
      score = event.data.score;
    }
    switchPage(event.data.page);
  }
});

