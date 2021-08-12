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

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const { board } = require("./lib/board.js");

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
    <button className={props.colour} onClick={props.onClick}>
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
  constructor(props) {
    super(props);
    this.state = {
      squares: this.props.board.squares,
      colour: this.props.board.colours,
      selectedSquare: { x: null, y: null },
      prevSelectedSquare: { x: null, y: null },
      pieceIsSelected: false,
      isPlayerTurn: true,
    };

    this.functionCall = null;
    this.functionCallArgs = null;
  }

  cleanUpState(state) {
    state.colour = board().colours;

    //reset selected pieces
    state.pieceIsSelected = false;
    state.prevSelectedSquare.x = null;
    state.prevSelectedSquare.y = null;
    state.selectedSquare.x = null;
    state.selectedSquare.y = null;

    return state;
  }

  callEngineAPI(state, functionCall, functionCallArgs) {
    let msg = {};
    msg.state = Object.assign({}, state);
    msg.reqStatus = null;

    msg.functionCall = functionCall;
    msg.functionCallArgs = functionCallArgs;

    fetch("http://localhost:9000/engineAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("GOT THE RESPONSE: ");
        console.log(response.state);
        console.log(response.reqStatus);

        response.state = this.cleanUpState(response.state);
        this.setState(response.state);
        this.handleResponse();
      })
      .catch((err) => console.log(err));
  }

  handleResponse() {
    let state = Object.assign({}, this.state);

    if (state.isPlayerTurn === false) {
      console.log("Making Engine move now:");
      let functionCall = "playAITurn";
      let functionCallArgs = {
        moveType: "randomMove",
        squares: state.squares,
        args: {},
      };

      console.log("state: ", state);
      console.log("functionCall: ", functionCall);
      console.log("functionCallArgs: ", functionCallArgs);

      this.callEngineAPI(state, functionCall, functionCallArgs);
    }
  }

  handleClick(i, y) {
    let state = Object.assign({}, this.state);
    let functionCall = this.functionCall;
    let functionCallArgs = this.functionCallArgs;

    //check to make sure they haven't selected a square without first selecting a piece
    if (state.pieceIsSelected === false && state.squares[i][y] === "") {
      return state;
    }

    //mark the previous and current selected square
    state.prevSelectedSquare = Object.assign({}, state.selectedSquare);
    state.selectedSquare = { x: i, y: y };

    //highlight the selected square;
    state.colour = board().colours.slice();
    state.colour[i][y] = "sq-selected";

    // If a piece was previously selected, try to move the piece to the current square
    if (state.pieceIsSelected) {
      functionCall = "movePiece";
      functionCallArgs = {
        squares: state.squares,
        selectedSquare: state.selectedSquare, // the square to move to.
        prevSelectedSquare: state.prevSelectedSquare, //the square to move from.
        isPlayerTurn: state.isPlayerTurn,
      };

      this.callEngineAPI(state, functionCall, functionCallArgs);
    }

    let prevX = state.prevSelectedSquare.x;
    let prevY = state.prevSelectedSquare.y;

    if (prevX === null && prevY === null) {
      prevX = state.selectedSquare.x;
      prevY = state.selectedSquare.y;
    }

    // Determine wether a new piece is selected
    if (state.squares[prevX][prevY] !== "") {
      state.pieceIsSelected = true;
    } else {
      state.pieceIsSelected = false;
    }

    this.setState(state);
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
    const player = this.state.isPlayerTurn ? "WHITE" : "BLACK";
    const status = `Next player: ${player}`;

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
  render() {
    return (
      <div className="game">
        <div className="title">Welcome to DCP Chess!</div>
        <div className="game-board">
          <ChessBoard board={board()} />
        </div>
        <div className="game-info">
          <div>{"TEST"}</div>
          <ol>{"Some Tesing"}</ol>
          <ol>{"More Testing"}</ol>
        </div>
        <br></br>
        <div className="dcp-info"></div>
      </div>
    );
  }
}

// ========================================

/**
 *  @description
 *
 */
ReactDOM.render(<Game />, document.getElementById("root"));
