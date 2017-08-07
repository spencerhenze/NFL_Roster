function NFLController() {
    var nflService = new NFLService(apiUrl, ready);

    function clearResults() {
        document.getElementById('search-results').innerHTML = '';
    }

    function drawResults(players) {
        var counter = 0;

        if (counter != 0) {
            clearResults();
        }

        var template = ``

        //TODO: fix these attribute names
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
    }

    //handle the loading spinner
    var loading = true; //start the spinner
    var apiUrl = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";

    function ready() {
        loading = false; // stop the spinner

        //Now that all of our player data is back we can safely setup our bindings for the rest of the view.

        // $('some-button').on('click', function () {
        //     var teamSF = nflService.getPlayersByTeam("SF");
        // });
    }

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
                else{
                    capName += letter.toLowerCase();
                }
            }
        }
    }

    //public area

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
        debugger
        var capName = capitalizeFirsts(name);
        nflService.getPlayersByName(capName, drawResults);
    };

    // this is a general search function that acts as an interface for the go button. It looks at which control the input is coming from and calls the appropriate get function.
    this.search = function (e) {
        e.preventDefault();

        var query = '';
        var form = e.target;

        if (e.target.team.value) {
            query = form.team.value;
            this.getPlayersByTeam(query);
        }
        if (e.target.position.value) {
            query = form.position.value;
            this.getPlayersByPosition(query);
        }
        if (e.target.player.value) {
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

} //end of Controller constructor