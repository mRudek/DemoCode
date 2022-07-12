class RoundStatusData{
    constructor(){
        this.roundStatusPhase = 0;
        this.players = [];
        
        //fliegt raus
        this.waterPoints = [];
        this.items = [];
        this.playerShips = [];
        this.ship = {
            //src: `img/waterpoint.jpg`
        };
        this.kiShips = [];
    }

    placeShipInPlayerObjects(_playerId, _shipArrayPlace){
        
    }

    getroundStatusPhase(){
        return this.roundStatusPhase;
    }

    addPlayertoPlayerArray(_playerName,_isHumanPlayer){
        let playerp = new PlayerData(_playerName,_isHumanPlayer,0);
        this.players.push(playerp);
        playerp.getPlayerName();
        //this.players[0].getPlayerName()
        console.log("Player a Name = " + this.players[0].getPlayerName());
    }

    getGameStartObjectsArray(){
        return this.players[0].getwaterPointsLocations();
    }




    fillWaterPointsArray(_noOfPoints){
        for (let i = 0; i < _noOfPoints; i++){
            this.waterPointPos = {
                x:150,
                y:20,
                width: 30,
                height: 30,
                //src: `img/waterpoint.jpg`,
                img: new Image()
            };

        }
    }

    getwaterPoints(){
        return this.waterPoints;
    }

    placementOfShips(_playerName){
        if(_playerName === "ki"){
            this.kiShips = this.players[0].getkiShipPlacement(10,24);
            console.log("ki placement " + this.kiShips);
        } else {
            0;
        }
    }

    getKiShips(){
        return this.kiShips
    }



    /* Backup that works
    createPlayerData(){
        let playerp = new PlayerData();
        this.players.push(playerp);
        playerp.getPlayerName();
        //this.players[0].getPlayerName()
        console.log("Player a Name = " + this.players[0].test2);
    }
    */
}