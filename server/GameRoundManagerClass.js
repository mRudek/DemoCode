import { PlayerData } from './PlayerDataClass.js';

class GameRoundManager{
    constructor(){
        //this.roundStatus = new RoundStatusData();
        this.player = [];
        this.createPlayerData("init1",0,0)
        this.createPlayerData("init2",0,0)
    }

    getPlayerArrayId(socketIo){
        let playerArrayNo = -1;
        for(let i = 0; i < this.player.length; i++ ){
            if(socketIo == this.player[i].socket_id){
                playerArrayNo = i;
                this.player[i].playerArrayId = i;
                //this.player[i].playerArrayId = i; //setzte richtige arrayid
            }
            console.log("getPlayerArrayId i ", i, " return ArraAyID ", playerArrayNo , " SocketID ",socketIo, " Socket vom Player ", this.player[i].socket_id ); 
        }
        return playerArrayNo; //return eigentich uberflussig eigentlich das: this.player[i].playerArrayId = i;
    }

    getroundStatusPhase(){
        return this.roundStatus.roundStatusPhase;
    }

    createPlayerData(_playerName,_isHumanPlayer,socket_id){
        let playerTmp = new PlayerData(_playerName,_isHumanPlayer,socket_id);
        this.player.push(playerTmp);
        //playerTmp.getPlayerName();
        for(let i = 0; i < this.player.length; i++){
            console.log("Player a Name = " + this.player[i].getPlayerName(), this.player[i].socketID );
        }
    }

    getPlayerNo(){
        return this.player.length;
    }

    getGameObjects(_playerNo){
        return this.player[_playerNo].getwaterPointsLocations();
    }

    placeShip(ArrayNo, _shipArrayPlace){
        console.log("socket ID placeShip ", ArrayNo)
        //add only ships, if ship is not already placed
        if(this.isPlaceEmpty(ArrayNo, _shipArrayPlace) === true){
            this.player[ArrayNo].addShip(_shipArrayPlace);
            console.log("Player " + ArrayNo + " placed Ships at " + _shipArrayPlace); //DEBUG
        }
    }

    isPlaceEmpty(ArrayNo, _shipArrayPlace){
        console.log("socket ID isPlaceEmpty ", ArrayNo )
        let emptyPlace = true;
        //suche Spieler mit socket.Id / playerID 
        let tmpShips = this.player[ArrayNo].getShips();
        //console.log("------DEBUG SCHIFFE PLAZIEREN " + _shipArrayPlace + " " + tmpShips[0].arrayPlace); //DEBUG 
        for( let i = 0; i < this.getActiveShips(ArrayNo); i++){
            if(tmpShips[i].arrayPlace === _shipArrayPlace){
                console.log("Schiff bereits vorhanden/ wird nicht plaziert " + _shipArrayPlace); //DEBUG
                emptyPlace = false;
            }
        }
        return emptyPlace;
    }

    /*
    placeShip(socket_id, _shipArrayPlace){
        console.log("socket ID placeShip ", socket_id )
        //add only ships, if ship is not already placed
        if(this.isPlaceEmpty(socket_id, _shipArrayPlace) === true){
            this.player[this.getPlayerArrayId(socket_id)].addShip(_shipArrayPlace);
            console.log("Player " + this.getPlayerArrayId(socket_id) + " placed Ships at " + _shipArrayPlace); //DEBUG
        }
    }

    isPlaceEmpty(socket_id, _shipArrayPlace){
        console.log("socket ID isPlaceEmpty ", socket_id )
        let emptyPlace = true;
        //suche Spieler mit socket.Id / playerID 
        let tmpShips = this.player[this.getPlayerArrayId(socket_id)].getShips();
        //console.log("------DEBUG SCHIFFE PLAZIEREN " + _shipArrayPlace + " " + tmpShips[0].arrayPlace); //DEBUG 
        for( let i = 0; i < this.getActiveShips(socket_id); i++){
            if(tmpShips[i].arrayPlace === _shipArrayPlace){
                console.log("Schiff bereits vorhanden/ wird nicht plaziert " + _shipArrayPlace); //DEBUG
                emptyPlace = false;
            }
        }
        return emptyPlace;
    }
    */

    getActiveShips(ArrayNo){
        console.log("getActiveShips PlayerId ", this.getPlayerArrayId(ArrayNo) , " socket ", ArrayNo)
        //return 3;
        return this.player[ArrayNo].getNoPlacedShips();
    }

    /*
    getActiveShips_old(socket_id){
        console.log("getActiveShips PlayerId ", this.getPlayerArrayId(socket_id) , " socket ", socket_id)
        //return 3;
        return this.player[this.getPlayerArrayId(socket_id)].getNoPlacedShips();
    }
    */

    answerIsShipDestroyed(_shipArrayID,_playerID){ 
        let noOfShips = 10;
        for (let i = 0; i <noOfShips; i++){
            let tmpShips = this.player[_playerID].getShips();
            if(tmpShips[i].arrayPlace === _shipArrayID){
                //ship hit
                console.log("Ship DESTROYED BOOM");
                this.player[_playerID].destroyShip(i);
                return 1;
                break;
            }
        }
        return 0;
    }

    resetShipsPlacements(){
        this.player[0].removeAllShips();
        this.player[1].removeAllShips();
    }

}

export {GameRoundManager};