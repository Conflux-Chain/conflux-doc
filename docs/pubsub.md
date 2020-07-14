---
id: pubsub
title: Publish-Subscribe API
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/pubsub.md
keywords:
  - conflux
  - pubsub
  - sdk
---

The Publish-Subscribe API of Conflux (also called pub-sub) makes it possible to query certain items on an ongoing basis, without polling through the JSON-RPC HTTP interface. You can use this API on top of a TCP or WebSocket connection.

To use the pub-sub API, please make sure that you have access to a node with its TCP or WebSocket port open. If you maintain your own node, you can set these using the `--jsonrpc-tcp-port PORT` and `--jsonrpc-ws-port PORT` CLI flags (see `conflux --help`) or through the `jsonrpc_tcp_port` and `jsonrpc_ws_port` configuration parameters (see `run/default.toml`). In this document, we will use the default TCP (`12536`) and WebSocket (`12535`) ports.

## Subscriptions

You can subscribe to a topic through a `cfx_subscribe` JSON-RPC call. This will result in a subscription ID, which can later be used to unsubscribe through a `cfx_unsubscribe` JSON-RPC call.

The following example shows how to create a subscription over a TCP connection using `nc` (`netcat`):

```json
> nc localhost 12536
{ "jsonrpc": "2.0", "method": "cfx_subscribe", "params": ["topic"], "id": 1 }
{ "jsonrpc": "2.0", "result": "0x2ee8e71befef9049", "id": 1 }
...
{ "jsonrpc": "2.0", "method": "cfx_unsubscribe", "params": ["0x2ee8e71befef9049"], "id": 2 }
{ "jsonrpc": "2.0", "result": true, "id": 2 }
```

The following example shows how to create a subscription over a WebSocket connection using `websocat`:

```json
> websocat ws://localhost:12535
{ "jsonrpc": "2.0", "method": "cfx_subscribe", "params": ["topic"], "id": 1 }
{ "jsonrpc": "2.0", "result": "0x2ee8e71befef9049", "id": 1 }
...
{ "jsonrpc": "2.0", "method": "cfx_unsubscribe", "params": ["0x2ee8e71befef9049"], "id": 2 }
{ "jsonrpc": "2.0", "result": true, "id": 2 }
```

Currently, we support the following topics: `newHeads`, `epochs`, `logs`.

## `newHeads`

The `newHeads` topic streams all new block headers participating in the consensus.

```json
{ "jsonrpc": "2.0", "method": "cfx_subscribe", "params": ["newHeads"], "id": 1 }
{ "jsonrpc": "2.0", "result": "0x2ee8e71befef9049", "id": 1 }

{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "adaptive": false, "blame": 0, "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5", "deferredReceiptsRoot": "0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c", "deferredStateRoot": "0x72884d26f7de73cce4a06bddb985a7d9f8406c836dffdc8000f309684e55f9f3", "difficulty": "0x4", "epochNumber": "0x6a", "gasLimit": "0xb2d05e00", "hash": "0xcdd3831280b42552c4bdfe2893892d96008f1788f37122cbccf09b172f7035df", "height": "0x6a", "miner": "0xa8b427ecb70fdddbef0cda1a1dac0dfa8fb49943", "nonce": "0xd68368be06ba1a73", "parentHash": "0x16a3dfdb6beeb91a36019efedcb4863b854d98353ed1b260e4088f3cbb6510ad", "refereeHashes": [], "stable": true, "timestamp": "0x5e478223", "transactionsRoot": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347" }, "subscription": "0x7b40ad26c24752d3" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "adaptive": false, "blame": 0, "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5", "deferredReceiptsRoot": "0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c", "deferredStateRoot": "0xd7bb2ad6406b7ec8c4ed3f424b5cb08f23483a6208f1c551e7f8a54e7c764462", "difficulty": "0x4", "epochNumber": "0x6b", "gasLimit": "0xb2d05e00", "hash": "0xd8f1eead32f32fdd909e3654357d90846114e26931448701af086a41fcf725ef", "height": "0x6b", "miner": "0xa8b427ecb70fdddbef0cda1a1dac0dfa8fb49943", "nonce": "0xf590aad206a65c1c", "parentHash": "0xcdd3831280b42552c4bdfe2893892d96008f1788f37122cbccf09b172f7035df", "refereeHashes": [], "stable": true, "timestamp": "0x5e478224", "transactionsRoot": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347" }, "subscription": "0x7b40ad26c24752d3" }}
...
```

## `epochs`

The `epochs` topic streams consensus results: the total order of blocks, as expressed by a sequence of epochs.

The returned series of epoch numbers is monotonically increasing with an increment of one. If you see the same epoch twice, this suggests a pivot chain reorg has happened (this might happen for recent epochs).

```json
{ "jsonrpc": "2.0", "method": "cfx_subscribe", "params": ["epochs"], "id": 1 }
{ "jsonrpc": "2.0", "result": "0xde5801fda9520049", "id": 1 }

{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x6a7", "epochHashesOrdered": ["0x6f21f408476f404ecc07f0a52170ffdf62ca23497bdc3e3d64429b2c26308e00"]}, "subscription": "0xcd73be4533944f33" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x6a8", "epochHashesOrdered": ["0x1bb99ee21dade175959da6a0a373a6f75732a2a7ea67adbda97f1bf7b4574ff1"]}, "subscription": "0xcd73be4533944f33" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x6a8", "epochHashesOrdered": ["0xd8d4ed0ff02c3d61bbcd13095b1a4d21eb43cee8c40e7e7e7c5a41a861cda409"]}, "subscription": "0xcd73be4533944f33" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x6a9", "epochHashesOrdered": ["0x1bb99ee21dade175959da6a0a373a6f75732a2a7ea67adbda97f1bf7b4574ff1", "0x9df97d1c8228d33dacd7367e4db4fd29f879fcf2679f947ee90f5d4ce035a206"]}, "subscription": "0xcd73be4533944f33" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x6aa", "epochHashesOrdered": ["0xe322882ee1acb79e0b7eb394db9aeede67c6198641762da8a50b4bb6b48cc2a4"]}, "subscription": "0xcd73be4533944f33" }}
...
```

For each epoch, the **last** hash in `epochHashesOrdered` is the hash of the pivot block. In the example above, we know that currently the last section of the pivot chain is:

```
0x6f21f408476f404ecc07f0a52170ffdf62ca23497bdc3e3d64429b2c26308e00 (epoch 0x6a7)
0xd8d4ed0ff02c3d61bbcd13095b1a4d21eb43cee8c40e7e7e7c5a41a861cda409 (epoch 0x6a8)
0x9df97d1c8228d33dacd7367e4db4fd29f879fcf2679f947ee90f5d4ce035a206 (epoch 0x6a9)
0xe322882ee1acb79e0b7eb394db9aeede67c6198641762da8a50b4bb6b48cc2a4 (epoch 0x6aa)
```

## `logs`

The `logs` topic streams all logs matching a certain filter, in order.

The filter format follows that of the `cfx_getLogs` JSON-RPC API. It is a JSON object with the (optional) fields `address` (contract address), and `topics` (order-dependent array of indexed log topics).

In case of a pivot chain reorg (which might affect recent logs), a special `revert` message is sent. All logs received previously that belong to epochs larger than the one in this message should be considered invalid.

```json
{ "jsonrpc": "2.0", "method": "cfx_subscribe", "params": ["logs", { "topics": ["0xc822296d568499547c3a5b93a500428bab54ef8f6a481f352c7086f1daf4277f"] }], "id": 1 }
{ "jsonrpc": "2.0", "result": "0x2dd59588c475a772", "id": 1 }

{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x3f3", "transactionHash": "0x89ee0aa76bc1a7c9340f3efcfc7c8263a212cadcb32f0231ef1395ef9c587899", "address": "0x67ca8b02599f2001cdf453722a01e243af936998", "blockHash": "0x929ad718797e03cce31f66f234e12893c8be5e959dba14b8328205c9c136ddbe", "data": "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d", "logIndex": "0x0", "topics": ["0xc822296d568499547c3a5b93a500428bab54ef8f6a481f352c7086f1daf4277f", "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d"], "transactionIndex": "0x0", "transactionLogIndex": "0x0" }, "subscription": "0x2dd59588c475a772" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x40f", "transactionHash": "0x5cf00bb4ee966c340f459c57a53e4be7357bdf23bb055a95066d4408d5ecf118", "address": "0x9c1b6fa76370402ae1543fb2a3ee4639b127924d", "blockHash": "0xede319ddfa7a9710aef627aa152052da190d3798d2ad7fd7da8d953b48a1785e", "data": "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d", "logIndex": "0x0", "topics": ["0xc822296d568499547c3a5b93a500428bab54ef8f6a481f352c7086f1daf4277f", "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d"], "transactionIndex": "0x0", "transactionLogIndex": "0x0" }, "subscription": "0x2dd59588c475a772" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x41a", "transactionHash": "0xf639c7b26df0d60bc8306c7877d7ec3c361b2157d14b12b704ea5500d70d8798", "address": "0xdb65afacffa38d611f6f58d5bdb62e447074d247", "blockHash": "0x3742f695f9b2270b51b9a409ff499caf298dd46dc9d3bbe8360c4997ce9b00c7", "data": "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d", "logIndex": "0x0", "topics": ["0xc822296d568499547c3a5b93a500428bab54ef8f6a481f352c7086f1daf4277f", "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d"], "transactionIndex": "0x0", "transactionLogIndex": "0x0" }, "subscription": "0x2dd59588c475a772" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "revertTo": "0x40f" }, "subscription": "0x2dd59588c475a772" }}
{ "jsonrpc": "2.0", "method": "cfx_subscription", "params": { "result": { "epochNumber": "0x410", "transactionHash": "0xf639c7b26df0d60bc8306c7877d7ec3c361b2157d14b12b704ea5500d70d8798", "address": "0x7877422249471ea4295a4b6c638888027147ad6e", "blockHash": "0x24faa39196ee34d1d04cd4c44012bd28a757b251e0551d9503bf6685b467e0d5", "data": "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d", "logIndex": "0x0", "topics": ["0xc822296d568499547c3a5b93a500428bab54ef8f6a481f352c7086f1daf4277f", "0x000000000000000000000000f8b133b3dad547cdf0be685399b39241f2e6e77d"], "transactionIndex": "0x0", "transactionLogIndex": "0x0" }, "subscription": "0x2dd59588c475a772" }}
...
```

In the example above, the `revert` message **invalidates all logs with an epoch number greater than `0x40f`** (i.e. epochs `0x410`, `0x411`, etc). The log associated with transaction `0xf639c7b...` is executed and published again. This time, the transaction ends up in epoch `0x410` instead of `0x41a`. All logs in the epochs up to (and including) **`0x40f`** remain valid.

*Note: The `logs` pub-sub topic is not supported on light nodes.*

## Node.js example

Below is a simple example of using the pub-sub API through Node.js. In this example, we detect pivot chain reorgs using the `epochs` topic. We rely on 3rd-party libraries, as `js-conflux-sdk` does not support the pub-sub API yet. For simplicity, we omit error handling.

```node
const WebSocket = require('ws');
const jsonrpc = require('jsonrpc-lite');

const ws = new WebSocket('ws://localhost:12535');

ws.on('open', function open() {
  const req = jsonrpc.request('1', 'cfx_subscribe', ["epochs"]);
  ws.send(JSON.stringify(req));
});

let latest_epoch = 0;

ws.on('message', function incoming(data) {
  item = jsonrpc.parse(data);

  if (item.type == 'notification') {
    let epoch = Number(item.payload.params.result.epochNumber);

    if (epoch < latest_epoch) {
      console.log(`chain reorg of depth ${latest_epoch - epoch} (${latest_epoch} --> ${epoch})`);
    }

    latest_epoch = epoch;
  }
});
```

Example output:

```
chain reorg of depth 1 (39379 --> 39378)
chain reorg of depth 1 (39425 --> 39424)
chain reorg of depth 2 (39430 --> 39428)
chain reorg of depth 1 (39520 --> 39519)
chain reorg of depth 1 (39562 --> 39561)
...
```

*Note: shallow chain reorgs are quite common as the end of the pivot chain tends to oscillate before it stabilizes.*