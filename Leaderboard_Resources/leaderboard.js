// when score is passed here not sure how r n
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

const leadh1 = document.getElementById("lead")

const tableBody = document.getElementById("tableBody");
const loadInScores = loadScores();  // Get from localStorage
console.log(loadInScores);
//practice table for looks
const scores = [
    { iter: 1, name: "dood", score: 85, day: 1},
    { iter: 2, name: "bobbeh", score: 90, day: 2},
    { iter: 3, name: "crispy", score: 78, day: 3},
    { iter: 4, name: "fredfredburger", score: 20, day: `4/3/2026`}
];

// Sort by score (highest to lowest) I still don't understand this but the website says it sorts
scores.sort((a, b) => b.score - a.score);

// function addScore(arg) {
//     const input = document.getElementById('placeholder');
//     const score = inputvalue.trim();
//     if (!score) {
//         return
//     } else {
//         score.push(score);
//         placeholder to update active tableBody
//     }
// }
            // fun fun functions save and load localstorage
function saveScores(scoresArray) {
    localStorage.setItem('scoresData', JSON.stringify(scoresArray));
}
function loadScores() {
    const scoresJSON = localStorage.getItem('scoresData');
    
    // If nothing saved, return empty array, or convert json
    if (!scoresJSON) {
        return `womp womp no saves`;
    } else{
        return JSON.parse(scoresJSON);
    }
}
    // for loop to create table rows
    for (let i = 0; i < scores.length; i++) {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${scores[i].name}</td>
            <td>${scores[i].iter}</td>
            <td>${scores[i].score}</td>
            <td>${scores[i].day}</td>`;
        
        tableBody.appendChild(row);
    }
    leadh1.textContent = `Leaderboard ${scores.length} total attempts`;
loadScores(scores);
saveScores(scores);
// will need the document file
//document.getElementById('placeholder for score info').addEventListener('click or something',)

