var commonBlockchainTests = require('abstract-common-blockchain/mainnet/tests');

var test = require('tape');
var ChainAPI = require('../');

var commonBlockchain = ChainAPI();

var common = {
  setup: function(t, cb) {
    cb(null, commonBlockchain);
  },
  teardown: function(t, commonBlockchain, cb) {
    cb();
  }
}

commonBlockchainTests(test, common);