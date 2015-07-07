var utility = require("./utility.js");
var request = require("request");

function Blocks(config){
  var api_code = ""; //defaults to an empty string.
  if(config.api_code){
    api_code = "api_code=" + config.key;
  }

  function Get(blockIds, callback){
    var responseData = [];
    var count = 0;

    blockIds.forEach(function (blockId){
      var url = "https://blockchain.info/rawblock/" + blockId + "?format=json&" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err) {
          callback(err, null);
        } else {
          var response = {blockHex: null, blockId: resp.hash};
          responseData.push(response);

          if (++count === blockIds.length) {  
            callback(false, responseData);
          }
        }
      });
    });
  }

  function Latest(callback){
    var url = "https://blockchain.info/latestblock?" + api_code;
    var response = {};
    utility.getFromURL(url, true, function (err, resp){
      if (err) {
        callback(err, null);
      } else {
        response.blockHex = null;
        response.blockId = resp.hash;
        callback(false, response);
      }
    });
  }
  
  //not currently supported by blockchain info, but would take raw hex of a block and would propgate it to the blockchain.
  //also expects a callback(err, resp).  The resp would be the blockId of the block published if successful.
  function Propagate(blockHex, callback){
    callback({"err": "blockchain info does not provide support for propagating blocks"}, null);
  }

  function Transactions(blockIds, callback){
    var responseData = [];
    var count = 0;

    blockIds.forEach(function (blockId){
      var url = "https://blockchain.info/rawblock/" + blockId + "?format=json&" + api_code;
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = [];
          resp.tx.forEach(function (tx){
            var transaction = {txid: tx.hash, txId: tx.hash, blockId: blockId};

            response.push(transaction);
          });
          responseData.push(response);

          if (++count === blockIds.length){  
            callback(false, responseData);
          }
        }
      });
    });
  }

  return{
    Get: Get,
    Latest: Latest,
    Propagate: Propagate,
    Transactions: Transactions
  };
}

module.exports = Blocks;