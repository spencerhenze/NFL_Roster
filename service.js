function NFLService(url, callback) {

    var playersData = [];
    var myRoster = JSON.parse(localStorage.getItem('myRoster')) || [];

    function loadPlayersData() {
        //check to see if the data is already stored locally
        var localData = localStorage.getItem('playersData');
        if (localData) {
            playersData = JSON.parse(localData);
            return callback();
            //return will short-circuit the loadPlayersData function
            //this will prevent the code below from ever executing
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var endpointUri = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
        var apiUrl = url + encodeURIComponent(endpointUri);

        $.getJSON(apiUrl, function (data) {
            playersData = data.body.players;
            console.log('Player Data Ready');
            console.log('Writing Player Data to localStorage');
            localStorage.setItem('playersData', JSON.stringify(playersData));
            console.log('Finished writing player Data to localStorage)');
            callback();
        });
    } // end loadPlayerData()

    function saveRoster() {
        localStorage.setItem('myRoster', JSON.stringify(myRoster));
    }

    // call the loadPlayersData() function every time we create a new service
    loadPlayersData();
    console.log(playersData);


    //search functions:

    this.getPlayersByTeam = function (teamCode, cb) {
        //retrun an array of all players who match the given teamName
        var filteredPlayers = playersData.filter(player => {
            //check the actual attribute name
            if (player.pro_team == teamCode) {
                return true;
            }
        });

        cb(filteredPlayers);
    }

    this.getPlayersByPosition = function (posCode, cb) {
        //return an array ofo all players who match the given position
        var filteredPlayers = playersData.filter(player => {
            if (player.position == posCode) {
                return true;
            }
        });

        cb(filteredPlayers);
    }

    this.getPlayersByName = function (name, cb) {
        var filteredPlayers = playersData.filter(player => {
            if (player.fullname == name || (player.fullname.search(name) != -1)) {
                return true;
            }
        });

        cb(filteredPlayers);
    }

    this.getRoster = function () {
        return JSON.parse(JSON.stringify(myRoster));
    }


    // Add / remove funtions
    this.addPlayer = function (id) {

        // limit the roster length to 15 players
        if (myRoster.length <= 15) {
        var player = playersData.find(player => player.id == id)

            // check to see if the player exists in the roster. If not, add them.
            if (myRoster.indexOf(player) == -1) {
                myRoster.push(player);
                saveRoster();
                //remove the player from the search results
                // playersData.splice()
            }
        }
        else{
            alert("Your roster is full! You can remove players if you really want to add this guy.")
        }
    };

    this.removePlayer = function (id) {
        for (var i = 0; i < myRoster.length; i++) {
            var currentPlayer = myRoster[i];
            if (currentPlayer.id == id) {
                myRoster.splice(i, 1);
                //put the player back in the search results
                // playersData.splice(0, 0, currentPlayer)
            }
        }
        saveRoster();
        // myRoster.splice(id, 1);
    };

    this.clearRoster = function() {
        while (myRoster.length > 0){
            myRoster.pop();
        }
        saveRoster();
    }




} // end of Service constructor