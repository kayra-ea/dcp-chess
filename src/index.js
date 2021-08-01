import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const {board} = require('./lib/board.js');
const logic = require('./lib/logic.js');
const pussy = board('init');

// ==========================================================================

function Square(props) {
  return (
    <button 
      className={props.colour}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

/*class Square extends React.Component {

  render() {
    return (
      <button 
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}*/

// ===========================================================================

class ChessBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squares: this.props.board.squares,
      colour: this.props.board.colours,
      selectedSquare: {x: null, y: null},
      pieceIsSelected: false,
      isPlayerTurn: true,
    };
  }

  resetColour() {
    return board('init').colours;
  }

  handleClick(i, y) {
    const squares = this.state.squares.slice(); //shallow copy
    const colour = this.resetColour(); //shallow copy
    let pieceIsSelected = this.state.pieceIsSelected;

    if (squares[i][y] !== ''){
      pieceIsSelected = true;
    } else {
      pieceIsSelected = false;
    }

    colour[i][y] = 'sq-selected';
   
    if (this.state.pieceIsSelected) {
      logic.movePiece(this.state.squares, this.state.selectedSquare, i, y);
    } 

    this.setState({
      squares: squares,
      colour: colour, 
      selectedSquare: {x: i, y: y},
      pieceIsSelected: pieceIsSelected,
      isPlayerTurn: true,
    });

  }

  renderSquare(i, y) {
    return (
      <Square 
        colour={this.state.colour[i][y]}
        value={this.state.squares[i][y]}
        onClick={() => this.handleClick(i, y)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
          {this.renderSquare(0, 3)}
          {this.renderSquare(0, 4)}
          {this.renderSquare(0, 5)}
          {this.renderSquare(0, 6)}
          {this.renderSquare(0, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
          {this.renderSquare(1, 3)}
          {this.renderSquare(1, 4)}
          {this.renderSquare(1, 5)}
          {this.renderSquare(1, 6)}
          {this.renderSquare(1, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
          {this.renderSquare(2, 3)}
          {this.renderSquare(2, 4)}
          {this.renderSquare(2, 5)}
          {this.renderSquare(2, 6)}
          {this.renderSquare(2, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, 0)}
          {this.renderSquare(3, 1)}
          {this.renderSquare(3, 2)}
          {this.renderSquare(3, 3)}
          {this.renderSquare(3, 4)}
          {this.renderSquare(3, 5)}
          {this.renderSquare(3, 6)}
          {this.renderSquare(3, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(4, 0)}
          {this.renderSquare(4, 1)}
          {this.renderSquare(4, 2)}
          {this.renderSquare(4, 3)}
          {this.renderSquare(4, 4)}
          {this.renderSquare(4, 5)}
          {this.renderSquare(4, 6)}
          {this.renderSquare(4, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(5, 0)}
          {this.renderSquare(5, 1)}
          {this.renderSquare(5, 2)}
          {this.renderSquare(5, 3)}
          {this.renderSquare(5, 4)}
          {this.renderSquare(5, 5)}
          {this.renderSquare(5, 6)}
          {this.renderSquare(5, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, 0)}
          {this.renderSquare(6, 1)}
          {this.renderSquare(6, 2)}
          {this.renderSquare(6, 3)}
          {this.renderSquare(6, 4)}
          {this.renderSquare(6, 5)}
          {this.renderSquare(6, 6)}
          {this.renderSquare(6, 7)}
        </div>
        <div className="board-row">
          {this.renderSquare(7, 0)}
          {this.renderSquare(7, 1)}
          {this.renderSquare(7, 2)}
          {this.renderSquare(7, 3)}
          {this.renderSquare(7, 4)}
          {this.renderSquare(7, 5)}
          {this.renderSquare(7, 6)}
          {this.renderSquare(7, 7)}
        </div>
      </div>
    );
  }
}

// =============================================================

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="title">
          Welcome to DCP Chess!
        </div>
        <div className="game-board">
          <ChessBoard
            board={pussy}
          />
        </div>
        <div className="game-info">
          <div>{"pussy status"}</div>
          <ol>{"More pussy shit"}</ol>
        </div>
        <br></br>
        <div className="dcp-info">
          
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

