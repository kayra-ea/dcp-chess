/**
 * @file            engine.js
 * @description     This file will contain all the functions for the chess AI engine code. The engine will execute minimax, alpha beta pruning and return the board.
 * @summary
 *
 * @author          Kayra E-A
 * @date            August 2021
 *
 */

const logic = require("./logic");

exports.engineMove = function engineMove(moveType, squares, args, reqStatus) {
  let cpy_squares = squares.slice();

  switch(moveType){
    case "randomMove":
      cpy_squares = randomMove(squares, "BLACK");
      reqStatus = "SUCCESS";
      break;

    case "miniMax":
      cpy_squares = miniMax(squares, 5, true);
      reqStatus = "SUCCESS";
      break;

    case "abPruning":
      cpy_sqauares = abPruning(squares, 10, a, b, true);
      reqStatus = "SUCCESS";
      break;

    default:
      console.error("Not valid engine move");
      reqStatus = "FAILED";
      break;

  }
  
  return {
    squares: cpy_squares,
    reqStatus: reqStatus,
  };

};

/**
 *  @description This function makes a random move for the chess engine.
 */ 
function randomMove(squares, team){
  let cpy_squares = squares.slice();
  
  let allmoves = logic.getAllMoves(cpy_squares, team);

  let random1 = Math.floor(Math.random() * allmoves.length);
  let move = allmoves[random1].moves;


  let random2 = Math.floor(Math.random() * move.length);

  let damove = move[random2];
 

  console.log("damove: ", damove);
  let pieceToMove = allmoves[random1].piece;
  let pieceX = allmoves[random1].pos.x;
  let pieceY = allmoves[random1].pos.y;

  //now move da piece to dat square.
  
  cpy_squares[pieceX][pieceY] = "";
  cpy_squares[damove.x][damove.y] = pieceToMove;

  return cpy_squares;
}


/**
 *  @description  Implements the minimax algorithm in the context of a chess engine. The board argument is the same 2d array for chars that represents a node of the minimax search tree.
 *
 *  @param
 *  @param
 */
function miniMax(board, depth, isEngineTurn) {
  if (depth === 0) {
    return logic.getBoardValue(board);
  }

  let moves = logic.getAllMoves();

  let value;
  if (isEngineTurn) {
    value = Number.MIN_SAFE_INTEGER;
    moves.forEach((element) => {
      value = max(value, miniMax(element, depth - 1, false));
    });
    return value;
  } else {
    //minimizing the user's turn
    value = Number.MAX_SAFE_INTEGER;
    moves.forEach((element) => {
      value = min(value, miniMax(element, depth - 1, true));
    });
    return value;
  }

  // function minimax(node, depth, maximizingPlayer) is
  //     if depth = 0 or node is a terminal node then
  //         return the heuristic value of node
  //     if maximizingPlayer then
  //         value := −∞
  //         for each child of node do
  //             value := max(value, minimax(child, depth − 1, FALSE))
  //         return value
  //     else (* minimizing player *)
  //         value := +∞
  //         for each child of node do
  //             value := min(value, minimax(child, depth − 1, TRUE))
  //         return value
}

/**
 *  @description    This function implements the minimax algorithm with alpha-beta pruning.
 *
 * @param
 * @param
 */
function abPruning(board, depth, a, b, isEngineTurn) {
  if (depth === 0) {
    return logic.getBoardValue(board);
  }

  let moves = logic.getAllMoves(board);

  let value;
  if (isEngineTurn) {
    value = Number.MIN_SAFE_INTEGER;
    moves.forEach((element) => {
      value = max(value, abPruning(element, depth - 1, a, b, false));
      if (value >= b) {
        break;
      }
      a = max(a, value);
    });
    return value;
  } else {
    //minimizing the dduser's turn
    value = Number.MAX_SAFE_INTEGER;
    moves.forEach((element) => {
      value = min(value, abPruning(element, depth - 1, a, b, true));
      if (value <= a){
        break;
      }
      b = min(b, value);
    });
    return value;
  }

  // function alphabeta(node, depth, α, β, maximizingPlayer) is
  //     if depth = 0 or node is a terminal node then
  //         return the heuristic value of node
  //     if maximizingPlayer then
  //         value := −∞
  //         for each child of node do
  //             value := max(value, alphabeta(child, depth − 1, α, β, FALSE))
  //             if value ≥ β then
  //                 break (* β cutoff *)
  //             α := max(α, value)
  //         return value
  //     else
  //         value := +∞
  //         for each child of node do
  //             value := min(value, alphabeta(child, depth − 1, α, β, TRUE))
  //             if value ≤ α then
  //                 break (* α cutoff *)
  //             β := min(β, value)
  //         return value
}
