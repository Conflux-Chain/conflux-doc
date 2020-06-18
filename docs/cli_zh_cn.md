---
id: cli_sub_commands_zh_cn
title:  使用 Conflux 命令行工具
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/cli_zh_cn.md
keywords:
  - conflux
  - cli
  - sdk
---

Conflux CLI子命令是命令行界面的集合，使您可以与本地或远程Conflux节点进行交互。

## 管理帐户＃
`account` 子命令允许您在本地计算机上管理帐户。

### 新账户
在本地计算机上创建一个新帐户。
#### 用法
```text
$ ./conflux.exe account new --help
conflux.exe-account-new
Create a new account (and its associated key) for the given --chain (default conflux).

USAGE:
    conflux.exe account new [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --keys-iterations <NUM>    Specify the number of iterations to use when deriving key from the password (bigger is more secure). [default: 10240]
        --password <FILE>          Provide a file containing a password for unlocking an account. Leading and trailing whitespace is trimmed.
```
#### 示例
`./conflux.exe account new`

### list
列出本地计算机上的所有帐户。
#### 用法
```text
$ ./conflux.exe account list --help
conflux.exe-account-list
List existing accounts of the given --chain (default conflux).

USAGE:
    conflux.exe account list

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information
```
#### 示例
`./conflux.exe account list`

### 导入账户
从JSON UTC密钥库文件导入帐户。
#### 用法
```text
$ ./conflux.exe account import --help
conflux.exe-account-import
Import accounts from JSON UTC keystore files to the specified --chain (default conflux)

USAGE:
    conflux.exe account import --import-path <PATH>...

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --import-path <PATH>...    A list of file paths to import.
```
#### 示例
`./conflux.exe account import --import-path ./keystores`

## 公共应用程序接口
公共API允许您通过JSON-RPC协议中的HTTP连接与本地或远程Conflux节点进行交互。 所有公共API都在rpc子命令下，并使用默认的url选项访问本地计算机上的JSON-RPC API。

```text
OPTIONS:
        --url <url>    URL of RPC server [default: http://localhost:12539]
```
所有可用的命令如下：

```toml
# jsonrpc_tcp_port=12536
jsonrpc_http_port=12537
# jsonrpc_local_tcp_port=12538
jsonrpc_local_http_port=12539
```
所有可用的命令如下：
```text
$ ./conflux.exe rpc --help
conflux.exe-rpc
RPC based subcommands to query blockchain information and send transactions

USAGE:
    conflux.exe rpc [OPTIONS] <SUBCOMMAND>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --url <url>    URL of RPC server [default: http://localhost:12539]

SUBCOMMANDS:
    balance                  Get balance of specified account
    best-block-hash          Get the best block hash
    block-by-epoch           Get block by epoch
    block-by-hash            Get block by hash
    block-with-assumption    Get block by hash with pivot chain assumption
    blocks                   Get blocks of specified epoch
    call                     Executes a new message call immediately without creating a transaction
    code                     Get bytecode of specified contract
    local                    Local subcommands (requires jsonrpc_local_http_port configured)
    epoch                    Get epoch number
    estimate-gas             Executes a call request immediately without creating a transaction and returns the gas used
    help                     Prints this message or the help of the given subcommand(s)
    nonce                    Get nonce of specified account
    price                    Get recent mean gas price
    receipt                  Get receipt by transaction hash
    send                     Send a signed transaction and return its hash
    tx                       Get transaction by hash
```

### 获取账户余额＃
`./conflux.exe rpc balance --address 0xa70ddf9b9750c575db453eea6a041f4c8536785a`

### Get nonce
`./conflux.exe rpc nonce --address 0xa70ddf9b9750c575db453eea6a041f4c8536785a`

### 获取epoch数值＃
`./conflux.exe rpc epoch`

### 获取区块信息＃
- Get Best block hash: `./conflux.exe rpc best-block-hash`
- Get block by epoch: `./conflux.exe rpc block-by-epoch --epoch latest_state`
- Get block by hash: `./conflux.exe rpc block-by-epoch --hash 0xf756b4...c0a6d1`
- Get blocks in epoch: `./conflux.exe rpc blocks --epoch latest_state`

### 获取交易信息#
`./conflux.exe rpc tx --hash 0x718532fe76dbd8c4208c6c5a79588db35c0bf97e7d8a0faa5988ba66ad88b74c`

### 获取收据#
`./conflux.exe rpc receipt --hash 0x718532fe76dbd8c4208c6c5a79588db35c0bf97e7d8a0faa5988ba66ad88b74c`

### 发送已签名的交易#
发送以HEX格式编码的已签名交易。 通常，此API用于Javascript API发送编码的事务。 要使用CLI发送交易，建议使用私有API发送交易。.

`./conflux.exe rpc send --raw-bytes 0x...`

### 其他选项#
- 获取合约代码: `./conflux.exe rpc code --address 0xa70ddf9b9750c575db453eea6a041f4c8536785a`
- 获取最新的平均燃料费用: `./conflux.exe rpc price`

## 私有Apis#
"在JSON-PRC协议中，私用API允许您只通过HTTP连接与本地conflux节点进行交互。
私有API被用作用户管理本地conflux节点，并要求在default.toml配置文件中配置jsonrpc_local_http_port。
 此外，私有API还可以帮助开发人员调试，测试和监控Conflux节点的运行时。
所有私有API均在local子命令下，并使用默认的URL选项访问本地计算机上的JSON-RPCAPI。"

```text
$ ./conflux.exe rpc local --help
conflux.exe-rpc-local
Debug subcommands (requires jsonrpc_local_http_port configured)

USAGE:
    conflux.exe rpc local [OPTIONS] <SUBCOMMAND>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --url <url>    URL of RPC server [default: http://localhost:12539]

SUBCOMMANDS:
    consensus-graph-state    Get the consensus graph state
    help                     Prints this message or the help of the given subcommand(s)
    net                      Network subcommands
    send                     Send a transaction and return its hash
    sync-phase               Get the current synchronization phase
    test                     Test subcommands (used for test purpose only)
    txpool                   Transaction pool subcommands
```
### net命令
net子命令可帮助您检查P2P网络状态。

#### 示例
- List all connected P2P nodes: `./conflux.exe rpc local net session`
- List a single P2P node: `./conflux.exe rpc local net session --id <node_id>`
- Check network egress: `./conflux.exe rpc local net throttling`

### txpool命令
txpool子命令可帮助您检查交易池。

#### 示例
- List transaction pool status: `./conflux.exe rpc local txpool status`
- List transactions in details: `./conflux.exe rpc local txpool content`
- List summary of transactions: `./conflux.exe rpc local txpool inspect`
- Inspect a transaction in detail: `./conflux.exe rpc local txpool inspect-one --hash <tx_hash>`

### 同步阶段＃
获取本地冲突节点的同步阶段。

`./conflux.exe rpc local sync-phase`

### 发送交易#
将交易发送到conflux节点

#### 用法
```text
$ ./conflux.exe rpc local send --help
conflux.exe-rpc-local-send
Send a transaction and return its hash

USAGE:
    conflux.exe rpc local send [OPTIONS] --from <ADDRESS> --password <STRING> --value <HEX>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --data <HEX>           Hash of the method signature and encoded parameters
        --from <ADDRESS>       Transaction from address
        --gas <HEX>            Gas provided for transaction execution [default: 0x5208]
        --gas-price <HEX>      Transaction gas price [default: 0x2540BE400]
        --nonce <HEX>          Transaction nonce
        --password <STRING>    Used to decrypt private key of sender to sign transaction
        --to <ADDRESS>         Transaction to address (empty to create contract)
        --url <url>            URL of RPC server [default: http://localhost:12537]
        --value <HEX>          value sent with this transaction
```

#### 示例
爱丽丝将5 Drip（1 CFX = 10 ^ 18 Dirp）转移给鲍勃。 请注意，Alice的地址必须在本地计算机上，否则请首先为爱丽丝创建一个帐户。

`./conflux.exe rpc local send --from <alice_address> --to <bob_address> --value 0x5 --password 123456`

爱丽丝创建了一个gas费用为3,000,000的合约。 您可以使用Solc来编译合约以获取字节码。

`./conflux.exe rpc local send --from <alice_address> --value 0x0 --gas 0x‭2DC6C0‬ --data <HEX_contract_bytecodes> --password 123456`