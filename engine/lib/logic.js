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
  reqStatus,
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
  let moves = [];
  debugger;

  switch (piece) {
    case cnst.WHITE_PAWN:
      moves = getPawnMoves(prevSelectedSquare.x, prevSelectedSquare.y,cnst.WHITE_PAWN,true); //hardcoded to be every turn as first turn
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.BLACK_PAWN:
      moves = getPawnMoves(prevSelectedSquare.x, prevSelectedSquare.y,cnst.BLACK_PAWN,true); //hardcoded to be every turn as first turn
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_KNIGHT:
      moves = getKnightMoves(prevSelectedSquare.x, prevSelectedSquare.y);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_KNIGHT:
      moves = getKnightMoves(prevSelectedSquare.x, prevSelectedSquare.y);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_BISHOP:
      moves = getBishopMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.WHITE_BISHOP);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.BLACK_BISHOP:
      moves = getBishopMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.BLACK_BISHOP);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_ROOK:
      moves = getRookMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.WHITE_ROOK);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_ROOK:
      moves = getRookMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.BLACK_ROOK);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_QUEEN:
      moves = getQueenMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.WHITE_QUEEN);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_QUEEN:
      moves = getQueenMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.BLACK_QUEEN);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_KING:
      moves = getKingMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.WHITE_KING);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_KING:
      moves = getKingMoves(prevSelectedSquare.x, prevSelectedSquare.y, squares, cnst.BLACK_KING);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    default:
      isLegalMove = false;
      console.log("Selected EMPTY square...");
  }

  return isLegalMove;
}


/**
 * This fucntion returns as a string the colour of the piece.
 *
 * @param {Object} piece - the unicode string of the pioce
 * @returns {Boolean} getPieceTeam: returns white if the piece's string ends with a number, and black if a letter.
 */
function getPieceTeam(piece){
  let team;
  let pieceTypeCode;
  let uniChar;

     //for whatever reason, some chars come back as NAN without the leading h
     piece = 'h' + piece;
     uniChar = piece.charCodeAt(1).toString(16);
     uniChar = uniChar.toUpperCase();
     uniChar = "\\u0" + uniChar;
     piece = piece.charAt(0) + uniChar;
     pieceTypeCode = piece.charAt(7);
   
     //white pieces end with a number, black pieces end with a letter
     if (pieceTypeCode >= '0' && pieceTypeCode <= '9'){
       team = 'WHITE'
     }
     else{
         team = 'BLACK'
     }
  
     return team;
}

/**
 * This fucntion validates the desired move as a legal move by checking if the desired move is within the legal moveset of the piece in question.
 *
 * @param {Object} squares - The array of locations of pieces on the board
 * @returns {Boolean} isBlocking: returns true if the desired move is blocked by a piece on the selected square.
 */
function isBlocking(i, y, squares){
  if (squares[i][y] !== ""){ return true; }
  else return false;
}

function isBlockingOpp(i, y, squares, pieceType){
  let playerTeam = getPieceTeam(pieceType);
  let selectedTeam = getPieceTeam(squares[i][y])

  if (playerTeam !== selectedTeam){
    return true;
  }
  else{
    return false;;
  }
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
    if (entry.x === i && entry.y === y) {
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

function getKingMoves(i, y, squares, pieceType, hasNotCastled) {
  let moves = [];
  let prunedMovesList = [];
  if (pieceType === cnst.WHITE_KING){
    debugger;
  }

  let potentialMovesList = [
    { x: i - 1, y: y + 1 },
    { x: i, y: y + 1 },
    { x: i + 1, y: y + 1 },
    { x: i + 1, y: y },
    { x: i + 1, y: y - 1 },
    { x: i, y: y - 1 },
    { x: i - 1, y: y - 1 },
    { x: i - 1, y: y }
  ];

  //prune list for moves that go off the board and cause errors. We'll have to do this because unlike things like getBishopMoves etc. the king has hardcoded moves with no checks/restraints
  potentialMovesList.forEach(potentialMove => {
    if (potentialMove.x < cnst.MIN_X || potentialMove.x > cnst.MAX_X || potentialMove.y < cnst.MIN_Y || potentialMove.y > cnst.MAX_Y) {
      //do nothing because it is outside board constraints
    }
    else {
      //otherwise its within restraints, so add it pruned list
      prunedMovesList.push(potentialMove);
    }
  });

  prunedMovesList.forEach(prunedMove => {
    if (pieceType === cnst.WHITE_KING) {
    }
    if (isBlocking(prunedMove.x, prunedMove.y, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(prunedMove.x, prunedMove.y, squares, pieceType)) {
        moves.push({ x: prunedMove.x, y: prunedMove.y });
      }
      else {
        // otherwise dont add to moves list
      }
    }

    else {
      moves.push({ x: prunedMove.x, y: prunedMove.y });
    }
  });

  //TO DO ------------------------ WE STILL NEED TO ADD CASTLING
  // if (hasNotCastled) {
  //   moves.push({ x: i + 2, y: y });
  //   moves.push({ x: i - 2, y: y });
  // }

  return moves;
}

function getBishopMoves(i, y, squares, pieceType) {
  let moves = [];
  let tempi, tempy, q;

  //upward right diagonal
  tempi = i;
  tempy = y;
  for (q = y; q <= cnst.MAX_Y - 1; q++ ) {
      tempi = tempi - 1;
      tempy = tempy + 1;
      
      if (tempi < cnst.MIN_Y || tempi > cnst.MAX_X || tempy < cnst.MIN_Y || tempy > cnst.MAX_Y){
        break;
    }

  //first check if a piece is blocking
  if (isBlocking(tempi, tempy, squares)){

    //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
    if (isBlockingOpp(tempi, tempy, squares, pieceType)){
      moves.push({ x: tempi, y: tempy });
      break;
    }

    else {
      // otherwise dont add move and break loop
      break;
    }
  }

  else {
    moves.push({ x: tempi, y: tempy });
  }

}

  //upward left diagonal
  tempi = i;
  tempy = y;
  for (q = y; q >= cnst.MIN_Y - 1; q--) {
    tempi = tempi - 1;
    tempy = tempy - 1;

    if (tempi < cnst.MIN_Y || tempi > cnst.MAX_X || tempy < cnst.MIN_Y || tempy > cnst.MAX_Y) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      }

      else {
        // otherwise dont add move and break loop
        break;
      }
    }

    else {
      moves.push({ x: tempi, y: tempy });
    }

  }

  //downward right diagonal
  tempi = i;
  tempy = y;
  for (q = y; q <= cnst.MAX_Y - 1; q++) {
    tempi = tempi + 1;
    tempy = tempy + 1;

    if (tempi < cnst.MIN_Y || tempi > cnst.MAX_X || tempy < cnst.MIN_Y || tempy > cnst.MAX_Y) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      }

      else {
        // otherwise dont add move and break loop
        break;
      }
    }

    else {
      moves.push({ x: tempi, y: tempy });
    }

  }
  //downward left diagonal
  tempi = i;
  tempy = y;
  for (q = y; q >= cnst.MIN_Y - 1; q--) {
    tempi = tempi + 1;
    tempy = tempy - 1;

    if (tempi < cnst.MIN_Y || tempi > cnst.MAX_X || tempy < cnst.MIN_Y || tempy > cnst.MAX_Y) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      }

      else {
        // otherwise dont add move and break loop
        break;
      }
    }

    else {
      moves.push({ x: tempi, y: tempy });
    }

  }

  return moves;
}

function getRookMoves(i, y, squares, pieceType) {
  let moves = [];
  let p;

  //downward movement
  for (p = i + 1; p <= cnst.MAX_X; p++) {

  //first check if a piece is blocking
  if (isBlocking(p, y, squares)){

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(p, y, squares, pieceType)){
        moves.push({ x: p, y: y });
        break;
      }
      else {
        // otherwise dont add move and break loop
        break;
      }
    }
  else {
    moves.push({ x: p, y: y });
    }
  }

  //upward movement
  for (p = i - 1; p >= cnst.MIN_X; p--) {

    //first check if a piece is blocking
    if (isBlocking(p, y, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(p, y, squares, pieceType)) {
        moves.push({ x: p, y: y });
        break;
      }
      else {
        // otherwise dont add move and break loop
        break;
      }
    }
    else {
      moves.push({ x: p, y: y });
    }
  }

  // movement to the right
  for (p = y + 1; p <= cnst.MAX_Y; p++) {

    //first check if a piece is blocking
    if (isBlocking(i, p, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(i, p, squares, pieceType)) {
        moves.push({ x: i, y: p });
        break;
      }
      else {
        // otherwise dont add move and break loop
        break;
      }
    }
    else {
      moves.push({ x: i, y: p });
    }
  }

  //movement to the left
  for (p = y - 1; p >= cnst.MIN_Y; p--) {
    //first check if a piece is blocking
    if (isBlocking(i, p, squares)) {

      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(i, p, squares, pieceType)) {
        moves.push({ x: i, y: p });
        break;
      }
      else {
        // otherwise dont add move and break loop
        break;
      }
    }
    else {
      moves.push({ x: i, y: p });
    }
  }

  return moves;
}

function getQueenMoves(i, y, squares, pieceType) {
  let moves = [];

  let rookMoves = getRookMoves(i, y, squares, pieceType);
  let bishMoves = getBishopMoves(i ,y, squares, pieceType);
  moves = rookMoves.concat(bishMoves);

  return moves;
}

function getPawnMoves(i, y, c, isFirstMove) {
  let moves = [];

  if (c === cnst.WHITE_PAWN) {
    moves.push({ x: i - 1, y: y });
    if (isFirstMove) moves.push({ x: i - 2, y: y });
  } else if (c === cnst.BLACK_PAWN) {
    moves.push({ x: i, y: y + 1 });
    if (isFirstMove) moves.push({ x: i, y: y + 2 });
  }

  return moves;
}
