/**
 * @file board.js
 *
 * @overview sdaf
 * @description
 *
 * This file houses the array representations of the chess board for the React front end. Not to be confused with the bitboard chess boards used for the engine calculations.
 *
 * @author  Kayra E-A, kayra@kingsds.network, kayra@kayra.ca
 * @date    July 2021
 *
 * @constant
 */

const cnst = require("../common/constants.js");

exports.board = function () {
  return {
    squares: [
      [
        cnst.BLACK_ROOK,
        cnst.BLACK_KNIGHT,
        cnst.BLACK_BISHOP,
        cnst.BLACK_KING,
        cnst.BLACK_QUEEN,
        cnst.BLACK_BISHOP,
        cnst.BLACK_KNIGHT,
        cnst.BLACK_ROOK,
      ],
      [
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
        cnst.BLACK_PAWN,
      ],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      [
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
        cnst.WHITE_PAWN,
      ],
      [
        cnst.WHITE_ROOK,
        cnst.WHITE_KNIGHT,
        cnst.WHITE_BISHOP,
        cnst.WHITE_QUEEN,
        cnst.WHITE_KING,
        cnst.WHITE_BISHOP,
        cnst.WHITE_KNIGHT,
        cnst.WHITE_ROOK,
      ],
    ],

    colours: [
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
      [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
      [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
    ],
  };
};

/*exports.board = {};

exports.board.squares = [
  [
    cnst.BLACK_ROOK,
    cnst.BLACK_KNIGHT,
    cnst.BLACK_BISHOP,
    cnst.BLACK_KING,
    cnst.BLACK_QUEEN,
    cnst.BLACK_BISHOP,
    cnst.BLACK_KNIGHT,
    cnst.BLACK_ROOK,
  ],
  [
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
    cnst.BLACK_PAWN,
  ],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
    cnst.WHITE_PAWN,
  ],
  [
    cnst.WHITE_ROOK,
    cnst.WHITE_KNIGHT,
    cnst.WHITE_BISHOP,
    cnst.WHITE_QUEEN,
    cnst.WHITE_KING,
    cnst.WHITE_BISHOP,
    cnst.WHITE_KNIGHT,
    cnst.WHITE_ROOK,
  ],
];

exports.board.colours = [
  [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
  [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
  [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
  [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
  [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
  [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
  [cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l],
  [cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d, cnst.l, cnst.d],
];

*/
