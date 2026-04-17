const tableBody = document.getElementById("tableBody");
const leadh1 = document.getElementById("lead");


// const loadedScores = loadScores();  // Get from localStorage

// // when score is passed here not sure how r n
// let date = new Date();
// let newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

// // for test purposes only but also needed to load any dummy data
// //  KEEP COMMENTED TO NOT ADD A NEW TESTPLAYER EVERY RELOAD
// let newName = "testplayer (this will be changed)";
// let newScore = -999;
// let currentLevel = "this is the default";
// let currentGame = "this is the default game";
// let temp = 1;
// let newIteration = 0;

function getFormattedDate() {
    const date = new Date();
    // Added padding so you get "4/03/2026" instead of "4/3/2026"
    return `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getStorageKey(game, level) {
    // Creates a unique, clean string key for localStorage
    return `leaderboard_${game}_${level}`;
}


//practice table for looks
const dummyScores = [
    // { iter: 1, name: "dood", score: 85, day: "1/1/2026" },
    // { iter: 2, name: "bobbeh", score: 90, day: "2/1/2026" },
    // { iter: 3, name: "crispy", score: 78, day: "3/1/2026" },
    // { iter: 4, name: "fredfredburger", score: 20, day: "4/3/2026" }
];
//need to init

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

// window.addEventListener("message", (event) => {
//     // Validate incoming data to prevent crashes
//     if (!event.data || event.data.type !== "GAME_SELECTED") return;
//     if (event.data.level === undefined || event.data.score === undefined) return;

//     const currentLevel = event.data.level;
//     const currentGame = event.data.game;
//     // const newScore = event.data.score;
    
//     // STEP A: Load the SPECIFIC leaderboard for this level/game first
//     let currentScores = loadScores(currentGame, currentLevel);
    
//     // STEP B: Ask for name
//     let newName = prompt("Enter your name for the leaderboard:", "Player");
//     alert(`Your score: ${newScore}`); // Show the new score in an alert (can be removed later)
//     if (newName === null || newName.trim() === "") {
//         newName = "Anonymous";
//     }

//     // STEP C: Push new data
//     currentScores.push({
//         iter: currentScores.length + 1, 
//         name: newName, 
//         score: newScore, 
//         day: getFormattedDate()
//     });
    
//     // STEP D: Save and Re-render
//     saveScores(currentGame, currentLevel, currentScores);
//     makeATable(currentScores, currentGame, currentLevel, newScore);
// });

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


// let scoresArray = loadScores();

// //here I need a system which will load the table with the current scores, but then also update the table with the new score when it is passed in. I also need to make sure that the new score is saved to localStorage so that it will be there when the page is reloaded. I also need to make sure that the new score is added to the correct place in the table based on its value. I also need to make sure that the new score is added with the correct name and date. I also need to make sure that the table is sorted correctly after adding the new score. I also need to make sure that the table is updated correctly after adding the new score. I also need to make sure that the table is updated correctly after loading the scores from localStorage.
// makeATable(scoresArray);




// !!!!!!!!!!!!!!!!! RESET LINE KEEP COMMENTED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// localStorage.setItem('leaderBoardData', JSON.stringify([]));
// !!! TO RESET UNCOMMENT AND RELOAD !!!

// PUT THIS IN AFTER LOAD ARRAYS
// DUMMY SCORES BELOW
// scoresArray = scores
// let newIteration = scoresArray.length + 1
// scoresArray.push({iter: newIteration, name: newName, score: newScore, day: newDate})

// saveScores(scoresArray);
// makeATable(scoresArray);
// alert(newScore + "<<<score , level>>>" + currentLevel);


