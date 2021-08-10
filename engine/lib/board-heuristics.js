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
      if (j !== "") {
      }
    }
  }

  return 0;
};

/**
 *  @description      This function implements the sigmoid function. Not sure if it will be actually used.
 *
 *  @param {Number} p - The value to sigmoidify.
 */
function sigmoid(p) {
  return 1 / (1 + Math.pow(Math.E, -p));
}
