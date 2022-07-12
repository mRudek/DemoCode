// ACHTUNG!! Componente Get7RuleText ist in ./reactBabelOutput/get7RuleText.js und wird in get7VScpu.html geladen
//------data packs
class DataPacketGet7{
  constructor(game){
    this.dataPack={
      'kiGame': false,
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
      'yourPlayer': 0,
      'activeP1': "",
      'activeP2': "",
      'lobbystatus': "",
      'gamestatus': "",
      chosenCardOne: -12
    }
  }
}

//------create connection
const socket = window.io(); // let socket = io();
let serverData; 

//------main app
class Get7Game extends React.Component{
  constructor(props) {
    super(props);
    this.get7KI = new Get7GameKI();
    this.playerAttackCommand = {status: false, sound: false,No: 0},
    this.gameRuning = false;
    this.cards = new CardListDemoGet7();
    this.maxCards = 51;
    this.startView = 0;
    this.updateIntervall = 300;
    this.wishlobby = -12;
    this.preloadImagesTimer = true;
    this.playerTurn = 0;
    this.attack = 0;
    this.audioAttack_1 = new Audio("/assets/sounds/p_1a.mp3");
    this.audioAttack_2 = new Audio("/assets/sounds/p_2a.mp3");
    this.audioAttack_3 = new Audio("/assets/sounds/p_3a.mp3");
    this.audioAttack_4 = new Audio("/assets/sounds/p_4a.mp3");
    this.audioAttack_5 = new Audio("/assets/sounds/p_5a.mp3");
    this.state = {
      btn: {width: '100px'},
      playsound: false,
      audio: new Audio("/assets/sounds/winFanFar.mp3"),
      p1Points: 0,
      p2Points:0,
      points:{ 
        pointsWinCondition: 5, 
        p1:{
            heros:0,
            officers:0,
            kings:0,
            soldiers:0,
            total:0
        },
        p2:{
            heros:0,
            officers:0,
            kings:0,
            soldiers:0,
            total:0
        }
      },
      update:0,
      tableView: this.startView,
      clientDataPacket: new DataPacketGet7("get7"),
      playerName: "",
      //Cards
      cardImageOnTable: this.cards.getCardListGet7(),
      cardStack: [],
      cardsOnTable:[],
      cardGroupOnTable_1:[],
      cardGroupOnTable_2:[],
      cardGroupOnTable_3:[],
      cardGroupOnTable_4:[],
      cardGroupOnTable_5:[],
      cardGroupOnTable_6:[],
      cardGroupOnTable_7:[],
      cardGroupOnTable_8:[],
      cardGroupOnTable_9:[],
      cardGroupOnTable_10:[],
      cardGroupOnTable_11:[],
      cardGroupOnTable_12:[],
      //new
      cardsTop:{
        handCards: [],
        cardStackempty:[],
        cardStackHeroes: [],
        cardStackKings: [],
        cardStackOfficers: [],
        cardStackSoldiers: []
      },
      cardsBot:{
          handCards: [],
          cardStackempty:[],
          cardStackHeroes: [],
          cardStackKings: [],
          cardStackOfficers: [],
          cardStackSoldiers: []
      },
      //Lobby
      joinedlobby: -1
    };
    //Testbuttons
    this.joinLobby = this.joinLobby.bind(this);
    this.kickLobby = this.kickLobby.bind(this);
    this.handOutHandCards = this.handOutHandCards.bind(this);
    this.startGame = this.startGame.bind(this);
    this.clickOnCard = this.clickOnCard.bind(this);
    this.clickOnCardOfficer = this.clickOnCardOfficer.bind(this);
    this.startGameKi = this.startGameKi.bind(this);
    this.listenServer(); //start listen for packets from server
  }

  listenServer(){
    socket.on('serverAnswer', datafromServerAnswer => {
      serverData = datafromServerAnswer;
      this.evaluate();
    });
  }

  joinLobby(lobbyNo){
    if(lobbyNo == 1){
      this.state.clientDataPacket.dataPack.command = "joinLobby";
      this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
      this.state.clientDataPacket.dataPack.lobbyToJoin = lobbyNo;
      this.sendToServer();
    }
  }
  
  //Gameraound
  startGame(){
    this.state.clientDataPacket.dataPack.command = "startRound";
    this.state.clientDataPacket.dataPack.kiGame = false;
    this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
    this.sendToServer();
  }

  startGameKi(){
    console.log("KIGame btn")
    this.state.clientDataPacket.dataPack.command = "startRound";
    this.state.clientDataPacket.dataPack.kiGame = true;
    this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
    this.get7KI.startGameKi(1,this.state.clientDataPacket);
    // this.get7KI.startGameKi(lobbyNo,this.state.clientDataPacket);
    //init sounds
    // this.sendToServer();
  }

  //click live for server
  clickOnCard(e){
      //to do switch uberarbeiten
      let tmpNo = 0;
      switch (this.state.playerName) {
        case 1: 
        tmpNo = 1
          break;
        case 2: 
        tmpNo = 2
          break;
      }
      if(this.playerTurn == tmpNo && this.gameRuning == true){
        this.state.clientDataPacket.dataPack.command = "evalPlayerTurn";
        this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
        this.state.clientDataPacket.dataPack.chosenCardOne = e;
        this.sendToServer();
        this.setState( { update:0, update:1}); //update rendering
      }
  }

  clickOnCardOfficer(e){
    //Wolf clicked && e == 33
    if(this.playerTurn == this.state.playerName && e == 33){
        let val = confirm("Wolf als 2 Punkte Soldat?");
        if (val == true) {
        alert("Wolf ist 2P Soldat");
        this.state.clientDataPacket.dataPack.command = "wolfsoldier";
        this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
        this.sendToServer();
      } else {
      alert("Nix geändert");
      }
    }
  }

  updateRoundTurn(cardData, playerTurn, cardsoundNo){
    if(this.state.playerName == 1 &&  this.gameRuning == true){
      this.state.cardsTop = cardData.p2;
      this.state.cardsBot = cardData.p1;
      this.state.audio.pause();
      this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
      this.state.audio.play();
    } 
    if(this.state.playerName == 2 && this.gameRuning == true){
      this.state.cardsTop = cardData.p1;
      this.state.cardsBot = cardData.p2;
      this.state.audio.pause();
      this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
      this.state.audio.play();
    }
    this.updateMidTableCards(cardData);
    this.playerTurn = playerTurn;
  }

  updateMidTableCards(cardData){
    this.state.cardGroupOnTable_1= cardData.cardGroupOnTable_X[1].array;
    this.state.cardGroupOnTable_2= cardData.cardGroupOnTable_X[2].array;
    this.state.cardGroupOnTable_3= cardData.cardGroupOnTable_X[3].array;
    this.state.cardGroupOnTable_4= cardData.cardGroupOnTable_X[4].array;
    this.state.cardGroupOnTable_5= cardData.cardGroupOnTable_X[5].array;
    this.state.cardGroupOnTable_6= cardData.cardGroupOnTable_X[6].array;
    this.state.cardGroupOnTable_7= cardData.cardGroupOnTable_X[7].array;
    this.state.cardGroupOnTable_8= cardData.cardGroupOnTable_X[8].array;
    this.state.cardGroupOnTable_9= cardData.cardGroupOnTable_X[9].array;
    this.state.cardGroupOnTable_10= cardData.cardGroupOnTable_X[10].array;
    this.state.cardGroupOnTable_11= cardData.cardGroupOnTable_X[11].array;
    this.state.cardGroupOnTable_12= cardData.cardGroupOnTable_X[12].array;
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

  attackCommand(playerTurn){
    if(this.playerAttackCommand.sound == false){
      this.playerAttackCommand.sound = true;
      this.playerTurn = playerTurn;
      this.state.audio.pause();
      this.playerAttackCommand.No = this.playerAttackCommand.No + 1;
      switch (this.playerAttackCommand.No){
        case 1:
          this.state.audio.pause();
          this.audioAttack_1.play();
            break;
        case 2:
          this.state.audio.pause();
          this.audioAttack_2.play();
            break;   
        case 3:
          this.state.audio.pause();
          this.audioAttack_3.play();
            break;    
        case 4:
          this.state.audio.pause();
          this.audioAttack_4.play();
            break;
        case 5:
          this.state.audio.pause();
          this.audioAttack_5.play();
            break;            
      }
    }
  }

  kickLobby(e){
    if(e.target.value == 1){
      this.state.clientDataPacket.dataPack.command = "kickLobby";
      this.state.playerName = 0;
      this.sendToServer();
      this.setState( {tableView:0 }); 
    }
  }

  handOutHandCards(){
    for(let i = 0; i<20; i=i+2){
      this.state.HandCardsTopEnemy.push(i);
      this.state.HandCardsBottemPlayer.push(i+1);
    }
    this.setState( { update:0, update:1}); //update rendering    
  }

  sendToServer(){
    console.log("send " + this.state.clientDataPacket.dataPack.command);
    socket.emit(this.state.clientDataPacket.dataPack.gameName, this.state.clientDataPacket.dataPack);
  }

  resetGame(){
    this.playerAttackCommand = {status: false, No: 0, phase: false},
    this.setState({
        p1Points: 0,
        p2Points:0,
        update:0,
        playerName: 0,
    })
  }

  evaluate(){
    switch (serverData.command){
      case 'lobbyFull':
          if(this.state.playerName == 1 || this.state.playerName == 2){
            //nothing
          } else {
            this.state.playerName = serverData.yourPlayer;
            this.state.clientDataPacket.dataPack.lobbystatus = "lobbyFull / Bitte Kick Lobby 1 Button betätigen";
            this.setState( { update:0, update:1}); //update rendering
          }
          break;
      case 'joinLobby':
          if(serverData.lobbystatus != "lobbyFull"){
            this.state.playerName = serverData.yourPlayer;
            this.state.clientDataPacket.dataPack.gamestatus = "press start round";
            this.state.joinedlobby = serverData.lobid;
            this.state.clientDataPacket.dataPack.lobid = serverData.lobid;
            this.setState( {tableView:1 }); 
            this.gameRuning = true;
          }
          break;
      case 'updateLobby':
          if(this.state.joinedlobby == serverData.lobid){
            this.playerTurn = 1;
            this.state.clientDataPacket.dataPack.activeP1 = serverData.activeP1;
            this.state.clientDataPacket.dataPack.activeP2 = serverData.activeP2;
            if(this.state.clientDataPacket.dataPack.kiGame == true){//vs KI
              this.state.playerName = 1;
            }
            this.setState( { update:0, update:1}); //update rendering
          }
          break;
      case 'kickLobby':
        this.resetGame();
        this.state.playerName = 0;
        this.state.clientDataPacket.dataPack.lobid = serverData.lobid;
        this.state.clientDataPacket.dataPack.yourPlayer = 0;
        this.state.clientDataPacket.dataPack.activeP1 = serverData.activeP1;
        this.state.clientDataPacket.dataPack.activeP2 = serverData.activeP2;
        this.state.clientDataPacket.dataPack.lobbystatus = "player can join";
        this.state.clientDataPacket.dataPack.gamestatus = "";
        this.setState( {tableView:0 }); 
        this.state.clientDataPacket = new DataPacketGet7("get7");
        this.setState( { update:0, update:1}); //update rendering
          break;
      case 'waitForPlayer':
          this.state.clientDataPacket.dataPack.gamestatus = "waiting for other Players to start";
          // this.setState( {tableView:2 }); 
          this.state.clientDataPacket.dataPack.activeP1 = serverData.activeP1;
          this.state.clientDataPacket.dataPack.activeP2 = serverData.activeP2;
          this.setState( { update:0, update:1}); //update rendering 
          break;  
      case 'startRound':
        this.setState( {tableView:3 }); 
        this.state.clientDataPacket.dataPack.gamestatus = "viel spaß beim zocken";
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,0);
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'evalPlayerTurn':
        this.playerAttackCommand.status = false;
        this.playerAttackCommand.sound = false;
        this.state.p1Points = serverData.p1Points;
        this.state.p2Points = serverData.p2Points;
        this.state.points = serverData.points;
        if(this.gameRuning == true){
          this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        }
        this.setState( { update:0, update:1}); //update rendering
        if(this.state.clientDataPacket.dataPack.kiGame == true && serverData.playerTurn == 2 && this.gameRuning == true){//vs KI
          let KICard = this.state.cardsTop.handCards[0];
          this.get7KI.clickOnCard(KICard,this.state.clientDataPacket);
        }
        break;
      case 'attackRequest':
        if(this.state.clientDataPacket.dataPack.kiGame == true){
          this.playerAttackCommand.status = false;
          this.playerAttackCommand.sound = false;
        } 
        this.state.p1Points = serverData.p1Points;
        this.state.p2Points = serverData.p2Points;
        this.state.points = serverData.points;
        if(this.gameRuning == true){
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.attackRequest(serverData.playerTurn);
        }
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'attackAllowed': 
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.state.playerTurn = serverData.playerTurn;
        this.attackCommand(serverData.playerTurn);
        this.setState( { update:0, update:1}); //update rendering
        if(this.state.clientDataPacket.dataPack.kiGame == true && serverData.playerTurn == 2 && this.gameRuning == true){//vs KI
          let KICard = this.state.cardsTop.handCards[0];
          this.get7KI.clickOnCard(KICard,this.state.clientDataPacket);
        }
        break;
      case 'p1Wins':
        this.gameRuning = false;
        this.state.audio.pause();
        this.state.audio = new Audio("/assets/sounds/p_win.mp3");
        this.state.p1Points = serverData.p1Points + "p1Wins";
        this.state.points = serverData.points;
          if(this.state.playerName == 2){
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          } 
          this.state.audio.play();
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'p2Wins':
        this.gameRuning = false;
        this.state.audio.pause();
        this.state.audio = new Audio("/assets/sounds/p_win.mp3");
        this.state.p2Points = serverData.p2Points + "p2Wins";
        this.state.points = serverData.points;
        if(this.state.playerName == 1){
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
        }
        this.state.audio.play();
        this.setState( { update:0, update:1}); //update rendering 
        break;
        case 'p1WinsCounter':
          // if(this.state.clientDataPacket.dataPack.kiGame == true){
          //   this.state.playerName = 1;
          //   this.state.playerTurn = 1;
          // } 
          this.gameRuning = false;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_win.mp3");
          this.state.p1Points = serverData.p1Points + "p1WinsCounter";
          this.state.points = serverData.points;
            if(this.state.playerName == 2){
              this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
            } 
          this.state.audio.play();
          this.setState( { update:0, update:1}); //update rendering 
          break;
        case 'p2WinsCounter':
          this.gameRuning = false;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_win.mp3");
          this.state.p2Points = serverData.p2Points + "p2WinsCounter";
          this.state.points = serverData.points;
          if(this.state.playerName == 1){
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          }
          this.state.audio.play();
          this.setState( { update:0, update:1}); //update rendering 
          break;
      case 'remis':
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.state.p2Points = serverData.p2Points + "unentschieden";
        this.state.points = serverData.points;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3"); 
          this.state.audio.play();
        this.setState( { update:0, update:1}); //update rendering 
        this.gameRuning = false;
        break;
      case 'wolfsoldier':
        this.state.p1Points = serverData.p1Points;
        this.state.p2Points = serverData.p2Points;
        this.state.points = serverData.points;
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.setState( { update:0, update:1}); //update rendering
        break;
      default:
          break;                
    }
  }
  //***************************************************/
  //-----------render-----------------
  render() {
    //------------------Lobby outside
    if(this.state.tableView == 0){
      return (
        <div>
          <LobbyOutside 
          playerName={this.state.playerName} 
          serverDataPack={this.state.clientDataPacket}
          joinLobby={(e) => this.joinLobby(e)}
          kickLobby={this.kickLobby}
          />
        </div>

      );
    }
    //------------------Lobby inside
    if(this.state.tableView == 1){
      return (
        <div>
          <LobbyInside 
          playerName={this.state.playerName} 
          serverDataPack={this.state.clientDataPacket}
          startGame={this.startGame}
          kickLobby={this.kickLobby}
          startGameKi = {this.startGameKi}
          />
        </div>
      );
    }
    //------------------Lobby inside wait for Player
    if(this.state.tableView == 2){
      return (
        <div className="level-0-box">
          <div className="level-1-playFieldScreen-mid-status" style={ {height: "60px" }} >
            WARTE AUF SPIELER
          </div>
          <button className="level-2-joinBtns" value="1" onClick={this.kickLobby} id="testbtn" > Kick Lobby 1 </button> 
        </div>
      );
    }
    //------------------joined lobby as player
    if(this.state.tableView == 3){
      return (
        <div>
          <GameScreen
            //comp 1 
            cardStack={this.state.cardStack}
            cardsTop={this.state.cardsTop}
            cardImageOnTable={this.state.cardImageOnTable}
            cardStackempty = {this.state.cardStackempty}
            //comp 2
            points = {this.state.points}
            //comp 3
            cardGroupOnTable_1 = {this.state.cardGroupOnTable_1}
            cardGroupOnTable_2 = {this.state.cardGroupOnTable_2}
            cardGroupOnTable_3 = {this.state.cardGroupOnTable_3}
            cardGroupOnTable_4 = {this.state.cardGroupOnTable_4}
            cardGroupOnTable_5 = {this.state.cardGroupOnTable_5}
            cardGroupOnTable_6 = {this.state.cardGroupOnTable_6}
            cardGroupOnTable_7 = {this.state.cardGroupOnTable_7}
            cardGroupOnTable_8 = {this.state.cardGroupOnTable_8}
            cardGroupOnTable_9 = {this.state.cardGroupOnTable_9}
            cardGroupOnTable_10 = {this.state.cardGroupOnTable_10}
            cardGroupOnTable_11 = {this.state.cardGroupOnTable_11}
            cardGroupOnTable_12 = {this.state.cardGroupOnTable_12}
            //comp 4
            playerName={this.state.playerName} 
            playerTurn= {this.playerTurn} 
            p1Points= {this.state.p1Points} 
            p2Points={this.state.p2Points} 
            kickLobby={this.kickLobby}
            //comp 5
            cardsBot={this.state.cardsBot}
            clickOnCard={(a) => this.clickOnCard(a)}
            //comp 6
            clickOnCardOfficer={(a) => this.clickOnCardOfficer(a)}
          />
        </div>
      );
    }
  }
}

//---------------components
//template zur Erstellung neuer Komponente; wird im Code nicht benötiget
const template = ({}) => {
  return (
      <div className="level-2-get7StatusScreen">
      </div>
  );
}

//---------------components for GUI
const LobbyOutside = ({joinLobby, kickLobby, playerName, serverDataPack}) => {
  return (
    <div className="level-0-box">
      <div className="level-1-lobbybtnArea">
        <button className="level-2-joinBtns" value="1" onClick={() => joinLobby(1)}> Join Lob 1 </button>  
        <button className="level-2-joinBtns" value="1" onClick={kickLobby} id="testbtn" > Kick Lobby 1 </button>  
      </div> 
      <div className="level-1-statusScreen" id="statusScreen">
        <Get7StatusScreen playerName={playerName} serverDataPack={serverDataPack}/>
      </div>
    </div>
  );
}

const LobbyInside = ({playerName, startGame,startGameKi, kickLobby, serverDataPack}) => {
  return (
    <div className="level-0-box">
      <div className="level-1-statusScreen" id="statusScreen">
        <Get7StatusScreen playerName={playerName} serverDataPack={serverDataPack}/>
      </div>
      <div className="level-1-lobbybtnArea">
        <button className="level-2-joinBtns" onClick={startGame}> VS Menschen </button> 
        <button className="level-2-joinBtns" onClick={startGameKi}> VS Ki </button> 
        <button className="level-2-joinBtns" value="1" onClick={kickLobby}> Kick Lobby 1 </button>  
      </div>
    </div>
  );
}

const GameScreen = ({clickOnCardOfficer, clickOnCard, cardsBot, kickLobby, p2Points, p1Points, playerTurn, playerName,
                      cardGroupOnTable_1,cardGroupOnTable_2,cardGroupOnTable_3,cardGroupOnTable_4,cardGroupOnTable_5,cardGroupOnTable_6,cardGroupOnTable_7,cardGroupOnTable_8,cardGroupOnTable_9,cardGroupOnTable_10,cardGroupOnTable_11,cardGroupOnTable_12,
                      points, cardStackempty, cardImageOnTable, cardsTop, cardStack
                    }) => {
  return (
    <div className="level-0-box">
      <div className="level-1-playerTableScreen-Player" id="playerTopField">
        <CardStorageDiscardedEnemy
        cardStack={cardStack}
        cardStackdata={cardsTop}
        backgrund={cardImageOnTable}
        cardStackempty = {cardStackempty}
        cardButtonClicked={() => ''}
        points = {points.p2}
        />
      </div>
      <div className="level-1-playFieldScreen-mid-cards">
        <div className="level-2-playFieldScreen-mid-cards" id="midField-1">
        <Get7PlayField cardStack={cardGroupOnTable_1} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-2">
        <Get7PlayField cardStack={cardGroupOnTable_2} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-3">
        <Get7PlayField cardStack={cardGroupOnTable_3} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-4">
        <Get7PlayField cardStack={cardGroupOnTable_4} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-5">
        <Get7PlayField cardStack={cardGroupOnTable_5} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-6">
        <Get7PlayField cardStack={cardGroupOnTable_6} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-7">
        <Get7PlayField cardStack={cardGroupOnTable_7} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-8">
        <Get7PlayField cardStack={cardGroupOnTable_8} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-9">
        <Get7PlayField cardStack={cardGroupOnTable_9} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-10">
        <Get7PlayField cardStack={cardGroupOnTable_10} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-11">
        <Get7PlayField cardStack={cardGroupOnTable_11} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-cards" id="midField-12">
        <Get7PlayField cardStack={cardGroupOnTable_12} cardButtonClicked={() =>''} backgrund={cardImageOnTable}/>
        </div>
        <div className="level-2-playFieldScreen-mid-rules"  >
        <Get7RuleText />
        </div>
      </div>

      <div className="level-1-playFieldScreen-mid-status" style={ {height: "60px" }} >
      <div className="level-2-playFieldScreen-mid-status-side" style={ {height: "60px" }} >
         <p> DU bist: {playerName} <br></br> Spieler dran: P{playerTurn} </p>
        </div>
        <div className="level-2-playFieldScreen-mid-status-side" style={ {height: "60px" }} >
        <p>POINTS P1: {p1Points} / {points.pointsWinCondition} <br></br> POINTS P2: {p2Points} / {points.pointsWinCondition}  </p> 
        </div>
        <div className="level-2-playFieldScreen-mid-status-mid" style={ {height: "60px" }} >
          <button className="level-2-joinBtnKick" value="1" onClick={kickLobby}> neue Runde </button>
        </div>
      </div>
      <div className="level-1-playerTableScreen-Player" id="playerBottemField">
        <CardStorageHandPlayer 
        cardStack={cardStack}
        cardStackdata={cardsBot}
        backgrund={cardImageOnTable}
        cardStackempty = {cardStackempty}
        cardButtonClicked={(a) => clickOnCard(a)}
        />
        <CardStorageDiscarded 
        cardStack={cardStack}
        cardStackdata={cardsBot}
        backgrund={cardImageOnTable}
        cardStackempty = {cardStackempty}
        cardButtonClicked={(a) => clickOnCardOfficer(a)}
        points = {points.p1}
        />
      </div>
    </div>
  );
}


const Get7StatusScreen = ({serverDataPack, playerName}) => {
    return (
        <div className="level-2-get7StatusScreen">
          <div className="level-3-get7StatusScreenElement">Lobby: {serverDataPack.dataPack.lobid}</div>
          <div className="level-3-get7StatusScreenElement">Mein Name: {playerName}</div>
          <div className="level-3-get7StatusScreenElement">P1 Name:{serverDataPack.dataPack.activeP1}</div> 
          <div className="level-3-get7StatusScreenElement">P2 Name:{serverDataPack.dataPack.activeP2}</div>
          <div className="level-3-get7StatusScreenElement">Spielstatus: {serverDataPack.dataPack.gamestatus}</div>
          <div className="level-3-get7StatusScreenElement">LobbyDaten:{serverDataPack.dataPack.activeP1}----{serverDataPack.dataPack.activeP2} </div>
          <div className="level-3-get7StatusScreenElement">Lobby Status: {serverDataPack.dataPack.lobbystatus} </div> 
          <div className="level-3-get7StatusScreenElement"><a href="https://www.pagat.com/de/fishing/gostop.html" target="_blank"> Link zu Regel auf externer Seite</a></div> 
        </div>
    );
}

const CardStorageHandPlayer = ({cardStackdata, cardButtonClicked, backgrund}) => {
  return (
    <div  id="handcard-table">
          Deine Karten
        <Get7CardStorage cardStack={cardStackdata.handCards} cardButtonClicked={cardButtonClicked} backgrund={backgrund}/>
    </div>
  );
}

const CardStorageHandEnemy = ({cardStackdata, cardButtonClicked, backgrund}) => {
  return (
    <div  id="handcard-table">
        <Get7CardStorage cardStack={cardStackdata.handCards} cardButtonClicked={cardButtonClicked} backgrund={backgrund}/>
    </div>
  )
}

const CardStorageDiscarded = ({cardStackdata, cardButtonClicked, backgrund, points}) => {
  return (
      <div id="name-CardStorages">
        <div id="hero-table">
            {points.heros} P; 3 H = 3 P; 5 h = 15 P;
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackHeroes} cardButtonClicked={() =>''} backgrund={backgrund}/>
        </div>
        <div  id="king-table">
          {points.kings} P; ab 5 Könige = +1 P; 3 Könige gleiche Farbe = 3 Extra Punkte;
          <Get7CardStorage cardStack={cardStackdata.cardStackKings} cardButtonClicked={() =>''} backgrund={backgrund}/>
        </div>
        <div id="officer-table">  
          {points.officers} P; ab 5 Offi = +1 Punkte; 3 Goldene = 3 Extra Punkte
          <Get7CardStorage cardStack={cardStackdata.cardStackOfficers} cardButtonClicked={cardButtonClicked} backgrund={backgrund}/>
        </div>
        <div  id="soldier-table">
            {points.soldiers} P, da {cardStackdata.cardStackSoldiers.length} / 10 Soldaten; S2 zählen als 2 Soldaten
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackSoldiers} cardButtonClicked={() =>''} backgrund={backgrund} />
        </div>
      </div>
  );
}

const CardStorageDiscardedEnemy = ({cardStackdata, cardButtonClicked, backgrund, points}) => {
  return (
      <div id="name-CardStorages">
        <div id="handcards-table-enemy">
          Gegnerkarten
          <Get7CardStorageSmallCards cardStack={cardStackdata.handCards} cardButtonClicked={() =>''} backgrund={backgrund}/>
        </div>
        <div id="hero-table-enemy">
            {points.heros} P
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackHeroes} cardButtonClicked={() =>''} backgrund={backgrund}/>
        </div>
        <div  id="king-table-enemy">
          {points.kings} P; ab 5 Könige = +1 P; 3 Könige gleiche Farbe = 3 Extra Punkte; P2 Cards:{cardStackdata.handCards.length}
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackKings} cardButtonClicked={() =>''} backgrund={backgrund}/>
        </div>
        <div id="officer-table-enemy">  
          {points.officers} P; ab 5 Offi = +1 Punkte; 3 Goldene = 3 Extra Punkte
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackOfficers} cardButtonClicked={cardButtonClicked} backgrund={backgrund}/>
        </div>
        <div  id="soldier-table-enemy">
            {points.soldiers} P, da {cardStackdata.cardStackSoldiers.length} / 10 Soldaten; S2 zählen als 2 Soldaten
          <Get7CardStorageSmallCards cardStack={cardStackdata.cardStackSoldiers} cardButtonClicked={() =>''} backgrund={backgrund} />
        </div>
      </div>
  );
}

class Get7CardStorage extends React.Component {
  placeCardsOnTable(props) {
    // props.click
      const numbers = props.numbers
      // let url = "url('" + props.backgrund[3].src + "')"; //only for test
      const listItems = numbers.map((number) =>
            <button className="playingcard" id={number.toString()} key={number.toString()} value={number.toString()} onClick={() => console.log(props.click(number))} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')" , color: props.backgrund[number].color}} > 
            {props.backgrund[number].group} {props.backgrund[number].cardtype}
            </button>
      //, border: props.backgrund[number].border
      );
      return (
      <ul>{listItems}</ul>
      );
  }
  //-----------render-----------------
  render() {
      return (
          <this.placeCardsOnTable numbers={this.props.cardStack} click={this.props.cardButtonClicked} backgrund={this.props.backgrund}/> 
      );      
  }
}

class Get7CardStorageSmallCards extends React.Component {
  placeCardsOnTable(props) {
    // props.click
      const numbers = props.numbers
      // let url = "url('" + props.backgrund[3].src + "')"; //only for test
      const listItems = numbers.map((number) =>
            <button className="playingcard-SmallCards" id={number.toString()} key={number.toString()} value={number.toString()} onClick={() => console.log(props.click(number))} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')" , color: props.backgrund[number].color}} > 
            {props.backgrund[number].group} {props.backgrund[number].cardtype}
            </button>
      //, border: props.backgrund[number].border
      );
      return (
      <ul>{listItems}</ul>
      );
  }
  //-----------render-----------------
  render() {
      return (
          <this.placeCardsOnTable numbers={this.props.cardStack} click={this.props.cardButtonClicked} backgrund={this.props.backgrund}/> 
      );      
  }
}

const Get7PlayField =({cardStack, cardButtonClicked, backgrund}) =>{
    return (
        <div className="midField-card">
          {/* <button className="playingcard" onClick={this.props.cardButtonClicked} style={{ backgroundImage: "url('" + this.props.backgrund[0].src + "')"}} ></button> */}
          <Get7CardStorage cardStack={cardStack}  cardButtonClicked={cardButtonClicked} backgrund={backgrund}/>
        </div>
    );
}

const Get7GameMain = () => {
    return (
        <div id="main-box-Get7">
        <Get7Game />
        </div>
    );
}
   
ReactDOM.render(
  <Get7GameMain />,
  document.getElementById('get7rootVSCPU')
);

  