class DataPacketMemory{
  constructor(game){
      this.dataPack={
          'gameName': game,
          'score': 0,
          'socket': {},
          'io':{},
          'command':'',
          'playerName': "",
          'playerArrayId': -5,
          'lobid': -6,
          'isHuman': 1,
      }
  }
}

class MemoryGame extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
          cardImageOnTable:[
              { id: 0, src:"" , clickable: false },
              { id: 1, src:"" , clickable: false },               
              { id: 2, src:"" ,clickable: false},
              { id: 3, src:"" ,clickable: false},
              { id: 4, src:"" ,clickable: false},
              { id: 5, src:"" ,clickable: false},
              { id: 6, src:"" ,clickable: false},
              { id: 7, src:"" ,clickable: false},
              { id: 8, src:"" ,clickable: false},               
              { id: 9, src:"" ,clickable: false},
              { id: 10, src:"" ,clickable: false},
              { id: 11, src:"" ,clickable: false},
              { id: 12, src:"" ,clickable: false},
              { id: 13, src:"" ,clickable: false},
              { id: 14, src:"" ,clickable: false},
              { id: 15, src:"" ,clickable: false},
              { id: 16, src:"" ,clickable: false},
              { id: 17, src:"" ,clickable: false},
              { id: 18, src:"" ,clickable: false},
              { id: 19, src:"" ,clickable: false},
              { id: 20, src:"" ,clickable: false}
          ],
          cardImageID:[
            { id: 0, src:"", audio: new Audio("") },
            { id: 1, src:"", audio: new Audio("") },               
            { id: 2, src:"", audio: new Audio("") },
            { id: 3, src:"", audio: new Audio("") },
            { id: 4, src:"", audio: new Audio("") },
            { id: 5, src:"", audio: new Audio("") },
            { id: 6, src:"", audio: new Audio("") },
            { id: 7, src:"", audio: new Audio("") },
            { id: 8, src:"", audio: new Audio("") },               
            { id: 9, src:"", audio: new Audio("") },
            { id: 10, src:"", audio: new Audio("") },
            { id: 11, src:"", audio: new Audio("") },
            { id: 12, src:"", audio: new Audio("") },
            { id: 13, src:"", audio: new Audio("") },
            { id: 14, src:"", audio: new Audio("") },
            { id: 15, src:"", audio: new Audio("") },
            { id: 16, src:"", audio: new Audio("") },
            { id: 17, src:"", audio: new Audio("") },
            { id: 18, src:"", audio: new Audio("") },
            { id: 19, src:"", audio: new Audio("") },
            { id: 20, src:"", audio: new Audio("") }
          ],
          audioSrc: "",
          topCardSrc: "",
          cardStackLenght: 12,
          cardStack: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
          clickCount: 0,
          cardOne: {id: -1, src: "-1"},
          cardTwo: {id: -2, src: "-2"},
          update:0,
          audio: new Audio("/assets/sounds/winFanFar.mp3"),
          score: 0,
          highScore: 1000,
          foundPairs: 0,
          cardList: new CardList(),
          firstStart: true,
          name: "frg",
          highScores: [{name: "KI 1", score: 40}, {name: "KI 2", score: 60}, {name: "KI 3", score: 1000},{name: "KI 1", score: 40}, {name: "KI 2", score: 60}, {name: "KI 3", score: 1000},{name: "KI 1", score: 40}, {name: "KI 2", score: 60}, {name: "KI 3", score: 1000},{name: "KI 3", score: 1000}],
          testText: "init",
          displayedHighScores: 10,
          gameName: "memory",
          serverData: new DataPacketMemory("memory")
    };
    this.newGame = this.newGame.bind(this);
    this.clickOnCard = this.clickOnCard.bind(this);
    this.synchroHighScore = this.synchroHighScore.bind(this);
    //dbTest
    this.dbWrite = this.dbWrite.bind(this);
  }

  /** -----------NewGameButton Style-----------
  * change changes Style NewGameButton
  * @param {string} styleVisible - 1 for 'visible' or 0 for 'hidden'
  */  
  changeTableStyle(styleVisible){
    var height = 200;
    var fontsize = "font-size: 12px"
    var visibilityValue = 'visible';
    const btnNewGame = document.getElementById("newGameButton");
    const highScore = document.getElementById("memory-highscore-container");
    //make things invisible; remove from Table
    if(styleVisible == 0){
      height = 0; visibilityValue = 'hidden';
      btnNewGame.setAttribute("style", "visibility:  "+ visibilityValue + "; height: " + height +"px;" + fontsize);
      highScore.setAttribute("style", "visibility:  "+ visibilityValue + "; height: " + height +"px;" + fontsize);
    }

    //make things visible; add to table
    if(styleVisible == 1){
      btnNewGame.setAttribute("style", "visibility:  "+ visibilityValue + "; height: " + height +"px; fons-size:" + fontsize);
      highScore.setAttribute("style", "visibility:  "+ visibilityValue + "; height: " + height +"px;" + fontsize);
    }
  }

  old_changeNewGameButtonStyle(styleVisible){ //used in old version, can be deleted
    var btnHeight = 200;
    if(styleVisible == 1){
      btnHeight = 200; styleVisible = 'visible';
    }
    if(styleVisible == 0){
      btnHeight = 0; styleVisible = 'hidden';
    }
    this.setState( { 
      newGameButtonStyle: { visibility:  styleVisible , height: btnHeight}
      });
  }

  /** -------------------------
  * gameflow on CardClick
  */  
  clickOnCard(e){
    //first click inits img params
    if(this.state.score ==0){
      for(let i = 0; i < 20; i++){
        var element  = document.getElementById(i);
        //console.log(element.id);
        //element.style.width = '200px';
        //element.style.backgroundSize = "10px 10px";
        this.state.cardImageOnTable[i].src = this.state.topCardSrc;
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "100% 100%";
      }
    }
    //console.log("click " + e.target.value);
    //console.log(" state " + this.state.cardPairImageID[e.target.value].src);
    if(this.state.cardImageOnTable[e.target.value].clickable == true){
      this.state.clickCount++;
      this.setState( { score: this.state.score+1});
      //turn around card 1
      if(this.state.clickCount == 1){
        this.turnCardAround(e,1);
      }
      //turn around card 2 and compare
      if(this.state.clickCount == 2){
        this.turnCardAround(e,2);
        this.checkForPair(e); //handles events, after a pair found
      }
      //handle click after 2 wrong cards are open
      //resets clickcount and opens the newly clicked card
      if(this.state.clickCount == 3){
        this.state.clickCount = 0;
        //cover img on card and make clickable
        this.state.cardImageOnTable[this.state.cardOne.id].src  = this.state.topCardSrc;
        this.state.cardImageOnTable[this.state.cardTwo.id].src  = this.state.topCardSrc;
        this.state.cardImageOnTable[this.state.cardOne.id].clickable  = true;
        this.state.cardImageOnTable[this.state.cardTwo.id].clickable  = true;
        //open the clicked card
        this.clickOnCard(e);
      }
    }
  }

  turnCardAround(e,cardPickNo){
    //place Img on card and make unclickable
    this.state.cardImageOnTable[e.target.value].src = this.state.cardImageID[e.target.value].src;
    this.state.cardImageOnTable[e.target.value].clickable = false
    //safeCard
    if(cardPickNo == 1){
      //safe card 1
      this.state.cardOne.id = e.target.value;
      this.state.cardOne.src = this.state.cardImageID[e.target.value].src;
    }
    if(cardPickNo == 2){
      //safe card 2
      this.state.cardTwo.id = e.target.value;
      this.state.cardTwo.src = this.state.cardImageID[e.target.value].src;
    }
    this.setState( { update:0, update:1}); //update rendering
  }

  checkForPair(e){
    //-----pair found
    if(this.state.cardTwo.src == this.state.cardOne.src){
      this.state.foundPairs++;
      //play Sound
      this.state.audio.pause();
      this.state.audio.currentTime = 0;
      this.state.audio = this.state.cardImageID[e.target.value].audio;
      this.state.audio.play();
      this.state.clickCount = 0;
      //game won, if all pairs found
      this.checkForGameEnd();
    }
  }

  checkForGameEnd(){
    if(this.state.foundPairs == 10){
      this.state.audio = new Audio("/assets/sounds/winFanFar.mp3"); 
      // this.state.audio.play();
      //make new game button visiable
      this.changeTableStyle(1);
      //this.setState( { update:0, update:1}); //update rendering
      //highScore
      this.checkHighScore();
    }
  }

  checkHighScore(){
    for (let i = 0; i < this.state.highScores.length; i++) {
      if(this.state.score <= this.state.highScores[i].score){
        while(!nameInput){
          var nameInput = window.prompt("New Higscore. Dein Name?");
      };
        // this.state.highScores[i].score = this.state.score+1;
        this.state.name = nameInput;
        this.state.serverData.dataPack.command = 'updatehighScore';
        this.state.serverData.dataPack.score = this.state.score;
        this.state.serverData.dataPack.playerName = this.state.name;
        // const packet = {score: this.state.score, name: this.state.name};
        socket.emit(this.state.gameName, this.state.serverData.dataPack);
        console.log("packet send to highsore fired---------");
        this.setState( { update:0, update:1}); //update rendering
        break;
      }
    }
    this.getHighScoreServer();
    // this.state.clickCount = 0;
    this.setState( { update:0, update:1}); //update rendering
  }

  /** -----------------
  * Inits a new gameround
  */
  newGame(){
    this.synchroHighScore() //new show higscore
    this.initFirstLoad(); 
    this.resetRoundParams();
    this.placeCards();
    this.shuffleCardsOnTable();
    this.changeTableStyle(0); //remove new Game Buton from GUI
    this.state.audio = new Audio("/assets/sound/DuBistDran.mp3");
    //this.state.audio.play();
    this.setState( { update:0, update:1}); //update rendering
  }

  getHighScoreServer(){
    console.log(" gethighScore fired ");
    this.state.serverData.dataPack.command = 'gethighScore';
    socket.emit(this.state.gameName, this.state.serverData.dataPack);
    //handle answer 
    socket.on('gethighScore', data => {
      console.log("socket gethighScore fired ");
      //update local list with serverlist
      for(var i = 0; i < this.state.displayedHighScores; i++){
        this.state.highScores[i].name = data[i].name;
        this.state.highScores[i].score = data[i].score;
      }
      // console.log(data);
      this.setState( { update:0, update:1}); //update rendering
    });
  }

  synchroHighScore(){ //ist button getHisgcores
    this.state.serverData.dataPack.command = 'gethighScore';
    socket.emit(this.state.gameName, this.state.serverData.dataPack);
    //handle answer 
    socket.on('gethighScore', data => {
      console.log("socket gethighScore fired ");
      //update local list with serverlist
      for(var i = 0; i < this.state.displayedHighScores; i++){
        this.state.highScores[i].name = data[i].name;
        this.state.highScores[i].score = data[i].score;
      }
      // console.log(data);
      this.setState( { update:0, update:1}); //update rendering
    });
    this.setState( { update:0, update:1}); //update rendering
  }

  initFirstLoad(){
      //get 000 card as top and delete 000 from deck only at first start
    if(this.state.firstStart == true){
      this.state.topCardSrc = "/assets/cards/top.png";
      this.state.firstStart = false;
    }
  }

  placeCards(){
    //shuffle for a random deck and cover cards
    this.state.cardList.shuffle();
    //put new img on cards, start at i+1, as card 000 is top card
    for(let i = 0; i < 20; i = i+2){
      this.state.cardImageID[i] = this.state.cardList.getCard(i);
      this.state.cardImageID[i+1] = this.state.cardList.getCard(i);
      this.state.cardImageOnTable[i].src = this.state.cardList.getCard(i).src;
      this.state.cardImageOnTable[i+1].src = this.state.cardList.getCard(i).src;
    }
    //preload images
    for(let i = 0; i < 20; i++){
      var element  = document.getElementById(i);
      //console.log(element.id);
      //element.style.width = '200px';
      element.style.backgroundSize = "1px 1px";
      element.style.backgroundRepeat = "no-repeat";
      //element.style.backgroundSize = "100% 100%";
      this.state.cardImageOnTable[i].clickable = true;
    }
  }

  resetRoundParams(){
    this.state.clickCount = 0;
    this.state.score = 0;
    this.state.foundPairs = 0;
    this.state.clickCount = 0;
  }

  shuffleCardsOnTable(){
    //change cardpositions random at table
    var help = new Helper ();
    var random = help.shuffle(this.state.cardStack);
    this.state.cardStack = random;
  }

  //------test db
  dbWrite(){
    this.state.serverData.dataPack.command = 'updatehighScore';
    this.state.serverData.dataPack.playerName = "test 12";
    this.state.serverData.dataPack.score = 99;
    socket.emit(this.state.gameName, this.state.serverData.dataPack);
  }

  //-----------render-----------------
  render() {
    return (
      <div>
        <button className="newGameButton" id="newGameButton" onClick={this.newGame}></button>
        <div>
         <button className="highScoreButton" id="highScoreButton" onClick={this.synchroHighScore}>highscore aktualisieren </button>  
         <button className="highScoreButton" id="restart" onClick={this.newGame}>neustart Runde</button>  
         <button className="highScoreButton">score: {this.state.score}</button> 
         {/* Buttons for sql test */}
          {/* <button className="highScoreButton" id="highScoreButton" onClick={this.dbWrite}>write </button> */}
        </div>      
        <div className="memory-highscore-container" id="memory-highscore-container">
          <HighScoreScreen
            score={this.state.score}
            highScore={this.state.highScores}
            pairs={this.state.foundPairs}
            name={this.state.namesHighScore}
          />
        </div>
        <div className="memory-card-container">
        <PlayField
            cardStack={this.state.cardStack}
            cardButtonClicked={this.clickOnCard}
            backgrund={this.state.cardImageOnTable}
          />
        </div>
        <div className="memory-stat-container">
          <StatusScreenMemory
            score={this.state.score}
            highScore={this.state.highScore}
            pairs={this.state.foundPairs}
            name={this.state.name}
          />
        </div>
        <div className="memory-highscore-container">
          <HighScoreScreen
            score={this.state.score}
            highScore={this.state.highScores}
            pairs={this.state.foundPairs}
            name={this.state.namesHighScore}
          />
        </div>
        <div className="memory-highscore-container">
            {this.state.testText}
        </div>
        <div className="memory-highscore-container">
        {this.state.highScores[0].name}
        </div>
      </div>
    );
  }
}
  
class PlayField extends React.Component {
  placeCardsOnTable(props) {
      const numbers = props.numbers
      var url = "url('" + props.backgrund[0].src + "')";
      const listItems = numbers.map((number)  =>
        <button className="memory-playingcard" id={number.toString()} key={number.toString()} value={number.toString()} onClick={props.click} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')"}} >
        </button>
      );
      return (
      <ul>{listItems}</ul>
      );
  }

  //-----------render-----------------
  render() {
      return (
          <this.placeCardsOnTable numbers={this.props.cardStack} click={this.props.cardButtonClicked} backgrund={this.props.backgrund} /> 
      );      
  }
} 

class StatusScreenMemory extends React.Component {
  render() {
      return (
        <div> 
          <p>Zug Nr: {this.props.score} HigScore: {this.props.name} {this.props.highScore} gefundene Paare: {this.props.pairs} </p>
        </div>
      );      
  }
}

class HighScoreScreen extends React.Component {
  render() {
      return (
        <div> 
          <table>
          <tr>
            <th>Platz</th>
            <th>Score (wenigste Züge)</th>
            <th>Name</th>
          </tr>
          <tr>
            <th>1</th>
            <th>{this.props.highScore[0].score}</th>
            <th>{this.props.highScore[0].name}</th>
          </tr>
          <tr>
            <th>2</th>
            <th>{this.props.highScore[1].score}</th>
            <th>{this.props.highScore[1].name}</th>
          </tr>
          <tr>
            <th>3</th>
            <th>{this.props.highScore[2].score}</th>
            <th>{this.props.highScore[2].name}</th>
          </tr>
          <tr>
            <th>4</th>
            <th>{this.props.highScore[3].score}</th>
            <th>{this.props.highScore[3].name}</th>
          </tr>
          <tr>
            <th>5</th>
            <th>{this.props.highScore[4].score}</th>
            <th>{this.props.highScore[4].name}</th>
          </tr>
          <tr>
            <th>6</th>
            <th>{this.props.highScore[5].score}</th>
            <th>{this.props.highScore[5].name}</th>
          </tr>
          <tr>
            <th>7</th>
            <th>{this.props.highScore[6].score}</th>
            <th>{this.props.highScore[6].name}</th>
          </tr>
          <tr>
            <th>8</th>
            <th>{this.props.highScore[7].score}</th>
            <th>{this.props.highScore[7].name}</th>
          </tr>
          <tr>
            <th>9</th>
            <th>{this.props.highScore[8].score}</th>
            <th>{this.props.highScore[8].name}</th>
          </tr>
          <tr>
            <th>10</th>
            <th>{this.props.highScore[9].score}</th>
            <th>{this.props.highScore[9].name}</th>
          </tr>
          </table>
        </div>
      );      
  }
}

class MemoryGameMain extends React.Component {
  render() {
  return (
      <div id="main-box">
      <MemoryGame />
      </div>
  );
  }
}
   
ReactDOM.render(
  <MemoryGameMain />,
  document.getElementById('root')
);
  