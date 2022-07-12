//------data packs
class DataPacketGet7{
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
      'yourPlayer': "PlayerClient 12",
      'activeP1': "",
      'activeP2': "",
      'lobbystatus': "",
      'gamestatus': "",
      chosenCardOne: -12
    }
  }
}

//------create connection
const socket = window.io(); // var socket = io();
var serverData; 

//------main app this.ki = new Get7GameKI();
class Get7Game extends React.Component{
  constructor(props) {
    super(props);
    this.cards = new CardListGet7();
    this.maxCards = 50;
    this.startView = 0;
    this.updateIntervall = 300;
    this.wishlobby = -12;
    this.preloadImagesTimer = true;
    this.playerTurn = 0;
    this.state = {
      btn: {width: '100px'},
      playsound: false,
      audio: new Audio("/assets/sounds/winFanFar.mp3"),
      p1Points: 0,
      p2Points:0,
      update:0,
      tableView: this.startView,
      server: new DataPacketGet7("get7"),
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
    this.addToKings = this.addToKings.bind(this);
    this.delfromKings = this.delfromKings.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.kickLobby = this.kickLobby.bind(this);
    this.handOutHandCards = this.handOutHandCards.bind(this);
    this.startGame = this.startGame.bind(this);
    this.clickOnCard = this.clickOnCard.bind(this);
  }

  listenServer(){
    socket.on('serverAnswer', data => {
      serverData = data;
      this.evaluate();
    });
  }

  //Gameraound
  startGame(){
    // this.preloadImages();
    this.state.server.dataPack.command = "startRound";
    this.state.server.dataPack.yourPlayer = this.state.playerName;
    //init sounds
    this.sendToServer();
    this.setState( {tableView:2 }); 
  }

  preloadImages(serverCardDeck){
    var tmpImg = this.cards.getCardListGet7();
      for(let i = 0; i < this.maxCards; i++){
        this.state.cardImageOnTable.push(tmpImg.pop());
      }
      this.setState( { update:0, update:1}); //update rendering
  }
  //click live for server
  clickOnCard(e){ 
    this.state.server.dataPack.command = "evalPlayerTurn";
    this.state.server.dataPack.yourPlayer = this.state.playerName;
    this.state.server.dataPack.chosenCardOne = e.target.value;
    var tmpstr = "P" + this.playerTurn;
    if(tmpstr == this.state.playerName){
      this.sendToServer();
    }
    this.setState( { update:0, update:1}); //update rendering
  }

  updateRoundTurn(cardData,playerTurn, cardsoundNo){
    // this.state.cardStack = cardData.cardStack;
    this.state.cardsOnTable = cardData.cardsOnTable;
    if(this.state.playerName == "P1"){
      this.state.cardsTop = cardData.p2;
      this.state.cardsBot = cardData.p1;
      this.state.audio.pause();
      this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
      this.state.audio.play();
    } 
    if(this.state.playerName == "P2"){
      this.state.cardsTop = cardData.p1;
      this.state.cardsBot = cardData.p2;
      this.state.audio.pause();
      this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
      this.state.audio.play();
    }
    this.updateMidTableCards(cardData);
    this.playerTurn = playerTurn;
    this.state.server.dataPack.gamestatus = "Spieler ma zug: " + playerTurn;
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

  //-----------Testfunctions-----------------
  addToKings(){
    this.state.cardsBot.cardStack.push(0);
    this.state.cardsBot.cardStackHeroes.push(1);
    this.state.cardsBot.cardStackKings.push(2);
    this.state.cardsBot.cardStackOfficers.push(3);
    this.state.cardsBot.HandCardsTopEnemy.push(4);
    this.state.cardsBot.HandCardsBottemPlayer.push(5);
    this.state.cardsBot.cardStackSoldiers.push(6);
    this.setState( { update:0, update:1}); //update rendering
  }

  delfromKings(){
    this.state.cardStack.pop();
    this.state.cardStackHeroes.pop();
    this.state.cardStackKings.pop();
    this.state.cardStackOfficers.pop();
    this.state.HandCardsTopEnemy.pop();
    this.state.HandCardsBottemPlayer.pop();
    this.state.cardStackSoldiers.pop();
    this.setState( { update:0, update:1}); //update rendering    
  }

  joinLobby(e){
    if(e.target.value == 1){
      this.state.server.dataPack.command = "joinLobby";
      this.state.server.dataPack.yourPlayer = this.state.playerName;
      this.state.server.dataPack.lobbyToJoin = e.target.value;
      this.sendToServer();
    }
    // this.setState( { update:0, update:1}); //update rendering  
  }

  kickLobby(e){
    if(e.target.value == 1){
      this.state.server.dataPack.command = "kickLobby";
      this.state.playerName ="";
      this.sendToServer();
      this.setState( {tableView:0 }); 
    }
  }

  testAnimation(){
    var height = 200;
    const btnNewGame = document.getElementById("testbtn");
    // btnNewGame.setAttribute("style", "height: " + height +"px;");
  }

  handOutHandCards(){
    for(let i = 0; i<20; i=i+2){
      this.state.HandCardsTopEnemy.push(i);
      this.state.HandCardsBottemPlayer.push(i+1);
    }
    this.setState( { update:0, update:1}); //update rendering    
  }

  sendToServer(){
    console.log("send " + this.state.server.dataPack.command);
    socket.emit(this.state.server.dataPack.gameName, this.state.server.dataPack);
    this.listenServer();
  }

  emptyAll(){
    this.setState( {
        p1Points: 0,
        p2Points:0,
        update:0,
        server: new DataPacketGet7("get7"),
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
        }
      }
    )
  }

  evaluate(){
    switch (serverData.command){
      case 'lobbyFull':
          if(this.state.playerName == "P1" || this.state.playerName == "P2"){
            //nothing
          } else {
            this.state.playerName = serverData.yourPlayer;
            this.state.server.dataPack.lobbystatus = "lobbyFull";
            this.setState( { update:0, update:1}); //update rendering
          }
          break;
      case 'joinLobby':
          if(serverData.lobbystatus != "lobbyFull"){
            this.state.playerName = serverData.yourPlayer;
            // this.state.playerNo = serverData.yourPlayer;
            this.state.server.dataPack.gamestatus = "press start round";
            this.state.joinedlobby = serverData.lobid;
            this.state.server.dataPack.lobid = serverData.lobid;
            this.setState( {tableView:1 }); 
          }
          break;
      case 'updateLobby':
          if(this.state.joinedlobby == serverData.lobid){
            this.state.server.dataPack.activeP1 = serverData.activeP1;
            this.state.server.dataPack.activeP2 = serverData.activeP2;
            this.setState( { update:0, update:1}); //update rendering
          }
          break;
      case 'kickLobby':
          this.emptyAll();
          this.state.playerName ="";
          this.state.server.dataPack.lobid = serverData.lobid;
          this.state.server.dataPack.yourPlayer = "";
          this.state.server.dataPack.activeP1 = serverData.activeP1;
          this.state.server.dataPack.activeP2 = serverData.activeP2;
          this.state.server.dataPack.lobbystatus = "player can join";
          this.state.server.dataPack.gamestatus = "";
          this.setState( {tableView:0 }); 
          this.setState( { update:0, update:1}); //update rendering
          this.state.server = new DataPacketGet7("get7");
          this.setState( { update:0, update:1}); //update rendering
          break;
      case 'waitForPlayer':
          this.state.server.dataPack.gamestatus = "waiting for other Players to start";
          this.setState( { update:0, update:1}); //update rendering 
          break;  
      case 'startRound':
        this.setState( {tableView:3 }); 
        this.state.server.dataPack.gamestatus = "viel spaß beim zocken";
        this.playerTurn = serverData.playerTurn;
        // this.preloadImages(serverData.cardDeck);
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,0);
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'updateCards':
        this.state.server.dataPack.gamestatus = "viel spaß beim zocken";
        // this.preloadImages(serverData.cardDeck);
        this.updateRoundTurn();
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'evalPlayerTurn':
        this.state.p1Points = serverData.p1Points;
        this.state.p2Points = serverData.p2Points;
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'p1Wins':
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.setState( { update:0, update:1}); //update rendering 
        this.state.p1Points = serverData.p1Points + "p1Wins";
          this.state.audio.pause();
          if(this.state.playerName == "P2"){
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          } else {
            this.state.audio = new Audio("/assets/sounds/winFanFar.mp3"); 
          }
          this.state.audio.play();
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'p2Wins':
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.setState( { update:0, update:1}); //update rendering 
        this.state.p2Points = serverData.p2Points + "p2Wins";
        this.state.audio.pause();
        if(this.state.playerName == "P1"){
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
        } else {
          this.state.audio = new Audio("/assets/sounds/winFanFar.mp3"); 
        }
        this.state.audio.play();
        this.setState( { update:0, update:1}); //update rendering 
        break;
      case 'remis':
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.setState( { update:0, update:1}); //update rendering 
        this.updateRoundTurn(serverData.distributedCards,serverData.playerTurn,serverData.chosenCardOne);
        this.state.p2Points = serverData.p2Points + "unentschieden";
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3"); 
          this.state.audio.play();
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
        <div className="level-0-box">
          <div className="level-1-lobbybtnArea">
            <button className="level-2-joinBtns" value="1" onClick={this.joinLobby}> Join Lob 1 </button>  
            <button className="level-2-joinBtns" value="1" onClick={this.kickLobby} id="testbtn" > Kick Lobby 1 </button>  
          </div> 
          <div className="level-1-statusScreen" id="statusScreen">
            <Get7StatusScreen playerName={this.state.playerName} serverDataPack={this.state.server}/>
          </div>
        </div>
      );
    }
    //------------------Lobby inside
    if(this.state.tableView == 1){
      return (
        <div className="level-0-box">
          <div className="level-1-statusScreen" id="statusScreen">
            <Get7StatusScreen playerName={this.state.playerName} serverDataPack={this.state.server}/>
          </div>
          <div className="level-1-lobbybtnArea">
            <button className="level-2-joinBtns" onClick={this.startGame}> Runde starten </button> 
            <button className="level-2-joinBtns" value="1" onClick={this.kickLobby}> Kick Lobby 1 </button>  
          </div>
        </div>
      );
    }
    //------------------Lobby inside
    if(this.state.tableView == 2){
      return (
        <div className="level-0-box">
          <div className="level-1-playFieldScreen-mid-status" style={ {height: "60px" }} >
            WARTE AUF SPIELER
          </div>
        </div>
      );
    }
    //------------------joined lobby as player
    if(this.state.tableView == 3){
      return (
        <div className="level-0-box">
          <div className="level-1-testArea">
            {/* <button  onClick={this.addToKings}> Ad to Kings </button>
            <button  onClick={this.delfromKings}> del from Kings </button>  
            <button onClick={this.handOutHandCards}> Handout Cards </button>  
            <button onClick={this.createDeck}> Deck erstellen </button>   */}
          </div> 
          <div className="level-1-playerTableScreen" id="enemyTopField">
            <CardStorageHand 
            cardStack={this.state.cardStack}
            cardStackdata={this.state.cardsTop}
            backgrund={this.state.cardImageOnTable}
            cardStackempty = {this.state.cardStackempty}
            />
            <CardStorageDiscarded 
            cardStack={this.state.cardStack}
            cardStackdata={this.state.cardsTop}
            backgrund={this.state.cardImageOnTable}
            cardStackempty = {this.state.cardStackempty}
            cardButtonClicked={this.clickOnCard}
            />
          </div>
          <div className="level-1-playFieldScreen-mid-cards">
            <div className="level-2-playFieldScreen-mid-cards" id="midField-1">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_1} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-2">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_2} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-3">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_3} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-4">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_4} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-5">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_5} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-6">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_6} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-7">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_7} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-8">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_8} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-9">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_9} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-10">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_10} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-10">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_11} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
            <div className="level-2-playFieldScreen-mid-cards" id="midField-10">
            <Get7PlayField cardStack={this.state.cardGroupOnTable_12} cardButtonClicked={this.clickOnCard} backgrund={this.state.cardImageOnTable}/>
            </div>
          </div>
          <div className="level-1-playFieldScreen-mid-status" style={ {height: "60px" }} >
            POINTS P1: {this.state.p1Points} ** POINTS P2: {this.state.p2Points} **Spieler dran: {this.playerTurn} ** Dein Spieler: {this.state.playerName} **Karten DECK: {this.state.cardStack.length} * Tisch: {this.state.cardsOnTable.length}
            <button className="level-2-joinBtns" value="1" onClick={this.kickLobby}> neue Runde </button>   
          </div>
          <div className="level-1-playerTableScreen" id="playerBottemField">
            <CardStorageHand 
            cardStack={this.state.cardStack}
            cardStackdata={this.state.cardsBot}
            backgrund={this.state.cardImageOnTable}
            cardStackempty = {this.state.cardStackempty}
            cardButtonClicked={this.clickOnCard}
            />
            <CardStorageDiscarded 
            cardStack={this.state.cardStack}
            cardStackdata={this.state.cardsBot}
            backgrund={this.state.cardImageOnTable}
            cardStackempty = {this.state.cardStackempty}
            cardButtonClicked={this.clickOnCard}
            />
          </div>
        </div>
      );
    }
  }
}

//------components
class Get7StatusScreen extends React.Component {
  render() {
    return (
        <div className="level-2-get7StatusScreen">
          <div className="level-3-get7StatusScreenElement">Lobby: {this.props.serverDataPack.dataPack.lobid}</div>
          <div className="level-3-get7StatusScreenElement">Mein Name: {this.props.playerName}</div>
          <div className="level-3-get7StatusScreenElement">P1 Name:{this.props.serverDataPack.dataPack.activeP1}</div> 
          <div className="level-3-get7StatusScreenElement">P2 Name:{this.props.serverDataPack.dataPack.activeP2}</div>
          <div className="level-3-get7StatusScreenElement">Spielstatus: {this.props.serverDataPack.dataPack.gamestatus}</div>
          <div className="level-3-get7StatusScreenElement">LobbyDaten:{this.props.serverDataPack.dataPack.activeP1}----{this.props.serverDataPack.dataPack.activeP2} </div>
          <div className="level-3-get7StatusScreenElement">Lobby Status: {this.props.serverDataPack.dataPack.lobbystatus} </div> 
        </div>
    );
  }
}

class CardStorageHand extends React.Component {
  render() {
    return (
        <div  id="handcard-table">
            <Get7CardStorage cardStack={this.props.cardStackdata.handCards} cardButtonClicked={this.props.cardButtonClicked} backgrund={this.props.backgrund}/>
          </div>
    );
  }
}

class CardStorageDiscarded extends React.Component {
  render() {
    return (
        <div id="name-CardStorages">
          <div id="hero-table">
            <Get7CardStorage cardStack={this.props.cardStackdata.cardStackHeroes} cardButtonClicked='' backgrund={this.props.backgrund}/>
          </div>
          <div id="officer-table">  
            <Get7CardStorage cardStack={this.props.cardStackdata.cardStackOfficers} cardButtonClicked='' backgrund={this.props.backgrund}/>
          </div>
          <div  id="king-table">
            <Get7CardStorage cardStack={this.props.cardStackdata.cardStackKings} cardButtonClicked='' backgrund={this.props.backgrund}/>
            </div>
          <div  id="soldier-table">
            <Get7CardStorage cardStack={this.props.cardStackdata.cardStackSoldiers} cardButtonClicked='' backgrund={this.props.backgrund} />
          </div>
        </div>
    );
  }
}

class Get7CardStorage extends React.Component {
  placeCardsOnTable(props) {
      const numbers = props.numbers
      // var url = "url('" + props.backgrund[3].src + "')"; //only for test
      const listItems = numbers.map((number) =>
            <button className="playingcard" id={number.toString()} key={number.toString()} value={number.toString()} onClick={props.click} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')" , color: props.backgrund[number].color }} > 
            {props.backgrund[number].cardtype}
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

class Get7PlayField extends React.Component {
  render() {
    return (
        <div className="">
          {/* <button className="playingcard" onClick={this.props.cardButtonClicked} style={{ backgroundImage: "url('" + this.props.backgrund[0].src + "')"}} ></button> */}
          <Get7CardStorage cardStack={this.props.cardStack}  cardButtonClicked={this.props.cardButtonClicked} backgrund={this.props.backgrund}/>
        </div>
    );
  }
}

class Get7GameMain extends React.Component {
  render() {
    return (
        <div id="main-box-Get7">
        <Get7Game />
        </div>
    );
  }
}
   
ReactDOM.render(
  <Get7GameMain />,
  document.getElementById('get7root')
);

  