var utility = require("./utility.js");


function standardizeTransaction(hex, resp){
  var response = {};
  response.hex = null;
  response.txHex = null;
  response.txid = resp.hash;
  response.txId = resp.hash
  response.version = null;
  response.locktime = null;
  response.fee = null;
  response.vin = [];
  response.vout = [];
  resp.inputs.forEach(function (input){
    response.vin.push({txid: null, txId: null, vout: null, 
                        scriptSig: {asm: null, hex: null}, sequence: null, addresses: null});
  });
  resp.out.forEach(function (output){
    response.vout.push({value: null, index: null, n: null, spentTxid: null,
                       scriptPubKey : {asm: null, hex: null, reqSigs: null,
                       type: null, addresses: null}});
  });
  
  response.confirmations = null; 
  response.blocktime = null;
  response.blockhash = null;
  response.blockheight = null;
  response.timeReceived = null;
  return response;
}


var Addresses = function(config){
  var api_code = ""; //defaults to an empty string.
  if(config.api_code){
    api_code = "api_code=" + config.key;
  }

  function Summary(addresses, callback){
    var responseData = [];
    var count = 0;

    addresses.forEach(function (address){
      var url = "https://blockchain.info/address/" + address + "?format=json&" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockchain threw an error for " + address);
          count++;
        }
        else{
          var response = {};
          response.address = resp.address;
          response.balance = resp.final_balance;
          response.confirmedBalance = null;
          response.unconfirmedBalance = null;
          response.totalReceived = resp.total_received;
          response.totalSent = resp.total_sent;
          response.txCount = resp.n_tx;
          
          responseData.push(response);

          if (++count === addresses.length){
            callback(err, responseData);
          }
        }
      });
    });
  }
  
  function Transactions(addresses, callback){
    var responseData = [];
    var count = 0;

    addresses.forEach(function (address){
      var url = "https://blockchain.info/address/" + address + '?format=json&' + api_code;
      utility.getFromURL(url, true, function (err, resp) {
        if (err) {
          callback(err, null);
        } 
        else {
          var response = [];
          resp.txs.forEach(function (transaction) {
            var tx = standardizeTransaction(null, transaction);
            response.push(tx);
          });
          responseData.push(response); 
          if (++count === addresses.length){
            callback(false, responseData);
          } 
        }
      });
    });
  }


  function Unspents(addresses, callback){
    var responseData = [];
    var count = 0;
    
    addresses.forEach(function (address){
      var url = "https://blockchain.info/unspent?address=" + address + "&" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = [];
          resp.unspent_outputs.forEach(function (unspent){
            var utxo = {};
            utxo.txId = unspent.tx_hash_big_endian;
            utxo.txid = unspent.tx_hash_big_endian;
            utxo.vout = unspent.tx_output_n;
            utxo.address = address;
            utxo.scriptPubKey = unspent.script;
            utxo.amount = unspent.value;
            utxo.value = unspent.value;
            utxo.confirmations = unspent.confirmations;
            response.push(utxo);
          });
          responseData.push(response);

          if (++count === addresses.length){
            callback(false, responseData);
          }
        }
      }); 
    });
  }

  return{
    Summary: Summary,
    Transactions: Transactions,
    Unspents: Unspents
  };
}

module.exports = Addresses;