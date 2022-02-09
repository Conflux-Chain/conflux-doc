# CrossSpaceCall 内置合约

CIP-90 同时还引入了一个新内置合约 `CrossSpaceCall (0x0888000000000000000000000000000000000006)`，该内置合约位于 Core Space，即只能在 Core Space 进行调用。
通过 CrossSpaceCall 可实现 CFX 和数据 在两个 Space 互跨。

```js
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

interface CrossSpaceCall {
    event Call(bytes20 indexed sender, bytes20 indexed receiver, uint256 value, uint256 nonce, bytes data);

    event Create(bytes20 indexed sender, bytes20 indexed contract_address, uint256 value, uint256 nonce, bytes init);

    event Withdraw(bytes20 indexed sender, address indexed receiver, uint256 value, uint256 nonce);

    event Outcome(bool success);

    // Create contract in EVM Space
    function createEVM(bytes calldata init) external payable returns (bytes20);
    
    // Transfer CFX to EVM address
    function transferEVM(bytes20 to) external payable returns (bytes memory output);

    // Call EVM contract method
    function callEVM(bytes20 to, bytes calldata data) external payable returns (bytes memory output);

    function staticCallEVM(bytes20 to, bytes calldata data) external view returns (bytes memory output);

    // Widthdraw CFX from EVM Space's mapped account
    function withdrawFromMapped(uint256 value) external;

    // Query EVM Space mapped account's CFX balance
    function mappedBalance(address addr) external view returns (uint256);

    // Query EVM Space mapped account's nonce
    function mappedNonce(address addr) external view returns (uint256);
}
```

## CFX 跨 Space

### Core 跨入 eSpace

将 CFX 从 Conflux Core Space 跨到 eSpace 可以调用 `CrossSpaceCall.transferEVM(targetAddress)` 方法，通过参数指定`接受地址`并通过`交易的 value` 指定跨入的金额。

以 js-conflux-sdk(v2) 为例：

```js
const { Conflux, format, Drip, CONST } = require('js-conflux-sdk');
// Init conflux instance
const conflux = new Conflux({
  url: "https://test.confluxrpc.com",
  networkId: 1
});
// Add account private key
const account = conflux.wallet.addPrivateKey(process.env.PRIVATE_KEY);  // Replace PRIVTE_KEY with your own private key
// CrossCall
const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');

async function main() {
  // The eSpace receiver address
  const receiverAddress = "0x02e1A5817ABf2812f04c744927FC91F03099C0f4";

  const receipt = await CrossSpaceCall
    .transferEVM(receiverAddress)
    .sendTransaction({
      from: account.address,
      value: Drip.fromCFX(1),
    })
    .executed();

  console.log('Cross transfer: ', receipt.outcomeStatus === CONST.TX_STATUS.SUCCESS ? 'Success' : 'Fail');
}

main().catch(console.log);
```

只要 `CrossSpaceCall.transferEVM(targetAddress)` 方法调用成功，在 eSpace 查询 `receiverAddress` 的余额就应该可以看到变化。

### eSpace 跨回 Core Space

将 CFX 从 eSpace 跨回 Core Space 需要分成两步来完成。

1. 在 eSpace 将 CFX 转到 Core Space 接受地址的 `eSpace 映射地址`
2. 在 Core Space 使用接受地址调用 `CrossSpaceCall.withdrawFromMapped(amount)` 即可取回 CFX

使用 `js-conflux-sdk v2` 跨回 CFX 的例子：

```js
// Check above init code
async function main() {
  const receipt = await CrossSpaceCall
    .withdrawFromMapped(Drip.fromCFX(1))
    .sendTransaction({
      from: account.address,
    })
    .executed();

  console.log('Cross transfer: ', receipt.outcomeStatus === CONST.TX_STATUS.SUCCESS ? 'Success' : 'Fail');
}

main().catch(console.log);
```

以上示例主要用于演示 CFX 跨 Space 的技术实现细节，普通用户可使用 [Space Bridge Dapp](https://evm.fluentwallet.com) 直接通过钱包实现 CFX 互跨。