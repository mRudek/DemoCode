import { PlayFieldObjectsData } from './PlayFieldObjectsDataClass.js';

class PlayerData {
    constructor(_name,_isHuman,socket_id) {
        this.playerName = _name;
        this.isHuman = _isHuman; //0 = no, 1 = yes
        this.playerArrayId = -1;
        this.playFieldObjects = new PlayFieldObjectsData();
        this.socket_id = socket_id;
    }

    getPlayerName(){
        return this.playerName;
    }

    getwaterPointsLocations(){
        return this.playFieldObjects.getWaterPointArray();
    }

    addShip(_shipArrayPlace){
        this.playFieldObjects.addShipToShipArray(_shipArrayPlace);
    }

    getShips(){
        let shipArray = this.playFieldObjects.getshipArray();
        return shipArray;
    }

    removeAllShips(){
        this.playFieldObjects.emptyShipArray();
    }

    getNoPlacedShips(){
        let noOfShips = this.playFieldObjects.getActiveShips();
        return noOfShips;
        //return 3
    }

    destroyShip(_shipArrayID){
        this.playFieldObjects.changeShipStatusToDestroyed(_shipArrayID);
    }
}

export {PlayerData};