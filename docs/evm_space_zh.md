# Conflux EVM Subnet

Conflux-rust 在 v2.0 版本引入了一条兼容 EVM 的子链，能够实现`虚拟机完全兼容`以及`核心 eth RPC 兼容`。加密用户和开发者可以直接使用以太坊生态的钱包(MetaMask)和开发工具(Truffle, Hardhat, web3.js, ethers.js等) 来跟 EVM 子网直接交互。使得以太坊生态用户和开发者可以很方便体验 Conflux 网络的高 TPS 和低手续费优势。

底层实现上 EVM 子链同 Conflux 主链共用一套共识协议及数据账本，但从逻辑上看是独立的两条链。通过内置合约可以实现 CFX 在两条链之间互跨。并且可以实现一定程度的跨链合约调用（从 Conflux 链 call EVM 子链合约）。

## eth RPC 兼容情况

EVM 子链实现了核心 RPC interface 层面兼容，能够支持主流的 SDK，开发工具，钱包`发送交易`及`合约交互`。

具体实现逻辑是把树图账本的 `epochNumber` 适配为 ETH 的 `blockNumber`, 一个树图 epoch 中的所有 block, 被整合为一个 eth block

### RPC 方法兼容表

目前 eth RPC 实现情况如下:

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
| eth_getTransactionByHash | 👿 | 缺少字段：type, blockHash, blockNumber, transactionIndex |
| eth_getTransactionReceipt | 👿 | 缺少字段：log.logIndex 或 log.transactionLogIndex |
| eth_getLogs | 👿 | |
| eth_getBlockByHash | 👿 | 缺少字段：logsBloom, mixHash, nonce, totalDifficulty 未返回所有交易 |
| eth_getBlockByNumber | 👿 | |
| eth_getBlockTransactionCountByHash | 👿 | |
| eth_getBlockTransactionCountByNumber | 👿 | |
| eth_getTransactionByBlockHashAndIndex | ❌ | |
| eth_getTransactionByBlockNumberAndIndex | ❌ | |
| eth_syncing | ✅ | Fake |
| eth_hashrate | ✅ | Fake |
| eht_coinbase | ✅ | Fake |
| eth_mining | ✅ | Fake |
| eth_maxPriorityFeePerGas | ✅ | Fake |
| eth_accounts | ✅ | Fake |
| eth_submitHashrate | ✅ | Fake |
| eth_getUncleByBlockHashAndIndex | ✅ | Fake |
| eth_getUncleByBlockNumberAndIndex | ✅ | Fake |
| eth_getUncleCountByBlockHash | ✅ | Fake |
| eth_getUncleCountByBlockNumber | ✅ | Fake |
| eth_feeHistory | ❌ | |
| eth_getFilterChanges | ❌ | |
| eth_getFilterLogs | ❌ | |
| eth_newBlockFilter | ❌ | |
| eth_newFilter | ❌ | |
| eth_newPendingTransactionFilter | ❌ | |
| eth_uninstallFilter | ❌ | |
|  |  | |

### `pending` tag 支持情况

目前只有 `eth_getTransactionCount` 真正支持了 `pending` tag. 其他方法则把  `pending` 处理为 `latest`

* eth_getTransactionCount ✅
* eth_getBalance
* eth_getCode
* eth_getStorageAt
* eth_call

### 目前主要问题

1. Block，Tx，Receipt 返回数据缺少部分字段
2. Block 相关接口需要返回 Epoch 中所有 block 的交易，并且保证交易的 blockHash，transactionIndex 正确性
3. getLogs 接口同样需要集合 Epoch 中的所有数据, 并且正确的设置 transactionIndex, logIndex 等字段

### 数据可验证性

以下数据字段目前不保证可验证性

#### Block

* stateRoot
* receiptsRoot
* transactionsRoot
* logsBloom
* totalDifficulty
* nonce
* author|miner
* sha3Uncles
* uncles
* mixHash
* extraData
* baseFeePerGas

#### Receipt

* root
* logsBloom

### Error code & message

### pub/sub

目前暂不支持 ETH 事件的 pub/sub
