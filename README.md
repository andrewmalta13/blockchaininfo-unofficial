# blockchaininfo-unofficial

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/blockchaininfo-unofficial">here</a>

```
npm install chain-unofficial
```
<a href="https://github.com/blockai/abstract-common-blockchain">See abstract-common-blockchain for API</a>

## Convention

Standard convention is described fully in the types.json file in the link above.

## Usage

simply require the npm module at the top of the file
```javascript
var blockchaininfo = require('blockchaininfo-unofficial')();
```
you may specify the options you wish to make a call like so:

```javascript
//example call
blockchaininfo.Addresses.Unspents(["address 1", "address 2", ...], callback);
```

alternatively you can check out the comments above each function in lib if you wish to understand what each function expects and returns.

## Maintainers
* Andrew Malta: andrew.malta@yale.edu
* Howard Wu: howardwu@berkeley.edu

