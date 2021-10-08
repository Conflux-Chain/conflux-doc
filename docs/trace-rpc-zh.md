# Trace RPC

通过 Trace RPC 可以追踪合约内部执行的细节，Conflux 的 Archive node 需要开启如下配置才能访问 trace 相关的 RPC.

```toml
executive_trace = true
public_rpc_apis = "safe,trace"  // or public_rpc_apis = "all"
```

Note: 一个现有 Archive 节点开启 `executive_trace` 需要重新同步数据，才能提供 trace 数据

## Trace 的详细介绍

一个 `Trace` 包含 信息如下:

* `type`: `STRING` - Type of trace. Avaliable value is `call`, `create`, `call_result`, `create_result`, `internal_transfer_action`
* `action`: `OBJECT` - Trace's action info，different type trace's action have different fields.

Example:

```json
{
  "action": {
    "callType": "call",
    "from": "CFXTEST:TYPE.USER:AAJSUKECFVZF2MG8GZYR9GNAKZYSX9P6VU29DWZ6T2",
    "gas": "0x171e2",
    "input": "0x9c312cfd",
    "to": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
    "value": "0x1d6e3"
  },
  "type": "call"
}
```

关于 Trace 的信息和介绍可以参看[这篇文档](https://github.com/Conflux-Chain/conflux-doc/blob/master/docs/trace_introduction.md)

## RPCs

### trace_block

获取一个 Block 的所有 trace

#### Parameters

1. DATA, 32 Bytes - hash of a block

#### Returns

* `blockHash`: `HASH` - Hash of block
* `epochHash`: `HASH` - Hash of epoch
* `epochNumber`: `QUANTITY` - Number of epoch
* `transactionTraces`: `Array` -  Array of `TransactionTrace` info

##### TransactionTrace

* `transactionHash`: `HASH` - Hash of transaction
* `transactionPosition`: `QUANTITY` - Position of transaction in block
* `traces`: `Array` - Array of `Trace`

```json
// Request
curl --location --request POST 'http://testnet-rpc:12537' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "jsonrpc": "2.0",
    "id": "15922956697249514502",
    "method": "trace_block",
    "params": ["0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369"]
  }'

// Response
{
    "jsonrpc": "2.0",
    "result": {
        "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
        "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
        "epochNumber": "0x28968d0",
        "transactionTraces": [
            {
                "traces": [
                    {
                        "action": {
                            "callType": "call",
                            "from": "CFXTEST:TYPE.USER:AAJSUKECFVZF2MG8GZYR9GNAKZYSX9P6VU29DWZ6T2",
                            "gas": "0x171e2",
                            "input": "0x9c312cfd",
                            "to": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                            "value": "0x1d6e3"
                        },
                        "type": "call"
                    },
                    {
                        "action": {
                            "callType": "call",
                            "from": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                            "gas": "0x14ac7",
                            "input": "0xb281a7bd00000000000000000000000089e0b86eec97bc24f44e3eb206b22b235db58c1e",
                            "to": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                            "value": "0x1d6e3"
                        },
                        "type": "call"
                    },
                    {
                        "action": {
                            "callType": "delegatecall",
                            "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                            "gas": "0x14157",
                            "input": "0xb281a7bd00000000000000000000000089e0b86eec97bc24f44e3eb206b22b235db58c1e",
                            "to": "CFXTEST:TYPE.CONTRACT:ACEMTZA4ZJN1FCUTZWN6P8EKDBF2X8DCZY4TEESNH8",
                            "value": "0x1d6e3"
                        },
                        "type": "call"
                    },
                    {
                        "action": {
                            "callType": "staticcall",
                            "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                            "gas": "0x13464",
                            "input": "0xf0940002",
                            "to": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                            "value": "0x0"
                        },
                        "type": "call"
                    },
                    {
                        "action": {
                            "gasLeft": "0x11ae8",
                            "outcome": "success",
                            "returnData": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001f00adf0308dce89889061254123a68747470733a2f2f6170692e62696e616e63652e636f6d2f6170692f76332f7469636b65722f70726963653f73796d626f6c3d434658555344541a168418778218646570726963658218571a000f4240185b1257123668747470733a2f2f7777772e6f6b65782e636f6d2f6170692f696e6465782f76332f4346582d5553442f636f6e7374697475656e74731a1d8518778218666464617461821864646c6173748218571a000f4240185b1247122e68747470733a2f2f646174612e676174656170692e696f2f617069322f312f7469636b65722f6366785f757364741a15841877821864646c6173748218571a000f4240185b1264123d68747470733a2f2f7777772e6d78632e636f6d2f6f70656e2f6170692f76322f6d61726b65742f7469636b65723f73796d626f6c3d4346585f555344541a23871877821861646461746182181800821867646c61737418728218571a000f4240185b125b123568747470733a2f2f6170692e626b65782e63632f76322f712f7469636b65722f70726963653f73796d626f6c3d4346585f555344541a228618778218616464617461821818008218646570726963658218571a000f4240185b1a0d0a0908051205fa3fc000001003220d0a0908051205fa3fc000001003100a186420012846308094ebdc0300000000000000000000000000000000"
                        },
                        "type": "call_result"
                    },
                    {
                        "action": {
                            "callType": "staticcall",
                            "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                            "gas": "0xce86",
                            "input": "0x0adf0308dce89889061254123a68747470733a2f2f6170692e62696e616e63652e636f6d2f6170692f76332f7469636b65722f70726963653f73796d626f6c3d434658555344541a168418778218646570726963658218571a000f4240185b1257123668747470733a2f2f7777772e6f6b65782e636f6d2f6170692f696e6465782f76332f4346582d5553442f636f6e7374697475656e74731a1d8518778218666464617461821864646c6173748218571a000f4240185b1247122e68747470733a2f2f646174612e676174656170692e696f2f617069322f312f7469636b65722f6366785f757364741a15841877821864646c6173748218571a000f4240185b1264123d68747470733a2f2f7777772e6d78632e636f6d2f6f70656e2f6170692f76322f6d61726b65742f7469636b65723f73796d626f6c3d4346585f555344541a23871877821861646461746182181800821867646c61737418728218571a000f4240185b125b123568747470733a2f2f6170692e626b65782e63632f76322f712f7469636b65722f70726963653f73796d626f6c3d4346585f555344541a228618778218616464617461821818008218646570726963658218571a000f4240185b1a0d0a0908051205fa3fc000001003220d0a0908051205fa3fc000001003100a186420012846308094ebdc03",
                            "to": "CFXTEST:TYPE.BUILTIN:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJK7B54454",
                            "value": "0x0"
                        },
                        "type": "call"
                    },
                    {
                        "action": {
                            "gasLeft": "0xcd8a",
                            "outcome": "success",
                            "returnData": "0xdccb9be50637c331c1c66ef1b0c2779f0a1893661c017c530b641dcec02010dc"
                        },
                        "type": "call_result"
                    },
                    {
                        "action": {
                            "gasLeft": "0x8fe9",
                            "outcome": "success",
                            "returnData": "0x0000000000000000000000000000000000000000000000000000000000001662"
                        },
                        "type": "call_result"
                    },
                    {
                        "action": {
                            "gasLeft": "0x94d5",
                            "outcome": "success",
                            "returnData": "0x0000000000000000000000000000000000000000000000000000000000001662"
                        },
                        "type": "call_result"
                    },
                    {
                        "action": {
                            "gasLeft": "0x713e",
                            "outcome": "success",
                            "returnData": "0x"
                        },
                        "type": "call_result"
                    }
                ],
                "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
                "transactionPosition": "0x0"
            }
        ]
    },
    "id": "15922956697249514502"
}
```

#### Returns

### trace_transaction

获取一个 Transaction 的所有 trace

#### Parameters

1. DATA, 32 Bytes - hash of a transaction

#### Returns

* `type`: `string` - Avaliable value is `call`, `create`, `call_result`, `create_result`, `internal_transfer_action`
* `transactionPosition`: `QUANTITY` - Position of transaction in block
* `transactionHash`: `HASH` - Hash of transaction
* `epochNumber`: `QUANTITY` - Number of epoch
* `epochHash`: `HASH` - Hash of epoch
* `blockHash`: `HASH` - Hash of block
* `action`: `OBJECT` - Trace info

```json
// Request
curl --location --request POST 'http://testnet-rpc:12537' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "jsonrpc": "2.0",
    "id": "15922956697249514502",
    "method": "trace_transaction",
    "params": ["0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad"]
  }'

// Response
{
    "jsonrpc": "2.0",
    "result": [
        {
            "action": {
                "callType": "call",
                "from": "CFXTEST:TYPE.USER:AAJSUKECFVZF2MG8GZYR9GNAKZYSX9P6VU29DWZ6T2",
                "gas": "0x171e2",
                "input": "0x9c312cfd",
                "to": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                "value": "0x1d6e3"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call"
        },
        {
            "action": {
                "callType": "call",
                "from": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                "gas": "0x14ac7",
                "input": "0xb281a7bd00000000000000000000000089e0b86eec97bc24f44e3eb206b22b235db58c1e",
                "to": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                "value": "0x1d6e3"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call"
        },
        {
            "action": {
                "callType": "delegatecall",
                "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                "gas": "0x14157",
                "input": "0xb281a7bd00000000000000000000000089e0b86eec97bc24f44e3eb206b22b235db58c1e",
                "to": "CFXTEST:TYPE.CONTRACT:ACEMTZA4ZJN1FCUTZWN6P8EKDBF2X8DCZY4TEESNH8",
                "value": "0x1d6e3"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call"
        },
        {
            "action": {
                "callType": "staticcall",
                "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                "gas": "0x13464",
                "input": "0xf0940002",
                "to": "CFXTEST:TYPE.CONTRACT:ACE8BSDS7WN52KHYK29NEBZWFPVZ5RPPD28KCXETJ8",
                "value": "0x0"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call"
        },
        {
            "action": {
                "gasLeft": "0x11ae8",
                "outcome": "success",
                "returnData": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001f00adf0308dce89889061254123a68747470733a2f2f6170692e62696e616e63652e636f6d2f6170692f76332f7469636b65722f70726963653f73796d626f6c3d434658555344541a168418778218646570726963658218571a000f4240185b1257123668747470733a2f2f7777772e6f6b65782e636f6d2f6170692f696e6465782f76332f4346582d5553442f636f6e7374697475656e74731a1d8518778218666464617461821864646c6173748218571a000f4240185b1247122e68747470733a2f2f646174612e676174656170692e696f2f617069322f312f7469636b65722f6366785f757364741a15841877821864646c6173748218571a000f4240185b1264123d68747470733a2f2f7777772e6d78632e636f6d2f6f70656e2f6170692f76322f6d61726b65742f7469636b65723f73796d626f6c3d4346585f555344541a23871877821861646461746182181800821867646c61737418728218571a000f4240185b125b123568747470733a2f2f6170692e626b65782e63632f76322f712f7469636b65722f70726963653f73796d626f6c3d4346585f555344541a228618778218616464617461821818008218646570726963658218571a000f4240185b1a0d0a0908051205fa3fc000001003220d0a0908051205fa3fc000001003100a186420012846308094ebdc0300000000000000000000000000000000"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call_result"
        },
        {
            "action": {
                "callType": "staticcall",
                "from": "CFXTEST:TYPE.CONTRACT:ACFNPY71HJHAMY075XYPS56124ZJE5154UX9NTE7VT",
                "gas": "0xce86",
                "input": "0x0adf0308dce89889061254123a68747470733a2f2f6170692e62696e616e63652e636f6d2f6170692f76332f7469636b65722f70726963653f73796d626f6c3d434658555344541a168418778218646570726963658218571a000f4240185b1257123668747470733a2f2f7777772e6f6b65782e636f6d2f6170692f696e6465782f76332f4346582d5553442f636f6e7374697475656e74731a1d8518778218666464617461821864646c6173748218571a000f4240185b1247122e68747470733a2f2f646174612e676174656170692e696f2f617069322f312f7469636b65722f6366785f757364741a15841877821864646c6173748218571a000f4240185b1264123d68747470733a2f2f7777772e6d78632e636f6d2f6f70656e2f6170692f76322f6d61726b65742f7469636b65723f73796d626f6c3d4346585f555344541a23871877821861646461746182181800821867646c61737418728218571a000f4240185b125b123568747470733a2f2f6170692e626b65782e63632f76322f712f7469636b65722f70726963653f73796d626f6c3d4346585f555344541a228618778218616464617461821818008218646570726963658218571a000f4240185b1a0d0a0908051205fa3fc000001003220d0a0908051205fa3fc000001003100a186420012846308094ebdc03",
                "to": "CFXTEST:TYPE.BUILTIN:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJK7B54454",
                "value": "0x0"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call"
        },
        {
            "action": {
                "gasLeft": "0xcd8a",
                "outcome": "success",
                "returnData": "0xdccb9be50637c331c1c66ef1b0c2779f0a1893661c017c530b641dcec02010dc"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call_result"
        },
        {
            "action": {
                "gasLeft": "0x8fe9",
                "outcome": "success",
                "returnData": "0x0000000000000000000000000000000000000000000000000000000000001662"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call_result"
        },
        {
            "action": {
                "gasLeft": "0x94d5",
                "outcome": "success",
                "returnData": "0x0000000000000000000000000000000000000000000000000000000000001662"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call_result"
        },
        {
            "action": {
                "gasLeft": "0x713e",
                "outcome": "success",
                "returnData": "0x"
            },
            "blockHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochHash": "0x4c4db64db7ddaf4fd6c9d0eb5398d4c7838252ceaefdfb6b1be27aa301428369",
            "epochNumber": "0x28968d0",
            "transactionHash": "0x8437fd07e33ffaff9dc1b360cb8b0450847b15a164059b50736c65762e6629ad",
            "transactionPosition": "0x0",
            "type": "call_result"
        }
    ],
    "id": "15922956697249514502"
}
```

## 注意

1. 一个 `call` 类型的 trace，会有一个对应的 `call_result` trace. `create` 同样有 `create_result` 对应
2. `call` trace 的 `result` 有 `success`, `fail`, `revert` 三种可能
3. 判断合约方法调用是否发生 CFX 转移，只需要判断 `callType` 为 call 一种类型, 且 `value` 有值，状态为成功