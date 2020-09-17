---
id: json_rpc
title: JSON RPC
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/json-rpc.md
keywords:
  - conflux
  - json-rpc
  - sdk
---

The Conflux JSON-RPC API is a collection of interfaces which allow you to interact with a local or remote Conflux node, using an HTTP connection in JSON-RPC protocol.

The following is an API reference documentation with examples.

## JSON-RPC
JSON is a lightweight data-interchange format. It can represent numbers, strings, ordered sequences of values, and collections of name/value pairs.

JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol. Primarily this specification defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over HTTP, or in many various message passing environments. It uses JSON (RFC 4627) as data format.

## JavaScript API
There is also a JavaScript library [js-conflux-sdk](https://github.com/Conflux-Chain/js-conflux-sdk) provided, for you to interact with a Conflux node from inside a JavaScript application, which gives a convenient interface for the RPC methods.

## JSON-RPC endpoint && support
Currently, Conflux has a [Rust implementation](https://github.com/Conflux-Chain/conflux-rust) that supports JSON-RPC 2.0 and HTTP.

## HEX value encoding
At present there are two key datatypes that are passed over JSON: unformatted byte arrays and quantities. Both are passed with a hex encoding, however with different requirements to formatting:

When encoding **QUANTITIES** (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0"). Examples:

* 0x41 (65 in decimal)
* 0x400 (1024 in decimal)
* WRONG: 0x (should always have at least one digit - zero is "0x0")
* WRONG: 0x0400 (no leading zeroes allowed)
* WRONG: ff (must be prefixed 0x)

When encoding **UNFORMATTED DATA** (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte. Examples:

* 0x41 (size 1, "A")
* 0x004200 (size 3, "\0B\0")
* 0x (size 0, "")
* WRONG: 0xf0f0f (must be even number of digits)
* WRONG: 004200 (must be prefixed 0x)

## The epoch number parameter
The following methods have an epoch number parameter:

* cfx_call
* cfx_epochNumber
* cfx_estimateGasAndCollateral
* cfx_getAccumulateInterestRate
* cfx_getAdmin
* cfx_getBalance
* cfx_getBlockByEpochNumber
* cfx_getBlocksByEpoch
* cfx_getCode
* cfx_getCollateralForStorage
* cfx_getInterestRate
* cfx_getNextNonce
* cfx_getSponsorInfo
* cfx_getStakingBalance
* cfx_getStorageAt
* cfx_getStorageRoot

When requests are made that act on the state of conflux, the epoch number parameter determines the height of the epoch. The following options are possible for the epoch number parameter:

* `HEX String` - an integer epoch number
* `String "earliest"` for the epoch of the genesis block
* `String "latest_checkpoint"` for the earliest epoch stored in memory
* `String "latest_state"` - for the latest epoch that has been executed
* `String "latest_mined"` - for the latest known epoch

<!---
TODO: Add links to deferred execution documentation.
-->

Please note that due to performance optimization, the latest mined epochs are not executed, so there is no state available for these epochs. For most RPCs related to state query, `"latest_state"` is recommended.

## Curl Examples Explained
The curl options below might return a response where the node complains about the content type, this is because the --data option sets the content type to application/x-www-form-urlencoded . If your node does complain, manually set the header by placing -H "Content-Type: application/json" at the start of the call.

The examples also include the URL/IP & port combination which must be the last argument given to curl e.x. ```http://localhost:12345```

Example for [cfx_getBestBlockHash](#cfx_getbestblockhash)

```
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBestBlockHash","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:12345
```

## Migrating from Ethereum JSON-RPC
There is a correspondence between some JSON-RPCs from Ethereum and Conflux.

Even though the details of JSON-RPC may defer from each other, the following mapping table could be helpful on migrating from Ethereum to Conflux:

* eth_gasPrice => cfx_gasPrice
* eth_blockNumber => cfx_epochNumber
* eth_getBalance => cfx_getBalance
* eth_getStorageAt => cfx_getStorageAt
* eth_getTransactionCount => cfx_getNextNonce
* eth_getCode => cfx_getCode
* eth_sendRawTransaction => cfx_sendRawTransaction
* eth_call => cfx_call
* eth_estimateGas => cfx_estimateGasAndCollateral
* eth_getBlockByHash => cfx_getBlockByHash
* eth_getBlockByNumber => cfx_getBlockByEpochNumber
* eth_getTransactionByHash => cfx_getTransactionByHash
* eth_getTransactionReceipt => cfx_getTransactionReceipt
* eth_getLogs => cfx_getLogs

## JSON-RPC methods

#### cfx_getTransactionByHash 
Returns the information about a transaction requested by transaction hash.
##### Parameters
 1. DATA, 32 Bytes - hash of a transaction
```
params: [
    "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
]
```
##### Returns
`Object` - A transaction object, or `null` when no transaction was found:

* `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in and got executed. `null` when its pending.
* `contractCreated`: `DATA`, 20 Bytes - address of created contract. `null` when it's not a contract creating transaction.
* `data`: `DATA` - the data send along with the transaction.
* `from`: `DATA`, 20 Bytes - address of the sender.
* `gas`: `QUANTITY` - gas provided by the sender.
* `gasPrice`: `QUANTITY` - gas price provided by the sender in Drip.
* `hash`: `DATA`, 32 Bytes - hash of the transaction.
* `nonce`: `QUANTITY` - the number of transactions made by the sender prior to this one.
* `r`: `DATA`, 32 Bytes - ECDSA signature r
* `s`: `DATA`, 32 Bytes - ECDSA signature s
* `status`: `QUANTITY` - 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
* `to`: `DATA`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
* `transactionIndex`: `QUANTITY` - integer of the transaction's index position in the block. `null` when its pending.
* `v`: `QUANTITY` - ECDSA recovery id
* `value`: `QUANTITY` - value transferred in Drip.

##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getTransactionByHash","params":["0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "blockHash": "0xbb1eea3c8a574dc19f7d8311a2096e23a39f12e649a20766544f2df67aac0bed",
    "contractCreated": null,
    "data": "0x",
    "from": "0xb2988210c05a43ebd76575f5421ef84b120ebf80",
    "gas": "0x5208",
    "gasPrice": "0x174876e800",
    "hash": "0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514",
    "nonce": "0x1",
    "r": "0x27e5cb110dd198b8fc963d4741ec0840400a6351d9e0c458eeda6af5e0a12760",
    "s": "0x2c486d8e26da3c867fbcf4ab242af1265a5036c5e23ea42c8ab23437ce4c0bca",
    "status": "0x0",
    "to": "0xb2988210c05a43ebd76575f5421ef84b120ebf80",
    "transactionIndex": "0x0",
    "v": "0x1",
    "value": "0x3635c9adc5dea00000"
  },
  "id": 1
}
```
---

#### cfx_getBlockByHash 
Returns information about a block by hash.
##### Parameters
  1. `DATA`, 32 Bytes - Hash of a block.
  2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
```
params: [
    "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
    true
]
```
##### Returns
`Object` - A block object, or `null` when no block was found:

* `adaptive`: `Boolean` - If `true` the weight of the block is adaptive under GHAST rule, if `false` otherwise.
* `blame`: `QUANTITY` - If 0, then no blocks are blamed on its parent path, If greater than 0, then the nearest blamed block on the parent path is `blame` steps away.
* `deferredLogsBloomHash`: `DATA`, 32 Bytes - The bloom hash of deferred logs.
* `deferredReceiptsRoot`: `DATA`, 32 Bytes - the hash of the receipts of the block after deferred execution.
* `deferredStateRoot`: `DATA`, 32 Bytes - the root of the final state trie of the block after deferred execution.
* `difficulty`: `QUANTITY` - integer of the difficulty for this block.
* `epochNumber`: `QUANTITY` - the current block epoch number in the client's view. `null` when it's not in best block's past set and the epoch number is not determined.
* `gasLimit`: `QUANTITY` - the maximum gas allowed in this block.
* `gasUsed`: `QUANTITY` - total used gas in this block. `null` when its pending block.
* `hash`: `DATA`, 32 Bytes - hash of the block. `null` when its pending block.
* `height`: `QUANTITY` - the block heights. `null` when its pending block.
* `miner`: `DATA`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
* `nonce`: `DATA`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
* `parentHash`: `DATA`, 32 Bytes - hash of the parent block.
* `powQuality`: , `DATA`, Bytes - hash of the generated proof-of-work. `null` when its pending block.
* `refereeHashes`: `Array` - Array of referee hashes.
* `size`: `QUANTITY` - integer the size of this block in bytes.
* `timestamp`: `QUANTITY` - the unix timestamp for when the block was collated.
* `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
* `transactionsRoot`: `DATA`, 32 Bytes - the hash of the transactions of the block.

##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBlockByHash","params":["0x692373025c7315fa18b2d02139d08e987cd7016025920f59ada4969c24e44e06", false],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "adaptive": false,
    "blame": 0,
    "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
    "deferredReceiptsRoot": "0x522717233b96e0a03d85f02f8127aa0e23ef2e0865c95bb7ac577ee3754875e4",
    "deferredStateRoot": "0xd449df4ba49f5ab02abf261e976197beecf93c5198a6f0b6bd2713d84115c4ec",
    "difficulty": "0xeee440",
    "epochNumber": "0x1394cb",
    "gasLimit": "0xb2d05e00",
    "hash": "0x692373025c7315fa18b2d02139d08e987cd7016025920f59ada4969c24e44e06",
    "height": "0x1394c9",
    "miner": "0x000000000000000000000000000000000000000b",
    "nonce": "0x329243b1063c6773",
    "parentHash": "0xd1c2ff79834f86eb4bc98e0e526de475144a13719afba6385cf62a4023c02ae3",
    "powQuality": "0x2ab0c3513",
    "refereeHashes": [
      "0xcc103077ede14825a5667bddad79482d7bbf1f1a658fed6894fa0e9287fc6be1"
    ],
    "size": "0x180",
    "timestamp": "0x5e8d32a1",
    "transactions": [
      "0xedfa5b9c38ba51e791cc72b8f75ff758533c8c38f426eddee3fd95d984dd59ff"
    ],
    "transactionsRoot": "0xfb245dae4539ea49812e822adbffa9dd2ee9b3de8f3d9a7d186d351dcc9a6ed4"
  },
  "id": 1
}
```

---

#### cfx_getBlockByEpochNumber
Returns information about a block by epoch number.
##### Parameters
  1. `QUANTITY|TAG` - the epoch number, or the string `"latest_mined"`, `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter).
  2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
```
params: [
    "latest_mined",
    true
]
```
##### Returns
See [cfx_getBlockByHash](#cfx_getblockbyhash).

##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBlockByEpochNumber","params":["latest_mined", false],"id":1}'
```
Result see [cfx_getBlockByHash](#cfx_getblockbyhash).

---

#### cfx_getBestBlockHash
Returns the hash of best block.
##### Parameters
`none`
##### Returns
`DATA` , 32 Bytes - hash of the best block.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBestBlockHash","params":[],"id":1}'

// Result
{
    "result" : "0x7d54c03f4fe971d5c45d95dddc770a0ec8d5bd27d57c049ce8adc469269e35a4",
    "id" : 1,
    "jsonrpc" : "2.0"
}
```

---


#### cfx_epochNumber
Returns the epoch number of given parameter.
##### Parameters
`TAG` - (optional, default: `"latest_mined"`) String `"latest_mined"`, `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter).
##### Returns
`QUANTITY` - integer of the current epoch number of given parameter.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_epochNumber","params":[],"id":1}'

// Result
{
    "jsonrpc" : "2.0",
    "id" : 1,
    "result" : "0x49"
}
```

---

#### cfx_gasPrice
Returns the current price per gas in Drip.
##### Parameters
`none`
##### Returns
`QUANTITY` - integer of the current gas price in Drip.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_gasPrice","params":[],"id":1}'

// Result
{
    "jsonrpc" : "2.0",
    "id" : 1,
    "result" : "0x09184e72a000"
}
```

---

#### cfx_getBlocksByEpoch
Returns hashes of blocks located in some epoch.
##### Parameters
`QUANTITY|TAG` - the epoch number, or the string `"latest_mined"`, `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter).
##### Returns
`Array` - Array of block hashes, sorted by execution(topological) order.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBlocksByEpoch","params":["0x11"],"id":1}'

// Result
{
    "jsonrpc": "2.0",
    "result": [
        "0x618e813ed93f1020bab13a1ab77e1550da6c89d9c69de837033512e91ac46bd0",
        "0x0f6ac81dcbc612e72e0019681bcec32254a34bd29a6bbab91e5e8dc37ecb64d5",
        "0xad3238c00456adfbf847d251b004c1e306fe637227bb1b9917d77bd5b207af68",
        "0x0f92c2e796be7b016d8b74c6c270fb1851e47fabaca3e464d407544286d6cd34",
        "0x5bcc2b8d2493797fcadf7b80228ef5b713eb9ff65f7cdd86562db629d0caf721",
        "0x7fcdc6fff506b19a2bd72cd3430310915f19a59b046759bb790ba4eeb95e9956",
        "0xf4f33ed08e1c625f4dde608eeb92991d77fff26122bab28a6b3a2037511dcc83",
        "0xa3762adc7f066d5cb62c683c2655be3bc3405ff1397f77d2e1dbeff2d8522e00",
        "0xba7588476a5ec7e0ade00f060180cadb7430fd1be48940414baac48c0d39556d",
        "0xe4dc4541d07118b598b2ec67bbdaa219eb1d649471fe7b5667a0001d83b1e9b6",
        "0x93a15564544c57d6cb68dbdf60133b318a94439e1f0a9ccb331b0f5a0aaf8049"
    ],
    "id": 1
}
```
---

#### cfx_getBalance
Returns the balance of the account of given address.
##### Parameters
1. `DATA`, 20 Bytes - address to check for balance.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
   "latest_state"
]
```
##### Returns
`QUANTITY` - integer of the current balance in Drip.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBalance","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f", "latest_state"],"id":1}'

// Result
{
    "id":1,
    "jsonrpc": "2.0",
    "result": "0x0234c8a3397aab58" // 158972490234375000
}
```

---

#### cfx_getStakingBalance
Returns the balance of the staking account of given address.
##### Parameters
1. `DATA`, 20 Bytes - address to check for staking balance.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
   "latest_state"
]
```
##### Returns
`QUANTITY` - integer of the current staking balance in Drip.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getStakingBalance","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f", "latest_state"],"id":1}'

// Result
{
    "id":1,
    "jsonrpc": "2.0",
    "result": "0x0234c8a3397aab58" // 158972490234375000
}
```

---


#### cfx_getCollateralForStorage
Returns the size of the collateral storage of given address, in Byte.
##### Parameters
1. `DATA`, 20 Bytes - address to check for collateral storage.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
   "latest_state"
]
```
##### Returns
`QUANTITY` - integer of the collateral storage in Byte.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getCollateralForStorage","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f", "latest_state"],"id":1}'

// Result
{
    "id":1,
    "jsonrpc": "2.0",
    "result": "0x0234c8a8"
}
```

---

#### cfx_getAdmin
Returns the admin of given contract.
##### Parameters
1. `DATA`, 20 Bytes - address to contract.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f",
    "latest_state"
]
```
##### Returns
`DATA` - 20 Bytes - address to admin, or `0x0000000000000000000000000000000000000000` if the contract does not exist.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getAdmin","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c",
  "id": 1
}
```

---

#### cfx_getCode
Returns the code of given contract.
##### Parameters
1. `DATA`, 20 Bytes - address to contract.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f",
    "latest_state"
]
```
##### Returns
`DATA` - byte code of contract, or `0x` if the contract does not exist.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getCode","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f","latest_state"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": "0x",
  "id": 1
}
```

---

#### cfx_getStorageAt
Returns storage entries from a given contract.
##### Parameters
1. `DATA`, 20 Bytes - address to contract.
2. `DATA`, 32 Bytes - the given position.
3. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f",
    "0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9",
    "latest_state"
]
```
##### Returns
`DATA` - 32 Bytes - storage entry of given query, or `null` if the it does not exist.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getStorageAt","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f","0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9","latest_state"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": "0x000000000000000000000000000000000000000000000000000000000000162e",
  "id": 1
}
```

---

#### cfx_getStorageRoot

Returns the storage root of a given contract.

##### Parameters
1. `DATA`, 20 Bytes - address to contract.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f",
    "latest_state"
]
```

##### Returns

`Object` - A storage root object, or `null` if the contract does not exist:

* `delta`: `DATA`, 32 Bytes - storage root in the delta trie.
* `intermediate`: `DATA`, 32 Bytes - storage root in the intermediate trie.
* `snapshot`: `DATA`, 32 Bytes - storage root in the snapshot.

If all three of these fields match for two invocations of this RPC, the contract's storage is guaranteed to be identical.
If they do not match, storage has likely changed (or the system transitioned into a new era).

<!---
TODO: Add links to snapshot/checkpoint documentation.
-->

##### Example

```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getStorageRoot","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f","latest_state"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "delta": "0x0240a5a3486ac1cee71db22b8e12f1bb6ac9f207ecd81b06031c407663c20a94",
    "intermediate": "0x314a41f277b678a1dc811a1fc0393b6d30c35e900cb27762ec9e9042bfdbdd49",
    "snapshot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  },
  "id" :1
}
```

---

#### cfx_getSponsorInfo
Returns the sponsor info of given contract.
##### Parameters
1. `DATA`, 20 Bytes - address to contract.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f",
    "latest_state"
]
```
##### Returns
`Object` - A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be `0`:

   * `sponsorBalanceForCollateral`: `QUANTITY` - the sponsored balance for storage.
   * `sponsorBalanceForGas`: `QUANTITY` - the sponsored balance for gas.
   * `sponsorGasBound`: `QUANTITY` - the max gas could be sponsored for one transaction.
   * `sponsorForCollateral`: `DATA`, 20 Bytes - the address of the storage sponsor.
   * `sponsorForGas`: `DATA`, 20 Bytes - the address of the gas sponsor.

##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getSponsorInfo","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "sponsorBalanceForCollateral": "0x0",
    "sponsorBalanceForGas": "0x0",
    "sponsorForCollateral": "0x0000000000000000000000000000000000000000",
    "sponsorForGas": "0x0000000000000000000000000000000000000000",
    "sponsorGasBound": "0x0"
  },
  "id": 1
}
```

---
#### cfx_getNextNonce
Returns the next nonce should be used by given address.

##### Parameters
1. `DATA`, 20 Bytes - address.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
    "0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8",
    "latest_state" // state at the latest executed epoch
]
```
##### Returns
`QUANTITY` - integer of the next nonce should be used by given address.

##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getNextNonce","params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8", "latest_state"],"id":1}'

// Result
{
    "jsonrpc" : "2.0",
    "result" : "0x1",
    "id" : 1
}
```

---
#### cfx_sendRawTransaction
Creates new message call transaction or a contract creation for signed transactions.
##### Parameters
`DATA`, The signed transaction data.
```
params: [
    "0xf86eea8201a28207d0830f4240943838197c0c88d0d5b13b67e1bfdbdc132d4842e389056bc75e2d631000008080a017b8b26f473820475edc49bd153660e56b973b5985bbdb2828fceacb4c91f389a03452f9a69da34ef35acc9c554d7b1d63e9041141674b42c3abb1b57b9f83a2d3"
]
```
##### Returns
`DATA`, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.
##### Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_sendRawTransaction","params":[{see above}],"id":1}'

// Result
{
    "id":1,
    "jsonrpc": "2.0",
    "result": "0xf5338a6cb85d10acc9108869f94fe322b2dfa2715d16d264676c91f6a0404b61"
}
```

---

#### cfx_call
Virtually call a contract, return the output data.

##### Parameters
1. `Object` - A call request object:
  * `from`: `DATA`, 20 Bytes - (optional, default: random address) address of sender.
  * `to`: `DATA`, 20 Bytes - (optional, default: `null` for contract creation) address of receiver.
  * `gasPrice`: `QUANTITY` - (optional, default: `0`) gas price provided by the sender in Drip.
  * `gas`: `QUANTITY` - (optional, default: `500000000`) gas provided by the sender.
  * `value`: `QUANTITY` - (optional, default: `0`) value transferred in Drip.
  * `data`: `DATA` - (optional, default: `0x`) the data send along with the transaction.
  * `nonce`: `QUANTITY` - (optional, default: `0`) the number of transactions made by the sender prior to this one.

2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)

```
params: [
    {
        "from": "0xf6B7219AF657e14B5103e915839dD12f51cDBA68",
        "to": "0x63428378C5D7d168c9Ef2809a76812d40E018Ac9",
        "data": "0x",
        "gasPrice": "0x2540be400",
        "nonce": "0x0"
    },
    "latest_state" // state at the latest executed epoch
]
```
##### Returns
`DATA`, Bytes - the output data.
##### Example
```
// Request
curl -X POST --data '{"method":"cfx_call","id":1,"jsonrpc":"2.0","params":[{"from":"0xf6B7219AF657e14B5103e915839dD12f51cDBA68","to":"0x63428378C5D7d168c9Ef2809a76812d40E018Ac9","data":"0x","gasPrice":"0x2540be400","nonce":"0x0"}]}'

// Result
{
  "jsonrpc": "2.0",
  "result": "0x",
  "id": 1
}
```

---

#### cfx_estimateGasAndCollateral
Virtually call a contract, return the output data.

##### Parameters
See [cfx_call](#cfx_call).

```
params: [
    {
        "from": "0xf6B7219AF657e14B5103e915839dD12f51cDBA68",
        "to": "0x63428378C5D7d168c9Ef2809a76812d40E018Ac9",
        "data": "0x",
        "gasPrice": "0x2540be400",
        "nonce": "0x0"
    },
    "latest_state" // state at the latest executed epoch
]
```
##### Returns
`Object` - A estimate result object:
   * `gasUsed`: `QUANTITY` - gas used after execution.
   * `storageCollateralized`: `QUANTITY` - stroage collateralized, in Byte.

##### Example
```
// Request
curl -X POST --data '{"method":"cfx_estimateGasAndCollateral","id":1,"jsonrpc":"2.0","params":[{"from":"0xf6B7219AF657e14B5103e915839dD12f51cDBA68","to":"0x63428378C5D7d168c9Ef2809a76812d40E018Ac9","data":"0x","gasPrice":"0x2540be400","nonce":"0x0"}]}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "gasUsed": "0x5208",
    "storageCollateralized": "0x0"
  },
  "id": 1
}
```

---

#### cfx_getLogs
Returns logs matching the filter provided.
##### Parameters
`Object` - A log filter object:

   * `fromEpoch`: `QUANTITY|TAG` - (optional, default: `"latest_checkpoint"`) the epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter). Search will be applied from this epoch number.
   * `toEpoch`: `QUANTITY|TAG` - (optional, default: `"latest_state"`) the epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter). Search will be applied up until (and including) this epoch number.
   * `blockHashes`: `Array` of `DATA` - (optional, default: `null`) Array of up to 128 block hashes that the search will be applied to. This will override from/to epoch fields if it's not `null`.
   * `address`: `Array` of `DATA` - (optional, default: `null`) Search contract addresses. If `null`, match all. If specified, log must be produced by one of these addresses.
   * `topics`: `Array` - (optional, default: `null`) Search topics. Logs can have `4` topics: the function signature and up to `3` indexed event arguments. The elements of `topics` match the corresponding log topics. Example: `["0xA", null, ["0xB", "0xC"], null]` matches logs with `"0xA"` as the 1st topic AND (`"0xB"` OR `"0xC"`) as the 3rd topic. If `null`, match all.
   * `limit`: `QUANTITY` - (optional, default: `null`) If `null` return all logs, otherwise should only return the **last** `limit` logs. Note: if the node has `get_logs_filter_max_limit` set, it will override `limit` if it is `null` or greater than the preset value.
```
params: [
    {}
]
```
##### Returns
`Array` - Array of Log `Object`, that the logs matching the filter provided:

   * `address`: `DATA`, 20 Bytes - address of log.
   * `topics`: `Array` of `DATA` - Array of topics.
   * `data`: `DATA` - data of log.
   * `blockHash`: `DATA` - 32 Bytes - hash of the block where the log in.
   * `epochNumber`: `QUANTITY` - epoch number of the block where the log in.
   * `transactionHash`: `DATA`, 32 Bytes - hash of the transaction where the log in.
   * `transactionIndex`: `QUANTITY` - transaction index in the block.
   * `logIndex`: `QUANTITY` - log index in block.
   * `transactionLogIndex`: `QUANTITY` - log index in transaction.

##### Example
```
// Request
 curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getLogs","params":[{}],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": [
    {
      "address": "0x866aca87ff33a0ae05d2164b3d999a804f583222",
      "blockHash": "0x0ecbc75aca22cd1566a18c6a7a55f235ae12684c2749b40ac91262d6e8783b0b",
      "data": "0x",
      "epochNumber": "0x1504a7",
      "logIndex": "0x2",
      "topics": [
        "0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153",
        "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c",
        "0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b",
        "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c"
      ],
      "transactionHash": "0x2a696f7be50c364333bc145f082e79da3a6e730318b7f7822e3e1fe22e42560b",
      "transactionIndex": "0x0",
      "transactionLogIndex": "0x2"
    },
    {
      "address": "0x873c4bd4d847bcf7dc066bf4a7cd31dcf182258c",
      "blockHash": "0x0ecbc75aca22cd1566a18c6a7a55f235ae12684c2749b40ac91262d6e8783b0b",
      "data": "0x",
      "epochNumber": "0x1504a7",
      "logIndex": "0x3",
      "topics": [
        "0x0040d54d5e5b097202376b55bcbaaedd2ee468ce4496f1d30030c4e5308bf94d",
        "0x00000000000000000000000015cf2b2c91e6eff901f10ab7363ae58cf1bfccc5"
      ],
      "transactionHash": "0x2a696f7be50c364333bc145f082e79da3a6e730318b7f7822e3e1fe22e42560b",
      "transactionIndex": "0x0",
      "transactionLogIndex": "0x3"
    }
  ],
  "id": 1
}
```
---

#### cfx_getTransactionReceipt
Returns the information about a transaction receipt requested by transaction hash.
##### Parameters
 1. DATA, 32 Bytes - hash of a transaction
```
params: [
    "0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514",
]
```
##### Returns
`Object` - A transaction receipt object, or `null` when no transaction was found or the transaction was not executed yet:

* `transactionHash`: `DATA`, 32 Bytes - hash of the given transaction.
* `index`: `QUANTITY` - transaction index within the block.
* `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in and got executed.
* `epochNumber`: `QUANTITY` - epoch number of the block where this transaction was in and got executed.
* `from`: `DATA`, 20 Bytes - address of the sender.
* `to`: `DATA`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
* `gasUsed`: `QUANTITY` - gas used the transaction.
* `contractCreated`: `DATA`, 20 Bytes - address of created contract. `null` when it's not a contract creating transaction.
* `stateRoot`: `DATA`, 32 Bytes - hash of the state root.
* `outcomeStatus`: `QUANTITY` - the outcome status code.
* `logsBloom`: `DATA`, 256 Bytes - bloom filter for light clients to quickly retrieve related logs.
* `logs`: `Array` - Array of log objects, which this transaction generated, see [cfx_getLogs](#cfx_getlogs)

##### Example
```
// Request
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"cfx_getTransactionReceipt","params":["0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "blockHash": "0xbb1eea3c8a574dc19f7d8311a2096e23a39f12e649a20766544f2df67aac0bed",
    "contractCreated": null,
    "epochNumber": 451990,
    "from": "0xb2988210c05a43ebd76575f5421ef84b120ebf80",
    "gasUsed": "0x5208",
    "index": 0,
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "outcomeStatus": 0,
    "stateRoot": "0x1bc37c63c03d7e7066f9427f69e515988d19ebb26998087d75b50d2235e55ee7",
    "to": "0xb2988210c05a43ebd76575f5421ef84b120ebf80",
    "transactionHash": "0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514"
  },
  "id": 1
}
```
---

#### cfx_getAccount
Return account related states of the given account
##### Parameters
1. `DATA`, 20 Bytes - address to get account.
2. `QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
   "latest_state"
]
```
##### Returns
`Object` - states of the given account:

* `balance`: `QUANTITY` - the balance of the account.
* `nonce`: `QUANTITY` - the nonce of the account's next transaction.
* `codeHash`: `QUANTITY` - the code hash of the account.
* `stakingBalance`: `QUANTITY` - the staking balance of the account.
* `collateralForStorage`: `QUANTITY` - the collateral storage of the account.
* `accumulatedInterestReturn`: `QUANTITY` -accumulated unterest return of the account.
* `admin`: DATA`, 20 Bytes - admin of the account.

##### Example
```
// Request
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"cfx_getAccount","params":["0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f", "latest_state"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": {
    "accumulatedInterestReturn": "0x0",
    "admin": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c",
    "balance": "0x0",
    "codeHash": "0x45fed62dd2b7c5ed76a63628ddc811e69bb5770cf31dd55647ca219aaee5434f",
    "collateralForStorage": "0x0",
    "nonce": "0x1",
    "stakingBalance": "0x0"
  },
  "id": 1
}
```

---


#### cfx_getInterestRate
Returns the interest rate of given parameter.
##### Parameters
`QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "latest_state"
]
```
##### Returns
`QUANTITY` - the interest rate of given parameter.
##### Example
```
// Request
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"cfx_getInterestRate","params":["latest_state"],"id":1}'

// Result
{
  "jsonrpc": "2.0",
  "result": "0x24b675dc000",
  "id": 1
}
```

---

#### cfx_getAccumulateInterestRate
Returns the accumulate interest rate of given parameter.
##### Parameters
`QUANTITY|TAG` - (optional, default: `"latest_state"`) integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
   "latest_state"
]
```
##### Returns
`QUANTITY` - the accumulate interest rate of given parameter.
##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getAccumulateInterestRate","params":["latest_state"],"id":1}' -X POST -H "Content-Type: application/json"

// Result
{
  "jsonrpc": "2.0",
  "result": "0x3c35a9e557dc9ef76719db0226f",
  "id": 1
}
```
---

#### cfx_checkBalanceAgainstTransaction
Check if user balance is enough for the transaction.

##### Parameters
* `DATA`, account address
* `DATA`, contract address
* `QUANTITY`, gas limit
* `QUANTITY`, gas price
* `QUANTITY`, storage limit
* `QUANTITY|TAG`, epoch number

```
params: [
  "0x1386b4185a223ef49592233b69291bbe5a80c527", 
  "0x1dc4f61a57a9b13a2f75f3717566bc8ea9869fa6", 
  "0x5208", 
  "0x2540be400", 
  "0x0", 
  "0xbf63"
]
```

##### Returns
* `isBalanceEnough`: `BOOL` - indicate balance is enough
* `willPayCollateral`: `BOOL` - indicate balance is enough for collateral
* `willPayTxFee`: `BOOL` - indicate balance is enough for tx fee

##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_checkBalanceAgainstTransaction","params":["0x1386b4185a223ef49592233b69291bbe5a80c527", "0x1dc4f61a57a9b13a2f75f3717566bc8ea9869fa6", "0x5208", "0x2540be400", "0x0", "0xbf63"],"id":1}' -X POST -H "Content-Type: application/json"
// Result
{
  "jsonrpc": "2.0",
  "result": {
    "isBalanceEnough": true,
    "willPayCollateral": true,
    "willPayTxFee": true
  },
  "id": 1
}
```
---

#### cfx_getSkippedBlocksByEpoch
Return skipped block hashs 
##### Parameters
* `QUANTITY|TAG` - integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)

```
params: [
  "0xba28"
]
```

##### Returns
* `Array` of block hashs

##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getSkippedBlocksByEpoch","params":["0xba28"],"id":1}' -X POST -H "Content-Type: application/json"
// Result
{
  "jsonrpc": "2.0",
  "result": [],
  "id": 1
}
```
---

#### cfx_getConfirmationRiskByHash
Return one block's confirmation risk

##### Parameters
* `DATA`, The block hash.

```
params: [
  "0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c"
]
```

##### Returns
* `QUANTITY`, The confirmation risk number

##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getConfirmationRiskByHash","params":["0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c"],"id":1}' -X POST -H "Content-Type: application/json"
// Result
{
  "jsonrpc": "2.0",
  "result": "0x2af31dc4611873bf3f70834acdae9f0f4f534f5d60585a5f1c1a3ced1b",
  "id": 1
}
```
---
#### cfx_getStatus
Return network status

##### Parameters
`none`
##### Returns

* `bestHash`: `DATA` - hash of the latest epoch's pivot block
* `blockNumber`: `QUANTITY` - total block number
* `chainId`: `QUANTITY` - chainId
* `epochNumber`: `QUANTITY` - latest epoch number
* `pendingTxNumber`: `QUANTITY` - current pending transaction count

##### Example

```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getStatus","params":[],"id":1}' -X POST -H "Content-Type: application/json"
// Result
{
  "jsonrpc": "2.0",
  "result": {
    "bestHash": "0xe4bf02ad95ad5452c7676d3dfc2e57fde2a70806c2e68231c58c77cdda5b7c6c",
    "blockNumber": "0xa9b7",
    "chainId": "0x0",
    "epochNumber": "0xa9b6",
    "pendingTxNumber": "0x0"
  },
  "id": 1
}
```
---

#### cfx_clientVersion
Return conflux-rust version

##### Parameters
`none`
##### Returns
* `DATA` - the client version

##### Example
```
//Request
curl --data '{"jsonrpc":"2.0","method":"cfx_clientVersion","params":[],"id":1}' -X POST -H "Content-Type: application/json"
//Result
{
  "jsonrpc": "2.0",
  "result": "conflux-rust-1.0.0",
  "id": 1
}
```
---

#### cfx_getBlockRewardInfo
Return reward info of an epoch's blocks

##### Parameters
`QUANTITY|TAG` - integer epoch number, or the string `"latest_state"`, `"latest_checkpoint"` or `"earliest"`, see the [epoch number parameter](#the-epoch-number-parameter)
```
params: [
  "0x5ee248"
]
```
##### Returns
`Array` - Array of reward info objects

* `blockHash`: `DATA` - the block hash
* `author`: `DATA` - the address of block miner
* `totalReward`: `QUANTITY` - total reward of the block include base reward, tx fee, staking reward
* `baseReward`: `QUANTITY` - base reward
* `txFee`: `QUANTITY` - tx fee

##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getBlockRewardInfo","params":["0x5ee248"],"id":1}' -X POST -H "Content-Type: application/json"

// Result
{
  "jsonrpc": "2.0",
  "result": [
    {
      "author": "0x137565786f869b93c55dbf48db6609a78eec88ec",
      "baseReward": "0x9ccda666a9516000",
      "blockHash": "0xa4a409ea5f1d31e787cd5e20a3eec1fd43851d29608d2de98fb127f518e1a211",
      "totalReward": "0x9ccdca639a29ece1",
      "txFee": "0x0"
    }
  ],
  "id": 1
}
```
---

#### cfx_getBlockByHashWithPivotAssumption
Returns block with given hash and pivot chain assumption.
##### Parameters
* `DATA`, block hash
* `DATA`, pivot hash
* `QUANTITY`, epoch number
```
params: [
   "0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c",
   "0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c", 
   "0xba28"
]
```

##### Returns
See [cfx_getBlockByHash](#cfx_getblockbyhash).

##### Example
```
// Request
curl --data '{"jsonrpc":"2.0","method":"cfx_getBlockByHashWithPivotAssumption","params":["0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c", "0x3912275cf09f8982a69735a876c14584dae95078762090c5d32fdf0dbec0647c", "0xba28"],"id":1}' -X POST -H "Content-Type: application/json"
```
Result see [cfx_getBlockByHash](#cfx_getblockbyhash).

---
