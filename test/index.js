var commonBlockchainTests = require('abstract-common-blockchain/tests/mainnet');

var test = require('tape');
var blockChainInfoAPI = require('../');

var commonBlockchain = blockChainInfoAPI();

var common = {
  setup: function(t, cb) {
    cb(null, commonBlockchain);
  },
  teardown: function(t, commonBlockchain, cb) {
    cb();
  }
}

commonBlockchainTests(test, common);