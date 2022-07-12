'use strict';

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return (
      <button onClick={() => this.setState({ liked: true }) }>
        Like
      </button>
    );
  }
}

let domContainer = document.querySelector('root');
ReactDOM.render(<LikeButton />, domContainer);

//const domContainer2 = document.querySelector('#root');
//ReactDOM.render(LikeButton2, domContainer2);

/*
ReactDOM.render(
    //<h1>Hello, world! 2</h1>,
    <LikeButton2 />,
    document.getElementById('root')
  ); */