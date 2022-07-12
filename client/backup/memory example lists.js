class MemoryGame extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          buttonID: [0,1]
/*         calcResult: "",
        myDebug:"Debug" */
      };
/*       this.calculateExpression = this.calculateExpression.bind(this);
      this.handleButtonInput = this.handleButtonInput.bind(this); */
    }
    
    handleButtonInput(e){
/*       if(this.state.calcResult == "0"){
        this.state.enteredOutputOnDisplay = "";
      }  */
    }


    render() {
      return (
        <div>      
            <PlayField
                buttonID={this.state.buttonID}
/*              buttonInput={this.handleButtonInput}
              calculate={this.calculateExpression} */
            />
        </div>
      );
    }
  }
  
  const numbers = [1, 2, 3, 4, 5,6];


  class PlayField extends React.Component { 
    NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
          <li key={number.toString()}>
            {number}
          </li>
        );
        return (
          <ul>{listItems}</ul>
        );
      }

    render() {
       return (
        <div id="calc-gui">         
           <div id="numbers-gui">
             <button className="btn-operator" id={this.props.buttonID} value={this.props.buttonID} >{this.props.buttonID[0]}</button> <br/>
           </div>
        </div>,
        <this.NumberList numbers={numbers} />
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
   
  
  
/*   ReactDOM.render(
    <MemoryGameMain />,
    document.getElementById('root')
  ); */
  