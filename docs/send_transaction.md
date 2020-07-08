---
id: send_transaction
title: My First Transaction
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/send_transaction.md
keywords:
  - conflux
  - transaction
  - sdk
---

This document will guide you to compose and send your first transaction into the Conflux network, including the introduction of technical specs of Conflux's transaction, and the basic techniques to track the status of sent transactions in Conflux network and error handling.

For common users, it is recommended to use a Conflux wallet like [Conflux Portal](https://github.com/Conflux-Chain/conflux-portal), which is easy, safe and user-friendly.

For developers that want to compose and send transaction in your own program. Conflux provides you several SDKs in different languages:

* [JavaScript: js-conflux-sdk](https://github.com/Conflux-Chain/js-conflux-sdk)
* [Java: java-conflux-sdk](https://github.com/Conflux-Chain/java-conflux-sdk)
* [Go: go-conflux-sdk](https://github.com/Conflux-Chain/go-conflux-sdk)

The following document will use [js-conflux-sdk](https://github.com/Conflux-Chain/js-conflux-sdk) as an example.

## Compose and send my first transaction

### Create an account with Conflux Portal

1. Install [Conflux Portal](https://github.com/Conflux-Chain/conflux-portal).

2. Generate a new account.

3. Get test-net tokens from the faucet.

4. Export and copy your private key to somewhere, we'll use it later.

### Installation

``` npm install js-conflux-sdk ```

### Send transaction by JavaScript program

* require js-conflux-sdk and set a Conflux provider. For the Conflux test-net, there is a node provided at http://testnet-jsonrpc.conflux-chain.org:12537. It can also be changed to any other Conflux nodes, even the one set on your own.

```javascript
const { Conflux, util } = require('js-conflux-sdk');

const cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100, // The default gas price of your following transactions
  defaultGas: 1000000, // The default gas of your following transactions
  logger: console,
});
```

* paste your private key into the program

```javascript
const PRIVATE_KEY = 'Your Private Key';
// const PRIVATE_KEY = '0x5f15f9e52fc5ec6f77115a9f306c120a7e80d83115212d33a843bb6b7989c261';
const account = cfx.Account(PRIVATE_KEY); // create account instance
const receiver = '0xa70ddf9b9750c575db453eea6a041f4c8536785a'
```

* Compose your transaction, here are the fields could be filled with:

	* **nonce**: optional, the nonce of a transaction to keep the order of your sending transactions, starting with some random large number and increase one by one. If missing, the result of cfx_getNextNonce will be automatically filled in and it works for general scenarios. Some cases, like sending a lot of transactions in a short period. It's recommended to maintain the nonce on your own.
	* **gasPrice**: optional, the price in Drip that you would like to pay for each gas consumed. If missing, the result of cfx_gasPrice will be automatically filled in, which is the median of recent transactions.
	* **gas**: optional, the max gas you would like to use in the transaction. After the end of transaction processing, the unused gas will be refunded if used_gas >= gas * 0.75. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general scenarios.
	* **to**: the receiver of the transaction, could be a personal account(start with 1) or contract(start with 8). Leave a null here to deploy a contract.
	* **value**: the value (in Drip) to be transferred.
	* **storageLimit**: optional, he max storage (in Byte) you would like to collateralize in the transaction. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general senarios.transactions.
	* **epochHeight**: optional, a transaction is can be verified only in epochs in the range [epochHeight - 10000, epochHeight + 10000], so it's  a timeout mechanism. If missing, the result of cfx_epochNumber will be automatically filled in and it works for general scenarios.
	* **data**: optional, it's either an attached message of a transaction or a function signature of a contract call. If missing, a null will be filled into it.
	* **chainId**: optional, it used for dealing with a hard fork or preventing a transaction replay attack. If missing, 0 will be filled into it.
	* **from**: The sender account(with private key) to sign the transaction.

```javascript
let txParams = {
  from: account, // from account instance and will by sign by account.privateKey
  // nonce 
  // gasPrice
  // gas
  to: receiver, // accept address string or account instance
  value: util.unit.fromCFXToDrip(0.125), // use unit to transfer from 0.125 CFX to Drip
  // storageLimit
  // epochHeight
  // data
};
```

* Send it away by ```cfx.sendTransaction``` and get the returned transaction hash, then you can view the transaction details by searching the hash on [Conflux Scan](http://confluxscan.io/). 

```javascript
async function main() {
  const txHash = await cfx.sendTransaction(txParams);
  console.log(txHash);
}

main().catch(e => console.error(e));
```

## Track my transaction

After sending, the transaction could be in several different states:

### 1. rejected by RPC provider immediately

After the provider got the cfx_sendRawTransaction RPC call, it will try to do the basic verification and insert it into the transaction pool. If there an obvious error of the transaction, e.t.c, RLP decoding error, signature verification error, it will be rejected immediately. Otherwise, it will be inserted into the transaction pool and start to wait to be mined, and the RPC will return a transaction hash.

### 2. got stucked in the transaction pool

However, the transaction hash you got doesn't mean it's successfully executed. Conflux transaction will store as much verified transactions in the pool as possible, even the transactions whose nonce doesn' match expected one or the balance is not enough to pay the ```gas * gasPrice + value```. if you are changing state of a contract you also need extra balance for storage collateral.

So if you wait for 1 minute and still cannot find the transaction in ConfluxScan after sending it, it very likely got stuck in the transaction pool. 

Use cfx_getTransactionByHash, cfx_getBalance and cfx_getNextNonce to check if your transaction is ready to be packed and mined, for example:

```
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBalance","params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8"],"id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537
```
And compare the result with value + gas * gasPrice.

```
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getNextNonce","params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8"],"id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537

```
And compare the result with nonce you filled in. 

You can always get the transaction details by cfx_getTransactionByHash:
```
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getTransactionByHash","params":["0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514"],"id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537
```

Normally you can check these things to find the stuck reason:
1. Your trancation nonce should equal to the result of `cfx_getNextNonce`. Normally a nonce bigger than the result of `cfx_getNextNonce` will cause transaction stuck in transaction pool.
2. Your balance should enough to pay the ```gas * gasPrice + value```, if you are interact with contract and try to change the state of it, you should also set the storageLimit to the value of `cfx_estimateGasAndCollateral`.
3. Sometimes the value of `cfx_estimateGasAndCollateral` is not accurate, you can multiply them by 1.1 or 1.2 to make them a little bigger.

In this situation, you may want to send a new transaction after fixing the nonce or balance problem. Note that, replacing a transaction in the pool with the same nonce, a higher gasPrice is necessary.


### 3. mined but skipped

If you can view the transaction on ConfluxScan but its status always shows "skip". Which means it didn't pass the basic verification (etc, nonce doesn't match, balance can't cover the basic fee) in execution engine and got skipped.

In this situation, you may want to send a new transaction after fixing the nonce or balance problem. Note that, replacing a transaction in the pool with the same nonce, a higher gasPrice is necessary.

### 4. mined and executed with some error outcome

In this case, you'll see an error message on ConfluxScan. This could be in several causes: 

* EVM error: like assert, require
* balance is enough to pay the basic fee, but not for the whole transaction fee
* storageLimit reached

It's a good idea to double-check your contract in Remix IDE and check the storageLimit and balance issue by cfx_estimateGasAndCollateral RPC.

### 5. mined and executed with no error outcome

Congrats! Your first transaction finally got there.




