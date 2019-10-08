# ConfluxWeb: Conflux JavaScript API

## Getting Started

The conflux-web library is a collection of modules which contain specific functionality for the conflux ecosystem.

* The `conflux-web-cfx` is for the conflux blockchain and smart contracts
* The `conflux-web-utils` contains useful helper functions for Dapp developers.

### Adding conflux-web

First you need to get conflux-web into your project. This can be done using the following methods:

* npm: `npm install conflux-web`

After that you need to create a web3 instance and set a provider. Normally you should connect to a remote/local node.

```javascript
const ConfluxWeb = require('conflux-web');
const confluxWeb = new ConfluxWeb('http://testnet-jsonrpc.conflux-chain.org:12537');
```

That’s it! now you can use the confluxWeb object.

### Using Promises

All of functions use asynchronous HTTP requests and return promises by default:

```javascript
const ConfluxWeb = require('conflux-web');
const confluxWeb = new ConfluxWeb('http://testnet-jsonrpc.conflux-chain.org:12537');
confluxWeb.cfx.getEpochNumber().then(console.log);
```

### A note on big numbers

You will always get a BigNumber object for number values as JavaScript is not able to handle big numbers correctly. Look at the following examples:

```javascript
"101010100324325345346456456456456456456"
// "101010100324325345346456456456456456456"
101010100324325345346456456456456456456
// 1.0101010032432535e+38
```

ConfluxWeb depends on the BN.js library for big numbers, See the [BN.js](https://github.com/indutny/bn.js/) documentation for details.

## API Reference

### ConfluxWeb

### ConfluxWeb.cfx

### ConfluxWeb.cfx.accounts

### ConfluxWeb.cfx.Contract

### ConfluxWeb.utils
