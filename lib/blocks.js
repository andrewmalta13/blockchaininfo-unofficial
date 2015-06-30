var utility = require("./utility.js");
var request = require("request");

function Blocks(config){

  //expects a json object ie : {blockIds: [list of block ids as strings]} and a callback(err, response)
  //returns a list of json objects:
  // {
  //   "blockHex": hex of block (not supported by blockchain info at the moment),
  //   "blockId": id of the block
  // }
  //

  //** NOTE ** right now this method does virtually nothing as you are passing in ids and getting back ids, but the hope
  // is the blockchain info might one day support hex for block
  function Get(blockIds, callback){
    var responseData = [];
    var count = 0;

    var ids;
    if (blockIds.blockids) {
      ids = blockIds.blockids;
    } else if (blockIds.blockIds) {
      ids = blockIds.blockIds;
    } 
    
    ids.forEach(function (blockId){
      var url = "https://blockchain.info/rawblock/" + blockId + "?format=json";
      utility.getFromURL(url, true, function (err, resp){
        if (err) {
          callback(err, null);
        } else {
          var response = {};
          response.blockHex = null;
          response.blockId = resp.hash;
          
          responseData.push(response);

          if (++count === ids.length) {  
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects a callback(err, resp) and returns a single json object of the latest block :
  // {
  //   "blockHex": hex of block (not supported by blockchain info at the moment),
  //   "blockId": id of the block
  // }
  //
  function Latest(callback){
    var url = "https://blockchain.info/latestblock";
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

  //expects a json object like so:
  // {
  //   blockIds: [array of block ids];
  // }
  //and a callback(err, resp);

  //returns an array of json objects:
  // {
  //   blockId: [some block id],
  //   result: [{txid: {some txid in block}, txId: {same txid in block}}]
  // }
  function Transactions(blockIds, callback){
    var responseData = [];
    var count = 0;

    var ids;
    if (blockIds.blockids) {
      ids = blockIds.blockids;
    } else if (blockIds.blockIds) {
      ids = blockIds.blockIds;
    }
    
    ids.forEach(function (blockId){
      var url = "https://blockchain.info/rawblock/" + blockId + "?format=json";
      utility.getFromURL(url, true, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = {blockId: blockId, result: []};
          resp.tx.forEach(function (tx){
            var txidPair = {};
            txidPair.txid = tx.hash;
            txidPair.txId = tx.hash;

            response.result.push(txidPair);
          });
          responseData.push(response);

          if (++count === ids.length){  
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