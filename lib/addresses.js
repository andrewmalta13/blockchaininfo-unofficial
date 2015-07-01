var utility = require("./utility.js");

var Addresses = function(config){

  function Summary(addresses, callback){
    var responseData = [];
    var count = 0;

    addresses.forEach(function (address){
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
      var url = "https://blockchain.info/address/" + address + "?format=json";
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = [];
          resp.txs.forEach(function (transaction){
            var tx = {};
            tx.blockHeight = transaction.block_height;
            tx.blockId = null;
            tx.hex = null;
            tx.txHex = null;
            tx.txid = transaction.hash;
            tx.txId = transaction.hash;

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
      var url = "https://blockchain.info/unspent?address=" + address;
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