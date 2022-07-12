import { LobbyData } from './LobbyDataClass.js';
import { PlayFieldObjectsData } from './PlayFieldObjectsDataClass.js';
import { GameRoundManager } from './GameRoundManagerClass.js';
import { RuleSet } from './RulesSetClass.js';

class Lobby extends LobbyData{
    constructor(lobidA) {
        super(lobidA);
        this.gameRoundManager = new GameRoundManager();
        this.ruleSet = new RuleSet();
        this.p1Objects = new PlayFieldObjectsData();
        this.p2Objects = new PlayFieldObjectsData();
        this.activeP1PlayerArrayId = -7;
        this.activeP2PlayerArrayId = -7;
        /* im super(lobidA);
                this.lobbyData = {
            'command':'',
            'lobid': this.lobid,
            'activeP1PlayerArrayId': this.activeP1PlayerArrayId,
            'activeP2PlayerArrayId': this.activeP2PlayerArrayId,
            'p1playFieldObjects': this.p1playFieldObjects,
            'p2playFieldObjects': this.p2playFieldObjects,
        }
        */
    }

    evaluate(serverDataPacket){
        switch (this.lobbyData.command){
            case 'initObjects':
                this.initObjects(serverDataPacket);
                break;          
            case 'roundStart':
                this.initObjects(serverDataPacket);
                break;     
            case 'placePlayerShip':
                this.placePlayerShip(serverDataPacket);
                break; 
            case 'playerAttacks':
                this.playerAttacks(serverDataPacket);
                break;                  
        }
    }

    //template
    templatName(serverDataPacket){
        //Your Code

        //send to player
        let socket = serverDataPacket.socket
        this.sender.sendToSender(this.lobbyData, socket);
        //send to all
        let io = serverDataPacket.io
        this.sender.sendToAll(this.lobbyData, io);
    }

    //which player are u
     getPlayerArrayNo(serverDataPacket){
        var ArrayNo = -20;
        if(serverDataPacket.playerArrayId == this.activeP1PlayerArrayId){
            ArrayNo = 0;
        }
        if(serverDataPacket.playerArrayId == this.activeP2PlayerArrayId){
            ArrayNo = 1;
        }
        return ArrayNo;
     }


    //Phase 0 Place Ships
    initObjects(serverDataPacket){
        console.log("init Objects in Lobby " + this.lobid)
        this.lobbyData.p1playFieldObjects = this.gameRoundManager.getGameObjects(0);
        this.lobbyData.p2playFieldObjects = this.gameRoundManager.getGameObjects(1);
        
        //send to all
        let io = serverDataPacket.io
        this.lobbyData.command = 'roundStart';
        this.sender.sendToAll(this.lobbyData, io);
    }

    initObjectsAfterWon(serverDataPacket){

        console.log("init Objects after Win in Lobby " + this.lobid)
        this.gameRoundManager.resetShipsPlacements();
        this.gameRunning = 0;
        this.lobbyData.playerWon = -1;
        this.lobbyData.p1PlacedShips = 0;
        this.lobbyData.p2PlacedShips = 0;
        this.lobbyData.activeP1PlayerArrayId = -7;
        this.lobbyData.activeP2PlayerArrayId = -7;
        this.activeP1PlayerArrayId = -7;
        this.activeP2PlayerArrayId = -7;

        //send to all
        let io = serverDataPacket.io;
        this.lobbyData.command = 'lobbyReset';
        this.sender.sendToAll(this.lobbyData, io);
    }

    //placePlayerShip
    placePlayerShip(serverDataPacket){
        let placementArrayNo = this.ruleSet.checkValidShipPos(serverDataPacket.mouseX,serverDataPacket.mouseY); //wandelt koordinaten in arrayNo um
        //Welcher Spieler biste?
        var arrayNo = this.getPlayerArrayNo(serverDataPacket);
        //Schiffe plazieren
        if (placementArrayNo > -1 && this.gameRoundManager.getActiveShips(arrayNo) < 10){
            this.gameRoundManager.placeShip(arrayNo, placementArrayNo);
            this.lobbyData.placementArrayNo = placementArrayNo;
            this.lobbyData.p1PlacedShips = this.gameRoundManager.getActiveShips(0);
            this.lobbyData.p2PlacedShips = this.gameRoundManager.getActiveShips(1);
            this.lobbyData.playerArrayId = serverDataPacket.playerArrayId;
            let io = serverDataPacket.io
            this.sender.sendToAll(this.lobbyData, io);
        } else {
            let io = serverDataPacket.io
            this.lobbyData.command = 'allShipsPlaced';
            this.lobbyData.p1PlacedShips = this.gameRoundManager.getActiveShips(0);
            this.lobbyData.p2PlacedShips = this.gameRoundManager.getActiveShips(1);
            this.sender.sendToAll(this.lobbyData, io);
        }
        //start game at all placed Ships
        if((this.gameRoundManager.getActiveShips(0) + this.gameRoundManager.getActiveShips(1)) ==20 ){
            let io = serverDataPacket.io
            this.lobbyData.command = 'gotToPhaseKillShips';
            this.lobbyData.playerTurn = 1;
            this.sender.sendToAll(this.lobbyData, io);            
        }

    }

    playerAttacks(serverDataPacket){
        //Welcher Spieler biste?
        var arrayNo = this.getPlayerArrayNo(serverDataPacket);
        //biste dran
        if(this.lobbyData.playerTurn == arrayNo){
            var enemyArrayNo = -20;
            if (arrayNo == 0){
                enemyArrayNo = 1;
                this.lobbyData.whichPlayerShot = 0;
                this.lobbyData.whichPlayerWasShot = 1;
                this.lobbyData.playerArrayId = this.lobbyData.activeP1PlayerArrayId; 
            } 
            if (arrayNo == 1){
                enemyArrayNo = 0;
                this.lobbyData.whichPlayerShot = 1;
                this.lobbyData.whichPlayerWasShot = 0;
                this.lobbyData.playerArrayId = this.lobbyData.activeP2PlayerArrayId;
            }
            let placementArrayNo = this.ruleSet.checkValidShipPos(serverDataPacket.mouseX,serverDataPacket.mouseY); //wandelt koordinaten in arrayNo um
            if (placementArrayNo > -1){
                let destroyed = 0;
                //checks the attack, destroy the ship and return answer, if ship destroyed or not
                destroyed = this.gameRoundManager.answerIsShipDestroyed(placementArrayNo, enemyArrayNo); //spieler 0 greift spieler 1 an
                if(destroyed === 1){
                    //this.checkWinCondition();
                }
                //checkWin
                if(this.gameRoundManager.getActiveShips(0) == 0){
                    this.lobbyData.playerWon = 0;
                }
                if(this.gameRoundManager.getActiveShips(1) == 0){
                    this.lobbyData.playerWon = 1;
                }
                //send to all
                let io = serverDataPacket.io
                this.lobbyData.command = 'playerAttacks';
                this.lobbyData.p1PlacedShips = this.gameRoundManager.getActiveShips(0);
                this.lobbyData.p2PlacedShips = this.gameRoundManager.getActiveShips(1);                
                this.lobbyData.placementArrayNo = placementArrayNo;
                this.lobbyData.destroyedStatus = destroyed;
                if(this.lobbyData.playerTurn == 1){
                    this.lobbyData.playerTurn = 0;
                } else {
                    this.lobbyData.playerTurn = 1;      
                }
                this.sender.sendToAll(this.lobbyData, io);
            } else {
            var allPlacedMessage = "Ungueltiger Angriff"
            //socket.emit('allShipPlaced-message', allPlacedMessage)
            }
        } else {
            //bist net dran
            let socket = serverDataPacket.socket;
            this.lobbyData.command = 'bistNetDran';
            this.sender.sendToSender(this.lobbyData, socket);
        }

    }


    /*
    socket.on('checkShipHit-message', message => {
        let placementArrayNo = ruleSet.checkValidShipPos(message.x,message.y); //wandelt koordinaten in arrayNo um
        if (placementArrayNo > -1){
            let destroyed = 0;
            //checks the attack, destroy the ship and return answer, if ship destroyed or not
            destroyed = gameRoundManager.answerIsShipDestroyed(placementArrayNo, message.enemyArrayNo); //spieler 0 greift spieler 1 an
            if(destroyed === 1){
                //this.checkWinCondition();
            }             
            io.emit('checkShipHit-message', {'placementArrayNo':placementArrayNo, 'destroyedStatus':destroyed, 'whichPlayerShot': message.playerArrayNo, 'whichPlayerWasShot': message.enemyArrayNo })
        } else {
            var allPlacedMessage = "Ungueltiger Angriff"
            //socket.emit('allShipPlaced-message', allPlacedMessage)
        }
    })
    */

}



export {Lobby};

