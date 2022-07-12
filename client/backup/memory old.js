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
            cardStackLenght: 12,
            cardStack: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
            clickCount: 0,
            cardOne: {id: -1, src: "-1"},
            cardTwo: {id: -2, src: "-2"},
            update:0,
            audio: new Audio("/assets/sounds/winFanFar.mp3"),
            topCardSrc: "",
            score: 0,
            highScore: 1000,
            foundPairs: 0,
            cardList: new CardList(),
            firstStart: true,
            name: "KI",
            newGameButtonVisiable: { visibility:  'visible' , height: 200 , backgroundImage: "url('/assets/btnImage/newGame.jpg')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
      };
      this.newGame = this.newGame.bind(this);
      this.clickOnCard = this.clickOnCard.bind(this);
    }
    
    clickOnCard(e){
      //console.log("click " + e.target.value);
      //console.log(" state " + this.state.cardPairImageID[e.target.value].src);
      if(this.state.cardImageOnTable[e.target.value].clickable == true){
        //place the img
        this.state.clickCount++;
        this.setState( { score: this.state.score+1});
        console.log(this.state.clickCount)
        //pick 1
        if(this.state.clickCount == 1){
          //img on card
              this.state.cardImageOnTable[e.target.value].src = this.state.cardImageID[e.target.value].src;
              this.setState( { update:0, update:1}); //update rendering
          //safe card 1
          this.state.cardOne.id = e.target.value;
          this.state.cardOne.src = this.state.cardImageID[e.target.value].src;
          this.state.cardImageOnTable[e.target.value].clickable = false
        }
        //pick 2 and compare
        if(this.state.clickCount == 2){
          //img on card
              this.state.cardImageOnTable[e.target.value].src = this.state.cardImageID[e.target.value].src;
              this.setState( { update:0, update:1});
          //safe card 2
          this.state.cardTwo.id = e.target.value;
          this.state.cardTwo.src = this.state.cardImageID[e.target.value].src;
          this.state.cardImageOnTable[e.target.value].clickable = false
          //compare
          if(this.state.cardTwo.src == this.state.cardOne.src){
            this.state.foundPairs++;
            //play Sound
            this.state.audio.pause();
            this.state.audio.currentTime = 0;
            this.state.audio = this.state.cardImageID[e.target.value].audio;
            this.state.audio.play();
            this.state.clickCount = 0;
            //game won, if all pairs found
            if(this.state.foundPairs == 10){
              this.state.audio = new Audio("/assets/sounds/winFanFar.mp3"); 
              this.state.audio.play();
              //make new game button visiable
              this.setState( { 
                newGameButtonVisiable: { visibility:  'visible' , height: 200 , backgroundImage: "url('/assets/btnImage/newGame.jpg')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
                }); 
              this.setState( { update:0, update:1}); //update rendering
              //highScore
              if(this.state.score <= this.state.highScore){
                this.state.highScore = this.state.score+1;
                var tmp = window.prompt("New Higscore. Dein Name?");
                console.log(tmp);
                this.setState( { name: tmp}); //update rendering
              }
              this.state.clickCount = 0; 
            }
          }
        }
      }
      //if wrong cover cards
      if(this.state.clickCount == 3){
        this.state.clickCount = 0;
        //cover img on card and make clickable
        this.state.cardImageOnTable[this.state.cardOne.id].src  = this.state.topCardSrc;
        this.state.cardImageOnTable[this.state.cardTwo.id].src  = this.state.topCardSrc;
        this.state.cardImageOnTable[this.state.cardOne.id].clickable  = true;
        this.state.cardImageOnTable[this.state.cardTwo.id].clickable  = true;
        this.clickOnCard(e);
        //this.setState( { update:0, update:1}); //update rendering
      }
    }


    //Game Start
    newGame(){
      //get 000 card as top and delete 000 from deck only at first start, then shuffle for a random deck
      if(this.state.firstStart == true){
        this.state.topCardSrc = "/assets/cards/top.png";
        this.state.firstStart = false;
      }
      this.state.cardList.shuffle();
      //reset and cover cards
      for(let i = 0; i < 20; i++){
        this.state.cardImageOnTable[i].clickable = true;
        this.state.cardImageOnTable[i].src = this.state.topCardSrc;
      }
      //put new img on cards, start at i+1, as card 000 is top card
      for(let i = 0; i < 20; i = i+2){
        var tmpCard = this.state.cardList.getCard(i)
        this.state.cardImageID[i] = tmpCard;
        this.state.cardImageID[i+1] = tmpCard;
      }
      //change cardpositions random at table
      var help = new Helper ();
      var random = help.shuffle(this.state.cardStack);
      //reset rest
      this.state.clickCount = 0;
      this.state.score = 0;
      this.state.foundPairs = 0;
      this.state.audio = new Audio("/assets/sounds/DuBistDran.mp3");
      this.state.audio.play();
      this.setState( { cardStack: random,
        newGameButtonVisiable: { visibility:  'hidden' , height: 0, fonsize: 0} //make new game button invisible
        }); 
    }


    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
 

    render() {
      return (
        <div>
          <button className="newGameButton" id="newGameButton" onClick={this.newGame} style={this.state.newGameButtonVisiable}></button>
          <div className="memory-card-container">
          <PlayField
              cardStack={this.state.cardStack}
              cardButtonClicked={this.clickOnCard}
              backgrund={this.state.cardImageOnTable}
            />
          </div>
          <div className="memory-status-container">
            <StatusScreenMemory
              score={this.state.score}
              highScore={this.state.highScore}
              pairs={this.state.foundPairs}
              name={this.state.name}
            />
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
      <button className="memory-cardButton" key={number.toString()} value={number.toString()} onClick={props.click} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
          
      </button>
      );
      return (
      <ul>{listItems}</ul>
      );
  }
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

class MemoryGameMain extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          gameFieldStyle:{
/*                    height: 780,
              width: 450,
              backgroundColor: 'blue' */
          }
      };
  }

  render() {
  return (
      <div id="main-box" style={this.state.gameFieldStyle}>
      <MemoryGame />
      </div>
  );
  }
}
   
  
/* ReactDOM.render(
  <MemoryGameMain />,
  document.getElementById('root')
);
   */