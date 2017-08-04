function NFLService(url, callback) {

    var playersData = [];
    var myRoster = {};

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

    // call the loadPlayersData() function every time we create a new service
    loadPlayersData();
    console.log(playersData);


    //search functions:

    this.getPlayersByTeam = function (teamCode, cb) {
        //retrun an array of all players who match the given teamName
        var filteredPlayers = playersData.filter(player => {
            //check the actual attribut name
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
        // return JSON.parse(JSON.stringify(myRoster));
        return myRoster;
    }


    // Add / remove funtions
    this.addPlayer = function (id) {
        var player = playersData.find(player => player.id == id)

        myRoster[id] = player;
    };

    this.removePlayer = function (id) {

    };





} // end of Service constructor