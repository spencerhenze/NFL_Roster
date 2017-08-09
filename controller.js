function NFLController() {
    var nflService = new NFLService(apiUrl, ready);

    //handle the loading spinner
    var loading = true; //start the spinner
    var apiUrl = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";

    function ready() {
        loading = false; // stop the spinner
    }


    function clearResults() {
        document.getElementById('search-results').innerHTML = '';
    }
    
    // Draw functions
    function drawForm(type) {
        var template = '';

        if (type == 'name') {
            template = `
                <h3>Searching by Name</h3>
                <form onsubmit="app.controllers.nflController.search(event, '${type}')">
                    <label class="search-control" for="player">Player Name</label>
                    <input class="search-control" id="search-text" name="player" type="text" placeholder="John Ellway">

                    <button id="submit-button" type="submit"> Go! </button>
                </form>
            `
        }
        if (type == 'pos') {
            template = `
                <h3>Searching by Position</h3>
                <form onsubmit="app.controllers.nflController.search(event, '${type}')">
                    <label class="search-control" for="position">Player Position</label>
                    <input class="search-control" id="search-text" name="position" type="text" placeholder="Quarterback">

                    <button id="submit-button" type="submit"> Go! </button>
                </form>
            `
        }
        if (type == 'team') {
            template = `
                <h3>Searching by Team</h3>
                <form onsubmit="app.controllers.nflController.search(event, '${type}')">
                    <label class="search-control" for="team">Player Team</label>
                    <input class="search-control" id="search-text" name="team" type="text" placeholder="San Francisco">

                    <button id="submit-button" type="submit"> Go! </button>
                </form>
            `
        }

        document.getElementById('dynamic-form').innerHTML = template;
    }

    function drawResults(players) {
        var counter = 0;

        if (counter != 0) {
            clearResults();
        }

        var template = `<h2 class="site-section-title">Search Results:</h2>`

        players.forEach(player => {
            if (player.pro_status) {
                template += `
                <div class="card-wrapper">
                    <div class="player-card">
                        <img class="card-img-top img-responsive player-image" src="${player.photo}"
                            alt="image">
                        <div class="card-block">
                            <h4 class="card-title">${player.fullname}</h4>
                            <h5 class="card-subtitle">Position:${player.position}</h5>
                            <h5 class="card-subtitle">Team: ${player.pro_team}</h5>
                            <a href="#" class="btn btn-primary add-button" onclick="app.controllers.nflController.addPlayer(${player.id})">Add To Team</a>
                        </div>
                    </div>
                </div>
            `
            }
        });

        counter++;

        document.getElementById('search-results').innerHTML = template;
    } // end drawTeam() function

    function drawRoster() {
        var roster = nflService.getRoster();
        var template = '';
        var playerCount = roster.length;
        var remaining = 16

        if(roster.length != 0){
            remaining = 16 - playerCount;
        }


        if (roster.length == 0) {
            template = `
                <h3 class="placeholder-text">Add some players!</h3>
            `
        }

        roster.forEach(player => {
            template += `
                <div class="card-wrapper">
                    <div class="player-card">
                        <img class="card-img-top img-responsive player-image" src="${player.photo}"
                            alt="image">
                        <div class="card-block">
                            <h4 class="card-title">${player.fullname}</h4>
                            <h5 class="card-subtitle">Position:${player.position}</h5>
                            <h5 class="card-subtitle">Team: ${player.pro_team}</h5>
                            <a href="#" class="btn btn-primary add-button" onclick="app.controllers.nflController.removePlayer(${player.id})">Remove</a>
                        </div>
                    </div>
                </div>
            `
        })
        document.getElementById('my-roster').innerHTML = template;
        document.getElementById('counter').innerHTML = remaining;
    } // end drawRoster() funciton


    // INPUT VALIDATION FUNCTIONS:

    // Takes in a string and returns only the first letters of each word, capitalized, as a new string that can be used to search for the team in the API.
    function getAbreviation(userInput) {
        // change user input to all uppercase
        userInput = userInput.toUpperCase();
        var abbreviation = '';

        // if the user's input contains "back" and does not contain any spaces.
        if (userInput.search('BACK') != -1 && userInput.search(' ') == -1) {

            var charArray = userInput.split('');    // split the input into an array

            //build the code
            for (var i = 0; i < charArray.length; i++) {
                var char = charArray[i];
                if (i == 0) {
                    abbreviation += char;
                }
                if (i == charArray.length - 4) {
                    abbreviation += char;
                }
            }
        }

        // if not, split the input into a word array and add each first letter to the abbreviation.
        var wordArray = userInput.split(' ');
        if (wordArray.length > 1) {
            wordArray.forEach(word => {
                abbreviation += word[0];
            })
        }


        return abbreviation;
    }

    //capitalizes the first letters of each word in the player's names so that they play nice with the API
    function capitalizeFirsts(name) {
        var nameArray = name.split(' ');
        var capName = '';

        for (var i = 0; i < nameArray.length; i++) {
            var word = nameArray[i];
            let wordArray = word.split('');
            for (var i = 0; i < wordArray.length; i++) {
                let letter = wordArray[i];
                if (i == 0) {
                    capName += letter.toUpperCase();
                }
                else {
                    capName += letter.toLowerCase();
                }
            }
        }

        return capName;
    }


    //public area

    // form selection buttons functions
    this.loadForm = function (type) {
        drawForm(type)
    }

    //search functions
    this.getPlayersByTeam = function (team) {
        var teamCode = getAbreviation(team);
        nflService.getPlayersByTeam(teamCode, drawResults);
    }

    this.getPlayersByPosition = function (position) {
        var posCode = getAbreviation(position);
        nflService.getPlayersByPosition(posCode, drawResults);
    };

    this.getPlayersByName = function (name) {
        var capName = capitalizeFirsts(name);
        nflService.getPlayersByName(capName, drawResults);
    };

    // this is a general search function that acts as an interface for the go button. It looks at which control the input is coming from and calls the appropriate get function.
    this.search = function (e, type) {
        e.preventDefault();

        var query = '';
        var form = e.target;

        //TODO: fix search by name
        if (type == 'team') {
            query = form.team.value;
            this.getPlayersByTeam(query);
        }
        if (type == 'pos') {
            query = form.position.value;
            this.getPlayersByPosition(query);
        }
        if (type == 'name') {
            query = form.player.value;
            this.getPlayersByName(query);
        }

        form.reset();
        // return alert("Please enter a valid search");

    };


    // add/remove functions
    this.addPlayer = function (id) {
        nflService.addPlayer(id);
        drawRoster();
    };

    this.removePlayer = function (id) {
        nflService.removePlayer(id);
        drawRoster();
    };

    this.clearRoster = function () {
        nflService.clearRoster();
        drawRoster();
    }

} //end of Controller constructor