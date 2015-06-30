var utility = require("./utility.js");
var request = require("request");


//calculates the fee of a transactions by summing over the total input value and subtracting the sum
//of the value of the outputs.
function calculateFee(inputs, outputs){
  var totalIn = 0;
  var totalOut = 0;
  for (var i = 0; i < inputs.length; i++){
    totalIn += inputs[i].prev_out.value;
  }
  for (var i = 0; i < outputs.length; i++){
    totalOut += outputs[i].value;
  }
  return(totalIn - totalOut);
}

//abstracted function for standardizing the format of a transaction given the blockchain info format
//of a TX.

// ** NOTE ** the fields that are null are not supported by blockchain info's api.
// also in outputs, they only supply one address rather than the entire list of them.
function standardizeTransaction(hex, resp){
  var response = {};
  response.hex = hex;
  response.txHex = hex;
  response.txid = resp.hash;
  response.txId = resp.hash
  response.version = resp.ver;
  response.locktime = resp.lock_time;
  response.fee = calculateFee(resp.inputs, resp.out);
  response.vin = [];
  response.vout = [];
  resp.inputs.forEach(function (input){
    response.vin.push({txid: null, txId: null, vout: input.n, 
                        scriptSig: {asm: null, hex: input.script}, sequence: input.sequence});
  });
  resp.out.forEach(function (output){
    response.vout.push({value: output.value, index: output.n, spentTxid: null,
                       scriptPubKey : {asm: null, hex: output.script, reqSigs: null,
                       type: null, addresses: [output.addr]}});
  });
  
  response.confirmations = null; 
  response.blocktime = null;
  response.blockhash = null;

  response.blockindex = null;
  response.timeReceived = new Date(resp.time).getTime();
  return response;
}

function buildTx(txid, callback){
  var url = "https://blockchain.info/rawtx/" + txid;
  utility.getFromURL(url + "?format=json", true, function (err1, resp1){
    if (err1){
      callback(err1, null);
    } else {
      utility.getFromURL(url + "?format=hex", false, function (err2, resp2){
        if (err2){
          callback(err2, null);
        } else{
          callback(false, standardizeTransaction(resp2, resp1)); 
        } 
      });
    }
  });
}

var Transactions = function(config){
  //expects a json object of either of these two aliases:
  //{"txids": [list of txid strings]} or {"txIds": [list of txid strings]}
  // and a callback(err, resp);

  //returns a list of transaction objects. Check the README.md for an example transaction object.
  function Get(transactions, callback){
    var txs;
    var responseData = [];
    var count = 0;
    //check for the format the user used (either txids or txIds)
    if (transactions.txids){
      txs = transactions.txids;
    }
    else if (transactions.txIds){
      txs = transactions.txIds;
    }
    txs.forEach(function (txid){
      buildTx(txid, function (err, resp){
        if(err){
          callback(err, null);
        } else {
          responseData.push(resp);

          if (++count === txs.length){
           callback(null, responseData);
          }
        }
      });
      
    });
  }
  
  //expects a callback(err, resp)
  //returns the latest unconfirmed transaction propogated to blockcypher as a json object.
  // (check README.md for more details)
  function Latest(callback){
    var unconfirmedURL = "https://blockchain.info/unconfirmed-transactions?format=json";
    utility.getFromURL(unconfirmedURL, true, function (err1, resp1){
      if (err1) {
        callback(err1, null);
      } else {
        buildTx(resp1.txs[0].hash, function (err2, resp2){
          if (err2) {
            callback(err2, null);
          } else {
            callback(false, resp2);
          }
        });
      }
    });
  }
  
  //expects a json object like so (either txid or txId should be defined):
  // { "outputs": 
  //   [
  //     {
  //       "txid": "String",
  //       "txId": "String",
  //       "vout": "Number"
  //     }
  //   ]
  // }
  //and a callback(err, resp)

  //returns a list of json objects:
  // {
  //   "scriptPubKey": "String",
  //   "txid": "String",
  //   "txId": "String",
  //   "value": "Number",
  //   "vout": "Number"
  // }
  function Outputs(outputs, callback){
    var responseData = [];
    var count = 0;

    outputs.outputs.forEach(function (output){
      var id;
      if (output.txid){
        id = output.txid;
      } 
      else if (output.txId) {
        id = output.txId;
      } 

      var url = "https://blockchain.info/rawtx/" + txid;
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {};
          response.scriptPubKey =resp.outputs[output.vout].script;
          response.txId = output.txid;
          response.txid = output.txid;
          response.value = resp.outputs[output.vout].value;
          response.vout = output.vout;

          responseData.push(response);

          if (++count === outputs.outputs.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects either of these two json objects for the transaction hex:
  // {
  //   "hex": transaction hex
  // }
   
  // or 

  // {
  //   "txHex": transaction hex
  // }
  //and a callback(err, resp);

  //returns the txid if succesful in the resp.
  function Propagate(transactionHex, callback){
   
  }
  

  //expects either of these two fields of the json object to be inputted:
  // {
  //   "txids": [list of strings of txids]
  // }
  // {
  //   "txIds": [list of strings of txids]
  // }
  //and a callback(err, resp)

  //returns a list of these json objects: 
  // {
  //   "blockId": "?String",
  //   "txid": "String",
  //   "txId": "String"
  // }
  function Status(txids, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    
    var transactionIds;
    if (txids.txids) transactionIds = txids.txids;
    else if (txids.txIds) transactionIds = txids.txIds;
    
    transactionIds.forEach(function (txid){
      var url = baseUrl + txid;
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {};
          if(response.blockId){
            response.blockId = resp.block_hash;
          }
          else {
            response.blockId = null;
          }      
          response.txid = txid;
          response.txId = txid;
    
          responseData.push(response);
          if (++count === transactionIds.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  return {
    Get: Get,
    Latest: Latest,
    Outputs: Outputs,
    Propagate: Propagate,
    Status: Status
  };
}

module.exports = Transactions;