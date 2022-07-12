'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ACHTUNG!! Componente Get7RuleText ist in ./reactBabelOutput/get7RuleText.js und wird in get7VScpu.html geladen
//------data packs
var DataPacketGet7 = function DataPacketGet7(game) {
  _classCallCheck(this, DataPacketGet7);

  this.dataPack = {
    'kiGame': false,
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
    'yourPlayer': 0,
    'activeP1': "",
    'activeP2': "",
    'lobbystatus': "",
    'gamestatus': "",
    chosenCardOne: -12
  };
};

//------create connection


var socket = window.io(); // let socket = io();
var serverData = void 0;

//------main app

var Get7Game = function (_React$Component) {
  _inherits(Get7Game, _React$Component);

  function Get7Game(props) {
    _classCallCheck(this, Get7Game);

    var _this = _possibleConstructorReturn(this, (Get7Game.__proto__ || Object.getPrototypeOf(Get7Game)).call(this, props));

    _this.get7KI = new Get7GameKI();
    _this.playerAttackCommand = { status: false, sound: false, No: 0 }, _this.gameRuning = false;
    _this.cards = new CardListDemoGet7();
    _this.maxCards = 51;
    _this.startView = 0;
    _this.updateIntervall = 300;
    _this.wishlobby = -12;
    _this.preloadImagesTimer = true;
    _this.playerTurn = 0;
    _this.attack = 0;
    _this.audioAttack_1 = new Audio("/assets/sounds/p_1a.mp3");
    _this.audioAttack_2 = new Audio("/assets/sounds/p_2a.mp3");
    _this.audioAttack_3 = new Audio("/assets/sounds/p_3a.mp3");
    _this.audioAttack_4 = new Audio("/assets/sounds/p_4a.mp3");
    _this.audioAttack_5 = new Audio("/assets/sounds/p_5a.mp3");
    _this.state = {
      btn: { width: '100px' },
      playsound: false,
      audio: new Audio("/assets/sounds/winFanFar.mp3"),
      p1Points: 0,
      p2Points: 0,
      points: {
        pointsWinCondition: 5,
        p1: {
          heros: 0,
          officers: 0,
          kings: 0,
          soldiers: 0,
          total: 0
        },
        p2: {
          heros: 0,
          officers: 0,
          kings: 0,
          soldiers: 0,
          total: 0
        }
      },
      update: 0,
      tableView: _this.startView,
      clientDataPacket: new DataPacketGet7("get7"),
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
    _this.joinLobby = _this.joinLobby.bind(_this);
    _this.kickLobby = _this.kickLobby.bind(_this);
    _this.handOutHandCards = _this.handOutHandCards.bind(_this);
    _this.startGame = _this.startGame.bind(_this);
    _this.clickOnCard = _this.clickOnCard.bind(_this);
    _this.clickOnCardOfficer = _this.clickOnCardOfficer.bind(_this);
    _this.startGameKi = _this.startGameKi.bind(_this);
    _this.listenServer(); //start listen for packets from server
    return _this;
  }

  _createClass(Get7Game, [{
    key: 'listenServer',
    value: function listenServer() {
      var _this2 = this;

      socket.on('serverAnswer', function (datafromServerAnswer) {
        serverData = datafromServerAnswer;
        _this2.evaluate();
      });
    }
  }, {
    key: 'joinLobby',
    value: function joinLobby(lobbyNo) {
      if (lobbyNo == 1) {
        this.state.clientDataPacket.dataPack.command = "joinLobby";
        this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
        this.state.clientDataPacket.dataPack.lobbyToJoin = lobbyNo;
        this.sendToServer();
      }
    }

    //Gameraound

  }, {
    key: 'startGame',
    value: function startGame() {
      this.state.clientDataPacket.dataPack.command = "startRound";
      this.state.clientDataPacket.dataPack.kiGame = false;
      this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
      this.sendToServer();
    }
  }, {
    key: 'startGameKi',
    value: function startGameKi() {
      console.log("KIGame btn");
      this.state.clientDataPacket.dataPack.command = "startRound";
      this.state.clientDataPacket.dataPack.kiGame = true;
      this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
      this.get7KI.startGameKi(1, this.state.clientDataPacket);
      // this.get7KI.startGameKi(lobbyNo,this.state.clientDataPacket);
      //init sounds
      // this.sendToServer();
    }

    //click live for server

  }, {
    key: 'clickOnCard',
    value: function clickOnCard(e) {
      //to do switch uberarbeiten
      var tmpNo = 0;
      switch (this.state.playerName) {
        case 1:
          tmpNo = 1;
          break;
        case 2:
          tmpNo = 2;
          break;
      }
      if (this.playerTurn == tmpNo && this.gameRuning == true) {
        this.state.clientDataPacket.dataPack.command = "evalPlayerTurn";
        this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
        this.state.clientDataPacket.dataPack.chosenCardOne = e;
        this.sendToServer();
        this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
      }
    }
  }, {
    key: 'clickOnCardOfficer',
    value: function clickOnCardOfficer(e) {
      //Wolf clicked && e == 33
      if (this.playerTurn == this.state.playerName && e == 33) {
        var val = confirm("Wolf als 2 Punkte Soldat?");
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
  }, {
    key: 'updateRoundTurn',
    value: function updateRoundTurn(cardData, playerTurn, cardsoundNo) {
      if (this.state.playerName == 1 && this.gameRuning == true) {
        this.state.cardsTop = cardData.p2;
        this.state.cardsBot = cardData.p1;
        this.state.audio.pause();
        this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
        this.state.audio.play();
      }
      if (this.state.playerName == 2 && this.gameRuning == true) {
        this.state.cardsTop = cardData.p1;
        this.state.cardsBot = cardData.p2;
        this.state.audio.pause();
        this.state.audio = this.state.cardImageOnTable[cardsoundNo].audio;
        this.state.audio.play();
      }
      this.updateMidTableCards(cardData);
      this.playerTurn = playerTurn;
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
  }, {
    key: 'attackRequest',
    value: function attackRequest(playerTurn) {
      console.log("attack");
      //human
      if (playerTurn == this.state.playerName && this.playerAttackCommand.status == false) {
        this.playerAttackCommand.status = true;
        var val = confirm("Weiter Angreifen?");
        if (val == true) {
          // alert("attacking");
          this.state.clientDataPacket.dataPack.command = "wantAttackPlayer";
          this.state.clientDataPacket.dataPack.yourPlayer = this.state.playerName;
          if (this.playerAttackCommand.No > 5) {
            this.state.clientDataPacket.dataPack.command = "getWin";
          }
          if (this.gameRuning == true) {
            this.sendToServer();
          }
        } else {
          this.state.clientDataPacket.dataPack.command = "getWin";
          if (this.gameRuning == true) {
            this.sendToServer();
          }
          this.gameRuning = false;
        }
      }
      //KI
      if (playerTurn == 2 && this.state.clientDataPacket.dataPack.kiGame == true && this.playerAttackCommand.status == false && this.state.cardsBot.handCards.length > 0) {
        this.playerAttackCommand.status = true;
        this.state.clientDataPacket.dataPack.yourPlayer = 2;
        this.state.clientDataPacket.dataPack.command = "getWin";
        this.sendToServer();
      }
    }
  }, {
    key: 'attackCommand',
    value: function attackCommand(playerTurn) {
      if (this.playerAttackCommand.sound == false) {
        this.playerAttackCommand.sound = true;
        this.playerTurn = playerTurn;
        this.state.audio.pause();
        this.playerAttackCommand.No = this.playerAttackCommand.No + 1;
        switch (this.playerAttackCommand.No) {
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
  }, {
    key: 'kickLobby',
    value: function kickLobby(e) {
      if (e.target.value == 1) {
        this.state.clientDataPacket.dataPack.command = "kickLobby";
        this.state.playerName = 0;
        this.sendToServer();
        this.setState({ tableView: 0 });
      }
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
      console.log("send " + this.state.clientDataPacket.dataPack.command);
      socket.emit(this.state.clientDataPacket.dataPack.gameName, this.state.clientDataPacket.dataPack);
    }
  }, {
    key: 'resetGame',
    value: function resetGame() {
      this.playerAttackCommand = { status: false, No: 0, phase: false }, this.setState({
        p1Points: 0,
        p2Points: 0,
        update: 0,
        playerName: 0
      });
    }
  }, {
    key: 'evaluate',
    value: function evaluate() {
      switch (serverData.command) {
        case 'lobbyFull':
          if (this.state.playerName == 1 || this.state.playerName == 2) {
            //nothing
          } else {
            this.state.playerName = serverData.yourPlayer;
            this.state.clientDataPacket.dataPack.lobbystatus = "lobbyFull / Bitte Kick Lobby 1 Button betätigen";
            this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          }
          break;
        case 'joinLobby':
          if (serverData.lobbystatus != "lobbyFull") {
            this.state.playerName = serverData.yourPlayer;
            this.state.clientDataPacket.dataPack.gamestatus = "press start round";
            this.state.joinedlobby = serverData.lobid;
            this.state.clientDataPacket.dataPack.lobid = serverData.lobid;
            this.setState({ tableView: 1 });
            this.gameRuning = true;
          }
          break;
        case 'updateLobby':
          if (this.state.joinedlobby == serverData.lobid) {
            this.playerTurn = 1;
            this.state.clientDataPacket.dataPack.activeP1 = serverData.activeP1;
            this.state.clientDataPacket.dataPack.activeP2 = serverData.activeP2;
            if (this.state.clientDataPacket.dataPack.kiGame == true) {
              //vs KI
              this.state.playerName = 1;
            }
            this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
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
          this.setState({ tableView: 0 });
          this.state.clientDataPacket = new DataPacketGet7("get7");
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          break;
        case 'waitForPlayer':
          this.state.clientDataPacket.dataPack.gamestatus = "waiting for other Players to start";
          // this.setState( {tableView:2 }); 
          this.state.clientDataPacket.dataPack.activeP1 = serverData.activeP1;
          this.state.clientDataPacket.dataPack.activeP2 = serverData.activeP2;
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'startRound':
          this.setState({ tableView: 3 });
          this.state.clientDataPacket.dataPack.gamestatus = "viel spaß beim zocken";
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, 0);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'evalPlayerTurn':
          this.playerAttackCommand.status = false;
          this.playerAttackCommand.sound = false;
          this.state.p1Points = serverData.p1Points;
          this.state.p2Points = serverData.p2Points;
          this.state.points = serverData.points;
          if (this.gameRuning == true) {
            this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          }
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          if (this.state.clientDataPacket.dataPack.kiGame == true && serverData.playerTurn == 2 && this.gameRuning == true) {
            //vs KI
            var KICard = this.state.cardsTop.handCards[0];
            this.get7KI.clickOnCard(KICard, this.state.clientDataPacket);
          }
          break;
        case 'attackRequest':
          if (this.state.clientDataPacket.dataPack.kiGame == true) {
            this.playerAttackCommand.status = false;
            this.playerAttackCommand.sound = false;
          }
          this.state.p1Points = serverData.p1Points;
          this.state.p2Points = serverData.p2Points;
          this.state.points = serverData.points;
          if (this.gameRuning == true) {
            this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
            this.attackRequest(serverData.playerTurn);
          }
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'attackAllowed':
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.state.playerTurn = serverData.playerTurn;
          this.attackCommand(serverData.playerTurn);
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
          if (this.state.clientDataPacket.dataPack.kiGame == true && serverData.playerTurn == 2 && this.gameRuning == true) {
            //vs KI
            var _KICard = this.state.cardsTop.handCards[0];
            this.get7KI.clickOnCard(_KICard, this.state.clientDataPacket);
          }
          break;
        case 'p1Wins':
          this.gameRuning = false;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_win.mp3");
          this.state.p1Points = serverData.p1Points + "p1Wins";
          this.state.points = serverData.points;
          if (this.state.playerName == 2) {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'p2Wins':
          this.gameRuning = false;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_win.mp3");
          this.state.p2Points = serverData.p2Points + "p2Wins";
          this.state.points = serverData.points;
          if (this.state.playerName == 1) {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
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
          if (this.state.playerName == 2) {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'p2WinsCounter':
          this.gameRuning = false;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_win.mp3");
          this.state.p2Points = serverData.p2Points + "p2WinsCounter";
          this.state.points = serverData.points;
          if (this.state.playerName == 1) {
            this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          }
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          break;
        case 'remis':
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
          this.state.p2Points = serverData.p2Points + "unentschieden";
          this.state.points = serverData.points;
          this.state.audio.pause();
          this.state.audio = new Audio("/assets/sounds/p_lose.mp3");
          this.state.audio.play();
          this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering 
          this.gameRuning = false;
          break;
        case 'wolfsoldier':
          this.state.p1Points = serverData.p1Points;
          this.state.p2Points = serverData.p2Points;
          this.state.points = serverData.points;
          this.updateRoundTurn(serverData.distributedCards, serverData.playerTurn, serverData.chosenCardOne);
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
      var _this3 = this;

      //------------------Lobby outside
      if (this.state.tableView == 0) {
        return React.createElement(
          'div',
          null,
          React.createElement(LobbyOutside, {
            playerName: this.state.playerName,
            serverDataPack: this.state.clientDataPacket,
            joinLobby: function joinLobby(e) {
              return _this3.joinLobby(e);
            },
            kickLobby: this.kickLobby
          })
        );
      }
      //------------------Lobby inside
      if (this.state.tableView == 1) {
        return React.createElement(
          'div',
          null,
          React.createElement(LobbyInside, {
            playerName: this.state.playerName,
            serverDataPack: this.state.clientDataPacket,
            startGame: this.startGame,
            kickLobby: this.kickLobby,
            startGameKi: this.startGameKi
          })
        );
      }
      //------------------Lobby inside wait for Player
      if (this.state.tableView == 2) {
        return React.createElement(
          'div',
          { className: 'level-0-box' },
          React.createElement(
            'div',
            { className: 'level-1-playFieldScreen-mid-status', style: { height: "60px" } },
            'WARTE AUF SPIELER'
          ),
          React.createElement(
            'button',
            { className: 'level-2-joinBtns', value: '1', onClick: this.kickLobby, id: 'testbtn' },
            ' Kick Lobby 1 '
          )
        );
      }
      //------------------joined lobby as player
      if (this.state.tableView == 3) {
        return React.createElement(
          'div',
          null,
          React.createElement(GameScreen
          //comp 1 
          , { cardStack: this.state.cardStack,
            cardsTop: this.state.cardsTop,
            cardImageOnTable: this.state.cardImageOnTable,
            cardStackempty: this.state.cardStackempty
            //comp 2
            , points: this.state.points
            //comp 3
            , cardGroupOnTable_1: this.state.cardGroupOnTable_1,
            cardGroupOnTable_2: this.state.cardGroupOnTable_2,
            cardGroupOnTable_3: this.state.cardGroupOnTable_3,
            cardGroupOnTable_4: this.state.cardGroupOnTable_4,
            cardGroupOnTable_5: this.state.cardGroupOnTable_5,
            cardGroupOnTable_6: this.state.cardGroupOnTable_6,
            cardGroupOnTable_7: this.state.cardGroupOnTable_7,
            cardGroupOnTable_8: this.state.cardGroupOnTable_8,
            cardGroupOnTable_9: this.state.cardGroupOnTable_9,
            cardGroupOnTable_10: this.state.cardGroupOnTable_10,
            cardGroupOnTable_11: this.state.cardGroupOnTable_11,
            cardGroupOnTable_12: this.state.cardGroupOnTable_12
            //comp 4
            , playerName: this.state.playerName,
            playerTurn: this.playerTurn,
            p1Points: this.state.p1Points,
            p2Points: this.state.p2Points,
            kickLobby: this.kickLobby
            //comp 5
            , cardsBot: this.state.cardsBot,
            clickOnCard: function clickOnCard(a) {
              return _this3.clickOnCard(a);
            }
            //comp 6
            , clickOnCardOfficer: function clickOnCardOfficer(a) {
              return _this3.clickOnCardOfficer(a);
            }
          })
        );
      }
    }
  }]);

  return Get7Game;
}(React.Component);

//---------------components
//template zur Erstellung neuer Komponente; wird im Code nicht benötiget


var template = function template(_ref) {
  _objectDestructuringEmpty(_ref);

  return React.createElement('div', { className: 'level-2-get7StatusScreen' });
};

//---------------components for GUI
var LobbyOutside = function LobbyOutside(_ref2) {
  var joinLobby = _ref2.joinLobby,
      kickLobby = _ref2.kickLobby,
      playerName = _ref2.playerName,
      serverDataPack = _ref2.serverDataPack;

  return React.createElement(
    'div',
    { className: 'level-0-box' },
    React.createElement(
      'div',
      { className: 'level-1-lobbybtnArea' },
      React.createElement(
        'button',
        { className: 'level-2-joinBtns', value: '1', onClick: function onClick() {
            return joinLobby(1);
          } },
        ' Join Lob 1 '
      ),
      React.createElement(
        'button',
        { className: 'level-2-joinBtns', value: '1', onClick: kickLobby, id: 'testbtn' },
        ' Kick Lobby 1 '
      )
    ),
    React.createElement(
      'div',
      { className: 'level-1-statusScreen', id: 'statusScreen' },
      React.createElement(Get7StatusScreen, { playerName: playerName, serverDataPack: serverDataPack })
    )
  );
};

var LobbyInside = function LobbyInside(_ref3) {
  var playerName = _ref3.playerName,
      startGame = _ref3.startGame,
      startGameKi = _ref3.startGameKi,
      kickLobby = _ref3.kickLobby,
      serverDataPack = _ref3.serverDataPack;

  return React.createElement(
    'div',
    { className: 'level-0-box' },
    React.createElement(
      'div',
      { className: 'level-1-statusScreen', id: 'statusScreen' },
      React.createElement(Get7StatusScreen, { playerName: playerName, serverDataPack: serverDataPack })
    ),
    React.createElement(
      'div',
      { className: 'level-1-lobbybtnArea' },
      React.createElement(
        'button',
        { className: 'level-2-joinBtns', onClick: startGame },
        ' VS Menschen '
      ),
      React.createElement(
        'button',
        { className: 'level-2-joinBtns', onClick: startGameKi },
        ' VS Ki '
      ),
      React.createElement(
        'button',
        { className: 'level-2-joinBtns', value: '1', onClick: kickLobby },
        ' Kick Lobby 1 '
      )
    )
  );
};

var GameScreen = function GameScreen(_ref4) {
  var clickOnCardOfficer = _ref4.clickOnCardOfficer,
      clickOnCard = _ref4.clickOnCard,
      cardsBot = _ref4.cardsBot,
      kickLobby = _ref4.kickLobby,
      p2Points = _ref4.p2Points,
      p1Points = _ref4.p1Points,
      playerTurn = _ref4.playerTurn,
      playerName = _ref4.playerName,
      cardGroupOnTable_1 = _ref4.cardGroupOnTable_1,
      cardGroupOnTable_2 = _ref4.cardGroupOnTable_2,
      cardGroupOnTable_3 = _ref4.cardGroupOnTable_3,
      cardGroupOnTable_4 = _ref4.cardGroupOnTable_4,
      cardGroupOnTable_5 = _ref4.cardGroupOnTable_5,
      cardGroupOnTable_6 = _ref4.cardGroupOnTable_6,
      cardGroupOnTable_7 = _ref4.cardGroupOnTable_7,
      cardGroupOnTable_8 = _ref4.cardGroupOnTable_8,
      cardGroupOnTable_9 = _ref4.cardGroupOnTable_9,
      cardGroupOnTable_10 = _ref4.cardGroupOnTable_10,
      cardGroupOnTable_11 = _ref4.cardGroupOnTable_11,
      cardGroupOnTable_12 = _ref4.cardGroupOnTable_12,
      points = _ref4.points,
      cardStackempty = _ref4.cardStackempty,
      cardImageOnTable = _ref4.cardImageOnTable,
      cardsTop = _ref4.cardsTop,
      cardStack = _ref4.cardStack;

  return React.createElement(
    'div',
    { className: 'level-0-box' },
    React.createElement(
      'div',
      { className: 'level-1-playerTableScreen-Player', id: 'playerTopField' },
      React.createElement(CardStorageDiscardedEnemy, {
        cardStack: cardStack,
        cardStackdata: cardsTop,
        backgrund: cardImageOnTable,
        cardStackempty: cardStackempty,
        cardButtonClicked: function cardButtonClicked() {
          return '';
        },
        points: points.p2
      })
    ),
    React.createElement(
      'div',
      { className: 'level-1-playFieldScreen-mid-cards' },
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-1' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_1, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-2' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_2, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-3' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_3, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-4' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_4, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-5' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_5, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-6' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_6, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-7' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_7, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-8' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_8, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-9' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_9, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-10' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_10, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-11' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_11, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-cards', id: 'midField-12' },
        React.createElement(Get7PlayField, { cardStack: cardGroupOnTable_12, cardButtonClicked: function cardButtonClicked() {
            return '';
          }, backgrund: cardImageOnTable })
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-rules' },
        React.createElement(Get7RuleText, null)
      )
    ),
    React.createElement(
      'div',
      { className: 'level-1-playFieldScreen-mid-status', style: { height: "60px" } },
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-status-side', style: { height: "60px" } },
        React.createElement(
          'p',
          null,
          ' DU bist: ',
          playerName,
          ' ',
          React.createElement('br', null),
          ' Spieler dran: P',
          playerTurn,
          ' '
        )
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-status-side', style: { height: "60px" } },
        React.createElement(
          'p',
          null,
          'POINTS P1: ',
          p1Points,
          ' / ',
          points.pointsWinCondition,
          ' ',
          React.createElement('br', null),
          ' POINTS P2: ',
          p2Points,
          ' / ',
          points.pointsWinCondition,
          '  '
        )
      ),
      React.createElement(
        'div',
        { className: 'level-2-playFieldScreen-mid-status-mid', style: { height: "60px" } },
        React.createElement(
          'button',
          { className: 'level-2-joinBtnKick', value: '1', onClick: kickLobby },
          ' neue Runde '
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'level-1-playerTableScreen-Player', id: 'playerBottemField' },
      React.createElement(CardStorageHandPlayer, {
        cardStack: cardStack,
        cardStackdata: cardsBot,
        backgrund: cardImageOnTable,
        cardStackempty: cardStackempty,
        cardButtonClicked: function cardButtonClicked(a) {
          return clickOnCard(a);
        }
      }),
      React.createElement(CardStorageDiscarded, {
        cardStack: cardStack,
        cardStackdata: cardsBot,
        backgrund: cardImageOnTable,
        cardStackempty: cardStackempty,
        cardButtonClicked: function cardButtonClicked(a) {
          return clickOnCardOfficer(a);
        },
        points: points.p1
      })
    )
  );
};

var Get7StatusScreen = function Get7StatusScreen(_ref5) {
  var serverDataPack = _ref5.serverDataPack,
      playerName = _ref5.playerName;

  return React.createElement(
    'div',
    { className: 'level-2-get7StatusScreen' },
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'Lobby: ',
      serverDataPack.dataPack.lobid
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'Mein Name: ',
      playerName
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'P1 Name:',
      serverDataPack.dataPack.activeP1
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'P2 Name:',
      serverDataPack.dataPack.activeP2
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'Spielstatus: ',
      serverDataPack.dataPack.gamestatus
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'LobbyDaten:',
      serverDataPack.dataPack.activeP1,
      '----',
      serverDataPack.dataPack.activeP2,
      ' '
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      'Lobby Status: ',
      serverDataPack.dataPack.lobbystatus,
      ' '
    ),
    React.createElement(
      'div',
      { className: 'level-3-get7StatusScreenElement' },
      React.createElement(
        'a',
        { href: 'https://www.pagat.com/de/fishing/gostop.html', target: '_blank' },
        ' Link zu Regel auf externer Seite'
      )
    )
  );
};

var CardStorageHandPlayer = function CardStorageHandPlayer(_ref6) {
  var cardStackdata = _ref6.cardStackdata,
      cardButtonClicked = _ref6.cardButtonClicked,
      backgrund = _ref6.backgrund;

  return React.createElement(
    'div',
    { id: 'handcard-table' },
    'Deine Karten',
    React.createElement(Get7CardStorage, { cardStack: cardStackdata.handCards, cardButtonClicked: cardButtonClicked, backgrund: backgrund })
  );
};

var CardStorageHandEnemy = function CardStorageHandEnemy(_ref7) {
  var cardStackdata = _ref7.cardStackdata,
      cardButtonClicked = _ref7.cardButtonClicked,
      backgrund = _ref7.backgrund;

  return React.createElement(
    'div',
    { id: 'handcard-table' },
    React.createElement(Get7CardStorage, { cardStack: cardStackdata.handCards, cardButtonClicked: cardButtonClicked, backgrund: backgrund })
  );
};

var CardStorageDiscarded = function CardStorageDiscarded(_ref8) {
  var cardStackdata = _ref8.cardStackdata,
      cardButtonClicked = _ref8.cardButtonClicked,
      backgrund = _ref8.backgrund,
      points = _ref8.points;

  return React.createElement(
    'div',
    { id: 'name-CardStorages' },
    React.createElement(
      'div',
      { id: 'hero-table' },
      points.heros,
      ' P; 3 H = 3 P; 5 h = 15 P;',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackHeroes, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'king-table' },
      points.kings,
      ' P; ab 5 K\xF6nige = +1 P; 3 K\xF6nige gleiche Farbe = 3 Extra Punkte;',
      React.createElement(Get7CardStorage, { cardStack: cardStackdata.cardStackKings, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'officer-table' },
      points.officers,
      ' P; ab 5 Offi = +1 Punkte; 3 Goldene = 3 Extra Punkte',
      React.createElement(Get7CardStorage, { cardStack: cardStackdata.cardStackOfficers, cardButtonClicked: cardButtonClicked, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'soldier-table' },
      points.soldiers,
      ' P, da ',
      cardStackdata.cardStackSoldiers.length,
      ' / 10 Soldaten; S2 z\xE4hlen als 2 Soldaten',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackSoldiers, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    )
  );
};

var CardStorageDiscardedEnemy = function CardStorageDiscardedEnemy(_ref9) {
  var cardStackdata = _ref9.cardStackdata,
      cardButtonClicked = _ref9.cardButtonClicked,
      backgrund = _ref9.backgrund,
      points = _ref9.points;

  return React.createElement(
    'div',
    { id: 'name-CardStorages' },
    React.createElement(
      'div',
      { id: 'handcards-table-enemy' },
      'Gegnerkarten',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.handCards, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'hero-table-enemy' },
      points.heros,
      ' P',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackHeroes, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'king-table-enemy' },
      points.kings,
      ' P; ab 5 K\xF6nige = +1 P; 3 K\xF6nige gleiche Farbe = 3 Extra Punkte; P2 Cards:',
      cardStackdata.handCards.length,
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackKings, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'officer-table-enemy' },
      points.officers,
      ' P; ab 5 Offi = +1 Punkte; 3 Goldene = 3 Extra Punkte',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackOfficers, cardButtonClicked: cardButtonClicked, backgrund: backgrund })
    ),
    React.createElement(
      'div',
      { id: 'soldier-table-enemy' },
      points.soldiers,
      ' P, da ',
      cardStackdata.cardStackSoldiers.length,
      ' / 10 Soldaten; S2 z\xE4hlen als 2 Soldaten',
      React.createElement(Get7CardStorageSmallCards, { cardStack: cardStackdata.cardStackSoldiers, cardButtonClicked: function cardButtonClicked() {
          return '';
        }, backgrund: backgrund })
    )
  );
};

var Get7CardStorage = function (_React$Component2) {
  _inherits(Get7CardStorage, _React$Component2);

  function Get7CardStorage() {
    _classCallCheck(this, Get7CardStorage);

    return _possibleConstructorReturn(this, (Get7CardStorage.__proto__ || Object.getPrototypeOf(Get7CardStorage)).apply(this, arguments));
  }

  _createClass(Get7CardStorage, [{
    key: 'placeCardsOnTable',
    value: function placeCardsOnTable(props) {
      // props.click
      var numbers = props.numbers;
      // let url = "url('" + props.backgrund[3].src + "')"; //only for test
      var listItems = numbers.map(function (number) {
        return React.createElement(
          'button',
          { className: 'playingcard', id: number.toString(), key: number.toString(), value: number.toString(), onClick: function onClick() {
              return console.log(props.click(number));
            }, style: { backgroundImage: "url('" + props.backgrund[number].src + "')", color: props.backgrund[number].color } },
          props.backgrund[number].group,
          ' ',
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

var Get7CardStorageSmallCards = function (_React$Component3) {
  _inherits(Get7CardStorageSmallCards, _React$Component3);

  function Get7CardStorageSmallCards() {
    _classCallCheck(this, Get7CardStorageSmallCards);

    return _possibleConstructorReturn(this, (Get7CardStorageSmallCards.__proto__ || Object.getPrototypeOf(Get7CardStorageSmallCards)).apply(this, arguments));
  }

  _createClass(Get7CardStorageSmallCards, [{
    key: 'placeCardsOnTable',
    value: function placeCardsOnTable(props) {
      // props.click
      var numbers = props.numbers;
      // let url = "url('" + props.backgrund[3].src + "')"; //only for test
      var listItems = numbers.map(function (number) {
        return React.createElement(
          'button',
          { className: 'playingcard-SmallCards', id: number.toString(), key: number.toString(), value: number.toString(), onClick: function onClick() {
              return console.log(props.click(number));
            }, style: { backgroundImage: "url('" + props.backgrund[number].src + "')", color: props.backgrund[number].color } },
          props.backgrund[number].group,
          ' ',
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

  return Get7CardStorageSmallCards;
}(React.Component);

var Get7PlayField = function Get7PlayField(_ref10) {
  var cardStack = _ref10.cardStack,
      cardButtonClicked = _ref10.cardButtonClicked,
      backgrund = _ref10.backgrund;

  return React.createElement(
    'div',
    { className: 'midField-card' },
    React.createElement(Get7CardStorage, { cardStack: cardStack, cardButtonClicked: cardButtonClicked, backgrund: backgrund })
  );
};

var Get7GameMain = function Get7GameMain() {
  return React.createElement(
    'div',
    { id: 'main-box-Get7' },
    React.createElement(Get7Game, null)
  );
};

ReactDOM.render(React.createElement(Get7GameMain, null), document.getElementById('get7rootVSCPU'));