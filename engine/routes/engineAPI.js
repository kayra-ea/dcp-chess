/**
 *  @file         engineAPI.js
 *  @overview     This is the overview
 *  @description  This is the description 
 *
 *  @author       Kayra E-A, kayra@kingsds.network, kayra@kayra.ca
 *  @date         August 2021
 *
 */

const logic = require('../lib/logic');

var express = require("express");
var router = express.Router();

router.get('/', (req, res, next) => {
  res.send("Engine API is working properly");
});

/**
 *  @description This router receives all of the post messages from the React client. IT executes the desired function call, and returns back the game state to the frontend.
 */ 
router.post('/', (req, res, next) => {
  let msg = Object.assign({}, req.body);

  let state  = msg.state;
  let { functionCall, functionCallArgs } = state;
  let reqStatus = msg.msgStatus.reqStatus;
  let reqStatusCode = msg.msgStatus.reqStatusCode;
  
switch(functionCall) {
    case ('movePiece'):
      debugger;
      let ret  = logic.movePiece(...Object.values(functionCallArgs), reqStatus);
      debugger;
      reqStatus = ret.reqStatus;
      state.squares = ret.squares;

      break;

    default:

  }

  if (reqStatus === 'SUCCESS') {
    reqStatusCode = 6000;
  }

  //WHY DOEST msg.msgStatus.reqStatus update???!?!!!?!?!?!?

  console.log(`reqStatus: `, reqStatus); 
  console.log(`reqStatusCode: `, reqStatusCode);
  
  res.send(msg); //echo the result back to the client.
});

module.exports = router;
