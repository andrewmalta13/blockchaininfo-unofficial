# blockchaininfo-unofficial

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/blockchaininfo-unofficial">here</a>

```
npm install blockchaininfo-unofficial
```
<a href="https://github.com/blockai/abstract-common-blockchain">See abstract-common-blockchain for API</a>

## Blockchain's Abstract Common Blockchain Coverage 
  <a href="http://abstract-common-blockchain.herokuapp.com"> Use this link to see what Blockchain.info supports </a>

## Convention

Standard convention is described fully in the types.json file in the link above.

## Usage

simply require the npm module at the top of the file
```javascript
var blockchaininfoClient = require('blockchaininfo-unofficial')({
  api_code: "your api code here"
});
```
you may specify the options you wish to make a call like so:

```javascriptce
//example call
blockchaininfoClient.Addresses.Unspents(["address 1", "address 2", ...], callback);
```

## Known Issues 

1. Blockchain.info does not support unconfirmed balance so in Addresses.Summary, both unconfirmedBalance and confirmedBalanace will be null; however, balance will represent the confirmed balance of the address.
2. Blockchain.info does not support unconfirmed unspent outputs, so Addresses.Unspents will not display unspents that do not have at least one confirmation


## Maintainers
please email us with any and all issues/requests.
* Andrew Malta: andrew.malta@yale.edu
* Howard Wu: howardwu@berkeley.edu

