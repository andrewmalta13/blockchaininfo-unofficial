function BlockChainInfo(opts) {
  if (!(this instanceof BlockChainInfo)) return new BlockChainInfo(opts);

  //leave opts for possible integration of api key, but nothing in it for now.

  return {
    Addresses: require('./lib/addresses.js')(opts),
    Blocks: require('./lib/blocks.js')(opts),
    Transactions: require('./lib/transactions.js')(opts)
  }
}

module.exports = BlockChainInfo;