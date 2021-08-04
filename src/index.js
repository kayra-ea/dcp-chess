/**
 *  @file       index.js
 *  @overview   This file is the entry point for the DCP chess demo using React. All of the React related code is located in this file, which communicates to the chess engine back-end.
 *
 *  @description asdf....
 *
 *  @author     Kayra E-A, kayra@kingsds.network, kayra@kayra.ca
 *  @date       July 2021
 *
 */


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const { board } = require('./lib/board.js');
const logic = require('./lib/logic.js');
const bp = board('init');

/**
 *  @description    - This is a funciton compoment thats returns an HTML button object that describes a square on the chess board.
 *                  - Note this component does not keep track of the board state, therefore it can be implemented as a function component and not a React component.
 *
 *
 *  @param {Object} props - React component properties.
 *  @returns <button>  - returns a JSX button, to be rendered by React.
 */
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

/**
 *  @description    - This React component ...
 *
 *  @param {Object} props - The React componenet properties object.
 *  @returns <div>
 */
class ChessBoard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      functionCall: null,
      functionCallArgs: null,
      squares: this.props.board.squares,
      colour: this.props.board.colours,
      selectedSquare: { x: null, y: null },
      prevSelectedSquare: { x: null, y: null },
      pieceIsSelected: false,
      isPlayerTurn: true,
    };
  }

  callEngineAPI(state) {
    let msg = {};
    msg.state = Object.assign({}, state);
    msg.msgStatus = {
      reqStatus: null,
      reqStatusCode: NaN,
    };

    fetch("http://localhost:9000/engineAPI", { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msg)
    })
      .then(response => response.json())
      .then(response => {
        console.log("GOT THE RESPONSE: ");
        console.log((response));
        // this.setState({ apiResponse: JSON.stringify(response) });
      })
      .catch(err => console.log(err));
  }

  /*componentDidMount() {
    this.callEngineAPI();
  }*/

  resetColour() {
    return board('init').colours;
  }

  handleClick(i, y) {
    let state = Object.assign({}, this.state);
  
    //mark the previous and current selected square
    state.prevSelectedSquare = Object.assign({}, state.selectedSquare);
    state.selectedSquare = { x: i, y: y };

    //highlight the selected square;
    state.colour[i][y] = 'sq-selected';

    // If a piece was previously selected, try to move the piece to the current square.
    if (state.pieceIsSelected) {
      state.functionCall = 'movePiece';
      state.functionCallArgs = {
        squares: state.squares,
        selectedSquare: state.selectedSquare, // the square to move to.
        prevSelectedSquare: state.prevSelectedSquare, //the square to move from.
      };

      this.callEngineAPI(state);
    }

    // Determine wether a new piece is selected
    if (state.squares[i][y] !== '') {
      state.pieceIsSelected = true;
    } else {
      state.pieceIsSelected = false;
    }
   
    

   // console.log(i, " : ", y);
   // console.log(state);

    this.setState(state);

    /*const squares = this.state.squares.slice(); //shallow copy
    const colour = this.resetColour(); //shallow copy
    let pieceIsSelected = this.state.pieceIsSelected;
  
    
    if (squares[i][y] !== ''){
      pieceIsSelected = true;
    } else {
      pieceIsSelected = false;
    }

    colour[i][y] = 'sq-selected';
   
    if (this.state.pieceIsSelected) {
      state.functionCall = 'movePiece';
      state.functionCallArgs = {
        squares: state.squares,
        selectedSquare: state.selectedSquare,
        i: i,
        y: y,
      }

      this.callEngineAPI(state);
      //logic.movePiece(this.state.squares, this.state.selectedSquare, i, y);
    } 

    this.setState({
      squares: squares,
      colour: colour, 
      selectedSquare: {x: i, y: y},
      pieceIsSelected: pieceIsSelected,
      isPlayerTurn: true,
    });
    */
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

/**
 *  @description  asdasdf
 *
 *  
 *
 */ 
class Game extends React.Component {
  /*constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  } */
  
  /*callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => console.log(err));

    fetch("http://localhost:9000/engineAPI", { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(response => { 
        this.setState({ apiResponse: JSON.stringify(response) });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.callAPI();
  }*/

  render() {
    return (
      <div className="game">
        <div className="title">
          Welcome to DCP Chess!
        </div>
        <div className="game-board">
          <ChessBoard
            board={bp}
          />
        </div>
        <div className="game-info">
          <div>{"TEST"}</div>
          <ol>{"Some Tesing"}</ol>
          <ol>{"More Testing"}</ol>
        </div>
        <br></br>
        <div className="dcp-info">
          
        </div>
      </div>
    );
  }
}

// ========================================

/**
 *  @description 
 *
 */ 
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

