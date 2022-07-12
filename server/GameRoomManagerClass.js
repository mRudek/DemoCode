import { PlayerData } from './PlayerDataClass.js';
import { Sender } from './SenderClass.js';
import { Lobby } from './LobbyClass.js';


class GameRoomManager{
    constructor(){
        //this.roundStatus = new RoundStatusData();
        this.player = [];
        this.sender = new Sender();
        this.lobby_1 = new Lobby(1);
    }

    evaluate(dataPacket){
        switch (dataPacket.command){
            case 'createNewPlayer':
                this.createNewPlayer(dataPacket);
                break;
            case 'joinLobby':
                this.joinLobby(dataPacket);
                break;
            case 'registerForRound':
                this.registerForRound(dataPacket);
                break;   
            case 'playerWon':
                if(dataPacket.lobid == 1){
                    this.lobby_1.initObjectsAfterWon(dataPacket);
                }
                break;  
            default:
                if(dataPacket.lobid == 1){
                    this.lobby_1.lobbyData.command = dataPacket.command;
                    this.lobby_1.evaluate(dataPacket);
                }
                break;                
        }
    }

    //template
    templatName(dataPacket){
        //Your Code

        //send to player
        let socket = dataPacket.socket
        this.sender.sendToSender(dataPacket, socket);
        //send to all
        let io = dataPacket.io
        this.sender.sendToAll(dataPacket, io);
    }

    //create new playerData and send Lobbylist to playerData
    createNewPlayer(dataPacket){
        //create new playerData
        let playerTmp = new PlayerData(dataPacket.playerName,dataPacket.isHuman,dataPacket.socket.id);
        this.player.push(playerTmp);
        for(let i = 0; i < this.player.length; i++){
            console.log("Player a Name = " + this.player[i].getPlayerName(), this.player[i].socketID );
        }
        dataPacket.playerArrayId = this.getPlayerArrayId(dataPacket.socket.id);
        //send player added command createNewPlayer
        let socket = dataPacket.socket
        this.sender.sendToSender(dataPacket, socket);
        //send lobby Data
        dataPacket.command = 'addLobbies';
        dataPacket.lobid = 1;
        this.sender.sendToSender(dataPacket, socket);
        dataPacket.command = 'addLobbies';
        dataPacket.lobid = 2;
        this.sender.sendToSender(dataPacket, socket);
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

    //joinLobby
    joinLobby(dataPacket){
        this.lobby_1.lobbyData.command = 'joinLobby';
        //send only lobby Data 
        let socket = dataPacket.socket
        this.sender.sendToSender(this.lobby_1.lobbyData, socket);
    }

    registerForRound(dataPacket){
        //player sit down
        if(this.lobby_1.lobid == dataPacket.lobid && this.lobby_1.activeP1PlayerArrayId < 0){
            this.lobby_1.activeP1PlayerArrayId = dataPacket.playerArrayId
            this.lobby_1.lobbyData.activeP1PlayerArrayId = dataPacket.playerArrayId
        } else if(this.lobby_1.lobid == dataPacket.lobid && this.lobby_1.activeP2PlayerArrayId < 0){
            this.lobby_1.activeP2PlayerArrayId = dataPacket.playerArrayId
            this.lobby_1.lobbyData.activeP2PlayerArrayId = dataPacket.playerArrayId
        }
        //send to all, that player sit down
        this.lobby_1.lobbyData.command = 'registerForRound';
        let io = dataPacket.io
        this.sender.sendToAll(this.lobby_1.lobbyData, io);
        //round start if full and not ruunning
        console.log(this.lobby_1.lobid == dataPacket.lobid && this.lobby_1.activeP1PlayerArrayId > -1 && this.lobby_1.activeP2PlayerArrayId > -1)
        console.log(this.lobby_1.lobid == dataPacket.lobid)
        console.log(this.lobby_1.activeP2PlayerArrayId > -1)
        console.log(this.lobby_1.activeP2PlayerArrayId > -1)
        if(this.lobby_1.lobid == dataPacket.lobid && this.lobby_1.activeP1PlayerArrayId > -1 && this.lobby_1.activeP2PlayerArrayId > -1 && this.lobby_1.gameRunning == 0){
            this.lobby_1.lobbyData.command = 'roundStart';
            this.lobby_1.gameRunning = 1;
            this.lobby_1.evaluate(dataPacket);
            //let io = dataPacket.io
            //this.sender.sendToAll(this.lobby_1.lobbyData, io);
        }
    }

}

export {GameRoomManager};