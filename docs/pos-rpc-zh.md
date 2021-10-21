---
id: pos_rpc
title: PoS JSON RPC
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/pos-rpc.md
keywords:
  - conflux
  - pos-rpc
  - sdk
---

`conflux-rust` 从 v1.2.0 开始引入 PoS finality 机制，用于加快区块的最终性，从而防止 51% 攻击。PoS finality 机制会引入一条独立的 PoS 链，用于实现 PoS 共识，并对 PoW 区块进行 finalize。相对应的 PoS 也有自己专门的 RPC 方法，用于获取 PoS 链的数据。

目前只有 conflux-rust 的 archive node 可以对外提供 PoS RPC 服务，RPC 需要配置 `public_rpc_apis` 选项才能打开。

可以在当前打开的 RPC 方法组中，增加 `pos` 组。

```js
public_rpc_apis = "safe,pos"
```

或者直接将 `public_rpc_apis` 设置为 `all`，打开所有 RPC 方法。

```js
public_rpc_apis = "all"
```

## 基本概念

### epoch

PoS 中也有 epoch 的概念，可以理解为纪元。但跟 PoW 的 epoch 概念不太一样。一个 epoch 代表一届委员的任期，从 `1` 开始递增，每个 epoch 平均对应`一个小时`, 每过一个 epoch，委员会中的部分委员会被替换。参与 PoS 共识获得的奖励也是按 epoch 来发放的。

### round

round 中文翻译为`轮`，PoS 链平均会`每分钟`进行一轮共识，即尝试产生一个 PoS 块。亦即每个 epoch 会有 `60` 个 round，且每个`新的 epoch`， round 会重新从 `1` 开始。

注意：并不是每个 round 都会产生一个区块，有可能会因为网络或共识失败导致无法出块。

### block.number

block.number 也就是区块的 `height`，每产生一个新的区块，number 会加一。

PoS 区块被某个委员会成员提议之后，会发送到网络中进行投票，当区块收集到足够多的票数之后即为投票成功 `voted`，但此时区块还没被 commit，当三个 round 连续的区块被产生后，最初的 round 对应的区块会被提交，状态变为 committed。

### pivotDecision

pivotDecision 是 PoS 链对 PoW 链区块的最终决定（final decision）. 一旦 PoW 的某个区块被 PoS 所引用，则代表该 PoW 区块已经被 finalized，不会再发生 revert。PoS 链的区块会包含 PivotDecision 信息，表示该 PoS 区块对 PoW 主轴链的某个区块进行了 finalize。pivotDecision 信息是 PoW 主轴链的某个区块的 number 或者 hash。

### PoS Address

PoS 账户地址跟 PoW 地址格式不同是一个 256 位 hash 值，例如：

`0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c`

## PoS Model

#### AccountStatus

一个账户注册参与 PoS 共识，或者增加质押的投票之后，票数首先会进入 `inQueue` 状态，经过`七天`时间变为 `locked` 状态。
当用户发起解锁操作之后，待解锁的票券会先进入 `outQueue` 状态，同样需要经过`七天`时间变为 `unlocked` 状态。

* `availableVotes`: `QUANTITY` - 账户当前可用的票数, 等于 `sum inQueue` + `locked`
* `forfeited`: `QUANTITY` - 账户被检测到作恶时，staked 票数会被锁死，无法提取的数量
* `forceRetired`: [`QUANTITY`] - 账户被强制退休的票数
* `inQueue`: `Array` of [VotesInQueue](#VotesInQueue) - 当前正在等待锁定的队列
* `locked`: `QUANTITY` - 账户当前被锁定的票数
* `outQueue`: `Array` of [VotesInQueue](#VotesInQueue) - 当前正在等待解锁的队列
* `unlocked`: `QUANTITY` - 账户当前已解锁的票数

#### VotesInQueue

用户正在等待锁定或等待解锁票权信息。

* `endBlockNumber`: `QUANTITY` - 状态结束的区块号
* `power`: `QUANTITY` - 当前状态票的数量

## RPCs

### pos_getStatus

返回 PoS 链当前的状态信息。

#### Parameters

`Empty`

#### Returns

`Object` - PoS status object.

* `epoch`: `QUANTITY` - PoS 链当前的纪元号
* `latestCommitted`: `QUANTITY` - 最新被 commit 的区块号，commit 的区块不会再发生 revert
* `latestVoted`: [`QUANTITY`] - 最近被成功投票的区块号。如果当前没有完成投票的区块为 null
* `pivotDecision`: `QUANTITY` - 当前 PoS 链所 finalize 的最新 PoW 链的主轴区块号

#### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getStatus",
    "params": []
}'

// Result
{
    "jsonrpc": "2.0",
    "result": {
        "epoch": "0x56",
        "latestCommitted": "0x140c",
        "latestVoted": "0x140e",
        "pivotDecision": "0x113af0"
    },
    "id": 1
}
```

### pos_getAccount

获取 PoS 的账户信息

### Parameters

1. `ADDRESS`: 32 Bytes - PoS 账户地址
2. [`QUANTITY`]: 可选的 block number，用于查询账户在某个区块高度时的状态

```json
params: [
  "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
  "0x100"
]
```

#### Returns

`Object` - 账户对象，或者 `null`（如果地址对应的账户不存在）

* `address`: `ADDRESS` - 账户地址
* `blockNumber`: `QUANTITY` - 状态所对应的区块号
* `status`: `OBJECT` - 用户当前的状态信息对象，参看 [Account Status](#AccountStatus)

#### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getAccount",
    "params": ["0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c"]
}'

// Response
{
    "jsonrpc": "2.0",
    "result": {
        "address": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
        "blockNumber": "0x14a7",
        "status": {
            "availableVotes": "0x513",
            "forfeited": "0x0",
            "forceRetired": null,
            "inQueue": [],
            "locked": "0x513",
            "outQueue": [],
            "unlocked": "0x0"
        }
    },
    "id": 1
}
```

### pos_getCommittee

默认获取当前的 PoS 委员会信息，也可以通过指定 blockNumber 获取历史某个区块时的委员会信息。

#### Parameters

1. [`QUANTITY`]:  可选的 block number，用于查询某个区块高度时的委员会信息

#### Returns

* `currentCommittee`: `OBJECT` - 当前委员会成员, 参看 [CurrentCommittee](#CurrentCommittee)
* `elections`: `Array` - 正在参选中的人员

##### CurrentCommittee

当前委员会信息

* `epochNumber`: `QUANTITY` - 委员会任期的 epoch 编号
* `nodes`: `Array` of [CommitteNode](#CommitteNode) - 委员会成员列表
* `quorumVotingPower`: `QUANTITY` - 区块投票达到共识所需最低票数
* `totalVotingPower`: `QUANTITY` - 本届委员总共的票数

##### CommitteNode

委员信息

* `address`: `ADDRESS` - 账户地址
* `votingPower`: `QUANTITY` - 票数

##### Election

* `isFinalized`: `BOOLEAN` - 本轮选举是否被确定
* `startBlockNumber`: `QUANTITY` - 开始的区块编号
* `topElectingNodes`: `Array` of [CommitteNode](#CommitteNode) - 参选排名最靠前的 50 名用户

#### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getCommittee",
    "params": []
}'
// Response
{
    "jsonrpc": "2.0",
    "result": {
        "currentCommittee": {
            "epochNumber": "0x5a",
            "nodes": [
                {
                    "address": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
                    "votingPower": "0xc8"
                },
                {
                    "address": "0x459b19e745eb410c3696ff1ed15f9de9bb46aa5fefc27b0b6e8b8d7aaadfe8c0",
                    "votingPower": "0x32"
                }
            ],
            "quorumVotingPower": "0xa7",
            "totalVotingPower": "0xfa"
        },
        "elections": [
            {
                "isFinalized": false,
                "startBlockNumber": "0x1518",
                "topElectingNodes": [
                    {
                        "address": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
                        "votingPower": "0x2a"
                    },
                    {
                        "address": "0x459b19e745eb410c3696ff1ed15f9de9bb46aa5fefc27b0b6e8b8d7aaadfe8c0",
                        "votingPower": "0x8"
                    }
                ]
            },
            {
                "isFinalized": false,
                "startBlockNumber": "0x1554",
                "topElectingNodes": []
            }
        ]
    },
    "id": 1
}
```

### pos_getBlockByHash

根据 hash 获取区块信息

#### Parameters

1. `HASH`: 区块 hash

```json
params: [
  "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
]
```

#### Returns

* `epoch`: `QUANTITY` - 区块所在的纪元
* `hash`: `QUANTITY` - 区块 hash
* `height`: `QUANTITY` - 区块高度
* `miner`: [`ADDRESS`] - 区块的创建者，可能为 `null`
* `nextTxNumber`: `QUANTITY` - 下一区块交易的其实编号
* `parentHash`: `HASH` - 父区块 hash
* `pivotDecision`: [`QUANTITY`] - 对 PoW 主轴链的确认
* `round`: `QUANTITY` - 当前的轮次
* `signatures`: `Array` of [Signature](#Signature) - 区块的签名信息
* `timestamp`: `QUANTITY` - 时间戳

##### Signature

区块签名信息

* `account`: `ADDRESS` - 签名的账户地址
* `votes`: `QUANTITY` - 签名账户的票数

#### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getBlockByHash",
    "params": ["0x2b8b9d33e79e1735817a1278a9c8c5be828101b281bd4190531686153bee317b"]
}'
// Response
{
    "jsonrpc": "2.0",
    "result": {
        "epoch": "0x5a",
        "hash": "0x2b8b9d33e79e1735817a1278a9c8c5be828101b281bd4190531686153bee317b",
        "height": "0x14ef",
        "miner": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
        "nextTxNumber": "0x1da7",
        "parentHash": "0x89cf3089296679dfef822d3dca037decab2a301de6f047e56c69cb34ae0b79e2",
        "pivotDecision": "0x117ee8",
        "round": "0x13",
        "signatures": [
            {
                "account": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
                "votes": "0xc8"
            },
            {
                "account": "0x459b19e745eb410c3696ff1ed15f9de9bb46aa5fefc27b0b6e8b8d7aaadfe8c0",
                "votes": "0x32"
            }
        ],
        "timestamp": "0x5cce0e869522a"
    },
    "id": 1
}
```

### pos_getBlockByNumber

根据区块号获取区块信息

#### Parameters

1. `QUANTITY|TAG`: 区块编号或者区块TAG（`latest_committed`, `latest_voted`）

#### Returns

跟 [pos_getBlockByHash](#pos_getBlockByHash) 相同

#### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getBlockByNumber",
    "params": ["0x14ef"]
}'
```

### pos_getRewardsByEpoch

返回某个 PoS epoch 发放奖励的具体信息

#### Parameters

1. `QUANTITY`: 纪元编号

```json
params: [
  "0x4a"
]
```

#### Returns

* `accountRewards`: `Array` of [AccountReward](#AccountReward)
* `powEpochHash`: `HASH` - 奖励发放时 PoW 链主轴区块的 hash

##### AccountReward

* `posAddress`: `ADDRESS` - PoS 账户地址
* `powAddress`: `BASE32` - PoW 账户地址
* `reward`: `QUANTITY` - 获得的奖励数量，单位为 Drip

##### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getRewardsByEpoch",
    "params": ["0x4a"]
}'
// Response
{
    "jsonrpc": "2.0",
    "result": {
        "accountRewards": [
            {
                "posAddress": "0x459b19e745eb410c3696ff1ed15f9de9bb46aa5fefc27b0b6e8b8d7aaadfe8c0",
                "powAddress": "NET8888:TYPE.USER:AAKSNR7XKKFFAM17MNESKAGU076T8FAG3YJ6PTHN16",
                "reward": "0x14931d20aa21eae3e6f"
            },
            {
                "posAddress": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
                "powAddress": "NET8888:TYPE.USER:AAPXUPNXG96GZ4077DAV0151K7P8498N9A6DMAWK1N",
                "reward": "0x2d49549e023888cd390"
            }
        ],
        "powEpochHash": "0x361cb0f19fd13c30da467d20a84ef01aabcd55e9812c5e2fd0721ea11a52e9f1"
    },
    "id": 1
}
```

### pos_getTransactionByNumber

根据交易编号获取交易信息

#### Parameters

1. `QUANTITY`: 交易编号

```json
params: [
  "0x4a"
]
```

#### Returns

交易详情

* `hash`: `HASH` - 交易 hash
* `from`: `ADDRESS` - 发送方地址
* `number`: `QUANTITY` - 交易号
* `blockHash`: [`HASH`] - 交易所属区块 hash
* `blockNumber`: [`QUANTITY`] - 交易所属区块编码
* `payload`: [`OBJECT`] - 交易主要数据，payload 内容根据交易类型不同而不同
* `status`: [`ENUM`] - 交易的状态，可能值：`Executed`, `Failed`, `Discard`
* `timestamp`: [`QUANTITY`] - 交易时间戳
* `type`: `ENUM` 交易的类型，可能值：`BlockMetadata`, `Election`, `Retire`, `Register`, `UpdateVotingPower`, `PivoteDecision`, `Dispute`, `Other`


##### Example

```json
// Request
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pos_getTransactionByNumber",
    "params": ["0x71"]
}'

// Response
{
    "jsonrpc": "2.0",
    "result": {
        "blockHash": "0x355497700fc4c530c4eefa47c90deb052baaba4950934dfa6143f3c7321f3df1",
        "blockNumber": "0x3a",
        "from": "0x6f2e774cb8b83957d29e6a0b06551c11e632e1a0f46bee0d82b2fdc2b82fe4f9",
        "hash": "0x5505191e2f783e141fb8c84193829e494a27f197840987821514a12a0e04a10c",
        "number": "0x71",
        "payload": {
            "blockHash": "0xd66e1d6050d7070cab189a524782381e211508fa204a0674ea35fa1523cfba90",
            "height": 12780
        },
        "status": "Executed",
        "timestamp": "0x5cd05bea6a9b0",
        "type": "PivotDecision"
    },
    "id": 1
}
```

## More Info

1. Common Errors
2. Harfork height