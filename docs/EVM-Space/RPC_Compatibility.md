# Compatibility with the Web3 JSON-RPC Protocol

The Conflux EVM space implements the Web3 JSON-RPC protocol.

## Methods

| Method                 | Status      | Note    |
| ---------------------- | ----------- |-------- |
| web3_clientVersion     | ✅       |  |
| net_version | ✅       |  |
| eth_protocolVersion | ✅       |  |
| eth_chainId | ✅ | |
| eth_gasPrice | ✅ | |
| eth_blockNumber | ✅ | |
| eth_getBalance | ✅ | |
| eth_getStorageAt | ✅ | |
| eth_getCode | ✅ | |
| eth_getTransactionCount | ✅ | |
| eth_sendRawTransaction | ✅ | |
| eth_submitTransaction | ✅ | |
| eth_call | ✅ | |
| eth_estimateGas | ✅ | |
| eth_getTransactionByHash | ✅ |  |
| eth_getTransactionReceipt | ✅ |  |
| eth_getLogs | ✅ | |
| eth_getBlockByHash | ✅ |  |
| eth_getBlockByNumber | ✅ | |
| eth_getBlockTransactionCountByHash | ✅ | |
| eth_getBlockTransactionCountByNumber | ✅ | |
| eth_getTransactionByBlockHashAndIndex | ❌ | |
| eth_getTransactionByBlockNumberAndIndex | ❌ | |
| eth_syncing | ✅ |  |
| eth_hashrate | ✅ |  |
| eht_coinbase | ✅ |  |
| eth_mining | ✅ |  |
| eth_maxPriorityFeePerGas | ✅ |  |
| eth_accounts | ✅ |  |
| eth_submitHashrate | ✅ |  |
| eth_getUncleByBlockHashAndIndex | ✅ |  |
| eth_getUncleByBlockNumberAndIndex | ✅ |  |
| eth_getUncleCountByBlockHash | ✅ |  |
| eth_getUncleCountByBlockNumber | ✅ |  |
| eth_feeHistory | ❌ | |
| eth_getFilterChanges | ❌ | |
| eth_getFilterLogs | ❌ | |
| eth_newBlockFilter | ❌ | |
| eth_newFilter | ❌ | |
| eth_newPendingTransactionFilter | ❌ | |
| eth_uninstallFilter | ❌ | |
| web3_sha3 | ❌ | |
| net_listening | ❌ | |
| net_peerCount | ❌ | |
| eth_compileLLL | ❌ | |
| eth_compileSerpent | ❌ | |
| eth_compileSolidity | ❌ | |
| eth_getCompilers | ❌ | |
| eth_getProof | ❌ | EIP-1186 |
| eth_getWork | ❌ | |
| eth_pendingTransactions | ❌ | |
| db_* | ❌ | |
| shh_* | ❌ | |
|  |  | |

Legend: ❌ = not supported. 🚧 = work in progress. ✅ = supported.

## Notes

* `eth_sendRawTransaction` only accept 155 transaction, `1559`, `1930` is not supported
* Method not listed is also not supported.
* There is no concept of uncle (aka ommer) blocks. The `eth_getUncleByBlockHashAndIndex` and `eth_getUncleByBlockNumberAndIndex` methods always return `null`. The `eth_getUncleCountByBlockHash` and `eth_getUncleCountByBlockNumber` methods return zero for valid block IDs and `null` for invalid block IDs. Additionally, uncle-related block metadata such as `sha3Uncles` is sha3 of empty hash array.
* The nonstandard Geth tracing APIs are not supported at present
* The nonstandard Parity tracing APIs are not supported at present

### `pending` tag

Only `eth_getTransactionCount` method has supported `pending` tag. Other method will treat `pending` tag as `latest`

* eth_getTransactionCount ✅
* eth_getBalance
* eth_getCode
* eth_getStorageAt
* eth_call

## Data verifiability

Beblow fields can not guarantee verifiability

### Block

* stateRoot
* receiptsRoot
* transactionsRoot
* logsBloom ?
* totalDifficulty

### Receipt

* logsBloom

## Error code & message

TODO

## pub/sub

Ethereum event pub/sub is not supported now.
