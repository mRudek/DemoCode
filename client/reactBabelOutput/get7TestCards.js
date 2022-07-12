'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataPacketGet7 = function DataPacketGet7(game) {
  _classCallCheck(this, DataPacketGet7);

  this.dataPack = {
    'gameName': game,
    'score': 0,
    'socket': {},
    'io': {},
    'command': '',
    'playerName': "PlayerClient",
    'playerArrayId': -5,
    'lobid': -6,
    'isHuman': 1
  };
};

var Get7Game = function (_React$Component) {
  _inherits(Get7Game, _React$Component);

  function Get7Game(props) {
    _classCallCheck(this, Get7Game);

    var _this = _possibleConstructorReturn(this, (Get7Game.__proto__ || Object.getPrototypeOf(Get7Game)).call(this, props));

    _this.cards = new CardList();
    _this.state = {
      update: 0,
      server: new DataPacketGet7("get7"),
      //Cards
      cardImageOnTable: _this.cards.getCardListb(),
      cardStack: [],
      cardStackHeroes: [],
      cardStackKings: [],
      cardStackOfficers: [],
      HandCardsTopEnemy: [],
      HandCardsBottemPlayer: [],
      cardStackSoldiers: [],
      //Lobby
      joinedlobby: -1

    };
    //Testbuttons
    _this.addToKings = _this.addToKings.bind(_this);
    _this.delfromKings = _this.delfromKings.bind(_this);
    _this.joinLobby = _this.joinLobby.bind(_this);
    _this.handOutHandCards = _this.handOutHandCards.bind(_this);
    return _this;
  }
  //-----------Testfunctions-----------------


  _createClass(Get7Game, [{
    key: 'addToKings',
    value: function addToKings() {
      this.state.cardStack.push(34);
      this.state.cardStackHeroes.push(34);
      this.state.cardStackKings.push(34);
      this.state.cardStackOfficers.push(34);
      this.state.HandCardsTopEnemy.push(34);
      this.state.HandCardsBottemPlayer.push(34);
      this.state.cardStackSoldiers.push(34);
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
      var _this2 = this;

      this.state.server.dataPack.command = "joinLobby";
      this.state.server.dataPack.lobid = e.target.value;
      this.sendToServer();
      socket.on('joinLobby', function (data) {
        _this2.state.server.dataPack.playerName = data.activeP1;
        _this2.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering
      });
      this.setState(_defineProperty({ update: 0 }, 'update', 1)); //update rendering    
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
    }

    //-----------render-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'completteTableScreen' },
        React.createElement(
          'div',
          { className: 'testArea' },
          React.createElement(
            'button',
            { onClick: this.addToKings },
            ' Ad to Kings '
          ),
          React.createElement(
            'button',
            { onClick: this.delfromKings },
            ' del from Kings '
          ),
          React.createElement(
            'button',
            { value: '1', onClick: this.joinLobby },
            ' Join Lobby 1 '
          ),
          React.createElement(
            'button',
            { onClick: this.handOutHandCards },
            ' Handout Cards '
          )
        ),
        React.createElement(
          'div',
          { className: 'statusScreen', id: 'statusScreen' },
          React.createElement(Get7StatusScreen, { serverDataPack: this.state.server })
        ),
        React.createElement(
          'div',
          { className: 'playerTableScreen', id: 'enemyTopField' },
          React.createElement(Get7PlayerTable, {
            cardStack: this.state.cardStack,
            cardStackHeroes: this.state.cardStackHeroes,
            cardStackKings: this.state.cardStackKings,
            cardStackOfficers: this.state.cardStackOfficers,
            cardStackHandCards: this.state.HandCardsTopEnemy,
            cardStackSoldiers: this.state.cardStackSoldiers,
            backgrund: this.state.cardImageOnTable
          })
        ),
        React.createElement(
          'div',
          { className: 'playFieldScreen', id: 'midField' },
          React.createElement(Get7PlayField, { cardStack: this.state.cardStack, backgrund: this.state.cardImageOnTable })
        ),
        React.createElement(
          'div',
          { className: 'playerTableScreen', id: 'playerBottemField' },
          React.createElement(Get7PlayerTable, {
            cardStack: this.state.cardStack,
            cardStackHeroes: this.state.cardStackHeroes,
            cardStackKings: this.state.cardStackKings,
            cardStackOfficers: this.state.cardStackOfficers,
            cardStackHandCards: this.state.HandCardsBottemPlayer,
            cardStackSoldiers: this.state.cardStackSoldiers,
            backgrund: this.state.cardImageOnTable
          })
        )
      );
    }
  }]);

  return Get7Game;
}(React.Component);

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
        { className: 'get7StatusScreen' },
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'Lobby:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'Mein Name: ',
          this.props.serverDataPack.dataPack.playerName
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'P1 Name:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'P2 Name:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'Spielstatus:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'LobbyDaten:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'P1 Name:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'P2 Name:'
        ),
        React.createElement(
          'div',
          { className: 'get7StatusScreenElement' },
          'Spielstatus:'
        )
      );
    }
  }]);

  return Get7StatusScreen;
}(React.Component);

var Get7PlayerTable = function (_React$Component3) {
  _inherits(Get7PlayerTable, _React$Component3);

  function Get7PlayerTable() {
    _classCallCheck(this, Get7PlayerTable);

    return _possibleConstructorReturn(this, (Get7PlayerTable.__proto__ || Object.getPrototypeOf(Get7PlayerTable)).apply(this, arguments));
  }

  _createClass(Get7PlayerTable, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'playerTableScreen' },
        React.createElement(
          'div',
          { className: 'leftCardStoragePlayer' },
          React.createElement(
            'div',
            { className: 'medium-table', id: 'hero-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStackHeroes, backgrund: this.props.backgrund })
          ),
          React.createElement(
            'div',
            { className: 'medium-table', id: 'officer-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStackOfficers, backgrund: this.props.backgrund })
          ),
          React.createElement(
            'div',
            { className: 'medium-table', id: 'king-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStackKings, backgrund: this.props.backgrund })
          ),
          React.createElement(
            'div',
            { className: 'medium-table', id: 'hand-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStack, backgrund: this.props.backgrund })
          )
        ),
        React.createElement(
          'div',
          { className: 'rightCardStoragePlayer' },
          React.createElement(
            'div',
            { className: 'big-tables', id: 'handcard-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStackHandCards, backgrund: this.props.backgrund })
          ),
          React.createElement(
            'div',
            { className: 'big-tables', id: 'soldier-table' },
            React.createElement(Get7CardStorage, { cardStack: this.props.cardStackSoldiers, backgrund: this.props.backgrund })
          )
        )
      );
    }
  }]);

  return Get7PlayerTable;
}(React.Component);

var Get7CardStorage = function (_React$Component4) {
  _inherits(Get7CardStorage, _React$Component4);

  function Get7CardStorage() {
    _classCallCheck(this, Get7CardStorage);

    return _possibleConstructorReturn(this, (Get7CardStorage.__proto__ || Object.getPrototypeOf(Get7CardStorage)).apply(this, arguments));
  }

  _createClass(Get7CardStorage, [{
    key: 'placeCardsOnTable',
    value: function placeCardsOnTable(props) {
      var numbers = props.numbers;
      var url = "url('" + props.backgrund[3].src + "')";
      var listItems = numbers.map(function (number) {
        return (
          // <button className="memory-playingcard" id={number.toString()} key={number.toString()} value={number.toString()} onClick={props.click} style={{ backgroundImage: "url('" + props.backgrund[number].src + "')"}} >
          React.createElement('button', { className: 'playingcard', id: number.toString(), key: number.toString(), value: number.toString(), style: { backgroundImage: "url('" + props.backgrund[number].src + "')" } })
        );
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
      return (
        // <this.placeCardsOnTable numbers={this.props.cardStack} click={this.props.cardButtonClicked} backgrund={this.props.backgrund} /> 
        React.createElement(this.placeCardsOnTable, { numbers: this.props.cardStack, backgrund: this.props.backgrund })
      );
    }
  }]);

  return Get7CardStorage;
}(React.Component);

var Get7PlayField = function (_React$Component5) {
  _inherits(Get7PlayField, _React$Component5);

  function Get7PlayField() {
    _classCallCheck(this, Get7PlayField);

    return _possibleConstructorReturn(this, (Get7PlayField.__proto__ || Object.getPrototypeOf(Get7PlayField)).apply(this, arguments));
  }

  _createClass(Get7PlayField, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'playFieldScreen' },
        React.createElement('button', { className: 'playingcard', style: { backgroundImage: "url('" + this.props.backgrund[0].src + "')" } }),
        React.createElement(Get7CardStorage, { cardStack: this.props.cardStack, backgrund: this.props.backgrund })
      );
    }
  }]);

  return Get7PlayField;
}(React.Component);

var Get7GameMain = function (_React$Component6) {
  _inherits(Get7GameMain, _React$Component6);

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

ReactDOM.render(React.createElement(Get7GameMain, null), document.getElementById('get7roots'));