/**
 *  @file           board-heuristics.js
 *  @description    This file houses the chess board heursitic algorithms.
 *  @summary
 *
 *
 *  @author          Kayra E-A, kayra@kingsds.network, kayra@kayra.ca
 *  @date            August 2021
 *
 *
 */

const cnst = require("../common/constants.js");

/**
 *  @description    This function returns the value of any given chess board.
 *
 *  @param {Object} board - The 2d array of squares with pieces.
 */
exports.getBoardValue = function getBoardValue(board) {
  let value = 0;

  // 1. Tally up the values of all the pieces
  for (let i of board) {
    for (let j of i) {
      switch (j) {
        case cnst.BLACK_PAWN:
          value -= cnst.PAWN_VALUE;
          break;
        case cnst.WHITE_PAWN:
          value += cnst.PAWN_VALUE;
          break;

        case cnst.BLACK_KNIGHT:
          value -= cnst.KNIGHT_VALUE;
          break;
        case cnst.WHITE_KNIGHT:
          value += cnst.KNIGHT_VALUE;
          break;

        case cnst.BLACK_BISHOP:
          value -= cnst.BISHOP_VALUE;
          break;
        case cnst.WHITE_BISHOP:
          value += cnst.BISHOP_VALUE;
          break;

        case cnst.BLACK_ROOK:
          value -= cnst.ROOK_VALUE;
          break;
        case cnst.WHITE_ROOK:
          value += cnst.ROOK_VALUE;
          break;

        case cnst.BLACK_QUEEN:
          value -= cnst.QUEEN_VALUE;
          break;
        case cnst.WHITE_QUEEN:
          value += cnst.QUEEN_VALUE;
          break;
      }
    }
  }
  // 2. King is castled

  // 3. King is in check

  // 4. Space controlled by all pieces.

  // 5. Pieces under direct attack

  // 6. Knight is in central position
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let piece = null;
      if (board[i][j] === "") {
        continue;
      } else {
        piece = board[i][j];
      }

      if (piece !== cnst.WHITE_KNIGHT && piece !== cnst.BLACK_KNIGHT) {
        continue;
      } else if (piece === cnst.WHITE_KNIGHT) {
        if (i > 1 && i < 6 && j > 1 && j < 6) {
          value += 5;
        }
      } else if (piece === cnst.BLACK_KNIGHT) {
        if (i > 1 && i < 6 && j > 1 && j < 6) {
          value -= 5;
        }
      }
    }
  }

  return value;
};

/**
 *  @description      This function implements the sigmoid function. Not sure if it will be actually used.
 *
 *  @param {Number} p - The value to sigmoidify.
 */
function sigmoid(p) {
  return 1 / (1 + Math.pow(Math.E, -p));
}
