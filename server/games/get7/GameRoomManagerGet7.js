import {GameRoundManagerGet7} from './GameRoundManagerGet7.js';
import {LobbyDataGet7} from  './LobbyDataGet7.js';

class GameRoomManagerGet7{
    constructor(){
        //this.roundStatus = new RoundStatusData();
        this.player = [];
        // this.sender = new Sender();
        this.playerNo = 0;
        this.serverLobby_1 = new LobbyDataGet7(1);
        this.serverRoundLobby_1 = new GameRoundManagerGet7(1);
        this.updateIntervall = 400;
    }

    evaluate(clientDataPacket){
        switch (clientDataPacket.command){
            case 'joinLobby':
                //lobby 1
                if(clientDataPacket.lobbyToJoin == 1 && clientDataPacket.yourPlayer != 1 && clientDataPacket.yourPlayer != 2 ){
                    if(this.serverLobby_1.lobbyData.activeP1 == 0 || this.serverLobby_1.lobbyData.activeP2 == 0){
                        this.joinLobby(clientDataPacket);
                    } else {
                        this.joinLobbyFail(clientDataPacket);
                    }
                }
                break;
            case 'startRound': //dies kann weg
                this.serverLobby_1.lobbyData.command = clientDataPacket.command;
                this.serverLobby_1.lobbyData.yourPlayer = clientDataPacket.yourPlayer;
                this.serverRoundLobby_1.evaluate(clientDataPacket,this.serverLobby_1.lobbyData);
                break;
            case 'kickLobby':
                this.kickLobby(clientDataPacket);
                this.serverRoundLobby_1.resetAll(1);
                break;             
            case 'waitForGame':
                this.serverLobby_1.lobbyData.command = 'waitForGame';
                clientDataPacket.io.emit(this.serverLobby_1.lobbyData.serverAnwser, this.serverLobby_1.lobbyData);
                break;    
            default:
                this.serverLobby_1.lobbyData.command = clientDataPacket.command;
                this.serverLobby_1.lobbyData.yourPlayer = clientDataPacket.yourPlayer;
                this.serverRoundLobby_1.evaluate(clientDataPacket,this.serverLobby_1.lobbyData);
                break;                
        }
    }

    //Lobby
    joinLobby(clientDataPacket){
        console.log(clientDataPacket.playerName + " joined Lobby");
        this.serverLobby_1.lobbyData.command = 'joinLobby';
        if(this.serverLobby_1.lobbyData.activeP1 == 0 && clientDataPacket.lobbyToJoin == 1){
            this.serverLobby_1.lobbyData.activeP1 = 1;
            this.serverLobby_1.lobbyData.yourPlayer = 1;
            this.serverLobby_1.lobbyData.lobid = 1;
        } else if(this.serverLobby_1.lobbyData.activeP2 == 0 && clientDataPacket.yourPlayer != 1 && clientDataPacket.lobbyToJoin == 1){
            this.serverLobby_1.lobbyData.activeP2 = 2;
            this.serverLobby_1.lobbyData.yourPlayer = 2;
            this.serverLobby_1.lobbyData.lobid = 1;
        }
        let test = this.serverLobby_1.lobbyData;
        clientDataPacket.socket.emit(this.serverLobby_1.lobbyData.serverAnwser, this.serverLobby_1.lobbyData);
        this.serverLobby_1.lobbyData.command = 'updateLobby';
        // setTimeout(() =>{
            this.serverLobby_1.lobbyData.kiGame = clientDataPacket.kiGame;
            clientDataPacket.io.emit(this.serverLobby_1.lobbyData.serverAnwser, this.serverLobby_1.lobbyData); 
        //   }, this.updateIntervall);
        // let socket = dataPacket.socket
        // this.sender.sendToSender(this.lobby_1.lobbyData, socket);
    }

    joinLobbyFail(clientDataPacket){
        this.serverLobby_1.lobbyData.command = 'lobbyFull';
        this.serverLobby_1.lobbyData.playerName = 0;
        this.serverLobby_1.lobbyData.yourPlayer = 0;
        clientDataPacket.lobid = "lobby full";
        clientDataPacket.io.emit('serverAnswer', this.serverLobby_1.lobbyData);
    }

    kickLobby(clientDataPacket){
        console.log(clientDataPacket.playerName + " kick Lobby");
        this.serverLobby_1.lobbyData.command = 'kickLobby';
        this.serverLobby_1.lobbyData.activeP1 = 0;
        this.serverLobby_1.lobbyData.activeP2 = 0;
        this.serverLobby_1.lobbyData.lobid = "your are kicked from lobby";
        clientDataPacket.io.emit(this.serverLobby_1.lobbyData.serverAnwser, this.serverLobby_1.lobbyData);
        clientDataPacket.socket.broadcast.emit(this.serverLobby_1.lobbyData.serverAnwser, this.serverLobby_1.lobbyData);
    }
}

export {GameRoomManagerGet7};