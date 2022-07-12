"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MemoryGame = function (_React$Component) {
  _inherits(MemoryGame, _React$Component);

  function MemoryGame(props) {
    _classCallCheck(this, MemoryGame);

    var _this = _possibleConstructorReturn(this, (MemoryGame.__proto__ || Object.getPrototypeOf(MemoryGame)).call(this, props));

    _this.state = {
      buttonID: [0, 1]
      /*         calcResult: "",
              myDebug:"Debug" */
    };
    /*       this.calculateExpression = this.calculateExpression.bind(this);
          this.handleButtonInput = this.handleButtonInput.bind(this); */
    return _this;
  }

  _createClass(MemoryGame, [{
    key: "handleButtonInput",
    value: function handleButtonInput(e) {
      /*       if(this.state.calcResult == "0"){
              this.state.enteredOutputOnDisplay = "";
            }  */
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(PlayField, {
          buttonID: this.state.buttonID
          /*              buttonInput={this.handleButtonInput}
                        calculate={this.calculateExpression} */
        })
      );
    }
  }]);

  return MemoryGame;
}(React.Component);

var numbers = [1, 2, 3, 4, 5, 6];

var PlayField = function (_React$Component2) {
  _inherits(PlayField, _React$Component2);

  function PlayField() {
    _classCallCheck(this, PlayField);

    return _possibleConstructorReturn(this, (PlayField.__proto__ || Object.getPrototypeOf(PlayField)).apply(this, arguments));
  }

  _createClass(PlayField, [{
    key: "NumberList",
    value: function NumberList(props) {
      var numbers = props.numbers;
      var listItems = numbers.map(function (number) {
        return React.createElement(
          "li",
          { key: number.toString() },
          number
        );
      });
      return React.createElement(
        "ul",
        null,
        listItems
      );
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "calc-gui" },
        React.createElement(
          "div",
          { id: "numbers-gui" },
          React.createElement(
            "button",
            { className: "btn-operator", id: this.props.buttonID, value: this.props.buttonID },
            this.props.buttonID[0]
          ),
          " ",
          React.createElement("br", null)
        )
      ), React.createElement(this.NumberList, { numbers: numbers });
    }
  }]);

  return PlayField;
}(React.Component);

var MemoryGameMain = function (_React$Component3) {
  _inherits(MemoryGameMain, _React$Component3);

  function MemoryGameMain() {
    _classCallCheck(this, MemoryGameMain);

    return _possibleConstructorReturn(this, (MemoryGameMain.__proto__ || Object.getPrototypeOf(MemoryGameMain)).apply(this, arguments));
  }

  _createClass(MemoryGameMain, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "main-box" },
        React.createElement(MemoryGame, null)
      );
    }
  }]);

  return MemoryGameMain;
}(React.Component);

/*   ReactDOM.render(
    <MemoryGameMain />,
    document.getElementById('root')
  ); */