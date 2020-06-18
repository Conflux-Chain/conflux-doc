---
id: send_transaction_zh_cn
title:  发送第一笔交易
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/send_transaction_zh_cn.md
keywords:
  - conflux
  - transaction
  - sdk
---

本文档将指导您撰写并发送您的第一笔交易进入Conflux网络，包括Conflux的交易技术规范介绍，以及在Conflux网络中跟踪发送交易状态和错误处理的基本技巧。

对于普通用户，建议使用Conflux Portal这样的Conflux钱包，方便、安全、易用。

对于想在自己的程序中编写和发送交易的开发者来说。Conflux为您提供了多个不同语言的SDK。

JavaScript: js-conflux-sdk

Java: java-conflux-sdk

Go: go-conflux-sdk

以下文档将以js-conflux-sdk为例。

编写并发送我的第一个事务

    在Conflux Portal上创建一个账户

      1.安装[Conflux Portal](https://github.com/Conflux-Chain/conflux-portal)

      2. 生成一个新账号

      3.从龙头处获取测试网代币

      4.导出并复制你的私钥到某个地方，我们以后会用到它

###    安装

`npm install js-conflux-sdk`

### 通过JavaScript程序发送交易

* 需要js-conflux-sdk，并设置一个Conflux提供者。对于Conflux 测试网已有一个节点提供，[http://testnet-jsonrpc.conflux-chain.org:12537](http://testnet-jsonrpc.conflux-chain.org:12537)。它也可以改成任何其他Conflux节点，甚至是你自己设置的节点。
```
const { Conflux, util } = require('js-conflux-sdk');
const cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100, // The default gas price of your following transactions
  defaultGas: 1000000, // The default gas of your following transactions
  logger: console,
});
```
* 将私钥粘贴到程序中
```javascript
const PRIVATE_KEY = 'Your Private Key';
// const PRIVATE_KEY = '0x5f15f9e52fc5ec6f77115a9f306c120a7e80d83115212d33a843bb6b7989c261';
const account = cfx.Account(PRIVATE_KEY); // create account instance
const receiver = '0xa70ddf9b9750c575db453eea6a041f4c8536785a'
```
* 交易组成部分，下面是可以填写的字段：
  * **nonce**: 可选，一个交易的声明，以保证你的交易发送顺序，从某个随机的大数开始，然后逐个增加。如果缺失，cfx_getNextNonce的结果会自动填入，它适用于一般情况。有些情况下，比如短时间内发送大量的交易。建议自行维护nonce。
  * **gasPrice**:可选，在Drip中，你希望为每一次消耗的燃料支付的价格。如果缺失，将自动填写cfx_gasPrice的结果，也就是最近交易的中位数。
  * **gas:**可选，您希望在交易中使用的最大燃料消耗。在交易处理结束后，如果 used_gas >= gas * 0.75，未使用的燃料费将被退还。如果缺失，将自动填写cfx_estimateGasAndCollateral的结果，它适用于一般场景。
  * **to**: 交易的接收方，可以是个人账户(以1开头)或合同(以8开头)。这里留一个空，可以部署一个合同。
  * **value**：要转移的价值（以drip为单位）。
  *  **storageLimit**: 可选的，你想在交易中抵押的最大存储量（以Byte为单位）。如果缺失，将自动填写cfx_estimateGasAndCollateral的结果，它适用于一般的交易场景。
  * **epochHeight**: 可选，一个交易是只能在[epochHeight - 10000, epochHeight + 10000]范围内的epochs内进行验证，所以这是一个超时机制。如果缺失，将自动填写cfx_epochNumber的结果，它适用于一般场景。
  * **data**：可选，可以是交易的附件消息，也可以是合约调用的函数签名。如果缺失，则会填入一个空值。
  *  **chain ID**：可选，用于处理硬分叉或防止交易重入攻击。如果缺失，将填入0。
  *  **from**：用于签署交易的发送者账户（含私钥）。
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
*  通过发送 `cfx.sendTransaction` ，得到返回的交易哈希值，然后可以在[Conflux Scan](http://confluxscan.io/)上搜索哈希值查看交易详情。
```javascript
async function main() {
  const txHash = await cfx.sendTransaction(txParams);
  console.log(txHash);
}
main().catch(e => console.error(e));
```
 
## 交易追溯

      交易发送后可能处于以下几种不同的状态：

### 1.立即被RPC提供者拒绝

当提供者收到 cfx_sendRawTransaction RPC 调用后，它会尝试做基本的验证并将其插入到交易池中。如果交易有明显的错误，例如：RLP解码错误，签名验证错误，它将被立即拒绝，否则，它将被插入交易池并开始等待。否则，将被插入交易池，开始等待挖矿，RPC将返回一个交易哈希。

### 2.卡在了交易池里

但是，你得到的交易哈希值并不代表它已经成功执行了。Conflux交易会尽可能多地将已验证的交易存储在池子里，即使是那些nonce与预期不符或者余额不足以支付`gas * gasPrice + value` 的交易.

所以，如果你等了1分钟，在[ConfluxScan](http://confluxscan.io/)中 仍然找不到交易，那么它很可能被卡在交易池中了。

可使用

```plain
cfx_getTransactionByHash
cfx_getBalance
cfx_getNextNonce
```
来检查你的交易是否已经准备好被打包和挖矿了。
```plain
curl -X POST --data '{"jsonrpc": "2.0", "method": "cfx_getBalance", "params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8"], "id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537
```
然后将结果与value + gas * gasPrice进行比较。
```plain
curl -X POST --data '{"jsonrpc": "2.0", "method": "cfx_getNextNonce", "params":["0xfbe45681ac6c53d5a40475f7526bac1fe7590fb8"], "id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537。
```
然后将结果与你填写的nonce进行比较。
你可以通过cfx_getTransactionByHash获取交易细节：

```plain
curl -X POST --data '{"jsonrpc": "2.0", "method": "cfx_getTransactionByHash", "params":["0x53fe995edeec7d241791ff32635244e94ecfd722c9fe90f34ddf59082d814514"], "id":1}' -H "Content-Type: application/json" http://testnet-jsonrpc.conflux-chain.org:12537。
```
在这种情况下，您可能希望在修复nonce或余额问题后发送一个新的交易。需要注意的是，用相同的nonce替换池中的交易，需要更高的gasPrice。
### 3.已挖矿但跳过

如果你可以在ConfluxScan上查看交易，但它的状态总是显示 "跳过"，这意味着它没有通过执行引擎的基本验证（比如，nonce不匹配，余额无法支付基本费用）而被跳过。

在这种情况下，你可能要在修复nonce或余额问题后发送一个新的交易。需要注意的是，用相同的nonce替换池中的交易，需要更高的gasPrice。

### 4.挖矿并执行后，出现了一些错误的结果

在这种情况下，您会在ConfluxScan上看到一个错误信息。这可能是这几个原因：

a.  EVM错误： 比如assert，require

b. 余额足以支付基本费用，但不足以支付全部交易费用。

c.  达到存储上限  

 最好在Remix IDE中仔细检查你的合约，并通过 cfx_estimateGasAndCollateral RPC检查存储极限和余额问题。

### 5.挖矿并执行，交易结果没有错误

恭喜！你的第一笔交易完成了！
