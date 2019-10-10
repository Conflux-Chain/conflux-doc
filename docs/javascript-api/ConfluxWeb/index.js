/**
 * @module ConfluxWeb
 *
 * @description
 *
 * - Getting Started
 *
 * The conflux-web library is a collection of modules which contain specific functionality for the conflux ecosystem.
 *
 * > The `conflux-web-cfx` is for the conflux blockchain and smart contracts.
 *
 * > The `conflux-web-utils` contains useful helper functions for Dapp developers.
 *
 * - Adding conflux-web
 *
 * First you need to get conflux-web into your project. This can be done using the following methods:
 *
 * npm: `npm install conflux-web`
 *
 * After that you need to create a confluxWeb instance and set a provider. Normally you should connect to a remote/local node.
 *
 * ```js
 * const ConfluxWeb = require('conflux-web');
 * const confluxWeb = new ConfluxWeb('http://testnet-jsonrpc.conflux-chain.org:12537');
 * ```
 *
 * That’s it! now you can use the confluxWeb object.
 *
 * - Using Promises
 *
 * All of functions use asynchronous HTTP requests and return promises by default:
 *
 * ```js
 * const ConfluxWeb = require('conflux-web');
 * const confluxWeb = new ConfluxWeb('http://testnet-jsonrpc.conflux-chain.org:12537');
 * confluxWeb.cfx.getEpochNumber().then(console.log);
 * ```
 *
 * - A note on big numbers
 *
 * You will always get a BigNumber object for number values as JavaScript is not able to handle big numbers correctly. Look at the following examples:
 *
 * ```js
 * "101010100324325345346456456456456456456"
 * // "101010100324325345346456456456456456456"
 * 101010100324325345346456456456456456456
 * // 1.0101010032432535e+38
 * ```
 *
 * ConfluxWeb depends on the BN.js library for big numbers, See the [BN.js](https://github.com/indutny/bn.js/) documentation for details.
 *
 */

/**
 * > Class attribute
 *
 * @var {object}
 * @example

 > ConfluxWeb.providers
 { HttpProvider: [Function: HttpProvider$1],
  WebsocketProvider: [Function: WebsocketProvider$1],
  IpcProvider: [Function: IpcProvider$1] }

 */
let providers;

/**
 * > Class attribute
 *
 * @var {object}
 * @example

 > ConfluxWeb.modules
 { Cfx: [Function: Cfx], Net: [Function: Net] }

 */
let modules;

/**
 * > Class attribute
 * > Object attribute
 *
 * Property of ConfluxWeb class and instance of ConfluxWeb, See confluxWeb.utils for more.
 *
 * @var {object}
 * @example
 > ConfluxWeb.utils
 {...}

 > confluxWeb.utils
 {...}
 */
let utils;

/**
 * > Object attribute
 *
 * current version
 *
 * @var {string}
 * @example

 > confluxWeb.version
 0.1.21-alpha.0

 */
let version;

/**
 * > Object attribute
 *
 * current provider instance
 *
 * @var {object}
 * @example
 > confluxWeb.currentProvider;
 HttpProvider {
 host: 'http://testnet-jsonrpc.conflux-chain.org:12537',
 ...
 }

 */
let currentProvider;

/**
 * Will change the provider for its module.
 *
 * > NOTE: When called on the umbrella package cfx it will also set the provider for all sub modules confluxWeb.cfx, etc.
 *
 * @param provider {object} - A valid provider.
 * @return {boolean}
 *
 * @example
 > const ConfluxWeb = require('conflux-web');
 > const confluxWeb = new ConfluxWeb('http://testnet-jsonrpc.conflux-chain.org:12537');
 > confluxWeb.currentProvider
 HttpProvider {
  host: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  ...
 }
 > confluxWeb.setProvider(new ConfluxWeb.providers.HttpProvider('http://localhost:12537'));
 true
 > confluxWeb.currentProvider
 HttpProvider {
   host: 'http://localhost:12537'
   ...
 }

 @example
 > confluxWeb.setProvider('http://localhost:12537'); // same as above
 true

 @example
 > confluxWeb.currentProvider.host
 "http://testnet-jsonrpc.conflux-chain.org:12537"
 > confluxWeb.cfx.currentProvider.host
 "http://testnet-jsonrpc.conflux-chain.org:12537"
 > confluxWeb.setProvider('http://localhost:12537') // change all provider
 > confluxWeb.currentProvider.host
 "http://localhost:12537"
 > confluxWeb.cfx.currentProvider.host
 "http://localhost:12537"
 */
function setProvider(provider) {}
