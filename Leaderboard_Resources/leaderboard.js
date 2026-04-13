const tableBody = document.getElementById("tableBody");
const loadedScores = loadScores();  // Get from localStorage

// when score is passed here not sure how r n
let date = new Date();
let newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

// for test purposes only but also needed to load any dummy data
//  KEEP COMMENTED TO NOT ADD A NEW TESTPLAYER EVERY RELOAD
let newName = "testplayer (this will be changed)";
let newScore = -999;
let currentLevel = "this is the default";
let currentGame = "this is the default game";
let temp = 1;
let newIteration = 0;

const leadh1 = document.getElementById("lead");


//practice table for looks
const scores = [
    { iter: 1, name: "dood", score: 85, day: 1},
    { iter: 2, name: "bobbeh", score: 90, day: 2},
    { iter: 3, name: "crispy", score: 78, day: 3},
    { iter: 4, name: "fredfredburger", score: 20, day: `4/3/2026`}
];
//need to init

// return scores or empty array
function loadScores() {
    //return JSON.parse(localStorage.getItem('leaderBoardData')) || [];
    //precondition, check if the there is data for the current level and game, if not return empty array, if yes return the data

    if (!localStorage.getItem(currentLevel + 'leaderBoardData' + currentGame)) {
        
        //here we should actually initialize the localStorage for this level and game to an empty array, so that we don't have to check for existence every time we load scores. This will also prevent any potential issues with trying to access data that doesn't exist. We can do this by setting the item in localStorage to an empty array if it doesn't already exist.
        localStorage.setItem(currentLevel + 'leaderBoardData' + currentGame, JSON.stringify([]));
        scoresArray = scores; // Load dummy scores for testing purposes
        makeATable();
        return [];
    }

    return JSON.parse(localStorage.getItem(currentLevel + 'leaderBoardData' + currentGame)) || [];

}

// fun fun functions save and load localstorage
function saveScores(scoresArray) {
    //localStorage.setItem('leaderBoardData', JSON.stringify(scoresArray));
    localStorage.setItem(currentLevel + 'leaderBoardData' + currentGame, JSON.stringify(scoresArray));

}

function makeATable() {
    //clear the table before repopulating with new data
    tableBody.innerHTML = "";
    // Sort by score (highest b to lowest a)
    scoresArray.sort((a, b) => b.score - a.score);

        // for loop to create table rows            
        for (let i = 0; i < scoresArray.length; i++) {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${scoresArray[i].name}</td>
            <td>${scoresArray[i].iter}</td>
            <td>${scoresArray[i].score}</td>
            <td>${scoresArray[i].day}</td>`;
        tableBody.appendChild(row);
    }
    leadh1.textContent = `Leaderboard ${scoresArray.length} total attempts`;
}

window.addEventListener("message", (event) => {
    //if (!event.data || event.data.type !== "GAME_SELECTED") return;
    //if (!event.data.level || !event.data.score) return;

    if (event.data.type === "GAME_SELECTED") {
        currentLevel = event.data.level;
        newScore = event.data.score;
        currentGame = event.data.game;
        
        newName = prompt("Enter your name for the leaderboard:", "Player");
        if (newName === null || newName.trim() === "") {
            newName = "Anonymous";
        }

        newIteration = scoresArray.length + 1;
        scoresArray.push({iter: newIteration, name: newName, score: newScore, day: newDate});
        saveScores(scoresArray);
        makeATable();

        document.getElementById("lead").textContent = `Leaderboard - ${currentLevel} - Game: ${currentGame} - New Score: ${newScore}`; // Update header with current level, game, and new score
        
    } 
});

let scoresArray = loadScores();

//here I need a system which will load the table with the current scores, but then also update the table with the new score when it is passed in. I also need to make sure that the new score is saved to localStorage so that it will be there when the page is reloaded. I also need to make sure that the new score is added to the correct place in the table based on its value. I also need to make sure that the new score is added with the correct name and date. I also need to make sure that the table is sorted correctly after adding the new score. I also need to make sure that the table is updated correctly after adding the new score. I also need to make sure that the table is updated correctly after loading the scores from localStorage.
makeATable(scoresArray);




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


