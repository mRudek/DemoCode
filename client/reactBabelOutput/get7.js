'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//------data packs
var DataPacketGet7 = function DataPacketGet7(game) {
  _classCallCheck(this, DataPacketGet7);

  this.dataPack = {
    'gameName': game,
    'score': 0,
    'socket': {},
    'io': {},
    'command': '',
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
  };
};

//------create connection


var socket = window.io(); // var socket = io();
var serverData;

//------main app this.ki = new Get7GameKI();

var Get7Game = function (_React$Component) {
  _inherits(Get7Game, _React$Component);

  function Get7Game(props) {
    _classCallCheck(this, Get7Game);

    var _this = _possibleConstructorReturn(this, (Get7Game.__proto__ || Object.getPrototypeOf(Get7Game)).call(this, props));

    _this.cards = new CardListGet7();
    _this.maxCards = 50;
    _this.startView = 0;
    _this.updateIntervall = 300;
    _this.wishlobby = -12;
    _this.preloadImagesTimer = true;
    _this.playerTurn = 0;
    _this.state = {
      btn: { width: '100px' },
      playsound: false,
      audio: new Audio("/assets/sounds/winFanFar.mp3"),
      p1Points: 0,
      p2Points: 0,
      update: 0,
      tableView: _this.startView,
      server: new DataPacketGet7("get7"),
      playerName: "",
      //Cards
      cardImageOnTable: _this.cards.getCardListGet7(),
      cardStack: [],
      cardsOnTable: [],
      cardGroupOnTable_1: [],
      cardGroupOnTable_2: [],
      cardGroupOnTable_3: [],
      cardGroupOnTable_4: [],
      cardGroupOnTable_5: [],
      cardGroupOnTable_6: [],
      cardGroupOnTable_7: [],
      cardGroupOnTable_8: [],
      cardGroupOnTable_9: [],
      cardGroupOnTable_10: [],
      cardGroupOnTable_11: [],
      cardGroupOnTable_12: [],
      //new
      cardsTop: {
        handCards: [],
        cardStackempty: [],
        cardStackHeroes: [],
        cardStackKings: [],
        cardStackOfficers: [],
        cardStackSoldiers: []
      },
      cardsBot: {
        handCards: [],
        cardStackempty: [],
        cardStackHeroes: [],
        cardStackKings: [],
        cardStackOfficers: [],
        cardStackSoldiers: []
      },
      //Lobby
      joinedlobby: -1
    };
    //Testbuttons
    _this.addToKings = _this.addToKings.bind(_this);
    _this.delfromKings = _this.delfromKings.bind(_this);
    _this.joinLobby = _this.joinLobby.bind(_this);
    _this.kickLobby = _this.kickLobby.bind(_this);
    _this.handOutHandCards = _this.handOutHandCards.bind(_this);
    _this.startGame = _this.startGame.bind(_this);
    _this.clickOnCard = _this.clickOnCard.bind(_this);
    return _this;
  }

  _createClass(Get7Game, [{
    key: 'listenServer',
    value: function listenServer() {
      var _this2 = this;

      socket.on('serverAnswer', function (data) {
        serverData = data;
        _this2.evaluate();
      });
    }

    //Gameraound

  }, {
    key: 'startGame',
    value: function startGame() {
      // this.preloadImages();
      this.state.server.dataPack.command = "startRound";
      this.state.server.dataPack.yourPlayer = this.state.playerName;
      //init sounds
      this.sendToServer();
      this.setState({ tableView: 2 });
    }
  }, {
    key: 'preloadImages',
    value: function preloadImages(serverCardDeck) {
      var tmpImg = this.cards.getCardListGet7();
      for (var i = 0; i < this.maxCards; i++) {
        this.state.cardImageOnTable.push(tmpImg.pop());
      }
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
    //click live for server

  }, {
    key: 'clickOnCard',
    value: function clickOnCard(e) {
      this.state.server.dataPack.command = "evalPlayerTurn";
      this.state.server.dataPack.yourPlayer = this.state.playerName;
      this.state.server.dataPack.chosenCardOne = e.target.value;
      var tmpstr = "P" + this.playerTurn;
      if (tmpstr == this.state.playerName) {
        this.sendToServer();
      }
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
  }, {
    key: 'updateRoundTurn',
    value: function updateRoundTurn(cardData, playerTurn, cardsoundNo) {
      // this.state.cardStack = cardData.cardStack;
      this.state.cardsOnTable = cardData.cardsOnTable;
      if (this.state.playerName == "P1") {
        this.state.cardsTop = cardData.p2;
        this.state.cardsBot = cardData.p1;
        this.state.audio.pause();
        this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
        this.state.audio.play();
      }
      if (this.state.playerName == "P2") {
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
  }, {
    key: 'updateMidTableCards',
    value: function updateMidTableCards(cardData) {
      this.state.cardGroupOnTable_1 = cardData.cardGroupOnTable_X[1].array;
      this.state.cardGroupOnTable_2 = cardData.cardGroupOnTable_X[2].array;
      this.state.cardGroupOnTable_3 = cardData.cardGroupOnTable_X[3].array;
      this.state.cardGroupOnTable_4 = cardData.cardGroupOnTable_X[4].array;
      this.state.cardGroupOnTable_5 = cardData.cardGroupOnTable_X[5].array;
      this.state.cardGroupOnTable_6 = cardData.cardGroupOnTable_X[6].array;
      this.state.cardGroupOnTable_7 = cardData.cardGroupOnTable_X[7].array;
      this.state.cardGroupOnTable_8 = cardData.cardGroupOnTable_X[8].array;
      this.state.cardGroupOnTable_9 = cardData.cardGroupOnTable_X[9].array;
      this.state.cardGroupOnTable_10 = cardData.cardGroupOnTable_X[10].array;
      this.state.cardGroupOnTable_11 = cardData.cardGroupOnTable_X[11].array;
      this.state.cardGroupOnTable_12 = cardData.cardGroupOnTable_X[12].array;
    }

    //-----------Testfunctions-----------------

  }, {
    key: 'addToKings',
    value: function addToKings() {
      this.state.cardsBot.cardStack.push(0);
      this.state.cardsBot.cardStackHeroes.push(1);
      this.state.cardsBot.cardStackKings.push(2);
      this.state.cardsBot.cardStackOfficers.push(3);
      this.state.cardsBot.HandCardsTopEnemy.push(4);
      this.state.cardsBot.HandCardsBottemPlayer.push(5);
      this.state.cardsBot.cardStackSoldiers.push(6);
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
    }
  }, {
    key: 'delfromKings',
    value: function delfromKings() {
      this.state.cardStack.pop();
      this.state.cardStackHeroes.pop();
      this.state.cardStackKings.pop();
      this.state.cardStackOfficers.pop();
      this.state.HandCardsTopEnemy.pop();
      this.state.HandCardsBottemPlayer.pop();
      this.state.cardStackSoldiers.pop();
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering    
    }
  }, {
    key: 'joinLobby',
    value: function joinLobby(e) {
      if (e.target.value == 1) {
        this.state.server.dataPack.command = "joinLobby";
        this.state.server.dataPack.yourPlayer = this.state.playerName;
        this.state.server.dataPack.lobbyToJoin = e.target.value;
        this.sendToServer();
      }
      // this.setState( { update:0, update:1}); //update rendering  
    }
  }, {
    key: 'kickLobby',
    value: function kickLobby(e) {
      if (e.target.value == 1) {
        this.state.server.dataPack.command = "kickLobby";
        this.state.playerName = "";
        this.sendToServer();
        this.setState({ tableView: 0 });
      }
    }
  }, {
    key: 'testAnimation',
    value: function testAnimation() {
      var height = 200;
      var btnNewGame = document.getElementById("testbtn");
      // btnNewGame.setAttribute("style", "height: " + height +"px;");
    }
  }, {
    key: 'handOutHandCards',
    value: function handOutHandCards() {
      for (var i = 0; i < 20; i = i + 2) {
        this.state.HandCardsTopEnemy.push(i);
        this.state.HandCardsBottemPlayer.push(i + 1);
      }
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering    
    }
  }, {
    key: 'sendToServer',
    value: function sendToServer() {
      console.log("send " + this.state.server.dataPack.command);
      socket.emit(this.state.server.dataPack.gameName, this.state.server.dataPack);
      this.listenServer();
    }
  }, {
    key: 'emptyAll',
    value: function emptyAll() {
      this.setState({
        p1Points: 0,
        p2Points: 0,
        update: 0,
        server: new DataPacketGet7("get7"),
        playerName: "",
        //Cards
        cardImageOnTable: this.cards.getCardListGet7(),
        cardStack: [],
        cardsOnTable: [],
        cardGroupOnTable_1: [],
        cardGroupOnTable_2: [],
        cardGroupOnTable_3: [],
        cardGroupOnTable_4: [],
        cardGroupOnTable_5: [],
        cardGroupOnTable_6: [],
        cardGroupOnTable_7: [],
        cardGroupOnTable_8: [],
        cardGroupOnTable_9: [],
        cardGroupOnTable_10: [],
        cardGroupOnTable_11: [],
        cardGroupOnTable_12: [],
        //new
        cardsTop: {
          handCards: [],
          cardStackempty: [],
          cardStackHeroes: [],
          cardStackKings: [],
          cardStackOfficers: [],
          cardStackSoldiers: []
        },
        cardsBot: {
          handCards: [],
          cardStackempty: [],
          cardStackHeroes: [],
          cardStackKings: [],
          cardStackOfficers: [],
          cardStackSoldiers: []
        }
      });
    }
  }, {
    key: 'evaluate',
    value: function evaluate() {
      switch (serverData.command) {
        case 'lobbyFull':
          if (this.state.playerName == "P1" || this.state.playerName == "P2") {
            //nothing
          } else {
            this.state.playerName = serverData.yourPlayer;
            this.state.server.dataPack.lobbystatus = "lobbyFull";
            this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          }
          break;
        case 'joinLobby':
          if (serverData.lobbystatus != "lobbyFull") {
            this.state.playerName = serverData.yourPlayer;
            // this.state.playerNo = serverData.yourPlayer;
            this.state.server.dataPack.gamestatus = "press start round";
            this.state.joinedlobby = serverData.lobid;
            this.state.server.dataPack.lobid = serverData.lobid;
            this.setState({ tableView: 1 });
          }
          break;
        case 'updateLobby':
          if (this.state.joinedlobby == serverData.lobid) {
            this.state.server.dataPack.activeP1 = serverData.activeP1;
            this.state.server.dataPack.activeP2 = serverData.activeP2;
            this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          }
          break;
        case 'kickLobby':
          this.emptyAll();
          this.state.playerName = "";
          this.state.server.dataPack.lobid = serverData.lobid;
          this.state.server.dataPack.yourPlayer = "";
          this.state.server.dataPack.activeP1 = serverData.activeP1;
          this.state.server.dataPack.activeP2 = serverData.activeP2;
          this.state.server.dataPack.lobbystatus = "player can join";
          this.state.server.dataPack.gamestatus = "";
          this.setState({ tableView: 0 });
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          this.state.server = new DataPacketGet7("get7");
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          break;
        case 'waitForPlayer':
          this.state.server.dataPack.gamestatus = "waiting for other Players to start";
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'startRound':
          this.setState({ tableView: 3 });
          this.state.server.dataPack.gamestatus = "viel spaß beim zocken";
          this.playerTurn = serverData.playerTurn;
          // this.preloadImages(serverData.cardDeck);
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, 0);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'updateCards':
          this.state.server.dataPack.gamestatus = "viel spaß beim zocken";
          // this.preloadImages(serverData.cardDeck);
          this.updateRoundTurn();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'evalPlayerTurn':
          this.state.p1Points = serverData.p1Points;
          this.state.p2Points = serverData.p2Points;
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'p1Wins':
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          this.state.p1Points = serverData.p1Points + "p1Wins";
          this.state.audio.pause();
          if (this.state.playerName == "P2") {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          } else {
            this.state.audio = new Audio("/assets/sounds/winFanFar.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'p2Wins':
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          this.state.p2Points = serverData.p2Points + "p2Wins";
          this.state.audio.pause();
          if (this.state.playerName == "P1") {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          } else {
            this.state.audio = new Audio("/assets/sounds/winFanFar.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'remis':
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.state.p2Points = serverData.p2Points + "unentschieden";
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        default:
          break;
      }
    }
    //***************************************************/
    //-----------render-----------------

  }, {
    key: 'render',
    value: function render() {
      //------------------Lobby outside
      if (this.state.tableView == 0) {
        return React.createElement(
          'div',
          { className: 'level-0-box' },
          React.createElement(
            'div',
            { className: 'level-1-lobbybtnArea' },
            React.createElement(
              'button',
              { className: 'level-2-joinBtns', value: '1', onClick: this.joinLobby },
              ' Join Lob 1 '
            ),
            React.createElement(
              'button',
              { className: 'level-2-joinBtns', value: '1', onClick: this.kickLobby, id: 'testbtn' },
              ' Kick Lobby 1 '
            )
          ),
          React.createElement(
            'div',
            { className: 'level-1-statusScreen', id: 'statusScreen' },
            React.createElement(Get7StatusScreen, { playerName: this.state.playerName, serverDataPack: this.state.server })
          )
        );
      }
      //------------------Lobby inside
      if (this.state.tableView == 1) {
        return React.createElement(
          'div',
          { className: 'level-0-box' },
          React.createElement(
            'div',
            { className: 'level-1-statusScreen', id: 'statusScreen' },
            React.createElement(Get7StatusScreen, { playerName: this.state.playerName, serverDataPack: this.state.server })
          ),
          React.createElement(
            'div',
            { className: 'level-1-lobbybtnArea' },
            React.createElement(
              'button',
              { className: 'level-2-joinBtns', onClick: this.startGame },
              ' Runde starten '
            ),
            React.createElement(
              'button',
              { className: 'level-2-joinBtns', value: '1', onClick: this.kickLobby },
              ' Kick Lobby 1 '
            )
          )
        );
      }
      //------------------Lobby inside
      if (this.state.tableView == 2) {
        return React.createElement(
          'div',
          { className: 'level-0-box' },
          React.createElement(
            'div',
            { className: 'level-1-playFieldScreen-mid-status', style: { height: "60px" } },
            'WARTE AUF SPIELER'
          )
        );
      }
      //------------------joined lobby as player
      if (this.state.tableView == 3) {
        return React.createElement(
          'div',
          { className: 'level-0-box' },
          React.createElement('div', { className: 'level-1-testArea' }),
          React.createElement(
            'div',
            { className: 'level-1-playerTableScreen', id: 'enemyTopField' },
            React.createElement(CardStorageHand, {
              cardStack: this.state.cardStack,
              cardStackdata: this.state.cardsTop,
              backgrund: this.state.cardImageOnTable,
              cardStackempty: this.state.cardStackempty
            }),
            React.createElement(CardStorageDiscarded, {
              cardStack: this.state.cardStack,
              cardStackdata: this.state.cardsTop,
              backgrund: this.state.cardImageOnTable,
              cardStackempty: this.state.cardStackempty,
              cardButtonClicked: this.clickOnCard
            })
          ),
          React.createElement(
            'div',
            { className: 'level-1-playFieldScreen-mid-cards' },
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-1' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_1, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-2' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_2, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-3' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_3, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-4' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_4, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-5' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_5, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-6' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_6, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-7' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_7, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-8' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_8, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-9' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_9, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-10' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_10, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-10' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_11, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            ),
            React.createElement(
              'div',
              { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-10' },
              React.createElement(Get7PlayField, { cardStack: this.state.cardGroupOnTable_12, cardButtonClicked: this.clickOnCard, backgrund: this.state.cardImageOnTable })
            )
          ),
          React.createElement(
            'div',
            { className: 'level-1-playFieldScreen-mid-status', style: { height: "60px" } },
            'POINTS P1: ',
            this.state.p1Points,
            ' ** POINTS P2: ',
            this.state.p2Points,
            ' **Spieler dran: ',
            this.playerTurn,
            ' ** Dein Spieler: ',
            this.state.playerName,
            ' **Karten DECK: ',
            this.state.cardStack.length,
            ' * Tisch: ',
            this.state.cardsOnTable.length,
            React.createElement(
              'button',
              { className: 'level-2-joinBtns', value: '1', onClick: this.kickLobby },
              ' neue Runde '
            )
          ),
          React.createElement(
            'div',
            { className: 'level-1-playerTableScreen', id: 'playerBottemField' },
            React.createElement(CardStorageHand, {
              cardStack: this.state.cardStack,
              cardStackdata: this.state.cardsBot,
              backgrund: this.state.cardImageOnTable,
              cardStackempty: this.state.cardStackempty,
              cardButtonClicked: this.clickOnCard
            }),
            React.createElement(CardStorageDiscarded, {
              cardStack: this.state.cardStack,
              cardStackdata: this.state.cardsBot,
              backgrund: this.state.cardImageOnTable,
              cardStackempty: this.state.cardStackempty,
              cardButtonClicked: this.clickOnCard
            })
          )
        );
      }
    }
  }]);

  return Get7Game;
}(React.Component);

//------components


var Get7StatusScreen = function (_React$Component2) {
  _inherits(Get7StatusScreen, _React$Component2);

  function Get7StatusScreen() {
    _classCallCheck(this, Get7StatusScreen);

    return _possibleConstructorReturn(this, (Get7StatusScreen.__proto__ || Object.getPrototypeOf(Get7StatusScreen)).apply(this, arguments));
  }

  _createClass(Get7StatusScreen, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'level-2-get7StatusScreen' },
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'Lobby: ',
          this.props.serverDataPack.dataPack.lobid
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'Mein Name: ',
          this.props.playerName
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'P1 Name:',
          this.props.serverDataPack.dataPack.activeP1
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'P2 Name:',
          this.props.serverDataPack.dataPack.activeP2
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'Spielstatus: ',
          this.props.serverDataPack.dataPack.gamestatus
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'LobbyDaten:',
          this.props.serverDataPack.dataPack.activeP1,
          '----',
          this.props.serverDataPack.dataPack.activeP2,
          ' '
        ),
        React.createElement(
          'div',
          { className: 'level-3-get7StatusScreenElement' },
          'Lobby Status: ',
          this.props.serverDataPack.dataPack.lobbystatus,
          ' '
        )
      );
    }
  }]);

  return Get7StatusScreen;
}(React.Component);

var CardStorageHand = function (_React$Component3) {
  _inherits(CardStorageHand, _React$Component3);

  function CardStorageHand() {
    _classCallCheck(this, CardStorageHand);

    return _possibleConstructorReturn(this, (CardStorageHand.__proto__ || Object.getPrototypeOf(CardStorageHand)).apply(this, arguments));
  }

  _createClass(CardStorageHand, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'handcard-table' },
        React.createElement(Get7CardStorage, { cardStack: this.props.cardStackdata.handCards, cardButtonClicked: this.props.cardButtonClicked, backgrund: this.props.backgrund })
      );
    }
  }]);

  return CardStorageHand;
}(React.Component);

var CardStorageDiscarded = function (_React$Component4) {
  _inherits(CardStorageDiscarded, _React$Component4);

  function CardStorageDiscarded() {
    _classCallCheck(this, CardStorageDiscarded);

    return _possibleConstructorReturn(this, (CardStorageDiscarded.__proto__ || Object.getPrototypeOf(CardStorageDiscarded)).apply(this, arguments));
  }

  _createClass(CardStorageDiscarded, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'name-CardStorages' },
        React.createElement(
          'div',
          { id: 'hero-table' },
          React.createElement(Get7CardStorage, { cardStack: this.props.cardStackdata.cardStackHeroes, cardButtonClicked: '', backgrund: this.props.backgrund })
        ),
        React.createElement(
          'div',
          { id: 'officer-table' },
          React.createElement(Get7CardStorage, { cardStack: this.props.cardStackdata.cardStackOfficers, cardButtonClicked: '', backgrund: this.props.backgrund })
        ),
        React.createElement(
          'div',
          { id: 'king-table' },
          React.createElement(Get7CardStorage, { cardStack: this.props.cardStackdata.cardStackKings, cardButtonClicked: '', backgrund: this.props.backgrund })
        ),
        React.createElement(
          'div',
          { id: 'soldier-table' },
          React.createElement(Get7CardStorage, { cardStack: this.props.cardStackdata.cardStackSoldiers, cardButtonClicked: '', backgrund: this.props.backgrund })
        )
      );
    }
  }]);

  return CardStorageDiscarded;
}(React.Component);

var Get7CardStorage = function (_React$Component5) {
  _inherits(Get7CardStorage, _React$Component5);

  function Get7CardStorage() {
    _classCallCheck(this, Get7CardStorage);

    return _possibleConstructorReturn(this, (Get7CardStorage.__proto__ || Object.getPrototypeOf(Get7CardStorage)).apply(this, arguments));
  }

  _createClass(Get7CardStorage, [{
    key: 'placeCardsOnTable',
    value: function placeCardsOnTable(props) {
      var numbers = props.numbers;
      // var url = "url('" + props.backgrund[3].src + "')"; //only for test
      var listItems = numbers.map(function (number) {
        return React.createElement(
          'button',
          { className: 'playingcard', id: number.toString(), key: number.toString(), value: number.toString(), onClick: props.click, style: { backgroundImage: "url('" + props.backgrund[number].src + "')", color: props.backgrund[number].color } },
          props.backgrund[number].cardtype
        );
      }
      //, border: props.backgrund[number].border
      );
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

  return Get7CardStorage;
}(React.Component);

var Get7PlayField = function (_React$Component6) {
  _inherits(Get7PlayField, _React$Component6);

  function Get7PlayField() {
    _classCallCheck(this, Get7PlayField);

    return _possibleConstructorReturn(this, (Get7PlayField.__proto__ || Object.getPrototypeOf(Get7PlayField)).apply(this, arguments));
  }

  _createClass(Get7PlayField, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: '' },
        React.createElement(Get7CardStorage, { cardStack: this.props.cardStack, cardButtonClicked: this.props.cardButtonClicked, backgrund: this.props.backgrund })
      );
    }
  }]);

  return Get7PlayField;
}(React.Component);

var Get7GameMain = function (_React$Component7) {
  _inherits(Get7GameMain, _React$Component7);

  function Get7GameMain() {
    _classCallCheck(this, Get7GameMain);

    return _possibleConstructorReturn(this, (Get7GameMain.__proto__ || Object.getPrototypeOf(Get7GameMain)).apply(this, arguments));
  }

  _createClass(Get7GameMain, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'main-box-Get7' },
        React.createElement(Get7Game, null)
      );
    }
  }]);

  return Get7GameMain;
}(React.Component);

ReactDOM.render(React.createElement(Get7GameMain, null), document.getElementById('get7root'));