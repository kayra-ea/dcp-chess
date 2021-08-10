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

    test = getAllMoves(squares,'BLACK');
    console.log('Moves for Black team', test);
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
    console.error(error);
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
  let pawnFirstMove;

  switch (piece) {
    case cnst.WHITE_PAWN:
      pawnFirstMove = isFirstPawnMove(cnst.WHITE_PAWN, prevSelectedSquare.x);
      moves = getPawnMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_PAWN,
        pawnFirstMove
      );
      console.log("Getting WHITE pawn moves!!!!");
      console.log(`The moves the WHITE pawn can make are: `, moves);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.BLACK_PAWN:
      pawnFirstMove = isFirstPawnMove(cnst.BLACK_PAWN, prevSelectedSquare.x);
      moves = getPawnMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_PAWN,
        pawnFirstMove
      );
      console.log("Getting BLACK pawn moves!!!!");
      console.log(`The moves the BLACK pawn can make are: `, moves);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_KNIGHT:
      moves = getKnightMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_KNIGHT
      );
      // console.log("Getting WHITE knight moves!!!!");
      // console.log(`The moves the WHITE knight can make are: `, moves);
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_KNIGHT:
      moves = getKnightMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_KNIGHT
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_BISHOP:
      moves = getBishopMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_BISHOP
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.BLACK_BISHOP:
      moves = getBishopMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_BISHOP
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_ROOK:
      moves = getRookMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_ROOK
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_ROOK:
      moves = getRookMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_ROOK
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_QUEEN:
      moves = getQueenMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_QUEEN
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_QUEEN:
      moves = getQueenMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_QUEEN
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_KING:
      moves = getKingMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_KING
      );
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;
    case cnst.BLACK_KING:
      moves = getKingMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.BLACK_KING
      );
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
function getPieceTeam(piece) {
  let team;
  let pieceTypeCode;
  let uniChar;

  //for whatever reason, some chars come back as NAN without the leading h
  piece = "h" + piece;
  uniChar = piece.charCodeAt(1).toString(16);
  uniChar = uniChar.toUpperCase();
  uniChar = "\\u0" + uniChar;
  piece = piece.charAt(0) + uniChar;
  pieceTypeCode = piece.charAt(7);

  //white pieces end with a number, black pieces end with a letter
  if (pieceTypeCode >= "0" && pieceTypeCode <= "9") {
    team = "WHITE";
  } else {
    team = "BLACK";
  }

  return team;
}

/**
 * This fucntion validates the desired move as a legal move by checking if the desired move is within the legal moveset of the piece in question.
 *
 * @param {Object} squares - The array of locations of pieces on the board
 * @returns {Boolean} isBlocking: returns true if the desired move is blocked by a piece on the selected square.
 */
function isBlocking(i, y, squares) {
  if (squares[i][y] !== "") {
    return true;
  } else return false;
}

function isBlockingOpp(i, y, squares, pieceType) {
  let playerTeam = getPieceTeam(pieceType);
  let selectedTeam = getPieceTeam(squares[i][y]);

  if (playerTeam !== selectedTeam) {
    return true;
  } else {
    return false;
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

function getKnightMoves(i, y, squares, pieceType) {
  debugger;
  let moves = [];
  let prunedMovesList = [];

  let potentialMovesList = [
    { x: i - 2, y: y + 1 },
    { x: i - 1, y: y + 2 },
    { x: i + 1, y: y + 2 },
    { x: i + 2, y: y + 1 },
    { x: i + 2, y: y - 1 },
    { x: i + 1, y: y - 2 },
    { x: i - 1, y: y - 2 },
    { x: i - 2, y: y - 1 },
  ];

  //prune list for moves that go off the board and cause errors.
  potentialMovesList.forEach((potentialMove) => {
    if (
      potentialMove.x < cnst.MIN_X ||
      potentialMove.x > cnst.MAX_X ||
      potentialMove.y < cnst.MIN_Y ||
      potentialMove.y > cnst.MAX_Y
    ) {
      //do nothing because it is outside board constraints
    } else {
      //otherwise its within restraints, so add it pruned list
      prunedMovesList.push(potentialMove);
    }
  });

  debugger;
  prunedMovesList.forEach((prunedMove) => {
    if (isBlocking(prunedMove.x, prunedMove.y, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(prunedMove.x, prunedMove.y, squares, pieceType)) {
        moves.push({ x: prunedMove.x, y: prunedMove.y });
      } else {
        // otherwise dont add to moves list
      }
    } else {
      moves.push({ x: prunedMove.x, y: prunedMove.y });
    }
  });

  debugger;
  return moves;
}

function getKingMoves(i, y, squares, pieceType, hasNotCastled) {
  let moves = [];
  let prunedMovesList = [];

  let potentialMovesList = [
    { x: i - 1, y: y + 1 },
    { x: i, y: y + 1 },
    { x: i + 1, y: y + 1 },
    { x: i + 1, y: y },
    { x: i + 1, y: y - 1 },
    { x: i, y: y - 1 },
    { x: i - 1, y: y - 1 },
    { x: i - 1, y: y },
  ];

  //prune list for moves that go off the board and cause errors. We'll have to do this because unlike things like getBishopMoves etc. the king has hardcoded moves with no checks/restraints
  potentialMovesList.forEach((potentialMove) => {
    if (
      potentialMove.x < cnst.MIN_X ||
      potentialMove.x > cnst.MAX_X ||
      potentialMove.y < cnst.MIN_Y ||
      potentialMove.y > cnst.MAX_Y
    ) {
      //do nothing because it is outside board constraints
    } else {
      //otherwise its within restraints, so add it pruned list
      prunedMovesList.push(potentialMove);
    }
  });

  prunedMovesList.forEach((prunedMove) => {
    if (isBlocking(prunedMove.x, prunedMove.y, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(prunedMove.x, prunedMove.y, squares, pieceType)) {
        moves.push({ x: prunedMove.x, y: prunedMove.y });
      } else {
        // otherwise dont add to moves list
      }
    } else {
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
  for (q = y; q <= cnst.MAX_Y - 1; q++) {
    tempi = tempi - 1;
    tempy = tempy + 1;

    if (
      tempi < cnst.MIN_Y ||
      tempi > cnst.MAX_X ||
      tempy < cnst.MIN_Y ||
      tempy > cnst.MAX_Y
    ) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
      moves.push({ x: tempi, y: tempy });
    }
  }

  //upward left diagonal
  tempi = i;
  tempy = y;
  for (q = y; q >= cnst.MIN_Y - 1; q--) {
    tempi = tempi - 1;
    tempy = tempy - 1;

    if (
      tempi < cnst.MIN_Y ||
      tempi > cnst.MAX_X ||
      tempy < cnst.MIN_Y ||
      tempy > cnst.MAX_Y
    ) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
      moves.push({ x: tempi, y: tempy });
    }
  }

  //downward right diagonal
  tempi = i;
  tempy = y;
  for (q = y; q <= cnst.MAX_Y - 1; q++) {
    tempi = tempi + 1;
    tempy = tempy + 1;

    if (
      tempi < cnst.MIN_Y ||
      tempi > cnst.MAX_X ||
      tempy < cnst.MIN_Y ||
      tempy > cnst.MAX_Y
    ) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
      moves.push({ x: tempi, y: tempy });
    }
  }
  //downward left diagonal
  tempi = i;
  tempy = y;
  for (q = y; q >= cnst.MIN_Y - 1; q--) {
    tempi = tempi + 1;
    tempy = tempy - 1;

    if (
      tempi < cnst.MIN_Y ||
      tempi > cnst.MAX_X ||
      tempy < cnst.MIN_Y ||
      tempy > cnst.MAX_Y
    ) {
      break;
    }

    //first check if a piece is blocking
    if (isBlocking(tempi, tempy, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(tempi, tempy, squares, pieceType)) {
        moves.push({ x: tempi, y: tempy });
        break;
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
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
    if (isBlocking(p, y, squares)) {
      //if there is a block, check if oppenent or own piece. if oppon, add the move and break loop
      if (isBlockingOpp(p, y, squares, pieceType)) {
        moves.push({ x: p, y: y });
        break;
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
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
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
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
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
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
      } else {
        // otherwise dont add move and break loop
        break;
      }
    } else {
      moves.push({ x: i, y: p });
    }
  }

  return moves;
}

function getQueenMoves(i, y, squares, pieceType) {
  let moves = [];

  let rookMoves = getRookMoves(i, y, squares, pieceType);
  let bishMoves = getBishopMoves(i, y, squares, pieceType);
  moves = rookMoves.concat(bishMoves);

  return moves;
}

/**
 * @description     This function gets all the moves for a pawn. Note the relative directions for the pawn moves are hardcoded.
 *                  TODO: add diagonal moves for capturing a piece with the pawn.
 *
 */
function getPawnMoves( i, y, squares, c, isFirstMove) {
  let moves = [];
  let cpy_squares = squares.slice();

  try {
    if (c === cnst.WHITE_PAWN) {
      //check if there is a piece directly in front of the pawn.
      if (cpy_squares[i - 1][y] === "" && cpy_squares[i - 1][y] !== undefined) {
        moves.push({ x: i - 1, y: y });
      }

      if (
        cpy_squares[i - 1][y + 1] !== "" &&
        cpy_squares[i - 1][y + 1] !== undefined
      ) {
        //check if the piece is the opponent
        if (getPieceTeam(cpy_squares[i - 1][y + 1]) === "BLACK") {
          moves.push({ x: i - 1, y: y + 1 });
        }
      }

      if (
        cpy_squares[i - 1][y - 1] !== "" &&
        cpy_squares[i - 1][y - 1] !== undefined
      ) {
        //check if the piece is the opponent
        if (getPieceTeam(cpy_squares[i - 1][y - 1]) === "BLACK") {
          moves.push({ x: i - 1, y: y - 1 });
        }
      }

      if (isFirstMove) {
        //check if a piece is blocking the way.
        if (cpy_squares[i - 1][y] === "" && cpy_squares[i - 2][y] === "") {
          moves.push({ x: i - 2, y: y });
        }
      }
    } else if (c === cnst.BLACK_PAWN) {
      //check if there is a piece directly in front of the pawn.
      if (cpy_squares[i + 1][y] === "" && cpy_squares[i + 1][y] !== undefined) {
        moves.push({ x: i + 1, y: y });
      }

      if (
        cpy_squares[i + 1][y + 1] !== "" &&
        cpy_squares[i + 1][y + 1] !== undefined
      ) {
        //check if the piece is the opponent
        if (getPieceTeam(cpy_squares[i + 1][y + 1]) === "WHITE") {
          moves.push({ x: i + 1, y: y + 1 });
        }
      }

      if (
        cpy_squares[i + 1][y - 1] !== "" &&
        cpy_squares[i + 1][y - 1] !== undefined
      ) {
        //check if the piece is the opponent
        if (getPieceTeam(cpy_squares[i + 1][y - 1]) === "WHITE") {
          moves.push({ x: i + 1, y: y - 1 });
        }
      }

      if (isFirstMove) {
        //check if a piece is blocking the way.
        if (cpy_squares[i + 1][y] === "" && cpy_squares[i + 2][y] === "") {
          moves.push({ x: i + 2, y: y });
        }
      }
    }
  } catch (error) {
    console.error(
      `Error in getting pawn moves, can be discarded silently\n`
      /* error*/
    );
  }

  return moves;
}

/**
 *  @description    This function returns true if the pawn has not moved yet, and false if it has already moved.
 *                  This has been hard coded assuming that the white pieces are on the bottom of the board (row 6).
 *                  TODO: If we implement variable board configuration (the player can play as either black or white, we need to check for the appropriate row.)
 *                  For now we assume that white pawns must be on row 6, and that black pawns must be on row 1 for them not to have moved.
 */
function isFirstPawnMove(pawnColor, x) {
  if (pawnColor === cnst.WHITE_PAWN) {
    if (x !== 6) {
      return false;
    } else {
      return true;
    }
  } else if (pawnColor === cnst.BLACK_PAWN) {
    if (x !== 1) {
      return false;
    } else {
      return true;
    }
  } else {
    throw new Error(`Not a pawn being selected for isFirstPawnMove`);
  }
}

function getAllPieceMoves(i, y, squares, piece) {
  pieceType = getPieceTeam(piece);
  let moves = [];

  switch (piece) {
    case cnst.WHITE_PAWN:
      pawnFirstMove = isFirstPawnMove(cnst.WHITE_PAWN, i);
      moves = getPawnMoves(i, y, squares, cnst.WHITE_PAWN, pawnFirstMove);
      break;

    case cnst.BLACK_PAWN:
      pawnFirstMove = isFirstPawnMove(cnst.BLACK_PAWN, i);
      moves = getPawnMoves(i, y, squares, cnst.BLACK_PAWN, pawnFirstMove);
      break;

    case cnst.WHITE_KNIGHT:
      moves = getKnightMoves(i, y, squares, pieceType);
      break;

    case cnst.BLACK_KNIGHT:
      moves = getKnightMoves(i, y, squares, pieceType);
      break;

    case cnst.WHITE_BISHOP:
      moves = getBishopMoves(i, y, squares, pieceType);
      break;

    case cnst.BLACK_BISHOP:
      moves = getBishopMoves(i, y, squares, pieceType);
      break;

    case cnst.WHITE_ROOK:
      moves = getRookMoves(i, y, squares, pieceType);
      break;

    case cnst.BLACK_ROOK:
      moves = getRookMoves(i, y, squares, pieceType);
      break;

    case cnst.WHITE_QUEEN:
      moves = getQueenMoves(i, y, squares, pieceType);
      break;

    case cnst.BLACK_QUEEN:
      moves = getQueenMoves(i, y, squares, pieceType);
      break;

    case cnst.WHITE_KING:
      moves = getKingMoves(i, y, squares, pieceType);
      break;

    case cnst.BLACK_KING:
      moves = getKingMoves(i, y, squares, pieceType);
      break;

    default:
      moves = [];
      break;
  }

  if (moves.length === 0){
    console.log(moves, 'No moves available for this piece')
  }
  else console.log(moves);
  return moves;
}


function getAllMoves(squares, team) {
  let teamMoves = [];
  let selectedPiece;
  let pieceMoves;

  //loop through entire board
  for (i = 0; i <= 7; i++) {
    for (y = 0; y <= 7; y++) {

      //if empty square or oppenent piece, continue to next square
      if (squares[i][y] === "" || getPieceTeam(squares[i][y]) !== team) {
        //do nothing
      }

      //otherwise piece is on same team, so get its moves and add to team moves
      else if (getPieceTeam(squares[i][y]) === team) {
        selectedPiece = squares[i][y];
        console.log('on piece ', i, y, selectedPiece);
        pieceMoves = getAllPieceMoves(i, y, squares, selectedPiece);

        if (pieceMoves.length !== 0) {
          console.log('pushed piece moves for ', i, y, selectedPiece);
          teamMoves.push({ piece: selectedPiece, moves: pieceMoves });
        }

      };
    };
  };
  return teamMoves;
}