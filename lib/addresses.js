var utility = require("./utility.js");

var Addresses = function(config){

  //expects a json object ie : {addresses: [list of addresses as strings]} and a callback(err, resp)
  //and returns a list of address summaries (address, balance, totalRecieved, totalSent, txCount)
  function Summary(addresses, callback){
    var responseData = [];
    var count = 0;

    addresses.addresses.forEach(function (address){
      var url = "https://blockchain.info/address/" + address + "?format=json";
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
          response.balance = resp.final_balance,
          response.totalReceived = resp.total_received,
          response.totalSent = resp.total_sent,
          response.txCount = resp.n_tx
          
          responseData.push(response);

          if (++count === addresses.addresses.length){
            callback(err, responseData);
          }
        }
      });
    });
  }
  
  //expects a json object ie : {addresses: [list of addresses as strings]} and a callback(err, resp)
  //and returns a list of json objects that look like this.

  // {  
  //    "address": some address,
  //    "result": [list of transactions for this specific address]
  //  }
  function Transactions(addresses, callback){
    var responseData = [];
    var count = 0;

    addresses.addresses.forEach(function (address){
      var url = "https://blockchain.info/address/" + address + "?format=json";
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {address: address, result: []};
          resp.txs.forEach(function (transaction){
            var tx = {};
            tx.blockHeight = transaction.block_height;
            tx.blockId = null;
            tx.hex = null;
            tx.txHex = null;
            tx.txid = transaction.hash;
            tx.txId = transaction.hash;

            response.result.push(tx);
          });
          
          responseData.push(response);
          if (++count === addresses.addresses.length){
            callback(false, responseData);
          }
        }
      });
    });
  }


  //expects a json object ie : {addresses: [list of addresses as strings]} and a callback(err, response)
  //and resturns a list of json objects like this: 
  // {  
  //    "address": some address,
  //    "result": [list of unspent outputs for this specific address]
  //  }

  function Unspents(addresses, callback){
    var responseData = [];
    var count = 0;
    
    addresses.addresses.forEach(function (address){
      var url = "https://blockchain.info/unspent?address=" + address;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {address: address, result: []};
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
            response.result.push(utxo);

            response.result.push(utxo);
          });
          responseData.push(response);

          if (++count === addresses.addresses.length){
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