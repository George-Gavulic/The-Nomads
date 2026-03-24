        const tableBody = document.getElementById("tableBody");
        const loadedScores = loadScores();  // Get from localStorage

        // when score is passed here not sure how r n
        let date = new Date();
        let newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        // for test purposes only but also needed to load any dummy data
        //  KEEP COMMENTED TO NOT ADD A NEW TESTPLAYER EVERY RELOAD
        let newName = "testplayer"
        let newScore = 999

        const leadh1 = document.getElementById("lead")
        

        //practice table for looks
        const scores = [
            { iter: 1, name: "dood", score: 85, day: 1},
            { iter: 2, name: "bobbeh", score: 90, day: 2},
            { iter: 3, name: "crispy", score: 78, day: 3},
            { iter: 4, name: "fredfredburger", score: 20, day: `4/3/2026`}
        ];
        
        // return scores or empty array
        function loadScores() {
            return JSON.parse(localStorage.getItem('leaderBoardData')) || [];
        }

        // fun fun functions save and load localstorage
        function saveScores(scoresArray) {
            localStorage.setItem('leaderBoardData', JSON.stringify(scoresArray));
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
        // !!!!!!!!!!!!!!!!! RESET LINE KEEP COMMENTED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // localStorage.setItem('leaderBoardData', JSON.stringify([]));
        // !!! TO RESET UNCOMMENT AND RELOAD !!!

        let scoresArray = loadScores();
        // PUT THIS IN AFTER LOAD ARRAYS
        // DUMMY SCORES BELOW
        scoresArray = scores
        let newIteration = scoresArray.length + 1
        scoresArray.push({iter: newIteration, name: newName, score: newScore, day: newDate})
        saveScores(scoresArray);
        makeATable(scoresArray);
