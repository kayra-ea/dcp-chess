/**
 * This file houses the array representations of the chess board for the React front end. Not to be confused with the bitboard chess boards used for the engine calculations.
 *
 * @constant 
 */

const cnst = require('../common/constants.js');

/**
 *
 */
exports.board = function config$$board(args){
  let board = {};

  if (args === 'init'){
    board.squares = initializeBoard();
    board.colours = initializeColours();
  }
 
  return board;
}

/**
 *
 *
 */
function initializeBoard(){
  return [[cnst.BLACK_ROOK, cnst.BLACK_KNIGHT, cnst.BLACK_BISHOP, cnst.BLACK_QUEEN,cnst.BLACK_KING, cnst.BLACK_BISHOP,cnst.BLACK_KNIGHT, cnst.BLACK_ROOK],
              [cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN, cnst.BLACK_PAWN,],
              ['', '', '', '', '', '', '', ''],
              ['', '', '', '', '', '', '', ''],
              ['', '', '', '', '', '', '', ''],
              ['', '', '', '', '', '', '', ''],
              [cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN, cnst.WHITE_PAWN,],
              [cnst.WHITE_ROOK, cnst.WHITE_KNIGHT, cnst.WHITE_BISHOP, cnst.WHITE_QUEEN,cnst.WHITE_KING, cnst.WHITE_BISHOP,cnst.WHITE_KNIGHT, cnst.WHITE_ROOK]];
}

/**
 *
 *
 */
function initializeColours(){
  if (true) {
    return [
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
    ];
  } else if (false) {
    return [
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
    ];
  }
}
