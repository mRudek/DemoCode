
import { Sender } from './SenderClass.js';

class LobbyData {
    constructor(lobidA) {
        this.sender = new Sender();
        this.lobid = lobidA;
        this.gameRunning = 0;
        this.lobbyData = {
            'command':'',
            'lobid': this.lobid,
            'playerArrayId': -12,
            'activeP1PlayerArrayId': this.activeP1PlayerArrayId,
            'activeP2PlayerArrayId': this.activeP2PlayerArrayId,
            'p1playFieldObjects': this.p1Objects,
            'p2playFieldObjects': this.p2Objects,
            'placementArrayNo': -12,
            'p1PlacedShips': 0,
            'p2PlacedShips': 0,
            'playerTurn': 0,
            'destroyedStatus': -1,
            'whichPlayerShot': -1,
            'whichPlayerWasShot' : -1,
            'playerWon': -1
        }
    }

}



export {LobbyData};

