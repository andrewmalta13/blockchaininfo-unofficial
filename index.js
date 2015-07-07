function BlockChainInfo(opts) {
  if (!(this instanceof BlockChainInfo)) return new BlockChainInfo(opts);

  if(!opts || !opts.api_code){
    console.log("no api code specified, you may request one here: https://blockchain.info/api/api_create_code");
    opts = {api_code: ""};
  }

  return {
    Addresses: require('./lib/addresses.js')(opts),
    Blocks: require('./lib/blocks.js')(opts),
    Transactions: require('./lib/transactions.js')(opts)
  }
}

module.exports = BlockChainInfo;