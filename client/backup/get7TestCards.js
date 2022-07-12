class DataPacketGet7{
  constructor(game){
    this.dataPack={
      'gameName': game,
      'score': 0,
      'socket': {},
      'io':{},
      'command':'',
      'playerName': "PlayerClient",
      'playerArrayId': -5,
      'lobid': -6,
      'isHuman': 1,
    }
  }
}

class Get7Game extends React.Component{
  constructor(props) {
    super(props);
    this.cards = new CardList();
    this.state = {
      update:0,
      server: new DataPacketGet7("get7"),
      //Cards
      cardImageOnTable: this.cards.getCardListb(),
      cardStack: [],
      cardStackHeroes: [],
      cardStackKings: [],
      cardStackOfficers: [],
      HandCardsTopEnemy: [],
      HandCardsBottemPlayer: [],
      cardStackSoldiers: [],
      //Lobby
      joinedlobby: -1,

    };
    //Testbuttons
    this.addToKings = this.addToKings.bind(this);
    this.delfromKings = this.delfromKings.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.handOutHandCards = this.handOutHandCards.bind(this);
  }
  //-----------Testfunctions-----------------
  addToKings(){
    this.state.cardStack.push(34);
    this.state.cardStackHeroes.push(34);
    this.state.cardStackKings.push(34);
    this.state.cardStackOfficers.push(34);
    this.state.HandCardsTopEnemy.push(34);
    this.state.HandCardsBottemPlayer.push(34);
    this.state.cardStackSoldiers.push(34);
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
    this.state.server.dataPack.command = "joinLobby";
    this.state.server.dataPack.lobid = e.target.value;
    this.sendToServer();
    socket.on('joinLobby', data => {
      this.state.server.dataPack.playerName = data.activeP1;
      this.setState( { update:0, update:1}); //update rendering
    });
    this.setState( { update:0, update:1}); //update rendering    
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
  }

  //-----------render-----------------
  render() {
    return (
      <div className="completteTableScreen">
        {/* TESTBUTTONS */}
        <div className="testArea">
          <button  onClick={this.addToKings}> Ad to Kings </button>
          <button  onClick={this.delfromKings}> del from Kings </button>
          <button  value="1" onClick={this.joinLobby}> Join Lobby 1 </button>          
          <button onClick={this.handOutHandCards}> Handout Cards </button>  
          </div>
          {/* TESTBUTTONS  ENDE*/}
          <div className="statusScreen" id="statusScreen">
            <Get7StatusScreen serverDataPack={this.state.server}/>
          </div>
          <div className="playerTableScreen" id="enemyTopField">
            <Get7PlayerTable 
            cardStack={this.state.cardStack}
            cardStackHeroes={this.state.cardStackHeroes}
            cardStackKings={this.state.cardStackKings}
            cardStackOfficers={this.state.cardStackOfficers}
            cardStackHandCards={this.state.HandCardsTopEnemy}
            cardStackSoldiers={this.state.cardStackSoldiers}
            backgrund={this.state.cardImageOnTable}
            />
          </div>
          <div className="playFieldScreen" id="midField">
            <Get7PlayField cardStack={this.state.cardStack} backgrund={this.state.cardImageOnTable}/>
          </div>
          <div className="playerTableScreen" id="playerBottemField">
            <Get7PlayerTable 
            cardStack={this.state.cardStack}
            cardStackHeroes={this.state.cardStackHeroes}
            cardStackKings={this.state.cardStackKings}
            cardStackOfficers={this.state.cardStackOfficers}
            cardStackHandCards={this.state.HandCardsBottemPlayer}
            cardStackSoldiers={this.state.cardStackSoldiers}
            backgrund={this.state.cardImageOnTable}
            />
          </div>
      </div>
    );
  }
}

class Get7StatusScreen extends React.Component {
  render() {
    return (
        <div className="get7StatusScreen">
          <div className="get7StatusScreenElement">Lobby:</div>
          <div className="get7StatusScreenElement">Mein Name: {this.props.serverDataPack.dataPack.playerName}</div>
          <div className="get7StatusScreenElement">P1 Name:</div>
          <div className="get7StatusScreenElement">P2 Name:</div>
          <div className="get7StatusScreenElement">Spielstatus:</div>
          <div className="get7StatusScreenElement">LobbyDaten:</div>
          <div className="get7StatusScreenElement">P1 Name:</div>
          <div className="get7StatusScreenElement">P2 Name:</div>
          <div className="get7StatusScreenElement">Spielstatus:</div>
        </div>
    );
  }
}

class Get7PlayerTable extends React.Component {
  render() {
    return (
        <div className="playerTableScreen">
          <div className="leftCardStoragePlayer">
            <div className="medium-table" id="hero-table">
              <Get7CardStorage cardStack={this.props.cardStackHeroes} backgrund={this.props.backgrund}/>
            </div>
            <div className="medium-table" id="officer-table">
              <Get7CardStorage cardStack={this.props.cardStackOfficers} backgrund={this.props.backgrund}/>
            </div>
            <div className="medium-table" id="king-table">
              <Get7CardStorage cardStack={this.props.cardStackKings} backgrund={this.props.backgrund}/>
            </div>
            <div className="medium-table" id="hand-table">
              <Get7CardStorage cardStack={this.props.cardStack} backgrund={this.props.backgrund}/>
            </div>
          </div>
          <div className="rightCardStoragePlayer">
            <div className="big-tables" id="handcard-table">
              <Get7CardStorage cardStack={this.props.cardStackHandCards} backgrund={this.props.backgrund}/>
            </div>
            <div className="big-tables" id="soldier-table">
              <Get7CardStorage cardStack={this.props.cardStackSoldiers} backgrund={this.props.backgrund} />
            </div>
          </div>
        </div>
    );
  }
}

class Get7CardStorage extends React.Component {
  placeCardsOnTable(props) {
      const numbers = props.numbers
      var url = "url('" + props.backgrund[3].src + "')";
      const listItems = numbers.map((number)  =>
        // <button className="memory-playingcard" id={number.toString()} key={number.toString()} value={number.toString()} onClick={props.click} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')"}} >
        <button className="playingcard" id={number.toString()} key={number.toString()} value={number.toString()} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')"}} > 
        </button>
      );
      return (
      <ul>{listItems}</ul>
      );
  }
  //-----------render-----------------
  render() {
      return (
          // <this.placeCardsOnTable numbers={this.props.cardStack} click={this.props.cardButtonClicked} backgrund={this.props.backgrund} /> 
          <this.placeCardsOnTable numbers={this.props.cardStack} backgrund={this.props.backgrund}/> 
      );      
  }
} 

class Get7PlayField extends React.Component {
  render() {
    return (
        <div className="playFieldScreen">
        <button className="playingcard" style={{ backgroundImage: "url('" + this.props.backgrund[0].src + "')"}} > 
        </button>
          <Get7CardStorage cardStack={this.props.cardStack} backgrund={this.props.backgrund}/>
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
  