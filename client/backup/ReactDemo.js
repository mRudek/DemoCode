class Quote extends React.Component {
    constructor(props) {
      super(props);
      this.quoteNo = this.getRandomInt(3);
      this.state = {
        quoteData:[
          {  
            author: "max 1",
            text: '"du bist dumm 113"'},
          {
            author: "trottel 2",
            text: '"trottel sein ist gut 2332"'},
                   {
            author: "author 3",
            text: '"ich bin frei"'} 
        ],
        testtext: "testText",
        quoteOutput: "quoteOutput",
        quoteAuthor: "quoteAuthor" 
      };
      this.handleClick = this.handleClick.bind(this);
   }
     
   getRandomInt(max) {
   return Math.floor(Math.random() * max);
   }
   
   handleClick(i){
     let a = this.getRandomInt(3); 
     this.setState( { testtext: a});
     this.setState( { quoteOutput : this.state.quoteData[a].text} );
     this.setState( { quoteAuthor : this.state.quoteData[a].author} );
   }   
  
   render() {
     return (
       <div id="quote-box">
         <div >{this.state.testtext}</div>
         <div id="text">{this.state.quoteOutput}</div>
         <div id="author">{this.state.quoteAuthor}</div>
         <button id="new-quote" onClick={this.handleClick}>new-quote2</button>
         <a id="tweet-quote" target="_blank" href="twitter.com/intent/tweet">tweet</a>
       </div>
     );
   }
 }
 
 
 ReactDOM.render(
   <Quote />,
   document.getElementById('root')
 );
 