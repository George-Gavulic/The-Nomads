window.parent.postMessage({
  type: 'TRIGGER_BGM',
  file: 'Sounds/Loop_Leaderboard_Background_Uplifting.mp3' // Path to your looping music file
}, '*'
);

const tableBody = document.getElementById("tableBody");
const leadh1 = document.getElementById("lead");


function getFormattedDate() {
    const date = new Date();
    // Added padding so you get "4/03/2026" instead of "4/3/2026"
    return `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getStorageKey(game, level) {
    // Creates a unique, clean string key for localStorage
    return `leaderboard_${game}_${level}`;
}

// return scores or empty array
function loadScores(game, level) {
    const key = getStorageKey(game, level);
    const storedData = localStorage.getItem(key);
    
    if (!storedData) {
        // Initialize with dummy data (Change `dummyScores` to `[]` for production)
        localStorage.setItem(key, JSON.stringify(dummyScores));
        return [...dummyScores]; // Return a copy of the array
    }
    
    return JSON.parse(storedData);
}

// fun fun functions save and load localstorage
function saveScores(game, level, scoresArray) {
    const key = getStorageKey(game, level);
    localStorage.setItem(key, JSON.stringify(scoresArray));
}

function makeATable(scoresArray, gameContext = "", levelContext = "", newScore = null) {
    tableBody.innerHTML = ""; // Clear table before repopulating
    
    // Sort by score (highest to lowest)
    scoresArray.sort((a, b) => b.score - a.score);

    // Populate table
    scoresArray.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.iter}</td>
            <td>${entry.score}</td>
            <td>${entry.day}</td>`;
        tableBody.appendChild(row);
    });

    // Update Header Text dynamically
    if (gameContext && levelContext) {
        let headerText = `Leaderboard - ${levelContext} - Game: ${gameContext}`;
        if (newScore !== null) headerText += ` - New Score: ${newScore}`;
        leadh1.textContent = headerText;
    } else {
        leadh1.textContent = `Leaderboard (${scoresArray.length} total attempts)`;
    }
}

// Function to check for a new score when the leaderboard loads
function checkForPendingScore() {
    const pendingDataString = localStorage.getItem("pendingScoreData");
    
    if (pendingDataString) {
        const pendingData = JSON.parse(pendingDataString);
        
        // 1. Load the specific leaderboard
        let currentScores = loadScores(pendingData.game, pendingData.level);
        
        // 2. Ask for name (we should switch this to the game page eventually, but for now this is fine for testing)
        let newName = prompt("Enter your name for the leaderboard:", "Player");
        if (newName === null || newName.trim() === "") {
            newName = "Anonymous";
        }

        // 3. Push new data
        currentScores.push({
            iter: currentScores.length + 1, 
            name: newName, 
            score: pendingData.score, 
            day: getFormattedDate() // using the helper from the previous response
        });
        
        // 4. Save to the main storage and render
        saveScores(pendingData.game, pendingData.level, currentScores);
        makeATable(currentScores, pendingData.game, pendingData.level, pendingData.score);
        
        // 5. CRITICAL: Delete the pending score so it doesn't get added again if the user refreshes!
        localStorage.removeItem("pendingScoreData");
    } else {
        // If there's no pending score, just load a default view or empty table
        makeATable([]); 
    }
}

// Run this right when the script loads
checkForPendingScore();

document.getElementById("backButton")
  .addEventListener("click", () => {
    window.parent.postMessage(
      { type: "SWITCH_PAGE", 
        page: "Level_Choice_Resources/level-choice.html",
        game: "Luggage" },
      "*"
    );
  }
);