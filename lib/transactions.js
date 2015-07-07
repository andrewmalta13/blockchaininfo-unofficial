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
    response.vin.push({txid: null, txId: null, vout: input.prev_out.n, 
                        scriptSig: {asm: null, hex: input.script}, sequence: input.sequence, addresses: input.prev_out.addr});
  });
  resp.out.forEach(function (output){
    response.vout.push({value: output.value, index: output.n, n: output.n, spentTxid: null,
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

function buildTx(txid, api_code, callback){
  var url = "https://blockchain.info/rawtx/" + txid + "?" + api_code;
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
  var api_code = ""; //defaults to an empty string.
  if(config.api_code){
    api_code = "api_code=" + config.api_code;
  }

  function Get(transactions, callback){
    var responseData = [];
    var count = 0;

    transactions.forEach(function (txid){
      buildTx(txid, api_code, function (err, resp){
        if(err){
          callback(err, null);
        } else {
          responseData.push(resp);
          if (++count === transactions.length){
           callback(null, responseData);
          }
        }
      });
      
    });
  }
  
  function Latest(callback){
    var unconfirmedURL = "https://blockchain.info/unconfirmed-transactions?format=json&" + api_code;
    utility.getFromURL(unconfirmedURL, true, function (err1, resp1){
      if (err1) {
        callback(err1, null);
      } else {
        buildTx(resp1.txs[0].hash, api_code, function (err2, resp2){
          if (err2) {
            callback(err2, null);
          } else {
            callback(false, resp2);
          }
        });
      }
    });
  }
  
  function Outputs(outputs, callback){
    var responseData = [];
    var count = 0;

    outputs.forEach(function (output){
      var id;
      if (output.txid){
        id = output.txid;
      } else if (output.txId) {
        id = output.txId;
      } 

      var url = "https://blockchain.info/rawtx/" + id + "?" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {};
          response.scriptPubKey = resp.out[output.vout].script;
          response.txId = output.txid;
          response.txid = output.txid;
          response.value = resp.out[output.vout].value;
          response.vout = output.vout;

          responseData.push(response);

          if (++count === outputs.length) {
            responseData.sort(function(a, b) {
              return a.vout > b.vout;
            });
            callback(false, responseData);
          }
        }
      });
    });
  }


  //returns the txid if succesful in the resp.
  function Propagate(transactionHex, callback){
    
    var postBody = {"tx": transactionHex};
    var url = "https://www.blockchain.info/pushtx?" + api_code;

    request({
        url: url, //URL to hit
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      }, function(err, response, body){
        if (err) {
          callback(err, null);
        } else {
          if(body === "Transaction Submitted"){
            callback(false, {txid: null, txId: null});
          } else {
            callback({err: "error submitting tx to blockchain info"}, null);
          }        
        }
    });
  }
  
  function Status(txids, callback){
    var responseData = [];
    var count = 0;

    txids.forEach(function (txid){
      var url = "https://blockchain.info/rawtx/" + txid + "?" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {blockId: null, txid: txid, txId: txid};
    
          responseData.push(response);
          if (++count === txids.length){
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