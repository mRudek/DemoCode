'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataPacketMemory = function DataPacketMemory(game) {
  _classCallCheck(this, DataPacketMemory);

  this.dataPack = {
    'gameName': game,
    'score': 0,
    'socket': {},
    'io': {},
    'command': '',
    'playerName': "",
    'playerArrayId': -5,
    'lobid': -6,
    'isHuman': 1
  };
};

var MemoryGame = function (_React$Component) {
  _inherits(MemoryGame, _React$Component);

  function MemoryGame(props) {
    _classCallCheck(this, MemoryGame);

    var _this = _possibleConstructorReturn(this, (MemoryGame.__proto__ || Object.getPrototypeOf(MemoryGame)).call(this, props));

    _this.state = {
      cardImageOnTable: [{ id: 0, src: "", clickable: false }, { id: 1, src: "", clickable: false }, { id: 2, src: "", clickable: false }, { id: 3, src: "", clickable: false }, { id: 4, src: "", clickable: false }, { id: 5, src: "", clickable: false }, { id: 6, src: "", clickable: false }, { id: 7, src: "", clickable: false }, { id: 8, src: "", clickable: false }, { id: 9, src: "", clickable: false }, { id: 10, src: "", clickable: false }, { id: 11, src: "", clickable: false }, { id: 12, src: "", clickable: false }, { id: 13, src: "", clickable: false }, { id: 14, src: "", clickable: false }, { id: 15, src: "", clickable: false }, { id: 16, src: "", clickable: false }, { id: 17, src: "", clickable: false }, { id: 18, src: "", clickable: false }, { id: 19, src: "", clickable: false }, { id: 20, src: "", clickable: false }],
      cardImageID: [{ id: 0, src: "", audio: new Audio("") }, { id: 1, src: "", audio: new Audio("") }, { id: 2, src: "", audio: new Audio("") }, { id: 3, src: "", audio: new Audio("") }, { id: 4, src: "", audio: new Audio("") }, { id: 5, src: "", audio: new Audio("") }, { id: 6, src: "", audio: new Audio("") }, { id: 7, src: "", audio: new Audio("") }, { id: 8, src: "", audio: new Audio("") }, { id: 9, src: "", audio: new Audio("") }, { id: 10, src: "", audio: new Audio("") }, { id: 11, src: "", audio: new Audio("") }, { id: 12, src: "", audio: new Audio("") }, { id: 13, src: "", audio: new Audio("") }, { id: 14, src: "", audio: new Audio("") }, { id: 15, src: "", audio: new Audio("") }, { id: 16, src: "", audio: new Audio("") }, { id: 17, src: "", audio: new Audio("") }, { id: 18, src: "", audio: new Audio("") }, { id: 19, src: "", audio: new Audio("") }, { id: 20, src: "", audio: new Audio("") }],
      audioSrc: "",
      topCardSrc: "",
      cardStackLenght: 12,
      cardStack: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      clickCount: 0,
      cardOne: { id: -1, src: "-1" },
      cardTwo: { id: -2, src: "-2" },
      update: 0,
      audio: new Audio("/assets/sounds/winFanFar.mp3"),
      score: 0,
      highScore: 1000,
      foundPairs: 0,
      cardList: new CardListDemoMemory(),
      firstStart: true,
      name: "frg",
      highScores: [{ name: "KI 1", score: 40 }, { name: "KI 2", score: 60 }, { name: "KI 3", score: 1000 }, { name: "KI 1", score: 40 }, { name: "KI 2", score: 60 }, { name: "KI 3", score: 1000 }, { name: "KI 1", score: 40 }, { name: "KI 2", score: 60 }, { name: "KI 3", score: 1000 }, { name: "KI 3", score: 1000 }],
      testText: "init",
      displayedHighScores: 10,
      gameName: "memory",
      serverData: new DataPacketMemory("memory")
    };
    _this.newGame = _this.newGame.bind(_this);
    _this.clickOnCard = _this.clickOnCard.bind(_this);
    _this.synchroHighScore = _this.synchroHighScore.bind(_this);
    //dbTest
    _this.dbWrite = _this.dbWrite.bind(_this);
    return _this;
  }

  /** -----------NewGameButton Style-----------
  * change changes Style NewGameButton
  * @param {string} styleVisible - 1 for 'visible' or 0 for 'hidden'
  */


  _createClass(MemoryGame, [{
    key: 'changeTableStyle',
    value: function changeTableStyle(styleVisible) {
      var height = 200;
      var fontsize = "font-size: 12px";
      var visibilityValue = 'visible';
      var btnNewGame = document.getElementById("newGameButton");
      var highScore = document.getElementById("memory-highscore-container");
      //make things invisible; remove from Table
      if (styleVisible == 0) {
        height = 0;visibilityValue = 'hidden';
        btnNewGame.setAttribute("style", "visibility:  " + visibilityValue + "; height: " + height + "px;" + fontsize);
        highScore.setAttribute("style", "visibility:  " + visibilityValue + "; height: " + height + "px;" + fontsize);
      }

      //make things visible; add to table
      if (styleVisible == 1) {
        btnNewGame.setAttribute("style", "visibility:  " + visibilityValue + "; height: " + height + "px; fons-size:" + fontsize);
        highScore.setAttribute("style", "visibility:  " + visibilityValue + "; height: " + height + "px;" + fontsize);
      }
    }
  }, {
    key: 'old_changeNewGameButtonStyle',
    value: function old_changeNewGameButtonStyle(styleVisible) {
      //used in old version, can be deleted
      var btnHeight = 200;
      if (styleVisible == 1) {
        btnHeight = 200;styleVisible = 'visible';
      }
      if (styleVisible == 0) {
        btnHeight = 0;styleVisible = 'hidden';
      }
      this.setState({
        newGameButtonStyle: { visibility: styleVisible, height: btnHeight }
      });
    }

    /** -------------------------
    * gameflow on CardClick
    */

  }, {
    key: 'clickOnCard',
    value: function clickOnCard(e) {
      //first click inits img params
      if (this.state.score == 0) {
        for (var i = 0; i < 20; i++) {
          var element = document.getElementById(i);
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
      if (this.state.cardImageOnTable[e.target.value].clickable == true) {
        this.state.clickCount++;
        this.setState({ score: this.state.score + 1 });
        //turn around card 1
        if (this.state.clickCount == 1) {
          this.turnCardAround(e, 1);
        }
        //turn around card 2 and compare
        if (this.state.clickCount == 2) {
          this.turnCardAround(e, 2);
          this.checkForPair(e); //handles events, after a pair found
        }
        //handle click after 2 wrong cards are open
        //resets clickcount and opens the newly clicked card
        if (this.state.clickCount == 3) {
          this.state.clickCount = 0;
          //cover img on card and make clickable
          this.state.cardImageOnTable[this.state.cardOne.id].src = this.state.topCardSrc;
          this.state.cardImageOnTable[this.state.cardTwo.id].src = this.state.topCardSrc;
          this.state.cardImageOnTable[this.state.cardOne.id].clickable = true;
          this.state.cardImageOnTable[this.state.cardTwo.id].clickable = true;
          //open the clicked card
          this.clickOnCard(e);
        }
      }
    }
  }, {
    key: 'turnCardAround',
    value: function turnCardAround(e, cardPickNo) {
      //place Img on card and make unclickable
      this.state.cardImageOnTable[e.target.value].src = this.state.cardImageID[e.target.value].src;
      this.state.cardImageOnTable[e.target.value].clickable = false;
      //safeCard
      if (cardPickNo == 1) {
        //safe card 1
        this.state.cardOne.id = e.target.value;
        this.state.cardOne.src = this.state.cardImageID[e.target.value].src;
      }
      if (cardPickNo == 2) {
        //safe card 2
        this.state.cardTwo.id = e.target.value;
        this.state.cardTwo.src = this.state.cardImageID[e.target.value].src;
      }
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
  }, {
    key: 'checkForPair',
    value: function checkForPair(e) {
      //-----pair found
      if (this.state.cardTwo.src == this.state.cardOne.src) {
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
  }, {
    key: 'checkForGameEnd',
    value: function checkForGameEnd() {
      if (this.state.foundPairs == 10) {
        this.state.audio = new Audio("/assets/sounds/winFanFar.mp3");
        // this.state.audio.play();
        //make new game button visiable
        this.changeTableStyle(1);
        //this.setState( { update:0, update:1}); //update rendering
        //highScore
        this.checkHighScore();
      }
    }
  }, {
    key: 'checkHighScore',
    value: function checkHighScore() {
      for (var i = 0; i < this.state.highScores.length; i++) {
        if (this.state.score <= this.state.highScores[i].score) {
          while (!nameInput) {
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
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          break;
        }
      }
      this.getHighScoreServer();
      // this.state.clickCount = 0;
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }

    /** -----------------
    * Inits a new gameround
    */

  }, {
    key: 'newGame',
    value: function newGame() {
      this.synchroHighScore(); //new show higscore
      this.initFirstLoad();
      this.resetRoundParams();
      this.placeCards();
      this.shuffleCardsOnTable();
      this.changeTableStyle(0); //remove new Game Buton from GUI
      this.state.audio = new Audio("/assets/sound/DuBistDran.mp3");
      //this.state.audio.play();
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
  }, {
    key: 'getHighScoreServer',
    value: function getHighScoreServer() {
      var _this2 = this;

      console.log(" gethighScore fired ");
      this.state.serverData.dataPack.command = 'gethighScore';
      socket.emit(this.state.gameName, this.state.serverData.dataPack);
      //handle answer 
      socket.on('gethighScore', function (data) {
        console.log("socket gethighScore fired ");
        //update local list with serverlist
        for (var i = 0; i < _this2.state.displayedHighScores; i++) {
          _this2.state.highScores[i].name = data[i].name;
          _this2.state.highScores[i].score = data[i].score;
        }
        // console.log(data);
        _this2.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
      });
    }
  }, {
    key: 'synchroHighScore',
    value: function synchroHighScore() {
      var _this3 = this;

      //ist button getHisgcores
      this.state.serverData.dataPack.command = 'gethighScore';
      socket.emit(this.state.gameName, this.state.serverData.dataPack);
      //handle answer 
      socket.on('gethighScore', function (data) {
        console.log("socket gethighScore fired ");
        //update local list with serverlist
        for (var i = 0; i < _this3.state.displayedHighScores; i++) {
          _this3.state.highScores[i].name = data[i].name;
          _this3.state.highScores[i].score = data[i].score;
        }
        // console.log(data);
        _this3.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
      });
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
  }, {
    key: 'initFirstLoad',
    value: function initFirstLoad() {
      //get 000 card as top and delete 000 from deck only at first start
      if (this.state.firstStart == true) {
        this.state.topCardSrc = "/assets/cards/top.png";
        this.state.firstStart = false;
      }
    }
  }, {
    key: 'placeCards',
    value: function placeCards() {
      //shuffle for a random deck and cover cards
      this.state.cardList.shuffle();
      //put new img on cards, start at i+1, as card 000 is top card
      for (var i = 0; i < 20; i = i + 2) {
        this.state.cardImageID[i] = this.state.cardList.getCard(i);
        this.state.cardImageID[i + 1] = this.state.cardList.getCard(i);
        this.state.cardImageOnTable[i].src = this.state.cardList.getCard(i).src;
        this.state.cardImageOnTable[i + 1].src = this.state.cardList.getCard(i).src;
      }
      //preload images
      for (var _i = 0; _i < 20; _i++) {
        var element = document.getElementById(_i);
        //console.log(element.id);
        //element.style.width = '200px';
        element.style.backgroundSize = "1px 1px";
        element.style.backgroundRepeat = "no-repeat";
        //element.style.backgroundSize = "100% 100%";
        this.state.cardImageOnTable[_i].clickable = true;
      }
    }
  }, {
    key: 'resetRoundParams',
    value: function resetRoundParams() {
      this.state.clickCount = 0;
      this.state.score = 0;
      this.state.foundPairs = 0;
      this.state.clickCount = 0;
    }
  }, {
    key: 'shuffleCardsOnTable',
    value: function shuffleCardsOnTable() {
      //change cardpositions random at table
      var help = new Helper();
      var random = help.shuffle(this.state.cardStack);
      this.state.cardStack = random;
    }

    //------test db

  }, {
    key: 'dbWrite',
    value: function dbWrite() {
      this.state.serverData.dataPack.command = 'updatehighScore';
      this.state.serverData.dataPack.playerName = "test 12";
      this.state.serverData.dataPack.score = 99;
      socket.emit(this.state.gameName, this.state.serverData.dataPack);
    }

    //-----------render-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('button', { className: 'newGameButton', id: 'newGameButton', onClick: this.newGame }),
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { className: 'highScoreButton', id: 'highScoreButton', onClick: this.synchroHighScore },
            'highscore aktualisieren '
          ),
          React.createElement(
            'button',
            { className: 'highScoreButton', id: 'restart', onClick: this.newGame },
            'neustart Runde'
          ),
          React.createElement(
            'button',
            { className: 'highScoreButton' },
            'score: ',
            this.state.score
          )
        ),
        React.createElement(
          'div',
          { className: 'memory-card-container' },
          React.createElement(PlayField, {
            cardStack: this.state.cardStack,
            cardButtonClicked: this.clickOnCard,
            backgrund: this.state.cardImageOnTable
          })
        ),
        React.createElement(
          'div',
          { className: 'memory-stat-container' },
          React.createElement(StatusScreenMemory, {
            score: this.state.score,
            highScore: this.state.highScore,
            pairs: this.state.foundPairs,
            name: this.state.name
          })
        ),
        React.createElement(
          'div',
          { className: 'memory-highscore-container' },
          React.createElement(HighScoreScreen, {
            score: this.state.score,
            highScore: this.state.highScores,
            pairs: this.state.foundPairs,
            name: this.state.namesHighScore
          })
        )
      );
    }
  }]);

  return MemoryGame;
}(React.Component);

var PlayField = function (_React$Component2) {
  _inherits(PlayField, _React$Component2);

  function PlayField() {
    _classCallCheck(this, PlayField);

    return _possibleConstructorReturn(this, (PlayField.__proto__ || Object.getPrototypeOf(PlayField)).apply(this, arguments));
  }

  _createClass(PlayField, [{
    key: 'placeCardsOnTable',
    value: function placeCardsOnTable(props) {
      var numbers = props.numbers;
      var url = "url('" + props.backgrund[0].src + "')";
      var listItems = numbers.map(function (number) {
        return React.createElement('button', { className: 'memory-playingcard', id: number.toString(), key: number.toString(), value: number.toString(), onClick: props.click, style: { backgroundImage: "url('" + props.backgrund[number].src + "')" } });
      });
      return React.createElement(
        'ul',
        null,
        listItems
      );
    }

    //-----------render-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.placeCardsOnTable, { numbers: this.props.cardStack, click: this.props.cardButtonClicked, backgrund: this.props.backgrund });
    }
  }]);

  return PlayField;
}(React.Component);

var StatusScreenMemory = function (_React$Component3) {
  _inherits(StatusScreenMemory, _React$Component3);

  function StatusScreenMemory() {
    _classCallCheck(this, StatusScreenMemory);

    return _possibleConstructorReturn(this, (StatusScreenMemory.__proto__ || Object.getPrototypeOf(StatusScreenMemory)).apply(this, arguments));
  }

  _createClass(StatusScreenMemory, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Zug Nr: ',
          this.props.score,
          ' HigScore: ',
          this.props.name,
          ' ',
          this.props.highScore,
          ' gefundene Paare: ',
          this.props.pairs,
          ' '
        )
      );
    }
  }]);

  return StatusScreenMemory;
}(React.Component);

var HighScoreScreen = function (_React$Component4) {
  _inherits(HighScoreScreen, _React$Component4);

  function HighScoreScreen() {
    _classCallCheck(this, HighScoreScreen);

    return _possibleConstructorReturn(this, (HighScoreScreen.__proto__ || Object.getPrototypeOf(HighScoreScreen)).apply(this, arguments));
  }

  _createClass(HighScoreScreen, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'table',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'Platz'
            ),
            React.createElement(
              'th',
              null,
              'Score (wenigste Z\xFCge)'
            ),
            React.createElement(
              'th',
              null,
              'Name'
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '1'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[0].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[0].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '2'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[1].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[1].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '3'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[2].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[2].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '4'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[3].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[3].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '5'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[4].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[4].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '6'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[5].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[5].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '7'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[6].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[6].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '8'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[7].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[7].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '9'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[8].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[8].name
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '10'
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[9].score
            ),
            React.createElement(
              'th',
              null,
              this.props.highScore[9].name
            )
          )
        )
      );
    }
  }]);

  return HighScoreScreen;
}(React.Component);

var MemoryGameMain = function (_React$Component5) {
  _inherits(MemoryGameMain, _React$Component5);

  function MemoryGameMain() {
    _classCallCheck(this, MemoryGameMain);

    return _possibleConstructorReturn(this, (MemoryGameMain.__proto__ || Object.getPrototypeOf(MemoryGameMain)).apply(this, arguments));
  }

  _createClass(MemoryGameMain, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'main-box' },
        React.createElement(MemoryGame, null)
      );
    }
  }]);

  return MemoryGameMain;
}(React.Component);

ReactDOM.render(React.createElement(MemoryGameMain, null), document.getElementById('root'));