var Addresses = require('./lib/addresses.js');
var Transactions = require('./lib/transactions.js');
var Blocks = require('./lib/blocks.js');


//config variables for the module. (only network for now)
//"testnet" for testnet and anything else for mainnet

function BlockChainInfo(opts) {
  if (!(this instanceof BlockChainInfo)) return new BlockChainInfo(opts);

  //leave opts for possible integration of api key 

  BlockChainInfo.prototype.Addresses = Addresses(opts);
  BlockChainInfo.prototype.Transactions = Transactions(opts);
  BlockChainInfo.prototype.Blocks = Blocks(opts);
}



module.exports = BlockChainInfo;