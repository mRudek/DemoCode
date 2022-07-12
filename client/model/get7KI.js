//------data packs
class DataPacketGet7KI{
  constructor(game){
    this.dataPack={
      'gameName': game,
      'score': 0,
      'socket': {},
      'io':{},
      'command':'',
      'playerName': "abc",
      'playerArrayId': -5,
      'lobid': -6,
      'lobbyToJoin': -6,
      'isHuman': 1,
      'yourPlayer': "PlayerClient 12 dd",
      'activeP1': "",
      'activeP2': "",
      'lobbystatus': "",
      'gamestatus': "",
      chosenCardOne: -12
    }
  }
}

// //------create connection
// const socket = window.io(); // var socket = io();
// var serverData; 
var serverDataKI;

//------main app
class Get7GameKI {
  constructor() {
  }

  startGameKi(lobbyNo,clientDataPacket){
    this.joinLobby(lobbyNo,clientDataPacket);
    clientDataPacket.dataPack.command = "startRound";
    clientDataPacket.dataPack.yourPlayer = 2;
    this.sendToServer(clientDataPacket);
    clientDataPacket.dataPack.yourPlayer = 1;
    this.sendToServer(clientDataPacket);
  }

  joinLobby(lobbyNo,clientDataPacket){
    if(lobbyNo == 1){
      clientDataPacket.dataPack.command = "joinLobby";
      clientDataPacket.dataPack.yourPlayer = '';
      clientDataPacket.dataPack.lobbyToJoin = lobbyNo;
      this.sendToServer(clientDataPacket);
    }
  }

  //click live for server
  clickOnCard(e,clientDataPacket){
      clientDataPacket.dataPack.command = "evalPlayerTurn";
      clientDataPacket.dataPack.yourPlayer = 2;
      clientDataPacket.dataPack.chosenCardOne = e;
      this.sendToServer(clientDataPacket);
  }

  attackRequest(playerTurn){
    console.log("attack");
    //human
    if(playerTurn == this.state.playerName && this.playerAttackCommand.status == false){
      this.playerAttackCommand.status = true;
      let val = confirm("Weiter Angreifen?");
      if (val == true) {
        // alert("attacking");
        this.state.clientDataPacket.dataPack.command = "wantAttackPlayer";
        this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
        if(this.playerAttackCommand.No > 5){
          this.state.clientDataPacket.dataPack.command = "getWin";
        }
        if(this.gameRuning == true){
          this.sendToServer();
        }
      } else {
        this.state.clientDataPacket.dataPack.command = "getWin";
        if(this.gameRuning == true){
          this.sendToServer();
        }
        this.gameRuning = false;
      }
    }
    //KI
    if(playerTurn == 2 && this.state.clientDataPacket.dataPack.kiGame  == true && this.playerAttackCommand.status == false &&  this.state.cardsBot.handCards.length > 0){
      this.playerAttackCommand.status = true;
      this.state.clientDataPacket.dataPack.yourPlayer = 2;
      this.state.clientDataPacket.dataPack.command = "getWin";
      this.sendToServer();
    }
  }

  sendToServer(clientDataPacket){
    console.log("send KI" );
    console.log("send KI" + clientDataPacket.dataPack.command);
    socket.emit(clientDataPacket.dataPack.gameName, clientDataPacket.dataPack);
  }

}
