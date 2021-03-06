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
  isPlayerTurn,
  reqStatus
) {
  let cpy_squares = squares.slice();
  let currentSquares = JSON.parse(JSON.stringify(squares));
  let cpy_selectedSquare = Object.assign({}, selectedSquare);
  let cpy_prevSelectedSquare = Object.assign({}, prevSelectedSquare);
  const pieceToMove =
    cpy_squares[cpy_prevSelectedSquare.x][cpy_prevSelectedSquare.y];
  const pieceColor = getPieceTeam(pieceToMove);
  let ownKingInCheck = false;
  let oppKingInCheck = false;
  let oppKingCanMove = false;
  let oppCanTakeChecker = false;
  let oppCanBlockChecker = false;
  let oppKing = {};

  //create test board to simulate the board status after the move (to determine things like check, etc)
  let testBoard = this.makeTestBoard(
    prevSelectedSquare,
    selectedSquare,
    currentSquares,
    pieceToMove
  );

  // check if own king is put into check from this board. if so, return normal board and dont allow move
  ownKingInCheck = isOwnKingInCheck(testBoard, pieceToMove);

  if (ownKingInCheck) {
    reqStatus = "COULDNOTMOVE";

    return {
      squares: cpy_squares,
      reqStatus: reqStatus,
    };
  }

  // check if opp king is put into check from this board
  oppKingInCheck = isOppKingInCheck(testBoard, pieceToMove);

  //if in check
  if (oppKingInCheck) {
    //check if king can move out of check
    oppKing.pos = getOppKingPos(testBoard, pieceColor);
    checkPos = { x: cpy_selectedSquare.x, y: cpy_selectedSquare.y };
    oppKing.piece = testBoard[oppKing.pos.x][oppKing.pos.y];
    oppKing.moves = getKingMoves(
      oppKing.pos.x,
      oppKing.pos.y,
      testBoard,
      oppKing.piece
    );
    teamMoves = exports.getAllMoves(testBoard, pieceColor);

    //loop thru and get rid of kings illegal moves
    //loop thru pruned moves
    let tempMoves = [];
    oppKing.moves.forEach((oppKingMove) => {
      let moveIsLegal = true;
      //loop thru opponent list of moves
      teamMoves.forEach((teamPiece) => {
        teamPiece.moves.forEach((teamPieceMove) => {
          if (
            oppKingMove.x === teamPieceMove.x &&
            oppKingMove.y === teamPieceMove.y
          ) {
            moveIsLegal = false;
          }
        });
      });

      if (moveIsLegal) {
        tempMoves.push(oppKingMove);
      }
    });

    oppKing.moves = tempMoves;

    //check if opponent can take checker
    oppCanTakeChecker = canOppTakeChecker(testBoard, checkPos, oppKing.piece);

    //check if opponent can block checker
    oppCanBlockChecker = canOppBlockChecker(testBoard, checkPos, oppKing.piece);

    //checkmate check
    if (
      oppKing.moves.length === 0 &&
      oppCanTakeChecker === false &&
      oppCanBlockChecker === false
    ) {
      console.log("checkmate!!");
    }
  }

  // let random1 = Math.floor(Math.random() * test.length);
  // let move = test[random1].moves;

  // let random2 = Math.floor(Math.random() * move.length);
  // let damove = move[random2];

  // console.log(`random1`, random1);
  // console.log(`rando move`, damove);

  if (pieceColor === "WHITE") {
    if (isPlayerTurn === false) {
      reqStatus = "COULDNOTMOVE";

      return {
        squares: cpy_squares,
        reqStatus: reqStatus,
      };
    }
  } else if (pieceColor === "BLACK") {
    if (isPlayerTurn === true) {
      reqStatus = "COULDNOTMOVE";

      return {
        squares: cpy_squares,
        reqStatus: reqStatus,
      };
    }
  }

  try {
    let allow = isLegalMove(
      cpy_squares,
      cpy_selectedSquare,
      cpy_prevSelectedSquare
    );

    if (allow === true) {
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
      isLegalMove = checkIfValid(moves, selectedSquare.x, selectedSquare.y);
      break;

    case cnst.WHITE_KNIGHT:
      moves = getKnightMoves(
        prevSelectedSquare.x,
        prevSelectedSquare.y,
        squares,
        cnst.WHITE_KNIGHT
      );
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
function getPawnMoves(i, y, squares, c, isFirstMove) {
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
      moves = getKnightMoves(i, y, squares, piece);
      break;

    case cnst.BLACK_KNIGHT:
      moves = getKnightMoves(i, y, squares, piece);
      break;

    case cnst.WHITE_BISHOP:
      moves = getBishopMoves(i, y, squares, piece);
      break;

    case cnst.BLACK_BISHOP:
      moves = getBishopMoves(i, y, squares, piece);
      break;

    case cnst.WHITE_ROOK:
      moves = getRookMoves(i, y, squares, piece);
      break;

    case cnst.BLACK_ROOK:
      moves = getRookMoves(i, y, squares, piece);
      break;

    case cnst.WHITE_QUEEN:
      moves = getQueenMoves(i, y, squares, piece);
      break;

    case cnst.BLACK_QUEEN:
      moves = getQueenMoves(i, y, squares, piece);
      break;

    case cnst.WHITE_KING:
      moves = getKingMoves(i, y, squares, piece);
      break;

    case cnst.BLACK_KING:
      moves = getKingMoves(i, y, squares, piece);
      break;

    default:
      moves = [];
      break;
  }

  return moves;
}

/**
 *  @description    This function returns all the moves for a given color (BLACK/WHITE) for each piece.
 *
 *  @param squares
 *  @param team
 */
exports.getAllMoves = function getAllMoves(squares, team) {
  let teamMoves = [];
  let selectedPiece;
  let pieceMoves;

  //loop through entire board\
  for (i = 0; i <= cnst.MAX_X; i++) {
    for (y = 0; y <= cnst.MAX_Y; y++) {
      //if empty square or oppenent piece, continue to next square
      if (squares[i][y] === "" || getPieceTeam(squares[i][y]) !== team) {
        //do nothing
      }

      //otherwise piece is on same team, so get its moves and add to team moves
      else if (getPieceTeam(squares[i][y]) === team) {
        selectedPiece = squares[i][y];
        pieceMoves = getAllPieceMoves(i, y, squares, selectedPiece);

        let pos = { x: i, y: y };
        if (pieceMoves.length !== 0) {
          teamMoves.push({ piece: selectedPiece, pos: pos, moves: pieceMoves });
        }
      }
    }
  }
  return teamMoves;
};

function isOwnKingInCheck(squares, piece) {
  let ownKingInCheck = false;
  let team = getPieceTeam(piece);
  let kingPosI;
  let kingPosY;
  let oppMoves;

  switch (team) {
    case "WHITE":
      //get own kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.WHITE_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }

      //check if own king is put into check with this board
      oppMoves = exports.getAllMoves(squares, "BLACK");
      oppMoves.forEach((pieceMove) => {
        pieceMove.moves.forEach((move) => {
          if (move.x === kingPosI && move.y === kingPosY && pieceMove.piece) {
            ownKingInCheck = true;
          }
        });
      });
      break;

    case "BLACK":
      //get own kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.BLACK_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }

      //check if own king is pujt into check with this board
      oppMoves = exports.getAllMoves(squares, "WHITE");
      oppMoves.forEach((pieceMove) => {
        pieceMove.moves.forEach((move) => {
          if (move.x === kingPosI && move.y === kingPosY) {
            ownKingInCheck = true;
          }
        });
      });
      break;

    default:
      break;
  }
  return ownKingInCheck;
}

function isOppKingInCheck(squares, piece) {
  let kingInCheck = false;
  let team = getPieceTeam(piece);
  let kingPosI;
  let kingPosY;
  let oppMoves;

  switch (team) {
    case "WHITE":
      //get opp kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.BLACK_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }

      //check if opp king is put into check with this board
      oppMoves = exports.getAllMoves(squares, "WHITE");
      oppMoves.forEach((pieceMove) => {
        pieceMove.moves.forEach((move) => {
          if (move.x === kingPosI && move.y === kingPosY) {
            kingInCheck = true;
          }
        });
      });
      break;

    case "BLACK":
      //get kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.WHITE_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }

      oppMoves = exports.getAllMoves(squares, "BLACK");
      oppMoves.forEach((pieceMove) => {
        pieceMove.moves.forEach((move) => {
          if (move.x === kingPosI && move.y === kingPosY) {
            kingInCheck = true;
          }
        });
      });
      break;

    default:
      break;
  }
  return kingInCheck;
}

exports.makeTestBoard = function makeTestBoard(
  prevSelectedSquare,
  selectedSquare,
  cpy_squares,
  pieceToMove
) {
  let testBoard = Array.from(cpy_squares);
  let prevX = prevSelectedSquare.x;
  let prevY = prevSelectedSquare.y;
  let selecX = selectedSquare.x;
  let selecY = selectedSquare.y;

  testBoard[prevX][prevY] = "";
  testBoard[selecX][selecY] = pieceToMove;

  return testBoard;
};

function getOppKingPos(squares, team) {
  let kingPosI;
  let kingPosY;

  switch (team) {
    case "WHITE":
      //get own kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.BLACK_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }

      break;

    case "BLACK":
      //get own kings position
      for (let j = 0; j <= cnst.MAX_X; j++) {
        for (let k = 0; k <= cnst.MAX_Y; k++) {
          if (squares[j][k] === cnst.WHITE_KING) {
            kingPosI = j;
            kingPosY = k;
          }
        }
      }
      break;

    default:
      break;
  }
  return { x: kingPosI, y: kingPosY };
}

function canOppTakeChecker(squares, pos, oppPiece) {
  let team = getPieceTeam(oppPiece);
  let oppMoves = exports.getAllMoves(squares, team);
  let canTake = false;

  oppMoves.forEach((pieceMove) => {
    pieceMove.moves.forEach((move) => {
      if (move.x === pos.x && move.y === pos.y) {
        canTake = true;
      }
    });
  });

  return canTake;
}

/**
 *  @description    This function returns true if an opponent can a check, false if not.
 *
 *  @param squares  the current board
 *  @param pos      the position of the checker
 *  @param oppPiece the opponent kings position
 */
function canOppBlockChecker(squares, pos, oppPiece) {
  //get all moves
  let team = getPieceTeam(oppPiece);
  let oppMoves = exports.getAllMoves(squares, team);
  let canBlock = false;
  let currPos = pos;

  oppMoves.forEach((pieceMove) => {
    pieceMove.moves.forEach((move) => {
      let kingInCheck = false;
      //for opponent each move, make a test board with that move
      let copyBoard = JSON.parse(JSON.stringify(squares));
      let tempBoard = makeTestBoard(
        pieceMove.pos,
        move,
        copyBoard,
        pieceMove.piece
      );
      //if the opponent test board results in a board where the opponent king isnt in check
      kingInCheck = isOwnKingInCheck(tempBoard, pieceMove.piece);
      if (kingInCheck === false)
        //set canBlock to true;
        canBlock = true;
      {
      }
    });
  });

  return canBlock;
}

