"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Quote = function (_React$Component) {
  _inherits(Quote, _React$Component);

  function Quote(props) {
    _classCallCheck(this, Quote);

    var _this = _possibleConstructorReturn(this, (Quote.__proto__ || Object.getPrototypeOf(Quote)).call(this, props));

    _this.quoteNo = _this.getRandomInt(3);
    _this.state = {
      quoteData: [{
        author: "max 1",
        text: '"du bist dumm 113"' }, {
        author: "trottel 2",
        text: '"trottel sein ist gut 2332"' }, {
        author: "author 3",
        text: '"ich bin frei"' }],
      testtext: "testText",
      quoteOutput: "quoteOutput",
      quoteAuthor: "quoteAuthor"
    };
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Quote, [{
    key: "getRandomInt",
    value: function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  }, {
    key: "handleClick",
    value: function handleClick(i) {
      var a = this.getRandomInt(3);
      this.setState({ testtext: a });
      this.setState({ quoteOutput: this.state.quoteData[a].text });
      this.setState({ quoteAuthor: this.state.quoteData[a].author });
    }
  }, {
    key: "render",
    value: function render() {
      var renderern = e("div", { id: "quote-box" }, e("div", null, this.state.testtext), e("div", { id: "no-box" }, e("p", { id: "text" }, this.state.quoteOutput), e("p", { id: "author" }, this.state.quoteAuthor)), e("button", { id: "new-quote", onClick: this.handleClick }, "new-quote2"), e("a", { id: "tweet-quote", target: "_blank", href: "twitter.com/intent/tweet" }, "tweet"));
      return renderern;
    }
  }]);

  return Quote;
}(React.Component);

/*
       <div id="quote-box">
        <div >{this.state.testtext}</div>
        <div id="text">{this.state.quoteOutput}</div>
        <div id="author">{this.state.quoteAuthor}</div>
        <button id="new-quote" onClick={this.handleClick}>new-quote2</button>
        <a id="tweet-quote" target="_blank" href="twitter.com/intent/tweet">tweet</a>
      </div>
      */

ReactDOM.render(e(Quote), document.querySelector('#root'));