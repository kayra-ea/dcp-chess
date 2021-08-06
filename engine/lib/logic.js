/**
 * @file          logic.js
 * @description   This file houses all the logic for the chess game according to standard chess rules.
 * @summary       Contains all the logic for moving pieces around the board.
 *
 * @author        Kayra E-A, kayra@kingds.network, kayra@kayra.ca
 * @date          July 2021
 */

const cnst = require("../common/constants.js");

/**
 * This function takes a currently selected chess piece and moves it to the desired square, given that the desired square is within it's legal moveset.
 * @param {object} squares - 2D array of the chess board.
 * @param {object} selectedSquare - The x and y position of the piece being moved.
 * @param {Number} i - The x position of the square to move to.
 * @param {Number} y - The y position of the square to move to.
 */
exports.movePiece = function movePiece(
  squares,
  selectedSquare,
  prevSelectedSquare,
  reqStatus
) {
  let cpy_squares = squares.slice();
  let cpy_selectedSquare = Object.assign({}, selectedSquare);
  let cpy_prevSelectedSquare = Object.assign({}, prevSelectedSquare);
  const pieceToMove =
    cpy_squares[cpy_prevSelectedSquare.x][cpy_prevSelectedSquare.y];

  debugger;
  try {
    let allow = isLegalMove(
      cpy_squares,
      cpy_selectedSquare,
      cpy_prevSelectedSquare
    );

    if (allow === true) {
      console.log(`pieceToMove: `, pieceToMove);

      //assert(!(pieceToMove === ''), `Error - cannot move a non piece`);
      // move the piece
      cpy_squares[cpy_prevSelectedSquare.x][cpy_prevSelectedSquare.y] = "";
      cpy_squares[cpy_selectedSquare.x][cpy_selectedSquare.y] = pieceToMove;

      reqStatus = "SUCCESS";
    } else {
      reqStatus = "COULDNOTMOVE";
    }
  } catch (error) {
    reqStatus = "FAILED";
    console.error(`Error - Could not move Piece`);
  }

  return {
    squares: cpy_squares,
    reqStatus: reqStatus,
  };
};

/**
 * This function checks if the currently selected move is a legal move.
 * @param {Object} squares - 2D array of the chess board.
 * @param {Object} selectedSquare - The x and y position of the destination of the piece.
 * @param {Object} prevSelectedSquare - The x and y position of the piece being moved.
 */
function isLegalMove(squares, selectedSquare, prevSelectedSquare) {
  const piece = squares[prevSelectedSquare.x][prevSelectedSquare.y];
  let isLegalMove = false;

  switch (piece) {
    case cnst.WHITE_PAWN:
      break;

    case cnst.BLACK_PAWN:
      break;

    case cnst.WHITE_KNIGHT:
    case cnst.BLACK_KNIGHT:
      const moves = getKnightMoves(prevSelectedSquare.x, prevSelectedSquare.y);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_BISHOP:
    case cnst.BLACK_BISHOP:
      console.log("Trying Bishop moves.");
      console.log(
        "Get Bishop moves: ",
        getBishopMoves(
          selectedSquare.x,
          selectedSquare.y,
          cnst.WHITE_BISHOP,
          true
        )
      );

      break;

    case cnst.WHITE_ROOK:
    case cnst.BLACK_ROOK:
      break;

    case cnst.WHITE_QUEEN:
    case cnst.BLACK_QUEEN:
      break;

    case cnst.WHITE_KING:
    case cnst.BLACK_KING:
      break;

    default:
      isLegalMove = false;
      console.log("Selected EMPTY square...");
  }

  return isLegalMove;
}

/**
 * This fucntion validates the desired move as a legal move by checking if the desired move is within the legal moveset of the piece in question.
 *
 * @param {Object} moves - The array of objects with x and y points for the legal moves of the given piece.
 * @param {Number} i - The x coordinate of the desired move.
 * @param {Number} y - The y coordinate of the desired move.
 * @returns {Number} isValid: returns true if the desired move is within the legal moveset and false if it is not.
 */
function checkIfValid(moves, i, y) {
  let isValid = false;

  for (const entry of moves) {
    if (entry.x !== i && entry.y !== y) {
      isValid = true;
      break;
    }
  }

  return isValid;
}

function getKnightMoves(i, y) {
  return [
    { x: i - 2, y: y + 1 },
    { x: i - 1, y: y + 2 },
    { x: i + 1, y: y + 2 },
    { x: i + 2, y: y + 1 },
    { x: i + 2, y: y - 1 },
    { x: i + 1, y: y - 2 },
    { x: i - 1, y: y - 2 },
    { x: i - 2, y: y - 1 },
  ];
}

function getKingMoves(i, y, hasNotCastled) {
  let moves = [];

  moves.push(
    { x: i - 1, y: y + 1 },
    { x: i, y: y + 1 },
    { x: i + 1, y: y + 1 },
    { x: i + 1, y: y },
    { x: i + 1, y: y - 1 },
    { x: i, y: y - 1 },
    { x: i - 1, y: y - 1 },
    { x: i - 1, y: y }
  );

  if (hasNotCastled) {
    moves.push({ x: i + 2, y: y });
    moves.push({ x: i - 2, y: y });
  }

  return moves;
}

function getBishopMoves(i, y) {
  let moves = [];
  let p, q;

  for (p = i; p <= cnst.MAX_X; p++) {
    for (q = y; q <= cnst.MAX_Y; q++) {
      moves.push({ x: p, y: q });
    }
  }

  for (p = i; p <= cnst.MAX_X; p++) {
    for (q = y; q >= cnst.MIN_Y; q--) {
      moves.push({ x: p, y: q });
    }
  }

  for (p = i; p >= cnst.MIN_X; p--) {
    for (q = y; q >= cnst.MIN_Y; q--) {
      moves.push({ x: p, y: q });
    }
  }

  for (p = i; p >= cnst.MIN_X; p--) {
    for (q = y; q <= cnst.MAX_Y; q++) {
      moves.push({ x: p, y: q });
    }
  }

  return moves;
}

function getRookMoves(i, y) {
  let moves = [];
  let p;

  for (p = i; p <= cnst.MAX_X; p++) {
    moves.push({ x: p, y: y });
  }

  for (p = i; p >= cnst.MIN_X; p--) {
    moves.push({ x: p, y: y });
  }

  for (p = y; p <= cnst.MAX_Y; p++) {
    moves.push({ x: i, y: p });
  }

  for (p = y; p >= cnst.MIN_Y; p--) {
    moves.push({ x: i, y: p });
  }

  return moves;
}

function getQueenMoves(i, y) {
  let moves = [];

  moves.push(getRookMoves(i, y));
  moves.push(getBishopMoves(i, y));

  return moves;
}

function getPawnMoves(i, y, c, isFirstMove) {
  let moves = [];

  if (c === cnst.WHITE_PAWN) {
    moves.push({ x: i, y: y - 1 });
    if (isFirstMove) moves.push({ x: i, y: y - 2 });
  } else if (c === cnst.BLACK_PAWN) {
    moves.push({ x: i, y: y + 1 });
    if (isFirstMove) moves.push({ x: i, y: y + 2 });
  }

  return moves;
}
