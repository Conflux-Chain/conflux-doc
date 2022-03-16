---
id: light_node
title: Run a Light Node
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/light-nodes.md
keywords:
  - conflux
  - light node
---

## Overview

**Node version: `conflux-rust v1.0.3`.**

Light nodes are special nodes in the Conflux network that store block headers only, and retrieve everything else from their peers on-demand. This means that by default, light nodes do not store transactions, nor do they store the state trees. This can drastically reduce the disk and bandwidth use of light nodes compared to full and archive nodes, especially under high TPS. As a trade-off, RPC queries have a higher latency on light nodes.

Light nodes execute GHAST consensus on their local header graph, and they also verify each item retrieved on-demand using Merkle proofs and other similar mechanisms. Items retrieved on-demand include accounts, bloom filters, transactions, and transaction receipts. This means that, while light nodes need to rely on their peers to fulfill RPC queries, they do this in a trustless manner.

**The current light node implementation is still considered experimental, bugs are expected to exist. If you encounter any issues, please let us know by opening an issue on the [conflux-rust](https://github.com/Conflux-Chain/conflux-rust/issues) repository.**


## Running a light node

Light nodes are implemented as a part of the official `conflux-rust` binary and can be enabled using the `--light` command line flag.

Please start by downloading the latest release from the [conflux-rust](https://github.com/Conflux-Chain/conflux-rust/releases) repository, or by building from source following [this](installation) guide. Then, you can simply run the node using these commands:

```
> cd run
> ./conflux --config hydra.toml --light 2> stderr.txt
```

Alternatively, if you want your node to connect to the testnet, you will need to pass `testnet.toml` instead. Similarly to full nodes, you will know when your node is fully synced with the network once it prints:

```
Catch-up mode: false
```


## Interacting with a light node

Similarly to full and archive nodes, you can interact with a light node through an HTTP, TCP, or WebSocket connection. By default, local HTTP queries are enabled through port `12539`. For details, please refer to the [JSON-RPC](json_rpc) documentation.


### RPC queries

Light nodes support most Conflux RPC APIs, and support for the rest is also [on the way](https://github.com/Conflux-Chain/conflux-rust/issues/1461). As light nodes need to query their peers to fulfill RPC requests, the overall latency is slightly larger. (It is significantly larger for `cfx_getLogs`, see [below](#im-searching-through-event-logs-why-is-it-so-slow).)

```
> curl -X POST --data '{ "jsonrpc": "2.0", "method": "cfx_clientVersion", "id": 1 }' -H "Content-Type: application/json" localhost:12539
{ "jsonrpc": "2.0", "result": "conflux-rust-1.0.0", "id": 1 }

> curl -X POST --data '{ "jsonrpc":"2.0", "method":"cfx_getBalance", "params": ["cfx:type.user:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg"], "id": 2 }' -H "Content-Type: application/json" localhost:12539
{ "jsonrpc": "2.0", "result": "0x5fc346d4363f84249d4a", "id": 2 }

> curl -X POST --data '{ "jsonrpc": "2.0", "method": "cfx_getLogs", "params": [{ "address": "cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp", "fromEpoch": "0x1c8b8", "toEpoch": "0x1c8d6" }], "id": 3}' -H "Content-Type: application/json" localhost:12539
{ "jsonrpc": "2.0", "result": [{ "address": "CFX:TYPE.CONTRACT:ACC7UAWF5UBTNMEZVHU9DHC6SGHEA0403Y2DGPYFJP", "blockHash": "0x694898c77602511b6c411860ec230ac7ca58c08a4cbe3cad904e724b2eb97fee", "data": "0x0000000000000000000000000000000000000000000000049b9ca9a694340000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000141da5f533abef1b82a4a6d698415b8a56894b7b410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "epochNumber": "0x1c8bf", "logIndex": "0x0", "topics": ["0x06b541ddaa720db2b10a4d0cdac39b8d360425fc073085fac19bc82614677987","0x0000000000000000000000001da5f533abef1b82a4a6d698415b8a56894b7b41","0x0000000000000000000000001da5f533abef1b82a4a6d698415b8a56894b7b41","0x00000000000000000000000080bb30efc5683758128b404fe5da03432eb16634"], "transactionHash": "0x7dcfeb245369e509f2d154f2d5523e3ebe0b54f1d420e02edf56c70cdcae278d", "transactionIndex": "0x0", "transactionLogIndex": "0x0" },{ "address": "CFX:TYPE.CONTRACT:ACC7UAWF5UBTNMEZVHU9DHC6SGHEA0403Y2DGPYFJP", "blockHash": "0x694898c77602511b6c411860ec230ac7ca58c08a4cbe3cad904e724b2eb97fee", "data": "0x0000000000000000000000000000000000000000000000049b9ca9a694340000", "epochNumber": "0x1c8bf", "logIndex": "0x1", "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000001da5f533abef1b82a4a6d698415b8a56894b7b41","0x00000000000000000000000080bb30efc5683758128b404fe5da03432eb16634"], "transactionHash": "0x7dcfeb245369e509f2d154f2d5523e3ebe0b54f1d420e02edf56c70cdcae278d", "transactionIndex": "0x0", "transactionLogIndex": "0x1" }], "id": 3 } -H "Content-Type: application/json" localhost:12539
```

### JavaScript

Light nodes support most of the functionalities of the JavaScript SDK ([js-conflux-sdk](https://www.npmjs.com/package/js-conflux-sdk)). You can install the SDK using the following command:

```
> npm install --save js-conflux-sdk@1.0.0-beta.1
```

Then, you can query the blockchain and send transactions:

```js
const { Conflux, Drip } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x...';
const RECEIVER = 'cfx:type.user:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg';

async function main() {
  const conflux = new Conflux({ url: 'http://localhost:12539' });

  // query node version
  const client_version = await conflux.provider.call('cfx_clientVersion');
  console.log('client_version:', client_version);

  // query account balance
  const balance = await conflux.getBalance('cfx:type.user:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg');
  console.log('balance:', balance.toString(10));

  // query smart contract logs
  const logs = await conflux.getLogs({
    address: 'cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp',
    fromEpoch: 116920,
    toEpoch: 116950,
  });

  console.log('logs:', logs);

  // send transaction
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY);

  const tx = {
    from: account.address,
    to: RECEIVER,
    value: Drip.fromCFX(0.1),
    gasPrice: '0x1',
  };

  try {
    const receipt = await conflux.sendTransaction(tx).executed();
    console.log('receipt:', receipt);
  } catch (e) {
    console.error(e);
  }
}

main();
```

### Other SDKs

While it has not been tested, light nodes are expected to work with the Java and Go SDKs as well.


## Troubleshooting

#### Why do I get an error when calling a contract method?

If you run the following code:

```js
const admin = await cfx.InternalContract('AdminControl').getAdmin('cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp');
console.log('admin:', admin);
```

... you will get this error:

```
RPCError: This API is not implemented yet
    at HttpProvider.call
    at processTicksAndRejections
    at async Conflux.call
    at async MethodTransaction.call
    at async MethodTransaction.then {
  code: -32000,
  data: 'Tracking issue: https://github.com/Conflux-Chain/conflux-rust/issues/1461'
}
```

This is because contract calls use the `cfx_call` RPC API which is not yet supported on light nodes. For details, please refer to [this](#rpc-availability) table.

Suppose you would like to send a transaction to a smart contract:

```js
conflux.InternalContract('AdminControl').setAdmin('cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp', 'cfx:type.user:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg').sendTransaction({
  from: account,
}).executed();
```

You will get a similar error. This is because for contract transactions, `js-conflux-sdk` will automatically attempt to estimate the gas limit and storage limit using the `cfx_estimateGasAndCollateral` RPC which is not yet supported on light nodes. You can address this by manually setting these parameters:

```js
conflux.InternalContract('AdminControl').setAdmin('cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp', 'cfx:type.user:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg').sendTransaction({
  from: account,
  gas: '0x1111',
  storageLimit: '0x0',
  gasPrice: '0x1',
}).executed();
```

If you encounter a `This API is not implemented yet` error, you can set the debug logger on the conflux object to find out which RPC is causing it.

```js
const cfx = new Conflux({
  url: 'http://localhost:12539',
  logger: console,
});
```


#### Why do I see timeout instead of null?

For most operations, you might sometimes see a timeout error:

```
RPCError: Operation timeout: "Timeout while retrieving transaction with hash 0x497755f45baef13a35347933c48c0b8940f2cc3347477b5ed9f165581b082699"
```

This is because light nodes have to retrieve transactions and other items from their peers. If no peer responds within 4 seconds, you will get a timeout error. In most cases, retrying the query will succeed.

You will also get a timeout if you call `conflux.getTransactionByHash` and pass a transaction hash that does not exist. This is because the *"non-existence"* or transactions is not something light nodes can verify, so returning `null` might be misleading. This behavior might change in the future.


#### I'm searching through event logs, why is it so slow?

Log filtering is a very expensive operation on light nodes. For each epoch in the range you specify, the node needs to perform 1 to 3 queries. We recommend you make multiple queries with smaller epoch ranges.

Instead of...

```js
const fromEpoch = 110000;
const toEpoch = 119999;

// NOT RECOMMENDED
const logs = await cfx.getLogs({ fromEpoch, toEpoch, address: 'cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp' });
console.log('logs:', logs);
```

... you are encouraged to do this:

```js
for (ii = 0; ii < 10; ++ii) {
  const fromEpoch = 110000 + ii * 1000;
  const toEpoch = 110000 + (ii + 1) * 1000 - 1;
  const logs = await cfx.getLogs({ fromEpoch, toEpoch, address: 'cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp' });
  console.log('logs:', logs);
}
```


## RPC availability

| RPC                                                                                       |                               supported                              |
|-------------------------------------------------------------------------------------------|:--------------------------------------------------------------------:|
| [`cfx_call`](json_rpc#cfx_call)                                                           | [not yet](https://github.com/Conflux-Chain/conflux-rust/issues/1461) |
| [`cfx_checkBalanceAgainstTransaction`](json_rpc#cfx_checkbalanceagainsttransaction)       |                                  OK                                  |
| [`cfx_clientVersion`](json_rpc#cfx_clientversion)                                         |                                  OK                                  |
| [`cfx_epochNumber`](json_rpc#cfx_epochnumber)                                             |                                  OK                                  |
| [`cfx_estimateGasAndCollateral`](json_rpc#cfx_estimategasandcollateral)                   | [not yet](https://github.com/Conflux-Chain/conflux-rust/issues/1461) |
| [`cfx_gasPrice`](json_rpc#cfx_gasprice)                                                   |                                  OK                                  |
| [`cfx_getAccount`](json_rpc#cfx_getaccount)                                               |                                  OK                                  |
| [`cfx_getAccumulateInterestRate`](json_rpc#cfx_getaccumulateinterestrate)                 |                                  OK                                  |
| [`cfx_getAdmin`](json_rpc#cfx_getadmin)                                                   |                                  OK                                  |
| [`cfx_getBalance`](json_rpc#cfx_getbalance)                                               |                                  OK                                  |
| [`cfx_getBestBlockHash`](json_rpc#cfx_getbestblockhash)                                   |                                  OK                                  |
| [`cfx_getBlockByEpochNumber`](json_rpc#cfx_getblockbyepochnumber)                         |                                  OK                                  |
| [`cfx_getBlockByHash`](json_rpc#cfx_getblockbyhash)                                       |                                  OK                                  |
| [`cfx_getBlockByHashWithPivotAssumption`](json_rpc#cfx_getblockbyhashwithpivotassumption) |                                  OK                                  |
| [`cfx_getBlockRewardInfo`](json_rpc#cfx_getblockrewardinfo)                               | [not yet](https://github.com/Conflux-Chain/conflux-rust/issues/1461) |
| [`cfx_getBlocksByEpoch`](json_rpc#cfx_getblocksbyepoch)                                   |                                  OK                                  |
| [`cfx_getCode`](json_rpc#cfx_getcode)                                                     |                                  OK                                  |
| [`cfx_getCollateralForStorage`](json_rpc#cfx_getcollateralforstorage)                     |                                  OK                                  |
| [`cfx_getConfirmationRiskByHash`](json_rpc#cfx_getconfirmationriskbyhash)                 |                                  OK                                  |
| [`cfx_getInterestRate`](json_rpc#cfx_getinterestrate)                                     |                                  OK                                  |
| [`cfx_getLogs`](json_rpc#cfx_getlogs)                                                     |                                  OK                                  |
| [`cfx_getNextNonce`](json_rpc#cfx_getnextnonce)                                           |                                  OK                                  |
| [`cfx_getSkippedBlocksByEpoch`](json_rpc#cfx_getskippedblocksbyepoch)                     |                                  OK                                  |
| [`cfx_getSponsorInfo`](json_rpc#cfx_getsponsorinfo)                                       |                                  OK                                  |
| [`cfx_getStakingBalance`](json_rpc#cfx_getstakingbalance)                                 |                                  OK                                  |
| [`cfx_getStatus`](json_rpc#cfx_getstatus)                                                 |                                  OK                                  |
| [`cfx_getStorageAt`](json_rpc#cfx_getstorageat)                                           |                                  OK                                  |
| [`cfx_getStorageRoot`](json_rpc#cfx_getstorageroot)                                       |                                  OK                                  |
| [`cfx_getTransactionByHash`](json_rpc#cfx_gettransactionbyhash)                           |                                  OK                                  |
| [`cfx_getTransactionReceipt`](json_rpc#cfx_gettransactionreceipt)                         |                                  OK                                  |
| [`cfx_sendRawTransaction`](json_rpc#cfx_sendrawtransaction)                               |                                  OK                                  |