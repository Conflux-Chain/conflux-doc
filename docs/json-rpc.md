# Conflux JSON-RPC API

The Conflux JSON-RPC API is a collection of interfaces which allow you to interact with a local or remote Conflux node, using an HTTP connection in JSON-RPC protocol.

The following is an API reference documentation with examples.

## JSON-RPC
JSON is a lightweight data-interchange format. It can represent numbers, strings, ordered sequences of values, and collections of name/value pairs.

JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol. Primarily this specification defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over HTTP, or in many various message passing environments. It uses JSON (RFC 4627) as data format.

##JavaScript API
There will be a JavaScript library comming soon for you to interact with a Conflux node from inside a JavaScript application, which gives a convenient interface for the RPC methods.

##JSON-RPC endpoint && support
Currently, Conflux has a Rust implementation that supports JSON-RPC 2.0 and HTTP.

##HEX value encoding
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

##The default epoch parameter
The following methods have a default epoch parameter:

* cfx_getTransactionCount
* cfx_getBalance
* cfx_getBlockByEpochNumber
* cfx_epochNumber
* cfx_getBlocksByEpoch

When requests are made that act on the state of conflux, the default epoch parameter determines the height of the epoch. The following options are possible for the default epoch parameter:

* `HEX String` - an integer epoch number
* `String "earliest"` for the earliest epoch where the genesis block in
* `String "latest_mined"` - for the latest epoch where the latest mined block in
* `String "latest_state"` - for the latest epoch where the latest block with an executed state in

##Curl Examples Explained
The curl options below might return a response where the node complains about the content type, this is because the --data option sets the content type to application/x-www-form-urlencoded . If your node does complain, manually set the header by placing -H "Content-Type: application/json" at the start of the call.

The examples also include the URL/IP & port combination which must be the last argument given to curl e.x. ```http://localhost:12345```

Example for [cfx_getbestblockhash](#cfx_getbestblockhash)

```
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBestBlockHash","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:12345
```

##JSON-RPC methods
####cfx_getTransactionByHash 
Returns the information about a transaction requested by transaction hash.
#####Parameters
 1. DATA, 32 Bytes - hash of a transaction
```
params: [
    '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
]
```
#####Returns
`Object` - A transaction object, or `null` when no transaction was found:

* `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in and got executed. `null` when its pending.
* `data`: `DATA` - the data send along with the transaction.
* `from`: `DATA`, 20 Bytes - address of the sender.
* `gas`: `QUANTITY` - gas provided by the sender.
* `gasPrice`: `QUANTITY` - gas price provided by the sender in Drip.
* `hash`: `DATA`, 32 Bytes - hash of the transaction.
* `nonce`: `QUANTITY` - the number of transactions made by the sender prior to this one.
* `r`: `DATA`, 32 Bytes - ECDSA signature r
* `s`: `DATA`, 32 Bytes - ECDSA signature s
* `to`: `DATA`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
* `transactionIndex`: `QUANTITY` - integer of the transaction's index position in the block. `null` when its pending.
* `v`: `QUANTITY` - ECDSA recovery id
* `value`: `QUANTITY` - value transferred in Drip.

#####Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getTransactionByHash","params":["0xc92e7a598f6fe4c091dd604d84b23c5af6f0338d9612c76a1fb06dfdaed548b2"],"id":1}'

// Result
{
    "id" : 1,
    "jsonrpc" : "2.0",
    "result" : {
        "s" : "0x7dde8fb74652930d390a6dcec61ffef014bed2a30ebab0e9ceedd487959f6964",
        "v" : "0x0",
        "gas" : "0x5208",
        "data" : "0x",
        "blockHash" : "0x63d88f4de98e3c324baa4eb146c2cf714d5ecd6554549bbf6a0fc3a17b166a47",
        "gasPrice" : "0x1",
        "to" : "0x2a2c1a99e1ae7416118e335ac1032902377ce850",
        "r" : "0x72f494f114324bda0b0abade293ef529fe22301ea7bf66fdcbf1b399c0189778",
        "transactionIndex" : "0x4a",
        "value" : "0x1",
        "nonce" : "0x2",
        "from" : "0x28ca21e860bd91851bfca4406e429f74f09e4be3",
        "hash" : "0xc92e7a598f6fe4c091dd604d84b23c5af6f0338d9612c76a1fb06dfdaed548b2"
    }
}
```
---

####cfx_getBlockByHash 
Returns information about a block by hash.
#####Parameters
  1. `DATA`, 32 Bytes - Hash of a block.
  2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
```
params: [
    '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
    true
]
```
#####Returns
`Object` - A block object, or `null` when no block was found:

* `hash`: `DATA`, 32 Bytes - hash of the block. `null` when its pending block.
* `epochNumber`: `QUANTITY` - the current block epoch number in the client's view. `null` when it's not in best block's past set.
* `height`: `QUANTITY` - the block heights. `null` when its pending block.
* `parentHash`: `DATA`, 32 Bytes - hash of the parent block.
* `nonce`: `DATA`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
* `transactionsRoot`: `DATA`, 32 Bytes - the hash of the transactions of the block.
* `deferredStateRoot`: `DATA`, 32 Bytes - the root of the final state trie of the block after deferred execution.
* `deferredReceiptsRoot`: `DATA`, 32 Bytes - the hash of the receipts of the block after deferred execution.
* `miner`: `DATA`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
* `difficulty`: `QUANTITY` - integer of the difficulty for this block.
* `size`: `QUANTITY` - integer the size of this block in bytes.
* `gasLimit`: `QUANTITY` - the maximum gas allowed in this block.
* `timestamp`: `QUANTITY` - the unix timestamp for when the block was collated.
* `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
* `refereeHashes`: `Array` - Array of referee hashes.

#####Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBlockByHash","params":["0x5c641dd7fa7f0dbf486391bd1310f09b6f062ec221f410e5a1bb2c24739b3d94", false],"id":1}'

// Result
{
    "jsonrpc": "2.0",
    "result": {
        "deferredReceiptsRoot": "0x602e2c03b2857ae2c9e84c822d1a5b32d0161271096c927b27ca56379cee79eb",
        "deferredStateRoot": "0x3a42c10a8dd6bebe914095967b7f5caef472a66ede3e1973118a54934f63d143",
        "difficulty": "0x4",
        "epochNumber": "0x20",
        "gasLimit": "0xb2d05e00",
        "hash": "0x5c641dd7fa7f0dbf486391bd1310f09b6f062ec221f410e5a1bb2c24739b3d94",
        "height": "0x1d",
        "miner": "0x0000000000000000000000000000000000000000",
        "nonce": "0x53447d364b6019b",
        "parentHash": "0xe64ffb49c8bde64d0fd2916ce9351e485741aac89719e89989fe8f8112801a40",
        "refereeHashes": [
            "0x431eccfc94c4738b7f560f226a82ca58e9b81bb5aadd3d66acdcab1acc470300",
            "0xe9067a60c14bfc93bbaf78e874be2a25bd948bda3c56fff6ee321d045727ef1f",
            "0x630b40c28974a360840a10268a56be1ca203a45a726e6ca4e04abd4d7523b7cb",
            "0x6cff3a277fc0bf17c359568da27a62f8273753cbcbed6a80b994fc50c8b140b4"
        ],
        "size": "0x0",
        "timestamp": "0x0",
        "transactions": [
            "0x0a39c1048ffccb59ec0df0cb5d17733cb5be219c066bf0035fb6a1e281bfdc77",
            "0xf114b5c01a3b84c8e2389c0d8dc9c1b3fdefe4ac238d224577855373897d4a3a"
        ],
        "transactionsRoot": "0xaed37b3d6c8b0336d42b4b798e1d1f73103de7473f0601736cb95adc3c4b4ea7"
    },
    "id": 1
}
```

---

####cfx_getBlockByEpochNumber
Returns information about a block by epoch number.
#####Parameters
  1. `QUANTITY|TAG` - the epoch number, or the string "latest_mined",  "latest_state" or "earliest", see the [default epoch parameter](#the-default-epoch-parameter).
  2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
```
params: [
    'latest_mined',
    true
]
```
#####Returns
See [cfx_getBlockByHash](#cfx_getblockbyhash).

#####Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getBlockByHash","params":["latest_mined", false],"id":1}'
```
Result see [cfx_getBlockByHash](#cfx_getblockbyhash).

---

#### cfx_getBestBlockHash
Returns the hash of best block.
#####Parameters
`none`
#####Returns
`DATA` , 32 Bytes - hash of the best block.
#####Example
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


####cfx_epochNumber
Returns the current epoch number the client is on.
#####Parameters
`TAG` - (optional, default: "latest_mined") String "latest_mined",  "latest_state" or "earliest", see the [default epoch parameter](#the-default-epoch-parameter).
#####Returns
`QUANTITY` - integer of the current epoch number the client is on.
#####Example
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

####cfx_gasPrice
Returns the current price per gas in Drip.
#####Parameters
`none`
#####Returns
`QUANTITY` - integer of the current gas price in Drip.
#####Example
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

####cfx_getBlocksByEpoch
Returns hashes of blocks located in some epoch.
#####Parameters
`QUANTITY|TAG` - the epoch number, or the string "latest_mined",  "latest_state" or "earliest", see the [default epoch parameter](#the-default-epoch-parameter).
#####Returns
`Array` - Array of block hashes, sorted by execution(topological) order.
#####Example
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

####cfx_getBalance
Returns the balance of the account of given address.
#####Parameters
1. `DATA`, 20 Bytes - address to check for balance.
2. `QUANTITY|TAG` - integer epoch number, or the string "latest_mined",  "latest_state", "earliest", see the [default epoch parameter](#the-default-epoch-parameter)
```
params: [
   '0xc94770007dda54cF92009BFF0dE90c06F603a09f',
   'latest_state'
]
```
#####Returns
`QUANTITY` - integer of the current balance in Drip.
#####Example
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
####cfx_getTransactionCount
Returns the number of transactions sent from an address.

#####Parameters
1. `DATA`, 20 Bytes - address.
2. `QUANTITY|TAG` - integer epoch number, or the string "latest_mined",  "latest_state", "earliest", see the [default epoch parameter](#the-default-epoch-parameter)
```
params: [
    '0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8',
    'latest_state' // state at the latest executed epoch
]
```
#####Returns
`QUANTITY` - integer of the number of transactions send from this address.

#####Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_getTransactionCount","params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8", 'latest_state'],"id":1}'

// Result
{
    "jsonrpc" : "2.0",
    "result" : "0x1",
    "id" : 1
}
```

---
####cfx_sendRawTransaction
Creates new message call transaction or a contract creation for signed transactions.
#####Parameters
`DATA`, The signed transaction data.
```
params: [
    '0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f746573743200000000000000000000000000000000000000000000000000000060005701a08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f'
]
```
#####Returns
`DATA`, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.
#####Example
```
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"cfx_sendRawTransaction","params":[{see above}],"id":1}'

// Result
{
    "id":1,
    "jsonrpc": "2.0",
    "result": "0x83a610d4a8ebd20dde487f6d02c1d26f6ae8cb2bb4f0b74466a7597ce682077f"
}
```

---
