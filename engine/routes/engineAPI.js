/**
 *  @file         engineAPI.js
 *  @overview     This is the overview
 *  @description  This is the description
 *
 *  @author       Kayra E-A, kayra@kingsds.network, kayra@kayra.ca
 *  @date         August 2021
 *
 */

const logic = require("../lib/logic");

var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Engine API is working properly");
});

/**
 *  @description This router receives all of the post messages from the React client. IT executes the desired function call, and returns back the game state to the frontend.
 */
router.post("/", (req, res, next) => {
  let msg = Object.assign({}, req.body);
  let { state, reqStatus, functionCall, functionCallArgs } = msg;

  switch (functionCall) {
    case "movePiece":
      let ret = logic.movePiece(...Object.values(functionCallArgs), reqStatus);
      reqStatus = ret.reqStatus;
      state.squares = ret.squares;

      if (reqStatus === "SUCCESS") {
        state.isPlayerTurn = !state.isPlayerTurn;
      }
      break;

    case "PlayAITurn":
      break;

    default:
      reqStatus = "INVALIDCALL";
      break;
  }

  msg.reqStatus = reqStatus;

  // console.log(`reqStatus: `, reqStatus);
  // console.log(`reqStatusCode: `, reqStatusCode);
  // console.log(`state.squares: `, state.squares);
  // console.log(`msg: `, msg);

  res.send(msg); //echo the result back to the client.
});

module.exports = router;
